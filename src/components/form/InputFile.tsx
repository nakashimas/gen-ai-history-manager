import { forwardRef, useImperativeHandle, useRef, useState } from "react";

export type InputFileProps = {
  onChange?: (newFile: File | null) => void;
};

export type InputFileHandle = {
  getData: () => File | null;
  setData: (newData: File | null) => void;
};

const InputFile = forwardRef<InputFileHandle, InputFileProps>(
  ({ onChange }, ref) => {
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);

    useImperativeHandle(ref, () => ({
      getData: () => file,
      setData: (newFile: File | null) => {
        setFile(newFile);
        if (inputRef.current) inputRef.current.value = "";
      },
    }));

    const handleFileChange = (newFile: File | null) => {
      setFile(newFile);
      onChange?.(newFile);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newFile = e.target.files ? e.target.files[0] : null;
      handleFileChange(newFile);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) handleFileChange(droppedFile);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
    };

    return (
      <div className="flex flex-col">
        <div
          className={
            `flex flex-col items-center justify-center align-middle ` +
            `w-full border-2 border-dashed rounded-lg cursor-pointer transition-colors ` +
            (isDragging
              ? "border-gray-600 bg-gray-200"
              : "border-gray-300 bg-white")
          }
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <span className="material-symbols-outlined mt-3 text-5xl text-gray-400">
            drive_folder_upload
          </span>
          <span className="text-gray-600 mb-3 text-sm">
            {file ? (
              <>
                <span>{file.name}</span>
                <label
                  className="border-none text-red-400 cursor-pointer align-middle"
                  onClick={() => {
                    handleFileChange(null);
                    if (inputRef.current) inputRef.current.value = "";
                  }}
                  title="Delete This File"
                >
                  <span className="material-symbols-outlined">delete</span>
                </label>
              </>
            ) : (
              <span>
                Drop files to Attach <br />
                or Browse files
              </span>
            )}
          </span>
        </div>

        <input
          type="file"
          className="hidden"
          ref={inputRef}
          onChange={handleInputChange}
        />
      </div>
    );
  }
);

export default InputFile;
