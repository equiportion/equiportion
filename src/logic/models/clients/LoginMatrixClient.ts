import MatrixClient from '@/logic/models/clients/MatrixClient';
import MatrixError from '@/logic/models/clients/MatrixError';
import {setCookie} from '@/logic/utils/cookies';
import cookieNames from '@/logic/constants/cookieNames';

class LoginMatrixClient extends MatrixClient {
  public async login(username: string, password: string): Promise<Boolean> {
    const data = {
      type: 'm.login.password',
      user: username,
      password: password,
    };

    try {
      const response = await this.postRequest('/_matrix/client/v3/login', data);

      if (!response) {
        return false;
      }

      this.setAccessTokenCookie(response.data.access_token);
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

  private setAccessTokenCookie(accessToken: string) {
    if (accessToken) {
      setCookie(cookieNames.accessToken, accessToken);
    }
  }
}

export default LoginMatrixClient;
