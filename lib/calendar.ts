export type MiniMonthCell = {
  day: number | null;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
};

export function daysInMonth(year: number, month1to12: number): number {
  return new Date(year, month1to12, 0).getDate();
}

export function weekdayIndex(year: number, month1to12: number, day: number): number {
  // 0=Sun..6=Sat
  return new Date(year, month1to12 - 1, day).getDay();
}

export function monthName(month1to12: number): string {
  const names = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];
  return names[month1to12 - 1] ?? "";
}

export function weekdayShort(i: number): string {
  const map = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return map[i] ?? "";
}

export function buildMiniCalendarMatrix(year: number, month1to12: number, weekStartsOnMonday: boolean): MiniMonthCell[][] {
  const total = daysInMonth(year, month1to12);
  const today = new Date();
  const isToday = (d: number) =>
    today.getFullYear() === year &&
    today.getMonth() + 1 === month1to12 &&
    today.getDate() === d;

  const shift = (w: number) => {
    // input w: 0=Sun..6=Sat
    // output index in grid given week start setting
    if (!weekStartsOnMonday) return w; // Sun start
    return (w + 6) % 7; // Mon start: Mon=0 ... Sun=6
  };

  const firstW = shift(weekdayIndex(year, month1to12, 1));
  const weeks: MiniMonthCell[][] = [];
  let week: MiniMonthCell[] = [];

  // leading blanks
  for (let i = 0; i < firstW; i++) {
    week.push({ day: null, isCurrentMonth: false, isToday: false, isWeekend: false });
  }

  for (let d = 1; d <= total; d++) {
    const w = shift(weekdayIndex(year, month1to12, d));
    week.push({
      day: d,
      isCurrentMonth: true,
      isToday: isToday(d),
      isWeekend: (!weekStartsOnMonday ? (w === 0 || w === 6) : (w === 5 || w === 6)),
    });
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }

  // trailing blanks
  if (week.length) {
    while (week.length < 7) {
      week.push({ day: null, isCurrentMonth: false, isToday: false, isWeekend: false });
    }
    weeks.push(week);
  }

  // enforce 6 rows for consistent alignment (like printed calendars)
  while (weeks.length < 6) {
    weeks.push(Array.from({ length: 7 }, () => ({ day: null, isCurrentMonth: false, isToday: false, isWeekend: false })));
  }

  return weeks;
}
