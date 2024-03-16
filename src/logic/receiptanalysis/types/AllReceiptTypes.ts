import {type IReceiptType} from './IReceiptType';

// generic
import SummeEurSum from './generic/SummeEurSum';
import PaymentMethodSum from './generic/PaymentMethodSum';

/**
 * Util to get all receipt types in order they should be checked (most confident types first).
 * @returns {IReceiptType[]} all receipt types in order by confidence (most confident first)
 */
function allReceiptTypesInOrder(): IReceiptType[] {
  return [new SummeEurSum(), new PaymentMethodSum()];
}

export {allReceiptTypesInOrder};
