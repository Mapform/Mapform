export function emojiToDataURL(emoji: string, size = 64) {
  const padding = 8; // Add padding to prevent clipping
  const canvas = document.createElement("canvas");
  canvas.width = size + padding * 2;
  canvas.height = size + padding * 2;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Could not get canvas context");
  }

  // Set font to system default emoji font
  ctx.font = `${size}px "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(emoji, (size + padding * 2) / 2, (size + padding * 2) / 2);

  return canvas.toDataURL();
}

export async function loadEmojiImage(
  map: mapboxgl.Map,
  emoji: string,
  imageId: string,
) {
  return new Promise<void>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      map.addImage(imageId, img, { pixelRatio: 2 }); // Adjust for HiDPI
      resolve();
    };
    img.onerror = reject;
    img.src = emojiToDataURL(emoji);
  });
}
