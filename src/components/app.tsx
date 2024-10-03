import { FormEvent, useState } from 'react';
import { Link, Outlet, Route, Routes } from 'react-router-dom';
import { Image } from '@unpic/react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

export function Layout() {
	return (
		<>
			<header>
				<Link to="/" rel="home">
					Spooky Idea Tracker
				</Link>

				<nav>
					<Link to="/">All Ideas</Link>
					<Link to="/add">Add Idea +</Link>
				</nav>
			</header>

			<main>
				<Outlet />
			</main>
		</>
	);
}

const Home = () => {
	const ideas = useQuery(api.ideas.get);

	return (
		<>
			<h1>Halloween Party Planner (DEFINITELY NOT HAUNTED)</h1>

			<section className="ideas">
				{ideas?.map((idea) => {
					let data = idea;
					if (idea.isSpooky) {
						data = {
							_creationTime: 1,
							_id: idea._id,
							description:
								'YEAH YOU THOUGHT YOU WERE TOUGH HUH I BET YOU JUMPED',
							image: {
								alt: 'a close-up of a scary mask with glowing green eyes',
								src: 'https://impressive-reindeer-144.convex.cloud/api/storage/b127336b-71a0-4841-81df-58923ea479b5',
							},
							isSpooky: true,
							title: 'BOO HAHAHAHAHA',
							type: 'costume',
						};
					}

					return (
						<div
							key={data._id}
							className="idea"
							data-status={data.isSpooky ? 'spooky' : 'not-spooky'}
							data-type={data.type}
						>
							<Image
								src={data.image.src!}
								alt={data.image.alt}
								width={400}
								height={225}
								priority
							/>

							<div className="details">
								<h2>{data.title}</h2>
								<p>{data.description}</p>
							</div>
						</div>
					);
				})}
			</section>
		</>
	);
};

type IdeaType = 'dish' | 'game' | 'decor' | 'costume';

const AddIdea = () => {
	const [haunted, setHaunted] = useState(false);
	const [disabled, setDisabled] = useState(false);
	const generateUploadUrl = useMutation(api.ideas.generateUploadUrl);
	const addIdea = useMutation(api.ideas.create);

	async function handleSubmit(event: FormEvent) {
		event.preventDefault();

		setDisabled(true);
		const form = event.target as HTMLFormElement;

		let type: IdeaType;
		let title;
		let description;
		let imageSrc;
		let imageAlt;

		const isHauntedUpload = Math.random() < 0.333;

		if (isHauntedUpload) {
			setHaunted(true);

			type = 'costume';
			title = 'HAUNTED!';
			description = "You know you're in trouble when this guy shows up.";
			imageSrc = 'kg2dam7ev00t2pea0rvx9gn40d71rd47';
			imageAlt = 'John Cena haunting someone in The Bear';

			setTimeout(() => setHaunted(false), 5000);
		} else {
			const formData = new FormData(form);
			const image = formData.get('imageSrc') as File;

			const postUrl = await generateUploadUrl();
			const result = await fetch(postUrl, {
				method: 'POST',
				headers: {
					'Content-Type': image.type,
				},
				body: image,
			});

			const { storageId } = await result.json();

			type = formData.get('type') as IdeaType;
			title = formData.get('title') as string;
			description = formData.get('description') as string;
			imageSrc = storageId;
			imageAlt = formData.get('imageAlt') as string;
		}

		await addIdea({
			type,
			title,
			description,
			image: {
				src: imageSrc,
				alt: imageAlt,
			},
		});

		form.reset();
		setDisabled(false);
	}

	return (
		<>
			{haunted ? (
				<div className="haunted">
					<h1>SpoooOOOooOoOoOooOOOOky!</h1>
				</div>
			) : (
				<>
					<h1>Add a Spooky Idea</h1>

					<form onSubmit={handleSubmit}>
						<label htmlFor="type">
							Idea Type
							<select
								id="type"
								name="type"
								defaultValue="select"
								required
								disabled={disabled}
							>
								<option disabled value="select">
									-- choose an option --
								</option>

								<option value="dish">Dish or Food Item</option>
								<option value="game">Party Game</option>
								<option value="decor">Decoration</option>
								<option value="costume">Costume</option>
							</select>
						</label>

						<label htmlFor="title">
							Title
							<input
								type="text"
								id="title"
								name="title"
								required
								disabled={disabled}
							/>
						</label>

						<label htmlFor="description">
							Description
							<textarea
								id="description"
								name="description"
								required
								disabled={disabled}
							></textarea>
						</label>

						<label htmlFor="imageSrc">
							Image
							<input
								type="file"
								id="imageSrc"
								name="imageSrc"
								required
								disabled={disabled}
							/>
						</label>

						<label htmlFor="imageAlt">
							Image Alt
							<input
								type="text"
								id="imageAlt"
								name="imageAlt"
								required
								disabled={disabled}
							/>
						</label>

						<button type="submit" disabled={disabled}>
							{disabled ? 'Submitting...' : 'Add Idea'}
						</button>
					</form>
				</>
			)}
		</>
	);
};

export function App() {
	return (
		<Routes>
			<Route path="/" element={<Layout />}>
				<Route index element={<Home />} />
				<Route path="add" element={<AddIdea />} />
			</Route>
		</Routes>
	);
}
