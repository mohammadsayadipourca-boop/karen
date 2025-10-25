// ======================= src/component/editor/side/panels/ShapePanel.tsx =======================
"use client";
import React from "react";

/** EN: Add common shapes (rect, circle, triangle, polygon, star).
 *  FA: افزودن اشکال پرکاربرد (مستطیل، دایره، مثلث، چندضلعی، ستاره).
 */
export const ShapePanel: React.FC = () => {
  return (
    <div className="text-sm grid grid-cols-3 gap-2">
      <button className="btn">Rect</button>
      <button className="btn">Circle</button>
      <button className="btn">Triangle</button>
      <button className="btn">Polygon</button>
      <button className="btn">Star</button>
    </div>
  );
};