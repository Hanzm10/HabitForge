
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import UserTable from './UserTable';
import { useUserManagement } from '../../hooks/useUserManagement';

// Mock useUserManagement
vi.mock('../../hooks/useUserManagement', () => ({
    useUserManagement: vi.fn(),
}));

describe('UserTable', () => {
    const mockUpdateUserRole = vi.fn();
    const mockToggleUserSuspension = vi.fn();
    const mockRefetch = vi.fn();

    const mockUsers = [
        {
            id: 'user-1',
            email: 'user1@example.com',
            full_name: 'User One',
            role: 'user',
            is_suspended: false,
            created_at: '2023-01-01T00:00:00Z',
        },
        {
            id: 'user-2',
            email: 'user2@example.com',
            full_name: 'User Two',
            role: 'admin',
            is_suspended: true,
            created_at: '2023-01-02T00:00:00Z',
        },
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        (useUserManagement as any).mockReturnValue({
            users: mockUsers,
            loading: false,
            error: null,
            updateUserRole: mockUpdateUserRole,
            toggleUserSuspension: mockToggleUserSuspension,
            refetch: mockRefetch,
        });
    });

    it('renders loading state', () => {
        (useUserManagement as any).mockReturnValue({
            users: [],
            loading: true,
            error: null,
        });
        render(<UserTable />);
        expect(screen.getByText(/loading users/i)).toBeInTheDocument();
    });

    it('renders error state', () => {
        (useUserManagement as any).mockReturnValue({
            users: [],
            loading: false,
            error: 'Failed to fetch',
        });
        render(<UserTable />);
        expect(screen.getByText(/failed to fetch/i)).toBeInTheDocument();
    });

    it('renders user list', () => {
        render(<UserTable />);
        expect(screen.getByText('User One')).toBeInTheDocument();
        expect(screen.getByText('user1@example.com')).toBeInTheDocument();
        expect(screen.getByText('User Two')).toBeInTheDocument();
        expect(screen.getByText('user2@example.com')).toBeInTheDocument();
    });

    it('displays user roles correctly', () => {
        render(<UserTable />);
        // Check for Select values or badges
        // Since Shadcn Select might be hard to test by text directly without opening, 
        // let's assume we look for the select triggers
        const roleTriggers = screen.getAllByRole('combobox');
        expect(roleTriggers).toHaveLength(2);
    });

    it('displays suspension status correctly', () => {
        render(<UserTable />);
        expect(screen.getByText('Active')).toBeInTheDocument();
        expect(screen.getByText('Suspended')).toBeInTheDocument();
    });

    it('calls toggleUserSuspension when suspend button is clicked', async () => {
        render(<UserTable />);

        // Find the suspend button for the first user (who is active)
        // Find the suspend button for the first user (who is active)
        // Actually simpler to just render buttons for test first if we don't have DropdownMenu structure yet.
        // But we probably use a DropdownMenu for actions.

        // Let's assume a "Suspend" button is visible or accessible via menu.
        // For now, let's look for a button that says "Suspend" if visible, or open menu first.

        // To simplify, let's assume we have a button/icon to open menu
        const actionTriggers = screen.getAllByRole('button', { name: /open menu/i });
        fireEvent.click(actionTriggers[0]);

        const suspendButton = screen.getByText('Suspend User');
        fireEvent.click(suspendButton);

        expect(mockToggleUserSuspension).toHaveBeenCalledWith('user-1', true);
    });

    it('calls toggleUserSuspension when unsuspend button is clicked', async () => {
        render(<UserTable />);

        const actionTriggers = screen.getAllByRole('button', { name: /open menu/i });
        fireEvent.click(actionTriggers[1]); // Second user is suspended

        const unsuspendButton = screen.getByText('Unsuspend User');
        fireEvent.click(unsuspendButton);

        expect(mockToggleUserSuspension).toHaveBeenCalledWith('user-2', false);
    });

    it('calls updateUserRole when role is changed', async () => {
        render(<UserTable />);

        // Shadcn Select interaction
        const roleTriggers = screen.getAllByRole('combobox');
        fireEvent.click(roleTriggers[0]); // Click first user's role select

        const adminOption = await screen.findByText('Admin'); // Option in the list
        fireEvent.click(adminOption);

        expect(mockUpdateUserRole).toHaveBeenCalledWith('user-1', 'admin');
    });
});
