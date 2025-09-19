import {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";

export type EditableTitleProps = {
  initialTitle?: string;
  className?: string;
  onSave?: (newTitle: string) => void;
};

export type EditableTitleHandle = {
  getTitle: () => string;
  setTitle: (val: string) => void;
};

const EditableTitle = forwardRef<EditableTitleHandle, EditableTitleProps>(
  ({ initialTitle = "", className = "", onSave }, ref) => {
    const [editing, setEditing] = useState(false);
    const [title, setTitle] = useState(initialTitle);
    const [draft, setDraft] = useState(initialTitle);
    const inputRef = useRef<HTMLInputElement | null>(null);

    // 親から呼べるメソッドを公開
    useImperativeHandle(ref, () => ({
      getTitle: () => title,
      setTitle: (val: string) => {
        setTitle(val);
        setDraft(val);
      },
    }));

    useEffect(() => {
      if (editing) inputRef.current?.focus();
    }, [editing]);

    const save = () => {
      const newValue = draft.trim();
      setTitle(newValue);
      onSave?.(newValue);
      setEditing(false);
    };

    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {!editing ? (
          <>
            <h1
              className={`text-lg ${
                title == "" ? "text-gray-300" : "font-semibold"
              } truncate`}
            >
              {title == "" ? "Untitled" : title}
            </h1>
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="p-1 text-black hover:bg-black hover:text-white rounded border-none flex items-center align-middle"
            >
              <span className="material-symbols-outlined">edit</span>
            </button>
          </>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              save();
            }}
            className="flex items-center gap-2 w-full"
          >
            <input
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={() => save()}
              className="border rounded w-full text-lg"
            />
          </form>
        )}
      </div>
    );
  }
);

export default EditableTitle;
