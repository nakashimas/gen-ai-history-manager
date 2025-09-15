import React, { useRef } from "react";
import { useGraph } from "../hooks/useGraph";
import { isEqualContentsId, resolveId } from "../utils/contentsId";
import MarkdownEditor, {
  type MarkdownEditorHandle,
} from "./form/MarkdownEditor";
import ContentsNodeMenuHelp from "./ContentsNodeMenuHelp";
import EditableTitle from "./form/EditableTitle";

const ContentsNodeMenuEdit: React.FC<{ recentDragSourceId: string }> = ({
  recentDragSourceId,
}) => {
  const { nodes, nodeOptions, updateNodeOptions } = useGraph();
  const editorRef = useRef<MarkdownEditorHandle>(null);

  const node = nodes.find((n) => isEqualContentsId(n.id, recentDragSourceId));

  if (!node) return <ContentsNodeMenuHelp />;

  const nodeOption = nodeOptions.find((n) =>
    isEqualContentsId(n.id, recentDragSourceId)
  ) ?? { id: resolveId(node.id) };

  return (
    <>
      <div className="mx-auto max-w-2xl py-5">
        {/* 共通部分 */}
        <div className="mb-5 flex">
          <h1 className="text-lg font-semibold truncate me-2">Edit Node:</h1>
          <EditableTitle
            initialTitle={nodeOption?.options?.label}
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
            initialValue={
              nodeOption?.options &&
              "data" in nodeOption.options &&
              nodeOption.options.data
                ? nodeOption.options.data
                : ""
            }
            onChange={(value) => {
              updateNodeOptions(node.id, {
                options: { data: value },
              });
            }}
          ></MarkdownEditor>
        )}
        <span>{JSON.stringify(node)}</span>
        <span>{JSON.stringify(nodeOption)}</span>
      </div>
    </>
  );
};

export default ContentsNodeMenuEdit;
