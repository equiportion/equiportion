import type PaymentInformation from '@/logic/models-old/payment-information/PaymentInformation';
import StateEvent from '../StateEvent';
import eventTypes from '@/logic/constants/eventTypes';

/**
 * A payment information event modelled after this project's documentation.
 */
class PaymentInformationEvent extends StateEvent {
  /**
   * Creates a new payment information event.
   * @param roomId the roomId of the room this event is published to
   * @param userId the userId of the user publishing this event
   * @param paymentInformations the user's payment information that is published using this event
   */
  constructor(roomId: string, userId: string, paymentInformations: PaymentInformation[]) {
    const paymentInformationsJson = [];
    for (const paymentInformation of paymentInformations) {
      paymentInformationsJson.push(paymentInformation.toJson());
    }
    const content = Object.assign({}, paymentInformationsJson);

    super(roomId, eventTypes.paymentInformation, content, userId);
  }
}

export default PaymentInformationEvent;
