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
  url: string | null;
  attribution: WikidataAttribution | null;
}

export interface WikidataImageItem {
  url: string;
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

    if (!entityResponse.ok) return { url: null, attribution: null };

    const entityData = await entityResponse.json();
    const entity = entityData.entities?.[wikidataId];

    if (!entity) return { url: null, attribution: null };

    // Look for image property (P18)
    const imageClaim = entity.claims?.P18?.[0];
    if (!imageClaim) return { url: null, attribution: null };

    const imageFilename = imageClaim.mainsnak?.datavalue?.value;
    if (!imageFilename) return { url: null, attribution: null };

    // Convert filename to URL
    const url = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(imageFilename)}?width=800`;

    // Fetch attribution data from Wikimedia Commons API
    const attribution = await fetchWikidataAttribution(imageFilename);

    return { url, attribution };
  } catch (error) {
    console.error("Error fetching Wikidata image:", error);
    return { url: null, attribution: null };
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
export const useWikidataImage = (
  wikidataId: string | undefined,
  enabled: boolean = true,
) => {
  const [imageData, setImageData] = useState<WikidataImageData>({
    url: null,
    attribution: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadImage = async () => {
      if (!wikidataId || !enabled) {
        setImageData({ url: null, attribution: null });
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
        setImageData({ url: null, attribution: null });
      } finally {
        setIsLoading(false);
      }
    };

    void loadImage();
  }, [wikidataId, enabled]);

  return {
    url: imageData.url,
    attribution: imageData.attribution,
    isLoading,
    error,
  };
};
