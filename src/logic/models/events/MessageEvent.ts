import apiEndpoints from '@/logic/constants/apiEndpoints';
import MatrixEvent from './MatrixEvent';

/**
 * A message event modelled after the matrix specs.
 */
class MessageEvent extends MatrixEvent {
  public getPutUrl(): string {
    return apiEndpoints.putMessageEvent(this.roomId, this.type);
  }
}

export default MessageEvent;
