import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 text-white">
      <h1 className="text-2xl font-bold mb-4">Finance App (Simplified)</h1>
      <p>This is a minimal version to make the project build first.</p>
      <div className="mt-6">
        <button
          onClick={() => setCount(count + 1)}
          className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700"
        >
          Clicked {count} times
        </button>
      </div>
    </div>
  )
}

export default App
