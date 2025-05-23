export function emojiToDataURL(
  emoji: string | null | undefined,
  color: string | null,
) {
  const size = emoji ? 64 : 32;
  const totalSize = size * 1.6; // Make canvas twice as large as the emoji
  const canvas = document.createElement("canvas");
  canvas.width = totalSize;
  canvas.height = totalSize;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Could not get canvas context");
  }

  // Draw circular background if color is provided
  const center = totalSize / 2;
  const borderWidth = 7;
  ctx.beginPath();
  ctx.arc(center, center, totalSize / 2 - borderWidth / 2, 0, Math.PI * 2);
  ctx.fillStyle = color ?? "#3b82f6";
  ctx.fill();
  // Add outline to the circle
  ctx.lineWidth = borderWidth;
  ctx.strokeStyle = "#fff"; // White outline for contrast
  ctx.stroke();

  // Set font to system default emoji font
  ctx.font = `${size}px "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  if (emoji) {
    ctx.fillText(emoji, totalSize / 2, totalSize / 2 + size * 0.1);
  }

  return canvas.toDataURL();
}

export async function loadPointImage(
  map: mapboxgl.Map,
  emoji: string | null | undefined,
  imageId: string,
  color: string | null = null,
) {
  return new Promise<void>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      map.addImage(imageId, img, { pixelRatio: 2 }); // Adjust for HiDPI
      resolve();
    };
    img.onerror = reject;
    img.src = emojiToDataURL(emoji, color);
  });
}
