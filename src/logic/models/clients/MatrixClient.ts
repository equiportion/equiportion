import axios, {AxiosError, type AxiosInstance, type AxiosResponse} from 'axios';
import MatrixError from '@/logic/models/clients/MatrixError';
import {getCookie} from '@/logic/utils/cookies';
import cookieNames from '@/logic/constants/cookieNames';
import InvalidHomeserverUrlError from '@/logic/models/clients/InvalidHomeserverUrlError';

/**
 * A client that can make requests to a matrix homeserver.
 */
class MatrixClient {
  private homeserverUrl?: string;
  protected axiosInstance: AxiosInstance;

  /**
   * Creates a new client.
   * @param [homeserverUrl] the url of the matrix homeserver (optional, default: the homeserver url stored in cookies)
   */
  constructor(homeserverUrl?: string) {
    if (homeserverUrl != undefined) {
      this.homeserverUrl = homeserverUrl;
    } else {
      this.homeserverUrl = getCookie(cookieNames.homeserverUrl);
    }

    this.axiosInstance = axios.create({
      baseURL: this.homeserverUrl,
    });
  }

  /**
   * Gets the homeserver url of this client if set.
   * @returns {string | undefined} the url if set, undefined otherwise
   */
  public getHomeserverUrl(): string | undefined {
    return this.homeserverUrl;
  }

  /**
   * Checks if the homeserver url of this client corresponds to a valid matrix homeserver.
   * @returns {Promise<boolean>} a promise that resolves to true if the url is valid, false otherwise
   */
  public async isHomeserverUrlValid(): Promise<boolean> {
    if (!this.homeserverUrl) {
      return false;
    }

    try {
      await this.getRequest('/_matrix/client/versions');
      return true;
    } catch (error) {
      if (!(error instanceof InvalidHomeserverUrlError)) {
        console.error(error);
      }
      return false;
    }
  }

  /**
   * Sends a post request to the matrix homeserver.
   * @param url the endpoint to send the request to
   * @param data the data to send with the request
   * @returns {Promise<AxiosResponse | undefined>} a promise that resolves to the HTTP response or undefined if the request failed
   */
  public async postRequest(url: string, data?: any): Promise<AxiosResponse | undefined> {
    try {
      const response = await this.axiosInstance.post(url, data);
      return response;
    } catch (error) {
      this.handleRequestError(error);
    }
  }

  /**
   * Sends a get request to the matrix homeserver.
   * @param url the endpoint to send the request to
   * @param data the data to send with the request
   * @returns {Promise<AxiosResponse | undefined>} a promise that resolves to the HTTP response or undefined if the request failed
   */
  public async getRequest(url: string, data?: any): Promise<AxiosResponse | undefined> {
    try {
      const response = await this.axiosInstance.get(url, data);
      return response;
    } catch (error) {
      this.handleRequestError(error);
    }
  }

  /**
   * Sends a put request to the matrix homeserver.
   * @param url the endpoint to send the request to
   * @param data the data to send with the request
   * @returns {Promise<AxiosResponse | undefined>} a promise that resolves to the HTTP response or undefined if the request failed
   */
  public async putRequest(url: string, data?: any): Promise<AxiosResponse | undefined> {
    try {
      const response = await this.axiosInstance.put(url, data);
      return response;
    } catch (error) {
      this.handleRequestError(error);
    }
  }

  /**
   * Checks what kind of error occured during a request and throws a new corresponding error.
   * @param error the error that occured
   */
  private handleRequestError(error: any) {
    if (error instanceof AxiosError) {
      if (error.response?.data) {
        //The request was made and the server responded with a status code != 2xx,
        // meaning it was a standard error response by the matrix server
        throw new MatrixError(error.response);
      } else if (error.request) {
        //The request was made but no response was received,
        // meaning a invalid homeserverUrl was provided
        throw new InvalidHomeserverUrlError(error.request);
      } else {
        throw error;
      }
    } else {
      throw error;
    }
  }
}

export default MatrixClient;
