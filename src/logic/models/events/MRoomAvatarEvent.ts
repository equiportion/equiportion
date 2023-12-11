import {useRoomsStore} from '@/stores/rooms';
import StateEvent from './StateEvent';

/**
 * A m.room.avatar event modelled after the matrix specs.
 */
class MRoomAvatarEvent extends StateEvent {
  public static TYPE = 'm.room.avatar';

  private avatarUrl: string;

  /**
   * Creates a new state event with the given parameters
   * @param {string} eventId the eventId of this event, set to MatrixEvent.EVENT_ID_NEW if its a new event
   * @param {string} roomId the roomId of the room this event is published to
   * @param {string} avatarUrl the value the room's avatar url is set to via this event
   */
  constructor(eventId: string, roomId: string, avatarUrl: string) {
    const stateKey = '';
    super(eventId, roomId, stateKey);

    this.avatarUrl = avatarUrl;
  }

  /**
   * Executes this event on its room
   * @returns {void}
   */
  public execute(): void {
    const roomsStore = useRoomsStore();
    const room = roomsStore.getRoom(this.getRoomId());
    room?.setAvatarUrl(this.avatarUrl);
  }

  /**
   * Gets the type of this event (matrix event type)
   * @returns {string} the type of this event
   */
  public getType(): string {
    return MRoomAvatarEvent.TYPE;
  }

  /**
   * Gets the content of this event as a Json object
   * @returns {any} the content of this event
   */
  public getContent(): any {
    return {
      avatar_url: this.avatarUrl,
    };
  }
}

export default MRoomAvatarEvent;
