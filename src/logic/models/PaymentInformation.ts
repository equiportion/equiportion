abstract class PaymentInformation {
  private type: string;
  protected information: any;

  constructor(type: string, information: any) {
    this.type = type;
    this.information = information;

    if (!this.isValid()) {
      throw new InvalidPaymentInformationError();
    }
  }

  public toJson() {
    return {
      type: this.type,
      information: this.information,
    };
  }

  protected abstract isValid(): boolean;
}

export default PaymentInformation;
