import cookieNames from '@/logic/constants/cookieNames';
import {getCookie} from '@/logic/utils/cookies';
import {MatrixClient} from '@/logic/controller/MatrixClient';

class AuthenticatedMatrixClient extends MatrixClient {
  private accessToken?: string;

  constructor() {
    super();
    this.accessToken = this.getAccessToken();
    this.axiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + this.accessToken;
  }

  public async isValid(): Promise<boolean> {
    if (!(await super.isHomeserverUrlValid())) {
      return false;
    }

    //TODO: check if access token valid

    return this.accessToken != undefined;
  }

  private getAccessToken() {
    return getCookie(cookieNames.accessToken);
  }
}

export {AuthenticatedMatrixClient};
