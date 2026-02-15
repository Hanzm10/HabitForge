import { Link } from 'react-router-dom'
import { Logo } from '../ui/Logo'

export function FooterSection() {
    return (
        <footer className="py-12 px-6 border-t border-border-subtle">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    {/* Logo */}
                    <Logo iconSize={20} textSize="text-lg" />

                    {/* Links */}
                    <div className="flex items-center gap-8">
                        <Link
                            to="/privacy"
                            className="text-text-muted hover:text-text-secondary text-sm transition-colors duration-200"
                        >
                            Privacy
                        </Link>
                        <Link
                            to="/terms"
                            className="text-text-muted hover:text-text-secondary text-sm transition-colors duration-200"
                        >
                            Terms
                        </Link>
                        <Link
                            to="/sign-in"
                            className="text-text-muted hover:text-text-secondary text-sm transition-colors duration-200"
                        >
                            Log In
                        </Link>
                    </div>

                    {/* Copyright */}
                    <p className="text-text-muted text-sm">
                        © {new Date().getFullYear()} HabitForge. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}
