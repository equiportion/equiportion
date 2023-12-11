import type { AxiosResponse } from "axios";

/**
 * An event modelled after the matrix specs. All types of events inherit from this class.
 */
abstract class MatrixEvent {
  public static EVENT_ID_NEW = 'NEW_EVENT';

  protected roomId: string;
  protected eventId: string;

  /**
   * Creates a new matrix event using the given parameters
   * @param {string} eventId the eventId of this event, set to MatrixEvent.EVENT_ID_NEW if its a new event
   * @param {string} roomId the roomId of the room this event is published to
   */
  constructor(eventId: string, roomId: string) {
    this.roomId = roomId;
    this.eventId = eventId;
  }

  /**
   * Publishes this event to the matrix homeserver.
   * @returns {Promise<AxiosResponse | undefined>} the HTTP response or undefined if the request failed
   */
  public abstract publish(): Promise<AxiosResponse | undefined>;

  /**
   * Executes this event on its room.
   * @returns {void}
   */
  public abstract execute(): void;

  /**
   * Gets the eventId of this event
   * @returns {string} the eventId, is MatrixEvent.EVENT_ID_NEW if its a new event
   */
  public getEventId(): string {
    return this.eventId;
  }

  /**
   * Sets the eventId of this event. Should only be called after it has been published to matrix and got an eventId in response.
   * @param eventId
   * @returns {boolean} true if setting the eventId was successful, false otherwise
   */
  protected setEventId(eventId: string): boolean {
    if (eventId === '') {
      return false;
    }

    this.eventId = eventId;
    return true;
  }

  /**
   * Gets the roomId of the room this event is published to
   * @returns {string} the roomId
   */
  public getRoomId(): string {
    return this.roomId;
  }

  /**
   * Gets the content of this event as a Json object
   * @returns {any} the content of this event
   */
  public abstract getContent(): any;

  /**
   * Gets the type of this event (matrix event type)
   * @returns {string} the type of this event
   */
  public abstract getType(): string;
}

export default MatrixEvent;
