import { parseNumber, calculateTargetAmount } from './numberUtils';

export const getSortValue = (stock, option, originalIdx) => {
  switch (option) {
    case 'ลำดับที่': {
      const order = parseNumber(stock["ลำดับการซื้อ"]);
      return isNaN(order) || order === 0 ? originalIdx : order;
    }
    case 'มูลค่าตลาด':
      return parseNumber(stock["มูลค่าตลาด ($)"]);
    case 'ราคาหุ้น':
      return parseNumber(stock["ราคาหุ้น ($)"]);
    case 'ปันผล':
      return parseNumber(stock["อัตราปันผล (%)"]);
    case 'ราคาตั้งซื้อ':
      return parseNumber(stock["ราคาตั้งซื้อ ($)"]);
    case 'ยอดตั้งซื้อ': {
      const targetPrice = parseNumber(stock["ราคาตั้งซื้อ ($)"]);
      const targetAmount = targetPrice > 0 ? calculateTargetAmount(stock["วันที่กำหนด"], stock["ราคาตั้งซื้อ ($)"]) : 0;
      return (stock.port === 'Trade' || targetPrice <= 0)
        ? 0
        : targetAmount - parseNumber(stock["ยอดซื้อ ($)"]) + parseNumber(stock["ยอดขาย ($)"]);
    }
    case 'ยอดซื้อ':
      return parseNumber(stock["ยอดซื้อ ($)"]);
    case 'ยอดขาย':
      return parseNumber(stock["ยอดขาย ($)"]);
    case 'ยอดกำไร':
      return stock["สถานะ"] === "ขายแล้ว" || stock["สถานะ"] === "รอซื้อ"
        ? parseNumber(stock["ยอดขาย ($)"]) - parseNumber(stock["ยอดซื้อ ($)"])
        : 0;
    case 'ยอดปันผล':
      return parseNumber(stock["ยอดปันผล ($)"]);
    case 'ยอดภาษี': {
      const taxVal = stock["ภาษีปันผล ($)"] || stock["ภาษี ($)"] || stock["ยอดภาษี ($)"] || 0;
      return parseNumber(taxVal);
    }
    case 'กำไรสุทธิ': {
      const totalProfit = stock["สถานะ"] === "ขายแล้ว" || stock["สถานะ"] === "รอซื้อ"
        ? parseNumber(stock["ยอดขาย ($)"]) - parseNumber(stock["ยอดซื้อ ($)"])
        : 0;
      const taxVal = stock["ภาษีปันผล ($)"] || stock["ภาษี ($)"] || stock["ยอดภาษี ($)"] || 0;
      const clearVal = stock["ยอดกำจัด ($)"] || stock["clear_amount"] || 0;
      return totalProfit + (parseNumber(stock["ยอดปันผล ($)"]) - parseNumber(taxVal)) - parseNumber(clearVal);
    }
    default:
      return originalIdx;
  }
};
export const sortData = (stocks, sortBy) => { return [...stocks].sort((a, b) => { const valA = getSortValue(a, sortBy, stocks.indexOf(a)); const valB = getSortValue(b, sortBy, stocks.indexOf(b)); if (sortBy === 'ลำดับที่') { return valA - valB; } return valB - valA; }); };
