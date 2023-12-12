import {useRoomsStore} from '@/stores/rooms';
import StateEvent from './StateEvent';
import type {RawMatrixEvent} from './RawMatrixEvent';
import MatrixEvent from './MatrixEvent';

/**
 * A m.room.avatar event modelled after the matrix specs.
 * @author Jakob Gießibel
 * @author Philipp Stappert
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
   * Tries to parse the given event into a MRoomAvatarEvent.
   * @static
   * @param {RawMatrixEvent} event the event to parse
   * @param {string} [roomId] the roomId of the room this event is published to
   * @returns {MatrixEvent|undefined} Either the parsed event or undefined if the event could not be parsed (type missmatch)
   */
  public static fromEvent(event: RawMatrixEvent, roomId?: string): MatrixEvent | undefined {
    if (event.type !== this.TYPE) {
      return undefined;
    }

    return new MRoomAvatarEvent(event.event_id, roomId ?? event.room_id, event.content.url);
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
   * Gets the content of this event as a Json object (for matrix api)
   * @returns {any} the content of this event
   */
  public toEventContent(): any {
    return {
      avatar_url: this.avatarUrl,
    };
  }
}

export default MRoomAvatarEvent;
