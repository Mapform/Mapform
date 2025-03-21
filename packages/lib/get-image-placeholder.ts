import { getPlaiceholder } from "plaiceholder";

export async function getImagePlaceholder(imageUrl: string) {
  const buffer = await fetch(imageUrl).then(async (res) => {
    const arrayBuffer = await res.arrayBuffer();
    return Buffer.from(arrayBuffer);
  });

  const {
    metadata: { height, width },
    ...plaiceholder
  } = await getPlaiceholder(buffer, { size: 10 });
  return {
    ...plaiceholder,
    img: {
      src: imageUrl,
      width,
      height,
    },
  };
}
