// hooks/useZoomPan.ts
import { useState, useCallback } from "react";

type Offset = { x: number; y: number };

export function useZoomPan(
  initialZoom = 1,
  initialOffset: Offset = { x: 0, y: 0 }
) {
  const [zoom, setZoom] = useState(initialZoom);
  const [offset, setOffset] = useState<Offset>(initialOffset);

  // ---- PC用（ホイールズーム）
  const onWheel = useCallback((e: React.WheelEvent<SVGSVGElement>) => {
    // e.preventDefault();
    const scaleAmount = -e.deltaY * 0.001;
    setZoom((z) => Math.min(5, Math.max(0.2, z * (1 + scaleAmount))));
  }, []);

  // ---- PC用（ドラッグでパン）
  const onMouseDown = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (e.button !== 0) return;
      e.preventDefault();

      const startX = e.clientX;
      const startY = e.clientY;
      const startOffset = { ...offset };

      const onMouseMove = (moveEvent: MouseEvent) => {
        setOffset({
          x: startOffset.x + (moveEvent.clientX - startX),
          y: startOffset.y + (moveEvent.clientY - startY),
        });
      };

      const onMouseUp = () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
      };

      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    },
    [offset]
  );

  // ---- モバイル用（1本指ドラッグでパン / 2本指ピンチでズーム）
  const onTouchStart = useCallback(
    (e: React.TouchEvent<SVGSVGElement>) => {
      if (e.touches.length === 1) {
        const startX = e.touches[0].clientX;
        const startY = e.touches[0].clientY;
        const startOffset = { ...offset };

        const onTouchMove = (moveEvent: TouchEvent) => {
          if (moveEvent.touches.length === 1) {
            const touch = moveEvent.touches[0];
            setOffset({
              x: startOffset.x + (touch.clientX - startX),
              y: startOffset.y + (touch.clientY - startY),
            });
          }
        };

        const stop = () => {
          window.removeEventListener("touchmove", onTouchMove);
          window.removeEventListener("touchend", stop);
        };

        window.addEventListener("touchmove", onTouchMove, { passive: false });
        window.addEventListener("touchend", stop);
      }

      // ピンチズーム用
      if (e.touches.length === 2) {
        const getDistance = (t1: React.Touch, t2: React.Touch) => {
          const dx = t1.clientX - t2.clientX;
          const dy = t1.clientY - t2.clientY;
          return Math.sqrt(dx * dx + dy * dy);
        };

        const startDist = getDistance(e.touches[0], e.touches[1]);
        const startZoom = zoom;

        const onPinchMove = (moveEvent: TouchEvent) => {
          if (moveEvent.touches.length === 2) {
            const dist = getDistance(
              moveEvent.touches[0],
              moveEvent.touches[1]
            );
            const scale = dist / startDist;
            setZoom(Math.min(5, Math.max(0.2, startZoom * scale)));
          }
        };

        const stop = () => {
          window.removeEventListener("touchmove", onPinchMove);
          window.removeEventListener("touchend", stop);
        };

        window.addEventListener("touchmove", onPinchMove, { passive: false });
        window.addEventListener("touchend", stop);
      }
    },
    [offset, zoom]
  );

  return {
    zoom,
    offset,
    setZoom,
    setOffset,
    bind: {
      onWheel,
      onMouseDown,
      onTouchStart,
    },
  };
}
