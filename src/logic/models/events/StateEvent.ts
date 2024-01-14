import apiEndpoints from '@/logic/constants/apiEndpoints';
import MatrixEvent from './MatrixEvent';
import type {AxiosResponse} from 'axios';
import AuthenticatedMatrixClient from '../clients/AuthenticatedMatrixClient';
import {useRoomsStore} from '@/stores/rooms';

/**
 * A state event modelled after the matrix specs. All types of state events inherit from this class.
 * @author Jakob Gießibl
 * @author Philipp Stappert
 */
abstract class StateEvent extends MatrixEvent {
  protected stateKey: string;

  /**
   * Creates a new state event with the given parameters
   * @param {string} eventId the eventId of this event, set to MatrixEvent.EVENT_ID_NEW if its a new event
   * @param {string} roomId the roomId of the room this event is published to
   * @param stateKey the key of the state
   */
  constructor(eventId: string, roomId: string, stateKey: string) {
    super(eventId, roomId);

    this.stateKey = stateKey ?? '';
  }

  /**
   * Publishes this event to the matrix homeserver, adds it to its room and executes it.
   * @returns {Promise<AxiosResponse | undefined>} a Promise that resolves to the HTTP response or undefined if the request failed
   */
  public async publish(): Promise<AxiosResponse | undefined> {
    //TODO: retry request

    const roomsStore = useRoomsStore();
    const room = roomsStore.getRoom(this.getRoomId())!;

    const client = AuthenticatedMatrixClient.getClient();

    const url = apiEndpoints.putStateEvent(this.getRoomId(), this.getType(), this.getStateKey());
    const data = this.toEventContent();

    const response = await client.putRequest(url, data);
    if (!response?.data.event_id) {
      return undefined;
    }

    this.setEventId(response.data.event_id);
    room.addEvent(this);
    this.execute();

    return response;
  }

  /**
   * Gets the state key of this event.
   * @returns the state key
   */
  public getStateKey(): string {
    return this.stateKey;
  }
}

export default StateEvent;
