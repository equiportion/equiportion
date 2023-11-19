class StateFilter {
  private limit?: number;
  private rooms?: string[];
  private types?: string[];

  constructor(limit?: number, rooms?: string[], types?: string[]) {
    this.limit = limit;
    this.rooms = rooms;
    this.types = types;
  }
}

export default StateFilter;
