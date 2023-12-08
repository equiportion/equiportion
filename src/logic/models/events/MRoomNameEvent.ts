import {useRoomsStore} from '@/stores/rooms';
import StateEvent from './StateEvent';

class MRoomNameEvent extends StateEvent {
  public static TYPE = 'm.room.name';

  private name: string;

  /**
   * Creates a new state event with the given parameters
   * @param roomId the roomId this event is published to
   * @param name the new name of the room
   * @param [eventId] the eventId of this event (optional, only to be set if this event was received from the matrix api)
   */
  constructor(eventId: string, roomId: string, name: string) {
    const stateKey = '';
    super(eventId, roomId, stateKey);

    this.name = name;
  }

  /**
   * Executes this event on its room.
   * @returns {void}
   */
  public execute(): void {
    const roomsStore = useRoomsStore();
    const room = roomsStore.getRoom(this.getRoomId());
    room?.setName(this.getContent().name);
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
  public getContent() {
    return {
      name: this.name,
    };
  }
}

export default MRoomNameEvent;
