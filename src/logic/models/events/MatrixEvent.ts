//TODO: doc

abstract class MatrixEvent {
  protected content: any;
  protected roomId: string;
  protected type: string;

  constructor(roomId: string, type: string, content: any) {
    this.roomId = roomId;
    this.type = type;
    this.content = content;
  }

  public abstract getPutUrl(): string;

  public getContent() {
    return this.content;
  }
}

export default MatrixEvent;
