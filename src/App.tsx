import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'

function Dashboard() {
  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center">
      <h1 className="text-3xl font-bold text-text-primary font-satoshi">Dashboard</h1>
    </div>
  )
}

function Admin() {
  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center">
      <h1 className="text-3xl font-bold text-text-primary font-satoshi">Admin</h1>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<Admin />} />
        {/* Clerk sign-in/sign-up routes will be added in Phase 4 */}
      </Routes>
    </BrowserRouter>
  )
}

export default App
