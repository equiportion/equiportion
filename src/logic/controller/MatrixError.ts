import type {AxiosResponse} from 'axios';

class MatrixError extends Error {
  private errcode: string;
  private error: string;

  constructor(response: AxiosResponse) {
    super();
    this.errcode = response.data.errcode;
    this.error = response.data.error;
  }

  public log() {
    console.error(this.errcode + ': ' + this.error);
  }
}

export default MatrixError;
