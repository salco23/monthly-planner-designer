"use client";

import { useMemo } from "react";
import type { PlannerSettings } from "@/lib/settings";
import { PrintStyle } from "@/components/PrintStyle";
import { buildMiniCalendarMatrix, daysInMonth, monthName, weekdayShort, weekdayIndex } from "@/lib/calendar";

function pt(n: number) {
  return `${n}pt`;
}
function mm(n: number) {
  return `${n}mm`;
}

const FONT_FAMILIES: Record<PlannerSettings["fontFamily"], string> = {
  sans: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
  serif: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
  mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
};


export function PlannerPage({
  year,
  month,
  settings,
}: {
  year: number;
  month: number; // 1-12
  settings: PlannerSettings;
}) {
  const totalDays = useMemo(() => daysInMonth(year, month), [year, month]);

  const prev = useMemo(() => {
    const d = new Date(year, month - 2, 1);
    return { y: d.getFullYear(), m: d.getMonth() + 1 };
  }, [year, month]);

  const next = useMemo(() => {
    const d = new Date(year, month, 1);
    return { y: d.getFullYear(), m: d.getMonth() + 1 };
  }, [year, month]);

  const gridTemplateColumns = useMemo(() => {
    const cols = [
      `${mm(settings.dayColWidthMm)}`,
      ...settings.columns.map((c) => mm(c.widthMm)),
    ];
    return cols.join(" ");
  }, [settings.dayColWidthMm, settings.columns]);

  const fontFamily = FONT_FAMILIES[settings.fontFamily] ?? FONT_FAMILIES.sans;

  const dayTextColor = (dow: number) => {
    const isWeekend = dow === 0 || dow === 6;
    if (!isWeekend) return "#111";
    return settings.weekendTextStyle === "red" ? "#b01818" : "#111";
  };

  return (
    <div className="plannerWrap">
      <PrintStyle settings={settings} />

      <div
        className="plannerPage"
        style={{
          width: mm(settings.pageWidthMm),
          height: mm(settings.pageHeightMm),
          fontFamily,
        }}
      >
        <div className="plannerInner">
          <header className="plannerHeader">
            <div className="headerLeft">
              <div className="year" style={{ fontSize: pt(settings.headerYearSizePt) }}>
                {year}
              </div>
              <div className="month" style={{ fontSize: pt(settings.headerMonthSizePt) }}>
                {month.toString().padStart(2, "0")}
              </div>
            </div>

            {settings.showMiniCalendars ? (
              <div className="headerRight">
                <MiniMonth
                  year={prev.y}
                  month={prev.m}
                  settings={settings}
                  titlePrefix=""
                />
                <MiniMonth
                  year={next.y}
                  month={next.m}
                  settings={settings}
                  titlePrefix=""
                />
              </div>
            ) : (
              <div className="headerRight" />
            )}
          </header>

          <div style={{ height: mm(settings.headerTopGapMm) }} />

          <section className="gridWrap">
            {/* Optional column labels row (kept subtle like the photo) */}
            <div
              className="gridRow gridHeaderRow"
              style={{
                gridTemplateColumns,
                borderTopWidth: pt(settings.lineWeightPt),
                borderBottomWidth: pt(settings.lineWeightPt),
              }}
            >
              <div className="cell dayCell headerCell">
                <div className="dayCellInner">
                  <span className="dayNum" style={{ opacity: 0.7 }}>
                    #
                  </span>
                  <span className="dow" style={{ opacity: 0.7 }}>
                    Day
                  </span>
                </div>
              </div>
              {settings.columns.map((c) => (
                <div key={c.id} className="cell headerCell">
                  {c.label}
                </div>
              ))}
            </div>

            {/* Day rows */}
            {Array.from({ length: totalDays }, (_, idx) => {
              const day = idx + 1;
              const dow = weekdayIndex(year, month, day); // 0=Sun..6=Sat
              const color = dayTextColor(dow);

              return (
                <div
                  key={day}
                  className="gridRow"
                  style={{
                    gridTemplateColumns,
                    height: mm(settings.rowHeightMm),
                    borderBottomWidth: pt(settings.lineWeightPt),
                  }}
                >
                  <div className="cell dayCell">
                    <div className="dayCellInner">
                      <span className="dayNum" style={{ color }}>
                        {day}
                      </span>
                      <span className="dow" style={{ color }}>
                        {weekdayShort(dow).toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {settings.columns.map((c) => (
                    <div key={c.id} className="cell writeCell" />
                  ))}
                </div>
              );
            })}
          </section>
        </div>
      </div>

      <style jsx>{`
        .plannerWrap {
          display: grid;
          place-items: start center;
          padding: 10px 0 24px;
        }

        .plannerPage {
          background: white;
          color: #111;
          border-radius: 10px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
          border: 1px solid rgba(17, 17, 17, 0.14);
        }

        .plannerInner {
          /* honor margins inside the page itself */
          padding: ${mm(settings.marginTopMm)} ${mm(settings.marginRightMm)}
            ${mm(settings.marginBottomMm)} ${mm(settings.marginLeftMm)};
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .plannerHeader {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
        }

        .headerLeft {
          display: grid;
          gap: 6px;
          align-content: start;
        }

        .year {
          font-weight: 700;
          letter-spacing: 0.04em;
          color: #333;
        }

        .month {
          font-weight: 800;
          letter-spacing: 0.06em;
          line-height: 0.9;
        }

        .headerRight {
          display: grid;
          grid-auto-flow: column;
          gap: 14px;
          align-items: start;
        }

        .gridWrap {
          border: ${pt(settings.lineWeightPt)} solid rgba(17, 17, 17, 0.7);
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 0;
        }

        .gridRow {
          display: grid;
          border-bottom: ${pt(settings.lineWeightPt)} solid rgba(17, 17, 17, 0.55);
        }

        .gridHeaderRow {
          height: ${mm(Math.max(8, settings.rowHeightMm * 0.95))};
        }

        .cell {
          border-right: ${pt(settings.lineWeightPt)} solid rgba(17, 17, 17, 0.55);
          padding: 0 6px;
          display: flex;
          align-items: center;
          font-size: ${pt(settings.bodyFontPt)};
        }

        .cell:last-child {
          border-right: none;
        }

        .headerCell {
          font-weight: 700;
          font-size: ${pt(Math.max(settings.bodyFontPt - 0.4, 7.2))};
          color: rgba(17, 17, 17, 0.65);
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .dayCell {
          padding: 0 7px;
        }

        .dayCellInner {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          width: 100%;
          gap: 8px;
        }

        .dayNum {
          font-weight: 800;
          width: ${mm(settings.dayColWeekdayWidthMm)};
          text-align: left;
        }

        .dow {
          font-weight: 700;
          letter-spacing: 0.1em;
          font-size: ${pt(Math.max(settings.bodyFontPt - 1, 6.8))};
          text-align: right;
          flex: 1;
        }

        .writeCell {
          /* Keep it blank like a planner; users will write on paper */
        }

        /* Print: remove shadows and allow edge-to-edge within page margins */
        @media print {
          .plannerWrap {
            padding: 0;
          }
          .plannerPage {
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}

function MiniMonth({
  year,
  month,
  settings,
}: {
  year: number;
  month: number;
  settings: PlannerSettings;
  titlePrefix?: string;
}) {
  const weeks = useMemo(
    () => buildMiniCalendarMatrix(year, month, settings.weekStartsOnMonday),
    [year, month, settings.weekStartsOnMonday]
  );

  const weekdays = useMemo(() => {
    // render header as MTWTFSS if monday-start, else SMTWTFS
    const base = ["S", "M", "T", "W", "T", "F", "S"];
    if (!settings.weekStartsOnMonday) return base;
    return ["M", "T", "W", "T", "F", "S", "S"];
  }, [settings.weekStartsOnMonday]);

  return (
    <div className="mini">
      <div className="miniTitle">
        <span className="miniMonth">{monthName(month).slice(0, 3)}</span>{" "}
        <span className="miniYear">{year}</span>
      </div>

      <div className="miniGrid">
        {weekdays.map((d, i) => (
          <div key={i} className="miniDow">
            {d}
          </div>
        ))}

        {weeks.flat().map((cell, i) => (
          <div
            key={i}
            className={`miniCell ${cell.isWeekend ? "wknd" : ""}`}
          >
            {cell.day ?? ""}
          </div>
        ))}
      </div>

      <style jsx>{`
        .mini {
          width: 86px;
          user-select: none;
        }
        .miniTitle {
          font-size: ${pt(settings.miniCalendarFontPt + 0.6)};
          font-weight: 700;
          color: rgba(17, 17, 17, 0.75);
          display: flex;
          gap: 6px;
          justify-content: flex-start;
          margin-bottom: 3px;
        }
        .miniGrid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 2px;
          font-size: ${pt(settings.miniCalendarFontPt)};
          color: rgba(17, 17, 17, 0.75);
        }
        .miniDow {
          font-weight: 700;
          text-align: center;
          opacity: 0.7;
        }
        .miniCell {
          text-align: center;
          padding: 1px 0;
          border-radius: 3px;
          min-height: 10px;
        }
        .miniCell.wknd {
          color: ${settings.weekendTextStyle === "red" ? "#b01818" : "rgba(17,17,17,0.75)"};
        }
      `}</style>
    </div>
  );
}
