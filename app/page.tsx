"use client";

import { useEffect, useMemo, useState } from "react";
import { PlannerPage } from "@/components/PlannerPage";
import { SettingsPanel } from "@/components/SettingsPanel";
import { DEFAULT_TEMPLATES, type PlannerSettings } from "@/lib/settings";
import { encodeSettings } from "@/lib/codec";
import { persistStoredPlannerState, readStoredPlannerState } from "@/lib/storage";

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

export default function Page() {
  const now = new Date();
  const [year, setYear] = useState<number>(now.getFullYear());
  const [month, setMonth] = useState<number>(now.getMonth() + 1); // 1-12

  const [settings, setSettings] = useState<PlannerSettings>(
    DEFAULT_TEMPLATES.a4
  );

  useEffect(() => {
    const stored = readStoredPlannerState();
    if (stored) {
      setYear(stored.year);
      setMonth(stored.month);
      setSettings(stored.settings);
    }
  }, []);

  useEffect(() => {
    persistStoredPlannerState({ settings, year, month });
  }, [settings, year, month]);

  const pageSizeLabel = useMemo(() => {
    const map: Record<string, string> = {
      a3: "A3 (297×420mm)",
      a4: "A4 (210×297mm)",
    };
    return map[settings.paperPreset] ?? settings.paperPreset;
  }, [settings.paperPreset]);

  return (
    <main className="appShell">
      <header className="topBar">
        <div className="topBarLeft">
          <div className="brand">
            <span className="dot" aria-hidden />
            Monthly Planner Builder
          </div>
          <div className="topBarMeta">
            <span className="pill">Row-per-day wall planner</span>
            <span className="pill">{pageSizeLabel}</span>
          </div>
        </div>

        <div className="topBarRight">
          <label className="fieldRow" aria-label="Year">
            <span className="fieldLabel">Year</span>
            <input
              className="input"
              type="number"
              value={year}
              onChange={(e) => setYear(clamp(Number(e.target.value || year), 1900, 2100))}
            />
          </label>

          <label className="fieldRow" aria-label="Month">
            <span className="fieldLabel">Month</span>
            <select
              className="input"
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>
                  {m.toString().padStart(2, "0")}
                </option>
              ))}
            </select>
          </label>

          <button
            className="btn"
            onClick={() => {
              const s = encodeSettings(settings);
              const url = `/print?y=${year}&m=${month}&s=${encodeURIComponent(s)}`;
              const w = window.open(url, "_blank", "noopener,noreferrer");
              if (!w) window.location.href = url; // fallback if popups blocked
            }}
            title="Opens a print-ready page with your current settings."
          >
            Print / Save PDF
          </button>

          <button
            className="btn"
            onClick={() => {
              const s = encodeSettings(settings);
              const url = `/print?y=${year}&s=${encodeURIComponent(s)}&mode=year`;
              const w = window.open(url, "_blank", "noopener,noreferrer");
              if (!w) window.location.href = url;
            }}
            title="Generate a print-ready file for all 12 months of the selected year."
          >
            Print full year
          </button>

        </div>
      </header>

      <section className="content">
        <div className="previewPane">
          <PlannerPage year={year} month={month} settings={settings} />
        </div>

        <aside className="settingsPane">
          <SettingsPanel settings={settings} onChange={setSettings} />
        </aside>
      </section>
    </main>
  );
}
