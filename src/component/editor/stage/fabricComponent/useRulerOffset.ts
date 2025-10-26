"use client";
import { useEffect } from "react";
import { useEditor } from "../../store/editorStore";

export function useRulerOffset(
  outerRef: React.RefObject<HTMLDivElement>,
  deps: any[]
) {
  useEffect(() => {
    const stageEl = document.getElementById("stage-container");
    const el = outerRef.current;
    if (!stageEl || !el) return;

    const update = () => {
      const a = stageEl.getBoundingClientRect();
      const b = el.getBoundingClientRect();
      useEditor.setState({
        rulerOffsetX: Math.round(b.left - a.left),
        rulerOffsetY: Math.round(b.top - a.top),
      });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, deps);
}
