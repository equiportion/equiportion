import axios, {AxiosError, type AxiosInstance} from 'axios';
import {MatrixError} from '@/logic/controller/MatrixError';
import {getCookie, setCookie} from '@/logic/utils/cookies';
import cookieNames from '@/logic/constants/cookieNames';
import {InvalidHomeserverUrlError} from './InvalidHomeserverUrlError';

class MatrixClient {
  private homeserverUrl?: string;
  private axiosInstance: AxiosInstance;

  constructor(homeserverUrl?: string) {
    if (homeserverUrl) {
      this.homeserverUrl = homeserverUrl;
    } else {
      this.homeserverUrl = this.getHomeserverUrlCookie();
    }

    this.axiosInstance = axios.create({
      baseURL: this.homeserverUrl,
    });
  }

  private getHomeserverUrlCookie() {
    return getCookie(cookieNames.homeserverUrl);
  }

  public setHomeserverUrlCookie() {
    if (this.homeserverUrl) {
      setCookie(cookieNames.homeserverUrl, this.homeserverUrl);
    }
  }

  public async isHomeserverUrlValid() {
    try {
      await this.getRequest('/_matrix/client/versions');
      return true;
    } catch (error) {
      return false;
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
      console.log('Error');
      this.handleRequestError(error);
    }
  }

  private handleRequestError(error: any) {
    if (error instanceof AxiosError) {
      if (error.response) {
        //The request was made and the server responded with a status code != 2xx,
        // meaning it was a standard error response by the matrix server
        throw new MatrixError(error.response);
      } else if (error.request) {
        //The request was made but no response was received,
        // meaning a invalid homeserverUrl was provided
        throw new InvalidHomeserverUrlError(error.request);
      } else {
        //console.log(error);
      }
    } else {
      //console.log(error);
    }
  }
}

export {MatrixClient};
