import Receipt from '@/logic/receiptanalysis/Receipt';

/**
 * Interface for receipt types.
 * A receipt type is a specific way a receipt can be read to extract the sum and other information.
 *
 * @author Philipp Stappert
 */
interface IReceiptType {
  /**
   * Tells the RecieptScanner whether it can analyze the given receipt lines.
   * @param {string[]} lines the lines of the receipt
   * @return {boolean} true if the receipt can be analyzed with this receipt type, false otherwise
   */
  canAnalyze(lines: string[]): boolean;

  /**
   * Analyzes the given receipt lines and extracts the relevant information as a Receipt object.
   * @param {string[]} lines the lines of the receipt
   * @return {Receipt} the analyzed receipt
   */
  analyze(lines: string[]): Receipt;
}

export {type IReceiptType};
