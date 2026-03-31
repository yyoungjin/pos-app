import { Routes, Route } from 'react-router-dom'
import PosViewExperiment from './components/PosViewExperiment'
import GamePage from './pages/GamePage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<PosViewExperiment />} />
      <Route path="/tutorial" element={<GamePage />} />
    </Routes>
  )
}

export default App
