// ======================= src/component/editor/utils/cn.ts =======================
export function cn(...cls: (string|false|undefined)[]) { return cls.filter(Boolean).join(" "); }

// ======================= Tailwind helper classes (global.css suggestion) =======================
// .btn { @apply inline-flex items-center justify-center gap-1 h-9 px-3 rounded-xl border border-neutral-300 bg-white hover:bg-neutral-50 text-sm; }
// .btn-active { @apply bg-neutral-900 text-white border-neutral-900; }
// .btn-danger { @apply bg-red-600 text-white border-red-600 hover:bg-red-700; }
// .input { @apply h-9 px-2 rounded-xl border border-neutral-300 bg-white text-sm; }

// ─────────────────────────────────────────────────────────────────────────────
// END OF v0.1 scaffold — TODOs remain to wire Fabric selections, layers, import/export, image/text/shape/QR features, grid/snap logic, and precise fit algorithm.
// ─────────────────────────────────────────────────────────────────────────────
