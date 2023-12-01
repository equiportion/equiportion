import eventTypes from '../constants/eventTypes';
import type MatrixEvent from '../models/events/MatrixEvent';
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
      case eventTypes.transaction:
        return parseTransactionEvent(eventJson);
      case eventTypes.paymentInformation:
        return undefined;
      case eventTypes.roomMember:
        return undefined;
      case eventTypes.roomName:
        return undefined;
      case eventTypes.roomTopic:
        return undefined;
      case eventTypes.roomAvatar:
        return undefined;
      default:
        return undefined;
    }
  } catch (error) {
    throw new EventParseError();
  }
}

/**
 * Parses a transaction event received from the Matrix API as a json object to a new TransactionEvent object.
 * @param eventJson the event as a json object
 * @returns the TransactionEvent object
 */
function parseTransactionEvent(eventJson: any): TransactionEvent {
  const debtors: {user: string; amount: number}[] = [];
  for (const debtor of eventJson.debtors) {
    debtors.push({user: debtor.user, amount: debtor.amount});
  }
  return new TransactionEvent(
    eventJson.roomId,
    eventJson.type,
    eventJson.purpose,
    eventJson.sum,
    eventJson.creditor,
    debtors
  );
}

export {parseEvent, parseTransactionEvent};
