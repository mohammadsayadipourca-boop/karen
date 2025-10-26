"use client";
import { useEffect, useRef } from "react";
import * as fabric from "fabric";

export function useFabricInit() {
  const frontRef = useRef<HTMLCanvasElement | null>(null);
  const backRef = useRef<HTMLCanvasElement | null>(null);
  const front = useRef<fabric.Canvas | null>(null);
  const back = useRef<fabric.Canvas | null>(null);

  useEffect(() => {
    if (frontRef.current && !front.current) {
      front.current = new (fabric as any).Canvas(frontRef.current, {
        preserveObjectStacking: true,
        selection: true,
      });
    }
    if (backRef.current && !back.current) {
      back.current = new (fabric as any).Canvas(backRef.current, {
        preserveObjectStacking: true,
        selection: true,
      });
    }
    return () => {
      front.current?.dispose();
      back.current?.dispose();
    };
  }, []);

  return { frontRef, backRef, front, back };
}
