import { Tldraw, type TLAssetStore } from 'tldraw'
import { useSync } from '@tldraw/sync'

// Set VITE_SYNC_URI (e.g. wss://sync.example.com) to collaborate across devices.
// Unset: falls back to local-only IndexedDB persistence.
const SYNC_URI = import.meta.env.VITE_SYNC_URI as string | undefined

// Allowed rooms. Edit this list to add/remove boards.
const ROOMS = ['general', 'system', 'design']

// Room comes from the URL path /r/<roomId>. Only rooms in ROOMS are opened;
// anything else shows the picker.
const roomMatch = window.location.pathname.match(/^\/r\/([^/]+)$/)
const requested = roomMatch ? decodeURIComponent(roomMatch[1]) : null
const ROOM = requested && ROOMS.includes(requested) ? requested : null

function App() {
	return (
		<div style={{ position: 'fixed', inset: 0 }}>
			{!SYNC_URI ? (
				<Tldraw persistenceKey="hndr-draw" />
			) : ROOM ? (
				<SyncedCanvas room={ROOM} />
			) : (
				<RoomPicker />
			)}
		</div>
	)
}

function SyncedCanvas({ room }: { room: string }) {
	const store = useSync({ uri: `${SYNC_URI}/connect/${room}`, assets })
	return <Tldraw store={store} />
}

function RoomPicker() {
	return (
		<div
			style={{
				height: '100%',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				gap: 16,
				fontFamily: 'system-ui, sans-serif',
			}}
		>
			<h1 style={{ margin: 0, fontSize: 20 }}>Pick a board</h1>
			<div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
				{ROOMS.map((room) => (
					<a
						key={room}
						href={`/r/${room}`}
						style={{
							padding: '10px 24px',
							border: '1px solid #ccc',
							borderRadius: 8,
							textDecoration: 'none',
							color: 'inherit',
							textAlign: 'center',
						}}
					>
						{room}
					</a>
				))}
			</div>
		</div>
	)
}

const ASSET_BASE = (SYNC_URI ?? '').replace(/^ws/, 'http')
const assets: TLAssetStore = {
	async upload(_asset, file) {
		const id = `${Date.now()}-${Math.random().toString(36).slice(2)}-${file.name}`.replace(
			/[^a-zA-Z0-9._-]/g,
			'',
		)
		const src = `${ASSET_BASE}/uploads/${id}`
		await fetch(src, { method: 'PUT', body: file })
		return { src }
	},
	resolve: (asset) => asset.props.src,
}

export default App
