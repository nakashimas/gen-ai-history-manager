type KeyValueRecord = Record<string, string | number>;

type SeriesProps = {
  items?: KeyValueRecord;
  onChange?: (newItems: KeyValueRecord) => void;
};

function Series({ items = {}, onChange = () => {} }: SeriesProps) {
  const handleChange = (
    rowIndex: number,
    key: string,
    field: "key" | "value",
    value: string
  ) => {
    const entries = Object.entries(items);
    // const [oldKey, oldValue] = entries[rowIndex];

    if (field === "key") {
      // キーを変更したい場合
      const newItems: KeyValueRecord = {};
      entries.forEach(([k, v], i) => {
        if (i === rowIndex) {
          newItems[value] = v; // 新しいキーに旧バリュー
        } else {
          newItems[k] = v;
        }
      });
      onChange(newItems);
    } else {
      // バリューを変更
      const newItems = { ...items, [key]: value };
      onChange(newItems);
    }
  };

  const handleAdd = () => {
    // ユニークなキー名を探す
    let newKey = "key";
    let i = 1;
    while (Object.keys(items).includes(newKey)) {
      newKey = `key${i++}`;
    }
    onChange({ ...items, [newKey]: "" });
  };

  const handleRemove = (rowIndex: number) => {
    const entries = Object.entries(items);
    const [targetKey] = entries[rowIndex];
    const newItems = { ...items };
    delete newItems[targetKey];
    onChange(newItems);
  };

  return (
    <div className="w-full">
      <table className="border-none w-full text-sm table-auto">
        <tbody>
          {Object.entries(items).map(([k, v], rowIndex) => (
            <tr key={rowIndex}>
              <td className="border-none">
                <input
                  id={self.crypto.randomUUID()}
                  type="text"
                  value={k}
                  onChange={(e) =>
                    handleChange(rowIndex, k, "key", e.target.value)
                  }
                  placeholder="key"
                  className="border border-gray-300 text-sm rounded-lg block w-full p-2.5 text-black dark:text-white"
                />
              </td>
              <td className="border-none">
                <input
                  id={self.crypto.randomUUID()}
                  type="text"
                  value={v}
                  onChange={(e) =>
                    handleChange(rowIndex, k, "value", e.target.value)
                  }
                  placeholder="value"
                  className="border border-gray-300 text-sm rounded-lg block w-full p-2.5 text-black dark:text-white"
                />
              </td>
              <td className="border-none w-[2rem] h-full">
                <button
                  onClick={() => handleRemove(rowIndex)}
                  className={
                    "border border-gray-300 rounded-lg p-2.5 " +
                    "hover:border-red-400 " +
                    "text-sm text-red-400 " +
                    "block w-full h-full bg-white " +
                    "flex justify-center text-center items-center align-middle"
                  }
                >
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={handleAdd}
        className="px-2 py-1 bg-gray text-white rounded w-full flex justify-center text-center items-center align-middle"
        title="Add"
      >
        <span className="material-symbols-outlined">add</span>
      </button>
    </div>
  );
}

export default Series;
