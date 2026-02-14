import { SignUp } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'

export default function SignUpPage() {
    return (
        <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center p-4">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-text-primary font-satoshi mb-2">
                    HabitForge
                </h1>
                <p className="text-text-secondary">Join HabitForge today.</p>
            </div>

            <SignUp
                routing="path"
                path="/sign-up"
                signInUrl="/sign-in"
                forceRedirectUrl="/dashboard"
                appearance={{
                    elements: {
                        rootBox: "mx-auto",
                        card: "bg-bg-card border border-border-subtle shadow-xl",
                        headerTitle: "text-text-primary",
                        headerSubtitle: "text-text-secondary",
                        socialButtonsBlockButton: "bg-bg-secondary text-text-primary border-border-subtle hover:bg-bg-primary",
                        formFieldLabel: "text-text-secondary",
                        formFieldInput: "bg-bg-secondary border-border-subtle text-text-primary",
                        footerActionLink: "text-accent-primary hover:text-accent-hover",
                        formButtonPrimary: "bg-accent-primary hover:bg-accent-hover text-white",
                    }
                }}
            />

            <div className="mt-8">
                <Link to="/" className="text-text-muted hover:text-text-primary transition-colors text-sm">
                    ← Back to HabitForge
                </Link>
            </div>
        </div>
    )
}
