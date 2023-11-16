import cookieNames from '@/logic/constants/cookieNames';
import {getCookie} from '@/logic/utils/cookies';
import {MatrixClient} from './MatrixClient';

class AuthenticatedMatrixClient extends MatrixClient {
  private accessToken?: string;

  constructor() {
    super();
    this.accessToken = this.getAccessToken();
  }

  private getAccessToken() {
    return getCookie(cookieNames.accessToken);
  }

  public isAuthenticated() {
    return this.accessToken != undefined;
  }
}

export {AuthenticatedMatrixClient};
