import React, { useEffect, useRef } from "react";
import { useGraph } from "../../hooks/useGraph";
import { isEqualContentsId, resolveId } from "../../utils/contentsId";
import MarkdownEditor, {
  type MarkdownEditorHandle,
} from "../form/MarkdownEditor";
import EditableTitle, { type EditableTitleHandle } from "../form/EditableTitle";
import NodeMenuHelp from "./NodeMenuHelp";

const NodeMenuEdit: React.FC<{ recentDragSourceId: string }> = ({
  recentDragSourceId,
}) => {
  // 元データ取得
  const { nodes, nodeOptions, updateNodeOptions } = useGraph();
  const node = nodes.find((n) => isEqualContentsId(n.id, recentDragSourceId));
  const nodeOption = nodeOptions.find((n) =>
    isEqualContentsId(n.id, recentDragSourceId)
  ) ?? { id: resolveId(node?.id ?? "") };

  // 編集可能データのrefと初期値
  // TODO: このあたり整理できないか
  const editorRef = useRef<MarkdownEditorHandle>(null);
  const titleRef = useRef<EditableTitleHandle>(null);

  const initialTitleValue = nodeOption?.options?.label ?? "";
  const initialDataValue =
    nodeOption?.options &&
    "data" in nodeOption.options &&
    nodeOption.options.data
      ? nodeOption.options.data
      : "";

  // 変更検知など
  useEffect(() => {
    titleRef?.current?.setTitle(initialTitleValue);
    editorRef?.current?.setValue(initialDataValue);
  }, [initialTitleValue, initialDataValue]);

  if (!node) return <NodeMenuHelp />;

  return (
    <>
      <div className="mx-auto max-w-2xl py-5">
        {/* 共通部分 */}
        <div className="mb-5 flex">
          <h1 className="text-lg font-semibold truncate me-2">Edit Node:</h1>
          <EditableTitle
            ref={titleRef}
            initialTitle={initialTitleValue}
            onSave={(newTitle) => {
              updateNodeOptions(node.id, {
                options: { label: newTitle },
              });
            }}
          />
        </div>
        {/* 個別部分 */}
        {/* data部分 dataはtypeによって内容が異なる */}
        {node.type === 0 && (
          <MarkdownEditor
            ref={editorRef}
            initialValue={initialDataValue}
            onChange={(value) => {
              updateNodeOptions(node.id, {
                options: { data: value },
              });
            }}
          ></MarkdownEditor>
        )}
      </div>
    </>
  );
};

export default NodeMenuEdit;
