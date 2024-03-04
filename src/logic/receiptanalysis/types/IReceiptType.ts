import Receipt from '@/logic/receiptanalysis/Receipt';

interface IReceiptType {
  /**
   * Tells the RecieptScanner whether it can analyze the given receipt lines.
   * @param {string[]} lines the lines of the receipt
   * @return {boolean} true if the receipt can be analyzed with this receipt type, false otherwise
   */
  canAnalyze(lines: string[]): boolean;

  analyze(lines: string[]): Receipt;
}

export {type IReceiptType};
