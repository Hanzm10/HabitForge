import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useProfileSync } from '../hooks/useProfileSync'

// Mock Clerk components
const mockUseUser = vi.fn()
const mockUseAuth = vi.fn()
vi.mock('@clerk/clerk-react', () => ({
    useUser: () => mockUseUser(),
    useAuth: () => mockUseAuth(),
}))

// Mock Supabase createClient
const mockUpsert = vi.fn(() => ({ error: null }))
const mockFrom = vi.fn(() => ({ upsert: mockUpsert }))
const mockCreateClient = vi.fn(() => ({ from: mockFrom }))

vi.mock('@supabase/supabase-js', () => ({
    createClient: (...args: any[]) => mockCreateClient(...args),
}))

describe('useProfileSync', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('syncs user profile when user is loaded and signed in', async () => {
        const mockUser = {
            id: 'user_123',
            primaryEmailAddress: { emailAddress: 'test@example.com' },
            fullName: 'Test User',
            imageUrl: 'https://example.com/avatar.png',
        }

        mockUseUser.mockReturnValue({ isLoaded: true, isSignedIn: true, user: mockUser })
        mockUseAuth.mockReturnValue({ getToken: vi.fn().mockResolvedValue('mock_token') })

        renderHook(() => useProfileSync())

        await waitFor(() => {
            expect(mockCreateClient).toHaveBeenCalled()
            expect(mockFrom).toHaveBeenCalledWith('profiles')
        })
    })

    it('does not sync if user is not loaded', async () => {
        mockUseUser.mockReturnValue({ isLoaded: false, isSignedIn: undefined })
        renderHook(() => useProfileSync())

        expect(mockCreateClient).not.toHaveBeenCalled()
    })

    it('does not sync if user is not signed in', async () => {
        mockUseUser.mockReturnValue({ isLoaded: true, isSignedIn: false })
        renderHook(() => useProfileSync())

        expect(mockCreateClient).not.toHaveBeenCalled()
    })
})
