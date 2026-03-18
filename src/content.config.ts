import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders'; // Loader mới cho Markdown

const blog = defineCollection({
    // Loader sẽ quét tất cả file .md trong folder src/content/blog/
    loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
    schema: z.object({
        title: z.string(),
        description: z.string(),
        date: z.date().optional() || z.string().optional(),
    }),
});

export const collections = { blog };