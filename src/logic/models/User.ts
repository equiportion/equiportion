import IbanPaymentInformation from './payment-information/IbanPaymentInformation';
import PayPalPaymentInformation from './payment-information/PayPalPaymentInformation';
import PaymentInformation from './payment-information/PaymentInformation';

/**
 * A matrix user. Can be either the current logged in user or any member of any joined room.
 */
class User {
  private userId: string;

  private displayname?: string;
  private avatarUrl?: string;
  private paymentInformations: PaymentInformation[] = [];

  /**
   * Creates a new user using the given parameters.
   * @param userId the user's userId, required
   * @param displayname the user's displayname, optional
   * @param avatarUrl the user's avatar url, optional
   * @param paymentInformations the user's payment informations, optional
   */
  constructor(
    userId: string,
    displayname?: string,
    avatarUrl?: string,
    paymentInformations?: PaymentInformation[]
  ) {
    this.userId = userId;
    this.displayname = displayname;
    this.avatarUrl = avatarUrl;

    if (paymentInformations) {
      this.paymentInformations = paymentInformations;
    }
  }

  /**
   * Gets this user's userId.
   * @returns the userId
   */
  public getUserId(): string {
    return this.userId;
  }

  /**
   * Gets this user's displayname.
   * @returns the displayname if set, else undefined
   */
  public getDisplayname(): string | undefined {
    return this.displayname;
  }

  /**
   * Sets this user's displayname.
   * @param displayname the new displayname
   */
  public setDisplayname(displayname: string): void {
    this.displayname = displayname;
  }

  /**
   * Gets this user's avatarUrl.
   * @returns the displayname if set, else undefined
   */
  public getAvatarUrl(): string | undefined {
    return this.avatarUrl;
  }

  /**
   * Sets this user's avatarUrl.
   * @param displayname the new avatarUrl
   */
  public setAvatarUrl(avatarUrl: string): void {
    this.avatarUrl = avatarUrl;
  }

  /**
   * Gets this user's payment informations.
   * @returns the payment informations as an array
   */
  public getPaymentInformations(): PaymentInformation[] {
    return this.paymentInformations;
  }

  /**
   * Sets this user's payment informations.
   * @param paymentInformations the new payment informations as an array
   */
  public setPaymentInformations(paymentInformations: PaymentInformation[]): void {
    this.paymentInformations = paymentInformations;
  }

  /**
   * Updates this user's payment information using a payment information event from a room.
   * @param event the event to parse
   */
  public parsePaymentInformationEvent(event: any): void {
    const paymentInformations = [];
    const paymentInformationsJson = event.content;

    for (const index in paymentInformationsJson) {
      const paymentInformationJson = paymentInformationsJson[index];
      switch (paymentInformationJson.type) {
        case IbanPaymentInformation.type:
          paymentInformations.push(
            IbanPaymentInformation.fromJson(paymentInformationJson.information)
          );
          break;
        case PayPalPaymentInformation.type:
          paymentInformations.push(
            PayPalPaymentInformation.fromJson(paymentInformationJson.information)
          );
          break;
        default:
          break;
      }
    }

    this.setPaymentInformations(paymentInformations);
  }

  /**
   * Updates this user's data using a member event from a room.
   * @param event
   */
  public parseMemberEvent(event: any): void {
    this.setAvatarUrl(event.content.avatar_url);
    this.setDisplayname(event.content.displayname);
  }
}

export default User;
