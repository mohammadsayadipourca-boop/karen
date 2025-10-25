// ======================= src/component/editor/ui/AppleDock.tsx =======================
"use client";
import React from "react";
import { useEditor } from "../store/editorStore";
import { Ruler, Move, SlidersHorizontal, Layers, Image, Type, Shapes, QrCode, Download, Upload } from "lucide-react";

/** EN: Vertical Apple-like dock with uniform icon buttons.
 *  FA: داک عمودی با دکمه‌های آیکونی یکنواخت.
 */
export const AppleDock: React.FC = () => {
  const { panels, setPanel } = useEditor();
  const DockBtn: React.FC<{ title: string; active?: boolean; onClick:()=>void; children: React.ReactNode; }> = ({ title, active, onClick, children }) => (
    <button title={title} onClick={onClick} className={`k-icon ${active?"ring-2 ring-neutral-900":""}`}>{children}</button>
  );

  return (
    <div className="fixed left-8 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-3 p-2 rounded-[20px] bg-white/70 backdrop-blur-xl border border-neutral-200 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
      <DockBtn title="Image Setting" active={panels.imageSetting} onClick={()=>setPanel("imageSetting")}><Ruler size={18}/></DockBtn>
      <DockBtn title="Move" active={panels.move} onClick={()=>setPanel("move")}><Move size={18}/></DockBtn>
      <DockBtn title="Properties" active={panels.properties} onClick={()=>setPanel("properties")}><SlidersHorizontal size={18}/></DockBtn>
      <DockBtn title="Layers" active={panels.layers} onClick={()=>setPanel("layers")}><Layers size={18}/></DockBtn>
      <DockBtn title="Image" active={panels.image} onClick={()=>setPanel("image")}><Image size={18}/></DockBtn>
      <DockBtn title="Text" active={panels.text} onClick={()=>setPanel("text")}><Type size={18}/></DockBtn>
      <DockBtn title="Shape" active={panels.shape} onClick={()=>setPanel("shape")}><Shapes size={18}/></DockBtn>
      <DockBtn title="QR" active={panels.qr} onClick={()=>setPanel("qr")}><QrCode size={18}/></DockBtn>
      <DockBtn title="Export" active={panels.export} onClick={()=>setPanel("export")}><Download size={18}/></DockBtn>
      <DockBtn title="Import" active={panels.import} onClick={()=>setPanel("import")}><Upload size={18}/></DockBtn>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// END OF v0.2 — Apple-style polishing: uniform buttons, left dock, refined rulers.
// ─────────────────────────────────────────────────────────────────────────────
