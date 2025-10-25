// ======================= src/component/editor/side/panels/TextPanel.tsx =======================
"use client";
import React from "react";

/** EN: Add text with alignment, style (bold/italic/underline), font, color.
 *  FA: افزودن متن با چینش، استایل (بولد/ایتالیک/آندرلاین)، فونت، رنگ.
 */
export const TextPanel: React.FC = () => {
  return (
    <div className="text-sm space-y-2">
      <input className="input" placeholder="Your text…" />
      <div className="grid grid-cols-4 gap-2">
        <button className="btn">B</button>
        <button className="btn">I</button>
        <button className="btn">U</button>
        <button className="btn">Color</button>
      </div>
    </div>
  );
};