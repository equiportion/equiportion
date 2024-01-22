import axios, {AxiosError, type AxiosInstance, type AxiosResponse} from 'axios';
import MatrixError from '@/logic/models/clients/MatrixError';
import {getCookie} from '@/logic/utils/cookies';
import cookieNames from '@/logic/constants/cookieNames';
import InvalidHomeserverUrlError from '@/logic/models/clients/InvalidHomeserverUrlError';
import {type AxiosRequestConfig} from 'axios';

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
  public constructor(homeserverUrl?: string) {
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
      const response = await this.getRequest('/_matrix/client/versions');

      // validate response status
      if (response?.status !== 200) {
        console.log('nicht valid');
        return false;
      }

      // check that data is json and contains versions key
      const data = response.data;
      if (!data || !data.versions) {
        return false;
      }

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
   * @returns {Promise<AxiosResponse | undefined>} a promise that resolves to the HTTP response or undefined if the request failed
   */
  public async getRequest(
    url: string,
    data?: {[key: string]: string | number},
    axiosRequestConfig?: AxiosRequestConfig
  ): Promise<AxiosResponse | undefined> {
    if (data) {
      url += '?';
      for (const key of Object.keys(data)) {
        url += `${key}=${data[key]}&`;
      }
    }

    try {
      const response = await this.axiosInstance.get(url, axiosRequestConfig);
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

  /**
   * Returns the homeserver-url given by the WellKnwon of the server.
   * @param {string} homeserverName the name of the homeserver where to look for the WellKnwon
   * @returns {Promise<string| false>} the url of the homeserver specified by the homeserverName or false if the WellKnown wasn't found
   */
  public static async getHomeserverUrlFromWellKnown(
    homeserverName: string
  ): Promise<string | false> {
    const axiosInstance = axios.create({
      baseURL: 'https://' + homeserverName,
    });
    let response;
    try {
      response = await axiosInstance.get('.well-known/matrix/client');
    } catch (error) {
      return false;
    }
    if (!response.data.homeserver.baseURL) {
      return false;
    }
    console.log(response);
    return response.data.homeserver.baseURL;
  }
}

export default MatrixClient;
