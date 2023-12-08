import {parseEvent, parseTransactionEvent} from '../utils/eventParser';
import AuthenticatedMatrixClient from '@/logic/models/clients/AuthenticatedMatrixClient';
import TransactionEvent from '@/logic/models/events/TransactionEvent';
import type MatrixEvent from './events/MatrixEvent';
import StateEvent from './events/StateEvent';

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

  private memberIds: Set<string> = new Set();

  private eventIds: string[] = [];
  private events: {[eventId: string]: MatrixEvent} = {};

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
      const event = parseEvent(stateEvent);

      event?.execute();
    }

    for (const timelineEvent of timelineEvents) {
      const event = parseEvent(timelineEvent);
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

  /**
   * Gets this room's avatarUrl.
   * @returns the avatarUrl if set, else undefined
   */
  public getAvatarUrl() {
    return this.avatarUrl;
  }

  /**
   * Gets the user ids of all members of this room.
   * @returns the member ids as a set
   */
  public getMemberIds() {
    return this.memberIds;
  }
}

export default Room;
