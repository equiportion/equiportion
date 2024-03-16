import MRoomAvatarEvent from './matrix/MRoomAvatarEvent';
import MRoomMemberEvent from './matrix/MRoomMemberEvent';
import MRoomNameEvent from './matrix/MRoomNameEvent';
import MRoomTopicEvent from './matrix/MRoomTopicEvent';
import MatrixEvent from './MatrixEvent';
import type {MatrixEventConstructor} from './MatrixEventConstructor';
import type {RawMatrixEvent} from './RawMatrixEvent';
import TransactionEvent from './custom/TransactionEvent';
import EventParseError from './EventParseError';
import EquiPortionSettingsEvent from './custom/EquiPortionSetttingsEvent';

/**
 * Parses events received from the Matrix API as json objects to MatrixEvent objects.
 * This class is a singleton for performance reasons.
 * @author Clara Gießibl
 * @author Philipp Stappert
 */
class EventParser {
  private eventImplementations: {[key: string]: MatrixEventConstructor} = {};
  private static instance: EventParser;

  /**
   * Creates a new EventParser.
   */
  private constructor() {
    // add all event types that can be parsed
    this.addEventImplementation(MRoomAvatarEvent);
    this.addEventImplementation(MRoomMemberEvent);
    this.addEventImplementation(MRoomNameEvent);
    this.addEventImplementation(MRoomTopicEvent);
    this.addEventImplementation(TransactionEvent);
    this.addEventImplementation(EquiPortionSettingsEvent);
  }

  /**
   * Adds an event implementation to the parser.
   * All events of this type will be parsed to this implementation.
   * @param {MatrixEventConstructor} implementation the implementation to add
   */
  private addEventImplementation(implementation: MatrixEventConstructor): void {
    const instance = new implementation();
    this.eventImplementations[instance.getType()] = implementation;
  }

  /**
   * Gets the instance of this singleton.
   * @returns {EventParser} the instance
   */
  private static getInstance(): EventParser {
    if (!EventParser.instance) {
      EventParser.instance = new EventParser();
    }

    return EventParser.instance;
  }

  /**
   * Parses an event received from the Matrix API as a json object to a new MatrixEvent object.
   *
   * @static
   * @param {RawMatrixEvent} rawMatrixEvent the event as a json object
   * @returns {MatrixEvent|undefined} the MatrixEvent object
   */
  public static rawMatrixEventToMatrixEvent(
    rawMatrixEvent: RawMatrixEvent,
    roomId?: string
  ): MatrixEvent | undefined {
    return EventParser.getInstance().parseRawMatrixEvent(rawMatrixEvent, roomId);
  }

  /**
   * Parses an event received from the Matrix API as a json object to a new MatrixEvent object.
   * @param rawMatrixEvent the event as a json object
   * @returns the MatrixEvent object
   */
  private parseRawMatrixEvent(
    rawMatrixEvent: RawMatrixEvent,
    roomId?: string
  ): MatrixEvent | undefined {
    try {
      const eventType = rawMatrixEvent.type as string;
      const implementation = this.eventImplementations[eventType];

      if (implementation) {
        return implementation.fromRawMatrixEvent(rawMatrixEvent, roomId);
      }

      return undefined;
    } catch (error) {
      console.error(error);
      throw new EventParseError();
    }
  }
}

export default EventParser;
