import Filter from '@/logic/models/filters/Filter';
import RoomFilter from '@/logic/models/filters/RoomFilter';
import RoomEventFilter from '@/logic/models/filters/RoomEventFilter';

import MRoomAvatarEvent from '@/logic/models/events/matrix/MRoomAvatarEvent';
import MRoomMemberEvent from '@/logic/models/events/matrix/MRoomMemberEvent';
import MRoomNameEvent from '@/logic/models/events/matrix/MRoomNameEvent';
import MRoomTopicEvent from '@/logic/models/events/matrix/MRoomTopicEvent';
import EquiPortionSettingsEvent from '@/logic/models/events/custom/EquiPortionSetttingsEvent';
import TransactionEvent from '@/logic/models/events/custom/TransactionEvent';

/**
 * Standard filter for Matrix event api for this application
 * @returns a filter for the Matrix event api
 */
function getFilterJson() {
  const roomEventFilter = new RoomEventFilter(undefined, undefined, [
    MRoomAvatarEvent.TYPE,
    MRoomMemberEvent.TYPE,
    MRoomNameEvent.TYPE,
    MRoomTopicEvent.TYPE,
    EquiPortionSettingsEvent.TYPE,
    TransactionEvent.TYPE,
  ]);

  const roomFilter = new RoomFilter(undefined, undefined, roomEventFilter);
  const filter = new Filter(undefined, roomFilter);

  return filter.toJson();
}

export default getFilterJson;
