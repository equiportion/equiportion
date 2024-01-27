import {useLoggedInUserStore} from '@/stores/loggedInUser';
import {type ICompensationAlgorithm} from './ICompensationAlgorithm';
import Room from '@/logic/models/Room';

/**
 * A compensation algorithm which calculates how much a user has to pay to which person and how much a user gets from which person.
 * This algorithm is optimal in the total value of compensation-transactions and produces no more than n-1 compensation-transactions,
 * where n ist the number of users in the room.
 *
 * @implements {ICompensationAlgorithm}
 */
class BipartiteCompensation implements ICompensationAlgorithm {
  /**
   * Calculates the compensation for the given room. This algorithm is optimal in the total value of compensation-transactions and
   * produces no more than n-1 compensation-transactions, where n ist the number of users that have a balance-total != 0.
   * @param {Room} room the room
   * @return {{[userId: string]: number}} the compensation, a positive number means that the user has to pay, a negative number means that the user gets money
   */
  public calculateCompensation(room: Room): {[userId: string]: number} {
    const compensation: {[userId: string]: number} = {};

    // get own user id
    const loggedInUserId = useLoggedInUserStore().user.getUserId();

    // get balance-totals
    const balances = room.getBalances();
    const balanceTotals = this.calculateBalanceTotals(balances); // corresponds to K in this algorithm's pseudocode in the documentation
    console.log(`${Object.keys(balanceTotals).length} members`);

    let iteration = 0;

    while (!this.isSettled(balanceTotals)) {
      if (iteration >= Object.keys(balanceTotals).length - 1) {
        // this should not happen (see documentation) and is meant as a failsafe
        throw new Error('Calculating compensations failed due to faulty values');
      }

      // get users v1, v2 with K[v1] > 0 and K[v2] < 0
      let userIdPositive;
      let userIdNegative;
      for (const userId in balanceTotals) {
        if (userIdPositive && userIdNegative) {
          break;
        }

        if (!userIdPositive && balanceTotals[userId] > 0) {
          userIdPositive = userId;
        } else if (!userIdNegative && balanceTotals[userId] < 0) {
          userIdNegative = userId;
        }
      }

      // get the minimum absolute value of the balance totals
      const minAbsoluteBalanceTotal = Math.min(
        balanceTotals[userIdPositive!],
        -balanceTotals[userIdNegative!]
      );

      // add compensation if the logged in user is involved
      if (loggedInUserId === userIdPositive) {
        compensation[userIdNegative!] = -minAbsoluteBalanceTotal;
      } else if (loggedInUserId === userIdNegative) {
        compensation[userIdPositive!] = minAbsoluteBalanceTotal;
      }

      // update balance-totals
      balanceTotals[userIdPositive!] -= minAbsoluteBalanceTotal;
      balanceTotals[userIdNegative!] += minAbsoluteBalanceTotal;

      iteration++;
    }

    return compensation;
  }

  /**
   * Checks if all balance-total are == 0.
   * @param {{[userId: string]: number}} balanceTotals the balance-totals to check
   * @returns {boolean} true if all balance-total are == 0, false otherwise
   */
  private isSettled(balanceTotals: {[userId: string]: number}): boolean {
    for (const balanceTotal of Object.values(balanceTotals)) {
      if (balanceTotal != 0) {
        return false;
      }
    }

    return true;
  }

  /**
   * Calculates balance-totals for each user using balances between two users.
   * @param {{[userIds: string]: number}} balances the balances between two users
   * @returns {{[userId: string]: number}} the balance-totals for each user
   */
  private calculateBalanceTotals(balances: {[userIds: string]: number}): {
    [userId: string]: number;
  } {
    const balanceTotals: {[userId: string]: number} = {};

    for (const userIds in balances) {
      // Separate user-IDs
      const userId2Position = userIds.indexOf('@', 1);
      const userId1 = userIds.substring(0, userId2Position);
      const userId2 = userIds.substring(userId2Position);

      // Initialize balance-totals if necessary
      if (!balanceTotals[userId1]) {
        balanceTotals[userId1] = 0;
      }
      if (!balanceTotals[userId2]) {
        balanceTotals[userId2] = 0;
      }

      // Add Balance to balance-totals
      const balance = balances[userIds];
      balanceTotals[userId1] -= balance;
      balanceTotals[userId2] += balance;
    }

    return balanceTotals;
  }
}

export default BipartiteCompensation;
