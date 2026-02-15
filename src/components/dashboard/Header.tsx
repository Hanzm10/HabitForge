import { useLocation, Link } from 'react-router-dom';
import { UserButton } from '@clerk/clerk-react';
import { Menu, ChevronRight } from 'lucide-react';

interface HeaderProps {
    onMenuClick: () => void;
}

export const Header = ({ onMenuClick }: HeaderProps) => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);

    // Filter out 'dashboard' if it's the first item, as we usually treat it as root for this layout
    // actually, let's keep it simple for now and just capitalize

    return (
        <header className="flex items-center justify-between h-16 px-6 border-b border-border-subtle bg-bg-secondary">
            <div className="flex items-center">
                <button
                    data-testid="open-sidebar-btn"
                    onClick={onMenuClick}
                    className="mr-4 md:hidden text-text-secondary hover:text-text-primary focus:outline-none"
                    aria-label="Open menu"
                >
                    <Menu size={24} />
                </button>

                <nav className="flex items-center text-sm font-medium text-text-secondary">
                    {pathnames.length > 0 ? (
                        pathnames.map((value, index) => {
                            const to = `/${pathnames.slice(0, index + 1).join('/')}`;
                            const isLast = index === pathnames.length - 1;
                            const name = value.charAt(0).toUpperCase() + value.slice(1);

                            return (
                                <div key={to} className="flex items-center">
                                    {index > 0 && <ChevronRight size={16} className="mx-2 text-text-muted" />}
                                    {isLast ? (
                                        <span className="text-text-primary font-semibold">{name}</span>
                                    ) : (
                                        <Link to={to} className="hover:text-text-primary transition-colors">
                                            {name}
                                        </Link>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <span className="text-text-primary font-semibold">Dashboard</span>
                    )}
                </nav>
            </div>

            <div className="flex items-center space-x-4">
                <UserButton afterSignOutUrl="/" />
            </div>
        </header>
    );
};
