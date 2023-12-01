import MessageEvent from './MessageEvent';

//TODO: doc

class TransactionEvent extends MessageEvent {
  constructor(
    roomId: string,
    type: string,
    purpose: string,
    sum: number,
    creditor: string,
    debtors: {user: string; amount: number}[]
  ) {
    const content = {
      purpose: purpose,
      sum: sum,
      creditor: creditor,
      debtors: debtors,
    };

    super(roomId, type, content);
  }

  /**
   * Parses a transaction event received from the Matrix API as a json object to a new TransactionEvent object
   * @param json the json object from the
   * @returns the TransactionEvent
   */
  public static fromJson(json: any): TransactionEvent {
    const debtors: {user: string; amount: number}[] = [];
    for (const debtorJson of json.debtors) {
      debtors.push({user: debtorJson.user, amount: debtorJson.amount});
    }
    return new TransactionEvent(
      json.roomId,
      json.type,
      json.purpose,
      json.sum,
      json.creditor,
      debtors
    );
  }

  /**
   * Get's this TransactionEvent's purpose.
   * @returns the purpose
   */
  public getPurpose(): string {
    return this.content.purpose;
  }

  /**
   * Get's this TransactionEvent's sum.
   * @returns the sum
   */
  public getSum(): number {
    return this.content.sum;
  }

  /**
   * Get's this TransactionEvent's creditor.
   * @returns the userId of the creditor
   */
  public getCreditor(): string {
    return this.content.creditor;
  }

  /**
   * Get's this TransactionEvent's debtors.
   * @returns an array of debtors each containing a userId and the amount they owe
   */
  public getDebtors(): [{user: string; amount: number}] {
    return this.content.debtors;
  }
}

export default TransactionEvent;
