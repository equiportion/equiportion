import PaymentInformation from './PaymentInformation';

class PayPalPaymentInformation extends PaymentInformation {
  public static type = 'paypal';

  constructor(mail: string) {
    super(PayPalPaymentInformation.type, {mail: mail});
  }

  protected getInformationJson() {
    return {mail: this.information.mail};
  }

  protected isValid(): boolean {
    //TODO: implement PayPal check
    return true;
  }

  public static fromJson(information: any) {
    return new PayPalPaymentInformation(information.mail);
  }
}

export default PayPalPaymentInformation;
