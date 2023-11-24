import MatrixError from '@/logic/controller/MatrixError';
import {AuthenticatedMatrixClient} from '@/logic/controller/clients/AuthenticatedMatrixClient';
import PaymentInformationEvent from '../controller/events/PaymentInformationEvent';
import PaymentInformation from './PaymentInformation';
import IbanPaymentInformation from './IbanPaymentInformation';
import PayPalPaymentInformation from './PayPalPaymentInformation';

class User {
  protected userId: string;

  protected displayname?: string;
  protected avatarUrl?: string;
  protected paymentInformations?: PaymentInformation[];

  constructor(
    userId: string,
    displayname?: string,
    avatarUrl?: string,
    paymentInformations?: PaymentInformation[]
  ) {
    this.userId = userId;
    this.displayname = displayname;
    this.avatarUrl = avatarUrl;
    this.paymentInformations = paymentInformations;
  }

  private async retrievePaymentInformations(authenticatedMatrixClient: AuthenticatedMatrixClient) {
    // const oldestRoom = authenticatedMatrixClient.getOldestRoom().value;
    // if (!oldestRoom) {
    //   return;
    // }
    // try {
    //   const response = await authenticatedMatrixClient.getRequest(
    //     PaymentInformationEvent.getGetUrl(oldestRoom.getRoomId(), this.userId)
    //   );
    //   const paymentInformations: PaymentInformation[] = [];
    //   for (const index in response?.data) {
    //     const paymentInformation = User.createPaymentInformation(response.data[index]);
    //     if (paymentInformation) {
    //       paymentInformations.push(paymentInformation);
    //     }
    //   }
    //   this.paymentInformations = paymentInformations;
    // } catch (error) {
    //   if (error instanceof MatrixError) {
    //     if (error.getErrcode() === 'M_NOT_FOUND') {
    //       //No payment information provided
    //     } else {
    //       //Something unexpected happened
    //       error.log();
    //     }
    //   } else {
    //     console.error(error);
    //   }
    // }
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
    // if (!this.paymentInformations) {
    //   return;
    // }
    // const rooms = authenticatedMatrixClient.getJoinedRooms().value;
    // try {
    //   for (const roomId in rooms) {
    //     const paymentInformationEvent = new PaymentInformationEvent(
    //       roomId,
    //       this.userId,
    //       this.paymentInformations
    //     );
    //     await authenticatedMatrixClient.publishEvent(paymentInformationEvent);
    //   }
    // } catch (error) {
    //   console.error(error);
    // }
  }

  public getDisplayname() {
    return this.displayname;
  }

  public setDisplayname(displayname: string) {
    this.displayname = displayname;
  }

  public getUserId() {
    return this.userId;
  }

  public getAvatarUrl() {
    return this.avatarUrl;
  }

  public setAvatarUrl(avatarUrl: string) {
    this.avatarUrl = avatarUrl;
  }

  public getPaymentInformations() {
    return this.paymentInformations;
  }

  public setPaymentInformations(paymentInformations: PaymentInformation[]) {
    this.paymentInformations = paymentInformations;
  }
}

export default User;
