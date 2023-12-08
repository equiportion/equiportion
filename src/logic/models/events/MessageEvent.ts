import apiEndpoints from '@/logic/constants/apiEndpoints';
import MatrixEvent from './MatrixEvent';

/**
 * A message event modelled after the matrix specs.
 */
abstract class MessageEvent extends MatrixEvent {
  /**
   * Gets the url to send the put request to for publishing this event
   * @returns {string} the url
   */
  public getPutUrl(): string {
    return apiEndpoints.putMessageEvent(this.getRoomId(), this.getType());
  }
}

export default MessageEvent;
