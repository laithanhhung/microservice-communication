import { defineCollection, z } from 'astro:content';

const patternsCollection = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
    }),
});

const referencesCollection = defineCollection({
    type: "content",
    schema: z.object({
        title: z.string(),
        sourceUrl: z.string().url().optional(),
    }),
});

export const collections = {
    patterns: patternsCollection,
    references: referencesCollection,
};
