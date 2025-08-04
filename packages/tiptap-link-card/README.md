# TipTap Extension: Link Card

Link card extension for TipTap editor that creates preview cards for URLs. Transform plain links into cards with title, description, and image.

## Installation

```bash
npm install tiptap-link-card
```

## Basic Usage

```typescript
import { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import LinkCard from "tiptap-link-card";
import "tiptap-link-card/dist/style.css";

const editor = new Editor({
  element: document.querySelector("#editor"),
  extensions: [
    StarterKit,
    LinkCard.configure({
      // Optional: Enable automatic paste handling
      addPasteHandler: true,
      // Required for automatic URL resolution
      dataResolver: async (url: string) => {
        // Implement your own URL metadata extraction logic
        const response = await fetch(
          `/api/link-preview?url=${encodeURIComponent(url)}`
        );
        return await response.json();
      },
    }),
  ],
});
```

## Configuration Options

### LinkCardOptions

| Option            | Type       | Default     | Description                                           |
| ----------------- | ---------- | ----------- | ----------------------------------------------------- |
| `addPasteHandler` | `boolean`  | `false`     | Enable automatic link card creation when pasting URLs |
| `dataResolver`    | `function` | `undefined` | Function to resolve link metadata from URLs           |

### Data Resolver Function

The `dataResolver` function should return a promise that resolves to an object with the following structure:

```typescript
type SetLinkCardOptions = {
  href: string; // The URL of the link
  title: string; // The title of the page
  description?: string; // Optional description/summary
  imageSrc?: string; // Optional preview image URL
};
```

## Commands

### setLinkCard

Insert a link card with specific attributes:

```typescript
editor.commands.setLinkCard({
  href: "https://example.com",
  title: "Example Website",
  description: "This is an example website with great content.",
  imageSrc: "https://example.com/preview.jpg",
});
```

### setLinkCardUrl

Insert a link card by URL (requires `dataResolver`):

```typescript
editor.commands.setLinkCardUrl("https://example.com");
```

## Styling

Use default style:

```typescript
import "tiptap-link-card/dist/style.css";
```

Or style card by yourself!

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License.
