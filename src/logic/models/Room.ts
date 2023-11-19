class Room {
  private roomName?: string;
  private roomId: string;
  private roomDescription?: string;
  private roomPictureUrl?: string;

  constructor(roomId: string, data: Object) {
    this.roomId = roomId;
    this.init(data);
  }

  private init(data: any) {
    console.log('Room: ' + this.roomId + ' -----------------------------------');
    console.log(data);
    const stateEvents = data.state.events;

    for (const stateEvent of stateEvents) {
      const type = stateEvent.type;
      const content = stateEvent.content;

      // switch (type) {
      //   case 'm.room.member':
      //     break;
      //   case 'm.room.name':
      //     console.log(type);
      //     this.roomName = content.name;
      //     break;
      //   case 'm.room.avatar':
      //     console.log(type);
      //     this.roomPictureUrl = content.url;
      //     break;
      //   case 'm.room.topic':
      //     console.log(type);
      //     this.roomDescription = content.topic;
      //     break;
      //   default:
      //     break;
      // }
    }
  }

  public getRoomName() {
    return this.roomName;
  }

  public getRoomId() {
    return this.roomId;
  }

  public getRoomDescription() {
    return this.roomDescription;
  }

  public getRoomPictureUrl() {
    return this.roomPictureUrl;
  }
}

export default Room;
