import {useRoomsStore} from '@/stores/rooms';
import StateEvent from './StateEvent';

/**
 * A m.room.topic event modelled after the matrix specs.
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
   * Gets the content of this event as a Json object
   * @returns {any} the content of this event
   */
  public getContent(): any {
    return {
      avatar_url: this.topic,
    };
  }
}

export default MRoomTopicEvent;
