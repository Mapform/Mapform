import type { Metadata, Viewport } from "next";

export const TITLE = "Mapform";
export const DESCRIPTION = "Create and share maps.";

export const defaultMetadata: Metadata = {
  title: {
    template: `%s | ${TITLE}`,
    default: TITLE,
  },
  description: DESCRIPTION,
  metadataBase: new URL("https://www.mapform.co"),
};

export const defaultViewport: Viewport = {
  colorScheme: "light",
  width: "device-width",
  height: "device-height",
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

// TODO: Implement
// export const twitterMetadata: Metadata["twitter"] = {
//   title: TITLE,
//   description: DESCRIPTION,
//   card: "summary_large_image",
//   images: ["/api/og"],
// };

// export const ogMetadata: Metadata["openGraph"] = {
//   title: TITLE,
//   description: DESCRIPTION,
//   type: "website",
//   images: ["/api/og"],
// };
