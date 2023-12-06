import apiEndpoints from '@/logic/constants/apiEndpoints';
import MatrixEvent from './MatrixEvent';

/**
 * A state event modelled after the matrix specs. All types of state events inherit from this class.
 */
class StateEvent extends MatrixEvent {
  private stateKey: string;

  /**
   * Creates a new state event with the given parameters
   * @param roomId the id of the room to publish this event to
   * @param eventType the type of state event
   * @param content the content of the state event
   * @param stateKey the key of the state. Defaults to an empty string.
   */
  constructor(roomId: string, eventType: string, content: any, stateKey?: string) {
    super(roomId, eventType, content);

    this.stateKey = stateKey ?? '';
  }
  public getPutUrl(): string {
    return apiEndpoints.putStateEvent(this.roomId, this.type, this.stateKey);
  }
}

export default StateEvent;
