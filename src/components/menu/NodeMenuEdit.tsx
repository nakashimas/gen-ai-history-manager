import React, { useEffect, useRef } from "react";
import { useGraph } from "../../hooks/useGraph";
import { isEqualContentsId, resolveId } from "../../utils/contentsId";
import MarkdownEditor, {
  type MarkdownEditorHandle,
} from "../form/MarkdownEditor";
import EditableTitle, { type EditableTitleHandle } from "../form/EditableTitle";
import NodeMenuHelp from "./NodeMenuHelp";
import { NodeType } from "../../contexts/GraphContextOptions";

const NodeMenuEdit: React.FC<{ recentDragSourceId: string }> = ({
  recentDragSourceId,
}) => {
  // 元データ取得
  const { nodes, nodeOptions, updateNode, updateNodeOptions } = useGraph();
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
          {/* NodeOptions.label */}
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
        <div className="mb-5 flex">
          {/* Node.type */}
          <select
            id="node-type"
            className="border border-gray-300 text-black text-sm rounded-lg block w-full p-1.5"
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
              updateNode(node.id, {
                type: event.target
                  .value as unknown as (typeof NodeType)[keyof typeof NodeType],
              });
            }}
          >
            {(Object.keys(NodeType) as Array<keyof typeof NodeType>).map(
              (x) => {
                return (
                  <option
                    key={x}
                    value={NodeType[x]}
                    selected={node.type == NodeType[x]}
                  >
                    Type: {x}
                  </option>
                );
              }
            )}
          </select>
        </div>
        {/* 個別部分 */}
        {/* data: Text */}
        {(node.type == NodeType.Plaintext ||
          node.type == NodeType.Preprocessing) && (
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
        {/* data: Picture */}
        {/* data: Video */}
        {/* caption: Picture | Video */}
        {/* requests: API | AI */}
      </div>
    </>
  );
};

export default NodeMenuEdit;
