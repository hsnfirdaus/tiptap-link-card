import { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import LinkCard from "tiptap-link-card";
import * as Prism from "prismjs";
import "prismjs/components/prism-json";
import "prismjs/themes/prism-coy.css";
import { extractData } from "./jsonlink";
import { defaultContent } from "./content";
import "tiptap-link-card/dist/style.css";

const editor = new Editor({
  element: document.querySelector("#tiptap") as HTMLElement,
  extensions: [
    StarterKit.configure({
      link: {
        linkOnPaste: false,
      },
    }),
    LinkCard.configure({
      linkOnPaste: true,
      openOnClick: false,
      dataResolver: extractData,
      HTMLAttributes: {
        class: "data-hasan",
      },
    }),
  ],
  content: defaultContent,
});
document
  .getElementById("add-link-card")
  ?.addEventListener("click", async (event) => {
    event.preventDefault();
    const url = document.getElementById("url") as HTMLInputElement;
    if (!url.value) {
      alert("Please enter a URL");
      return;
    }
    editor.commands.setLinkCardUrl(url.value);
  });

document.getElementById("show-result")?.addEventListener("click", (event) => {
  event.preventDefault();
  let data = editor.getJSON();
  let container = document.getElementById("result");
  if (container) {
    document.getElementById("result-container")?.classList.remove("hidden");
    let code = document.createElement("code");
    code.classList.add("language-json");
    code.innerHTML = Prism.highlight(
      JSON.stringify(data, undefined, 4),
      Prism.languages["json"],
      "json"
    );
    container.replaceChildren(code);
    container.scrollIntoView({ behavior: "smooth" });
  }
});
