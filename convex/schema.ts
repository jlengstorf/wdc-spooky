import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export const ideaSchema = v.object({
	type: v.union(
		v.literal('dish'),
		v.literal('game'),
		v.literal('decor'),
		v.literal('costume'),
	),
	title: v.string(),
	image: v.object({
		src: v.string(),
		alt: v.string(),
	}),
	description: v.string(),
	isSpooky: v.optional(v.boolean()),
});

export default defineSchema({
	ideas: defineTable(ideaSchema),
});
