import { getPlaiceholder } from "plaiceholder";

export async function getImagePlaceholder(url: string) {
  const buffer = await fetch(url).then(async (res) => {
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
      src: url,
      width,
      height,
    },
  };
}
