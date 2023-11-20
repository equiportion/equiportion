class Room {
  private name?: string;
  private roomId: string;
  private topic?: string;
  private avatarUrl?: string;

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
        this.name = content.name;
        break;
      case 'm.room.avatar':
        this.avatarUrl = content.url;
        break;
      case 'm.room.topic':
        this.topic = content.topic;
        break;
      default:
        break;
    }
  }

  public getName() {
    return this.name;
  }

  public getRoomId() {
    return this.roomId;
  }

  public getTopic() {
    return this.topic;
  }

  public getAvatarUrl() {
    return this.avatarUrl;
  }
}

export default Room;
