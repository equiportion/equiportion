function eurosPart(num: number): string {
  return Math.floor(num / 100).toString();
}

function absEurosPart(num: number): string {
  if (num < 0) {
    // remove minus string
    num = Math.abs(num);
  }
  return Math.floor(num / 100).toString();
}

function centsPart(num: number): string {
  return ('00' + (num % 100)).slice(-2);
}

function absCentsPart(num: number): string {
  if (num < 0) {
    // remove minus string
    num = Math.abs(num);
  }

  return ('00' + (num % 100)).slice(-2);
}

/**
 * Function to allow both the old format (float as string) and the new format (amount in cents as number) for the sum and the debtors.
 * @param {string|number} amount the amount to parse
 * @returns {number} the parsed amount (in cents)
 */
function parseMoney(amount: string | number): number {
  if (typeof amount === 'string') {
    return floatToCents(parseFloat(amount));
  } else {
    return amount;
  }
}

/**
 * Converts a float (e.g. 12,34€) to cents.
 * @param {number} float the float to convert
 * @returns {number} the converted float
 */
function floatToCents(float: number): number {
  return Math.round(float * 100);
}

export {eurosPart, absEurosPart, centsPart, absCentsPart, parseMoney, floatToCents};
