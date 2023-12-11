import {useRoomsStore} from '@/stores/rooms';
import StateEvent from './StateEvent';

/**
 * A m.room.member event modelled after the matrix specs.
 */
class MRoomMemberEvent extends StateEvent {
  public static TYPE = 'm.room.member';

  private userId: string;

  private avatarUrl: string;
  private displayname: string;
  private membership: string;
  private reason: string;

  /**
   * Creates a new state event with the given parameters
   * @param {string} eventId the eventId of this event, set to MatrixEvent.EVENT_ID_NEW if its a new event
   * @param {string} roomId the roomId of the room this event is published to
   * @param {string} userId the userId of the member this event updates
   * @param {string} avatarUrl the value the member's avatar url is set to via this event
   * @param {string} displayname the value the member's displayname is set to via this event
   * @param {string} membership the value the member's membership status is set to via this event
   * @param {string} reason the reason for publishing this event
   */
  constructor(
    eventId: string,
    roomId: string,
    userId: string,
    avatarUrl: string,
    displayname: string,
    membership: string,
    reason: string
  ) {
    const stateKey = userId;
    super(eventId, roomId, stateKey);

    this.userId = userId;

    this.avatarUrl = avatarUrl;
    this.displayname = displayname;
    this.membership = membership;
    this.reason = reason;
  }

  /**
   * Executes this event on its room
   * @returns {void}
   */
  public execute(): void {
    //TODO: handle other membership types
    if (this.membership != 'join') {
      return;
    }

    const roomsStore = useRoomsStore();
    const room = roomsStore.getRoom(this.getRoomId())!;
    const member = room?.getMember(this.userId);

    console.log(member);
    member?.setAvatarUrl(this.avatarUrl);
    member?.setDisplayname(this.displayname);
  }

  /**
   * Gets the type of this event (matrix event type)
   * @returns {string} the type of this event
   */
  public getType(): string {
    return MRoomMemberEvent.TYPE;
  }

  /**
   * Gets the content of this event as a Json object
   * @returns {any} the content of this event
   */
  public getContent(): any {
    return {
      avatarUrl: this.avatarUrl,
      displayname: this.displayname,
      membership: this.membership,
      reason: this.reason,
    };
  }
}

export default MRoomMemberEvent;
