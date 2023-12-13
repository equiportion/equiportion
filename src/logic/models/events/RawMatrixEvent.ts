/**
 * Describes a raw Matrix event (as received from the Matrix API)
 * @author Philipp Stappert
 */
type RawMatrixEvent = {
  content: any;
  event_id: string;
  origin_server_ts: number;
  room_id: string;
  sender: string;
  state_key?: string;
  type: string;
  unsigned: any;
};

export type {RawMatrixEvent};
