import type { SetLinkCardOptions } from "tiptap-link-card";

type JSONLinkResponse = {
  title: string;
  description: string;
  images: string[];
  sitename: string;
  favicon: string;
  duration: number;
  domain: string;
  url: string;
};

export const extractData = async (url: string): Promise<SetLinkCardOptions> => {
  const apiKey = import.meta.env.VITE_JSONLINK_API_KEY;
  if (!apiKey) {
    console.error(
      "API key is not set. Please set VITE_JSONLINK_API_KEY in .env file."
    );
    throw new Error("API key is not set");
  }
  try {
    const response = await fetch(
      `https://jsonlink.io/api/extract?url=${encodeURIComponent(url)}&api_key=${apiKey}`
    );
    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }
    const json = (await response.json()) as JSONLinkResponse;
    return {
      href: url,
      title: json.title,
      description: json.description,
      imageSrc: json.images[0] || undefined,
    };
  } catch (error) {
    console.error("Failed to resolve link data:", error);
    throw error;
  }
};
