type SelectProps<T extends Record<string, number | string>> = {
  id: string;
  options: T;
  selected?: T[keyof T]; // 値型を安全に推論
  children?: React.ReactNode;
  disabled?: boolean;
  onChange?: (newValue: T[keyof T]) => void;
  renderLabel?: (label: keyof T) => string;
};

function Select<T extends Record<string, number | string>>({
  id,
  options,
  selected,
  children,
  disabled = false,
  onChange = () => {},
  renderLabel = (x) => `Type: ${String(x)}`,
}: SelectProps<T>) {
  return (
    <select
      id={id}
      className="border border-gray-300 text-black text-sm rounded-lg block w-full p-1.5"
      value={selected}
      onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
        onChange?.(
          // keyof T の value 型にキャスト
          event.target.value as T[keyof T]
        )
      }
      disabled={disabled}
    >
      {Object.entries(options).map(([k, v]) => (
        <option key={k} value={v}>
          {renderLabel(k as keyof T)}
        </option>
      ))}
      {children}
    </select>
  );
}

export default Select;
