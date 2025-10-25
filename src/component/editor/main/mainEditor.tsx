// ======================= src/component/editor/main/mainEditor.tsx =======================
"use client";
import React, { useEffect } from "react";
import { create } from "zustand";
import { FabricStage } from "../stage/FabricStage";
import { TopToolbar } from "../toolbars/TopToolbar";
import { BottomBar } from "../toolbars/BottomBar";
import { RulerHorizontal, RulerVertical } from "../ui/Ruler";
import { AppleDock } from "../ui/AppleDock";
import { useKeyBindings } from "../utils/useKeyBindings";
import { useEditor } from "../store/editorStore";
import { FloatingPanels } from "../floating/FloatingPanels";

// ── Types and store omitted here (already declared above) ──

const MainEditor: React.FC = () => {
  useKeyBindings();
  const { zoom, units, dpi, rulerOffsetX, rulerOffsetY } = useEditor();
  useEffect(() => {}, []);

  return (
    <div className="relative w-full h-full select-none">
      <TopToolbar />

      {/* Left Apple-like Dock */}
      <AppleDock />

      <div className="absolute inset-x-0 top-14 bottom-12 bg-[linear-gradient(180deg,rgba(250,250,252,0.9),rgba(245,245,248,0.8))]">
        <div className="absolute left-8 right-0 top-0 h-6 z-20 bg-neutral-50 border-b border-neutral-300">
          <RulerHorizontal zoom={zoom} units={units} dpi={dpi} offsetX={rulerOffsetX} />
        </div>

        <div className="absolute left-0 top-6 bottom-0 w-8 z-20 bg-neutral-50 border-r border-neutral-300">
          <RulerVertical zoom={zoom} units={units} dpi={dpi} offsetY={rulerOffsetY} />
        </div>
        <div id="stage-container" className="absolute left-8 right-0 top-6 bottom-0 overflow-hidden grid place-items-center">
          <div className="relative max-w-full max-h-full p-4">
            <FabricStage />
            <FloatingPanels />
          </div>
        </div>
      </div>

      <BottomBar />
    </div>
  );
};
export default MainEditor;
