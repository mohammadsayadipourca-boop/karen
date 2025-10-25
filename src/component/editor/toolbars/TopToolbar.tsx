// ======================= src/component/editor/toolbars/TopToolbar.tsx =======================
"use client";
import React from "react";
import { useEditor } from "../store/editorStore";
import {
  Square as FrontIcon,
  SquareDashed as BackIcon,
  Grid as GridIcon,
  Magnet as SnapIcon,
  RotateCcw as ResetPanelsIcon,
  Eraser as ClearIcon,
  Trash2 as ClearBothIcon,
  Ruler as ImageSettingIcon,
  Move as MoveIcon,
  SlidersHorizontal as PropertiesIcon,
  Layers as LayersIcon,
  Image as ImageIcon,
  Type as TextIcon,
  Shapes as ShapesIcon,
  QrCode as QrIcon,
  Download as ExportIcon,
  Upload as ImportIcon,
} from "lucide-react";
import { Confirm } from "../ui/Confirm";

/** EN: Apple-glass top toolbar with uniform button sizes.
 *  FA: نوار ابزار بالایی با استایل شیشه‌ای و اندازه یکنواخت دکمه‌ها.
 */
export const TopToolbar: React.FC = () => {
  const { side, setSide, showGrid, setShowGrid, snapEnabled, setSnapEnabled, snapSize, setSnapSize, setRequestClearSide, setRequestClearBoth, panels, setPanel } = useEditor();
  const [askClearSide, setAskClearSide] = React.useState(false);
  const [askClearBoth, setAskClearBoth] = React.useState(false);

  const Item: React.FC<{title:string; active?:boolean; onClick:()=>void; children:React.ReactNode}> = ({ title, active, onClick, children }) => (
    <button
      title={title}
      onClick={onClick}
      className={`k-btn ${active?"k-btn-active":""}`}
    >{children}</button>
  );

  const { togglePanel } = useEditor();

  return (
    <div className="fixed top-0 left-0 right-0 h-14 z-30 flex items-center gap-2 px-3 border-b border-neutral-200 bg-white/60 backdrop-blur-xl">
      {/* Side switch */}
      <Item title="Front" active={side==="front"} onClick={()=>setSide("front")}><FrontIcon size={18}/> <span className="hidden md:inline">Front</span></Item>
      <Item title="Back" active={side==="back"} onClick={()=>setSide("back")}><BackIcon size={18}/> <span className="hidden md:inline">Back</span></Item>

      <div className="h-6 w-px bg-neutral-300 mx-1"/>

      {/* Grid/Snap */}
      <Item title="Toggle Grid" active={showGrid} onClick={()=>setShowGrid(!showGrid)}><GridIcon size={18}/></Item>
      <Item title="Toggle Snap" active={snapEnabled} onClick={()=>setSnapEnabled(!snapEnabled)}><SnapIcon size={18}/></Item>
      <label className="text-xs text-neutral-600 ml-1">Snap</label>
      <input type="range" min={1} max={64} value={snapSize} onChange={(e)=>setSnapSize(Number(e.target.value))} className="w-28 h-2 accent-neutral-800"/>

      <div className="h-6 w-px bg-neutral-300 mx-1"/>

      {/* Gadgets from toolbar (toggle panels) */}
      <Item title="Image Setting" active={panels.imageSetting} onClick={()=>setPanel("imageSetting")}><ImageSettingIcon size={18}/></Item>
      <Item title="Move" active={panels.move} onClick={()=>setPanel("move")}><MoveIcon size={18}/></Item>
      <Item title="Properties" active={panels.properties} onClick={()=>setPanel("properties")}><PropertiesIcon size={18}/></Item>
      <Item title="Layers" active={panels.layers} onClick={()=>setPanel("layers")}><LayersIcon size={18}/></Item>
      <Item title="Image" active={panels.image} onClick={()=>setPanel("image")}><ImageIcon size={18}/></Item>
      <Item title="Text" active={panels.text} onClick={()=>setPanel("text")}><TextIcon size={18}/></Item>
      <Item title="Shape" active={panels.shape} onClick={()=>setPanel("shape")}><ShapesIcon size={18}/></Item>
      <Item title="QR" active={panels.qr} onClick={()=>setPanel("qr")}><QrIcon size={18}/></Item>
      <Item title="Export" active={panels.export} onClick={()=>setPanel("export")}><ExportIcon size={18}/></Item>
      <Item title="Import" active={panels.import} onClick={()=>setPanel("import")}><ImportIcon size={18}/></Item>

      <div className="h-6 w-px bg-neutral-300 mx-1"/>

      {/* Reset panels & Clear */}
      <Item title="Reset Panels" onClick={()=>{window.dispatchEvent(new CustomEvent("karen:reset-panels"));}}><ResetPanelsIcon size={18}/></Item>
      <Item title="Clear Current Side" onClick={()=>setAskClearSide(true)}><ClearIcon size={18}/></Item>
      <Item title="Clear Both Sides" onClick={()=>setAskClearBoth(true)}><ClearBothIcon size={18}/></Item>

      <Confirm open={askClearSide} title="Clear current side?" description="This will remove all layers on the active side." onCancel={()=>setAskClearSide(false)} onConfirm={()=>{setAskClearSide(false); setRequestClearSide(true);}} />
      <Confirm open={askClearBoth} title="Clear both sides?" description="This will remove all layers on both sides." onCancel={()=>setAskClearBoth(false)} onConfirm={()=>{setAskClearBoth(false); setRequestClearBoth(true);}} />

      <div className="ml-auto text-xs text-neutral-500 pr-2">karen • Apple-style</div>

      <button className="btn" onClick={() => togglePanel("imageSetting")} title="Image Setting"></button>
    </div>
  );
};
