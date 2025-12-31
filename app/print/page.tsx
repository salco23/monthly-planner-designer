"use client";

import { useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { PlannerPage } from "@/components/PlannerPage";
import { DEFAULT_TEMPLATES } from "@/lib/settings";
import { decodeSettings } from "@/lib/codec";

export default function PrintPage() {
  const sp = useSearchParams();

  const year = Number(sp.get("y") ?? new Date().getFullYear());
  const month = Number(sp.get("m") ?? new Date().getMonth() + 1);
  const encoded = sp.get("s") ?? "";

  const settings = useMemo(() => {
    return decodeSettings(encoded) ?? DEFAULT_TEMPLATES.a4; // use your A4 default
  }, [encoded]);

  useEffect(() => {
    // Let layout settle before printing
    requestAnimationFrame(() => requestAnimationFrame(() => window.print()));
  }, [year, month, settings]);

  return (
    <div style={{ background: "white" }}>
      <PlannerPage year={year} month={month} settings={settings} />
    </div>
  );
}
