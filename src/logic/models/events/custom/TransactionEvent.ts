import StateEvent from '../StateEvent';
import MatrixEvent from '../MatrixEvent';
import type {RawMatrixEvent} from '../RawMatrixEvent';
import {useClientStateStore} from '@/stores/clientState';
import {useLoggedInUserStore} from '@/stores/loggedInUser';
import Room from '@/logic/models/Room';
import {useRoomsStore} from '@/stores/rooms';
import {parseMoney} from '@/logic/utils/money';
import User from '@/logic/models/User';

/**
 * A transaction event modelled after this project's documentation.
 * @author Clara Gießibl
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
  private receiptUrl: string | undefined = undefined;
  private sender: User | undefined = undefined;
  private timestamp: number | undefined = undefined;

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
   * @param {string} [receipt_url] the mxc-url of the receipt (optional)
   * @param {User} [sender] the user who sent this event (optional)
   * @param {number} [timestamp] the timestamp of this event (optional)
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
    latestEventId?: string,
    receipt_url?: string,
    sender?: User,
    timestamp?: number
  ) {
    super(eventId, roomId, stateKey);

    this.purpose = purpose;
    this.sum = sum;
    this.creditor = creditor;
    this.debtors = debtors;
    this.balances = balances;
    this.latestEventId = latestEventId;
    this.receiptUrl = receipt_url;
    this.sender = sender;
    this.timestamp = timestamp;
  }

  /**
   * creates a new transaction that considers the previous transaction balance when calculating the new balances
   * @param {Room} room the Room to send the transaction in
   * @param {string} purpose the purpose of the transaction
   * @param {number} sum the total sum of the transaction
   * @param {string} creditor the userId of the creditor
   * @param {{userId: string; amount: number}[]} debtors all debtors with their amount
   * @param {string} [receipt_url] the mxc-url of the receipt (optional)
   */
  public static newTransaction(
    room: Room,
    purpose: string,
    sum: number,
    creditor: string,
    debtors: {userId: string; amount: number}[],
    receipt_url?: string
  ): TransactionEvent {
    const events: TransactionEvent[] = room.getAllEvents(this.TYPE) as TransactionEvent[];

    // get device id
    const deviceId = useClientStateStore().deviceId;

    // get user id
    const userId = useLoggedInUserStore().user.getUserId();

    // get current user
    const user = useRoomsStore().getRoom(room.getRoomId())?.getMember(userId);

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
      clientsNewestTransactionEvent?.getEventId(),
      receipt_url,
      user,
      Date.now()
    );

    return newTransactionevent;
  }

  /**
   * Tries to parse the given event into a TransactionEvent.
   * @static
   * @param {RawMatrixEvent} rawMatrixEvent the event to parse
   * @param {string} [roomId] the roomId of the room this event is published to
   * @returns {MatrixEvent|undefined} either the parsed event or undefined if the event could not be parsed (type mismatch)
   */
  public static fromRawMatrixEvent(
    rawMatrixEvent: RawMatrixEvent,
    roomId?: string
  ): MatrixEvent | undefined {
    if (rawMatrixEvent.type !== this.TYPE) {
      return undefined;
    }

    const debtors: {userId: string; amount: number}[] = [];
    for (const debtor of rawMatrixEvent.content.debtors) {
      debtors.push({userId: debtor.user, amount: parseMoney(debtor.amount)});
    }

    const roomsStore = useRoomsStore();
    const room = roomsStore.getRoom(roomId ?? rawMatrixEvent.room_id);
    const sender = room?.getMember(rawMatrixEvent.sender);

    return new TransactionEvent(
      rawMatrixEvent.event_id,
      roomId ?? rawMatrixEvent.room_id,
      rawMatrixEvent.content.purpose,
      parseMoney(rawMatrixEvent.content.sum),
      rawMatrixEvent.content.creditor,
      debtors,
      rawMatrixEvent.content.balances,
      rawMatrixEvent.state_key!,
      rawMatrixEvent.content['m.relates_to']?.event_id ?? undefined,
      rawMatrixEvent.content.receipt_url ?? undefined,
      sender,
      rawMatrixEvent.origin_server_ts
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
      receipt_url: this.receiptUrl,
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

  /**
   * Gets the receipt url of this transaction.
   * @returns {string|undefined} the receipt url (mxc) of this transaction
   */
  public getReceiptUrl(): string | undefined {
    return this.receiptUrl;
  }

  /**
   * Sets the receipt url of this transaction.
   * @param {string} url the receipt url (mxc content url) of this transaction
   * @returns {void}
   */
  public setReceiptUrl(url: string): void {
    this.receiptUrl = url;
  }

  /**
   * Gets the sender of this transaction.
   * @returns {User|undefined} the sender of this transaction
   */
  public getSender(): User | undefined {
    return this.sender;
  }

  /**
   * Gets the timestamp of this transaction.
   * @returns {number|undefined} the timestamp of this transaction
   */
  public getTimestamp(): number | undefined {
    return this.timestamp;
  }
}

export default TransactionEvent;
