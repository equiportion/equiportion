import apiEndpoints from '@/logic/constants/apiEndpoints';
import MatrixEvent from './MatrixEvent';
import AuthenticatedMatrixClient from '../../clients/AuthenticatedMatrixClient';
import type {AxiosResponse} from 'axios';
import {useRoomsStore} from '@/stores/rooms';

/**
 * A message event modelled after the matrix specs.
 * @author Clara Gießibl
 * @author Philipp Stappert
 */
abstract class MessageEvent extends MatrixEvent {
  /**
   * Publishes this event to the matrix homeserver, adds it to its room and executes it.
   * @returns {Promise<AxiosResponse | undefined>} a Promise that resolves to the HTTP response or undefined if the request failed
   */
  public async publish(): Promise<AxiosResponse | undefined> {
    //TODO: retry request

    const roomsStore = useRoomsStore();
    const room = roomsStore.getRoom(this.getRoomId())!;

    const client = AuthenticatedMatrixClient.getClient();

    const uuid = self.crypto.randomUUID();

    const url = apiEndpoints.putMessageEvent(this.getRoomId(), this.getType(), uuid);
    const data = this.toEventContent();

    const response = await client.putRequest(url, data);
    if (!response?.data.event_id) {
      return undefined;
    }

    this.setEventId(response.data.event_id);
    room.addEvent(this);

    return response;
  }
}

export default MessageEvent;
