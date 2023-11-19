import cookieNames from '@/logic/constants/cookieNames';
import {getCookie, setCookie} from '@/logic/utils/cookies';
import MatrixClient from '@/logic/controller/MatrixClient';
import MatrixError from '@/logic/controller/MatrixError';
import router from '@/router';

class AuthenticatedMatrixClient extends MatrixClient {
  private accessToken?: string;

  private rooms = {};

  constructor() {
    super();
    this.accessToken = getCookie(cookieNames.accessToken);
    this.axiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + this.accessToken;
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

    //TODO: should push to 'welcome'
    router.push({name: 'login'});
  }

  public async sync() {
    try {
      const data = {
        full_state: true,
      };

      const response = await this.getRequest('/_matrix/client/v3/sync', data);
      return response!.data.rooms.join;
    } catch (error) {
      if (error instanceof MatrixError) {
        error.log();
      } else {
        console.error(error);
      }
    }

    return {};
  }
}

export default AuthenticatedMatrixClient;
