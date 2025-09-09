import React, { useEffect, useState } from "react";
import { useMenu } from "../hooks/useMenu";
import { useMenuHeight } from "../hooks/useMenuHeight";
import { useDrag } from "../hooks/useDrag";
import { useGraph } from "../hooks/useGraph";

const ContentsNodeMenu: React.FC<{ children?: React.ReactNode }> = () => {
  const { isMenuOpen, openMenu, closeMenu } = useMenu();
  const { dragInfo } = useDrag();
  const { nodes, edges, nodeOptions } = useGraph();
  const { menuHeight, bind } = useMenuHeight(300);

  const [recentDragSourceId, setRecentDragSourceId] = useState<string>();

  useEffect(() => {
    if (dragInfo?.sourceId) setRecentDragSourceId(dragInfo.sourceId);
  }, [dragInfo, setRecentDragSourceId]);

  return (
    <div className="fixed bottom-[0px] left-0 w-full z-20 pointer-events-auto">
      {/* メニュー 開閉ボタン */}
      <div
        className="flex justify-end select-none"
        onClick={() => {
          if (isMenuOpen) {
            closeMenu();
          } else {
            openMenu();
          }
        }}
      >
        <div className="bg-gray h-[1.25rem] w-[2.5rem] text-center text-white">
          {isMenuOpen ? (
            <span className="material-symbols-outlined">stat_minus_1</span>
          ) : (
            <span className="material-symbols-outlined">stat_1</span>
          )}
        </div>
      </div>
      {/* メニュー 高さ調整バー */}
      <div
        className="bg-gray h-[1.25rem] text-center select-none"
        {...bind} // イベントを適用
      >
        <span className="material-symbols-outlined text-white">menu</span>
      </div>
      {/* メニュー 本体 */}
      <div
        style={{ height: (isMenuOpen ? menuHeight : 0) + "px" }}
        className="bg-white"
      >
        <span>{recentDragSourceId}</span>
        <hr></hr>
        <span>{JSON.stringify(nodes)}</span>
        <hr></hr>
        <span>{JSON.stringify(edges)}</span>
        <hr></hr>
        <span>{JSON.stringify(nodeOptions)}</span>
      </div>
    </div>
  );
};

export default ContentsNodeMenu;
