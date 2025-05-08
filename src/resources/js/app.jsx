import './bootstrap'
import '../css/app.css'

import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import RaftMeeting from './components/RaftMeeting'
import DraftRoom from './components/DraftRoom'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RaftMeeting />} />
        <Route path="/draft/:roomId" element={<DraftRoom />} />
      </Routes>
    </BrowserRouter>
  )
}

const container = document.getElementById('app')
const root = createRoot(container)
root.render(<App />)
