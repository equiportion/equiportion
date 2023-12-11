import MRoomAvatarEvent from '../models/events/MRoomAvatarEvent';
import MRoomMemberEvent from '../models/events/MRoomMemberEvent';
import MRoomNameEvent from '../models/events/MRoomNameEvent';
import MRoomTopicEvent from '../models/events/MRoomTopicEvent';
import MatrixEvent from '../models/events/MatrixEvent';
import TransactionEvent from '../models/events/TransactionEvent';

/**
 * Parses an event received from the Matrix API as a json object to a new MatrixEvent object.
 * @param eventJson the event as a json object
 * @returns the MatrixEvent object
 */
function parseEvent(eventJson: any, roomId?: string): MatrixEvent | undefined {
  try {
    //TODO: Implement other event types
    switch (eventJson.type as string) {
      case MRoomNameEvent.TYPE:
        return parseMRoomNameEvent(eventJson, roomId);
      case MRoomTopicEvent.TYPE:
        return parseMRoomTopicEvent(eventJson, roomId);
      case MRoomAvatarEvent.TYPE:
        return parseMRoomAvatarEvent(eventJson, roomId);
      case MRoomMemberEvent.TYPE:
        return parseMRoomMemberEvent(eventJson, roomId);
      case TransactionEvent.TYPE:
        return parseTransactionEvent(eventJson, roomId);
      default:
        return undefined;
    }
  } catch (error) {
    throw new EventParseError();
  }
}

/**
 * Parses a m.room.name event received from the Matrix API as a json object to a new MRoomNameEvent object.
 * @param {any} eventJson the event as a json object
 * @returns {MRoomNameEvent} the MRoomNameEvent object
 */
function parseMRoomNameEvent(eventJson: any, roomId?: string): MRoomNameEvent {
  return new MRoomNameEvent(
    eventJson.event_id,
    roomId ?? eventJson.room_id,
    eventJson.content.name
  );
}

/**
 * Parses a m.room.avatar_url event received from the Matrix API as a json object to a new MRoomAvatarEvent object.
 * @param {any} eventJson the event as a json object
 * @returns {MRoomAvatarEvent} the MRoomAvatarEvent object
 */
function parseMRoomAvatarEvent(eventJson: any, roomId?: string): MRoomAvatarEvent {
  return new MRoomAvatarEvent(
    eventJson.event_id,
    roomId ?? eventJson.room_id,
    eventJson.content.url
  );
}

/**
 * Parses a m.room.topic event received from the Matrix API as a json object to a new MRoomTopicEvent object.
 * @param {any} eventJson the event as a json object
 * @returns {MRoomTopicEvent} the MRoomTopicEvent object
 */
function parseMRoomTopicEvent(eventJson: any, roomId?: string): MRoomTopicEvent {
  return new MRoomTopicEvent(
    eventJson.event_id,
    roomId ?? eventJson.room_id,
    eventJson.content.topic
  );
}

/**
 * Parses a m.room.member event received from the Matrix API as a json object to a new MRoomMemberEvent object.
 * @param {any} eventJson the event as a json object
 * @returns {MRoomMemberEvent} the MRoomMemberEvent object
 */
function parseMRoomMemberEvent(eventJson: any, roomId?: string): MRoomMemberEvent {
  return new MRoomMemberEvent(
    eventJson.event_id,
    roomId ?? eventJson.room_id,
    eventJson.state_key,
    eventJson.content.avatar_url,
    eventJson.content.displayname,
    eventJson.content.membership,
    eventJson.content.reason
  );
}

/**
 * Parses a transaction event received from the Matrix API as a json object to a new TransactionEvent object.
 * @param {any} eventJson the event as a json object
 * @returns {TransactionEvent} the TransactionEvent object
 */
function parseTransactionEvent(eventJson: any, roomId?: string): TransactionEvent {
  const debtors: {user: string; amount: number}[] = [];
  for (const debtor of eventJson.content.debtors) {
    debtors.push({user: debtor.user, amount: debtor.amount});
  }

  return new TransactionEvent(
    eventJson.event_id,
    roomId ?? eventJson.room_id,
    eventJson.content.purpose,
    eventJson.content.sum,
    eventJson.content.creditor,
    debtors
  );
}

export {parseEvent};
