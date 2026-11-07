# concept-graph

A Claude Code skill that reads a repo and writes a **concept graph**: a map of the ideas inside the code (auth, rate limiting, state management, queues, caching…), each explained in plain words with the real snippet that implements it. Plus a viewer to explore the result.

- Live examples: [PrepTalk](https://ad12-codes.work/concepts/preptalk), [TypeNinja](https://ad12-codes.work/concepts/typeninja), [Sightify](https://ad12-codes.work/concepts/sightify)
- Viewer for your own graphs: **https://viewer.ad12-codes.work**

The idea: you build things with AI faster than you learn them. The graph is the learning layer. Root is your project, the first ring is a fixed set of categories, deeper nodes are the concepts the skill found, and clicking a leaf opens a short explanation written for someone who uses the tool daily but never had it explained.

## Install

Copy the `concept-graph` folder into your project's `.claude/skills/`:

```bash
npx degit AD12-codes/concept-graph/concept-graph .claude/skills/concept-graph
```

or clone and copy:

```bash
git clone https://github.com/AD12-codes/concept-graph
cp -r concept-graph/concept-graph your-project/.claude/skills/
```

Put it in `~/.claude/skills/` instead to have it in every project.

## Use

Inside Claude Code, in the repo you want mapped:

```
/concept-graph my-app .
```

That writes `concepts/my-app.json`, validates it, and reports what it found and what it skipped. Then:

```
/concept-graph my-app add "how the websocket reconnects"
```

adds a concept you asked for by hand. Those are marked `custom: true` and survive every refresh.

Run it again later to refresh snippets after the code changed. Existing node ids are kept.

## See it

1. Open https://viewer.ad12-codes.work and drop the JSON in. Everything renders in your browser, nothing is uploaded.
2. Or commit the file and share a link:

```
https://viewer.ad12-codes.work/?src=https://raw.githubusercontent.com/you/my-app/main/concepts/my-app.json
```

Any https URL that allows cross-origin reads works. Raw GitHub and gist links do.

## What's in the box

| Path | What |
|---|---|
| `concept-graph/SKILL.md` | the skill: steps, rules, explanation style |
| `concept-graph/taxonomy.json` | the fixed level-1 categories |
| `concept-graph/validate.mjs` | zero-dependency validator, `node validate.mjs concepts/my-app.json` |
| `schema/concept-graph.schema.json` | JSON Schema, for editors and your own tooling |
| `examples/` | two real graphs, 30 nodes each |

## The format, briefly

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
      "id": "auth/sessions",
      "title": "Cookie sessions",
      "summary": "A random id in a cookie, matched to a row in the database on every request.",
      "explanation": "**What problem it solves.** ...",
      "code": [{ "file": "src/auth.ts", "lang": "ts", "lines": "12-40", "snippet": "...", "note": "Line 20 sets httpOnly." }],
      "related": ["security/csrf"],
      "custom": false
    }
  ]
}
```

Ids are paths. `auth/sessions` is a level-2 node, `auth/sessions/refresh` is level 3 and needs its parent to exist. Categories are fixed (see `taxonomy.json`) so graphs from different projects look alike.

## Before you publish a graph

The snippets are real code, 10 to 40 lines each. The skill refuses secrets and the validator flags anything that looks like a key, but it cannot know what your employer or client considers confidential. For a private repo, read the JSON before you push it anywhere public.

## Build your own viewer

The schema is all you need. The reference viewer uses a force-directed canvas, Markdown for explanations, and Shiki for the snippets; the only non-obvious rule is that a node's parent is its id minus the last segment.

## License

MIT
