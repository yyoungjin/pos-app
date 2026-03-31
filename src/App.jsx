import { Routes, Route } from 'react-router-dom'
import PosViewExperiment from './components/PosViewExperiment'
import GamePage from './pages/GamePage'
import GamePlayPage from './pages/GamePlayPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<PosViewExperiment />} />
      <Route path="/tutorial" element={<GamePage />} />
      <Route path="/game" element={<GamePlayPage />} />
    </Routes>
  )
}

export default App
