import IbanPaymentInformation from './IbanPaymentInformation';
import PayPalPaymentInformation from './PayPalPaymentInformation';
import PaymentInformationEvent from '../controller/events/PaymentInformationEvent';

class Room {
  private roomId: string;

  private name?: string;
  private topic?: string;
  private avatarUrl?: string;

  private memberIds: String[] = [];

  constructor(roomId: string, data: Object) {
    this.roomId = roomId;
    this.update(data);
  }

  public update(data: any) {
    const stateEvents = data.state.events;
    const timelineEvents = data.timeline.events;
    for (const stateEvent of stateEvents) {
      this.parseEvent(stateEvent);
    }
    for (const timelineEvent of timelineEvents) {
      this.parseEvent(timelineEvent);
    }
  }

  private parseEvent(event: any) {
    switch (event.type) {
      case 'm.room.member':
        this.updateMember(event.content);
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
      case PaymentInformationEvent.eventType:
        console.log(event);
        break;
      default:
        break;
    }
  }

  private static parsePaymentInformation(data: any) {
    switch (data.type) {
      case IbanPaymentInformation.type:
        return IbanPaymentInformation.fromJson(data.information);
      case PayPalPaymentInformation.type:
        return PayPalPaymentInformation.fromJson(data.information);
      default:
        console.error('Error: Unknown Payment Information Type');
        return undefined;
    }
  }

  private updateMember(content: any) {
    //TODO: implement in #85
  }

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
}

export default Room;
