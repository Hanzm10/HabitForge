import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'motion/react'
import LandingPage from './pages/LandingPage'
import SignInPage from './pages/auth/SignInPage'
import SignUpPage from './pages/auth/SignUpPage'
import ProtectedRoute from './components/auth/ProtectedRoute'
import AdminRoute from './components/auth/AdminRoute'
import { DashboardLayout } from './layouts/DashboardLayout'
import { CreateHabitForm } from './components/dashboard/CreateHabitForm'
import { HabitList } from './components/dashboard/HabitList'
import { EditHabitForm } from './components/dashboard/EditHabitForm'
import AdminDashboard from './pages/admin/AdminDashboard'
import SettingsPage from './pages/dashboard/SettingsPage'


function DashboardRoutes() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <Routes>
          <Route index element={<HabitList showOverview={true} />} />
          <Route path="habits" element={<HabitList showOverview={false} />} />
          <Route path="habits/new" element={<CreateHabitForm />} />
          <Route path="habits/:habitId/edit" element={<EditHabitForm />} />
          <Route path="settings" element={<SettingsPage />} />
        </Routes>
      </DashboardLayout>
    </ProtectedRoute>
  )
}

export function AppRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname.split('/')[1] || '/'}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/sign-in/*" element={<SignInPage />} />
        <Route path="/sign-up/*" element={<SignUpPage />} />

        <Route path="/dashboard/*" element={<DashboardRoutes />} />

        <Route
          path="/admin/*"
          element={
            <AdminRoute>
              <DashboardLayout>
                <AdminDashboard />
              </DashboardLayout>
            </AdminRoute>
          }
        />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
