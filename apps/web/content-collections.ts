import { defineCollection, defineConfig } from "@content-collections/core";
import { z } from "zod";

const posts = defineCollection({
  name: "posts",
  directory: "./src/posts",
  include: "*.md",
  schema: z.object({
    title: z.string(),
    content: z.string(),
  }),
});

export default defineConfig({
  collections: [posts],
});
