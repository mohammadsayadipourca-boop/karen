// ======================= src/component/editor/toolbars/BottomBar.tsx =======================
"use client";
import React from "react";
import { useEditor } from "../store/editorStore";

export const BottomBar: React.FC = () => {
  const { zoom, setZoom, side, setSide } = useEditor();
  const pct = Math.round(zoom * 100);
  return (
    <div className="fixed bottom-3 right-3 z-40 flex items-center gap-2">
      <div className="rounded-2xl border border-neutral-200 overflow-hidden bg-white/70 backdrop-blur-xl flex">
        <button className="h-10 px-3" onClick={() => setZoom((z:number)=>z/1.1)}>−</button>
        <div className="h-10 px-3 flex items-center gap-2">
          <input type="range" min={10} max={800} value={pct} onChange={(e) => setZoom(Number(e.target.value) / 100)} className="w-40" />
          <span className="text-xs text-neutral-600 w-10 text-right">{pct}%</span>
        </div>
        <button className="h-10 px-3" onClick={() => setZoom((z:number)=>z*1.1)}>＋</button>
        <button className="h-10 px-3" onClick={() => setZoom(1)}>100%</button>
        <button className="h-10 px-3" onClick={() => { window.dispatchEvent(new CustomEvent("karen:fit")); }}>Fit</button>
      </div>
      <div className="rounded-2xl border border-neutral-200 overflow-hidden bg-white/70 backdrop-blur-xl flex">
        <button className={`h-10 px-4 ${side==='front'?'bg-neutral-900 text-white':''}`} onClick={()=>setSide('front')}>Front</button>
        <button className={`h-10 px-4 ${side==='back'?'bg-neutral-900 text-white':''}`} onClick={()=>setSide('back')}>Back</button>
      </div>
    </div>
  );
};
