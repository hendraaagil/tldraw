import { Tldraw, type TLAssetStore } from 'tldraw'
import { useSync } from '@tldraw/sync'

// Set VITE_SYNC_URI (e.g. wss://sync.example.com) to collaborate across devices.
// Unset: falls back to local-only IndexedDB persistence.
const SYNC_URI = import.meta.env.VITE_SYNC_URI as string | undefined
const ROOM = import.meta.env.VITE_SYNC_ROOM || 'default'

function App() {
	return (
		<div style={{ position: 'fixed', inset: 0 }}>
			{SYNC_URI ? <SyncedCanvas /> : <Tldraw persistenceKey="hndr-draw" />}
		</div>
	)
}

function SyncedCanvas() {
	const store = useSync({ uri: `${SYNC_URI}/connect/${ROOM}`, assets })
	return <Tldraw store={store} />
}

const ASSET_BASE = (SYNC_URI ?? '').replace(/^ws/, 'http')
const assets: TLAssetStore = {
	async upload(_asset, file) {
		const id = `${crypto.randomUUID()}-${file.name}`.replace(/[^a-zA-Z0-9._-]/g, '')
		const src = `${ASSET_BASE}/uploads/${id}`
		await fetch(src, { method: 'PUT', body: file })
		return { src }
	},
	resolve: (asset) => asset.props.src,
}

export default App
