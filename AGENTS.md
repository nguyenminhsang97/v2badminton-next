<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes - APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Codex Project Tooling

- Use the project-scoped `.codex/config.toml` for MCP/features that belong to this repo.
- Use the OpenAI developer docs MCP server for OpenAI API, ChatGPT Apps SDK, Codex, MCP, tool, or model questions without needing an explicit reminder.
- Use Context7 MCP for current framework/library docs when working with Next.js, React, Sanity, Vercel, Sentry, Upstash, or related packages. Still read the local Next.js docs in `node_modules/next/dist/docs/` before changing Next.js code.
- Use Browser Use or the Playwright MCP server for local UI verification after frontend changes. Start the dev server and check key routes at desktop and mobile sizes when the change affects UX.
- Subagents are available for this project, but only spawn them when the user explicitly asks for multi-agent or parallel-agent work.
- Memories are enabled for useful local recall, but durable project rules must stay in `AGENTS.md` or checked-in docs.
- On this Windows workspace, prefer Browser Use, Playwright MCP, shell, and file inspection for GUI/browser work. Codex Computer Use is a macOS-only app capability in the current official docs.
