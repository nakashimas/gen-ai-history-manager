import React, { useEffect, useState, type JSX } from "react";
import { useMenu } from "../hooks/useMenu";
import { useMenuHeight } from "../hooks/useMenuHeight";
import { useDrag } from "../hooks/useDrag";
import ContentsNodeMenuHelp from "./ContentsNodeMenuHelp";
import {
  GLOBAL_DEBUG_MENU_ID,
  GLOBAL_HELP_MENU_ID,
  GLOBAL_SETTINGS_MENU_ID,
} from "../utils/constants";
import ContentsNodeMenuDebug from "./ContentsNodeMenuDebug";
import ContentsNodeMenuSettings from "./ContentsNodeMenuSettings";
import ContentsNodeMenuEdit from "./ContentsNodeMenuEdit";

const ContentsNodeMenu: React.FC<{ children?: React.ReactNode }> = () => {
  const { isMenuOpen, openMenu, closeMenu } = useMenu();
  const { dragInfo } = useDrag();
  const { menuHeight, bind } = useMenuHeight(300);

  const [recentDragSourceId, setRecentDragSourceId] =
    useState<string>(GLOBAL_HELP_MENU_ID);

  useEffect(() => {
    if (dragInfo?.sourceId) setRecentDragSourceId(dragInfo.sourceId);
  }, [dragInfo, setRecentDragSourceId]);

  const menuMap: Record<string, JSX.Element> = {
    [GLOBAL_DEBUG_MENU_ID]: <ContentsNodeMenuDebug />,
    [GLOBAL_SETTINGS_MENU_ID]: <ContentsNodeMenuSettings />,
    [GLOBAL_HELP_MENU_ID]: <ContentsNodeMenuHelp />,
  };

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
        className="bg-white overflow-hidden"
      >
        <div className="overflow-y-auto h-full">
          {menuMap[recentDragSourceId] ?? (
            <ContentsNodeMenuEdit recentDragSourceId={recentDragSourceId} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentsNodeMenu;
