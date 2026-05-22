export type Post = {
	slug: string;
	title: string;
	description: string;
	body: string;
	image: string;
	author: string;
	publishedAt: string;
};

export const posts: Record<string, Post> = {
	"hello-cloudflare": {
		slug: "hello-cloudflare",
		title: "Hello Cloudflare Workers",
		description:
			"How we ship a SEO-friendly SPA on Cloudflare Workers using HTMLRewriter — no full SSR required.",
		body: "Cloudflare's HTMLRewriter lets a Worker stream the static index.html and rewrite the <head> per-route. The React bundle still hydrates the same SPA, but crawlers and social cards see a fully populated <head>.",
		image:
			"https://imagedelivery.net/wSMYJvS3Xw-n339CbDyDIA/532a5378-9717-4964-385b-5fafd2160200/public",
		author: "Augusto",
		publishedAt: "2026-05-20",
	},
	"react-19-meta-injection": {
		slug: "react-19-meta-injection",
		title: "Per-route meta tags with React 19 + Hono",
		description:
			"A pragmatic middle ground between pure SPA and full SSR: server-injected SEO with client-rendered bodies.",
		body: "We keep the Vite-built SPA, add a Hono route for /blog/:slug, and stream HTMLRewriter transforms over index.html. The result: real OG previews, real Twitter cards, real JSON-LD — without restructuring the app.",
		image:
			"https://imagedelivery.net/wSMYJvS3Xw-n339CbDyDIA/ec7f4be5-d1d6-4e94-0851-126341745400/preview",
		author: "Augusto",
		publishedAt: "2026-05-22",
	},
};
