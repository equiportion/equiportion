import apiEndpoints from '@/logic/constants/apiEndpoints';
import MatrixEvent from './MatrixEvent';

/**
 * A state event modelled after the matrix specs. All types of state events inherit from this class.
 */
abstract class StateEvent extends MatrixEvent {
  private stateKey: string;

  /**
   * Creates a new state event with the given parameters
   * @param {string} eventId the eventId of this event, set to MatrixEvent.EVENT_ID_NEW if its a new event
   * @param {string} roomId the roomId this event is published to
   * @param stateKey the key of the state
   */
  constructor(eventId: string, roomId: string, stateKey: string) {
    super(eventId, roomId);

    this.stateKey = stateKey ?? '';
  }

  /**
   * Gets the url to send the put request to for publishing this event
   * @returns {string} the url
   */
  public getPutUrl(): string {
    return apiEndpoints.putStateEvent(this.getRoomId(), this.getType(), this.stateKey);
  }
}

export default StateEvent;
