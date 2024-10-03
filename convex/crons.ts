import { cronJobs } from 'convex/server';
import { internal } from './_generated/api';

const crons = cronJobs();

// NOTE: I turned this off because it’s resource intensive
// and I was going to hit bandwidth limits
// crons.interval(
// 	'Random chance of spoop',
// 	{ seconds: 1 },
// 	internal.ideas.randomizeSpookiness,
// );

export default crons;
