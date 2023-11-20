import cookieNames from '@/logic/constants/cookieNames';
import {getCookie, setCookie} from '@/logic/utils/cookies';
import MatrixClient from '@/logic/controller/clients/MatrixClient';
import router from '@/router';
import Room from '@/logic/models/Room';
import {ref, type Ref} from 'vue';
import User from '@/logic/models/User';
import InvalidHomeserverUrlError from './InvalidHomeserverUrlError';

class AuthenticatedMatrixClient extends MatrixClient {
  private accessToken?: string;
  private nextBatch?: string;

  private rooms: Ref<{[key: string]: Room}> = ref({});
  private loggedInUser: Ref<User | undefined> = ref();

  constructor() {
    super();
    this.accessToken = getCookie(cookieNames.accessToken);
    this.axiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + this.accessToken;
  }

  public async initiate() {
    if (!(await super.isHomeserverUrlValid())) {
      throw new InvalidHomeserverUrlError();
    }

    const response = await this.getRequest('/_matrix/client/v3/account/whoami');
    const userInfo = response?.data;
    const loggedInUser = new User(userInfo.user_id, this);
    this.loggedInUser.value = loggedInUser;

    await this.sync();
  }

  public logout() {
    this.accessToken = '';
    setCookie(cookieNames.accessToken, '');

    router.push({name: 'landing-page'});
  }

  public async sync() {
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
  }

  public getRooms() {
    return this.rooms;
  }

  public getLoggedInUser() {
    return this.loggedInUser;
  }
}

export default AuthenticatedMatrixClient;
