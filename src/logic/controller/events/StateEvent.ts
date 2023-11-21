import MatrixEvent from './MatrixEvent';

class StateEvent extends MatrixEvent {
  private stateKey: string;

  constructor(roomId: string, eventType: string, content: any, stateKey: string) {
    super(roomId, eventType, content);

    this.stateKey = stateKey;
  }

  public getPutUrl(): string {
    return `/_matrix/client/v3/rooms/${this.roomId}/state/${this.eventType}/${this.stateKey}`;
  }
}

export default StateEvent;
