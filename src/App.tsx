import { Tldraw } from 'tldraw'

function App() {
	return (
		<div style={{ position: 'fixed', inset: 0 }}>
			<Tldraw persistenceKey="hndr-draw" />
		</div>
	)
}

export default App
