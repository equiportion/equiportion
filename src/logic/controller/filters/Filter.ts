import type RoomFilter from './RoomFilter';

//Modeled according to https://spec.matrix.org/v1.8/client-server-api/#api-endpoints

class Filter {
  private eventFields?: string[];
  private room?: RoomFilter;

  constructor(eventFields?: string[], room?: RoomFilter) {
    this.eventFields = eventFields;
    this.room = room;
  }
}

export default Filter;
