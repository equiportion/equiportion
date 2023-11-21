import type PaymentInformation from '@/logic/models/PaymentInformation';
import StateEvent from './StateEvent';

class PaymentInformationEvent extends StateEvent {
  public static eventType = 'edu.kit.dsn.pse.payment_information';

  constructor(roomId: string, userId: string, paymentInformations: PaymentInformation[]) {
    const paymentInformationsJson = [];
    for (const paymentInformation of paymentInformations) {
      paymentInformationsJson.push(paymentInformation.toJson());
    }
    const content = Object.assign({}, paymentInformationsJson);

    super(roomId, PaymentInformationEvent.eventType, content, userId);
  }

  public static getGetUrl(roomId: string, userId: string) {
    return `/_matrix/client/v3/rooms/${roomId}/state/${PaymentInformationEvent.eventType}/${userId}`;
  }
}

export default PaymentInformationEvent;
