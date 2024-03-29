import {useRoomsStore} from '@/stores/rooms';
import StateEvent from '../StateEvent';
import type {RawMatrixEvent} from '../RawMatrixEvent';
import MatrixEvent from '../MatrixEvent';

/**
 * A m.room.member event modelled after the matrix specs.
 * @author Clara Gießibl
 * @author Philipp Stappert
 */
class MRoomMemberEvent extends StateEvent {
  public static TYPE = 'm.room.member';

  private userId: string;

  private avatarUrl: string;
  private displayname: string;
  private membership: string;
  private reason: string;
  private previousMembership: string | undefined;

  /**
   * Creates a new state event with the given parameters
   * @param {string} eventId the eventId of this event, set to MatrixEvent.EVENT_ID_NEW if its a new event
   * @param {string} roomId the roomId of the room this event is published to
   * @param {string} userId the userId of the member this event updates
   * @param {string} avatarUrl the value the member's avatar url is set to via this event
   * @param {string} displayname the value the member's displayname is set to via this event
   * @param {string} membership the value the member's membership status is set to via this event
   * @param {string} reason the reason for publishing this event
   * @param {string} [previousMembership] the previous membership status of the member this event updates
   */
  constructor(
    eventId: string,
    roomId: string,
    userId: string,
    avatarUrl: string,
    displayname: string,
    membership: string,
    reason: string,
    previousMembership?: string
  ) {
    const stateKey = userId;
    super(eventId, roomId, stateKey);

    this.userId = userId;

    this.avatarUrl = avatarUrl;
    this.displayname = displayname;
    this.membership = membership;
    this.reason = reason;
    this.previousMembership = previousMembership;
  }

  /**
   * Tries to parse the given event into a MRoomMemberEvent.
   * @static
   * @param {RawMatrixEvent} rawMatrixEvent the event to parse
   * @param {string} [roomId] the roomId of the room this event is published to
   * @returns {MatrixEvent|undefined} Either the parsed event or undefined if the event could not be parsed (type missmatch)
   */
  public static fromRawMatrixEvent(
    rawMatrixEvent: RawMatrixEvent,
    roomId?: string
  ): MatrixEvent | undefined {
    if (rawMatrixEvent.type !== this.TYPE) {
      return undefined;
    }

    let membership = undefined;
    if (rawMatrixEvent.unsigned != undefined) {
      if (rawMatrixEvent.unsigned.prev_content) {
        membership = rawMatrixEvent.unsigned.prev_content.membership;
      }
    }

    return new MRoomMemberEvent(
      rawMatrixEvent.event_id,
      roomId ?? rawMatrixEvent.room_id,
      rawMatrixEvent.state_key!,
      rawMatrixEvent.content.avatar_url,
      rawMatrixEvent.content.displayname,
      rawMatrixEvent.content.membership,
      rawMatrixEvent.content.reason,
      membership
    );
  }

  /**
   * Executes this event on its room; in this case it updates the member with the given userId.
   * @returns {void}
   */
  public execute(): void {
    const roomsStore = useRoomsStore();
    const room = roomsStore.getRoom(this.getRoomId())!;
    const member = room.getMember(this.userId);

    member.setAvatarUrl(this.avatarUrl);
    member.setDisplayname(this.displayname);

    switch (this.membership) {
      case 'join':
        member.setTypeInRoom('member');
        break;
      case 'invite':
        member.setTypeInRoom('invite');
        break;
      case 'leave':
      case 'ban':
        member.setTypeInRoom('left');
        break;
      default:
        break;
    }
  }

  /**
   * Gets the type of this event (matrix event type)
   * @returns {string} the type of this event
   */
  public getType(): string {
    return MRoomMemberEvent.TYPE;
  }

  /**
   * Gets the type of the membership change this event represents
   * @returns {string} the type of the membership change this event represents (join, invite, leave, ban)
   */
  public getMembershipType(): string {
    return this.membership;
  }

  /**
   * Gets the userId of the member this event updates
   * @returns {string} the userId of the member this event updates
   */
  public getUserId(): string {
    return this.userId;
  }

  /**
   * Gets the content of this event as a Json object (for matrix api)
   * @returns {{}} the content of this event
   */
  public toEventContent(): {} {
    return {
      avatarUrl: this.avatarUrl,
      displayname: this.displayname,
      membership: this.membership,
      reason: this.reason,
    };
  }

  /**
   * Returns the previous membership status of the member this event updates
   * @returns {string|undefined} the previous membership status of the member this event updates
   */
  public getPreviousMembership(): string | undefined {
    return this.previousMembership;
  }
}

export default MRoomMemberEvent;
