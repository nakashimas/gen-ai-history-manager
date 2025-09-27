import React, { useEffect, useState, type JSX } from "react";
import { useMenu } from "../../hooks/useMenu";
import { useMenuHeight } from "../../hooks/useMenuHeight";
import { useDrag } from "../../hooks/useDrag";
import NodeMenuHelp from "./NodeMenuHelp";
import NodeMenuDebug from "./NodeMenuDebug";
import NodeMenuSettings from "./NodeMenuSettings";
import NodeMenuEdit from "./NodeMenuEdit";
import {
  GLOBAL_DEBUG_MENU_ID,
  GLOBAL_HELP_MENU_ID,
  GLOBAL_SETTINGS_MENU_ID,
} from "../../utils/constants";

const NodeMenu: React.FC<{ children?: React.ReactNode }> = () => {
  const { isMenuOpen, openMenu, closeMenu } = useMenu();
  const { dragInfo } = useDrag();
  const { menuHeight, bind } = useMenuHeight(300);

  const [recentDragSourceId, setRecentDragSourceId] =
    useState<string>(GLOBAL_HELP_MENU_ID);

  useEffect(() => {
    if (dragInfo?.sourceId) setRecentDragSourceId(dragInfo.sourceId);
  }, [dragInfo, setRecentDragSourceId]);

  const menuMap: Record<string, JSX.Element> = {
    [GLOBAL_DEBUG_MENU_ID]: <NodeMenuDebug />,
    [GLOBAL_SETTINGS_MENU_ID]: <NodeMenuSettings />,
    [GLOBAL_HELP_MENU_ID]: <NodeMenuHelp />,
  };

  return (
    <div className="fixed bottom-[0px] left-0 w-full z-20 pointer-events-none">
      {/* メニュー 開閉ボタン */}
      <div className="flex justify-end select-none">
        <div
          className="bg-gray h-[1.25rem] w-[2.5rem] text-center text-white pointer-events-auto"
          onClick={() => {
            if (isMenuOpen) {
              closeMenu();
            } else {
              openMenu();
            }
          }}
        >
          {isMenuOpen ? (
            <span className="material-symbols-outlined">stat_minus_1</span>
          ) : (
            <span className="material-symbols-outlined">stat_1</span>
          )}
        </div>
      </div>
      {/* メニュー 高さ調整バー */}
      <div
        className="bg-gray h-[1.25rem] text-center select-none pointer-events-auto"
        {...bind} // イベントを適用
      >
        <span className="material-symbols-outlined text-white">menu</span>
      </div>
      {/* メニュー 本体 */}
      <div
        style={{ height: (isMenuOpen ? menuHeight : 0) + "px" }}
        className="bg-white overflow-hidden pointer-events-auto"
      >
        <div className="overflow-y-auto h-full px-2">
          {menuMap[recentDragSourceId] ?? (
            <NodeMenuEdit recentDragSourceId={recentDragSourceId} />
          )}
        </div>
      </div>
    </div>
  );
};

export default NodeMenu;
