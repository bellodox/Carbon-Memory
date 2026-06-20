#!/usr/bin/env node

import { existsSync, chmodSync } from "node:fs";
import { resolve } from "node:path";
import { execFileSync } from "node:child_process";

const hookDir = resolve(".githooks");
const preCommitHookPath = resolve(".githooks/pre-commit");
const prePushHookPath = resolve(".githooks/pre-push");

if (!existsSync(hookDir)) {
  console.error("[carbon-memory] Missing .githooks directory.");
  process.exit(1);
}

if (!existsSync(preCommitHookPath) || !existsSync(prePushHookPath)) {
  console.error("[carbon-memory] Expected hook files .githooks/pre-commit and .githooks/pre-push.");
  process.exit(1);
}

try {
  execFileSync("git", ["rev-parse", "--git-dir"], { stdio: "ignore" });
} catch {
  console.error("[carbon-memory] This directory is not a git repository.");
  process.exit(1);
}

try {
  chmodSync(preCommitHookPath, 0o755);
  chmodSync(prePushHookPath, 0o755);
} catch {
  // Best effort only. Git can still read hooks on platforms where chmod is a no-op.
}

execFileSync("git", ["config", "core.hooksPath", ".githooks"], { stdio: "inherit" });

console.log("[carbon-memory] Activated native Git hooks via core.hooksPath=.githooks");
