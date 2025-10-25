// ======================= src/component/editor/side/panels/QRPanel.tsx =======================
"use client";
import React from "react";

/** EN: Generate QR with size/color + optional logo overlay.
 *  FA: ساخت QR با اندازه/رنگ + امکان لوگوی وسط.
 */
export const QRPanel: React.FC = () => {
  return (
    <div className="text-sm space-y-2">
      <input className="input" placeholder="Text / URL" />
      <div className="grid grid-cols-2 gap-2">
        <label className="flex items-center gap-2">Size <input type="number" className="input" /></label>
        <label className="flex items-center gap-2">Color <input type="color" className="input p-0 h-9" /></label>
      </div>
      <button className="btn">Add QR</button>
    </div>
  );
};