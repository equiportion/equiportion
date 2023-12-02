const customEventTypePrefix = 'edu.kit.kastel.dsn.pse.';

const eventTypes = {
  roomMember: 'm.room.member',
  roomName: 'm.room.name',
  roomAvatar: 'm.room.avatar',
  roomTopic: 'm.room.topic',
  paymentInformation: customEventTypePrefix + 'payment_information',
  transaction: customEventTypePrefix + 'transaction',
};

export default eventTypes;
