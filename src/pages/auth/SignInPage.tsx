import { SignIn } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'
import { PageTransition } from '../../components/ui/PageTransition'
import { Logo } from '../../components/ui/Logo'

export default function SignInPage() {
    return (
        <PageTransition className="min-h-screen bg-bg-primary flex flex-col items-center justify-center p-4">
            <div className="mb-8 text-center">
                <Logo className="justify-center mb-2" iconSize={32} textSize="text-3xl" />
                <p className="text-text-secondary">Sign in to continue your streak.</p>
            </div>

            <SignIn
                routing="path"
                path="/sign-in"
                signUpUrl="/sign-up"
                forceRedirectUrl="/dashboard"
                appearance={{
                    variables: {
                        colorPrimary: "#6366F1",
                    },
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
                        identityPreviewText: "text-text-primary",
                        identityPreviewEditButtonIcon: "text-text-secondary hover:text-text-primary",
                        formFieldAction: "text-accent-primary hover:text-accent-hover font-medium",
                        formFieldActionLink: "text-accent-primary hover:text-accent-hover font-medium",
                        formFieldAction__forgotPassword: "text-accent-primary hover:text-accent-hover font-medium",
                        formFieldAction__resendCode: "text-accent-primary hover:text-accent-hover font-medium",
                        formFieldInputShowPasswordIcon: "text-text-secondary hover:text-text-primary",
                        otpCodeFieldInput: "bg-bg-secondary border-border-subtle text-text-primary",
                        otpCodeFieldLabel: "text-text-primary",
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
