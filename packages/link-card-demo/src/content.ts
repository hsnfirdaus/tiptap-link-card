import type { JSONContent } from "@tiptap/core";

export const defaultContent: JSONContent = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "This is Example link card:",
        },
      ],
    },
    {
      type: "linkCard",
      attrs: {
        href: "https://hasanfirdaus.com/blog/membuat-bahasa-pemrograman-interpreted/",
        title:
          "Membuat Bahasa Pemrograman Interpreted Sendiri - Muhammad Hasan Firdaus",
        description:
          "Membuat bahasa pemrograman sederhana sendiri ternyata tidak terlalu susah. Hanya diperlukan logika-logika dan menguasai sebuah bahasa pemrograman untuk membuat interpreter.",
        imageSrc:
          "https://storage.hasanfirdaus.com/files/0a08d070e6dd4cc89fb8a0e7e821f320b029c117.png",
      },
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Without image:",
        },
      ],
    },
    {
      type: "linkCard",
      attrs: {
        href: "https://example.com/",
        title: "Example Domain",
        description:
          "This domain is for use in illustrative examples in documents. You may use this\n    domain in literature without prior coordination or asking for permission.",
        imageSrc: null,
      },
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "That's all :)",
        },
      ],
    },
  ],
};
