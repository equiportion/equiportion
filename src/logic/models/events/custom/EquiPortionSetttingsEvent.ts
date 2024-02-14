import StateEvent from '../StateEvent';
import MatrixEvent from '../MatrixEvent';
import type {RawMatrixEvent} from '../RawMatrixEvent';
import {useRoomsStore} from '@/stores/rooms';

/**
 * A event containing all information and settings for EquiPortion of a room.
 * This event is also used to determine whether a room is visible in the room list.
 *
 * @author Philipp Stappert
 */
class EquiPortionSettingsEvent extends StateEvent {
  public static TYPE = 'edu.kit.kastel.dsn.pse.equiportion_settings';

  private activateApp: boolean;

  /**
   * Creates a new EquiPortionSettingsEvent
   * @param {string} eventId the eventId of this event
   * @param {string} roomId the roomId of the room this event is published to
   * @param {boolean} activateApp whether the room should be visible and usable in EquiPortion
   */
  constructor(eventId: string, roomId: string, activateApp: boolean) {
    // always use empty state key for this event as there is only one EquiPortionSettingsEvent per room
    super(eventId, roomId, '');

    this.activateApp = activateApp;
  }

  /**
   * Tries to parse the given event into a TransactionEvent.
   * @static
   * @param {RawMatrixEvent} rawMatrixEvent the event to parse
   * @param {string} [roomId] the roomId of the room this event is published to
   * @returns {MatrixEvent|undefined} either the parsed event or undefined if the event could not be parsed (type mismatch)
   */
  public static fromRawMatrixEvent(
    rawMatrixEvent: RawMatrixEvent,
    roomId?: string
  ): MatrixEvent | undefined {
    if (rawMatrixEvent.type !== this.TYPE) {
      return undefined;
    }

    return new EquiPortionSettingsEvent(
      rawMatrixEvent.event_id,
      roomId ?? rawMatrixEvent.room_id,
      rawMatrixEvent.content.activate_app
    );
  }

  /**
   * Executes this event on its room.
   * @returns {void}
   */
  public execute(): void {
    const roomsStore = useRoomsStore();
    const room = roomsStore.getRoom(this.getRoomId());
    room?.setVisible(this.activateApp);
  }

  /**
   * Gets the content of this event as a Json object (for matrix api).
   * @returns {{}} the content of this event
   */
  public toEventContent(): {} {
    const eventContent: any = {
      activate_app: this.activateApp,
    };

    return eventContent;
  }

  /**
   * Gets the type of this event.
   * @returns {string} the type of this event
   */
  public getType(): string {
    return EquiPortionSettingsEvent.TYPE;
  }

  /**
   * Gets whether the room should be visible and usable in EquiPortion.
   * @returns {boolean} whether the room should be visible and usable in EquiPortion
   */
  public getActivateApp(): boolean {
    return this.activateApp;
  }
}

export default EquiPortionSettingsEvent;
