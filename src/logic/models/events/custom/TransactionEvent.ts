import StateEvent from '../StateEvent';
import MatrixEvent from '../MatrixEvent';
import type {RawMatrixEvent} from '../RawMatrixEvent';
import {useClientStateStore} from '@/stores/clientState';
import {useLoggedInUserStore} from '@/stores/loggedInUser';
import Room from '@/logic/models/Room';

/**
 * A transaction event modelled after this project's documentation.
 * @author Jakob Gießibl
 * @author Philipp Stappert
 * @author Jörn Mihatsch
 */
class TransactionEvent extends StateEvent {
  public static TYPE = 'edu.kit.kastel.dsn.pse.transaction';
  public static REL_TYPE = 'edu.kit.kastel.dsn.pse.latest_transaction';

  private purpose: string;
  private sum: number;
  private creditor: string;
  private debtors: {userId: string; amount: number}[];
  private balances: {[userIds: string]: number};
  private latestEventId: string | undefined;
  private transactionValid: boolean | undefined = undefined;

  /**
   * Creates a new TransactionEvent
   * @param {string} eventId the eventId of this event (optional, only to be set if this event was received from the matrix api)
   * @param {string} roomId the roomId of the room this event is published to
   * @param {string} purpose the description of the transaction
   * @param {number} sum the total amount spent
   * @param {string} creditor the userId of the creditor
   * @param {{userId: string; amount: number}[]} debtors the debtors as an array, each debtor containing their userId and the amount they owe
   * @param {[userIds: string]: number} balances the balances as a map of two concatenated userIds and an integer representing the balance (see documentation)
   * @param {string} stateKey the state key of this event
   * @param {string} [latestEventId] the eventId of the latest transaction event that was sent by this client and was the starting point for calculating the new balances (optional, only to be set if this event didn't start with balances of 0)
   */
  constructor(
    eventId: string,
    roomId: string,

    purpose: string,
    sum: number,
    creditor: string,
    debtors: {userId: string; amount: number}[],
    balances: {[userIds: string]: number},
    stateKey: string,
    latestEventId?: string
  ) {
    super(eventId, roomId, stateKey);

    this.purpose = purpose;
    this.sum = sum;
    this.creditor = creditor;
    this.debtors = debtors;
    this.balances = balances;
    this.latestEventId = latestEventId;
  }

  /**
   * creates a new transaction that considers the previous transaction balance when calculating the new balances
   * @param {Room} room the Room to send the transaction in
   * @param {string} purpose the purpose of the transaction
   * @param {number} sum the total sum of the transaction
   * @param {string} creditor the userId of the creditor
   * @param {{userId: string; amount: number}[]} debtors all debtors with their amount
   */
  public static newTransaction(
    room: Room,
    purpose: string,
    sum: number,
    creditor: string,
    debtors: {userId: string; amount: number}[]
  ): TransactionEvent {
    const events: TransactionEvent[] = room.getEventsWithStateEvents(
      this.TYPE
    ) as TransactionEvent[];

    // get device id
    const deviceId = useClientStateStore().deviceId;

    // get user id
    const userId = useLoggedInUserStore().user.getUserId();

    // create state key
    const stateKey = `${deviceId}${userId}`;

    // get clients newest transaction event
    const clientsNewestTransactionEvents: TransactionEvent[] = events.filter(
      (event: TransactionEvent) => event.stateKey == stateKey
    );
    const clientsNewestTransactionEvent: TransactionEvent | undefined =
      clientsNewestTransactionEvents[clientsNewestTransactionEvents.length - 1] ?? undefined;

    // clone the old balance values into a local variable
    const newBalances: {[userIds: string]: number} = JSON.parse(
      JSON.stringify(clientsNewestTransactionEvent?.getBalances() ?? {})
    );

    // edit old balances to include data from latest transaction event
    debtors.forEach((debtor) => {
      if (debtor.userId == creditor) return;

      const userIdList: string[] = [debtor.userId, creditor].sort();
      const orderChangeIndicator: boolean = userIdList[0] == creditor;
      const balanceKey: string = userIdList.join('');
      const balanceValue: number = newBalances[balanceKey] ?? 0;
      newBalances[balanceKey] = balanceValue + debtor.amount * (-1) ** Number(orderChangeIndicator);
    });

    const newTransactionevent: TransactionEvent = new TransactionEvent(
      MatrixEvent.EVENT_ID_NEW,
      room.getRoomId(),
      purpose,
      sum,
      creditor,
      debtors,
      newBalances,
      stateKey,
      clientsNewestTransactionEvent?.getEventId()
    );

    return newTransactionevent;
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
      debtors,
      event.content.balances,
      event.state_key!,
      event.content['m.relates_to']?.event_id ?? undefined
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

    const eventContent: any = {
      purpose: this.purpose,
      sum: this.sum,
      creditor: this.creditor,
      debtors: debtors,
      balances: this.balances,
    };

    if (this.latestEventId) {
      eventContent['m.relates_to'] = {
        rel_type: TransactionEvent.REL_TYPE,
        event_id: this.latestEventId,
      };
    }

    return eventContent;
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

  /**
   * returns the balance between users after this transaction
   * @returns {{[userIds: string]: number}} an map of two cancantenated userids in alphabetical order to an integer represention the balance between the two users
   */
  public getBalances(): {[userIds: string]: number} {
    return this.balances;
  }

  /**
   * Gets the eventId of the latest transaction event that was sent by this client and was the starting point for calculating the new balances.
   * @returns {string|undefined} the eventId of the latest transaction event that was sent by this client and was the starting point for calculating the new balances
   */
  public getLatestEventId(): string | undefined {
    return this.latestEventId;
  }

  /**
   * Gets whether this transaction is valid.
   * @returns {boolean|undefined} true if this transaction is valid, false otherwise
   */
  public isValid(): boolean | undefined {
    return this.transactionValid;
  }

  /**
   * Sets whether this transaction is valid.
   * @param {boolean} valid true if this transaction is valid, false otherwise
   * @returns {void}
   */
  public setValid(valid: boolean): void {
    this.transactionValid = valid;
  }
}

export default TransactionEvent;
