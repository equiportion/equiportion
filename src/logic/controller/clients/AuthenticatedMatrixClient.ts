import cookieNames from '@/logic/constants/cookieNames';
import {getCookie, setCookie} from '@/logic/utils/cookies';
import MatrixClient from '@/logic/controller/clients/MatrixClient';
import MatrixError from '@/logic/controller/MatrixError';
import router from '@/router';
import InitialSyncFilter from '../filters/InitialSyncFilter';
import Room from '@/logic/models/Room';
import {ref, type Ref} from 'vue';

class AuthenticatedMatrixClient extends MatrixClient {
  private accessToken?: string;
  private nextBatch?: string;

  //TODO: make rooms reactive
  private rooms: Ref<{[key: string]: Room}>;

  constructor() {
    super();
    this.accessToken = getCookie(cookieNames.accessToken);
    this.axiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + this.accessToken;
    this.rooms = ref({});
  }

  public async isValid(): Promise<boolean> {
    if (!(await super.isHomeserverUrlValid()) || !this.accessToken) {
      return false;
    }

    try {
      await this.getRequest('/_matrix/client/v3/account/whoami');
      return true;
    } catch (error) {
      if (error instanceof MatrixError) {
        error.log();
      } else {
        console.error(error);
      }
      return false;
    }
  }

  public logout() {
    this.accessToken = '';
    setCookie(cookieNames.accessToken, '');

    router.push({name: 'landing-page'});
  }

  public async sync() {
    try {
      const data = {
        since: this.nextBatch ?? '',
      };

      const response = await this.getRequest('/_matrix/client/v3/sync', data);
      this.nextBatch = response?.data.next_batch;

      const joinedRooms = response?.data.rooms.join;
      for (const roomId in joinedRooms) {
        if (this.rooms.value[roomId]) {
          this.rooms.value[roomId].update(joinedRooms[roomId]);
        } else {
          this.rooms.value[roomId] = new Room(roomId, joinedRooms[roomId]);
        }
      }
    } catch (error) {
      if (error instanceof MatrixError) {
        error.log();
      } else {
        console.error(error);
      }
    }
  }

  public getRooms() {
    return this.rooms;
  }
}

export default AuthenticatedMatrixClient;
