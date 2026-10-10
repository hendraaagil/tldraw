import { TLSocketRoom } from '@tldraw/sync-core'
import { mkdirSync } from 'node:fs'
import { join } from 'node:path'

// tldraw sync server for Bun. One WebSocket room per `:roomId`, snapshots and
// uploaded assets persisted to disk under DATA_DIR. Run: `bun run server`.

const PORT = Number(process.env.PORT ?? 5858)
const DATA_DIR = process.env.DATA_DIR ?? join(import.meta.dir, '.data')
const ROOMS_DIR = join(DATA_DIR, 'rooms')
const ASSETS_DIR = join(DATA_DIR, 'assets')
mkdirSync(ROOMS_DIR, { recursive: true })
mkdirSync(ASSETS_DIR, { recursive: true })

type RoomState = { room: TLSocketRoom; saveTimer: ReturnType<typeof setTimeout> | null }
const rooms = new Map<string, RoomState>()
const loading = new Map<string, Promise<RoomState>>()

const roomPath = (id: string) => join(ROOMS_DIR, `${encodeURIComponent(id)}.json`)

function scheduleSave(id: string, state: RoomState) {
	if (state.saveTimer) return // ponytail: fixed 2s debounce; tune if write volume high
	state.saveTimer = setTimeout(async () => {
		state.saveTimer = null
		await Bun.write(roomPath(id), JSON.stringify(state.room.getCurrentSnapshot()))
	}, 2000)
}

function getRoom(id: string): Promise<RoomState> {
	const existing = rooms.get(id)
	if (existing) return Promise.resolve(existing)
	const pending = loading.get(id)
	if (pending) return pending
	const p = (async () => {
		const file = Bun.file(roomPath(id))
		const initialSnapshot = (await file.exists()) ? await file.json() : undefined
		const state: RoomState = { room: undefined as unknown as TLSocketRoom, saveTimer: null }
		state.room = new TLSocketRoom({
			initialSnapshot,
			onDataChange: () => scheduleSave(id, state),
		})
		rooms.set(id, state)
		loading.delete(id)
		return state
	})()
	loading.set(id, p)
	return p
}

const cors = (res: Response) => {
	res.headers.set('Access-Control-Allow-Origin', '*')
	res.headers.set('Access-Control-Allow-Methods', 'GET,PUT,OPTIONS')
	res.headers.set('Access-Control-Allow-Headers', '*')
	return res
}

Bun.serve<{ roomId: string; sessionId: string }>({
	port: PORT,
	idleTimeout: 60,
	async fetch(req, server) {
		const url = new URL(req.url)
		const { pathname } = url

		if (pathname === '/health') return new Response('ok')

		const connect = pathname.match(/^\/connect\/(.+)$/)
		if (connect) {
			const roomId = decodeURIComponent(connect[1])
			const sessionId = url.searchParams.get('sessionId')
			if (!sessionId) return new Response('missing sessionId', { status: 400 })
			await getRoom(roomId) // ensure loaded before the socket opens
			const ok = server.upgrade(req, { data: { roomId, sessionId } })
			return ok ? undefined : new Response('upgrade failed', { status: 500 })
		}

		const asset = pathname.match(/^\/uploads\/(.+)$/)
		if (asset) {
			const id = asset[1].replace(/[^a-zA-Z0-9._-]/g, '')
			const file = Bun.file(join(ASSETS_DIR, id))
			if (req.method === 'OPTIONS') return cors(new Response(null, { status: 204 }))
			if (req.method === 'PUT') {
				await Bun.write(file, req)
				return cors(new Response(null, { status: 201 }))
			}
			if (req.method === 'GET') {
				if (!(await file.exists())) return new Response('not found', { status: 404 })
				return cors(new Response(file))
			}
		}

		return new Response('tldraw sync server')
	},
	websocket: {
		async open(ws) {
			const { roomId, sessionId } = ws.data
			const { room } = await getRoom(roomId)
			room.handleSocketConnect({ sessionId, socket: ws })
		},
		message(ws, message) {
			rooms.get(ws.data.roomId)?.room.handleSocketMessage(ws.data.sessionId, message)
		},
		close(ws) {
			rooms.get(ws.data.roomId)?.room.handleSocketClose(ws.data.sessionId)
		},
	},
})

console.log(`tldraw sync server on :${PORT} (data: ${DATA_DIR})`)
