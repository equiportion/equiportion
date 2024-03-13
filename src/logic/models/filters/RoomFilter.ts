import type RoomEventFilter from './RoomEventFilter';
import StateFilter from './StateFilter';

/**
 * Filters rooms
 * 
 * @author Clara Gießibl
 */
class RoomFilter {
  private rooms?: string[];
  private state?: StateFilter;
  private timeline?: RoomEventFilter;

  constructor(rooms?: string[], state?: StateFilter, timeline?: RoomEventFilter) {
    this.rooms = rooms;
    this.state = state;
    this.timeline = timeline;
  }

  public toJson() {
    return {
      rooms: this.rooms,
      state: this.state?.toJson(),
      timeline: this.timeline?.toJson(),
    };
  }
}

export default RoomFilter;
