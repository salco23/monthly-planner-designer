export type PaperPreset = "a3" | "letter" | "a4";

export type PlannerColumn = {
  id: string;
  label: string;
  widthMm: number;
};

export type PlannerSettings = {
  paperPreset: PaperPreset;

  // Page size in mm (portrait). These are used to inject a dynamic @page rule at print time.
  pageWidthMm: number;
  pageHeightMm: number;

  // Margins in mm
  marginTopMm: number;
  marginRightMm: number;
  marginBottomMm: number;
  marginLeftMm: number;

  // Header
  headerYearSizePt: number;
  headerMonthSizePt: number;
  headerTopGapMm: number;

  // Mini calendars
  showMiniCalendars: boolean;
  weekStartsOnMonday: boolean;
  miniCalendarFontPt: number;

  // Grid
  rowHeightMm: number;
  dayColWidthMm: number;
  dayColWeekdayWidthMm: number; // within the day column
  lineWeightPt: number;

  // Content columns (to the right of the day column)
  columns: PlannerColumn[];

  // Typography
  fontFamily: "sans" | "serif" | "mono";
  bodyFontPt: number;

  // Styling
  weekendTextStyle: "red" | "black";
};

function uid(prefix: string) {
  return prefix + "-" + Math.random().toString(16).slice(2);
}

const LETTER_WIDTH_MM = 215.9;
const LETTER_HEIGHT_MM = 279.4;

const LETTER_TEMPLATE: PlannerSettings = {
  paperPreset: "letter",
  pageWidthMm: LETTER_WIDTH_MM,
  pageHeightMm: LETTER_HEIGHT_MM,
  marginTopMm: 14,
  marginRightMm: 10,
  marginBottomMm: 10,
  marginLeftMm: 10,

  headerYearSizePt: 14,
  headerMonthSizePt: 22,
  headerTopGapMm: 5,

  showMiniCalendars: true,
  weekStartsOnMonday: true,
  miniCalendarFontPt: 7,

  rowHeightMm: 7.7,
  dayColWidthMm: 22,
  dayColWeekdayWidthMm: 14,
  lineWeightPt: 0.55,

  columns: [
    { id: uid("col"), label: "Notes", widthMm: 52 },
    { id: uid("col"), label: "Meals", widthMm: 40 },
    { id: uid("col"), label: "Workout", widthMm: 32 },
    { id: uid("col"), label: "To-dos", widthMm: 40 },
  ],

  fontFamily: "sans",
  bodyFontPt: 8.5,

  weekendTextStyle: "red",
};

export const DEFAULT_TEMPLATES: Record<PaperPreset, PlannerSettings> = {
  a3: {
    paperPreset: "a3",
    pageWidthMm: 297,
    pageHeightMm: 420,
    marginTopMm: 18,
    marginRightMm: 12,
    marginBottomMm: 12,
    marginLeftMm: 12,

    headerYearSizePt: 18,
    headerMonthSizePt: 28,
    headerTopGapMm: 6,

    showMiniCalendars: true,
    weekStartsOnMonday: true,
    miniCalendarFontPt: 7.5,

    rowHeightMm: 10.5,
    dayColWidthMm: 28,
    dayColWeekdayWidthMm: 18,
    lineWeightPt: 0.6,

    columns: [
      { id: uid("col"), label: "Notes", widthMm: 70 },
      { id: uid("col"), label: "Meals", widthMm: 55 },
      { id: uid("col"), label: "Workout", widthMm: 45 },
      { id: uid("col"), label: "To-dos", widthMm: 55 },
      { id: uid("col"), label: "Misc", widthMm: 32 },
    ],

    fontFamily: "sans",
    bodyFontPt: 9,

    weekendTextStyle: "red",
  },

  letter: LETTER_TEMPLATE,

  // Legacy alias to keep previously saved or encoded settings working while using Letter sizing.
  a4: {
    ...LETTER_TEMPLATE,
  },
};

export function withPaperPreset(preset: PaperPreset): PlannerSettings {
  // Deep clone so UI edits don't mutate the template object
  return JSON.parse(JSON.stringify(DEFAULT_TEMPLATES[preset])) as PlannerSettings;
}

export function normalizePaperPreset(settings: PlannerSettings): PlannerSettings {
  if (settings.paperPreset === "a4") {
    return {
      ...settings,
      paperPreset: "letter",
      pageWidthMm: LETTER_WIDTH_MM,
      pageHeightMm: LETTER_HEIGHT_MM,
    };
  }

  return settings;
}

export function ensurePositive(n: number, fallback: number) {
  return Number.isFinite(n) && n > 0 ? n : fallback;
}
