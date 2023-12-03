/**
 * An event modelled after the matrix specs. All types of events inherit from this class.
 */
abstract class MatrixEvent {
  protected content: any;
  protected roomId: string;
  protected type: string;

  constructor(roomId: string, type: string, content: any) {
    this.roomId = roomId;
    this.type = type;
    this.content = content;
  }

  /**
   * Gets the url to send the put request to for publishing this event.
   * @returns the url as a string
   */
  public abstract getPutUrl(): string;

  /**
   * Gets this event's content
   * @returns the content
   */
  public getContent() {
    return this.content;
  }
}

export default MatrixEvent;
