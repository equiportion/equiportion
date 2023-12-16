import MatrixClient from '@/logic/models/clients/MatrixClient';
import MatrixError from '@/logic/models/clients/MatrixError';
import {setCookie} from '@/logic/utils/cookies';
import cookieNames from '@/logic/constants/cookieNames';
import apiEndpoints from '@/logic/constants/apiEndpoints';

/**
 * A client that makes login requests to a matrix homeserver.
 */
class LoginMatrixClient extends MatrixClient {

  /**
   * Sends a login request to the matrix API using password login.
   * @param {string} userId the userId of the user trying to log in or the localpart of the userId
   * @param {string} password the password the user entered
   * @returns {Promise<Boolean>} a promise that resolves to true when the login request is successful, false otherwise
   */
  public async passwordLogin(userId: string, password: string): Promise<Boolean> {
    const data = {
      type: 'm.login.password',
      identifier: {
        type: 'm.id.user',
        user: userId,
      },
      password: password,
    };

    try {
      const response = await this.postRequest(apiEndpoints.login, data);

      if (!response?.data.access_token) {
        return false;
      }

      setCookie(cookieNames.accessToken, response.data.access_token, response.data.expires_in_ms);
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
}

export default LoginMatrixClient;
