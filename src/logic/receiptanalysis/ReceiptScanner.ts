import Receipt from '@/logic/receiptanalysis/Receipt';
import {type IReceiptType} from '@/logic/receiptanalysis/types/IReceiptType';
import {allReceiptTypesInOrder} from '@/logic/receiptanalysis/types/AllReceiptTypes';

import {createWorker, PSM} from 'tesseract.js';

/**
 * Logic for scanning a receipt image and extracting the relevant information with OCR.
 * @author Philipp Stappert
 */
class ReceiptScanner {
  private receiptTypes: IReceiptType[] = [];

  /**
   * Creates a new ReceiptScanner.
   * Registers all available receipt types.
   */
  constructor() {
    this.receiptTypes = allReceiptTypesInOrder();
  }

  /**
   * Scans the given image and extracts the relevant information with OCR.
   * @param image the image of the receipt
   * @return the analyzed receipt or null if the receipt could not be analyzed
   */
  public async scan(image: File): Promise<Receipt | null> {
    // Init and configure Tesseract.js OCR worker
    const worker = await createWorker('deu');
    await worker.setParameters({
      tesseract_pageseg_mode: PSM.SINGLE_COLUMN,
      tessedit_char_whitelist:
        '0123456789.,€$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ\n AÖÜßäöü*-:()/#',
    });

    // Analyze image with OCR
    const {
      data: {text},
    } = await worker.recognize(image);

    // Split text into lines
    const lines = text.split('\n');

    // Analyze receipt
    const receipt = await this.analyzeReceipt(lines);

    // Close worker
    await worker.terminate();

    return receipt;
  }

  /**
   * Loops through all available receipt types and tries to analyze the given receipt lines.
   * @param lines the lines of the receipt
   * @return the analyzed receipt or null if the receipt could not be analyzed
   */
  private async analyzeReceipt(lines: string[]): Promise<Receipt | null> {
    for (const receiptType of this.receiptTypes) {
      if (receiptType.canAnalyze(lines)) {
        return receiptType.analyze(lines);
      }
    }
    return null;
  }
}

export default ReceiptScanner;
