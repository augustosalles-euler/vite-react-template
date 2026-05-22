import { Hono } from "hono";
import { posts, type Post } from "./posts";

const app = new Hono<{ Bindings: Env }>();

app.get("/api/", (c) => c.json({ name: "Augusto" }));

app.get("/api/posts", (c) =>
	c.json(
		Object.values(posts).map(({ slug, title, description, publishedAt }) => ({
			slug,
			title,
			description,
			publishedAt,
		})),
	),
);

app.get("/api/posts/:slug", (c) => {
	const post = posts[c.req.param("slug")];
	if (!post) return c.json({ error: "not found" }, 404);
	return c.json(post);
});

app.get("/blog/:slug", async (c) => {
	const slug = c.req.param("slug");
	const post = posts[slug];

	const shellUrl = new URL("/index.html", c.req.url);
	const shell = await c.env.ASSETS.fetch(shellUrl);

	if (!post) {
		return new Response(shell.body, {
			status: 404,
			headers: { "content-type": "text/html; charset=utf-8" },
		});
	}

	const canonical = `${new URL(c.req.url).origin}/blog/${slug}`;
	return rewriteHead(shell, post, canonical);
});

function rewriteHead(shell: Response, post: Post, canonical: string): Response {
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "BlogPosting",
		headline: post.title,
		description: post.description,
		image: post.image,
		author: { "@type": "Person", name: post.author },
		datePublished: post.publishedAt,
		mainEntityOfPage: canonical,
	};

	const tags = [
		`<meta name="description" content="${esc(post.description)}">`,
		`<link rel="canonical" href="${esc(canonical)}">`,
		`<meta property="og:type" content="article">`,
		`<meta property="og:title" content="${esc(post.title)}">`,
		`<meta property="og:description" content="${esc(post.description)}">`,
		`<meta property="og:image" content="${esc(post.image)}">`,
		`<meta property="og:url" content="${esc(canonical)}">`,
		`<meta name="twitter:card" content="summary_large_image">`,
		`<meta name="twitter:title" content="${esc(post.title)}">`,
		`<meta name="twitter:description" content="${esc(post.description)}">`,
		`<meta name="twitter:image" content="${esc(post.image)}">`,
		`<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`,
	].join("\n");

	return new HTMLRewriter()
		.on("title", {
			element(el) {
				el.setInnerContent(`${post.title} — Demo Blog`);
			},
		})
		.on("head", {
			element(el) {
				el.append(tags, { html: true });
			},
		})
		.transform(shell);
}

function esc(s: string): string {
	return s
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");
}

export default app;
