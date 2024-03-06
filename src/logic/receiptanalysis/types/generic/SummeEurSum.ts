import type {IReceiptType} from '../IReceiptType';
import Receipt from '@/logic/receiptanalysis/Receipt';

/**
 * Receipt type for the sum of the receipt in EUR.
 * Example: "Summe € 12,34", "Summe Eur 12,34"
 * @implements {IReceiptType}
 */
class SummeEurSum implements IReceiptType {
  private static readonly REGEX = /^(summe|total|betrag) (€|Eur)? ?\d{1,4}[,|.]\d{2}\D*$/gim;

  canAnalyze(lines: string[]): boolean {
    let found = false;

    lines.forEach((line) => {
      if (line.match(SummeEurSum.REGEX)) {
        found = true;
      }
    });

    return found;
  }

  analyze(lines: string[]): Receipt {
    let sum = -1;

    // find sum
    lines.forEach((line) => {
      if (line.match(SummeEurSum.REGEX)) {
        // extract sum from line (get string with only digits)
        const sumString = line.match(/\d{1,4}[,|.]\d{2}/gim);
        if (sumString === null) {
          throw new Error('Could not extract sum from line!');
        }

        // remove , and . from sumString and parse to int
        sum = parseInt(sumString[0].replace(/,|\./g, ''), 10);
      }
    });

    if (sum === -1) {
      throw new Error('Could not find sum in receipt lines!');
    }

    // create receipt with sum
    return new Receipt(sum);
  }
}

export default SummeEurSum;
