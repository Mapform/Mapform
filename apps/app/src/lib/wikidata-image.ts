import { useState, useEffect } from "react";

/**
 * Types for Wikidata attribution data
 */
export interface WikidataAttribution {
  author?: string;
  license?: string;
  licenseUrl?: string;
  sourceUrl?: string;
  description?: string;
  dateCreated?: string;
}

export interface WikidataImageData {
  imageUrl: string | null;
  attribution: WikidataAttribution | null;
}

export interface WikidataImageItem {
  imageUrl: string;
  attribution: WikidataAttribution | null;
  property: string; // e.g., "P18", "P3451", etc.
  qualifiers?: Record<string, any>; // Additional qualifiers
  rank?: string; // "preferred", "normal", "deprecated"
}

export interface WikidataImagesData {
  images: WikidataImageItem[];
  primaryImage: WikidataImageItem | null;
}

/**
 * Utility functions for fetching and handling Wikidata images
 */

/**
 * Fetches a single Wikidata image URL and attribution for a given Wikidata entity ID
 * @param wikidataId - The Wikidata entity ID (e.g., "Q12345")
 * @returns Promise<WikidataImageData> - The image URL and attribution data
 */
export const fetchWikidataImage = async (
  wikidataId: string,
): Promise<WikidataImageData> => {
  try {
    // First, get the Wikidata entity to find the image property
    const entityResponse = await fetch(
      `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${wikidataId}&format=json&origin=*`,
    );

    if (!entityResponse.ok) return { imageUrl: null, attribution: null };

    const entityData = await entityResponse.json();
    const entity = entityData.entities?.[wikidataId];

    if (!entity) return { imageUrl: null, attribution: null };

    // Look for image property (P18)
    const imageClaim = entity.claims?.P18?.[0];
    if (!imageClaim) return { imageUrl: null, attribution: null };

    const imageFilename = imageClaim.mainsnak?.datavalue?.value;
    if (!imageFilename) return { imageUrl: null, attribution: null };

    // Convert filename to URL
    const imageUrl = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(imageFilename)}?width=800`;

    // Fetch attribution data from Wikimedia Commons API
    const attribution = await fetchWikidataAttribution(
      imageFilename,
      wikidataId,
    );

    return { imageUrl, attribution };
  } catch (error) {
    console.error("Error fetching Wikidata image:", error);
    return { imageUrl: null, attribution: null };
  }
};

/**
 * Fetches multiple Wikidata images for a given Wikidata entity ID
 * @param wikidataId - The Wikidata entity ID (e.g., "Q12345")
 * @returns Promise<WikidataImagesData> - Multiple images with attribution data
 */
export const fetchWikidataImages = async (
  wikidataId: string,
): Promise<WikidataImagesData> => {
  try {
    // Get the Wikidata entity
    const entityResponse = await fetch(
      `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${wikidataId}&format=json&origin=*`,
    );

    if (!entityResponse.ok) return { images: [], primaryImage: null };

    const entityData = await entityResponse.json();
    const entity = entityData.entities?.[wikidataId];

    if (!entity) return { images: [], primaryImage: null };

    const images: WikidataImageItem[] = [];
    let primaryImage: WikidataImageItem | null = null;

    // Common image properties to check
    const imageProperties = [
      "P18", // image
      "P3451", // poster image
      "P154", // logo image
      "P41", // flag image
      "P94", // coat of arms image
      "P242", // locator map image
      "P2716", // collage image
      "P4291", // panoramic view
      "P4292", // interior view
      "P4293", // exterior view
      "P4294", // aerial view
      "P4295", // night view
      "P4296", // seasonal view
      "P4297", // historical view
      "P4298", // detail view
      "P4299", // close-up view
      "P4300", // wide view
    ];

    // Process each image property
    for (const property of imageProperties) {
      const claims = entity.claims?.[property];
      if (!claims) continue;

      for (const claim of claims) {
        const imageFilename = claim.mainsnak?.datavalue?.value;
        if (!imageFilename) continue;

        // Convert filename to URL
        const imageUrl = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(imageFilename)}?width=800`;

        // Fetch attribution data
        const attribution = await fetchWikidataAttribution(
          imageFilename,
          wikidataId,
        );

        const imageItem: WikidataImageItem = {
          imageUrl,
          attribution,
          property,
          qualifiers: claim.qualifiers,
          rank: claim.rank,
        };

        images.push(imageItem);

        // Set primary image (P18 with preferred rank, or first P18, or first image)
        if (!primaryImage) {
          primaryImage = imageItem;
        } else if (property === "P18" && claim.rank === "preferred") {
          primaryImage = imageItem;
        } else if (property === "P18" && primaryImage.property !== "P18") {
          primaryImage = imageItem;
        }
      }
    }

    return { images, primaryImage };
  } catch (error) {
    console.error("Error fetching Wikidata images:", error);
    return { images: [], primaryImage: null };
  }
};

/**
 * Fetches attribution information for a Wikidata image
 * @param imageFilename - The filename of the image on Wikimedia Commons
 * @param wikidataId - The Wikidata entity ID for additional context
 * @returns Promise<WikidataAttribution | null> - Attribution data or null
 */
const fetchWikidataAttribution = async (
  imageFilename: string,
  wikidataId: string,
): Promise<WikidataAttribution | null> => {
  try {
    // Fetch image info from Wikimedia Commons API
    const commonsResponse = await fetch(
      `https://commons.wikimedia.org/w/api.php?action=query&titles=File:${encodeURIComponent(imageFilename)}&prop=imageinfo|extracts&iiprop=extmetadata&format=json&origin=*`,
    );

    if (!commonsResponse.ok) return null;

    const commonsData = await commonsResponse.json();
    const pages = commonsData.query?.pages as Record<string, any> | undefined;
    if (!pages) return null;
    const pageIds = Object.keys(pages);
    if (pageIds.length === 0) return null;
    const pageId = pageIds[0];
    if (!pageId) return null;
    const page = pages[pageId];

    if (!page || page.missing) return null;

    const imageInfo = page.imageinfo?.[0];
    const extract = page.extract;

    if (!imageInfo) return null;

    const metadata = imageInfo.extmetadata || {};

    // Extract attribution information
    const attribution: WikidataAttribution = {
      author: metadata.Artist?.value || metadata.Author?.value,
      license: metadata.License?.value || metadata.Copyright?.value,
      licenseUrl: metadata.License_url?.value,
      sourceUrl: `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(imageFilename)}`,
      description: extract || metadata.Description?.value,
      dateCreated: metadata.DateTime?.value || metadata.DateTimeOriginal?.value,
    };

    // Clean up the attribution data
    if (attribution.author) {
      // Remove HTML tags from author field
      attribution.author = attribution.author.replace(/<[^>]*>/g, "");
    }

    if (attribution.license) {
      // Remove HTML tags from license field
      attribution.license = attribution.license.replace(/<[^>]*>/g, "");
    }

    return attribution;
  } catch (error) {
    console.error("Error fetching Wikidata attribution:", error);
    return null;
  }
};

/**
 * Hook for managing Wikidata image state with attribution
 * @param wikidataId - The Wikidata entity ID
 * @returns Object with image URL, attribution, loading state, and error state
 */
export const useWikidataImage = (wikidataId: string | undefined) => {
  const [imageData, setImageData] = useState<WikidataImageData>({
    imageUrl: null,
    attribution: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadImage = async () => {
      if (!wikidataId) {
        setImageData({ imageUrl: null, attribution: null });
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchWikidataImage(wikidataId);
        setImageData(data);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load image";
        setError(errorMessage);
        setImageData({ imageUrl: null, attribution: null });
      } finally {
        setIsLoading(false);
      }
    };

    void loadImage();
  }, [wikidataId]);

  return {
    imageUrl: imageData.imageUrl,
    attribution: imageData.attribution,
    isLoading,
    error,
  };
};

/**
 * Hook for managing multiple Wikidata images with attribution
 * @param wikidataId - The Wikidata entity ID
 * @returns Object with images array, primary image, loading state, and error state
 */
export const useWikidataImages = (wikidataId: string | undefined) => {
  const [imagesData, setImagesData] = useState<WikidataImagesData>({
    images: [],
    primaryImage: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadImages = async () => {
      if (!wikidataId) {
        setImagesData({ images: [], primaryImage: null });
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchWikidataImages(wikidataId);
        setImagesData(data);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load images";
        setError(errorMessage);
        setImagesData({ images: [], primaryImage: null });
      } finally {
        setIsLoading(false);
      }
    };

    void loadImages();
  }, [wikidataId]);

  return {
    images: imagesData.images,
    primaryImage: imagesData.primaryImage,
    isLoading,
    error,
  };
};
