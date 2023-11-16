class Room{

  constructor(roomName: string, roomId: string, roomDescription: string, roomPictureUrl: string) {
    this.roomName = roomName;
    this.roomId = roomId;
    this.roomDescription = roomDescription;
    this.roomPictureUrl = roomPictureUrl;
  }

  private roomName: string;
  private roomId: string;
  private roomDescription: string;
  private roomPictureUrl: string;

  public getRoomName(): string {
    return this.roomName;
  }

  public getRoomId(): string {
    return this.roomId;
  }

  public getRoomDescription(): string {
    return this.roomDescription;
  }

  public getRoomPictureUrl(): string {
    return this.roomPictureUrl;
  }

}

export default Room
