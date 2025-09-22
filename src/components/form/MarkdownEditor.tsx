import {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

// EasyMDE Monkey patch
(function () {
  const origAddEventListener = EventTarget.prototype.addEventListener;

  EventTarget.prototype.addEventListener = function (
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ) {
    const scrollEvents = ["touchstart", "touchmove", "mousewheel"];

    if (scrollEvents.includes(type)) {
      if (options === undefined) {
        options = { passive: true };
      } else if (typeof options === "boolean") {
        options = { capture: options, passive: true };
      } else {
        // passive が false の場合でも true に上書き
        options = { ...options, passive: true };
      }
    }

    return origAddEventListener.call(this, type, listener, options);
  };
})();

import EasyMDE from "easymde";
import "easymde/dist/easymde.min.css";

export type MarkdownEditorProps = {
  initialValue?: string;
  onChange?: (value: string) => void;
  validate?: (value: string) => void;
};

export type MarkdownEditorHandle = {
  getValue: () => string;
  setValue: (val: string) => void;
};

const MarkdownEditor = forwardRef<MarkdownEditorHandle, MarkdownEditorProps>(
  ({ initialValue = "", onChange, validate }, ref) => {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const editorRef = useRef<EasyMDE | null>(null);

    const [errorMessage, setErrorMessage] = useState<string>("");

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
      editorRef.current.codemirror.on("blur", () => {
        if (validate) {
          try {
            validate(editorRef.current?.value() || "");
            setErrorMessage("");
            if (onChange) onChange(editorRef.current?.value() || "");
          } catch (e: unknown) {
            setErrorMessage(String(e as SyntaxError));
          }
        } else {
          setErrorMessage("");
          if (onChange) onChange(editorRef.current?.value() || "");
        }
      });

      // cleanup
      return () => {
        editorRef.current?.toTextArea();
        editorRef.current = null;
      };
    }, [initialValue, onChange, setErrorMessage, validate]);

    return (
      <div style={{ width: "100%" }}>
        {errorMessage != "" && (
          <label className="block text-red-400 px-1">{errorMessage}</label>
        )}
        <textarea ref={textareaRef} />
      </div>
    );
  }
);

export default memo(MarkdownEditor);
