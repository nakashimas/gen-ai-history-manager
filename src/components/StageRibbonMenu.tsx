import React, { useState } from "react";
import { useMenu } from "../hooks/useMenu";
import { useDrag } from "../hooks/useDrag";
import {
  GLOBAL_DEBUG_MENU_ID,
  GLOBAL_HELP_MENU_ID,
  GLOBAL_SETTINGS_MENU_ID,
  NODE_HEIGHT,
  NODE_WIDTH,
} from "../utils/constants";
import { useGraph } from "../hooks/useGraph";
import { topologicalSortProps } from "../utils/topologicalSort";

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
  const {
    nodes,
    edges,
    nodeOptions,
    addNode,
    setNodes,
    setEdges,
    setNodeOptions,
  } = useGraph();
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
        <div className="mx-1 h-5 border border-gray-500"></div>
        {/* 再生 */}
        <StageRibbonMenuButton
          icon="play_arrow"
          title="Start From Selected Position"
          handleClick={() => {}}
        />
        <StageRibbonMenuButton
          icon="pause"
          title="Stop"
          handleClick={() => {}}
        />
        <div className="mx-1 h-5 border border-gray-500"></div>
        {/* Nodeの一括変更 */}
        <StageRibbonMenuButton
          icon="rebase_edit"
          title="Auto Layout (Topological)"
          handleClick={() => {
            const layout: string[][] = topologicalSortProps(nodes, edges);
            // nodes の新しい配列を作る
            const newNodes = layout.flatMap((layer, layerIndex) =>
              layer.map((id, nodeIndex) => {
                const oldNode = nodes.find((n) => n.id === id)!;
                return {
                  ...oldNode,
                  x: layerIndex * NODE_WIDTH * 1.5,
                  y: nodeIndex * NODE_HEIGHT * 1.2,
                };
              })
            );

            setNodes(newNodes);
          }}
        />
        <StageRibbonMenuButton
          icon="rotate_left"
          title="Clear Results"
          handleClick={() => {}}
        />
        <div className="mx-1 h-5 border border-gray-500"></div>
        {/* 保存 */}
        <StageRibbonMenuButton
          icon="upload"
          title="Upload Save Data"
          handleClick={() => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "application/json";
            input.onchange = async (ev: Event) => {
              // JSONを読み込み;
              const file = (
                ev as unknown as React.ChangeEvent<HTMLInputElement>
              ).target?.files?.[0];
              if (!file) return;
              const jsonText = await file.text();

              try {
                const jsonData = JSON.parse(jsonText);
                // ここで更新;
                setNodes(jsonData.nodes ?? []);
                setEdges(jsonData.edges ?? []);
                setNodeOptions(jsonData.nodeOptions ?? []);
              } catch (err) {
                console.error("Invalid JSON file: ", err);
              }
            };
            input.click();
          }}
        />
        <StageRibbonMenuButton
          icon="download"
          title="Download Save Data AS JSON"
          handleClick={() => {
            const data = {
              nodes,
              edges,
              nodeOptions,
            };

            const blob = new Blob([JSON.stringify(data, null, 2)], {
              type: "application/json",
            });
            const url = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;

            const now = new Date();
            const timestamp = now.toISOString().replace(/[-:.]/g, "");
            a.download = `genai-hm-${timestamp}.json`;
            a.click();

            URL.revokeObjectURL(url);
          }}
        />
        <div className="mx-1 h-5 border border-gray-500"></div>
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
