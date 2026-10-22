# Resume: Business Profile MCP

Scaffold only. No Google API calls, no OAuth app, and no published packages. Start from this file.

Kaneo was unavailable when this was written (`/api/auth/get-session: Application not found`), so this document is the tracker.

The Analytics server is [lemon-squared/google-analytics-mcp](https://github.com/lemon-squared/google-analytics-mcp). The Tag Manager server is [lemon-squared/google-tag-manager-mcp-server](https://github.com/lemon-squared/google-tag-manager-mcp-server). Do not add GA4 or Tag Manager tools here.

## Already shipped

| Repo | Role |
| --- | --- |
| [lemon-squared/signal](https://github.com/lemon-squared/signal) | Consent banner, `cookieDomain`, Next.js GTM loader. Sites pass their own domain and container id. |
| [lemon-squared/gtm-template-consent-mode](https://github.com/lemon-squared/gtm-template-consent-mode) | Consent Mode v2 web tag. |
| [lemon-squared/google-analytics-mcp](https://github.com/lemon-squared/google-analytics-mcp) | GA4 Admin and Data MCP scaffold. |
| [lemon-squared/google-tag-manager-mcp-server](https://github.com/lemon-squared/google-tag-manager-mcp-server) | Tag Manager MCP scaffold. |

## This repository

TypeScript, formatted with Ultracite. The local CLI keeps client Business Profile data on the machine that holds the credentials.

The APIs are federated. Each group has its own base URL. The overview is [Business Profile APIs](https://developers.google.com/my-business/ref_overview).

| Path | Package | Status |
| --- | --- | --- |
| `packages/core` | `@lemon-squared/google-business-profile-mcp-core` | `BusinessProfileAuthProvider` only. Tools go here. |
| `packages/cli` | `@lemon-squared/google-business-profile-mcp` | Exits immediately and points at this file. |
| `apps/worker` | not created | Hosted OAuth, after the CLI is in use. |

`BusinessProfileAuthProvider.getAccessToken()` is the only auth seam. The CLI and a later worker both implement it. Tools never see how the token was obtained.

Credentials for the CLI, in order of preference for client work: a service account key, a refresh token, or a short-lived access token. One environment variable. Do not put that value in a committed `.cursor/mcp.json`.

When the CLI speaks MCP over stdio, user-level Cursor config is `~/.cursor/mcp.json` so every internal and client project can see it.

Google must approve the Cloud project for these APIs before a call succeeds. Scope for the first tools: `https://www.googleapis.com/auth/business.manage`.

### Tools to add

Reads first. Writes after those reads are what Cursor uses.

| API | Tools |
| --- | --- |
| Account Management | `list_accounts`, `list_account_admins` |
| Business Information | `list_locations`, `get_location`, `list_categories`, `list_attributes` |
| Performance | `get_daily_metrics`, `list_search_keywords` |
| Verifications | `get_voice_of_merchant`, `list_verifications` |
| Google My Business v4.9 | `list_reviews`, `list_local_posts`, `list_media` |

Later writes, still in this repo: update a location, reply to a review, create a local post, and manage place-action links. Lodging stays out until a client is a hotel. Business Calls and notification settings come after the location reads work.

A normal call is `list_accounts`, then `list_locations`, then one location's details, performance, or reviews.

## Order of work

1. Implement the read tools in `packages/core`, then make `packages/cli` an stdio MCP server.
2. Add location, review, and post writes on top of those reads.
3. Add a hosted OAuth worker only after the local CLI is what Cursor uses for client projects.

## Constraints

- Format with Ultracite (`bun run format`). The config extends `ultracite/biome/core`.
- Keep client Google data on the local CLI until a hosted worker exists.
- Do not put Analytics or Tag Manager tools in this repository.
