"use client";
import { useEffect } from "react";
import type * as fabricNS from "fabric";

export function useCanvasSizing(
  canvases: Array<fabricNS.Canvas | null>,
  pxW: number,
  pxH: number,
  zoom: number
) {
  useEffect(() => {
    canvases.forEach((c) => {
      if (!c) return;
      c.setWidth(Math.round(pxW * zoom));
      c.setHeight(Math.round(pxH * zoom));
      c.setZoom(zoom);
      c.renderAll();
    });
  }, [canvases, pxW, pxH, zoom]);
}
