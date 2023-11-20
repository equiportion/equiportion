import MatrixError from '@/logic/controller/MatrixError';
import type AuthenticatedMatrixClient from '@/logic/controller/clients/AuthenticatedMatrixClient';

class User {
  private name?: string;
  private matrixId?: string;
  private profilePictureURL?: string;
  private paymentInformation?: Map<string, string>;

  constructor(
    matrixId: string,
    authenticatedMatrixClient: AuthenticatedMatrixClient,
    paymentInformation?: Map<string, string>
  ) {
    this.matrixId = matrixId;
    this.paymentInformation = paymentInformation;
    this.update(authenticatedMatrixClient);
  }

  public async update(authenticatedMatrixClient: AuthenticatedMatrixClient) {
    try {
      const response = await authenticatedMatrixClient.getRequest(
        '/_matrix/client/v3/profile/' + this.matrixId
      );

      this.name = response?.data.displayname;
      this.profilePictureURL = response?.data.avatar_url;
    } catch (error) {
      if (error instanceof MatrixError) {
        error.log();
      } else {
        console.error(error);
      }
    }
  }

  public getName() {
    return this.name;
  }
  public getMatrixId() {
    return this.matrixId;
  }
  public getProfilePictureUrl() {
    return this.profilePictureURL;
  }
  public getPaymentInformation(provider: string) {
    if (this.paymentInformation?.has(provider)) {
      return this.paymentInformation.get(provider)!;
    } else {
      return '';
    }
  }
}

export default User;
