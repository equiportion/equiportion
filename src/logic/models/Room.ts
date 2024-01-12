import EventParser from './events/EventParser';
import type MatrixEvent from './events/MatrixEvent';
import User from './User';

/**
 * A matrix room the logged in user has joined.
 * @author Jakob Gießibl
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

  private stateEventIds: string[] = [];
  private stateEvents: {[eventId: string]: MatrixEvent} = {};

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
   * @param data the data from the sync-API
   */
  public sync(data: any) {
    const stateEvents = data.state.events;
    const timelineEvents = data.timeline.events;

    for (const stateEvent of stateEvents) {
      const event = EventParser.jsonToEvent(stateEvent, this.getRoomId());
      if (!event) {
        continue;
      }
      this.addStateEvent(event);
      event.execute();
    }

    for (const timelineEvent of timelineEvents) {
      const event = EventParser.jsonToEvent(timelineEvent, this.getRoomId());
      if (!event) {
        continue;
      }
      this.addEvent(event);
      event.execute();
    }
  }

  /**
   * Gets this room's roomId.
   * @returns {string} the roomId
   */
  public getRoomId(): string {
    return this.roomId;
  }

  /**
   * Gets this room's name.
   * @returns {string|undefined} the name if set, else undefined
   */
  public getName(): string | undefined {
    return this.name;
  }

  /**
   * Sets the name of the room.
   * @param {string} name the new name of the room
   */
  public setName(name: string) {
    this.name = name;
  }

  /**
   * Gets this room's topic.
   * @returns {string|undefined} the topic if set, else undefined
   */
  public getTopic(): string | undefined {
    return this.topic;
  }

  /**
   * Sets the topic of the room.
   * @param {string} topic the new topic of the room
   */
  public setTopic(topic: string) {
    this.topic = topic;
  }

  /**
   * Gets this room's avatarUrl.
   * @returns {string|undefined} the avatarUrl if set, else undefined
   */
  public getAvatarUrl(): string | undefined {
    return this.avatarUrl;
  }

  /**
   * Sets the avatarUrl of the room.
   * @param {string} avatarUrl the new avatarUrl of the room
   */
  public setAvatarUrl(avatarUrl: string) {
    this.avatarUrl = avatarUrl;
  }

  /**
   * Gets all users in this room.
   * @returns {{[userId: string]: User}} all users in this room
   */
  public getMembers(): {[userId: string]: User} {
    return this.members;
  }

  /**
   * Gets a specific member of this room.
   * @param userId the id of the user
   * @returns {User} the user with the given id, or a new user with the given id if the user is not loaded yet
   */
  public getMember(userId: string): User {
    if (!this.members[userId]) {
      this.members[userId] = new User(userId);
    }

    return this.members[userId];
  }

  /**
   * Gets the eventIds of all events of a certain type this room has loaded.
   * @param [type] the type of event to get the eventIds for
   * @returns {string[]} the eventIds
   */
  public getEventIds(type?: string): string[] {
    if (!type) {
      return this.eventIds;
    }

    return this.eventIds.filter((eventId) => this.getEvent(eventId)!.getType() === type);
  }

  /**
   * Gets the all events (in the timeline) of a certain type this room has loaded.
   * @param [type] the type of event to get
   * @returns {MatrixEvent[]} the events
   */
  public getEvents(type?: string): MatrixEvent[] {
    const events = this.eventIds.map((eventId) => this.getEvent(eventId)!);

    if (!type) {
      return events;
    }

    return events.filter((event) => event.getType() == type);
  }

  /**
   * All events (in the state event) of a certain type this room has loaded.
   * @param [type] the type of event to get
   * @returns {MatrixEvent[]} the events found
   */
  public getEventsWithStateEvents(type?: string): MatrixEvent[] {
    const events = this.eventIds.map((eventId) => this.getEvent(eventId)!);
    const stateEvents = this.stateEventIds.map((eventId) => this.getEvent(eventId)!);

    const allEvents = events.concat(stateEvents);

    if (!type) {
      return allEvents;
    }

    return allEvents.filter((event) => event.getType() == type);
  }

  /**
   * Gets a specific timeline event this room has loaded.
   * @param eventId the eventId of the event to get
   * @returns {MatrixEvent | undefined} the event if it exists and was loaded, undefinded otherwise
   */
  public getEvent(eventId: string): MatrixEvent | undefined {
    return this.events[eventId];
  }

  /**
   * Gets the eventIds of all state events of a certain type this room has loaded.
   * @param {string} eventId the eventId of the event to get
   * @returns {MatrixEvent|undefined} the event if it exists and was loaded, undefinded otherwise
   */
  public getStateEvent(eventId: string): MatrixEvent | undefined {
    return this.stateEvents[eventId];
  }

  /**
   * Adds a specific timeline event to this room if none with its eventId has been added yet, otherwise it gets overwritten.
   * @param event the event to add
   */
  public addEvent(event: MatrixEvent) {
    // remove from state events if it is one
    const stateEventIndex = this.stateEventIds.indexOf(event.getEventId());
    if (stateEventIndex > -1) {
      this.stateEventIds.splice(stateEventIndex, 1);
    }

    const eventId = event.getEventId();

    if (!this.events[eventId]) {
      this.eventIds.push(eventId);
    }

    this.events[eventId] = event;
  }

  /**
   * Adds a specific state event to this room if none with its eventId has been added yet, otherwise it gets overwritten.
   * @param event the event to add
   */
  public addStateEvent(event: MatrixEvent) {
    const eventId = event.getEventId();

    if (!this.stateEvents[eventId]) {
      this.stateEventIds.push(eventId);
    }

    this.stateEvents[eventId] = event;
  }
}

export default Room;
