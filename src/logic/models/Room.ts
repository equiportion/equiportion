import EventParser from './events/EventParser';
import type MatrixEvent from './events/MatrixEvent';
import User from './User';

/**
 * A matrix room the logged in user has joined.
 * @author Jakob Gießibel
 * @author Philipp Stappert
 */
class Room {
  private roomId: string;

  private name?: string;
  private topic?: string;
  private avatarUrl?: string;

  private members: {[userId: string]: User} = {};

  private eventIds: string[] = [];
  private events: {[eventId: string]: MatrixEvent} = {};

  private nextBatch: string = '';

  /**
   * Creates a new Room using data from the sync-API.
   * @param {string} roomId the rooms id
   */
  constructor(roomId: string) {
    this.eventIds.push();
    this.roomId = roomId;
  }

  /**
   * Updates the room using data from the sync-API.
   *
   * @param data the data from the sync-API
   */
  public sync(data: any) {
    const stateEvents = data.state.events;
    const timelineEvents = data.timeline.events;

    for (const stateEvent of stateEvents) {
      const event = EventParser.jsonToEvent(stateEvent, this.getRoomId());

      event?.execute();
    }

    for (const timelineEvent of timelineEvents) {
      const event = EventParser.jsonToEvent(timelineEvent, this.getRoomId());
      if (!event) {
        continue;
      }

      const eventId = event.getEventId()!;
      if (!this.events[eventId]) {
        this.eventIds.push(eventId);
      }
      this.events[eventId] = event;

      event.execute();
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

  public setName(name: string) {
    this.name = name;
  }

  /**
   * Gets this room's topic.
   * @returns the topic if set, else undefined
   */
  public getTopic() {
    return this.topic;
  }

  public setTopic(topic: string) {
    this.topic = topic;
  }

  /**
   * Gets this room's avatarUrl.
   * @returns the avatarUrl if set, else undefined
   */
  public getAvatarUrl() {
    return this.avatarUrl;
  }

  public setAvatarUrl(avatarUrl: string) {
    this.avatarUrl = avatarUrl;
  }

  public getMembers(): {[userId: string]: User} {
    return this.members;
  }

  public getMember(userId: string): User {
    if (!this.members[userId]) {
      this.members[userId] = new User(userId);
    }

    return this.members[userId];
  }
}

export default Room;
