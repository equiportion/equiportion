/** Constants */
import cookieNames from '@/logic/constants/cookieNames';
import apiEndpoints from '@/logic/constants/apiEndpoints';

/** Models */
import MatrixClient from '@/logic/clients/MatrixClient';
import Room from '@/logic/models/Room';
import User from '@/logic/models/User';

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
import getFilterJson from '@/logic/utils/filter';

/**
 * A client that can be used to get data from the logged in matrix user. Uses the singleton pattern.
 * @author Clara Gießibl
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

    await Promise.all([this.updateLoggedInUser(), this.updateRooms()]).then(() => {
      clientStateStore.numberOfSyncs++;

      // restart long poll, but after a second to prevent too many requests when long polling is unsupported
      setTimeout(() => {
        this.sync();
      }, 1000);
    });
  }

  /**
   * Updates the joined (and invited) rooms using the matrix sync-API-endpoint.
   * @returns {Promise<void>} a promise that resolves when the rooms have been updated
   */
  private async updateRooms(): Promise<void> {
    const clientStateStore = useClientStateStore();

    const filter = getFilterJson();

    const data: {since?: string; timeout: number; filter: string} = {
      timeout: 10000,
      filter: JSON.stringify(filter),
    };
    if (this.nextBatch) {
      data.since = this.nextBatch;
    }

    // Send a request to the homeserver to get the latest events (and do error handling)
    const response = await this.getRequest(apiEndpoints.sync, data);

    clientStateStore.syncing = true;

    if (!response) {
      throw new Error('No response from homeserver');
    } else if (response.status !== 200) {
      throw new MatrixError(response);
    }

    // Save the next_batch token in order to tell the homeserver what the previous sync state was when syncing again
    this.nextBatch = response.data.next_batch;

    const roomsStore = useRoomsStore();
    const joinedRooms = roomsStore.joinedRooms;
    const invitedRooms = roomsStore.invitedRooms;

    const joinedRoomsData = response.data.rooms?.join;
    const invitedRoomsData = response.data.rooms?.invite;

    if (joinedRoomsData && Object.keys(joinedRoomsData).length > 0) {
      for (const roomId in joinedRoomsData) {
        // if the room is also in the invited rooms, remove it from there
        if (invitedRooms[roomId]) {
          delete invitedRooms[roomId];
        }

        // Create a new room if it doesn't exist yet
        if (!joinedRooms[roomId]) {
          joinedRooms[roomId] = new Room(roomId);
        }

        joinedRooms[roomId].sync(joinedRoomsData[roomId]);
      }
    }

    if (invitedRoomsData && Object.keys(invitedRoomsData).length > 0) {
      for (const roomId in invitedRoomsData) {
        // Create a new room if it doesn't exist yet
        if (!invitedRooms[roomId]) {
          invitedRooms[roomId] = new Room(roomId);
        }

        invitedRooms[roomId].sync(invitedRoomsData[roomId]);
      }
    }

    clientStateStore.syncing = false;
  }

  /**
   * Updates the logged in user using the dedicated matrix API endpoint.
   * Only to be used if there are no joined rooms the user can be updated from.
   * @returns {Promise<void>} a promise that resolves when the user has been updated
   */
  private async updateLoggedInUser(): Promise<void> {
    const clientStateStore = useClientStateStore();
    clientStateStore.syncing = true;

    const loggedInUser = useLoggedInUserStore().user;

    const response = await this.getRequest(apiEndpoints.profile(loggedInUser.getUserId()));

    const displayname = response?.data.displayname;
    const avatarUrl = response?.data.avatar_url;

    loggedInUser.setDisplayname(displayname);
    loggedInUser.setAvatarUrl(avatarUrl);

    clientStateStore.syncing = false;
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
      users_default: 10,
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

  /**
   * Joins a room with the given roomId.
   * @param {string} roomId the roomId of the room to join
   * @returns {Promise<boolean>} a promise that resolves to true if the room has been joined, false if not
   */
  public async joinRoom(roomId: string): Promise<boolean> {
    const response = await this.postRequest(apiEndpoints.roomJoin(roomId));

    if (response?.status === 200) {
      // remove the room from the invited rooms
      const invitedRooms = useRoomsStore().invitedRooms;
      delete invitedRooms[roomId];

      return true;
    }

    return false;
  }

  /**
   * Leaves a room with the given roomId.
   * @param {string} roomId the roomId of the room to leave
   * @returns {Promise<boolean>} a promise that resolves to true if the room has been left, false if not
   */
  public async leaveRoom(roomId: string): Promise<boolean> {
    const response = await this.postRequest(apiEndpoints.roomLeave(roomId));

    if (response?.status === 200) {
      // remove the room from the joined and invited rooms
      const joinedRooms = useRoomsStore().joinedRooms;
      const invitedRooms = useRoomsStore().invitedRooms;
      delete joinedRooms[roomId];
      delete invitedRooms[roomId];

      return true;
    }

    return false;
  }

  /**
   * Performs a search in the homeservers user directory.
   * @param searchString the string to search for
   * @param [limit=10] the maximum number of users to return
   * @returns {Promise<User[]>} a promise that resolves to an array of users that match the search string
   */
  public async searchUsers(searchString: string, limit: number = 10): Promise<User[]> {
    const response = await this.postRequest(apiEndpoints.userDirectorySearch, {
      search_term: searchString,
      limit: limit,
    });

    if (!response) {
      throw new Error('No response from homeserver');
    } else if (response.status !== 200) {
      throw new MatrixError(response);
    }

    const users: User[] = [];
    if (!response.data.results) {
      return [];
    }
    for (const user of response.data.results) {
      users.push(new User(user.user_id, user.display_name, user.avatar_url));
    }

    return users;
  }

  /**
   * Uploads a file to the homeserver and returns the content uri.
   * @param file the file to upload
   * @returns {Promise<string>} a promise that resolves to the content uri of the uploaded file
   */
  public async uploadFile(file: File): Promise<string> {
    const response = await this.postRequest(apiEndpoints.uploadFile, file, {
      headers: {
        'Content-Type': file.type,
      },
    });

    if (!response) {
      throw new Error('No response from homeserver');
    } else if (response.status !== 200) {
      throw new MatrixError(response);
    }

    return response.data.content_uri;
  }
}

export default AuthenticatedMatrixClient;
