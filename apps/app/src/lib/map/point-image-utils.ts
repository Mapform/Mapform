import type { Map } from "maplibre-gl";
import { getImageId } from "./get-image-id";

export function emojiToDataURL(emoji: string | null, color: string | null) {
  const size = emoji ? 48 : 32;
  const totalSize = size * 2.1; // Increase canvas size for more padding
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
  map: Map,
  emoji: string | null,
  color: string | null,
) {
  const imageId = getImageId(emoji, color);

  return new Promise<void>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      if (map.hasImage(imageId)) {
        // Do nothing
      } else {
        map.addImage(imageId, img, { pixelRatio: 2 }); // Adjust for HiDPI
      }

      resolve();
    };
    img.onerror = reject;
    img.src = emojiToDataURL(emoji, color);
  });
}
