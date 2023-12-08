/**
 * An event modelled after the matrix specs. All types of events inherit from this class.
 */
abstract class MatrixEvent {
  public static EVENT_ID_NEW = 'NEW_EVENT';

  private roomId: string;
  private eventId: string;

  /**
   * Creates a new matrix event using the given parameters
   * @param {string} roomId the roomId this event is published to
   * @param {string} eventId the eventId of this event, set to MatrixEvent.EVENT_ID_NEW if its a new event
   */
  constructor(eventId: string, roomId: string) {
    this.roomId = roomId;
    this.eventId = eventId;
  }

  /**
   * Gets the url to send the put request to for publishing this event
   * @returns {string} the url
   */
  public abstract getPutUrl(): string;

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
