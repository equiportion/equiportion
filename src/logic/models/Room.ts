import PaymentInformationEvent from '../controller/events/PaymentInformationEvent';

/**
 * A matrix room the logged in user has joined.
 */
class Room {
  private roomId: string;

  private name?: string;
  private topic?: string;
  private avatarUrl?: string;

  private memberIds: String[] = [];

  /**
   * Creates a new Room using data from the sync-API.
   * @param roomId the rooms id
   * @param data the data from the sync-API
   */
  constructor(roomId: string, data: Object) {
    this.roomId = roomId;
    this.update(data);
  }

  /**
   * Updates the room using data from the sync-API.
   * @param data the data from the sync-API
   */
  public update(data: any) {
    const stateEvents = data.state.events;
    const timelineEvents = data.timeline.events;
    for (const stateEvent of stateEvents) {
      this.parseEvent(stateEvent);
    }
    for (const timelineEvent of timelineEvents) {
      this.parseEvent(timelineEvent);
    }
  }

  /**
   * Parses an event from the sync-API and updates this room accordingly.
   * @param event the event to parse
   */
  private parseEvent(event: any) {
    switch (event.type) {
      case 'm.room.member':
        //TODO: implement in #85
        break;
      case 'm.room.name':
        this.name = event.content.name;
        break;
      case 'm.room.avatar':
        this.avatarUrl = event.content.url;
        break;
      case 'm.room.topic':
        this.topic = event.content.topic;
        break;
      case PaymentInformationEvent.eventType:
        //TODO: implement in #85
        break;
      default:
        break;
    }
  }

  /**
   * Gets this room's roomId.
   * @returns the roomId
   */
  public getRoomId() {
    return this.roomId;
  }

  /**
   * Gets this room's name.
   * @returns the name if set, else undefined
   */
  public getName() {
    return this.name;
  }

  /**
   * Gets this room's topic.
   * @returns the topic if set, else undefined
   */
  public getTopic() {
    return this.topic;
  }

  /**
   * Gets this room's avatarUrl.
   * @returns the avatarUrl if set, else undefined
   */
  public getAvatarUrl() {
    return this.avatarUrl;
  }
}

export default Room;
