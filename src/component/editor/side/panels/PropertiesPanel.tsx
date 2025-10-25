// ======================= src/component/editor/side/panels/PropertiesPanel.tsx =======================
"use client";
import React from "react";

/** EN: Dynamic property sheet for selected element (common + type-specific).
 *  FA: مشخصات پویا بسته به عنصر انتخابی (عمومی و نوع خاص).
 */
export const PropertiesPanel: React.FC = () => {
  return (
    <div className="text-sm space-y-2">
      {/* TODO: bind to Fabric activeObject, show lock/visible/duplicate/delete, drop shadow controls */}
      <div className="grid grid-cols-4 gap-2">
        <button className="btn">Show</button>
        <button className="btn">Lock</button>
        <button className="btn">Duplicate</button>
        <button className="btn">Delete</button>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <label className="flex items-center gap-2">Shadow X<input type="number" className="input" /></label>
        <label className="flex items-center gap-2">Shadow Y<input type="number" className="input" /></label>
        <label className="flex items-center gap-2">Blur<input type="number" className="input" /></label>
        <label className="flex items-center gap-2">Opacity<input type="number" className="input" /></label>
      </div>
    </div>
  );
};
