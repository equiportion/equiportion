import axios, {AxiosError, type AxiosInstance} from 'axios';
import {MatrixError} from '@/logic/controller/MatrixError';

class MatrixClient {
  private axiosInstance: AxiosInstance;

  constructor(baseUrl: string) {
    this.axiosInstance = axios.create({
      baseURL: baseUrl,
    });
  }

  public async postRequest(url: string, data?: Object) {
    try {
      await this.axiosInstance.post(url, data);
    } catch (error) {
      this.handleRequestError(error);
    }
  }

  public async getRequest(url: string, data?: Object) {
    try {
      await this.axiosInstance.get(url, data);
    } catch (error) {
      this.handleRequestError(error);
    }
  }

  private handleRequestError(error: any) {
    if (error instanceof AxiosError) {
      if (error.response) {
        //The request was made and the server responded with a status code != 2xx,
        //meaning it was a standard error response by the matrix server
        throw new MatrixError(error.response);
      }
    }
  }
}

export {MatrixClient};
