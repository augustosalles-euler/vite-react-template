// src/App.tsx

import { useEffect, useState } from "react";
import "./App.css";

type PostSummary = {
	slug: string;
	title: string;
	description: string;
	publishedAt: string;
};

type Post = PostSummary & {
	body: string;
	image: string;
	author: string;
};

function useRoute() {
	const [path, setPath] = useState(() => window.location.pathname);
	useEffect(() => {
		const onPop = () => setPath(window.location.pathname);
		window.addEventListener("popstate", onPop);
		return () => window.removeEventListener("popstate", onPop);
	}, []);
	const navigate = (to: string) => {
		window.history.pushState({}, "", to);
		setPath(to);
	};
	return { path, navigate };
}

function Home({ navigate }: { navigate: (to: string) => void }) {
	const [posts, setPosts] = useState<PostSummary[]>([]);
	const [name, setName] = useState<string | null>(null);

	useEffect(() => {
		fetch("/api/posts")
			.then((r) => r.json() as Promise<PostSummary[]>)
			.then(setPosts);
	}, []);

	return (
		<>
			<h1>Demo Blog</h1>
			<p className="read-the-docs">
				Each post route injects its own &lt;title&gt;, OG tags, and JSON-LD via
				HTMLRewriter in the Worker. View source on a post page to see it.
			</p>

			<div className="card" style={{ textAlign: "left" }}>
				<h2 style={{ marginTop: 0 }}>Posts</h2>
				<ul style={{ listStyle: "none", padding: 0 }}>
					{posts.map((p) => (
						<li key={p.slug} style={{ margin: "1rem 0" }}>
							<a
								href={`/blog/${p.slug}`}
								onClick={(e) => {
									e.preventDefault();
									navigate(`/blog/${p.slug}`);
								}}
							>
								<strong>{p.title}</strong>
							</a>
							<div style={{ opacity: 0.7, fontSize: "0.9em" }}>
								{p.publishedAt} — {p.description}
							</div>
						</li>
					))}
				</ul>
			</div>

			<div className="card">
				<button
					onClick={() => {
						fetch("/api/")
							.then((res) => res.json() as Promise<{ name: string }>)
							.then((data) => setName(data.name));
					}}
					aria-label="get name"
				>
					Name from API is: {name ?? "Click Me"}
				</button>
			</div>
		</>
	);
}

function BlogPost({
	slug,
	navigate,
}: {
	slug: string;
	navigate: (to: string) => void;
}) {
	const [post, setPost] = useState<Post | null>(null);
	const [notFound, setNotFound] = useState(false);

	useEffect(() => {
		fetch(`/api/posts/${slug}`).then(async (r) => {
			if (!r.ok) {
				setNotFound(true);
				return;
			}
			setPost((await r.json()) as Post);
		});
	}, [slug]);

	if (notFound) {
		return (
			<>
				<h1>Post not found</h1>
				<a
					href="/"
					onClick={(e) => {
						e.preventDefault();
						navigate("/");
					}}
				>
					← Back home
				</a>
			</>
		);
	}

	if (!post) return <p>Loading…</p>;

	return (
		<article style={{ textAlign: "left", maxWidth: 720, margin: "0 auto" }}>
			<a
				href="/"
				onClick={(e) => {
					e.preventDefault();
					navigate("/");
				}}
			>
				← Back home
			</a>
			<h1 style={{ marginTop: "1rem" }}>{post.title}</h1>
			<p style={{ opacity: 0.7 }}>
				{post.author} · {post.publishedAt}
			</p>
			<img
				src={post.image}
				alt=""
				style={{ width: "100%", borderRadius: 8, margin: "1rem 0" }}
			/>
			<p style={{ fontSize: "1.1em", lineHeight: 1.6 }}>{post.body}</p>
		</article>
	);
}

function App() {
	const { path, navigate } = useRoute();
	const blogMatch = path.match(/^\/blog\/([^/]+)$/);

	return blogMatch ? (
		<BlogPost slug={blogMatch[1]} navigate={navigate} />
	) : (
		<Home navigate={navigate} />
	);
}

export default App;
