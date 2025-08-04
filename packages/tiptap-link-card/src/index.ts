import { mergeAttributes, Node, PasteRule } from "@tiptap/core";

export type SetLinkCardOptions = {
  href: string;
  title: string;
  description?: string;
  imageSrc?: string;
};

export interface LinkCardOptions {
  /**
   * Controls if the paste handler for any url should be added.
   * @default false
   * @example true
   */
  addPasteHandler: boolean;

  /**
   * Resolves the link card data from a URL.
   * @param url The URL to resolve.
   * @description This function is used to resolve the link card data from a URL.
   * It should return a promise that resolves to an object containing the link card attributes.
   * @returns A promise that resolves to an object containing the link card attributes.
   */
  dataResolver?: (url: string) => Promise<SetLinkCardOptions>;
}

type LinkCardCommand<ReturnType> = {
  /**
   * Insert a link card
   * @param options The link card attributes
   * @example editor.commands.setLinkCard({ href: 'https://example.com', title: 'Example', description: 'An example link', image: { src: 'https://example.com/image.png' } })
   */
  setLinkCard: (options: SetLinkCardOptions) => ReturnType;

  /**
   * Set the link card URL, data will be resolved using the `dataResolver` function if provided.
   * @param url The URL to set
   * @example editor.commands.setLinkCardUrl('https://example.com')
   */
  setLinkCardUrl: (url: string) => ReturnType;
};

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    linkCard: LinkCardCommand<ReturnType>;
  }
}

export const pasteRegex =
  /https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z]{2,}\b(?:[-a-zA-Z0-9@:%._+~#=?!&/]*)(?:[-a-zA-Z0-9@:%._+~#=?!&/]*)/gi;

const LinkCard = Node.create<LinkCardOptions>({
  name: "linkCard",
  group: "block",
  atom: true,
  draggable: true,
  marks: "",
  whitespace: "normal",

  addOptions() {
    return {
      addPasteHandler: false,
      dataResolver: null,
    };
  },

  addCommands() {
    return {
      setLinkCard:
        (options: SetLinkCardOptions) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
      setLinkCardUrl:
        (url: string) =>
        ({ commands, editor }) => {
          if (!this.options.dataResolver) {
            throw new Error(
              "dataResolver is not set. Please provide a dataResolver function."
            );
          }
          const id = Math.random().toString(36).slice(2);
          (async (id: string) => {
            const attributes = await this.options.dataResolver!(url);
            if (!attributes) {
              throw new Error(
                "Failed to resolve link card data. Please check the URL or the dataResolver function."
              );
            }
            const { pos } = editor.$node(this.name, { id });

            editor.view.dispatch(
              editor.state.tr.setNodeMarkup(pos, undefined, attributes)
            );
          })(id);
          return commands.insertContent({
            type: this.name,
            attrs: {
              id,
              isLoading: true,
              href: url,
            },
          });
        },
    };
  },

  addAttributes() {
    return {
      id: {
        default: undefined,
      },
      isLoading: {
        default: undefined,
      },
      href: {
        default: null,
      },
      title: {
        default: null,
      },
      description: {
        default: null,
      },
      imageSrc: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "link-card",
        getAttrs: (element: HTMLElement) => {
          const href = element.getAttribute("href");
          if (!href) return false;
          return {
            href,
            title: element.getAttribute("title") || "",
            description: element.getAttribute("description") || "",
            imageSrc: element.getAttribute("imageSrc") || "",
          };
        },
      },
    ];
  },

  addPasteRules() {
    if (!this.options.addPasteHandler || !this.options.dataResolver) {
      return [];
    }

    return [
      new PasteRule({
        find: pasteRegex,
        handler: ({ match, chain, range, pasteEvent }) => {
          const id = Math.random().toString(36).slice(2);

          (async (url: string, id: string) => {
            const attributes = await this.options.dataResolver!(url);
            if (!attributes) {
              throw new Error(
                "Failed to resolve link card data. Please check the URL or the dataResolver function."
              );
            }
            const { pos } = this.editor.$node(this.name, { id });

            this.editor.view.dispatch(
              this.editor.state.tr.setNodeMarkup(pos, undefined, attributes)
            );
          })(match.input, id);

          const node = {
            type: this.name,
            attrs: {
              id,
              isLoading: true,
              href: match.input,
            },
          };

          return chain()
            .deleteRange(range)
            .insertContentAt(range.from, node)
            .run();
        },
      }),
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["link-card", mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ({ editor, node, getPos }) => {
      const root = document.createElement("a");
      root.classList.add("link-card");
      root.setAttribute("href", node.attrs.href || "#");
      root.setAttribute("target", "_blank");
      root.setAttribute("rel", "noopener noreferrer");

      if (node.attrs.imageSrc) {
        const figure = document.createElement("figure");
        figure.classList.add("link-card-figure");

        const img = document.createElement("img");
        img.classList.add("link-card-image");
        img.src = node.attrs.imageSrc;
        figure.appendChild(img);

        root.appendChild(figure);
      }

      const meta = document.createElement("div");
      meta.classList.add("link-card-meta");

      if (node.attrs.title) {
        const title = document.createElement("h3");
        title.classList.add("link-card-title");
        title.textContent = node.attrs.title;
        meta.appendChild(title);
      }

      if (node.attrs.description) {
        const description = document.createElement("p");
        description.classList.add("link-card-description");
        description.textContent = node.attrs.description;
        meta.appendChild(description);
      }

      if (node.attrs.href) {
        const url = new URL(node.attrs.href);

        const domain = document.createElement("span");
        domain.classList.add("link-card-domain");
        domain.textContent = url.hostname;
        meta.appendChild(domain);
      }

      root.appendChild(meta);

      if (node.attrs.isLoading) {
        const loadingIndicator = document.createElement("span");
        loadingIndicator.classList.add("link-card-loading");
        loadingIndicator.textContent = "Loading...";
        root.appendChild(loadingIndicator);
      }

      return {
        dom: root,
      };
    };
  },
});

export { LinkCard };

export default LinkCard;
