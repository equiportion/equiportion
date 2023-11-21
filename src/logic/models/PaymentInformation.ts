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

  public getType() {
    return this.type;
  }

  public abstract getInformationValue(): string;

  protected abstract isValid(): boolean;
}

export default PaymentInformation;
