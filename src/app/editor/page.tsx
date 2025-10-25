// ─────────────────────────────────────────────────────────────────────────────
// Project: karen (AzIn) – Business Card Editor
// Tech: Next.js (App Router) + TypeScript + Tailwind + Fabric.js + Zustand + react-rnd + lucide-react + qrcode
// Notes: Bilingual comments EN/FA. Keep UI text in English; icon-first controls.
// ─────────────────────────────────────────────────────────────────────────────

// ============================== app/editor/page.tsx ==========================
"use client";
import React from "react";
import MainEditor from "@/component/editor/main/mainEditor";

/**
 * EN: Editor entry page. Full-screen, mounts MainEditor.
 * FA: صفحه ورود ادیتور. تمام‌صفحه و MainEditor را بارگذاری می‌کند.
 */
export default function EditorPage() {
  return (
    <div className="w-screen h-screen overflow-hidden bg-neutral-100 text-neutral-900">
      <MainEditor />
    </div>
  );
}