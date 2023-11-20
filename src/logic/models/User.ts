import MatrixError from '@/logic/controller/MatrixError';
import type AuthenticatedMatrixClient from '@/logic/controller/clients/AuthenticatedMatrixClient';

class User {
  private displayname?: string;
  private userId?: string;
  private avatarUrl?: string;
  private paymentInformation?: Map<string, string>;

  constructor(
    userId: string,
    authenticatedMatrixClient: AuthenticatedMatrixClient,
    paymentInformation?: Map<string, string>
  ) {
    this.userId = userId;
    this.paymentInformation = paymentInformation;
    this.update(authenticatedMatrixClient);
  }

  public async update(authenticatedMatrixClient: AuthenticatedMatrixClient) {
    try {
      const response = await authenticatedMatrixClient.getRequest(
        '/_matrix/client/v3/profile/' + this.userId
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

  public getDisplayname() {
    return this.displayname;
  }
  public getUserId() {
    return this.userId;
  }
  public getAvatarUrl() {
    return this.avatarUrl;
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
