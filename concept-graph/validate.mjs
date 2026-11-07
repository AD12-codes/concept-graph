#!/usr/bin/env node
/**
 * Validates a concept graph file. No dependencies.
 * Usage: node validate.mjs <path/to/project.json>
 */
import { readFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const categories = JSON.parse(readFileSync(join(here, "taxonomy.json"), "utf-8"));
const categoryIds = new Set(categories.map((c) => c.id));

const target = process.argv[2];
if (!target) {
  console.error("usage: node validate.mjs <path/to/project.json>");
  process.exit(2);
}

const issues = [];
const fail = (path, message) => issues.push(`${path}: ${message}`);
const isString = (v) => typeof v === "string";

let file;
try {
  file = JSON.parse(readFileSync(target, "utf-8"));
} catch (error) {
  console.error(`✗ ${target}: not valid JSON (${error.message})`);
  process.exit(1);
}

if (!isString(file.project) || !/^[a-z0-9-]+$/.test(file.project)) fail("project", "must be a slug like my-app");
if (!isString(file.name) || !file.name) fail("name", "required");
if (file.repo !== undefined && (!isString(file.repo) || !/^https?:\/\//.test(file.repo))) fail("repo", "must be a URL");
if (file.repoPrivate !== undefined && typeof file.repoPrivate !== "boolean") fail("repoPrivate", "must be true or false");
if (!isString(file.generatedAt) || !/^\d{4}-\d{2}-\d{2}$/.test(file.generatedAt)) fail("generatedAt", "must be YYYY-MM-DD");
if (!Array.isArray(file.nodes) || file.nodes.length === 0) fail("nodes", "must be a non-empty array");

const nodes = Array.isArray(file.nodes) ? file.nodes : [];
const ids = new Set();
nodes.forEach((node, i) => {
  const p = `nodes.${i}`;
  if (!isString(node.id) || !/^[a-z0-9-]+(\/[a-z0-9-]+)+$/.test(node.id)) {
    fail(`${p}.id`, "must look like category/slug or category/slug/slug");
    return;
  }
  if (ids.has(node.id)) fail(`${p}.id`, `duplicate id ${node.id}`);
  ids.add(node.id);
  const category = node.id.split("/")[0];
  if (!categoryIds.has(category)) fail(`${p}.id`, `unknown category "${category}" (see taxonomy.json)`);
  if (!isString(node.title) || !node.title || node.title.length > 60) fail(`${p}.title`, "required, at most 60 characters");
  if (!isString(node.summary) || !node.summary || node.summary.length > 180) fail(`${p}.summary`, "required, at most 180 characters");
  if (!isString(node.explanation) || !node.explanation) fail(`${p}.explanation`, "required");
  else {
    const words = node.explanation.trim().split(/\s+/).length;
    if (words < 80 || words > 320) fail(`${p}.explanation`, `${words} words; aim for 120 to 250`);
  }
  if (node.code !== undefined) {
    if (!Array.isArray(node.code)) fail(`${p}.code`, "must be an array");
    else
      node.code.forEach((snippet, j) => {
        const sp = `${p}.code.${j}`;
        if (!isString(snippet.file) || !snippet.file) fail(`${sp}.file`, "required");
        if (!isString(snippet.lang) || !snippet.lang) fail(`${sp}.lang`, "required");
        if (!isString(snippet.snippet) || !snippet.snippet) fail(`${sp}.snippet`, "required");
        if (snippet.lines !== undefined && !/^\d+(-\d+)?$/.test(String(snippet.lines))) fail(`${sp}.lines`, "must look like 12-48");
      });
  }
  if ((node.code ?? []).length === 0) fail(`${p}.code`, `no snippet; every concept needs real code from the repo`);
  if (node.related !== undefined && !Array.isArray(node.related)) fail(`${p}.related`, "must be an array of ids");
  if (node.custom !== undefined && typeof node.custom !== "boolean") fail(`${p}.custom`, "must be true or false");
});
nodes.forEach((node, i) => {
  if (!isString(node.id)) return;
  const segments = node.id.split("/");
  if (segments.length > 2) {
    const parent = segments.slice(0, -1).join("/");
    if (!ids.has(parent)) fail(`nodes.${i}.id`, `parent ${parent} of ${node.id} does not exist`);
  }
  (Array.isArray(node.related) ? node.related : []).forEach((related, j) => {
    if (!ids.has(related)) fail(`nodes.${i}.related.${j}`, `related id ${related} does not exist`);
  });
});
if (isString(file.project) && basename(target) !== `${file.project}.json`) {
  fail("project", `is "${file.project}" but the file is named ${basename(target)}`);
}

// Secrets never belong in a graph. Loose patterns, on purpose: a hit is a prompt to look, not a verdict.
const text = JSON.stringify(file);
const secretPatterns = [
  [/sk-[A-Za-z0-9]{16,}/, "looks like an OpenAI/Stripe style key"],
  [/AKIA[0-9A-Z]{16}/, "looks like an AWS access key"],
  [/ghp_[A-Za-z0-9]{20,}/, "looks like a GitHub token"],
  [/-----BEGIN [A-Z ]*PRIVATE KEY-----/, "contains a private key"],
  [/(password|secret|api[_-]?key|token)["']?\s*[:=]\s*["'][^"'<]{8,}["']/i, "a credential-looking assignment with a literal value"],
];
for (const [pattern, why] of secretPatterns) {
  const match = text.match(pattern);
  if (match) fail("secrets", `${why}: ${match[0].slice(0, 24)}… replace the value with "<redacted>"`);
}

if (issues.length > 0) {
  console.error(`✗ ${target}`);
  for (const issue of issues) console.error(`   ${issue}`);
  process.exit(1);
}

const counts = new Map();
for (const node of nodes) {
  const c = node.id.split("/")[0];
  counts.set(c, (counts.get(c) ?? 0) + 1);
}
console.log(`✓ ${target}: ${nodes.length} nodes in ${counts.size} categories`);
for (const [c, n] of [...counts.entries()].sort((a, b) => b[1] - a[1])) console.log(`   ${c.padEnd(22)} ${n}`);
