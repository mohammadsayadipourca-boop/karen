"use client";
import { useCallback, useEffect } from "react";
import { useEditor } from "../../store/editorStore";

/**
 * Keeps zoom fitted to OUTER (Trim + 2×effective Bleed).
 * Matches original logic exactly.
 */
export function useFitZoom(
  deps: { pxW: number; pxH: number; effBleed: number },
  fitDeps: any[]
) {
  const fitZoom = useCallback(() => {
    const stageEl = document.getElementById("stage-container");
    if (!stageEl) return;

    const PAD = 24;
    const availW = Math.max(50, stageEl.clientWidth - PAD * 2);
    const availH = Math.max(50, stageEl.clientHeight - PAD * 2);

    const overallPxW = deps.pxW + 2 * deps.effBleed;
    const overallPxH = deps.pxH + 2 * deps.effBleed;

    const zFit = Math.max(0.05, Math.min(availW / overallPxW, availH / overallPxH));
    const zRounded = Math.min(8, Math.max(0.05, Math.round(zFit * 1000) / 1000));

    const curr = useEditor.getState().zoom;
    if (Math.abs(curr - zRounded) > 0.001) {
      useEditor.setState({ zoom: zRounded });
    }
  }, [deps]);

  useEffect(() => {
    fitZoom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, fitDeps);

  useEffect(() => {
    const stageEl = document.getElementById("stage-container");
    if (!stageEl) return;

    let ro: ResizeObserver | null = null;
    if ("ResizeObserver" in window) {
      ro = new ResizeObserver(() => fitZoom());
      ro.observe(stageEl);
    } else {
      const onResize = () => fitZoom();
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }
    return () => ro?.disconnect();
  }, [fitZoom]);

  return { fitZoom };
}
