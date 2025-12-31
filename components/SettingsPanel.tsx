"use client";

import { useMemo } from "react";
import type { PlannerSettings, PlannerColumn, PaperPreset } from "@/lib/settings";
import { DEFAULT_TEMPLATES, withPaperPreset } from "@/lib/settings";

function n(v: string) {
  const x = Number(v);
  return Number.isFinite(x) ? x : 0;
}

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

function round1(x: number) {
  return Math.round(x * 10) / 10;
}

export function SettingsPanel({
  settings,
  onChange,
}: {
  settings: PlannerSettings;
  onChange: (s: PlannerSettings) => void;
}) {
  const totalColumnsMm = useMemo(() => {
    const columnsSum = settings.columns.reduce((acc, c) => acc + c.widthMm, 0);
    return round1(settings.dayColWidthMm + columnsSum);
  }, [settings.dayColWidthMm, settings.columns]);

  const usableWidth = useMemo(() => {
    return round1(settings.pageWidthMm - settings.marginLeftMm - settings.marginRightMm);
  }, [settings.pageWidthMm, settings.marginLeftMm, settings.marginRightMm]);

  const widthStatus = useMemo(() => {
    const delta = round1(usableWidth - totalColumnsMm);
    if (Math.abs(delta) < 1) return { tone: "ok", text: "Fits nicely." };
    if (delta > 0) return { tone: "warn", text: `You have ~${delta}mm extra width.` };
    return { tone: "bad", text: `Over by ~${Math.abs(delta)}mm — columns may overflow.` };
  }, [usableWidth, totalColumnsMm]);

  const setPreset = (preset: PaperPreset) => {
    const next = withPaperPreset(preset);
    onChange(next);
  };

  const update = (patch: Partial<PlannerSettings>) => onChange({ ...settings, ...patch });

  const updateCol = (id: string, patch: Partial<PlannerColumn>) => {
    update({
      columns: settings.columns.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    });
  };

  const addColumn = () => {
    if (settings.columns.length >= 8) return;
    const id = "col-" + Math.random().toString(16).slice(2);
    update({
      columns: [...settings.columns, { id, label: "New", widthMm: 30 }],
    });
  };

  const removeColumn = (id: string) => {
    if (settings.columns.length <= 1) return;
    update({ columns: settings.columns.filter((c) => c.id !== id) });
  };

  return (
    <div className="panel">
      <h2 className="h2">Paper preset</h2>
      <div className="row">
        <button
          className={`seg ${settings.paperPreset === "a3" ? "active" : ""}`}
          onClick={() => setPreset("a3")}
        >
          A3
        </button>
        <button
          className={`seg ${settings.paperPreset === "letter" ? "active" : ""}`}
          onClick={() => setPreset("letter")}
        >
          8.5 × 11 in (US Letter)
        </button>
      </div>

      <div className="subtle">
        Tip: use <b>Print / Save PDF</b> and choose your printer or “Save as PDF.”
      </div>

      <hr className="hr" />

      <h2 className="h2">Margins (mm)</h2>
      <div className="grid2">
        <Field label="Top" value={settings.marginTopMm} min={0} max={40} step={0.5}
          onChange={(v) => update({ marginTopMm: v })} />
        <Field label="Right" value={settings.marginRightMm} min={0} max={40} step={0.5}
          onChange={(v) => update({ marginRightMm: v })} />
        <Field label="Bottom" value={settings.marginBottomMm} min={0} max={40} step={0.5}
          onChange={(v) => update({ marginBottomMm: v })} />
        <Field label="Left" value={settings.marginLeftMm} min={0} max={40} step={0.5}
          onChange={(v) => update({ marginLeftMm: v })} />
      </div>

      <div className={`status ${widthStatus.tone}`}>
        <div><b>Usable width:</b> {usableWidth}mm</div>
        <div><b>Total columns:</b> {totalColumnsMm}mm</div>
        <div>{widthStatus.text}</div>
      </div>

      <hr className="hr" />

      <h2 className="h2">Grid</h2>
      <div className="grid2">
        <Field
          label="Row height (mm)"
          value={settings.rowHeightMm}
          min={5}
          max={16}
          step={0.1}
          onChange={(v) => update({ rowHeightMm: v })}
        />
        <Field
          label="Line weight (pt)"
          value={settings.lineWeightPt}
          min={0.3}
          max={1.2}
          step={0.05}
          onChange={(v) => update({ lineWeightPt: v })}
        />
        <Field
          label="Day col width (mm)"
          value={settings.dayColWidthMm}
          min={16}
          max={44}
          step={0.5}
          onChange={(v) => update({ dayColWidthMm: v })}
        />
        <Field
          label="Day # block (mm)"
          value={settings.dayColWeekdayWidthMm}
          min={10}
          max={30}
          step={0.5}
          onChange={(v) => update({ dayColWeekdayWidthMm: v })}
        />
      </div>

      <hr className="hr" />

      <h2 className="h2">Header</h2>
      <div className="grid2">
        <Field
          label="Year size (pt)"
          value={settings.headerYearSizePt}
          min={10}
          max={28}
          step={0.5}
          onChange={(v) => update({ headerYearSizePt: v })}
        />
        <Field
          label="Month size (pt)"
          value={settings.headerMonthSizePt}
          min={16}
          max={44}
          step={0.5}
          onChange={(v) => update({ headerMonthSizePt: v })}
        />
        <Field
          label="Header gap (mm)"
          value={settings.headerTopGapMm}
          min={0}
          max={14}
          step={0.5}
          onChange={(v) => update({ headerTopGapMm: v })}
        />
        <Field
          label="Body font (pt)"
          value={settings.bodyFontPt}
          min={7}
          max={12}
          step={0.1}
          onChange={(v) => update({ bodyFontPt: v })}
        />
      </div>

      <div className="grid2">
        <Toggle
          label="Show mini calendars"
          checked={settings.showMiniCalendars}
          onChange={(v) => update({ showMiniCalendars: v })}
        />
        <Toggle
          label="Week starts Monday"
          checked={settings.weekStartsOnMonday}
          onChange={(v) => update({ weekStartsOnMonday: v })}
        />
      </div>

      <hr className="hr" />

      <h2 className="h2">Columns</h2>
      <div className="subtle">
        These are the writable columns to the right of the day column (like your photo).
      </div>

      <div className="cols">
        {settings.columns.map((c, idx) => (
          <div key={c.id} className="colCard">
            <div className="colTop">
              <div className="colIndex">{idx + 1}</div>
              <input
                className="textInput"
                value={c.label}
                onChange={(e) => updateCol(c.id, { label: e.target.value })}
              />
              <button className="iconBtn" onClick={() => removeColumn(c.id)} title="Remove column">
                ✕
              </button>
            </div>

            <div className="colBottom">
              <label className="smallLabel">Width (mm)</label>
              <input
                className="range"
                type="range"
                min={15}
                max={120}
                step={0.5}
                value={c.widthMm}
                onChange={(e) => updateCol(c.id, { widthMm: clamp(n(e.target.value), 15, 120) })}
              />
              <input
                className="num"
                type="number"
                value={c.widthMm}
                min={15}
                max={120}
                step={0.5}
                onChange={(e) => updateCol(c.id, { widthMm: clamp(n(e.target.value), 15, 120) })}
              />
            </div>
          </div>
        ))}

        <button className="addBtn" onClick={addColumn}>
          + Add column
        </button>
      </div>

      <hr className="hr" />

      <h2 className="h2">Quick reset</h2>
      <div className="subtle">Reset current preset back to defaults.</div>
      <button className="btnFull" onClick={() => setPreset(settings.paperPreset)}>
        Reset this preset
      </button>

      <style jsx>{`
        .panel {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .h2 {
          margin: 10px 0 0;
          font-size: 14px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.78);
        }
        .row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .seg {
          border: 1px solid rgba(255,255,255,0.18);
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.9);
          padding: 10px 12px;
          border-radius: 14px;
          font-weight: 700;
          cursor: pointer;
        }
        .seg.active {
          border-color: rgba(96,165,250,0.7);
          background: rgba(96,165,250,0.18);
        }
        .subtle {
          font-size: 13px;
          color: rgba(255,255,255,0.68);
          line-height: 1.45;
        }
        .hr {
          width: 100%;
          border: none;
          border-top: 1px solid rgba(255,255,255,0.12);
          margin: 6px 0;
        }
        .grid2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .status {
          border-radius: 14px;
          padding: 10px 12px;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.05);
          font-size: 13px;
          color: rgba(255,255,255,0.78);
          display: grid;
          gap: 4px;
        }
        .status.ok { border-color: rgba(34,197,94,0.35); }
        .status.warn { border-color: rgba(234,179,8,0.35); }
        .status.bad { border-color: rgba(239,68,68,0.35); }

        .cols {
          display: grid;
          gap: 10px;
        }
        .colCard {
          border-radius: 16px;
          padding: 10px;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.05);
          display: grid;
          gap: 10px;
        }
        .colTop {
          display: grid;
          grid-template-columns: auto 1fr auto;
          gap: 8px;
          align-items: center;
        }
        .colIndex {
          width: 22px;
          height: 22px;
          border-radius: 999px;
          display: grid;
          place-items: center;
          font-size: 12px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
        }
        .textInput {
          width: 100%;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.16);
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.92);
          padding: 8px 10px;
          outline: none;
        }
        .textInput:focus {
          border-color: rgba(96,165,250,0.6);
          box-shadow: 0 0 0 4px rgba(96,165,250,0.12);
        }
        .iconBtn {
          border: 1px solid rgba(255,255,255,0.14);
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.86);
          border-radius: 12px;
          padding: 7px 10px;
          cursor: pointer;
        }
        .iconBtn:hover { background: rgba(255,255,255,0.1); }

        .colBottom {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 10px;
          align-items: center;
        }
        .smallLabel {
          grid-column: 1 / -1;
          font-size: 11px;
          color: rgba(255,255,255,0.62);
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        .range { width: 100%; }
        .num {
          width: 76px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.16);
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.92);
          padding: 8px 10px;
          outline: none;
        }

        .addBtn {
          border: 1px dashed rgba(255,255,255,0.22);
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.85);
          padding: 12px 12px;
          border-radius: 16px;
          font-weight: 700;
          cursor: pointer;
        }
        .addBtn:hover { background: rgba(255,255,255,0.07); }

        .btnFull {
          border: 1px solid rgba(255,255,255,0.18);
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.9);
          padding: 12px 12px;
          border-radius: 14px;
          font-weight: 800;
          cursor: pointer;
        }
        .btnFull:hover { background: rgba(255,255,255,0.1); }
      `}</style>
    </div>
  );
}

function Field({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="field">
      <span className="label">{label}</span>
      <div className="inputs">
        <input
          className="range"
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(clamp(n(e.target.value), min, max))}
        />
        <input
          className="num"
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => onChange(clamp(n(e.target.value), min, max))}
        />
      </div>

      <style jsx>{`
        .field {
          border-radius: 16px;
          padding: 10px;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.05);
          display: grid;
          gap: 8px;
        }
        .label {
          font-size: 11px;
          color: rgba(255,255,255,0.62);
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        .inputs {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 10px;
          align-items: center;
        }
        .range { width: 100%; }
        .num {
          width: 76px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.16);
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.92);
          padding: 8px 10px;
          outline: none;
        }
      `}</style>
    </label>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      className={`toggle ${checked ? "on" : ""}`}
      onClick={() => onChange(!checked)}
      type="button"
    >
      <span className="dot" aria-hidden />
      <span className="txt">{label}</span>
      <span className="state">{checked ? "On" : "Off"}</span>

      <style jsx>{`
        .toggle {
          border-radius: 16px;
          padding: 12px 12px;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.05);
          display: grid;
          grid-template-columns: auto 1fr auto;
          gap: 10px;
          align-items: center;
          cursor: pointer;
          color: rgba(255,255,255,0.9);
          font-weight: 700;
        }
        .toggle.on {
          border-color: rgba(34,197,94,0.35);
          background: rgba(34,197,94,0.12);
        }
        .dot {
          width: 10px;
          height: 10px;
          border-radius: 999px;
          background: ${checked ? "rgba(34,197,94,1)" : "rgba(255,255,255,0.25)"};
        }
        .txt {
          font-size: 13px;
          text-align: left;
        }
        .state {
          font-size: 12px;
          color: rgba(255,255,255,0.7);
        }
      `}</style>
    </button>
  );
}
