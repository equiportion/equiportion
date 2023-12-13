import MessageEvent from '../MessageEvent';
import MatrixEvent from '../MatrixEvent';
import type {RawMatrixEvent} from '../RawMatrixEvent';
import {useRoomsStore} from '@/stores/rooms';

/**
 * A transaction event modelled after this project's documentation.
 * @author Jakob Gießibel
 * @author Philipp Stappert
 */
class TransactionEvent extends MessageEvent {
  public static TYPE = 'edu.kit.kastel.dsn.pse.transaction';

  private purpose: string;
  private sum: number;
  private creditor: string;
  private debtors: {user: string; amount: number}[];

  /**
   * Creates a new TransactionEvent
   * @param eventId the eventId of this event (optional, only to be set if this event was received from the matrix api)
   * @param roomId the roomId of the room this event is published to
   * @param purpose the description of the transaction
   * @param sum the total amount spent
   * @param creditor the userId of the creditor
   * @param debtors the debtors as an array, each debtor containing their userId and the amount they owe
   */
  constructor(
    eventId: string,
    roomId: string,

    purpose: string,
    sum: number,
    creditor: string,
    debtors: {user: string; amount: number}[]
  ) {
    super(eventId, roomId);

    this.purpose = purpose;
    this.sum = sum;
    this.creditor = creditor;
    this.debtors = debtors;
  }

  /**
   * Tries to parse the given event into a TransactionEvent.
   * @static
   * @param {RawMatrixEvent} event the event to parse
   * @param {string} [roomId] the roomId of the room this event is published to
   * @returns {MatrixEvent|undefined} either the parsed event or undefined if the event could not be parsed (type mismatch)
   */
  public static fromEvent(event: RawMatrixEvent, roomId?: string): MatrixEvent | undefined {
    console.log('Transaction from Event');
    if (event.type !== this.TYPE) {
      return undefined;
    }

    const debtors: {user: string; amount: number}[] = [];
    for (const debtor of event.content.debtors) {
      debtors.push({user: debtor.user, amount: parseFloat(debtor.amount)});
    }

    return new TransactionEvent(
      event.event_id,
      roomId ?? event.room_id,
      event.content.purpose,
      event.content.sum,
      event.content.creditor,
      debtors
    );
  }

  /**
   * Executes this event on its room.
   * @returns {void}
   */
  public execute(): void {
    return;
  }

  /**
   * Gets the content of this event as a Json object (for matrix api).
   * @returns {any} the content of this event
   */
  public toEventContent(): any {
    const debtors = [];
    for (const debtor of this.debtors) {
      debtors.push({
        user: debtor.user,
        amount: debtor.amount.toString(),
      });
    }

    return {
      purpose: this.purpose,
      sum: this.sum.toString(),
      creditor: this.creditor,
      debtors: debtors,
    };
  }

  /**
   * Gets the type of this event (matrix event type)
   * @returns {string} the type of this event
   */
  public getType(): string {
    return TransactionEvent.TYPE;
  }

  /**
   * Gets this TransactionEvent's purpose.
   * @returns the purpose
   */
  public getPurpose(): string {
    return this.purpose;
  }

  /**
   * Gets this TransactionEvent's sum.
   * @returns the sum
   */
  public getSum(): number {
    return this.sum;
  }

  /**
   * Gets this TransactionEvent's creditor.
   * @returns the userId of the creditor
   */
  public getCreditor(): string {
    return this.creditor;
  }

  /**
   * Gets this TransactionEvent's debtors.
   * @returns an array of debtors each containing a userId and the amount they owe
   */
  public getDebtors(): {user: string; amount: number}[] {
    return this.debtors;
  }
}

export default TransactionEvent;
