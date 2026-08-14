import { useLocation } from "react-router";

const movies = [
	{
		title: "Nebula Ascent",
		genre: "Sci-Fi",
		tag: "9.2",
		image:
			"https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=900&q=80",
	},
	{
		title: "Neon Shadow",
		genre: "Thriller",
		tag: "8.9",
		image:
			"https://images.unsplash.com/photo-1513106580091-1d82408b8cd6?auto=format&fit=crop&w=900&q=80",
	},
	{
		title: "Ether Realm",
		genre: "Fantasy",
		tag: "8.7",
		image:
			"https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=900&q=80",
	},
	{
		title: "Overdrive",
		genre: "Action",
		tag: "8.5",
		image:
			"https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=80",
	},
	{
		title: "Velvet Echo",
		genre: "Drama",
		tag: "8.4",
		image:
			"https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=900&q=80",
	},
];

const formatLocationLabel = (value: string) => {
	return value
		.split("-")
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(" ");
};

export const MoviesOnBillboard = () => {
	const location = useLocation();

	const cityLabel = (() => {
		const stateCity = (location.state as { city?: string } | null)?.city;
		if (stateCity) return formatLocationLabel(stateCity);

		if (typeof window !== "undefined") {
			const savedLocation = window.localStorage.getItem("cinemaSelectedLocation");
			if (savedLocation) {
				try {
					const parsedLocation = JSON.parse(savedLocation) as { city?: string };
					if (parsedLocation.city) {
						return formatLocationLabel(parsedLocation.city);
					}
				} catch {
					return "Bogotá";
				}
			}
		}

		return "Bogotá";
	})();

	return (
		<div className="min-h-screen bg-[#0b1326] text-slate-100">
			<div className="relative overflow-hidden">
				<div className="absolute -left-20 top-16 h-72 w-72 rounded-full bg-[#7C3AED]/25 blur-3xl" />
				<div className="absolute right-0 top-1/2 h-96 w-96 rounded-full bg-[#818CF8]/20 blur-3xl" />

				<section className="relative mx-auto max-w-7xl px-4 pb-14 pt-10 sm:px-6 lg:px-8">
					<div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#111827] shadow-[0_25px_80px_rgba(15,23,42,0.7)]">
						<div
							className="absolute inset-0 bg-cover bg-center"
							style={{
								backgroundImage:
									"url('https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1600&q=80')",
							}}
						/>
						<div className="absolute inset-0 bg-gradient-to-r from-[#0b1326]/90 via-[#0b1326]/60 to-[#0b1326]/35" />
						<div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0b1326] to-transparent" />

						<div className="relative z-10 flex min-h-[480px] items-end px-6 py-8 sm:px-8 lg:px-12">
							<div className="max-w-2xl">
								<div className="mb-4 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#c4b5fd]">
									<span className="rounded-full border border-[#7C3AED]/40 bg-[#7C3AED]/15 px-3 py-1.5">
										Featured Sci-Fi Epic
									</span>
									<span className="inline-flex items-center gap-1.5 text-[#f8fafc]">
										<span className="text-[#fbbf24]">★</span> 9.2
									</span>
								</div>

								<h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
									NEBULA ASCENT
								</h1>

								<p className="mt-4 max-w-lg text-base text-slate-300 sm:text-lg">
									In the farthest reaches of the Kepler system, a lone captain
									discovers an ancient energy source that could rewrite the laws of
									physics or consume the entire galaxy.
								</p>

								<div className="mt-7 flex flex-wrap gap-4">
									<button className="rounded-xl bg-gradient-to-r from-[#7C3AED] via-[#818CF8] to-[#DB2777] px-5 py-3 text-sm font-bold uppercase tracking-[0.16em] text-white shadow-lg shadow-[#7C3AED]/25 transition hover:brightness-110">
										Watch trailer
									</button>
									<button className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-bold uppercase tracking-[0.16em] text-slate-100 transition hover:bg-white/10">
										Get tickets
									</button>
								</div>
							</div>
						</div>
					</div>
				</section>

				<section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
					<div className="mb-6 flex items-end justify-between gap-4">
						<div>
							<p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#818CF8]">
								Now playing
							</p>
							<h2 className="mt-2 text-3xl font-black text-white">
								Cartelera en {cityLabel}
							</h2>
						</div>
						<a
							href="#"
							className="text-sm font-semibold text-[#c4b5fd] transition hover:text-white"
						>
							View all →
						</a>
					</div>

					<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
						{movies.map((movie) => (
							<article
								key={movie.title}
								className="group overflow-hidden rounded-[22px] border border-white/10 bg-[#111827] shadow-[0_16px_40px_rgba(15,23,42,0.55)] transition duration-200 hover:-translate-y-1 hover:border-[#818CF8]/40"
							>
								<div className="relative overflow-hidden">
									<img
										src={movie.image}
										alt={movie.title}
										className="h-72 w-full object-cover transition duration-500 group-hover:scale-105"
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-[#0b1326] via-transparent to-transparent" />
									<div className="absolute left-3 top-3 rounded-full bg-[#DB2777] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-white">
										{movie.tag}
									</div>
								</div>

								<div className="space-y-4 p-4">
									<div>
										<h3 className="text-lg font-bold text-white">
											{movie.title}
										</h3>
										<p className="mt-1 text-xs text-slate-400">
											{movie.genre} • 2h 10min
										</p>
									</div>

									<div className="flex flex-wrap gap-2">
										<span className="rounded-full border border-[#7C3AED]/25 bg-[#7C3AED]/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#c4b5fd]">
											VIP
										</span>
										<span className="rounded-full border border-white/10 bg-slate-800 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-300">
											Doblada
										</span>
									</div>

									<div className="flex flex-wrap gap-2">
										<button className="rounded-lg border border-white/10 bg-slate-800 px-2.5 py-1.5 text-xs font-semibold text-slate-200">
											13:00
										</button>
										<button className="rounded-lg bg-[#818CF8] px-2.5 py-1.5 text-xs font-semibold text-[#0f172a]">
											16:30
										</button>
										<button className="rounded-lg border border-white/10 bg-slate-800 px-2.5 py-1.5 text-xs font-semibold text-slate-200">
											19:00
										</button>
									</div>

									<div className="flex gap-2 pt-1">
										<button className="flex-1 rounded-xl border border-white/10 bg-slate-800 px-3 py-2 text-xs font-bold text-slate-200 transition hover:bg-slate-700">
											Ver detalle
										</button>
										<button className="flex-1 rounded-xl bg-[#7C3AED] px-3 py-2 text-xs font-bold text-white transition hover:opacity-90">
											Comprar
										</button>
									</div>
								</div>
							</article>
						))}
					</div>
				</section>
			</div>
		</div>
	);
};
