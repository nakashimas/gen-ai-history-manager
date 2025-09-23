export const base64ToFile: (base64: string, fileName: string) => File | null = (
  base64: string,
  fileName: string
) => {
  try {
    // Data URL 形式の場合 "data:<mime-type>;base64,XXXX"
    const [meta, data] = base64.split(",");
    const mimeMatch = meta.match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : "application/octet-stream";

    // Base64 → Uint8Array
    const byteString = atob(data);
    const byteArray = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      byteArray[i] = byteString.charCodeAt(i);
    }

    // Blob → File
    return new File([byteArray], fileName, { type: mime });
  } catch {
    return null;
  }
};
