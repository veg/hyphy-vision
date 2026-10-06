# Deploying vision.hyphy.org

This is the build-and-deploy procedure for the hosted HyPhy Vision site at
<https://vision.hyphy.org>. It exists because the live site once drifted 27
commits behind `master` without anyone noticing (#899). Merging to `master`
does **not** deploy anything; a maintainer has to run the steps below.

Items marked **TODO (maintainer)** could not be confirmed from the repository
or from the last deploy and should be filled in by someone with host access.

## Topology

| Piece | Where | Notes |
| --- | --- | --- |
| TLS + reverse proxy | nginx on `junglegym` | Proxies `vision.hyphy.org` to `datamonkey-main:8000` and adds `Access-Control-Allow-Origin: *`. The TLS certificate includes `vision.hyphy.org`. |
| App server | datamonkey host (`datamonkey-main`) | `node server.js` (Express, serves the static `dist/` folder, falls back to `dist/index.html` for every other path). Listens on `PORT`, default `8000`. |
| Process manager | pm2 app **`hyphy-vision`**, run as the **`node`** user | |
| Live checkout | `/home/node/hyphy-vision` | `dist/` is git-ignored, so it is a build artifact that lives only on the host. |
| Staging clone | `/home/node/hyphy-vision-next` | Separate clone used to build and smoke-test before swapping. |

**TODO (maintainer):** path of the nginx site config on `junglegym`, and the
exact pm2 start definition (ecosystem file or `pm2 start` command line) for
`hyphy-vision`.

## Node versions

| Purpose | Node | How it is selected |
| --- | --- | --- |
| Serving (`pm2` → `server.js`) | v17.9.1 | Pinned via nvm for the pm2 app. |
| Building (`webpack`) | v23.3.0 | nvm default in the `node` user's login shell. |

`server.js` only needs Express, so the serve Node and the build Node do not
have to match. Use **Yarn 1 (classic)**; `yarn.lock` is a v1 lockfile and Yarn
2+ refuses it.

**TODO (maintainer):** how the pm2 app is pinned to v17.9.1 (pm2
`interpreter` setting, or pm2 itself installed under that nvm version).

## Build command

```sh
yarn install --frozen-lockfile
yarn build
```

> **Note (until #896 is resolved):** the `build` script sets
> `NODE_OPTIONS=--openssl-legacy-provider` unconditionally. That flag is
> required on Node built against OpenSSL 3 (the build host's Node 23.3.0);
> without it webpack fails with about 29 `loader-utils` `getHashDigest` (MD4)
> errors on the FontAwesome font assets. On Node built against OpenSSL 1.1
> (for example Node 16.20.2) the flag is rejected with
> `--openssl-legacy-provider is not allowed in NODE_OPTIONS`. So build on the
> host's Node 23.3.0, where `yarn build` works as committed. Do not edit the
> `build` script on the host to work around this; the live checkout once
> carried such an uncommitted edit (#896).

`webpack.config.js` does not set `output.clean`, so old hashed assets
accumulate in `dist/`. Delete `dist/` before building.

## Deploy procedure

Run everything as the `node` user in a login shell, so nvm is loaded. Set the
shell variables once:

```sh
LIVE=/home/node/hyphy-vision
NEXT=/home/node/hyphy-vision-next
BACKUP=/home/node/hyphy-vision-backups/$(date +%Y%m%d-%H%M%S)
```

**TODO (maintainer):** confirm or replace the backup location above; the last
deploy took backups but their path was not recorded.

### 1. Back up the live state

```sh
mkdir -p "$BACKUP"
git -C "$LIVE" rev-parse HEAD > "$BACKUP/HEAD.sha"
git -C "$LIVE" status --porcelain > "$BACKUP/status.txt"
git -C "$LIVE" diff HEAD > "$BACKUP/uncommitted.diff"
cp -a "$LIVE/dist" "$BACKUP/dist"
```

If `uncommitted.diff` is not empty, find out why before continuing. Local
edits on the host are how the build script drift in #896 went unnoticed.

### 2. Build in the staging clone

```sh
cd "$NEXT"
git fetch origin
git reset --hard origin/master
nvm use 23.3.0
rm -rf dist
yarn install --frozen-lockfile
yarn build
```

### 3. Check that the build produced output

An OpenSSL failure can leave `dist/` empty, so do not swap unless these pass:

```sh
test -s "$NEXT/dist/index.html" && test -s "$NEXT/dist/hyphyvision.js" \
  && echo "dist OK" || echo "dist MISSING: stop here"
```

### 4. Smoke-test the staging build on a spare port

```sh
cd "$NEXT"
PORT=8001 nvm exec 17.9.1 node server.js &
SMOKE_PID=$!
sleep 2
curl -fsS -o /dev/null -w '%{http_code} /\n' http://localhost:8001/
curl -fsS -o /dev/null -w '%{http_code} deep link\n' \
  'http://localhost:8001/fel?json=https://example.org/results.FEL.json'
kill "$SMOKE_PID"
```

Run the smoke server on the serve Node (v17.9.1), not the build Node that
step 2 selected, so that it exercises the same runtime as pm2. `nvm exec`
runs as a child of the backgrounded job; if `kill` leaves the server running,
stop it with `pkill -f 'node server.js'` from the `$NEXT` directory or by its
port (`fuser -k 8001/tcp`).

Both should print `200`. The `?json=` page is rendered client-side, so curl
only proves the route serves `index.html`. Open a real deep link in a browser
too (see step 6).

### 5. Swap

```sh
git -C "$LIVE" fetch origin
git -C "$LIVE" reset --hard origin/master
(cd "$LIVE" && nvm exec 17.9.1 yarn install --frozen-lockfile --production --ignore-engines)
rsync -a --delete "$NEXT/dist/" "$LIVE/dist/"
pm2 restart hyphy-vision
```

The `yarn install` keeps the live `node_modules` in step with the new
commit, so `server.js` does not run against a stale Express if a release
changes the server's dependencies. It runs under the serve Node because
native modules, if any are ever added, must match the Node that pm2 uses.
`--production` skips the build toolchain, which the live checkout does not
need. `--ignore-engines` is needed because some packages in `yarn.lock`
(for example `jest@29`) declare engines that exclude Node 17, and Yarn 1
checks engines for dev dependencies even with `--production`.

Reset the live checkout to the same commit you built in `$NEXT`. If `master`
moved between steps 2 and 5, reset to `git -C "$NEXT" rev-parse HEAD` instead.

`--delete` removes stale hashed assets from the live `dist/`. The last deploy
used rsync; whether it passed `--delete` was not recorded.

### 6. Smoke-test production

```sh
curl -fsS -o /dev/null -w '%{http_code}\n' https://vision.hyphy.org/
curl -fsS -o /dev/null -w '%{http_code}\n' \
  'https://vision.hyphy.org/fel?json=https://example.org/results.FEL.json'
pm2 status hyphy-vision
```

Then open a `?json=` deep link to a real, reachable results file in a browser
and confirm that the results render. Use one of the method routes
(`/absrel`, `/busted`, `/fel`, `/meme`, `/relax`, ...); see
`src/jsx/app.jsx` for the full list.

**TODO (maintainer):** record a stable public results JSON URL to use as the
canonical deep-link smoke test.

## Rollback

```sh
git -C "$LIVE" reset --hard "$(cat "$BACKUP/HEAD.sha")"
rsync -a --delete "$BACKUP/dist/" "$LIVE/dist/"
pm2 restart hyphy-vision
```

If the backup had local edits, reapply them with
`git -C "$LIVE" apply "$BACKUP/uncommitted.diff"`. Then repeat the step 6
smoke checks.

## Release checklist

The git history records releases as a single commit titled `vX.Y.Z` that only
bumps `version` in `package.json`, plus a matching annotated tag `vX.Y.Z`
pushed to `origin` (latest: `v2.15.10`). `yarn version` / `npm version`
produce exactly that. `CONTRIBUTING.md` asks for Semantic Versioning and
publishing releases to npm.

1. CI ("Node.js CI", `.github/workflows/nodejs.yml`) is green on `master`.
2. Bump the version and tag it, then push both:
   ```sh
   VERSION=2.15.11   # the new version
   yarn version --new-version "$VERSION"
   git push origin master --follow-tags
   ```
3. Deploy vision.hyphy.org using the procedure above. Record the deployed
   commit SHA. `git -C /home/node/hyphy-vision log -1 --oneline` should match
   the tag.
4. **TODO (maintainer):** decide whether every release also gets an npm
   publish (the registry has `hyphy-vision@2.15.10`; the library bundle is
   built with `yarn build:library`, see `CONTRIBUTING.md`) and a GitHub
   Release (the latest GitHub Release is `2.14.0` from December 2023, older
   than the latest tag).
