// ======================= src/component/editor/side/panels/LayersPanel.tsx =======================
"use client";
import React from "react";

/** EN: Layer list with rename, show/hide, lock, duplicate, delete, drag-reorder.
 *  FA: لیست لایه‌ها با تغییرنام، نمایش/مخفی، قفل، کپی، حذف و چینش درگ.
 */
export const LayersPanel: React.FC = () => {
  return (
    <div className="text-sm">
      {/* TODO: connect to Fabric canvas._objects; implement reorder via bringForward/sendBackwards */}
      <div className="text-neutral-500">No layers yet…</div>
    </div>
  );
};
