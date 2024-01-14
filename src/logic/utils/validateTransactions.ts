import Room from '@/logic/models/Room';
import TransactionEvent from '@/logic/models/events/custom/TransactionEvent';

/**
 * Validates all transactions in this room.
 * This method should be called after a new event has been added to the room.
 * It will check if the new event is valid and if not, it will invalidate all following events.
 *
 * @param {Room} room the room to validate
 * @param {boolean} [fullRevalidation=false] if true, all events will be revalidated, otherwise only the new event and following events will be revalidated
 */
function validateTransactions(room: Room, fullRevalidation: boolean = false) {
  const validEventIds: {[stateKey: string]: string | undefined} = {};

  // reverse loop over all timeline events
  const transactionEvents: TransactionEvent[] = room.getEvents(
    TransactionEvent.TYPE
  ) as TransactionEvent[];

  for (let i = transactionEvents.length - 1; i >= 0; i--) {
    const transactionEvent = transactionEvents[i];

    const relatesToEventId = transactionEvent.getLatestEventId();

    if (
      transactionEvent.getEventId() == validEventIds[transactionEvent.getStateKey()] ||
      validEventIds[transactionEvent.getStateKey()] == undefined
    ) {
      // valid
      if (transactionEvent.isValid() && !fullRevalidation) {
        // already valid
        break;
      }

      transactionEvent.setValid(true);
      validEventIds[transactionEvent.getStateKey()] = relatesToEventId;
    } else {
      // not valid
      transactionEvent.setValid(false);
    }
  }
}

export default validateTransactions;
