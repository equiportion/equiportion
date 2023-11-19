import type EventFilter from './EventFilter';
import type RoomFilter from './RoomFilter';

//Modeled according to https://spec.matrix.org/v1.8/client-server-api/#api-endpoints

class Filter {
  public static initialSyncFilter = new Filter();

  private eventFields: string[];
  private room: RoomFilter;

  constructor(accountData: EventFilter, eventFields: string[], room: RoomFilter) {
    this.accountData = accountData;
    this.eventFields = eventFields;
    this.room = room;
  }
}

export default Filter;
