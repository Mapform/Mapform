export function getImageId(icon: string | null, color: string | null) {
  return `image-${icon || "none"}-${color || "none"}`;
}
