<div alt style="text-align: center; transform: scale(.5);">
	<picture>
		<source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/tldraw/tldraw/main/assets/github-hero-dark.png" />
		<img alt="tldraw" src="https://raw.githubusercontent.com/tldraw/tldraw/main/assets/github-hero-light.png" />
	</picture>
</div>

This repo contains a template you can copy for using [tldraw](https://github.com/tldraw/tldraw) with the [Vite](https://vitejs.dev/) development environment.

## Local development

This project uses [Bun](https://bun.sh/) as its package manager and runtime.

Install dependencies with `bun install`.

Run the development server with `bun run dev`.

Build with `bun run build`, then preview the build with `bun run preview`.

Open `http://localhost:5173/` in your browser to see the app.

## Docker

Build and run with Docker Compose:

```sh
docker compose up -d --build
```

The app is served by nginx on port `3002`, so it is reachable from other machines on the same network at `http://<server-ip>:3002/`.

Copy `.env.sample` to `.env` next to `compose.yml` and fill it in:

```sh
cp .env.sample .env
```

`VITE_TLDRAW_LICENSE_KEY` is a [tldraw license key](https://tldraw.dev). It is required for anything that is not localhost — without it the editor renders for five seconds and then hides itself, leaving a blank white page. Vite inlines it at build time, so it is passed into the image as a build arg and a rebuild (`docker compose up -d --build`) is needed after changing it.

`CLOUDFLARE_TUNNEL_TOKEN` exposes the app publicly through a [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/).

Point the tunnel's public hostname at `http://app:80` — `cloudflared` reaches the app over the compose network, so no port needs to be opened on your router.

## Sync (cross-device collaboration)

Without a server, the canvas persists only to the local browser (IndexedDB via
`persistenceKey`). To sync across devices, run the Bun sync server in `server/`:

```sh
bun run server        # ws://localhost:5858
```

Then build the client with `VITE_SYNC_URI` pointing at it (base URL, no trailing
slash) — `wss://<host>` in production, `ws://localhost:5858` locally. The client
connects to `${VITE_SYNC_URI}/connect/${VITE_SYNC_ROOM}` (room defaults to
`default`) and uploads image/video assets to `${VITE_SYNC_URI}/uploads/`.

The server keeps one room per `roomId`, saving snapshots and uploaded assets
under `DATA_DIR` (`server/.data` locally; in Docker, `/data` bind-mounted from
the host `SYNC_DATA_DIR`, e.g. `/mnt/data-drive/tldraw`).

Docker Compose runs it as the `sync` service on port `5858`. Add a second
Cloudflare Tunnel public hostname pointing at `http://sync:5858` and set
`VITE_SYNC_URI` to that hostname's `wss://` URL before building the `app` image.

### Deployment

Pushing to `main` (or running the **Build & Deploy** workflow manually) connects to the home server over Tailscale, writes `.env` from the repository secrets, pulls the repo into `~/apps/tldraw` and runs `docker compose up --build -d`.

Required repository secrets: `CLOUDFLARE_TUNNEL_TOKEN`, `TLDRAW_LICENSE_KEY`, `TS_OAUTH_CLIENT_ID`, `TS_OAUTH_SECRET`, `VPS_PRIVATE_KEY`. Required variables: `VPS_USER`, `VPS_HOST`, `REPO_URL`.

## License

This project is provided under the MIT license found [here](https://github.com/tldraw/vite-template/blob/main/LICENSE.md). The tldraw SDK is provided under the [tldraw license](https://github.com/tldraw/tldraw/blob/main/LICENSE.md).

## Trademarks

Copyright (c) 2024-present tldraw Inc. The tldraw name and logo are trademarks of tldraw. Please see our [trademark guidelines](https://github.com/tldraw/tldraw/blob/main/TRADEMARKS.md) for info on acceptable usage.

## Distributions

You can find tldraw on npm [here](https://www.npmjs.com/package/@tldraw/tldraw?activeTab=versions).

## Contribution

Found a bug? Please [submit an issue](https://github.com/tldraw/tldraw/issues/new).

## Community

Have questions, comments or feedback? [Join our discord](https://discord.tldraw.com/?utm_source=github&utm_medium=readme&utm_campaign=sociallink). For the latest news and release notes, visit [tldraw.dev](https://tldraw.dev).

## Contact

Find us on Twitter/X at [@tldraw](https://twitter.com/tldraw).
