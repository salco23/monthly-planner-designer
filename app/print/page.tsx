"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PlannerPage } from "@/components/PlannerPage";
import { DEFAULT_TEMPLATES, normalizePaperPreset, type PlannerSettings } from "@/lib/settings";
import { decodeSettings } from "@/lib/codec";
import { readStoredPlannerState } from "@/lib/storage";

export default function PrintPage() {
  const sp = useSearchParams();

  const year = Number(sp.get("y") ?? new Date().getFullYear());
  const month = Number(sp.get("m") ?? new Date().getMonth() + 1);
  const encoded = sp.get("s") ?? "";

  const [settings, setSettings] = useState<PlannerSettings | null>(null);

  const isYearMode = useMemo(() => sp.get("mode") === "year", [sp]);
  const monthsToRender = useMemo(
    () => (isYearMode ? Array.from({ length: 12 }, (_, i) => i + 1) : [month]),
    [isYearMode, month]
  );

  useEffect(() => {
    const decoded = decodeSettings(encoded);
    if (decoded) {
      setSettings(normalizePaperPreset(decoded));
      return;
    }

    const stored = readStoredPlannerState();
    if (stored) {
      setSettings(normalizePaperPreset(stored.settings));
      return;
    }

    setSettings(DEFAULT_TEMPLATES.letter);
  }, [encoded]);

  useEffect(() => {
    // Let layout settle before printing
    if (!settings) return;
    requestAnimationFrame(() => requestAnimationFrame(() => window.print()));
  }, [year, monthsToRender, settings]);

  const activeSettings = settings ?? DEFAULT_TEMPLATES.letter;
  return (
    <div style={{ background: "white" }}>
      {monthsToRender.map((m, idx) => (
        <div
          key={m}
          className={isYearMode && idx < monthsToRender.length - 1 ? "pageBreak" : ""}
        >
          <PlannerPage year={year} month={m} settings={activeSettings} />
        </div>
      ))}

      <style jsx>{`
        .pageBreak {
          page-break-after: always;
          break-after: page;
        }
      `}</style>
    </div>
  );
}
