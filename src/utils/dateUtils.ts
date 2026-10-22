import { PeriodType, DateRange, Transaction } from '../types';

const MONTH_NAMES_ID = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

const MONTH_NAMES_SHORT_ID = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des',
];

const DAY_NAMES_ID = [
  'Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu',
];

/**
 * Returns formatted ISO date string YYYY-MM-DD
 */
export function toDateString(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parses YYYY-MM-DD or ISO string into a local Date object safely
 */
export function parseLocalDate(dateStr: string): Date {
  const parts = dateStr.split('T')[0].split('-');
  if (parts.length === 3) {
    return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  }
  return new Date(dateStr);
}

/**
 * Calculates start and end dates for a given period type
 */
export function getDateRangeForPeriod(type: PeriodType, customRange?: DateRange): DateRange {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  switch (type) {
    case 'today': {
      const todayStr = toDateString(now);
      return { startDate: todayStr, endDate: todayStr };
    }
    case 'this_week': {
      // Week starts on Monday
      const day = now.getDay();
      const diffToMonday = (day + 6) % 7;
      const monday = new Date(now);
      monday.setDate(now.getDate() - diffToMonday);

      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);

      return {
        startDate: toDateString(monday),
        endDate: toDateString(sunday),
      };
    }
    case 'this_month': {
      const firstDay = new Date(currentYear, currentMonth, 1);
      const lastDay = new Date(currentYear, currentMonth + 1, 0);
      return {
        startDate: toDateString(firstDay),
        endDate: toDateString(lastDay),
      };
    }
    case 'last_month': {
      const firstDay = new Date(currentYear, currentMonth - 1, 1);
      const lastDay = new Date(currentYear, currentMonth, 0);
      return {
        startDate: toDateString(firstDay),
        endDate: toDateString(lastDay),
      };
    }
    case 'this_year': {
      const firstDay = new Date(currentYear, 0, 1);
      const lastDay = new Date(currentYear, 11, 31);
      return {
        startDate: toDateString(firstDay),
        endDate: toDateString(lastDay),
      };
    }
    case 'custom': {
      if (customRange) {
        return customRange;
      }
      const firstDay = new Date(currentYear, currentMonth, 1);
      const lastDay = new Date(currentYear, currentMonth + 1, 0);
      return {
        startDate: toDateString(firstDay),
        endDate: toDateString(lastDay),
      };
    }
  }
}

/**
 * Checks if a given date string falls within [startDate, endDate] inclusive
 */
export function isDateInRange(dateStr: string, range: DateRange): boolean {
  const target = dateStr.slice(0, 10);
  return target >= range.startDate && target <= range.endDate;
}

/**
 * Formats a date into friendly Indonesian string
 * e.g. "Senin, 19 Okt 2026" or "19 Okt 2026"
 */
export function formatDateIndonesian(
  dateInput: string | Date,
  options?: { showDay?: boolean; showTime?: boolean; shortMonth?: boolean }
): string {
  const d = typeof dateInput === 'string' ? parseLocalDate(dateInput) : dateInput;
  if (isNaN(d.getTime())) return '-';

  const dayName = DAY_NAMES_ID[d.getDay()];
  const day = d.getDate();
  const month = options?.shortMonth ? MONTH_NAMES_SHORT_ID[d.getMonth()] : MONTH_NAMES_ID[d.getMonth()];
  const year = d.getFullYear();

  let result = '';
  if (options?.showDay) {
    result += `${dayName}, `;
  }
  result += `${day} ${month} ${year}`;

  if (options?.showTime && typeof dateInput === 'string' && dateInput.includes('T')) {
    const rawDate = new Date(dateInput);
    const hours = String(rawDate.getHours()).padStart(2, '0');
    const minutes = String(rawDate.getMinutes()).padStart(2, '0');
    result += ` • ${hours}:${minutes}`;
  }

  return result;
}

/**
 * Formats a date range into a concise human-readable period badge
 * e.g. "1 Okt - 31 Okt 2026" or "Hari Ini (19 Okt)"
 */
export function formatPeriodLabel(type: PeriodType, range: DateRange): string {
  const start = parseLocalDate(range.startDate);
  const end = parseLocalDate(range.endDate);

  if (type === 'today') {
    return `Hari Ini (${start.getDate()} ${MONTH_NAMES_SHORT_ID[start.getMonth()]})`;
  }
  if (type === 'this_month') {
    return `${MONTH_NAMES_ID[start.getMonth()]} ${start.getFullYear()}`;
  }
  if (type === 'last_month') {
    return `${MONTH_NAMES_ID[start.getMonth()]} ${start.getFullYear()}`;
  }
  if (type === 'this_year') {
    return `Tahun ${start.getFullYear()}`;
  }

  const startDay = start.getDate();
  const endDay = end.getDate();
  const startMonth = MONTH_NAMES_SHORT_ID[start.getMonth()];
  const endMonth = MONTH_NAMES_SHORT_ID[end.getMonth()];
  const startYear = start.getFullYear();
  const endYear = end.getFullYear();

  if (startYear === endYear) {
    if (startMonth === endMonth) {
      if (startDay === endDay) {
        return `${startDay} ${startMonth} ${startYear}`;
      }
      return `${startDay} - ${endDay} ${startMonth} ${startYear}`;
    }
    return `${startDay} ${startMonth} - ${endDay} ${endMonth} ${startYear}`;
  }

  return `${startDay} ${startMonth} ${startYear} - ${endDay} ${endMonth} ${endYear}`;
}

export interface TransactionDateGroup {
  date: string;
  title: string;
  isToday: boolean;
  isYesterday: boolean;
  transactions: Transaction[];
  totalExpense: number;
  totalIncome: number;
}

/**
 * Groups an array of transactions by date (YYYY-MM-DD),
 * sorted chronologically with newest date groups first.
 */
export function groupTransactionsByDate(transactions: Transaction[]): TransactionDateGroup[] {
  if (!transactions || transactions.length === 0) return [];

  // Sort descending by date (newest first)
  const sorted = [...transactions].sort((a, b) => {
    const timeA = new Date(a.date).getTime();
    const timeB = new Date(b.date).getTime();
    return timeB - timeA;
  });

  const todayStr = toDateString(new Date());
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = toDateString(yesterday);

  const groupMap = new Map<string, TransactionDateGroup>();

  for (const tx of sorted) {
    const dateKey = tx.date ? tx.date.slice(0, 10) : todayStr;
    let group = groupMap.get(dateKey);

    if (!group) {
      const isToday = dateKey === todayStr;
      const isYesterday = dateKey === yesterdayStr;
      const dateFormatted = formatDateIndonesian(dateKey, { showDay: true, shortMonth: false });

      const prefix = isToday ? 'Hari Ini • ' : isYesterday ? 'Kemarin • ' : '';
      const title = `${prefix}${dateFormatted}`;

      group = {
        date: dateKey,
        title,
        isToday,
        isYesterday,
        transactions: [],
        totalExpense: 0,
        totalIncome: 0,
      };
      groupMap.set(dateKey, group);
    }

    group.transactions.push(tx);
    if (tx.type === 'expense') {
      group.totalExpense += tx.amount;
    } else if (tx.type === 'income') {
      group.totalIncome += tx.amount;
    }
  }

  return Array.from(groupMap.values());
}

