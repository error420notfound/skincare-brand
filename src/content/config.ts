import { defineCollection, z } from 'astro:content';

const products = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    collection: z.string(),
    collectionSlug: z.string(),
    price: z.number(),
    shortDesc: z.string(),
    description: z.string(),
    ingredients: z.array(z.object({ name: z.string(), benefit: z.string() })),
    usage: z.string(),
    benefits: z.array(z.string()),
    images: z.array(z.string()),
    inStock: z.boolean().default(true),
    featured: z.boolean().default(false),
    isNew: z.boolean().default(false),
    weight: z.string().optional(),
  }),
});

const journal = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    category: z.string(),
    excerpt: z.string(),
    coverImage: z.string(),
    readingTime: z.number(),
    featured: z.boolean().default(false),
  }),
});

export const collections = { products, journal };
