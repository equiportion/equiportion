import axios, {AxiosError, type AxiosInstance} from 'axios';
import {MatrixError} from '@/logic/controller/MatrixError';
import {getCookie, setCookie} from '@/logic/utils/cookies';
import cookieNames from '@/logic/constants/cookieNames';
import {InvalidHomeserverUrlError} from '@/logic/controller/InvalidHomeserverUrlError';

class MatrixClient {
  private homeserverUrl?: string;
  protected axiosInstance: AxiosInstance;

  constructor(homeserverUrl?: string) {
    if (homeserverUrl != undefined) {
      this.homeserverUrl = homeserverUrl;
    } else {
      this.homeserverUrl = MatrixClient.getHomeserverUrlCookie();
    }

    this.axiosInstance = axios.create({
      baseURL: this.homeserverUrl,
    });
  }

  public getHomeserverUrl() {
    return this.homeserverUrl;
  }

  public async isHomeserverUrlValid() {
    if (!this.homeserverUrl) {
      return false;
    }

    try {
      await this.getRequest('/_matrix/client/versions');
      return true;
    } catch (error) {
      if (error instanceof InvalidHomeserverUrlError) {
        return false;
      } else {
        console.error(error);
      }
    }
  }

  public async postRequest(url: string, data?: Object) {
    try {
      const response = await this.axiosInstance.post(url, data);
      return response;
    } catch (error) {
      this.handleRequestError(error);
    }
  }

  public async getRequest(url: string, data?: Object) {
    try {
      const response = await this.axiosInstance.get(url, data);
      return response;
    } catch (error) {
      this.handleRequestError(error);
    }
  }

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

  public static getHomeserverUrlCookie() {
    return getCookie(cookieNames.homeserverUrl);
  }

  public static setHomeserverUrlCookie(homeserverUrl: string) {
    if (homeserverUrl) {
      setCookie(cookieNames.homeserverUrl, homeserverUrl);
    }
  }
}

export {MatrixClient};
