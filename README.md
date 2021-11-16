# kolmafia-scripts

`kolmafia-scripts` is designed to make building a KoLmafia script using JavaScript incredibly easy.

## Getting started

Just run `yarn add --dev kolmafia-scripts` and then set up your `package.json` like this:

```json
{
    "name": "my-package-name",
    "main": "RELEASE/scripts/my-package-name/my-package-name.js",
    "mainSrc": "src/main.ts",
    "scripts": {
        "build": "kolmafia-scripts build",
        "watch": "kolmafia-scripts watch"
    },
    "devDependencies": {
        "kolmafia-scripts": "^0.0.3",
        "kolmafia": "^1.4.0"
    },
    "peerDependencies": {
        "kolmafia": "^1.4.0"
    }
}
```

|         |                                                               |
|---------|---------------------------------------------------------------|
| main    | should point to where you would like your compiled code to go |
| mainSrc | should point to the entrypoint to your uncompiled code        |

Note: Installing `kolmafia` here (as shown above) is optional but recommended, especially for `TypeScript`.

## Developing

To build your project run `yarn build`. You can also set it to automatically build as you make changes with `yarn watch`.

## TypeScript

If you want to use TypeScript, all you need to do is `yarn add --dev typescript` and then create a `tsconfig.json`. `kolmafia-scripts` ships with a base TypeScript configuration that you can use or extend by writing your `tsconfig.json` like this:

```json
{
    "extends": "kolmafia-scripts/tsconfig.json"
}
```