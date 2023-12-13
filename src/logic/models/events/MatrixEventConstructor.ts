import MatrixEvent from './MatrixEvent';
import type {RawMatrixEvent} from './RawMatrixEvent';

/**
 * A MatrixEvent constructor.
 * Describes the static part of the MatrixEvent class.
 * @author Philipp Stappert
 */
interface MatrixEventConstructor {
  new (...args: any[]): MatrixEvent;

  /**
   * Tries to parse the given event into a MatrixEvent.
   * @static
   * @param {RawMatrixEvent} event the event to parse
   * @param {string} [roomId] the roomId of the room this event is published to
   * @returns {MatrixEvent|undefined} Either the parsed event or undefined if the event could not be parsed (type missmatch)
   */
  fromEvent(event: RawMatrixEvent, roomId?: string): MatrixEvent | undefined;
}

export type {MatrixEventConstructor};
