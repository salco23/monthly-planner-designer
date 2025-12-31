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
    margin: ${mm(settings.marginTopMm)} ${mm(settings.marginRightMm)} ${mm(settings.marginBottomMm)} ${mm(settings.marginLeftMm)};
  }
}
  `.trim();

  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
