# Contributing

## Development workflow

After cloning HyPhy-Vision, run `npm install` to fetch its dependencies.

While developing, use the command `webpack -w` to update `hyphy-vision.js` and
`hyphy-vision.css` with your code changes.

When generating a new release, we follow [Semantic
Versioning](http://semver.org/) and submit the latest releases to
[npm](https://www.npmjs.com/package/hyphy-vision).

### CSS styling

There are two separate style-sheets in HyPhy-Vision.

The first is [bootstrap theming](src/application.less) and the second is [css to be packaged](src/hyphyvision.css).

The CSS to be packaged should include css that is necessary to view components in a functional way. All CSS declarations made in hyphyvision.css will be part of the distribution. The Bootstrap theming is specific to the hyphy-vision site that is hosted at vision.hyphy.org. The reason for this separation is because upstream applications (e.g. datamonkey.org) should be able to have its own options for bootstrap theming. Datamonkey will host other pages outside of HyPhy-Vision's pages, and therefore should have its freedom to theme as it pleases.

## React recommendations

- Method that return elements should have a name with Element suffix

## Release
For release, the library configuration of webpack must be used. 

```
webpack --config webpack.config.library.js
```

Please ensure that any entry level functions are exposed in src/library-entry.js as well as src/entry.js
