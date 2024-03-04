/**
 * Represents a (analyzed and processed) receipt.
 * @author Philipp Stappert
 */
class Receipt {
  private sum: number;

  /**
   * Creates a new Receipt.
   * @param sum the sum of the receipt (as € in cents, e.g. 1234 for 12,34€)
   */
  constructor(sum: number) {
    this.sum = sum;
  }

  /**
   * Returns the sum of the receipt.
   * @returns {number} the sum of the receipt (as € in cents, e.g. 1234 for 12,34€)
   */
  getSum(): number {
    return this.sum;
  }
}

export default Receipt;
