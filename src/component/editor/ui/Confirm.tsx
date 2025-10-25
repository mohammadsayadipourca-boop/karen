// ======================= src/component/editor/ui/Confirm.tsx =======================
"use client";
import React from "react";

/** EN: Minimal confirm dialog. Replace with shadcn/ui later if desired.
 *  FA: دیالوگ تایید ساده. در آینده می‌توان با shadcn/ui جایگزین کرد.
 */
export const Confirm: React.FC<{ open: boolean; title: string; description?: string; onCancel: () => void; onConfirm: () => void; }> = ({ open, title, description, onCancel, onConfirm }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/30">
      <div className="w-[360px] bg-white rounded-2xl p-4 shadow-xl border border-neutral-200">
        <div className="font-semibold mb-1">{title}</div>
        {description && <div className="text-sm text-neutral-600 mb-3">{description}</div>}
        <div className="flex justify-end gap-2">
          <button className="btn" onClick={onCancel}>Cancel</button>
          <button className="btn btn-danger" onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
};