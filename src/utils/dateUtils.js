export const parseDate = (dateStr) => {
  if (!dateStr) return null;
  if (dateStr instanceof Date) return dateStr;
  
  const cleanStr = String(dateStr).trim();
  if (!cleanStr) return null;
  
  // Regular expression to match DD/MM/YYYY (with / or - separator, optionally followed by time)
  const dmyRegex = /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})(?:\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?$/;
  const match = cleanStr.match(dmyRegex);
  
  if (match) {
    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10) - 1; // Month is 0-indexed in JS
    let year = parseInt(match[3], 10);
    if (year < 100) {
      year += year < 50 ? 2000 : 1900;
    }
    const hour = match[4] ? parseInt(match[4], 10) : 0;
    const minute = match[5] ? parseInt(match[5], 10) : 0;
    const second = match[6] ? parseInt(match[6], 10) : 0;
    
    const parsedDate = new Date(year, month, day, hour, minute, second);
    if (!isNaN(parsedDate.getTime())) {
      return parsedDate;
    }
  }
  
  const standardDate = new Date(cleanStr);
  if (!isNaN(standardDate.getTime())) {
    return standardDate;
  }
  
  return null;
};

export const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  try {
    const date = parseDate(dateStr);
    if (!date) return dateStr;
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
  } catch (e) {
    return dateStr;
  }
};

export const getRelativeTime = (dateStr) => {
  if (!dateStr) return '';
  try {
    const date = parseDate(dateStr);
    if (!date) return '';
    const now = new Date();
    
    // กรณีทำรายการวันนี้ ให้ขึ้นคำว่า วันนี้
    if (date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()) {
      return 'วันนี้';
    }

    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 0) return ''; // Future dates
    if (diffInSeconds < 60) return 'เมื่อครู่';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} นาทีที่แล้ว`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} ชม.ที่แล้ว`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} วันที่แล้ว`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} สัปดาห์ที่แล้ว`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} เดือนที่แล้ว`;
    return `${Math.floor(diffInSeconds / 31536000)} ปีที่แล้ว`;
  } catch (e) {
    return '';
  }
};

export const getTimeColor = (dateStr) => {
  if (!dateStr) return '';
  try {
    const date = parseDate(dateStr);
    if (!date) return '';
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    const diffInMonths = diffInSeconds / (30 * 24 * 3600);
    
    if (diffInMonths <= 1) return 'time-fresh';
    if (diffInMonths <= 12) return 'time-warning-2';
    return 'time-danger';
  } catch (e) {
    return '';
  }
};

export const getHoldingAge = (firstBuyDateStr, lastSellDateStr, status) => {
  if (!firstBuyDateStr) return '';
  try {
    const startDate = parseDate(firstBuyDateStr);
    if (!startDate) return '';
    
    let endDate = new Date();
    if (status === 'ขายแล้ว' && lastSellDateStr) {
      const sellDate = parseDate(lastSellDateStr);
      if (sellDate) {
        endDate = sellDate;
      }
    }
    
    let years = endDate.getFullYear() - startDate.getFullYear();
    let months = endDate.getMonth() - startDate.getMonth();
    let days = endDate.getDate() - startDate.getDate();
    
    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 0);
      days += prevMonth.getDate();
    }
    
    if (months < 0) {
      years -= 1;
      months += 12;
    }
    
    const parts = [];
    if (years > 0) {
      parts.push(`${years} ปี`);
    }
    if (months > 0) {
      parts.push(`${months} เดือน`);
    }
    if (days > 0 || parts.length === 0) {
      parts.push(`${days} วัน`);
    }
    
    return parts.join(' ');
  } catch (e) {
    return '';
  }
};
