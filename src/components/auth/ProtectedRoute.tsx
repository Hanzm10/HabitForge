import { useAuth, RedirectToSignIn } from '@clerk/clerk-react'
import { useProfileSync } from '../../hooks/useProfileSync'
import { useCurrentProfile } from '../../hooks/useCurrentProfile'
import { AlertCircle } from 'lucide-react'

interface ProtectedRouteProps {
    children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { isLoaded, isSignedIn } = useAuth()
    const { profile, loading: profileLoading } = useCurrentProfile()

    // Sync profile to Supabase on mount/auth change
    useProfileSync()

    if (!isLoaded || (isSignedIn && profileLoading)) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (!isSignedIn) {
        return <RedirectToSignIn />
    }

    if (profile?.is_suspended) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
                <AlertCircle className="h-16 w-16 text-destructive mb-4" />
                <h1 className="text-2xl font-bold text-foreground mb-2">Account Suspended</h1>
                <p className="text-muted-foreground max-w-md">
                    Your account has been suspended by an administrator. Please contact support for more information.
                </p>
                <button
                    onClick={() => window.location.href = '/'}
                    className="mt-6 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                >
                    Return to Home
                </button>
            </div>
        )
    }

    return <>{children}</>
}
