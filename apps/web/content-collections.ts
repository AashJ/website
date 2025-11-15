import { defineCollection, defineConfig } from "@content-collections/core";
import { z } from "zod";
import { compileMDX } from "@content-collections/mdx";

const posts = defineCollection({
  name: "posts",
  directory: "./src/posts",
  include: "*.{md,mdx}",
  schema: z.object({
    title: z.string(),
    content: z.string(),
    slug: z.string(),
    date: z.string().transform((val) => new Date(val)),
    draft: z
      .string()
      .transform((v) => v === "true")
      .default(false),
  }),
  transform: async (document, context) => {
    const mdx = await compileMDX(context, document);
    return {
      ...document,
      mdx,
    };
  },
});

export default defineConfig({
  collections: [posts],
});
