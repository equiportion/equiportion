import type RoomEventFilter from './RoomEventFilter';
import StateFilter from './StateFilter';

class RoomFilter {
  private rooms?: string[];
  private state?: StateFilter;
  private timeline?: RoomEventFilter;

  constructor(rooms?: string[], state?: StateFilter, timeline?: RoomEventFilter) {
    this.rooms = rooms;
    this.state = state;
    this.timeline = timeline;
  }
}

export default RoomFilter;
