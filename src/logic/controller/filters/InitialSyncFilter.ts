import Filter from './Filter';
import RoomEventFilter from './RoomEventFilter';
import RoomFilter from './RoomFilter';
import StateFilter from './StateFilter';

class InitialSyncFilter extends Filter {
  constructor() {
    const eventFields: string[] = [];
    const roomTimelineTypes: string[] = [];

    const roomState = new StateFilter();
    const roomTimeline = new RoomEventFilter(10, undefined, roomTimelineTypes);
    const initSyncRoom = new RoomFilter(undefined, roomState, roomTimeline);
    super(eventFields, initSyncRoom);
  }
}

export default InitialSyncFilter;
