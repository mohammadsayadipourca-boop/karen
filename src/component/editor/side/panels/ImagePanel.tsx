// ======================= src/component/editor/side/panels/ImagePanel.tsx =======================
"use client";
import React from "react";

/** EN: Load image, basic transforms, background removal (future), filters.
 *  FA: بارگذاری عکس، تبدیل‌های پایه، حذف پس‌زمینه (بعداً)، فیلترها.
 */
export const ImagePanel: React.FC = () => {
  return (
    <div className="text-sm space-y-2">
      <input className="input" type="file" accept="image/*" />
      <button className="btn">Add to Canvas</button>
    </div>
  );
};
