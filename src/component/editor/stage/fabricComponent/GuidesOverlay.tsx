"use client";
import React from "react";

type Props = {
  zoom: number;
  bleedEnabled: boolean;
  safeEnabled: boolean;
  effBleed: number;
  effSafe: number;
  trimRadius: number;
  safeRadius: number;
};

const GuidesOverlay: React.FC<Props> = ({
  zoom,
  bleedEnabled,
  safeEnabled,
  effBleed,
  effSafe,
  trimRadius,
  safeRadius,
}) => {
  return (
    <>
      {/* Outer overall border (red) — only when Bleed enabled */}
      {bleedEnabled && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            borderRadius: 0,
            boxSizing: "border-box",
            border: `${Math.max(1, Math.round(1 * zoom))}px dashed rgba(239,68,68,0.7)`,
          }}
        />
      )}

      {/* Trim border (red) inset by effective Bleed */}
      {bleedEnabled && (
        <div
          aria-hidden
          className="pointer-events-none absolute"
          style={{
            top: Math.round(effBleed * zoom),
            left: Math.round(effBleed * zoom),
            right: Math.round(effBleed * zoom),
            bottom: Math.round(effBleed * zoom),
            borderRadius: trimRadius,
            boxSizing: "border-box",
            border: `${Math.max(1, Math.round(1 * zoom))}px dashed rgba(239,68,68,0.9)`,
          }}
        />
      )}

      {/* Safe area (green) inset by effective Bleed + Safe */}
      {safeEnabled && (
        <div
          aria-hidden
          className="pointer-events-none absolute"
          style={{
            top: Math.round((effBleed + effSafe) * zoom),
            left: Math.round((effBleed + effSafe) * zoom),
            right: Math.round((effBleed + effSafe) * zoom),
            bottom: Math.round((effBleed + effSafe) * zoom),
            borderRadius: safeRadius,
            boxSizing: "border-box",
            border: `${Math.max(1, Math.round(1 * zoom))}px dashed rgba(16,185,129,0.9)`,
          }}
        />
      )}
    </>
  );
};

export default GuidesOverlay;
