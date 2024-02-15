import MatrixClient from '@/logic/clients/MatrixClient';
import MatrixError from '@/logic/clients/MatrixError';
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

    return await this.authenticateAtHomeserver(data);
  }

  /**
   * Sends a login request to the matrix API using token login.
   * @param {string} token the token the user entered
   * @returns {Promise<Boolean>} a promise that resolves to true when the login request is successful, false otherwise
   */
  public async tokenLogin(token: string): Promise<Boolean> {
    const data = {
      type: 'm.login.token',
      token: token,
    };

    return await this.authenticateAtHomeserver(data);
  }

  /**
   * Sends a login request to the matrix API using token login.
   * @param data the authentication data to send to the homeserver
   * @returns {Promise<Boolean>} a promise that resolves to true when the login request is successful, false otherwise
   */
  private async authenticateAtHomeserver(data: {
    type: string;
    token?: string;
    identifier?: any;
  }): Promise<Boolean> {
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

  /**
   * Redirects the user to the SSO login page of the homeserver.
   */
  public redirectToSsoLogin(): void {
    const hrefCleaned = window.location.href.split('?')[0];
    window.location.href = `${this.getHomeserverUrl()}${apiEndpoints.ssoRedirect}?redirectUrl=${hrefCleaned}`;
  }
}

export default LoginMatrixClient;
