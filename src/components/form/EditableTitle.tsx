import React, { useState, useRef, useEffect } from "react";

type EditableTitleProps = {
  initialTitle?: string;
  className?: string;
  onSave?: (newTitle: string) => void;
};

const EditableTitle: React.FC<EditableTitleProps> = ({
  initialTitle = "",
  className = "",
  onSave,
}) => {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [draft, setDraft] = useState(initialTitle);
  const inputRef = useRef<HTMLInputElement | null>(null);

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
};

export default EditableTitle;
