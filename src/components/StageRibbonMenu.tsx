import React, { useState } from "react";
import { useMenu } from "../hooks/useMenu";
import { useDrag } from "../hooks/useDrag";
import {
  GLOBAL_DEBUG_MENU_ID,
  GLOBAL_HELP_MENU_ID,
  GLOBAL_SETTINGS_MENU_ID,
} from "../utils/constants";
import { useGraph } from "../hooks/useGraph";

const StageRibbonMenuButton: React.FC<{
  icon: string;
  title: string;
  children?: React.ReactNode;
  handleClick?: () => void;
}> = ({ icon, title, handleClick }) => {
  return (
    <span
      className="material-symbols-outlined text-white cursor-pointer text-[1.5rem]"
      title={title}
      onClick={handleClick}
    >
      {icon}
    </span>
  );
};

const StageRibbonMenu: React.FC<{ children?: React.ReactNode }> = () => {
  const { addNode } = useGraph();
  const [isRibbonOpen, setIsRibbonOpen] = useState<boolean>(true);
  const { openMenu } = useMenu();
  const { startDrag } = useDrag();

  return (
    <div className="fixed top-[0px] left-0 w-full z-20 pointer-events-none select-none">
      {/* メニュー 本体 */}
      <div
        style={{ height: (isRibbonOpen ? 2.5 : 0) + "rem", opacity: 0.5 }}
        className="bg-gray px-2 flex items-center align-middle overflow-hidden pointer-events-auto"
      >
        {/* エディタ操作 */}
        <StageRibbonMenuButton
          icon="add"
          title="Create Node"
          handleClick={() => {
            const newId = self.crypto.randomUUID();
            addNode({
              id: newId,
              x: 5,
              y: 5,
              type: 0,
            });
          }}
        />
        <StageRibbonMenuButton
          icon="upload"
          title="Upload Save Data"
          handleClick={() => {}}
        />
        <StageRibbonMenuButton
          icon="download"
          title="Download Save Data AS JSON"
          handleClick={() => {}}
        />
        {/* 設定とヘルプ */}
        <StageRibbonMenuButton
          icon="bug_report"
          title="Show Editor Debug Info"
          handleClick={() => {
            startDrag(GLOBAL_DEBUG_MENU_ID, 0, 0);
            openMenu();
          }}
        />
        <StageRibbonMenuButton
          icon="settings"
          title="Settings"
          handleClick={() => {
            startDrag(GLOBAL_SETTINGS_MENU_ID, 0, 0);
            openMenu();
          }}
        />
        <StageRibbonMenuButton
          icon="lightbulb"
          title="Help"
          handleClick={() => {
            startDrag(GLOBAL_HELP_MENU_ID, 0, 0);
            openMenu();
          }}
        />
      </div>
      {/* メニュー 高さ調整バー */}
      <div className="bg-gray h-[0.5rem]"></div>
      {/* メニュー 開閉ボタン */}
      <div className="flex justify-end">
        <div
          className="pointer-events-auto"
          onClick={() => {
            if (isRibbonOpen) {
              setIsRibbonOpen(false);
            } else {
              setIsRibbonOpen(true);
            }
          }}
        >
          <div className="bg-gray h-[1.25rem] w-[2.5rem] text-center text-white">
            {isRibbonOpen ? (
              <span className="material-symbols-outlined">stat_1</span>
            ) : (
              <span className="material-symbols-outlined">stat_minus_1</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StageRibbonMenu;
