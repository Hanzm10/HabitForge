import { SignIn } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'
import { PageTransition } from '../../components/ui/PageTransition'

export default function SignInPage() {
    return (
        <PageTransition className="min-h-screen bg-bg-primary flex flex-col items-center justify-center p-4">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-text-primary font-satoshi mb-2">
                    HabitForge
                </h1>
                <p className="text-text-secondary">Sign in to continue your streak.</p>
            </div>

            <SignIn
                routing="path"
                path="/sign-in"
                signUpUrl="/sign-up"
                forceRedirectUrl="/dashboard"
                appearance={{
                    elements: {
                        rootBox: "mx-auto",
                        card: "bg-bg-card border border-border-subtle shadow-xl",
                        headerTitle: "text-text-primary",
                        headerSubtitle: "text-text-primary",
                        dividerText: "text-text-secondary w-full text-center border-b border-border-subtle leading-[0.1em] mt-5 mb-5",
                        dividerLine: "hidden",
                        socialButtonsBlockButton: "bg-bg-secondary text-text-primary border-border-subtle hover:bg-bg-primary",
                        formFieldLabel: "text-text-primary",
                        formFieldHintText: "text-text-secondary",
                        formFieldInput: "bg-bg-secondary border-border-subtle text-text-primary placeholder:text-text-secondary",
                        footerActionLink: "text-accent-primary hover:text-accent-hover",
                        formButtonPrimary: "bg-accent-primary hover:bg-accent-hover text-white",
                    }
                }}
            />

            <div className="mt-8">
                <Link to="/" className="text-text-secondary hover:text-text-primary transition-colors text-sm">
                    ← Back to HabitForge
                </Link>
            </div>
        </PageTransition>
    )
}
