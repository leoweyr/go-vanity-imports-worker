# Go Vanity Imports Worker

A Cloudflare Worker for seamless vanity import redirection, level up your Go modules with custom domains.

Once configured, your Go modules can be installed via:

```bash
go get go.your-domain.com/your-go-package
```

Browser users visiting the same URL will be automatically redirected to the corresponding GitHub repository page.

## 🚀 Quick Start

1. Fork this repository to your GitHub account.

2. Configure GitHub Actions secrets and variables.

   ### Secrets

   | Secret                  | Description                                                                 | How to Obtain                                                                                                                                                                                                                                                                                                   |
   |-------------------------|-----------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
   | `CLOUDFLARE_API_TOKEN`  | Cloudflare API token used by GitHub Actions to deploy the Worker.           | 1. Open Cloudflare Dashboard and go to `My Profile -> API Tokens`.<br/>2. Click `Create Token` and select `Edit Cloudflare Workers` template.<br/>3. Ensure the token has permissions for `Workers Scripts: Edit`.<br/>4. In `Account Resources`, include the target account.                                   |
   | `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account identifier used by deployment actions.                   | 1. Open Cloudflare Dashboard in your browser.<br/>2. Copy the account ID directly from the URL path, for example: `https://dash.cloudflare.com/<ACCOUNT_ID>/home/overview`.                                                                                                                                     |

   ### Variables

   | Variable   | Description                                                  |
   | ---------- | ------------------------------------------------------------ |
   | `GH_OWNER` | The GitHub username or organization where your source repositories reside. |

3. Trigger the `Deploy Cloudflare` workflow manually.

4. Configure Worker custom domains. After the first successful deployment, you must manually bind your custom domains to the Worker:

   - Open Cloudflare Dashboard and go to `Workers & Pages`.

   - Select the Worker service `go-vanity-imports`.

   - Go to `Settings -> Domains & Routes` and click `Add Custom Domain`.

   - Enter your vanity domain (e.g., `go.your-domain.com`).
