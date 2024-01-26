import {useLoggedInUserStore} from '@/stores/loggedInUser';
import {type ICompensationAlgorithm} from './ICompensationAlgorithm';
import Room from '@/logic/models/Room';

/**
 * A compensation algorithm which calculates how much a user has to pay to which person and how much a user gets from which person.
 * This algorithm is not optimized and will calculate just the difference between the logged in user and any other user.
 * @author Philipp Stappert
 *
 * @implements {ICompensationAlgorithm}
 */
class NonOptimizedCompensation implements ICompensationAlgorithm {
  /**
   * Calculates the compensation for the given room. This algorithm is not optimized and will calculate just the difference between the logged in user and any other user.
   * @param {Room} room the room
   * @return {{[userId: string]: number}} the compensation, a positive number means that the user has to pay, a negative number means that the user gets money
   */
  public calculateCompensation(room: Room): {[userId: string]: number} {
    const compensation: {[userId: string]: number} = {};

    // get own user id
    const ownUserId = useLoggedInUserStore().user.getUserId();

    // get all members of the room
    const members = room.getMembers(['member', 'left']);
    const userIds = Object.keys(members);

    // get balances
    const balances = room.getBalances();

    // loop over all members
    userIds.forEach((userId: string) => {
      // skip own user
      if (userId === ownUserId) {
        return;
      }

      // get combined user ids and direction of balance
      const userIdList: string[] = [userId, ownUserId].sort();
      const orderChangeIndicator: boolean = userIdList[1] == ownUserId;
      const userIdsCombined: string = userIdList.join('');

      // get balance
      const balance: number = (balances[userIdsCombined] ?? 0) * (-1) ** Number(orderChangeIndicator);

      // add balance to compensation
      compensation[userId] = balance;
    });

    return compensation;
  }
}

export default NonOptimizedCompensation;
