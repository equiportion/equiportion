import MatrixError from '../controller/MatrixError';
import type {AuthenticatedMatrixClient} from '../controller/clients/AuthenticatedMatrixClient';
import User from './User';

class LoggedInUser extends User {
  public async update(authenticatedMatrixClient: AuthenticatedMatrixClient) {
    try {
      const response = await authenticatedMatrixClient.getRequest(
        `/_matrix/client/v3/profile/${this.userId}`
      );

      this.displayname = response?.data.displayname;
      this.avatarUrl = response?.data.avatar_url;
    } catch (error) {
      if (error instanceof MatrixError) {
        error.log();
      } else {
        console.error(error);
      }
    }
  }
}

export default LoggedInUser;
