import type RoomEventFilter from './RoomEventFilter';
import type StateFilter from './StateFilter';

class RoomFilter {
  private accountData: RoomEventFilter;
  private rooms: string[];
  private state: StateFilter;
  private timeline: RoomEventFilter;
}

export default RoomFilter;
