// src/component/editor/floating/FloatingPanels.tsx
"use client";
/**
 * EN: Floating windows for all tool panels. Hydration-safe:
 * - Initial layout uses deterministic DEFAULTS (same on SSR/CSR)
 * - After mount, sync open-state and rects from localStorage
 * FA: پنجره‌های شناور ابزارها. امن برای هیدریشن:
 * - چیدمان اولیه از DEFAULTS (ثابت در SSR/CSR)
 * - بعد از mount از localStorage همگام می‌شود.
 */
import React from "react";
import { Rnd } from "react-rnd";
import { X } from "lucide-react";
import { useEditor } from "../store/editorStore";
import { panelStorage, clampRectToViewport, type PanelKey } from "../utils/panelStorage";

// Panels
import { ImageSettingPanel } from "../side/panels/ImageSettingPanel";
import { MovePanel } from "../side/panels/MovePanel";
import { PropertiesPanel } from "../side/panels/PropertiesPanel";
import { LayersPanel } from "../side/panels/LayersPanel";
import { ImagePanel } from "../side/panels/ImagePanel";
import { TextPanel } from "../side/panels/TextPanel";
import { ShapePanel } from "../side/panels/ShapePanel";
import { QRPanel } from "../side/panels/QRPanel";
import { ExportPanel } from "../side/panels/ExportPanel";
import { ImportPanel } from "../side/panels/ImportPanel";

// Deterministic defaults (same for SSR & CSR)
const DEFAULTS: Record<
  PanelKey,
  { x: number; y: number; w: number; h: number; title: string }
> = {
  imageSetting: { x: 60, y: 80, w: 320, h: 420, title: "Image Setting" },
  move:         { x: 400, y: 80, w: 300, h: 320, title: "Move" },
  properties:   { x: 720, y: 80, w: 340, h: 360, title: "Properties" },
  layers:       { x: 1060, y: 80, w: 300, h: 420, title: "Layers" },
  image:        { x: 60, y: 520, w: 320, h: 260, title: "Image" },
  text:         { x: 400, y: 440, w: 340, h: 260, title: "Text" },
  shape:        { x: 760, y: 460, w: 300, h: 220, title: "Shape" },
  qr:           { x: 1060, y: 520, w: 300, h: 240, title: "QR Code" },
  export:       { x: 60, y: 820, w: 360, h: 240, title: "Export" },
  import:       { x: 440, y: 820, w: 360, h: 240, title: "Import" },
};

export const FloatingPanels: React.FC = () => {
  // ✳️ همیشه همهٔ هوک‌ها را فراخوانی کن (بدون early-return)
  const { panels } = useEditor();

  // Load open-state on mount (merge with store)
  React.useEffect(() => {
    const saved = panelStorage.loadOpen();
    // @ts-expect-error direct setState (zustand)
    useEditor.setState((s: any) => ({ panels: { ...s.panels, ...saved } }));
  }, []);

  // Persist open-state
  React.useEffect(() => {
    panelStorage.saveOpen(panels);
  }, [panels]);

  // ───────────── PanelWindow: one floating window ─────────────
  const PanelWindow = ({
    id,
    children,
  }: {
    id: PanelKey;
    children: React.ReactNode;
  }) => {
    if (!panels[id]) return null;

    // 1) Initial state from deterministic DEFAULTS (no window/localStorage here)
    const d = DEFAULTS[id];
    const [pos, setPos] = React.useState({ x: d.x, y: d.y });
    const [size, setSize] = React.useState({ width: d.w, height: d.h });

    // 2) After mount, hydrate from localStorage (SSR-safe helpers used inside)
    React.useEffect(() => {
      const saved = panelStorage.loadRect(id);
      if (saved) {
        const clamped = clampRectToViewport(saved);
        setPos({ x: clamped.x, y: clamped.y });
        setSize({ width: clamped.w, height: clamped.h });
      } else {
        // clamp defaults against current viewport too
        const clamped = clampRectToViewport({ x: d.x, y: d.y, w: d.w, h: d.h });
        setPos({ x: clamped.x, y: clamped.y });
        setSize({ width: clamped.w, height: clamped.h });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    // 3) Clamp on window resize (client-only effect)
    React.useEffect(() => {
      const onResize = () => {
        const clamped = clampRectToViewport({ x: pos.x, y: pos.y, w: size.width, h: size.height });
        setPos({ x: clamped.x, y: clamped.y });
        setSize({ width: clamped.w, height: clamped.h });
      };
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }, [pos.x, pos.y, size.width, size.height]);

    // 4) Persist rect (debounced)
    React.useEffect(() => {
      const t = setTimeout(() => {
        panelStorage.saveRect(id, { x: pos.x, y: pos.y, w: size.width, h: size.height });
      }, 120);
      return () => clearTimeout(t);
    }, [id, pos, size]);

    return (
      <Rnd
        bounds="window"
        minWidth={250}
        minHeight={200}
        size={size}
        position={pos}
        onDragStop={(_e, d2) => setPos({ x: d2.x, y: d2.y })}
        onResizeStop={(_e, _dir, ref, _delta, p) => {
          setSize({ width: ref.offsetWidth, height: ref.offsetHeight });
          setPos({ x: p.x, y: p.y });
        }}
        dragHandleClassName="handle"
        enableUserSelectHack={false}
        className="bg-white/90 backdrop-blur-xl border border-neutral-300 rounded-2xl shadow-xl overflow-hidden z-50"
      >
        <div className="handle h-10 flex items-center justify-between px-3 bg-neutral-100 border-b cursor-move">
          <span className="text-sm font-medium">{DEFAULTS[id].title}</span>
          <button
            className="btn"
            onClick={() => {
              // @ts-expect-error direct setState (zustand)
              useEditor.setState((s: any) => ({ panels: { ...s.panels, [id]: false } }));
              panelStorage.saveOpenFor(id, false);
            }}
          >
            <X size={16} />
          </button>
        </div>
        <div className="p-3 overflow-auto h-[calc(100%-40px)]">{children}</div>
      </Rnd>
    );
  };

  // ───────────── Render all panels ─────────────
  return (
    <>
      <PanelWindow id="imageSetting"><ImageSettingPanel /></PanelWindow>
      <PanelWindow id="move"><MovePanel /></PanelWindow>
      <PanelWindow id="properties"><PropertiesPanel /></PanelWindow>
      <PanelWindow id="layers"><LayersPanel /></PanelWindow>
      <PanelWindow id="image"><ImagePanel /></PanelWindow>
      <PanelWindow id="text"><TextPanel /></PanelWindow>
      <PanelWindow id="shape"><ShapePanel /></PanelWindow>
      <PanelWindow id="qr"><QRPanel /></PanelWindow>
      <PanelWindow id="export"><ExportPanel /></PanelWindow>
      <PanelWindow id="import"><ImportPanel /></PanelWindow>
    </>
  );
};
