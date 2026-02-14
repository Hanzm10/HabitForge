import { useAuth, RedirectToSignIn } from '@clerk/clerk-react'

interface ProtectedRouteProps {
    children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { isLoaded, isSignedIn } = useAuth()

    if (!isLoaded) {
        return null // Or a loading spinner
    }

    if (!isSignedIn) {
        return <RedirectToSignIn />
    }

    return <>{children}</>
}
