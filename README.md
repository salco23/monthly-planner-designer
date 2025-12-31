# Monthly Planner Builder (Next.js)

This is a small Next.js app that generates a printable monthly **row-per-day** wall planner
in the style of the photo you shared (large year/month at top-left, optional mini calendars, and
a table with one row per day).

It includes:
- Paper presets: **A3** and **Letter**
- Adjustable margins, row height, line weight
- Adjustable day column width and a resizable set of writeable columns
- Print / Save as PDF via the browser print dialog (dynamic @page size injected for the preset)

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Printing

Click **Print / Save PDF** in the top-right.

For the cleanest results:
- In the print dialog: disable headers/footers
- Set scale to 100%
- Choose your target paper size (A3 or Letter) if your printer asks

## Customization notes

- Column widths are in **mm** so they match print measurements.
- The app shows a “fits / extra width / overflow” status based on page width minus margins.
- If you plan to coil-bind, leave extra top margin for the coil and hanger hole (increase top margin).

## Files

- `components/PlannerPage.tsx` – the actual printable page
- `components/SettingsPanel.tsx` – UI to tweak widths, margins, etc.
- `components/PrintStyle.tsx` – injects dynamic `@page` CSS for printing
- `lib/calendar.ts` – calendar helpers (mini calendars, weekday, etc.)
- `lib/settings.ts` – presets + settings model
