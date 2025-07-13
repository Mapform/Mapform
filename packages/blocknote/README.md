# @mapform/blocknote

This package provides a customized BlockNote editor component for the MapForm application.

## Usage

### Importing the Component

```typescript
import { Blocknote } from "@mapform/blocknote/editor";
```

### Required CSS Import

**Important**: You must import the BlockNote styles in your application's main layout or CSS file:

```typescript
import "@mapform/blocknote/blocknote.css";
```

This CSS file includes:

- BlockNote core fonts (Inter)
- BlockNote Mantine styles
- Custom BlockNote styling for the MapForm application

### Example Usage

```typescript
import { Blocknote } from "@mapform/blocknote/editor";
import "@mapform/blocknote/blocknote.css";

interface MyComponentProps {
  content: CustomBlock[] | null;
  onChange: (content: {
    blocks: CustomBlock[] | null;
    markdown: string | null;
  }) => void;
}

export function MyComponent({ content, onChange }: MyComponentProps) {
  return (
    <Blocknote
      content={content}
      onChange={onChange}
    />
  );
}
```

## Migration from Previous Version

If you were previously importing the BlockNote component and experiencing CSS issues, make sure to:

1. Remove any direct CSS imports from the component usage
2. Add the CSS import to your app's main layout file
3. Update your imports to use the new structure

## Available Exports

- `Blocknote` - The main editor component
- `schema` - The BlockNote schema configuration
- `CustomBlock` - TypeScript type for custom blocks
