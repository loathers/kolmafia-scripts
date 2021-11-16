#!/usr/bin/env node
import { run, watch } from "./webpack";

const args = process.argv.slice(2);

function buildScript() {
  run();
}

function watchScript() {
  watch();
}

const scripts = {
  build: buildScript,
  watch: watchScript,
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
