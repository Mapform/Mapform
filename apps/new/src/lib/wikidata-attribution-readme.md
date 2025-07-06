# Wikidata Attribution Guide

This guide explains how to get and display Wikidata attribution for images in your MapForm application, including support for multiple images from a single Wikidata entity.

## Overview

When you fetch images from Wikidata, you need to provide proper attribution to comply with the licenses of the images. The enhanced `wikidata-image.ts` utility now automatically fetches attribution information from Wikimedia Commons.

## What Attribution Information is Available

The `WikidataAttribution` interface provides the following fields:

- **`author`**: The photographer or creator of the image
- **`license`**: The license under which the image is available
- **`licenseUrl`**: URL to view the full license text
- **`sourceUrl`**: Direct link to the image page on Wikimedia Commons
- **`description`**: Description of the image
- **`dateCreated`**: When the image was created

## Multiple Images Support

The enhanced utility now supports fetching multiple images from a single Wikidata entity. Each image includes:

- **`property`**: The Wikidata property (e.g., "P18" for main image, "P3451" for poster)
- **`qualifiers`**: Additional metadata about the image
- **`rank`**: Image ranking ("preferred", "normal", "deprecated")

### Supported Image Properties

- **P18**: Main image
- **P3451**: Poster image
- **P154**: Logo image
- **P41**: Flag image
- **P94**: Coat of arms image
- **P242**: Locator map image
- **P2716**: Collage image
- **P4291**: Panoramic view
- **P4292**: Interior view
- **P4293**: Exterior view
- **P4294**: Aerial view
- **P4295**: Night view
- **P4296**: Seasonal view
- **P4297**: Historical view
- **P4298**: Detail view
- **P4299**: Close-up view
- **P4300**: Wide view

## How to Use

### Basic Usage

```tsx
import { useWikidataImage } from "~/lib/wikidata-image";

function MyComponent() {
  const { imageUrl, attribution, isLoading, error } =
    useWikidataImage("Q12345");

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {imageUrl && <img src={imageUrl} alt="Place image" />}

      {attribution && (
        <div className="attribution">
          {attribution.author && <p>Photo by: {attribution.author}</p>}
          {attribution.license && <p>License: {attribution.license}</p>}
          {attribution.sourceUrl && (
            <a href={attribution.sourceUrl}>View on Wikimedia Commons</a>
          )}
        </div>
      )}
    </div>
  );
}
```

### Using the Example Component

```tsx
import { WikidataAttributionExample } from "~/components/wikidata-attribution-example";

function MyComponent() {
  return (
    <WikidataAttributionExample wikidataId="Q12345" placeName="Eiffel Tower" />
  );
}
```

### Using Multiple Images

```tsx
import { useWikidataImages } from "~/lib/wikidata-image";

function MyComponent() {
  const { images, primaryImage, isLoading, error } =
    useWikidataImages("Q12345");

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h3>Found {images.length} images</h3>

      {/* Show primary image */}
      {primaryImage && (
        <div>
          <h4>Primary Image</h4>
          <img src={primaryImage.imageUrl} alt="Primary" />
          <p>Type: {primaryImage.property}</p>
        </div>
      )}

      {/* Show all images */}
      <div className="grid grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div key={index}>
            <img src={image.imageUrl} alt={`Image ${index + 1}`} />
            <p>Type: {image.property}</p>
            {image.attribution?.author && <p>By: {image.attribution.author}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Using the Gallery Component

```tsx
import { WikidataImagesGallery } from "~/components/wikidata-images-gallery";

function MyComponent() {
  return (
    <WikidataImagesGallery
      wikidataId="Q12345"
      placeName="Eiffel Tower"
      maxImages={8}
    />
  );
}
```

## Attribution Requirements

### Creative Commons Licenses

Most Wikidata images are licensed under Creative Commons licenses, which typically require:

1. **Attribution**: Credit the original author
2. **License Information**: Include the license name and link
3. **Source Link**: Provide a link to the original source

### Example Attribution Display

```tsx
{
  attribution && (
    <div className="text-xs text-gray-500">
      {attribution.author && <div>Photo by: {attribution.author}</div>}
      {attribution.license && (
        <div>
          License: {attribution.license}
          {attribution.licenseUrl && (
            <a
              href={attribution.licenseUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              (View)
            </a>
          )}
        </div>
      )}
      {attribution.sourceUrl && (
        <a
          href={attribution.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          View on Wikimedia Commons
        </a>
      )}
    </div>
  );
}
```

## API Endpoints Used

The utility fetches data from two Wikimedia APIs:

1. **Wikidata API**: `https://www.wikidata.org/w/api.php`
   - Gets entity information and image filenames from multiple properties
2. **Wikimedia Commons API**: `https://commons.wikimedia.org/w/api.php`
   - Gets image metadata including author, license, and description for each image

## Error Handling

The utility handles various error cases:

- Missing Wikidata entity
- Missing image property (P18)
- Missing image file on Wikimedia Commons
- Network errors
- Invalid API responses

## Best Practices

1. **Always display attribution** when showing Wikidata images
2. **Link to the source** when possible
3. **Respect license terms** - some licenses may have additional requirements
4. **Handle loading states** to provide good user experience
5. **Provide fallbacks** when attribution data is missing

## Common License Types

- **CC BY**: Attribution required
- **CC BY-SA**: Attribution + ShareAlike required
- **CC0**: No attribution required (public domain)
- **Fair use**: May have specific requirements

## Troubleshooting

### No Attribution Data

If attribution data is missing, check:

1. The Wikidata entity has an image (P18 property)
2. The image exists on Wikimedia Commons
3. The image has proper metadata
4. Network connectivity to Wikimedia APIs

### TypeScript Errors

If you encounter TypeScript errors, ensure you're using the latest version of the utility and that all types are properly imported.

## Legal Compliance

Always ensure your use of Wikidata images complies with:

1. The specific license of each image
2. Wikimedia's terms of service
3. Applicable copyright laws in your jurisdiction

When in doubt, consult with legal counsel regarding your specific use case.
