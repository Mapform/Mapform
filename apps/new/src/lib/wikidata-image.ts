import { useState, useEffect } from "react";

/**
 * Utility functions for fetching and handling Wikidata images
 */

/**
 * Fetches a Wikidata image URL for a given Wikidata entity ID
 * @param wikidataId - The Wikidata entity ID (e.g., "Q12345")
 * @returns Promise<string | null> - The image URL or null if not found
 */
export const fetchWikidataImage = async (
  wikidataId: string,
): Promise<string | null> => {
  try {
    // First, get the Wikidata entity to find the image property
    const entityResponse = await fetch(
      `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${wikidataId}&format=json&origin=*`,
    );

    if (!entityResponse.ok) return null;

    const entityData = await entityResponse.json();
    const entity = entityData.entities?.[wikidataId];

    if (!entity) return null;

    // Look for image property (P18)
    const imageClaim = entity.claims?.P18?.[0];
    if (!imageClaim) return null;

    const imageFilename = imageClaim.mainsnak?.datavalue?.value;
    if (!imageFilename) return null;

    // Convert filename to URL
    const imageUrl = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(imageFilename)}?width=800`;

    return imageUrl;
  } catch (error) {
    console.error("Error fetching Wikidata image:", error);
    return null;
  }
};

/**
 * Hook for managing Wikidata image state
 * @param wikidataId - The Wikidata entity ID
 * @returns Object with image URL, loading state, and error state
 */
export const useWikidataImage = (wikidataId: string | undefined) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadImage = async () => {
      if (!wikidataId) {
        setImageUrl(null);
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const url = await fetchWikidataImage(wikidataId);
        setImageUrl(url);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load image";
        setError(errorMessage);
        setImageUrl(null);
      } finally {
        setIsLoading(false);
      }
    };

    void loadImage();
  }, [wikidataId]);

  return { imageUrl, isLoading, error };
};
