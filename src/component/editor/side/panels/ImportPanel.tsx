// ======================= src/component/editor/side/panels/ImportPanel.tsx =======================
"use client";
import React from "react";

/** EN: Import JSON/layout and reconstruct the scene.
 *  FA: ایمپورت JSON/چیدمان و بازسازی صحنه.
 */
export const ImportPanel: React.FC = () => {
  return (
    <div className="text-sm space-y-2">
      <textarea className="input h-28" placeholder="Paste JSON here…" />
      <button className="btn w-full">Import</button>
    </div>
  );
};