import { useState, useCallback } from "react";
import { useMenu } from "./useMenu";

export function useMenuHeight(initialMenuHeight: number = 300) {
  const [menuHeight, setMenuHeight] = useState(initialMenuHeight);
  const { isMenuOpen, openMenu, closeMenu } = useMenu();
  const minHeight = 20;
  const maxHeight = window.innerHeight - 25;

  // ---- PC用（ドラッグでリサイズ）
  const onMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.button !== 0) return;
      e.preventDefault();

      const startY = e.clientY;
      const startHeight = Number(menuHeight);

      const setFixedMenuHeight = (newHeight: number) => {
        if (newHeight <= minHeight) {
          setMenuHeight(initialMenuHeight);
          closeMenu();
        } else if (newHeight >= maxHeight) {
          setMenuHeight(maxHeight);
        } else {
          setMenuHeight(newHeight);
        }
      };

      const onMouseMove = (moveEvent: MouseEvent) => {
        // 画面の下からなのでマイナスをとる
        if (!isMenuOpen) {
          // 閉じている状態からのドラッグ
          const newHeight = window.innerHeight - moveEvent.clientY;
          setFixedMenuHeight(newHeight);
          if (newHeight >= minHeight) openMenu();
        } else {
          const newHeight = startHeight - (moveEvent.clientY - startY);
          setFixedMenuHeight(newHeight);
        }
      };

      const onMouseUp = () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
      };

      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    },
    [menuHeight, maxHeight, isMenuOpen, initialMenuHeight, closeMenu, openMenu]
  );

  // ---- モバイル用（ドラッグでリサイズ）
  const onTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (e.touches.length === 1) {
        const startY = e.touches[0].clientY;
        const startHeight = Number(menuHeight);

        const onTouchMove = (moveEvent: TouchEvent) => {
          if (moveEvent.touches.length === 1) {
            const touch = moveEvent.touches[0];
            // 画面の下からなのでマイナスをとる
            if (!isMenuOpen) {
              // 閉じている状態からのドラッグ
              setMenuHeight(window.innerHeight - touch.clientY);
              openMenu();
            } else {
              const newHeight = startHeight - (touch.clientY - startY);

              if (newHeight <= 20) {
                setMenuHeight(initialMenuHeight);
                closeMenu();
              } else {
                setMenuHeight(newHeight);
              }
            }
          }
        };

        const stop = () => {
          window.removeEventListener("touchmove", onTouchMove);
          window.removeEventListener("touchend", stop);
        };

        window.addEventListener("touchmove", onTouchMove, { passive: false });
        window.addEventListener("touchend", stop);
      }
    },
    [menuHeight, isMenuOpen, openMenu, closeMenu, initialMenuHeight]
  );

  return {
    menuHeight,
    setMenuHeight,
    bind: {
      onMouseDown,
      onTouchStart,
    },
  };
}
