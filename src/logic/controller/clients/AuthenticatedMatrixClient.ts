import cookieNames from '@/logic/constants/cookieNames';
import {getCookie} from '@/logic/utils/cookies';
import MatrixClient from '@/logic/controller/clients/MatrixClient';
import Room from '@/logic/models/Room';
import {ref, type Ref} from 'vue';
import User from '@/logic/models/User';
import InvalidHomeserverUrlError from './InvalidHomeserverUrlError';
import type MatrixEvent from '../events/MatrixEvent';

class AuthenticatedMatrixClient extends MatrixClient {
  private accessToken?: string;
  private nextBatch?: string;

  private rooms: Ref<{[key: string]: Room}> = ref({});
  private oldestRoom: Ref<Room | undefined> = ref();
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
    this.loggedInUser.value = new User(userInfo.user_id, this);

    await this.sync();
  }

  public async sync() {
    const data = {
      since: this.nextBatch ?? '',
    };

    const response = await this.getRequest('/_matrix/client/v3/sync', data);
    this.nextBatch = response?.data.next_batch;
    
    if (response?.data.rooms != undefined && response?.data.rooms.join != undefined) {
      const joinedRooms = response?.data.rooms.join;
      for (const roomId in joinedRooms) {
        if (this.rooms.value[roomId]) {
          this.rooms.value[roomId].update(joinedRooms[roomId]);
        } else {
          this.rooms.value[roomId] = new Room(roomId, joinedRooms[roomId]);
        }
      }
    }

    this.updateOldestRoom();

    await this.loggedInUser.value?.update(this);
    await this.loggedInUser.value?.retrievePaymentInformations(this);
  }

  public async publishEvent(event: MatrixEvent) {
    const response = await this.putRequest(event.getPutUrl(), event.getContent());
    return response;
  }

  private updateOldestRoom() {
    let maxAge, oldestRoom;

    for (const roomId in this.rooms.value) {
      const room = this.rooms.value[roomId];

      if (maxAge === undefined) {
        maxAge = room.getAge();
        oldestRoom = room;
        continue;
      }

      if (room.getAge() > maxAge) {
        maxAge = room.getAge();
        oldestRoom = room;
      }
    }

    this.oldestRoom.value = oldestRoom;
  }

  public getRooms() {
    return this.rooms;
  }

  public getOldestRoom() {
    return this.oldestRoom;
  }

  public getLoggedInUser() {
    return this.loggedInUser;
  }
}

export default AuthenticatedMatrixClient;
