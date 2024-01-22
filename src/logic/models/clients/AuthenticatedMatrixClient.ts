/** Constants */
import cookieNames from '@/logic/constants/cookieNames';
import apiEndpoints from '@/logic/constants/apiEndpoints';

/** Models */
import MatrixClient from '@/logic/models/clients/MatrixClient';
import Room from '@/logic/models/Room';

/** Events */
import TransactionEvent from '@/logic/models/events/custom/TransactionEvent';
import EquiPortionSettingsEvent from '@/logic/models/events/custom/EquiPortionSetttingsEvent';

/** Errors */
import InvalidHomeserverUrlError from './InvalidHomeserverUrlError';
import MatrixError from './MatrixError';

/** Stores */
import {useLoggedInUserStore} from '@/stores/loggedInUser';
import {useClientStateStore} from '@/stores/clientState';
import {useRoomsStore} from '@/stores/rooms';

/** Utils */
import {getCookie} from '@/logic/utils/cookies';

/**
 * A client that can be used to get data from the logged in matrix user. Uses the singleton pattern.
 * @author Jakob Gießibl
 * @author Philipp Stappert
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

  /**
   * Gets the singleton instance of this class.
   * @returns {AuthenticatedMatrixClient} the singleton instance
   */
  public static getClient(): AuthenticatedMatrixClient {
    return AuthenticatedMatrixClient.client;
  }

  /**
   * Tries to create a new client instance and checks if it is valid. If not, the client instance is set to undefined.
   * @returns {Promise<void>} a promise that resolves when the client has been created
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
   * @returns {Promise<void>} a promise that resolves when the client has been initiated
   */
  private async initiate(): Promise<void> {
    const loggedInUser = useLoggedInUserStore().user;
    if (!(await super.isHomeserverUrlValid())) {
      throw new InvalidHomeserverUrlError();
    }

    const response = await this.getRequest(apiEndpoints.whoami);
    const userId = response?.data.user_id;
    if (!userId) {
      //TODO: Error
    } else {
      loggedInUser.setUserId(userId as string);
      useClientStateStore().deviceId = response?.data.device_id;
    }

    useClientStateStore().numberOfSyncs = 0;
    this.sync();

    setInterval(() => {
      this.sync();
    }, 20 * 1000);
  }

  /**
   * Updates the clients data using the matrix sync-API-endpoint.
   * Updates the rooms the logged in user has joined and all members of those rooms.
   * @returns {Promise<void>} a promise that resolves when the client has been synced
   */
  public async sync(): Promise<void> {
    const clientStateStore = useClientStateStore();
    if (clientStateStore.syncing) {
      //A sync is already in progress.
      return;
    }

    clientStateStore.syncing = true;
    await Promise.all([this.updateLoggedInUser(), this.updateJoinedRooms()]).then(() => {
      clientStateStore.numberOfSyncs++;
      clientStateStore.syncing = false;
    });
  }

  /**
   * Updates the joined rooms using the matrix sync-API-endpoint.
   * @returns {Promise<void>} a promise that resolves when the rooms have been updated
   */
  private async updateJoinedRooms(): Promise<void> {
    let data: undefined | {since: string} = undefined;
    if (this.nextBatch) {
      data = {
        since: this.nextBatch,
      };
    }

    // Send a request to the homeserver to get the latest events (and do error handling)
    const response = await this.getRequest(apiEndpoints.sync, data);
    if (!response) {
      throw new Error('No response from homeserver');
    } else if (response.status !== 200) {
      throw new MatrixError(response);
    }

    // Save the next_batch token in order to tell the homeserver what the previous sync state was when syncing again
    this.nextBatch = response.data.next_batch;

    const roomsStore = useRoomsStore();
    const rooms = roomsStore.rooms;

    const joinedRoomsData = response.data.rooms?.join;
    if (joinedRoomsData && Object.keys(joinedRoomsData).length > 0) {
      for (const roomId in joinedRoomsData) {
        // Create a new room if it doesn't exist yet
        if (!rooms[roomId]) {
          rooms[roomId] = new Room(roomId);
        }

        rooms[roomId].sync(joinedRoomsData[roomId]);
      }
    }
  }

  /**
   * Updates the logged in user using the dedicated matrix API endpoint.
   * Only to be used if there are no joined rooms the user can be updated from.
   * @returns {Promise<void>} a promise that resolves when the user has been updated
   */
  private async updateLoggedInUser(): Promise<void> {
    const loggedInUser = useLoggedInUserStore().user;

    const response = await this.getRequest(apiEndpoints.profile(loggedInUser.getUserId()));

    const displayname = response?.data.displayname;
    const avatarUrl = response?.data.avatar_url;

    loggedInUser.setDisplayname(displayname);
    loggedInUser.setAvatarUrl(avatarUrl);
  }

  /**
   * Creates a new room with the given name.
   * Always creates the room as EquiPortion room (sends the specific state event to view the room as EquiPortion room).
   * Also, the PowerLevels for the EquiPortion specific events are set.
   *
   * @param {string} name the name of the room to create
   *
   * @returns {Promise<boolean>} a promise that resolves when the room has been created, resolves to true if the room has been created, false if not
   */
  public async createRoom(name: string): Promise<boolean> {
    const powerLevelContentOverride: {[key: string]: any} = {
      events: {},
      invite: 20,
      users_defalt: 10,
    };
    powerLevelContentOverride.events[TransactionEvent.TYPE] = 10;
    powerLevelContentOverride.events[EquiPortionSettingsEvent.TYPE] = 80;

    const settingsEvent = new EquiPortionSettingsEvent('', '', true);

    const data = {
      creation_content: {},
      initial_state: [
        {
          type: settingsEvent.getType(),
          state_key: settingsEvent.getStateKey(),
          content: settingsEvent.toEventContent(),
        },
      ],
      name: name,
      power_level_content_override: powerLevelContentOverride,
      preset: 'private_chat',
    };

    const response = await this.postRequest(apiEndpoints.roomCreate, data);

    return response?.status === 200;
  }
}

export default AuthenticatedMatrixClient;
