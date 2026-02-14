import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import SignInPage from './pages/auth/SignInPage'
import SignUpPage from './pages/auth/SignUpPage'
import ProtectedRoute from './components/auth/ProtectedRoute'
import AdminRoute from './components/auth/AdminRoute'
import DashboardLayout from './layouts/DashboardLayout'

function Dashboard() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-text-primary font-satoshi mb-4">Dashboard</h1>
        <p className="text-text-secondary">Welcome to your habit tracking dashboard.</p>
        <p className="text-text-muted mt-2">Habit tracking features coming in Phase 5.</p>
      </div>
    </div>
  )
}

function Admin() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-text-primary font-satoshi mb-4">Admin Console</h1>
        <p className="text-text-secondary">User analytics and management.</p>
        <p className="text-text-muted mt-2">Analytics features coming in Phase 6.</p>
      </div>
    </div>
  )
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/sign-in/*" element={<SignInPage />} />
      <Route path="/sign-up/*" element={<SignUpPage />} />

      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/*"
        element={
          <AdminRoute>
            <DashboardLayout>
              <Admin />
            </DashboardLayout>
          </AdminRoute>
        }
      />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
