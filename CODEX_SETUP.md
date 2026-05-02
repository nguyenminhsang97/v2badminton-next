# Codex setup for v2badminton-next

Configured on 2026-05-01 for `D:\V2\v2badminton-next`.

## Enabled or installed

- Project trust: `D:\V2\v2badminton-next` is trusted in `C:\Users\qc08\.codex\config.toml`.
- Multi agents: enabled globally and in `.codex/config.toml`.
- Memories: enabled globally and in `.codex/config.toml`.
- Project MCP servers: `openaiDeveloperDocs`, `context7`, and `playwright`.
- Relevant enabled plugins in global config: GitHub, Vercel, Sentry, Browser Use, Figma, Cloudflare, Linear, Documents, Spreadsheets, and Presentations.
- Browser/GUI workflow on Windows: use Browser Use plus Playwright MCP. Official Codex Computer Use is currently a macOS app capability, so it is documented but not installable for this Windows workspace.
- Mobile test runner: `@playwright/test` is installed and configured in `playwright.config.ts`.
- Android real-device debugging: Android SDK Platform-Tools is installed with `winget` as `Google.PlatformTools`.

## Verified locally

- `C:\Users\qc08\.codex\config.toml` parses as valid TOML.
- `.codex/config.toml` parses as valid TOML.
- `npx -y @playwright/mcp@latest --help` runs successfully.
- `npx -y @upstash/context7-mcp --help` runs successfully.
- `npm run test:mobile` passes on Pixel 7 and iPhone 15 emulation.
- `adb` is installed at `C:\Users\qc08\AppData\Local\Microsoft\WinGet\Packages\Google.PlatformTools_Microsoft.Winget.Source_8wekyb3d8bbwe\platform-tools\adb.exe`. Open a new terminal if `adb` is not found on PATH yet.

## Tool Search note

The Codex dynamic `tool_search` tool is available in this app session and was used while preparing this setup. Current Codex config docs do not expose a project setting named `features.tool_search`; MCP servers are configured with `[mcp_servers.<name>]`.

For OpenAI API applications that need Tool Search with MCP, use the API's `tool_search` tool and defer MCP tool loading in the request design. Keep that separate from this repo-level Codex client config.

## Project defaults for agents

- Read `AGENTS.md` before edits.
- Read the relevant local Next.js guide under `node_modules/next/dist/docs/` before changing Next.js code.
- Prefer current docs through MCP for Next/React/Sanity/Vercel/Sentry decisions.
- After frontend changes, verify with Browser Use or Playwright MCP against local routes.
- Use subagents only when explicitly requested.
- Keep permanent project rules in checked-in docs, not only in Memories.

## References

- Codex MCP: https://developers.openai.com/codex/mcp
- Codex Memories: https://developers.openai.com/codex/memories
- Codex Subagents: https://developers.openai.com/codex/subagents
- Codex Plugins: https://developers.openai.com/codex/plugins
- Codex app features: https://developers.openai.com/codex/app/features
- Codex Computer Use: https://developers.openai.com/codex/app/computer-use
- OpenAI Docs MCP: https://developers.openai.com/learn/docs-mcp
- API Tool Search: https://developers.openai.com/api/docs/guides/tools-tool-search
