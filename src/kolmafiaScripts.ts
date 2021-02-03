#!/usr/bin/env node

import spawn from "cross-spawn";
import path from "path";

import { run, watch } from "./webpack";

const args = process.argv.slice(2);
const execPath = process.execPath;

function buildScript() {
  run();
}

function watchScript() {
  watch();
}

function postInstallScript() {
  const patchesDir = path.relative(
    process.cwd(),
    path.join(__dirname, "../patches")
  );
  spawn.sync(
    execPath,
    ["node_modules/.bin/patch-package", "--patch-dir", patchesDir],
    { stdio: "inherit" }
  );
}

const scripts = {
  build: buildScript,
  watch: watchScript,
  postinstall: postInstallScript,
};

const scriptIndex = args.findIndex((x) => Object.keys(scripts).includes(x));

const script = scriptIndex === -1 ? args[0] : args[scriptIndex];

function isValidScript(name: string): name is keyof typeof scripts {
  return Object.keys(scripts).includes(script);
}

if (!isValidScript(script)) {
  console.log(`Unknown script "${script}".`);
  console.log("Perhaps you need to update kolmafia-scripts?");
  process.exit(1);
}

scripts[script]();
