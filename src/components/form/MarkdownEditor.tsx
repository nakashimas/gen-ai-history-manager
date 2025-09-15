import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import EasyMDE from "easymde";
import "easymde/dist/easymde.min.css";

type MarkdownEditorProps = {
  initialValue?: string;
  onChange?: (value: string) => void;
};

export type MarkdownEditorHandle = {
  getValue: () => string;
  setValue: (val: string) => void;
};

const MarkdownEditor = forwardRef<MarkdownEditorHandle, MarkdownEditorProps>(
  ({ initialValue = "", onChange }, ref) => {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const editorRef = useRef<EasyMDE | null>(null);

    // 親から呼べるメソッドを公開
    useImperativeHandle(ref, () => ({
      getValue: () => editorRef.current?.value() || "",
      setValue: (val: string) => editorRef.current?.value(val),
    }));

    useEffect(() => {
      if (!textareaRef.current) return;

      // 初期化
      editorRef.current = new EasyMDE({
        element: textareaRef.current,
        initialValue: initialValue,
        spellChecker: false,
        autoRefresh: false,
      });

      // 値変更イベント
      editorRef.current.codemirror.on("change", () => {
        if (onChange) onChange(editorRef.current?.value() || "");
      });

      // cleanup
      return () => {
        editorRef.current?.toTextArea();
        editorRef.current = null;
      };
    }, [initialValue, onChange]);

    return (
      <div style={{ width: "100%" }}>
        <textarea ref={textareaRef} />
      </div>
    );
  }
);

export default MarkdownEditor;
