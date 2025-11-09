// content-collections.ts
import { defineCollection, defineConfig } from "@content-collections/core";
import { z } from "zod";
import { compileMDX } from "@content-collections/mdx";
var posts = defineCollection({
  name: "posts",
  directory: "./src/posts",
  include: "*.{md,mdx}",
  schema: z.object({
    title: z.string(),
    content: z.string()
  }),
  transform: async (document, context) => {
    const mdx = await compileMDX(context, document);
    return {
      ...document,
      mdx
    };
  }
});
var content_collections_default = defineConfig({
  collections: [posts]
});
export {
  content_collections_default as default
};
