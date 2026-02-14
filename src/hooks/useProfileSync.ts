import { useUser, useAuth } from '@clerk/clerk-react'
import { useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

export function useProfileSync() {
    const { user, isLoaded, isSignedIn } = useUser()
    const { getToken } = useAuth()

    useEffect(() => {
        const syncProfile = async () => {
            if (!isLoaded || !isSignedIn || !user) return

            try {
                const token = await getToken({ template: 'supabase' })
                if (!token) return

                // Create a single-use client with the user's token for RLS
                const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
                const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

                const client = createClient(supabaseUrl, supabaseAnonKey, {
                    global: { headers: { Authorization: `Bearer ${token}` } }
                })

                const { error } = await client.from('profiles').upsert(
                    {
                        clerk_user_id: user.id,
                        email: user.primaryEmailAddress?.emailAddress ?? '',
                        full_name: user.fullName,
                        avatar_url: user.imageUrl,
                        updated_at: new Date().toISOString(),
                    },
                    { onConflict: 'clerk_user_id' } // Use clerk_user_id to identify row
                )

                if (error) {
                    console.error('Error syncing profile:', error)
                }
            } catch (err) {
                console.error('Profile sync failed:', err)
            }
        }

        syncProfile()
    }, [user, isLoaded, isSignedIn, getToken])
}
