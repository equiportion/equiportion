import PaymentInformation from './PaymentInformation';

/**
 * A matrix user. Can be either the current logged in user or any member of any joined room.
 */
class User {
  private userId: string;

  private displayname?: string;
  private avatarUrl?: string;
  private paymentInformations?: PaymentInformation[];

  /**
   * Creates a new User using the given parameters.
   * @param userId the user's userId, required
   * @param displayname the user's displayname, optional
   * @param avatarUrl the user's avatarUrl, optional
   */
  constructor(userId: string, displayname?: string, avatarUrl?: string) {
    this.userId = userId;
    this.displayname = displayname;
    this.avatarUrl = avatarUrl;
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
   * @returns the payment informations as an array if set, else undefined
   */
  public getPaymentInformations(): PaymentInformation[] | undefined {
    return this.paymentInformations;
  }

  public setPaymentInformations(paymentInformations: PaymentInformation[]): void {
    this.paymentInformations = paymentInformations;
  }

  /**
   * Updates this user's payment information using a payment information event from a room.
   * @param event the event to parse
   */
  public parsePaymentInformationEvent(event: any): void {
    //TODO: implement in #85
  }

  /**
   * Updates this user's data using a member event from a room.
   * @param event
   */
  public parseMemberEvent(event: any): void {
    //TODO: implement in #85
  }
}

export default User;
