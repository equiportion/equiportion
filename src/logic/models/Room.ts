import eventTypes from '../constants/eventTypes';
import {parseTransactionEvent} from '../utils/eventParser';
import AuthenticatedMatrixClient from '@/logic/models/clients/AuthenticatedMatrixClient';
import TransactionEvent from '@/logic/models/events/TransactionEvent';

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

  private transactionEvents: TransactionEvent[] = [];

  /**
   * Creates a new Room using data from the sync-API.
   * @param {string} roomId the rooms id
   */
  constructor(roomId: string) {
    this.roomId = roomId;
  }

  /**
   * Updates the room using data from the sync-API.
   *
   * @param data the data from the sync-API
   */
  public update(data: any) {
    const client = AuthenticatedMatrixClient.getClient();

    const stateEvents = data.state.events;
    const timelineEvents = data.timeline.events;
    for (const stateEvent of stateEvents) {
      this.parseEvent(stateEvent, client);
    }
    for (const timelineEvent of timelineEvents) {
      this.parseEvent(timelineEvent, client);
    }
  }

  /**
   * Parses an event from the sync-API and updates this room accordingly.
   * @param event the event to parse
   * @param client the client to update the users of
   */
  private parseEvent(event: any, client: AuthenticatedMatrixClient) {
    //TODO: migrate to eventParser.ts
    switch (event.type) {
      case eventTypes.transaction:
        this.transactionEvents.push(parseTransactionEvent(event));
        break;
      case eventTypes.roomMember:
        this.memberIds.add(event.state_key);
        client.updateUserFromStateEvent(event.state_key, event);
        break;
      case eventTypes.roomName:
        this.name = event.content.name;
        break;
      case eventTypes.roomAvatar:
        this.avatarUrl = event.content.url;
        break;
      case eventTypes.roomTopic:
        this.topic = event.content.topic;
        break;
      case eventTypes.paymentInformation:
        this.memberIds.add(event.state_key);
        client.updateUserFromStateEvent(event.state_key, event);
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

  /**
   * Gets the user ids of all members of this room.
   * @returns the member ids as a set
   */
  public getMemberIds() {
    return this.memberIds;
  }
}

export default Room;
