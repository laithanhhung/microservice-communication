import { defineCollection, z } from 'astro:content';

const patternsCollection = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
    }),
});

export const collections = {
    patterns: patternsCollection,
};
