import Room from '@/logic/models/Room';

/**
 * A compensation algorithm which calculates how much a user has to pay to which person and how much a user gets from which person.
 */
interface ICompensationAlgorithm {
  /**
   * Calculates the compensation for the given room.
   * @param {Room} room the room
   * @return {{[userId: string]: number}} the compensation, a positive number means that the user has to pay, a negative number means that the user gets money
   */
  calculateCompensation(room: Room): {[userId: string]: number};
}

export {type ICompensationAlgorithm};
