import { parseDate } from './dateUtils';

export const parseNumber = (val) => {
  if (val === undefined || val === null || val === '') return 0;
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  const cleaned = String(val).replace(/[^0-9.-]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};

export const parsePercentChange = (val) => {
  if (val === undefined || val === null || val === '') return null;
  const strVal = String(val).trim();
  if (!strVal) return null;
  const cleanStr = strVal.replace('%', '');
  const parsed = parseFloat(cleanStr);
  return isNaN(parsed) ? null : parsed;
};

export const calculateTargetAmount = (startDateStr, pricePerMonth) => {
  if (!startDateStr || !pricePerMonth) return 0;
  try {
    const start = parseDate(startDateStr);
    const now = new Date();
    if (!start) return 0;
    
    const years = now.getFullYear() - start.getFullYear();
    const months = (years * 12) + (now.getMonth() - start.getMonth());
    return Math.max(0, months) * pricePerMonth;
  } catch (e) {
    return 0;
  }
};

export const formatCurrency = (val) => {
  const isNegative = val < 0;
  const absVal = Math.abs(val);
  let formatted = '';
  if (absVal >= 1e12) formatted = `${(absVal / 1e12).toFixed(2)}T`;
  else if (absVal >= 1e9) formatted = `${(absVal / 1e9).toFixed(2)}B`;
  else if (absVal >= 1e6) formatted = `${(absVal / 1e6).toFixed(2)}M`;
  else formatted = absVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  
  return isNegative ? `-$${formatted}` : `$${formatted}`;
};

export const formatTHB = (val) => {
  const isNegative = val < 0;
  const absVal = Math.abs(val);
  let formatted = '';
  if (absVal >= 1e12) formatted = `${(absVal / 1e12).toFixed(2)}T`;
  else if (absVal >= 1e9) formatted = `${(absVal / 1e9).toFixed(2)}B`;
  else if (absVal >= 1e6) formatted = `${(absVal / 1e6).toFixed(2)}M`;
  else formatted = absVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  
  return isNegative ? `≈ -฿${formatted}` : `≈ ฿${formatted}`;
};

export const maskFormattedMoney = (str) => {
  if (!str) return '';
  const firstDigitIndex = str.search(/\d/);
  if (firstDigitIndex === -1) return str;
  
  const prefix = str.slice(0, firstDigitIndex);
  const numericPart = str.slice(firstDigitIndex);
  
  const numToMask = Math.floor(numericPart.length / 2.5);
  let maskedDigitsCount = 0;
  let maskedNumericPart = '';
  for (let i = 0; i < numericPart.length; i++) {
    const char = numericPart[i];
    if (/\d/.test(char) && maskedDigitsCount < numToMask) {
      maskedNumericPart += '*';
      maskedDigitsCount++;
    } else {
      maskedNumericPart += char;
    }
  }
  
  return prefix + maskedNumericPart;
};
