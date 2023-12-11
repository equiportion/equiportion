import {useRoomsStore} from '@/stores/rooms';
import StateEvent from './StateEvent';

/**
 * A m.room.name event modelled after the matrix specs.
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
   * Gets the content of this event as a Json object
   * @returns {any} the content of this event
   */
  public getContent(): any {
    return {
      name: this.name,
    };
  }
}

export default MRoomNameEvent;
