import MatrixError from '@/logic/controller/MatrixError';
import type AuthenticatedMatrixClient from '@/logic/controller/clients/AuthenticatedMatrixClient';
import PaymentInformationEvent from '../controller/events/PaymentInformationEvent';
import PaymentInformation from './PaymentInformation';
import IbanPaymentInformation from './IbanPaymentInformation';
import PayPalPaymentInformation from './PayPalPaymentInformation';

class User {
  private userId: string;

  private displayname?: string;
  private avatarUrl?: string;
  private paymentInformations?: PaymentInformation[];

  constructor(userId: string, authenticatedMatrixClient: AuthenticatedMatrixClient) {
    this.userId = userId;
    this.update(authenticatedMatrixClient);
  }

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

  public async retrievePaymentInformations(authenticatedMatrixClient: AuthenticatedMatrixClient) {
    const oldestRoom = authenticatedMatrixClient.getOldestRoom().value;
    if (!oldestRoom) {
      return;
    }

    try {
      const response = await authenticatedMatrixClient.getRequest(
        PaymentInformationEvent.getGetUrl(oldestRoom.getRoomId(), this.userId)
      );

      const paymentInformations: PaymentInformation[] = [];
      for (const index in response?.data) {
        const paymentInformation = User.createPaymentInformation(response.data[index]);
        if (paymentInformation) {
          paymentInformations.push(paymentInformation);
        }
      }

      this.paymentInformations = paymentInformations;
    } catch (error) {
      if (error instanceof MatrixError) {
        if (error.getErrcode() === 'M_NOT_FOUND') {
          //No payment information provided
        } else {
          //Something unexpected happened
          error.log();
        }
      } else {
        console.error(error);
      }
    }
  }

  private static createPaymentInformation(data: any) {
    switch (data.type) {
      case IbanPaymentInformation.type:
        return IbanPaymentInformation.fromJson(data.information);
      case PayPalPaymentInformation.type:
        return PayPalPaymentInformation.fromJson(data.information);
      default:
        console.error('Error: Unknown Payment Information Type');
        return undefined;
    }
  }

  private async publishPaymentInformations(authenticatedMatrixClient: AuthenticatedMatrixClient) {
    if (!this.paymentInformations) {
      return;
    }

    const rooms = authenticatedMatrixClient.getRooms().value;

    try {
      for (const roomId in rooms) {
        const paymentInformationEvent = new PaymentInformationEvent(
          roomId,
          this.userId,
          this.paymentInformations
        );
        await authenticatedMatrixClient.publishEvent(paymentInformationEvent);
      }
    } catch (error) {
      console.error(error);
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

  public getPaymentInformations() {
    return this.paymentInformations;
  }

  public async setPaymentInformations(
    paymentInformations: PaymentInformation[],
    authenticatedMatrixClient: AuthenticatedMatrixClient
  ) {
    this.paymentInformations = paymentInformations;
    await this.publishPaymentInformations(authenticatedMatrixClient);
  }
}

export default User;
