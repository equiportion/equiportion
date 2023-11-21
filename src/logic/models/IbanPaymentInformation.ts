import PaymentInformation from './PaymentInformation';

class IbanPaymentInformation extends PaymentInformation {
  public static type = 'iban';

  constructor(iban: string) {
    super(IbanPaymentInformation.type, {iban: iban});
  }

  protected getInformationJson() {
    return {iban: this.information.iban};
  }

  protected isValid(): boolean {
    //TODO: implement IBAN check
    return true;
  }

  public static fromJson(information: any) {
    return new IbanPaymentInformation(information.iban);
  }

  public getIban() {
    return this.information.iban;
  }

  public getInformationValue() {
    return this.getIban();
  }
}

export default IbanPaymentInformation;
