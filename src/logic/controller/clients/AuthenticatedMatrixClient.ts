import cookieNames from '@/logic/constants/cookieNames';
import {getCookie} from '@/logic/utils/cookies';
import MatrixClient from '@/logic/controller/clients/MatrixClient';
import Room from '@/logic/models/Room';
import {computed, ref, type Ref} from 'vue';
import User from '@/logic/models/User';
import InvalidHomeserverUrlError from './InvalidHomeserverUrlError';
import type MatrixEvent from '../events/MatrixEvent';
import MatrixError from '../MatrixError';
import router from '@/router';
import PaymentInformationEvent from '../events/PaymentInformationEvent';

class AuthenticatedMatrixClient extends MatrixClient {
  private static client?: AuthenticatedMatrixClient;

  private accessToken?: string;
  private nextBatch?: string;

  private users: Ref<{[userId: string]: User}> = ref({});
  private loggedInUserId?: string;
  private joinedRooms: Ref<{[roomId: string]: Room}> = ref({});

  private constructor() {
    super();
    this.accessToken = getCookie(cookieNames.accessToken);
    this.axiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + this.accessToken;
  }

  public static async getClient() {
    if (!AuthenticatedMatrixClient.client) {
      await AuthenticatedMatrixClient.createClient();
    }

    return AuthenticatedMatrixClient.client;
  }

  private static async createClient() {
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

      //client can't authenticate, try to log in
      AuthenticatedMatrixClient.client = undefined;

      //TODO: check for soft logout etc.
    }
  }

  private async initiate() {
    if (!(await super.isHomeserverUrlValid())) {
      throw new InvalidHomeserverUrlError();
    }

    const response = await this.getRequest('/_matrix/client/v3/account/whoami');
    if (!response) {
      return;
    }

    this.loggedInUserId = response.data.user_id;
    if (!this.loggedInUserId) {
      return;
    }

    await this.sync();
  }

  public async sync() {
    const data = {
      since: this.nextBatch ?? '',
    };

    const response = await this.getRequest('/_matrix/client/v3/sync', data);
    if (!response) {
      return;
    }

    this.nextBatch = response.data.next_batch;
    const joinedRooms = response.data.rooms?.join;

    if (joinedRooms) {
      for (const roomId in joinedRooms) {
        const room = this.joinedRooms.value[roomId];
        if (room) {
          room.update(joinedRooms[roomId]);
        } else {
          this.joinedRooms.value[roomId] = new Room(roomId, joinedRooms[roomId]);
        }
      }
    } else {
      this.updateLoggedInUser();
    }
  }

  private async updateLoggedInUser() {
    if (!this.loggedInUserId) {
      return;
    }

    try {
      const response = await this.getRequest(`/_matrix/client/v3/profile/${this.loggedInUserId}`);
      const displayname = response?.data.displayname;
      const avatarUrl = response?.data.avatar_url;
      const loggedInUser = this.getLoggedInUser();
      if (loggedInUser) {
        loggedInUser.setDisplayname(displayname);
        loggedInUser.setAvatarUrl(avatarUrl);
      } else {
        this.users.value[this.loggedInUserId] = new User(
          this.loggedInUserId,
          displayname,
          avatarUrl
        );
      }
    } catch (error) {
      if (error instanceof MatrixError) {
        error.log();
      } else {
        console.error(error);
      }
    }
  }

  public async publishPaymentInformations() {
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
          this.loggedInUserId!,
          paymentInformations
        );
        await this.publishEvent(paymentInformationEvent);
      }
    } catch (error) {
      console.error(error);
    }
  }

  public async publishEvent(event: MatrixEvent) {
    const response = await this.putRequest(event.getPutUrl(), event.getContent());
    return response;
  }

  public getLoggedInUser() {
    return computed(() => {
      if (!this.loggedInUserId) {
        return undefined;
      }

      return this.users.value[this.loggedInUserId];
    });
  }

  public getJoinedRooms() {
    return this.joinedRooms;
  }
}

export {AuthenticatedMatrixClient as AuthenticatedMatrixClient};
