import axios, {AxiosError, type AxiosInstance} from 'axios';
import MatrixError from '@/logic/models-old/clients/MatrixError';
import {getCookie} from '@/logic/utils/cookies';
import cookieNames from '@/logic/constants/cookieNames';
import InvalidHomeserverUrlError from '@/logic/models-old/clients/InvalidHomeserverUrlError';

class MatrixClient {
  private homeserverUrl?: string;
  protected axiosInstance: AxiosInstance;

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
      if (!(error instanceof InvalidHomeserverUrlError)) {
        console.error(error);
      }
      return false;
    }
  }

  public async postRequest(url: string, data?: any) {
    try {
      const response = await this.axiosInstance.post(url, data);
      return response;
    } catch (error) {
      this.handleRequestError(error);
    }
  }

  public async getRequest(url: string, data?: any) {
    try {
      const response = await this.axiosInstance.get(url, data);
      return response;
    } catch (error) {
      this.handleRequestError(error);
    }
  }

  public async putRequest(url: string, data?: any) {
    try {
      const response = await this.axiosInstance.put(url, data);
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
}

export default MatrixClient;
