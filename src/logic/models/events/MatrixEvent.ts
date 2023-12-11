/**
 * An event modelled after the matrix specs. All types of events inherit from this class.
 */
abstract class MatrixEvent {
  protected eventId: string;
  protected roomId: string;
  protected type: string;
  protected content: any;

  constructor(roomId: string, type: string, content: any, eventId: string = '') {
    this.roomId = roomId;
    this.type = type;
    this.content = content;
    this.eventId = eventId;
  }

  /**
   * Gets the url to send the put request to for publishing this event.
   * @returns the url as a string
   */
  public abstract getPutUrl(): string;

/**
   * Gets this event's eventId. Is set only if this event was already published, else it is an empty string.
   * @returns the eventId
   */
  public getEventId(): string {
    return this.eventId;
  }

  /**
   * Gets this event's content.
   * @returns the content
   */
  public getContent() {
    return this.content;
  }
}

export default MatrixEvent;
