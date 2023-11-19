class Room {
  private roomName?: string;
  private roomId: string;
  private roomDescription?: string;
  private roomPictureUrl?: string;

  constructor(roomId: string, data: Object) {
    this.roomId = roomId;
    this.update(data);
  }

  public update(data: any) {
    const stateEvents = data.state.events;
    const timelineEvents = data.timeline.events;

    for (const stateEvent of stateEvents) {
      const type = stateEvent.type;
      const content = stateEvent.content;

      this.parseEvent(type, content);
    }

    for (const timelineEvent of timelineEvents) {
      const type = timelineEvent.type;
      const content = timelineEvent.content;

      this.parseEvent(type, content);
    }
  }

  private parseEvent(type: string, content: any) {
    switch (type) {
      case 'm.room.name':
        this.roomName = content.name;
        break;
      case 'm.room.avatar':
        this.roomPictureUrl = content.url;
        break;
      case 'm.room.topic':
        this.roomDescription = content.topic;
        break;
      default:
        break;
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
