import { Routes, Route, Navigate } from 'react-router-dom'
import PosViewExperiment from './components/PosViewExperiment'
import GamePage from './pages/GamePage'
import AdminPage from './pages/AdminPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<PosViewExperiment />} />
      <Route path="/tutorial" element={<GamePage />} />
      <Route path="/game" element={<Navigate to="/" replace />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  )
}

export default App
