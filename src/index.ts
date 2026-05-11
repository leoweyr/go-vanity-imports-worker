export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		try {
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

			// 2. Handle browser access (Human users).
			// Redirect root path to the GitHub profile.
			let targetUrl: string;

			if (path === "/" || path === "") {
				targetUrl = `https://github.com/${githubOwner}`;
			} else {
				targetUrl = `https://github.com/${githubOwner}${repoPath}`;
			}

			// Attempt redirection.
			return Response.redirect(targetUrl, 302);
		} catch (e: any) {
			// Return detailed diagnostic information on failure.
			const diagnostics = {
				error: e.message,
				stack: e.stack,
				context: {
					githubOwnerSet: !!env.GITHUB_OWNER,
					githubOwnerLength: env.GITHUB_OWNER?.length || 0,
					requestUrl: request.url,
					pathname: new URL(request.url).pathname,
				}
			};

			return new Response(JSON.stringify(diagnostics, null, 2), {
				status: 500,
				headers: { "Content-Type": "application/json" }
			});
		}
	},
} satisfies ExportedHandler<Env>;
