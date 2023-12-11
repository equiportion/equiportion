import apiEndpoints from '@/logic/constants/apiEndpoints';
import MatrixEvent from './MatrixEvent';
import AuthenticatedMatrixClient from '../clients/AuthenticatedMatrixClient';
import {useClientStateStore} from '@/stores/clientState';
import type {AxiosResponse} from 'axios';

/**
 * A message event modelled after the matrix specs.
 */
abstract class MessageEvent extends MatrixEvent {
  /**
   * Publishes this event to the matrix homeserver.
   * @returns {Promise<AxiosResponse | undefined>} a Promise that resolves to the HTTP response or undefined if the request failed
   */
  public async publish(): Promise<AxiosResponse | undefined> {
    const client = AuthenticatedMatrixClient.getClient();
    const clientStateStore = useClientStateStore();

    const url = apiEndpoints.putMessageEvent(
      this.getRoomId(),
      this.getType(),
      clientStateStore.transactionId
    );
    const data = this.getContent();

    const response = await client.putRequest(url, data);

    if (!response?.data.event_id) {
      return undefined;
    }

    clientStateStore.incrementTransactionId();
    this.setEventId(response.data.event_id);

    return response;
  }
}

export default MessageEvent;
