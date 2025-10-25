// ======================= src/component/editor/side/panels/MovePanel.tsx =======================
"use client";
import React from "react";
import { useEditor } from "../../main/mainEditor";

/** EN: Precise nudge/rotate/scale/opacity + align helpers.
 *  FA: جابه‌جایی دقیق، چرخش، مقیاس، شفافیت و چینش.
 */
export const MovePanel: React.FC = () => {
  return (
    <div className="text-sm space-y-2">
      {/* TODO: hook to selected Fabric object and apply transforms */}
      <div className="grid grid-cols-4 gap-2">
        <button className="btn">←</button>
        <button className="btn">→</button>
        <button className="btn">↑</button>
        <button className="btn">↓</button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <label className="flex items-center gap-2">Rotate <input type="number" className="input" /></label>
        <label className="flex items-center gap-2">Scale % <input type="number" className="input" /></label>
        <label className="flex items-center gap-2">Opacity % <input type="number" className="input" /></label>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <button className="btn">Align Left</button>
        <button className="btn">Align Center</button>
        <button className="btn">Align Right</button>
        <button className="btn">Align Top</button>
        <button className="btn">Align Middle</button>
        <button className="btn">Align Bottom</button>
      </div>
    </div>
  );
};
