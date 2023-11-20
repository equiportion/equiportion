abstract class MatrixEvent {
  protected roomId: string;
  protected eventType: string;
  protected content: Object;

  constructor(roomId: string, eventType: string, content: Object) {
    this.roomId = roomId;
    this.eventType = eventType;
    this.content = content;
  }

  public abstract getPutUrl(): string;

  public getContent() {
    return this.content;
  }
}

export default MatrixEvent;
