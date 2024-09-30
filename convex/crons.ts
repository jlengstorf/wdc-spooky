import { cronJobs } from 'convex/server';
import { internal } from './_generated/api';

const crons = cronJobs();

crons.interval(
	'Random chance of spoop',
	{ seconds: 1 },
	internal.ideas.randomizeSpookiness,
);

export default crons;
