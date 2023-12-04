import eventTypes from '@/logic/constants/eventTypes';
import MessageEvent from './MessageEvent';

/**
 * A transaction event modelled after this project's documentation.
 */
class TransactionEvent extends MessageEvent {
  /**
   * Creates a new TransactionEvent
   * @param roomId the roomId of the room this event is published to
   * @param purpose the description of the transaction
   * @param sum the total amount spent
   * @param creditor the userId of the creditor
   * @param debtors the debtors as an array, each debtor containing their userId and the amount they owe
   * @param eventId the eventId. Should be set if this event is received from matrix.
   */
  constructor(
    roomId: string,
    purpose: string,
    sum: number,
    creditor: string,
    debtors: {user: string; amount: number}[],
    eventId?: string
  ) {
    const content = {
      purpose: purpose,
      sum: sum,
      creditor: creditor,
      debtors: debtors,
    };

    super(roomId, eventTypes.transaction, content, eventId);
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
