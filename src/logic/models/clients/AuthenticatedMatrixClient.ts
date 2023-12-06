import cookieNames from '@/logic/constants/cookieNames';
import {getCookie} from '@/logic/utils/cookies';
import MatrixClient from '@/logic/models-old/clients/MatrixClient';
import Room from '@/logic/models-old/Room';
import {ref, type Ref} from 'vue';
import User from '@/logic/models-old/User';
import InvalidHomeserverUrlError from './InvalidHomeserverUrlError';
import type MatrixEvent from '@/logic/models-old/events/MatrixEvent';
import MatrixError from './MatrixError';
import PaymentInformationEvent from '@/logic/models-old/events/PaymentInformationEvent';
import apiEndpoints from '@/logic/constants/apiEndpoints';
import eventTypes from '@/logic/constants/eventTypes';
import {useLoggedInUserStore} from '@/stores/loggedInUser';
import {useClientStateStore} from '@/stores/clientState';

/**
 * A client that can be used to get data from the logged in matrix user. Uses the singleton pattern.
 */
class AuthenticatedMatrixClient extends MatrixClient {
  private static client: AuthenticatedMatrixClient;

  private accessToken?: string;
  private nextBatch?: string;

  /**
   * Private constructor for the singleton pattern. Should only be called from createClient().
   */
  private constructor() {
    super();
    this.accessToken = getCookie(cookieNames.accessToken);

    //Set authorization header to enable this client to make authenticated requests
    this.axiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + this.accessToken;
  }

  public static getClient(): AuthenticatedMatrixClient {
    return AuthenticatedMatrixClient.client;
  }

  /**
   * Tries to create a new client instance and checks if it is valid. If not, the client instance is set to undefined.
   */
  public static async createClient(): Promise<void> {
    if (AuthenticatedMatrixClient.client) {
      return;
    }

    const clientStateStore = useClientStateStore();
    clientStateStore.created = false;

    AuthenticatedMatrixClient.client = new AuthenticatedMatrixClient();
    await AuthenticatedMatrixClient.client.initiate();

    clientStateStore.created = true;
  }

  /**
   * Checks if this client has valid authentication data and if so, initiates and syncs it.
   */
  private async initiate(): Promise<void> {
    const loggedInUserStore = useLoggedInUserStore();
    if (!(await super.isHomeserverUrlValid())) {
      throw new InvalidHomeserverUrlError();
    }

    const response = await this.getRequest(apiEndpoints.whoami);
    if (!response?.data.user_id) {
      //TODO: Fehler
    } else {
      loggedInUserStore.userId = response.data.user_id;
    }

    useClientStateStore().numberOfSyncs = 0;
    this.sync();

    setInterval(() => {
      this.sync();
    }, 20 * 1000);
  }

  /**
   * Updates the clients data using the matrix sync-API-endpoint. Updates the rooms the logged in user has joined and all members of those rooms.
   */
  public async sync(): Promise<void> {
    const clientStateStore = useClientStateStore();
    if (clientStateStore.syncing) {
      //A sync is already in progress.
      return;
    }
    clientStateStore.syncing = true;

    // const data = {
    //   since: this.nextBatch ?? '',
    // };

    // const response = await this.getRequest(apiEndpoints.sync, data);

    // //Save the next_batch token in order to tell the homeserver what the previous sync state was when syncing again
    // this.nextBatch = response.data.next_batch;

    // const joinedRoomsData = response.data.rooms?.join;

    // if (joinedRoomsData && Object.keys(joinedRoomsData).length > 0) {
    //   //User has joined rooms, update them
    //   for (const roomId in joinedRoomsData) {
    //     const room = this.joinedRooms.value[roomId];

    //     if (room) {
    //       room.update(joinedRoomsData[roomId], this);
    //     } else {
    //       this.joinedRooms.value[roomId] = new Room(roomId, joinedRoomsData[roomId], this);
    //     }
    //   }
    // }

    Promise.all([this.updateLoggedInUser()]).then((values) => {
      clientStateStore.numberOfSyncs++;
      clientStateStore.syncing = false;
    });
  }

  /**
   * Updates the logged in user using the dedicated matrix API endpoint.
   * Only to be used if there are no joined rooms the user can be updated from.
   */
  private async updateLoggedInUser(): Promise<void> {
    const loggedInUserStore = useLoggedInUserStore();

    const response = await this.getRequest(apiEndpoints.profile(loggedInUserStore.userId));

    const displayname = response?.data.displayname;
    const avatarUrl = response?.data.avatar_url;

    loggedInUserStore.displayname = displayname;
    loggedInUserStore.avatarUrl = avatarUrl;
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
