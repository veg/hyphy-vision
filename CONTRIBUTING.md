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

### Library
For release, the library configuration of webpack must be used. 

```
webpack --config webpack.config.library.js
```

Please ensure that any entry level functions are exposed in src/library-entry.js as well as src/entry.js

### Mac OS X Desktop Application
1. Obtain a copy of the [Electron binaries](https://github.com/electron/electron/releases) (e.g. `electron-vx.x.x-darwin-x64.zip`) and decompress
2. Rename the Electron binary folder and Electron binary to HyPhy Vision and HyPhy Vision.app, respectively
3. `cd HyPhy\ Vision/HyPhy\ Vision.app/Contents/Resources/`
4. `mkdir app && cd app`
5. `git clone https://github.com/veg/hyphy-vision .`
6. Edit the `main` entry of `package.json` to be `electron.js`
7. `yarn`
8. `webpack`
9. `rm -rf node_modules`
10. Open `images/app-icon.icns` and copy to clipboard, select HyPhy Vision.app and press &#8984;I to get information, click the icon and paste from clipboard
11. The app should now function. Tar/zip base directory and release

### Windows Desktop Application
1. Obtain a copy of the [Electron binaries](https://github.com/electron/electron/releases) (e.g. `electron-vx.x.x-win32-x64.zip`) and decompress
2. Rename the Electron binary folder and Electron binary to HyPhy Vision and HyPhy Vision.exe, respectively
3. `cd HyPhy\ Vision/resources`
4. `mkdir app && cd app`
5. `git clone https://github.com/veg/hyphy-vision .`
6. Edit the `main` entry of `package.json` to be `electron.js`
7. Edit `config.json` to be, `"env": "windows electron"`
8. `yarn`
9. `webpack`
10. `rm -rf node_modules`
11. Use [Resource Hacker](https://www.angusj.com/resourcehacker) to change the app icon to `images/app-icon.ico` Here's a [helpful link](https://www.howtogeek.com/75983/stupid-geek-tricks-how-to-modify-the-icon-of-an-.exe-file/) for using Resource Hacker
12. Hide all files exept for `HyPhy Vision.exe`, `LICENSE`, `LICENSES.chromium.html` and `version`
