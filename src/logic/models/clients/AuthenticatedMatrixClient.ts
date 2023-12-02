import cookieNames from '@/logic/constants/cookieNames';
import {getCookie} from '@/logic/utils/cookies';
import MatrixClient from '@/logic/models/clients/MatrixClient';
import Room from '@/logic/models/Room';
import {ref, type Ref} from 'vue';
import User from '@/logic/models/User';
import InvalidHomeserverUrlError from './InvalidHomeserverUrlError';
import type MatrixEvent from '../events/MatrixEvent';
import MatrixError from './MatrixError';
import PaymentInformationEvent from '../events/PaymentInformationEvent';
import apiEndpoints from '@/logic/constants/apiEndpoints';
import eventTypes from '@/logic/constants/eventTypes';
import TransactionEvent from '@/logic/models/events/TransactionEvent';
/**
 * A client that can be used to get data from the logged in matrix user. Uses the singleton pattern.
 */
class AuthenticatedMatrixClient extends MatrixClient {
  private static client?: AuthenticatedMatrixClient;

  private accessToken?: string;
  private nextBatch?: string;

  private users: Ref<{[userId: string]: User}> = ref({});
  private loggedInUserId: Ref<string> = ref('');
  private joinedRooms: Ref<{[roomId: string]: Room}> = ref({});

  /**
   * Private constructor for the singleton pattern. Should only be called from createClient().
   */
  private constructor() {
    super();
    this.accessToken = getCookie(cookieNames.accessToken);

    //Set authorization header to enable this client to make authenticated requests
    this.axiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + this.accessToken;
  }

  /**
   * Getter for the initiated authenticated matrix client instance. Creates a new one if it is undefined.
   * Should only be called from composable useAuthenticatedMatrixClient.
   * @returns the client instance
   */
  public static async getClient() {
    if (!AuthenticatedMatrixClient.client) {
      await AuthenticatedMatrixClient.createClient();
    }

    return AuthenticatedMatrixClient.client;
  }

  /**
   * Tries to create a new client instance and checks if it is valid. If not, the client instance is set to undefined.
   */
  private static async createClient(): Promise<void> {
    AuthenticatedMatrixClient.client = new AuthenticatedMatrixClient();

    try {
      await AuthenticatedMatrixClient.client.initiate();
    } catch (error) {
      if (error instanceof InvalidHomeserverUrlError) {
        error.log();
      } else if (error instanceof MatrixError) {
        error.log();
      } else {
        console.error(error);
      }

      //client can't authenticate, reset it to undefined
      AuthenticatedMatrixClient.client = undefined;

      //TODO: check for soft logout etc.
    }
  }

  /**
   * Checks if this client has valid authentication data and if so, initiates and syncs it.
   */
  private async initiate(): Promise<void> {
    if (!(await super.isHomeserverUrlValid())) {
      throw new InvalidHomeserverUrlError();
    }

    const response = await this.getRequest(apiEndpoints.whoami);
    if (!response) {
      return;
    }

    this.loggedInUserId = ref(response.data.user_id);
    if (!this.loggedInUserId) {
      return;
    }

    await this.sync();
  }

  /**
   * Updates the clients data using the matrix sync-API-endpoint. Updates the rooms the logged in user has joined and all members of those rooms.
   */
  public async sync(): Promise<void> {
    const data = {
      since: this.nextBatch ?? '',
    };

    const response = await this.getRequest(apiEndpoints.sync, data);
    if (!response) {
      return;
    }

    //Save the next_batch token in order to tell the homeserver what the previous sync state was when syncing again
    this.nextBatch = response.data.next_batch;

    const joinedRoomsData = response.data.rooms?.join;

    if (joinedRoomsData && Object.keys(joinedRoomsData).length > 0) {
      //User has joined rooms, update them
      for (const roomId in joinedRoomsData) {
        const room = this.joinedRooms.value[roomId];

        if (room) {
          room.update(joinedRoomsData[roomId], this);
        } else {
          this.joinedRooms.value[roomId] = new Room(roomId, joinedRoomsData[roomId], this);
        }
      }
    } else {
      //No joined rooms, need to update user separately
      await this.updateLoggedInUser();
    }
  }

  /**
   * Updates the logged in user using the dedicated matrix API endpoint.
   * Only to be used if there are no joined rooms the user can be updated from.
   */
  private async updateLoggedInUser(): Promise<void> {
    const response = await this.getRequest(apiEndpoints.profile(this.loggedInUserId.value));

    const displayname = response?.data.displayname;
    const avatarUrl = response?.data.avatar_url;

    const loggedInUser = this.getLoggedInUser();

    if (loggedInUser) {
      loggedInUser.setDisplayname(displayname);
      loggedInUser.setAvatarUrl(avatarUrl);
    } else {
      this.users.value[this.loggedInUserId.value] = new User(
        this.loggedInUserId.value,
        displayname,
        avatarUrl
      );
    }
  }

  /**
   * Publishes the logged in user's payment information to every joined room.
   */
  public async publishPaymentInformations(): Promise<void> {
    const loggedInUser = this.getLoggedInUser();
    if (!loggedInUser) {
      return;
    }

    const paymentInformations = loggedInUser.getPaymentInformations();
    if (!paymentInformations) {
      return;
    }

    try {
      for (const roomId in this.joinedRooms.value) {
        const paymentInformationEvent = new PaymentInformationEvent(
          roomId,
          this.loggedInUserId.value,
          paymentInformations
        );
        await this.publishEvent(paymentInformationEvent);
      }
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Publishes an event to the matrix homeserver.
   * @param event the event to publish
   * @returns the HTTP response
   */
  public async publishEvent(event: MatrixEvent) {
    const response = await this.putRequest(event.getPutUrl(), event.getContent());
    return response;
  }

  /**
   * Gets the logged in user.
   * @returns the logged in user
   */
  public getLoggedInUser(): User {
    return this.getUser(this.loggedInUserId.value);
  }

  /**
   * Gets all rooms the logged in user has joined.
   * @returns the rooms
   */
  public getJoinedRooms(): {[roomId: string]: Room} {
    return this.joinedRooms.value;
  }

  /**
   * Gets a specific room the logged in user has joined.
   * @param roomId the roomId of the room to get
   * @returns the room
   */
  public getRoom(roomId: string): Room {
    return this.joinedRooms.value[roomId];
  }

  /**
   * Gets a specific user that is a member of a room the logged in user has joined.
   * @param userId the userId of the user to get
   * @returns
   */
  public getUser(userId: string): User {
    return this.users.value[userId];
  }

  /**
   * Updates a user using a room's state event.
   * @param userId the userId of the user to update
   * @param event the state event to update the user with
   */
  public updateUserFromStateEvent(userId: string, event: any) {
    if (!this.getUser(userId)) {
      this.users.value[userId] = new User(userId);
    }

    const user = this.getUser(userId);
    switch (event.type) {
      case eventTypes.paymentInformation:
        user.parsePaymentInformationEvent(event);
        break;
      case eventTypes.roomMember:
        user.parseMemberEvent(event);
        break;
      default:
        break;
    }
  }
}

export default AuthenticatedMatrixClient;
