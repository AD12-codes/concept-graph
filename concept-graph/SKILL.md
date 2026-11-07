---
name: concept-graph
description: Generate or update a project's concept graph (concepts/<slug>.json) by reading the repo, picking the ideas worth learning, and explaining each in plain words with the real code. Use when the user runs /concept-graph or asks to map, explain, or document the concepts inside a codebase.
---

# Concept graph generator

Usage:

- `/concept-graph <slug> <path-to-repo>` creates or refreshes `concepts/<slug>.json` in the current working directory
- `/concept-graph <slug> <path-to-repo> --out <file>` writes somewhere else
- `/concept-graph <slug> add "<concept>"` adds one concept the owner asked for to an existing file

The slug is lowercase letters, digits and dashes, for example `my-app`. The file is always named `<slug>.json`.

## Why this exists

People build products with AI and want to understand the ideas inside them: security, auth, state management, rate limiting, and so on. The graph is a map of those ideas, each explained in plain language using the project's own code. It is static JSON. View it at https://viewer.ad12-codes.work or build your own viewer from the schema.

## Output format

One JSON file matching `schema/concept-graph.schema.json` in this repo. The shape:

```json
{
  "project": "my-app",
  "name": "My App",
  "repo": "https://github.com/you/my-app",
  "repoPrivate": false,
  "commit": "abc1234",
  "generatedAt": "2026-01-01",
  "nodes": [
    {
      "id": "state-management/server/react-query",
      "title": "React Query",
      "summary": "Keeps a copy of server data in the browser and refreshes it for you.",
      "explanation": "markdown...",
      "code": [{ "file": "src/lib/api.ts", "lang": "ts", "lines": "10-32", "snippet": "...", "note": "..." }],
      "related": ["communication/rest-api"],
      "custom": false
    }
  ]
}
```

Rules for ids:

- `category/slug` is a level-2 node, `category/slug/slug` is level 3. The parent is the id minus its last segment, and it must exist as a node too.
- Categories are fixed, see `taxonomy.json` next to this file. Never invent a category. If a project has nothing in a category, leave it out.
- Group nodes are fine and encouraged, for example `state-management/server` and `state-management/client`, each with a short explanation of the split.

## Steps

1. **Orient.** Read `package.json` files (or the equivalent manifest), the README, and any `AGENTS.md` or `CLAUDE.md` in the repo. Note the stack and the folder layout. Record the current commit with `git -C <repo> rev-parse --short HEAD`.
2. **Hunt for concepts.** Look at auth setup, middleware, route handlers, validation schemas, database schema and migrations, queues or sockets, state stores and query hooks, caching, env handling, Dockerfiles and CI, test setup, and anything that took real design thought. Aim for 15 to 35 nodes. Prefer ideas the owner would struggle to fix alone over trivia.
3. **Only claim what you can point at.** Every node needs at least one real snippet from the repo with its file path and line range. Trim snippets to the part that matters, 10 to 40 lines. Read the lines with `sed -n` so the line range is exact. If you cannot find code for it, it is not a concept of this project.
4. **Write the explanation** following the style below.
5. **Never include** secrets, `.env` contents, API keys, tokens, salts, personal data, customer data, or internal URLs. If a snippet contains one, replace the value with `"<redacted>"`. Before saving, grep the JSON for `sk-`, `key`, `secret`, `token`, `password` and email addresses, and confirm each hit is a name, not a value.
6. **Save** the file, then run `node <this skill's directory>/validate.mjs <file>` and fix every issue it reports. The validator has no dependencies.
7. **Report** the categories and node counts, and list anything you considered but skipped, so the owner can ask for it with the `add` form.

When the file already exists: keep every existing node id and every node marked `custom: true`, refresh snippets and explanations where the code changed, add new nodes, and list nodes that no longer match the code instead of deleting them. Update `commit` and `generatedAt`.

## Explanation style

Write for someone who uses these tools daily but has never had them explained. Short, concrete, no jargon without a plain-word gloss.

Structure each explanation like this, in Markdown, 120 to 250 words:

- **What problem it solves.** One or two sentences. Start from the pain, not the tool.
- **How it works here.** Walk through the flow in this project: what triggers it, what it touches, what comes out. Name the files.
- **What breaks without it.** The concrete failure the owner would see.
- **Why this choice.** One sentence on why this tool or pattern over the obvious alternative, if there is a reason.

Good: "Without a session, the server forgets who you are the moment a request ends. Better Auth stores a random session id in a cookie and keeps the matching row in Postgres, so every request can be matched back to a user."

Bad: "Better Auth provides a pluggable session management layer with configurable persistence adapters."

The `summary` is one plain sentence a beginner would understand. The snippet `note` says what to look at in the code, for example "Line 14 is where the cookie gets the httpOnly flag."

## After generating

Tell the owner where the file is and how to see it:

- open https://ad12-codes.work/viewer and drop the file in, or
- commit the file and open `https://ad12-codes.work/viewer?src=<raw GitHub URL of the file>` for a link they can share.

Remind them that the snippets are now content: if the repo is private, decide before publishing the JSON whether those 10 to 40 line excerpts are fine to show.
