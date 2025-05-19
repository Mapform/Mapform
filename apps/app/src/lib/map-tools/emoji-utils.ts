export function emojiToDataURL(emoji: string, size = 64) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Could not get canvas context");
  }

  // Set font to system default emoji font
  ctx.font = `${size}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(emoji, size / 2, size / 2);

  return canvas.toDataURL();
}

export async function loadEmojiImage(
  map: mapboxgl.Map,
  emoji: string,
  imageId: string,
) {
  console.log("Loading emoji image", emoji, imageId);
  return new Promise<void>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      map.addImage("emoji-marker", img, { pixelRatio: 2 }); // Adjust for HiDPI
      resolve();
    };
    img.onerror = reject;
    img.src = emojiToDataURL(emoji);
    console.log("Loaded emoji image", emoji, imageId);
  });
}
