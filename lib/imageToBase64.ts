// Resizes to a max dimension and re-encodes as JPEG before sending to the model.
// Template files are multi-megabyte PNGs; Gemini only needs enough resolution to
// read fixture shapes and materials, not full print quality. Called once per
// Analyze click and the result is reused across every parallel request, not
// re-fetched/re-encoded per category.
export async function compressImageForAnalysis(
  url: string,
  maxDimension = 1024,
): Promise<{ data: string; mimeType: string }> {
  const response = await fetch(url);
  const blob = await response.blob();
  const bitmap = await createImageBitmap(blob);

  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
  const targetWidth = Math.round(bitmap.width * scale);
  const targetHeight = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable.");
  ctx.drawImage(bitmap, 0, 0, targetWidth, targetHeight);
  bitmap.close();

  const compressedBlob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => (result ? resolve(result) : reject(new Error("Canvas toBlob failed."))),
      "image/jpeg",
      0.85,
    );
  });

  const data = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(",")[1] ?? "");
    reader.onerror = reject;
    reader.readAsDataURL(compressedBlob);
  });

  return { data, mimeType: "image/jpeg" };
}
