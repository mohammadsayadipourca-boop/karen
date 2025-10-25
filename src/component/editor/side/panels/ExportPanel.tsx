// ======================= src/component/editor/side/panels/ExportPanel.tsx =======================
"use client";
import React from "react";

/** EN: Export to JSON (with layer names) + PNG (front/back).
 *  FA: خروجی JSON (با نام لایه‌ها) + PNG (پشت/رو).
 */
export const ExportPanel: React.FC = () => {
  return (
    <div className="text-sm space-y-2">
      <button className="btn w-full">Export JSON</button>
      <button className="btn w-full">Export Front PNG</button>
      <button className="btn w-full">Export Back PNG</button>
      <textarea className="input h-28" placeholder="JSON preview…" />
    </div>
  );
};