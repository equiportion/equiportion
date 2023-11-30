import type PaymentInformation from '@/logic/models/PaymentInformation';
import StateEvent from './StateEvent';
import eventTypes from '@/logic/constants/eventTypes';

class PaymentInformationEvent extends StateEvent {
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
