
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, CheckCircle, Settings, X } from 'lucide-react';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
    const location = useLocation();

    const links = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Habits', path: '/dashboard/habits', icon: CheckCircle },
        { name: 'Settings', path: '/dashboard/settings', icon: Settings },
    ];

    return (
        <>
            <div
                data-testid="sidebar"
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-secondary border-r border-subtle transition-transform duration-300 ease-in-out transform ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    } md:translate-x-0 md:static md:inset-0`}
            >
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between h-16 px-6 border-b border-subtle">
                        <span className="text-xl font-bold text-accent-primary">HabitForge</span>
                        <button onClick={onClose} className="md:hidden text-text-muted hover:text-text-primary">
                            <X size={24} />
                            <span className="sr-only">Close menu</span>
                        </button>
                    </div>

                    <nav className="flex-1 px-4 py-6 space-y-1">
                        {links.map((link) => {
                            const Icon = link.icon;
                            // Exact match for dashboard root, startsWith for sub-routes
                            const isActive =
                                link.path === '/dashboard'
                                    ? location.pathname === '/dashboard'
                                    : location.pathname.startsWith(link.path);

                            return (
                                <NavLink
                                    key={link.path}
                                    to={link.path}
                                    onClick={onClose}
                                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${isActive
                                        ? 'bg-accent-active text-white'
                                        : 'text-text-secondary hover:bg-white/5 hover:text-text-primary'
                                        }`}
                                >
                                    <Icon size={20} className="mr-3" />
                                    {link.name}
                                </NavLink>
                            );
                        })}
                    </nav>

                </div>
            </div>

            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 md:hidden"
                    onClick={onClose}
                />
            )}
        </>
    );
};
