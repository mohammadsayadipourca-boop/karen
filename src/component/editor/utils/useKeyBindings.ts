// ======================= src/component/editor/utils/useKeyBindings.ts =======================
"use client";
import { useEffect } from "react";
import { useEditor } from "../store/editorStore";


/** EN: Photoshop-like hotkeys (sketch). Arrow=1px nudge, Shift+Arrow=10px; Ctrl/Cmd+ +/- zoom.
 *  FA: شورتکات‌ها به سبک فتوشاپ (طرح). فلش‌ها=۱px، شیفت+فلش=۱۰px؛ Ctrl/Cmd+ +/- زوم.
 */
export function useKeyBindings() {
  const { setZoom } = useEditor();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === "+" || e.key === "=")) { setZoom((z) => z * 1.1 as any); e.preventDefault(); }
      if ((e.ctrlKey || e.metaKey) && (e.key === "-")) { setZoom((z) => z / 1.1 as any); e.preventDefault(); }
      if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === "0")) { setZoom(1); e.preventDefault(); }
      // TODO: arrow nudges for active Fabric object
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setZoom]);
}