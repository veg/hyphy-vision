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
| TLS + reverse proxy | nginx on `junglegym`, site config `/etc/nginx/conf.d/hyphy.conf` | Proxies `vision.hyphy.org` to `datamonkey-main:8000` and adds `Access-Control-Allow-Origin: *`. TLS certificate: `/etc/letsencrypt/live/hyphy.org/` (includes `vision.hyphy.org`; renewal config `/etc/letsencrypt/renewal/hyphy.org.conf`). |
| App server | datamonkey host (`datamonkey-main`) | `node server.js` (Express, serves the static `dist/` folder, falls back to `dist/index.html` for every other path). Listens on `PORT`, default `8000`. |
| Process manager | pm2 app **`hyphy-vision`**, run as the **`node`** user | |
| Live checkout | `/home/node/hyphy-vision` | `dist/` is git-ignored, so it is a build artifact that lives only on the host. |
| Staging clone | `/home/node/hyphy-vision-next` | Separate clone used to build and smoke-test before swapping. |

**TODO (maintainer):** the exact pm2 start definition (ecosystem file or
`pm2 start` command line) for `hyphy-vision`.

## Node versions

| Purpose | Node | How it is selected |
| --- | --- | --- |
| Building (`webpack`) | 22 | `.nvmrc`; run `nvm use` in the checkout (v22.11.0 is installed under nvm). |
| Serving (`pm2` → `server.js`) | 22 (target); currently 17.9.1 | pm2 `interpreter`, see below. |

`package.json` `engines` allows `>=16.20.2`, and CI builds on 18, 22 and 24.
Use **Yarn 1 (classic)**; `yarn.lock` is a v1 lockfile and Yarn 2+ refuses
it.

### How pm2 picks the Node for `hyphy-vision`

The `hyphy-vision` pm2 app has `interpreter: node` (a bare name, not a path),
so it runs whatever Node the `node` user's **nvm default alias** points to:
v17.9.1 (EOL) as of 2026-10-06.

**Do not change the nvm default alias.** Several other pm2 apps under the
`node` user also use a bare `interpreter: node` (among them hivtrace-viz,
webhooks, phylotree, blog and mutation-dashboard). Changing the default would
silently move all of them to a new Node on their next restart. To move
`hyphy-vision` to Node 22, set an absolute interpreter path for that app only:

```sh
pm2 delete hyphy-vision
cd /home/node/hyphy-vision
pm2 start server.js --name hyphy-vision \
  --interpreter "$HOME/.nvm/versions/node/v22.11.0/bin/node"
pm2 save
pm2 describe hyphy-vision | grep -iE 'interpreter|node.js version'
```

Before doing this, compare the pm2 app's environment and options with the
TODO above, so the re-created app matches the old one. To roll back, repeat
with the v17.9.1 path. After the switch, update the table above.

## Build command

```sh
yarn install --frozen-lockfile
yarn build
```

The build needs no `NODE_OPTIONS` flags on any supported Node (#896). Do not
edit the `build` script on the host; the live checkout once carried such an
uncommitted edit, and it broke the build.

On a successful build, webpack removes files in `dist/` that the build did
not emit, so stale hashed assets do not pile up (#898). A failed build leaves
`dist/` untouched. Files are still replaced in place while the build emits,
so never build inside the live checkout; build in the staging clone and swap
(below).

## Deploy procedure

Run everything as the `node` user in a login shell, so nvm is loaded. Set the
shell variables once:

```sh
LIVE=/home/node/hyphy-vision
NEXT=/home/node/hyphy-vision-next
BACKUP=/home/node/hyphy-vision-backups/$(date +%Y%m%d-%H%M%S)
```

The 2026-10-06 deploy predates this layout. Its backups are in the `node`
user's home: `~/hv-prev-sha` (previous HEAD `585f6a9`),
`~/hv-local-drift.patch` and `~/hv-dist-backup`.

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
nvm use
yarn install --frozen-lockfile
yarn build
```

### 3. Check that the build produced output

Do not swap unless these pass; `rsync --delete` from an empty `dist/` would wipe the live site:

```sh
test -s "$NEXT/dist/index.html" && test -s "$NEXT/dist/hyphyvision.js" \
  && echo "dist OK" || echo "dist MISSING: stop here"
```

### 4. Smoke-test the staging build on a spare port

```sh
cd "$NEXT"
PORT=8001 node server.js &
SMOKE_PID=$!
sleep 2
curl -fsS -o /dev/null -w '%{http_code} /\n' http://localhost:8001/
curl -fsS -o /dev/null -w '%{http_code} deep link\n' \
  'http://localhost:8001/fel?json=https://example.org/results.FEL.json'
kill "$SMOKE_PID"
```

Both should print `200`. The `?json=` page is rendered client-side, so curl
only proves the route serves `index.html`. Open a real deep link in a browser
too (see step 6).

### 5. Swap

```sh
git -C "$LIVE" fetch origin
git -C "$LIVE" reset --hard origin/master
(cd "$LIVE" && nvm use && yarn install --frozen-lockfile --production)
rsync -a --delete "$NEXT/dist/" "$LIVE/dist/"
pm2 restart hyphy-vision
```

The `yarn install` keeps the live `node_modules` in step with the new
commit, so `server.js` does not run against a stale Express if a release
changes the server's dependencies. `--production` skips the build toolchain,
which the live checkout does not need.

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
