import {useRoomsStore} from '@/stores/rooms';
import StateEvent from '../StateEvent';
import type {RawMatrixEvent} from '../RawMatrixEvent';
import MatrixEvent from '../MatrixEvent';

/**
 * A m.room.topic event modelled after the matrix specs.
 * @author Jakob Gießibl
 * @author Philipp Stappert
 */
class MRoomTopicEvent extends StateEvent {
  public static TYPE = 'm.room.topic';

  private topic: string;

  /**
   * Creates a new state event with the given parameters
   * @param {string} eventId the eventId of this event, set to MatrixEvent.EVENT_ID_NEW if its a new event
   * @param {string} roomId the roomId of the room this event is published to
   * @param {string} topic the value the room's topic is set to via this event
   */
  constructor(eventId: string, roomId: string, topic: string) {
    const stateKey = '';
    super(eventId, roomId, stateKey);

    this.topic = topic;
  }

  /**
   * Tries to parse the given event into a MRoomTopicEvent.
   * @static
   * @param {RawMatrixEvent} event the event to parse
   * @param {string} [roomId] the roomId of the room this event is published to
   * @returns {MatrixEvent|undefined} Either the parsed event or undefined if the event could not be parsed (type missmatch)
   */
  public static fromEvent(event: RawMatrixEvent, roomId?: string): MatrixEvent | undefined {
    if (event.type !== this.TYPE) {
      return undefined;
    }

    return new MRoomTopicEvent(event.event_id, roomId ?? event.room_id, event.content.topic);
  }

  /**
   * Executes this event on its room
   * @returns {void}
   */
  public execute(): void {
    const roomsStore = useRoomsStore();
    const room = roomsStore.getRoom(this.getRoomId());
    room?.setTopic(this.topic);
  }

  /**
   * Gets the type of this event (matrix event type)
   * @returns {string} the type of this event
   */
  public getType(): string {
    return MRoomTopicEvent.TYPE;
  }

  /**
   * Gets the content of this event as a Json object (for matrix api)
   * @returns {any} the content of this event
   */
  public toEventContent(): any {
    return {
      avatar_url: this.topic,
    };
  }
}

export default MRoomTopicEvent;
