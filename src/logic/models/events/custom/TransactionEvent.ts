import StateEvent from '../StateEvent';
import MatrixEvent from '../MatrixEvent';
import type {RawMatrixEvent} from '../RawMatrixEvent';
import {useClientStateStore} from '@/stores/clientState';
import {useLoggedInUserStore} from '@/stores/loggedInUser';

/**
 * A transaction event modelled after this project's documentation.
 * @author Jakob Gießibl
 * @author Philipp Stappert
 * @author Jörn Mihatsch
 */
class TransactionEvent extends StateEvent {
  public static TYPE = 'edu.kit.kastel.dsn.pse.transaction';

  private purpose: string;
  private sum: number;
  private creditor: string;
  private debtors: {userId: string; amount: number}[];

  /**
   * Creates a new TransactionEvent
   * @param {string} eventId the eventId of this event (optional, only to be set if this event was received from the matrix api)
   * @param {string} roomId the roomId of the room this event is published to
   * @param {string} purpose the description of the transaction
   * @param {number} sum the total amount spent
   * @param {string} creditor the userId of the creditor
   * @param {{userId: string; amount: number}[]} debtors the debtors as an array, each debtor containing their userId and the amount they owe
   */
  constructor(
    eventId: string,
    roomId: string,

    purpose: string,
    sum: number,
    creditor: string,
    debtors: {userId: string; amount: number}[]
  ) {
    // get device id
    const deviceId = useClientStateStore().deviceId;

    // get user id
    const userId = useLoggedInUserStore().user.getUserId();

    // create state key
    const stateKey = `${deviceId}${userId}`;

    super(eventId, roomId, stateKey);

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
    if (event.type !== this.TYPE) {
      return undefined;
    }

    const debtors: {userId: string; amount: number}[] = [];
    for (const debtor of event.content.debtors) {
      debtors.push({userId: debtor.user, amount: this.parseMoney(debtor.amount)});
    }

    return new TransactionEvent(
      event.event_id,
      roomId ?? event.room_id,
      event.content.purpose,
      this.parseMoney(event.content.sum),
      event.content.creditor,
      debtors
    );
  }

  /**
   * Function to allow both the old format (float as string) and the new format (amount in cents as number) for the sum and the debtors.
   * @param {string|number} amount the amount to parse
   * @returns {number} the parsed amount (in cents)
   */
  private static parseMoney(amount: string | number): number {
    if (typeof amount === 'string') {
      return this.floatToCents(parseFloat(amount));
    } else {
      return amount;
    }
  }

  /**
   * Converts a float (e.g. 12,34€) to cents.
   * @param {number} float the float to convert
   * @returns {number} the converted float
   */
  private static floatToCents(float: number): number {
    return Math.round(float * 100);
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
   * @returns {{}} the content of this event
   */
  public toEventContent(): {} {
    const debtors = [];
    for (const debtor of this.debtors) {
      debtors.push({
        user: debtor.userId,
        amount: debtor.amount,
      });
    }

    return {
      purpose: this.purpose,
      sum: this.sum,
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
   * @returns {string} the purpose
   */
  public getPurpose(): string {
    return this.purpose;
  }

  /**
   * Gets this TransactionEvent's sum.
   * @returns {number} the sum
   */
  public getSum(): number {
    return this.sum;
  }

  /**
   * Gets this TransactionEvent's creditor.
   * @returns {string} the userId of the creditor
   */
  public getCreditorId(): string {
    return this.creditor;
  }

  /**
   * Gets this TransactionEvent's debtors.
   * @returns {{userId: string; amount: number}[]} an array of debtors each containing a userId and the amount they owe
   */
  public getDebtorIds(): {userId: string; amount: number}[] {
    return this.debtors;
  }
}

export default TransactionEvent;
