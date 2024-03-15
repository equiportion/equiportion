import type RoomFilter from './RoomFilter';

/**
 * Filter for Matrix event apis
 *
 * @author Clara Gießibl
 */
class Filter {
  private eventFields?: string[];
  private room?: RoomFilter;

  constructor(eventFields?: string[], room?: RoomFilter) {
    this.eventFields = eventFields;
    this.room = room;
  }

  public toJson() {
    return {
      event_fields: this.eventFields,
      room: this.room?.toJson(),
    };
  }
}

export default Filter;
