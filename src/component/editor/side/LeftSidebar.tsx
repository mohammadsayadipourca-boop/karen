// ======================= src/component/editor/side/LeftSidebar.tsx =======================
// (Removed) We now open gadgets from the top toolbar. This file is intentionally kept empty to avoid imports.
export {};
    return () => window.removeEventListener("karen:reset-panels", fn);
  }, []);

  const [rndKey, setRndKey] = useState(0);

  return (
    <Rnd key={rndKey} default={{ x: 12, y: 80, width: 320, height: 520 }} bounds="window" dragHandleClassName="handle" className="shadow-xl rounded-2xl overflow-hidden bg-white/90 backdrop-blur border border-neutral-300">
      <div className="handle h-10 flex items-center justify-between px-3 bg-neutral-100 border-b border-neutral-300 cursor-move">
        <div className="font-medium text-sm">Tools</div>
        <button className="btn" onClick={() => setOpen({ ...open, imageSetting: true })}><Ruler size={16} /></button>
      </div>
      <div className="p-2 space-y-2 overflow-auto h-[calc(520px-40px)]">
        <Section icon={<Wrench size={16} />} title="Image Setting" open={open.imageSetting} onToggle={() => setOpen({ ...open, imageSetting: !open.imageSetting })}>
          <ImageSettingPanel />
        </Section>
        <Section icon={<Move size={16} />} title="Move" open={open.move} onToggle={() => setOpen({ ...open, move: !open.move })}>
          <MovePanel />
        </Section>
        <Section icon={<SlidersHorizontal size={16} />} title="Properties" open={open.properties} onToggle={() => setOpen({ ...open, properties: !open.properties })}>
          <PropertiesPanel />
        </Section>
        <Section icon={<Layers size={16} />} title="Layers" open={open.layers} onToggle={() => setOpen({ ...open, layers: !open.layers })}>
          <LayersPanel />
        </Section>
        <Section icon={<ImageIcon size={16} />} title="Image" open={open.image} onToggle={() => setOpen({ ...open, image: !open.image })}>
          <ImagePanel />
        </Section>
        <Section icon={<TextIcon size={16} />} title="Text" open={open.text} onToggle={() => setOpen({ ...open, text: !open.text })}>
          <TextPanel />
        </Section>
        <Section icon={<Shapes size={16} />} title="Shape" open={open.shape} onToggle={() => setOpen({ ...open, shape: !open.shape })}>
          <ShapePanel />
        </Section>
        <Section icon={<QrCode size={16} />} title="QR Code" open={open.qr} onToggle={() => setOpen({ ...open, qr: !open.qr })}>
          <QRPanel />
        </Section>
        <Section icon={<Download size={16} />} title="Export" open={open.export} onToggle={() => setOpen({ ...open, export: !open.export })}>
          <ExportPanel />
        </Section>
        <Section icon={<Upload size={16} />} title="Import" open={open.import} onToggle={() => setOpen({ ...open, import: !open.import })}>
          <ImportPanel />
        </Section>
      </div>
    </Rnd>
  );
};

const Section: React.FC<{ icon: React.ReactNode; title: string; open: boolean; onToggle: () => void; children: React.ReactNode; }> = ({ icon, title, open, onToggle, children }) => {
  return (
    <div className="border border-neutral-200 rounded-xl overflow-hidden">
      <button onClick={onToggle} className="w-full h-10 flex items-center gap-2 px-3 bg-neutral-50 hover:bg-neutral-100">
        {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />} {icon}
        <span className="text-sm font-medium">{title}</span>
      </button>
      {open && <div className="p-3 bg-white">{children}</div>}
    </div>
  );
};
