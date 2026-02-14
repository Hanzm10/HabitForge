import { UserButton, useUser } from '@clerk/clerk-react'
import { Link, useLocation } from 'react-router-dom'
import { useProfileSync } from '../hooks/useProfileSync'
import { Home, LayoutDashboard, BarChart3, Settings, LogOut } from 'lucide-react'

interface DashboardLayoutProps {
    children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    // Sync profile to Supabase on mount/update
    useProfileSync()

    const { user } = useUser()
    const location = useLocation()

    const navItems = [
        { icon: LayoutDashboard, label: 'Habits', href: '/dashboard' },
        { icon: BarChart3, label: 'Analytics', href: '/dashboard/analytics' }, // Future
        { icon: Settings, label: 'Settings', href: '/dashboard/settings' },   // Future
    ]

    return (
        <div className="min-h-screen bg-bg-primary flex text-text-primary font-satoshi">
            {/* Sidebar */}
            <aside className="w-64 border-r border-border-subtle bg-bg-secondary hidden md:flex flex-col">
                <div className="p-6">
                    <Link to="/" className="text-2xl font-bold text-text-primary">
                        HabitForge
                    </Link>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.href
                        return (
                            <Link
                                key={item.href}
                                to={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                        ? 'bg-accent-primary text-white'
                                        : 'text-text-secondary hover:bg-bg-card hover:text-text-primary'
                                    }`}
                            >
                                <item.icon size={20} />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-border-subtle">
                    <div className="flex items-center gap-3 px-4 py-3">
                        <UserButton />
                        <div className="text-sm">
                            <p className="font-medium">{user?.fullName}</p>
                            <p className="text-text-muted text-xs truncate w-32">{user?.primaryEmailAddress?.emailAddress}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Mobile Header */}
                <header className="md:hidden h-16 border-b border-border-subtle bg-bg-secondary flex items-center justify-between px-4">
                    <Link to="/" className="font-bold text-lg">HF</Link>
                    <UserButton />
                </header>

                <main className="flex-1 p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    )
}
