import IbanPaymentInformation from './IbanPaymentInformation';
import PayPalPaymentInformation from './PayPalPaymentInformation';
import PaymentInformation from './PaymentInformation';

class User {
  protected userId: string;

  protected displayname?: string;
  protected avatarUrl?: string;
  protected paymentInformations?: PaymentInformation[];

  constructor(userId: string, displayname?: string, avatarUrl?: string) {
    this.userId = userId;
    this.displayname = displayname;
    this.avatarUrl = avatarUrl;

    this.paymentInformations = [
      new IbanPaymentInformation('Iban deiner Mutter'),
      new PayPalPaymentInformation('lol@nice.com'),
    ];
  }

  public getUserId() {
    return this.userId;
  }

  public getDisplayname() {
    return this.displayname;
  }

  public setDisplayname(displayname: string) {
    this.displayname = displayname;
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
