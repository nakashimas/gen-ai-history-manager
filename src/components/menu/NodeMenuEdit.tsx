import React, { useEffect, useRef } from "react";
import { useGraph } from "../../hooks/useGraph";
import { isEqualContentsId, resolveId } from "../../utils/contentsId";
import MarkdownEditor, {
  type MarkdownEditorHandle,
} from "../form/MarkdownEditor";
import EditableTitle, { type EditableTitleHandle } from "../form/EditableTitle";
import NodeMenuHelp from "./NodeMenuHelp";
import {
  APIMethod,
  APIType,
  NodeType,
  type APINodeOptions,
} from "../../contexts/GraphContextOptions";
import Select from "../form/Select";

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
  const initialCaptionValue =
    nodeOption?.options &&
    "caption" in nodeOption.options &&
    nodeOption.options.caption
      ? nodeOption.options.caption
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
          <Select
            id="node-type"
            options={NodeType}
            selected={node.type}
            onChange={(newValue) => {
              updateNode(node.id, {
                type: newValue,
              });
            }}
            renderLabel={(x) => `Type: ${x}`}
          />
        </div>

        {/* 個別部分 */}
        {/* NodeOptions.data: Text */}
        {(node.type == NodeType.Plaintext ||
          node.type == NodeType.Preprocessing) && (
          <div className="mb-5">
            <MarkdownEditor
              ref={editorRef}
              initialValue={initialDataValue}
              onChange={(value) => {
                updateNodeOptions(node.id, {
                  options: { data: value },
                });
              }}
            ></MarkdownEditor>
          </div>
        )}

        {/* NodeOptions.data: Picture */}

        {/* NodeOptions.data: Video */}

        {/* NodeOptions.caption: Picture | Video */}
        {(node.type == NodeType.Video || node.type == NodeType.Picture) && (
          <div className="mb-5">
            <label className="text-black px-1">And caption :</label>
            <MarkdownEditor
              ref={editorRef}
              initialValue={initialCaptionValue}
              onChange={(value) => {
                updateNodeOptions(node.id, {
                  options: { data: value },
                });
              }}
            ></MarkdownEditor>
          </div>
        )}

        {/* requests: API | AI */}
        {(node.type == NodeType.API || node.type == NodeType.AI) && (
          <>
            {/* NodeOptions.apiType: API | AI */}
            <div className="mb-5">
              <label className="block text-black px-1">API Type</label>
              <Select
                id="api-type"
                options={APIType}
                selected={(nodeOption.options as APINodeOptions)?.apiType}
                onChange={(newValue) => {
                  updateNodeOptions(node.id, {
                    options: { apiType: newValue },
                  });
                }}
                renderLabel={(x) => x}
              />
            </div>

            {/* NodeOptions.method: API | AI */}
            {
              <div className="mb-5">
                <label className="block text-black px-1">API Method</label>
                <Select
                  id="api-method"
                  options={APIMethod}
                  selected={(nodeOption.options as APINodeOptions)?.method}
                  onChange={(newValue) => {
                    updateNodeOptions(node.id, {
                      options: { method: newValue },
                    });
                  }}
                  renderLabel={(x) => x}
                />
              </div>
            }

            {/* NodeOptions.endpoint: API | AI */}
            {
              <div className="mb-5">
                <label className="block text-black px-1">Endpoint</label>
                <input
                  type="text"
                  id="api-endpoint"
                  className="border border-gray-300 text-sm rounded-lg block w-full p-2.5 text-black dark:text-white"
                  placeholder="https://path/to/endpoint"
                  value={(nodeOption.options as APINodeOptions)?.endpoint}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    updateNodeOptions(node.id, {
                      options: { endpoint: event.target.value },
                    });
                  }}
                />
              </div>
            }

            {/* NodeOptions.query: API | AI */}
            {
              <div className="mb-5">
                <label className="block text-black px-1">
                  URL Query Params
                </label>
              </div>
            }

            {/* NodeOptions.header: API | AI */}
            {
              <div className="mb-5">
                <label className="block text-black px-1">Header</label>
              </div>
            }

            {/* NodeOptions.body: API | AI */}
            {
              <div className="mb-5">
                <label className="block text-black px-1">Body</label>
                <MarkdownEditor
                  ref={editorRef}
                  initialValue={(nodeOption.options as APINodeOptions)?.body}
                  onChange={(value) => {
                    updateNodeOptions(node.id, {
                      options: { body: value },
                    });
                  }}
                  validate={JSON.parse}
                ></MarkdownEditor>
              </div>
            }

            {/* NodeOptions.timeout: API | AI */}
            {
              <div className="mb-5">
                <label className="block text-black px-1">
                  Request Timeout (ms)
                </label>
                <input
                  type="number"
                  id="api-timeout"
                  className="border border-gray-300 text-sm rounded-lg block w-full p-2.5 text-black dark:text-white"
                  placeholder="1000"
                  min={0}
                  step={1}
                  value={(nodeOption.options as APINodeOptions)?.timeout}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    updateNodeOptions(node.id, {
                      options: { timeout: parseFloat(event.target.value) },
                    });
                  }}
                />
              </div>
            }
          </>
        )}
      </div>
    </>
  );
};

export default NodeMenuEdit;
