import MRoomNameEvent from '../models/events/MRoomNameEvent';
import MatrixEvent from '../models/events/MatrixEvent';
import TransactionEvent from '../models/events/TransactionEvent';

/**
 * Parses an event received from the Matrix API as a json object to a new MatrixEvent object.
 * @param eventJson the event as a json object
 * @returns the MatrixEvent object
 */
function parseEvent(eventJson: any): MatrixEvent | undefined {
  try {
    //TODO: Implement other event types
    switch (eventJson.type) {
      case MRoomNameEvent.TYPE:
        return parseMRoomNameEvent(eventJson);
      case TransactionEvent.TYPE:
        return parseTransactionEvent(eventJson);
      default:
        return undefined;
    }
  } catch (error) {
    throw new EventParseError();
  }
}

/**
 * Parses a transaction event received from the Matrix API as a json object to a new TransactionEvent object.
 * @param {any} eventJson the event as a json object
 * @returns {TransactionEvent} the TransactionEvent object
 */
function parseTransactionEvent(eventJson: any): TransactionEvent {
  const debtors: {user: string; amount: number}[] = [];
  for (const debtor of eventJson.content.debtors) {
    debtors.push({user: debtor.user, amount: debtor.amount});
  }

  return new TransactionEvent(
    eventJson.eventId,
    eventJson.roomId,
    eventJson.content.purpose,
    eventJson.content.sum,
    eventJson.content.creditor,
    debtors
  );
}

/**
 * Parses a m.room.name event received from the Matrix API as a json object to a new MRoomNameEvent object.
 * @param {any} eventJson the event as a json object
 * @returns {MRoomNameEvent} the MRoomNameEvent object
 */
function parseMRoomNameEvent(eventJson: any): MRoomNameEvent {
  return new MRoomNameEvent(eventJson.roomId, eventJson.content.name, eventJson.eventId)
}

export {parseEvent, parseTransactionEvent};
