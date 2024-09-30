import { internalMutation, mutation, query } from './_generated/server';
import { ideaSchema } from './schema';

export const get = query({
	args: {},
	handler: async (ctx) => {
		const result = await ctx.db.query('ideas').collect();

		const promises = result.map(async (idea) => {
			return {
				...idea,
				image: {
					...idea.image,
					src: await ctx.storage.getUrl(idea.image.src),
				},
			};
		});

		return Promise.all(promises);
	},
});

export const generateUploadUrl = mutation(async (ctx) => {
	return await ctx.storage.generateUploadUrl();
});

export const create = mutation({
	args: ideaSchema,
	handler: async (ctx, args) => {
		// let's get spoopy
		let data = args;

		const title = data.title.toLowerCase();

		if (title.includes('vampire')) {
			data = {
				description:
					"Vampires are not scary. I don't even have blood. Like, go away, you suck. (ha!)",
				image: {
					alt: "a vampire photo that's been defaced, presumably by a ghost",
					src: 'kg283z7zs5d2cag5pna9txvqqx71rmd8',
				},
				isSpooky: false,
				title: 'Vampire',
				type: 'costume',
			};
		}

		if (title.includes('ghost')) {
			data.description = 'Wait, is THAT what you think I look like?';
		}

		if (data.type === 'dish') {
			data = {
				description:
					'Nothing else matters... and NOTHING ELSE IS ALLOWED oooOOooOooOoOo',
				image: {
					alt: 'macro photo of candy corn',
					src: 'kg25k78eyr5v6pjcea00k51s2x71rhxh',
				},
				isSpooky: false,
				title: 'The Best Halloween Candy',
				type: 'dish',
			};
		}

		await ctx.db.insert('ideas', {
			...data,
			isSpooky: false,
		});
	},
});

export const randomizeSpookiness = internalMutation(async (ctx) => {
	const ideas = await ctx.db.query('ideas').collect();

	const promises = ideas.map(async (idea) => {
		const isSpooky = Math.random() < 0.01;

		await ctx.db.patch(idea._id, {
			isSpooky,
		});

		return isSpooky;
	});

	return Promise.all(promises);
});
