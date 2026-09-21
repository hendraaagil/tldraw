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

To expose it publicly through a [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/), copy `.env.sample` to `.env` next to `compose.yml` and fill in your tunnel token:

```sh
cp .env.sample .env
```

Point the tunnel's public hostname at `http://app:80` — `cloudflared` reaches the app over the compose network, so no port needs to be opened on your router.

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
