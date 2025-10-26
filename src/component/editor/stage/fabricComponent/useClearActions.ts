"use client";
import { useEffect } from "react";
import type * as fabricNS from "fabric";

type Params = {
  side: "front" | "back";
  requestClearSide: boolean;
  requestClearBoth: boolean;
  setRequestClearSide: (v: boolean) => void;
  setRequestClearBoth: (v: boolean) => void;
  front: fabricNS.Canvas | null;
  back: fabricNS.Canvas | null;
};

export function useClearActions({
  side,
  requestClearSide,
  requestClearBoth,
  setRequestClearSide,
  setRequestClearBoth,
  front,
  back,
}: Params) {
  useEffect(() => {
    if (!requestClearSide) return;
    (side === "front" ? front : back)?.clear();
    setRequestClearSide(false);
  }, [requestClearSide, side, setRequestClearSide, front, back]);

  useEffect(() => {
    if (!requestClearBoth) return;
    front?.clear();
    back?.clear();
    setRequestClearBoth(false);
  }, [requestClearBoth, setRequestClearBoth, front, back]);
}
