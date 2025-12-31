"use client";

import type { PlannerSettings } from "@/lib/settings";

function mm(n: number) {
  return `${n}mm`;
}

export function PrintStyle({ settings }: { settings: PlannerSettings }) {
  // Chromium supports dynamically injected @page rules (works well for Save as PDF).
  // We set page size explicitly in mm so A3/Letter prints match exactly.
  const css = `
@media print {
  @page {
    size: ${settings.pageWidthMm}mm ${settings.pageHeightMm}mm;
    /* Keep the printable area aligned with the on-screen layout padding. */
    margin: 0;
  }
}
  `.trim();

  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
