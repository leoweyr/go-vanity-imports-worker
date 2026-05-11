export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url: URL = new URL(request.url);
		const path: string = url.pathname;
		const hostname: string = url.hostname;  // Dynamically retrieve the current request hostname.
		const isGoGet: boolean = url.searchParams.get("go-get") === "1";

		// Configuration: Target GitHub owner for redirection (Retrieved from environment variables).
		const githubOwner: string = env.GITHUB_OWNER;

		let repoPath: string = path;

		// Match semantic versioning suffixes for Go modules.
		const versionMatch: RegExpMatchArray | null = path.match(/\/(v[2-9]\d*)$/);

		if (versionMatch) {
			repoPath = path.slice(0, -versionMatch[0].length);
		}

		// 1. Intercept requests from the Go toolchain.
		if (isGoGet) {
			// Use the dynamic hostname in the meta tag for go-import.
			const html: string = `<!DOCTYPE html>
<html>
<head>
    <meta name="go-import" content="${hostname}${path} git https://github.com/${githubOwner}${repoPath}">
</head>
<body>Go get redirect for ${hostname}</body>
</html>`;
			return new Response(html, { headers: { "Content-Type": "text/html" } });
		}

		// 2. Handle browser access (human users).
		// Redirect root path to the GitHub profile.
		if (path === "/" || path === "") {
			return Response.redirect(`https://github.com/${githubOwner}`, 302);
		}

		// Redirect specific module paths to the corresponding GitHub repository
		return Response.redirect(`https://github.com/${githubOwner}${repoPath}`, 302);
		},
		} satisfies ExportedHandler<Env>;

