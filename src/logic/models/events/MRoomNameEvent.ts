import {useRoomsStore} from '@/stores/rooms';
import StateEvent from './StateEvent';
import type {RawMatrixEvent} from './RawMatrixEvent';
import MatrixEvent from './MatrixEvent';

/**
 * A m.room.name event modelled after the matrix specs.
 * @author Jakob Gießibel
 * @author Philipp Stappert
 */
class MRoomNameEvent extends StateEvent {
  public static TYPE = 'm.room.name';

  private name: string;

  /**
   * Creates a new state event with the given parameters
   * @param {string} eventId the eventId of this event, set to MatrixEvent.EVENT_ID_NEW if its a new event
   * @param {string} roomId the roomId of the room this event is published to
   * @param {string} name the value the room's name is set to via this event
   */
  constructor(eventId: string, roomId: string, name: string) {
    const stateKey = '';
    super(eventId, roomId, stateKey);

    this.name = name;
  }

  /**
   * Tries to parse the given event into a MRoomNameEvent.
   * @static
   * @param {RawMatrixEvent} event the event to parse
   * @param {string} [roomId] the roomId of the room this event is published to
   * @returns {MatrixEvent|undefined} Either the parsed event or undefined if the event could not be parsed (type missmatch)
   */
  public static fromEvent(event: RawMatrixEvent, roomId?: string): MatrixEvent | undefined {
    if (event.type !== this.TYPE) {
      return undefined;
    }

    return new MRoomNameEvent(event.event_id, roomId ?? event.room_id, event.content.name);
  }

  /**
   * Executes this event on its room
   * @returns {void}
   */
  public execute(): void {
    const roomsStore = useRoomsStore();
    const room = roomsStore.getRoom(this.getRoomId());
    room?.setName(this.name);
  }

  /**
   * Gets the type of this event (matrix event type)
   * @returns {string} the type of this event
   */
  public getType(): string {
    return MRoomNameEvent.TYPE;
  }

  /**
   * Gets the content of this event as a Json object (for matrix api)
   * @returns {any} the content of this event
   */
  public toEventContent(): any {
    return {
      name: this.name,
    };
  }
}

export default MRoomNameEvent;
