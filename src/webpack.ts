import webpack from "webpack";
import path from "path";
import chalk from "chalk";
import fs from "fs";
import TerserPlugin from "terser-webpack-plugin";
import prettyBytes from "pretty-bytes";

import formatWebpackMessages from "./formatWebpackMessages";
import { getAppRootPath } from "./utils";

const babelOptions = {
  presets: [
    "@babel/preset-typescript",
    [
      "@babel/preset-env",
      {
        targets: { rhino: "1.7" },
      },
    ],
  ],
  plugins: [
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-proposal-object-rest-spread",
  ],
};

function configFactory() {
  const appRoot = getAppRootPath();
  const appConfigPath = path.join(getAppRootPath(), "package.json");

  const appConfig = JSON.parse(fs.readFileSync(appConfigPath, "utf-8"));

  const { main, mainSrc } = appConfig;

  const entry = path.join(appRoot, mainSrc);
  const outputPath = path.join(appRoot, main);

  const ts = fs.existsSync(path.join(appRoot, "tsconfig.json"));

  return webpack({
    mode: "production",
    entry,
    devtool: false,
    output: {
      path: path.dirname(outputPath),
      filename: path.basename(outputPath),
      libraryTarget: "commonjs",
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js", "json"],
    },
    module: {
      rules: [
        {
          test: /\.(t|j)sx?$/,
          use: [{ loader: "babel-loader", options: babelOptions }],
        },
      ],
    },
    optimization: {
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            mangle: false,
            output: { beautify: true },
          },
        }),
      ],
    },
    externals: [
      {
        kolmafia: "commonjs kolmafia",
      },
      ({ request }, callback) => {
        if (request && /\.ash$/.test(request)) {
          return callback(undefined, `commonjs ${request}`);
        }

        callback();
      },
    ],
  });
}

const compilerCallback = (err?: Error, stats?: webpack.Stats) => {
  let messages = { errors: [] as string[], warnings: [] as string[] };
  if (err) {
    messages = formatWebpackMessages({ errors: [err.message], warnings: [] });
  } else if (stats) {
    messages = formatWebpackMessages(
      stats.toJson({ all: false, warnings: true, errors: true })
    );
  }

  if (messages.errors.length) {
    console.log(chalk.red("Compiled with errors.\n"));
    console.log(messages.errors.join("\n\n"));
  } else if (messages.warnings.length) {
    console.log(chalk.yellow("Compiled with warnings.\n"));
    console.log(messages.warnings.join("\n\n"));
  } else {
    const { assets } = stats?.toJson({ all: false, assets: true });
    const totalSize = assets.reduce(
      (size: number, asset: { size: number }) => size + asset.size,
      0
    );
    console.log(chalk`{green Total size: ${prettyBytes(totalSize)}}\n`);
    console.log(chalk`{bold.green Compiled successfully.}\n`);
  }
};

export function run() {
  const compiler = configFactory();
  compiler.run(compilerCallback);
}

export function watch() {
  const compiler = configFactory();
  compiler.watch({}, compilerCallback);
}
