import apiEndpoints from '@/logic/constants/apiEndpoints';
import MatrixEvent from './MatrixEvent';
//TODO: doc

class MessageEvent extends MatrixEvent {
  public getPutUrl(): string {
    return apiEndpoints.putMessageEvent(this.roomId, this.type);
  }
}

export default MessageEvent;
