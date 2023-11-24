class Room {
  private roomId: string;

  private name?: string;
  private topic?: string;
  private avatarUrl?: string;

  private members: Ref<String[]>;

  private age?: number;

  constructor(roomId: string, data: Object) {
    this.roomId = roomId;
    this.update(data);
  }

  public update(data: any) {
    const stateEvents = data.state.events;
    const timelineEvents = data.timeline.events;

    for (const stateEvent of stateEvents) {
      this.processEvent(stateEvent);
    }

    for (const timelineEvent of timelineEvents) {
      this.processEvent(timelineEvent);
    }
  }

  private processEvent(event: any) {
    switch (event.type) {
      case 'm.room.member':
        this.updateMember(event.content);
        break;
      case 'm.room.create':
        this.age = event.unsigned.age;
        break;
      case 'm.room.name':
        this.name = event.content.name;
        break;
      case 'm.room.avatar':
        this.avatarUrl = event.content.url;
        break;
      case 'm.room.topic':
        this.topic = event.content.topic;
        break;
      default:
        break;
    }
  }

  private updateMember(content: any) {}

  public getRoomId() {
    return this.roomId;
  }

  public getName() {
    return this.name;
  }

  public getTopic() {
    return this.topic;
  }

  public getAvatarUrl() {
    return this.avatarUrl;
  }

  public getAge() {
    return this.age!;
  }
}

export default Room;
