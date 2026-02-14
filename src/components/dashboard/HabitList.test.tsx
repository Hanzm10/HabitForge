import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { HabitList } from './HabitList.tsx';
import { MemoryRouter } from 'react-router-dom';

// Mock useHabits hook
const mockFetchHabits = vi.fn();
const mockDeleteHabit = vi.fn();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockHabitsData = vi.fn((): any[] => []);

vi.mock('../../hooks/useHabits', () => ({
    useHabits: () => ({
        habits: mockHabitsData(),
        fetchHabits: mockFetchHabits,
        deleteHabit: mockDeleteHabit,
        isLoading: false,
        error: null,
    }),
}));

const renderList = () => {
    return render(
        <MemoryRouter>
            <HabitList />
        </MemoryRouter>
    );
};

const sampleHabits = [
    {
        id: 'habit-1',
        name: 'Morning Run',
        description: 'Run 5km',
        color: '#10B981',
        icon: '🏃',
        frequency: 'daily',
        is_archived: false,
        profile_id: 'profile-123',
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-01-01T00:00:00Z',
    },
    {
        id: 'habit-2',
        name: 'Read Books',
        description: null,
        color: '#6366F1',
        icon: '📚',
        frequency: 'weekly',
        is_archived: false,
        profile_id: 'profile-123',
        created_at: '2026-01-02T00:00:00Z',
        updated_at: '2026-01-02T00:00:00Z',
    },
];

describe('HabitList', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockFetchHabits.mockResolvedValue(undefined);
        mockDeleteHabit.mockResolvedValue({ success: true });
        mockHabitsData.mockReturnValue([]);
    });

    it('renders empty state when no habits exist', async () => {
        renderList();

        await waitFor(() => {
            expect(screen.getByText(/no habits yet/i)).toBeInTheDocument();
        });

        // Should have a CTA to create first habit
        expect(screen.getByRole('link', { name: /create.*habit/i })).toBeInTheDocument();
    });

    it('calls fetchHabits on mount', () => {
        renderList();
        expect(mockFetchHabits).toHaveBeenCalledTimes(1);
    });

    it('renders list of habits with correct names', async () => {
        mockHabitsData.mockReturnValue(sampleHabits);

        renderList();

        await waitFor(() => {
            expect(screen.getByText('Morning Run')).toBeInTheDocument();
            expect(screen.getByText('Read Books')).toBeInTheDocument();
        });
    });

    it('displays habit frequency badge', async () => {
        mockHabitsData.mockReturnValue(sampleHabits);

        renderList();

        await waitFor(() => {
            expect(screen.getByText(/daily/i)).toBeInTheDocument();
            expect(screen.getByText(/weekly/i)).toBeInTheDocument();
        });
    });

    it('displays habit icons', async () => {
        mockHabitsData.mockReturnValue(sampleHabits);

        renderList();

        await waitFor(() => {
            expect(screen.getByText('🏃')).toBeInTheDocument();
            expect(screen.getByText('📚')).toBeInTheDocument();
        });
    });

    it('has edit links for each habit', async () => {
        mockHabitsData.mockReturnValue(sampleHabits);

        renderList();

        await waitFor(() => {
            const editLinks = screen.getAllByRole('link', { name: /edit/i });
            expect(editLinks).toHaveLength(2);
        });
    });

    it('has delete buttons for each habit', async () => {
        mockHabitsData.mockReturnValue(sampleHabits);

        renderList();

        await waitFor(() => {
            const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
            expect(deleteButtons).toHaveLength(2);
        });
    });

    it('calls deleteHabit when delete is confirmed', async () => {
        mockHabitsData.mockReturnValue(sampleHabits);

        // Mock window.confirm to return true
        vi.spyOn(window, 'confirm').mockReturnValue(true);

        renderList();
        const user = userEvent.setup();

        await waitFor(() => {
            expect(screen.getByText('Morning Run')).toBeInTheDocument();
        });

        const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
        await user.click(deleteButtons[0]);

        expect(window.confirm).toHaveBeenCalled();
        expect(mockDeleteHabit).toHaveBeenCalledWith('habit-1');
    });

    it('does NOT call deleteHabit when delete is cancelled', async () => {
        mockHabitsData.mockReturnValue(sampleHabits);

        vi.spyOn(window, 'confirm').mockReturnValue(false);

        renderList();
        const user = userEvent.setup();

        await waitFor(() => {
            expect(screen.getByText('Morning Run')).toBeInTheDocument();
        });

        const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
        await user.click(deleteButtons[0]);

        expect(window.confirm).toHaveBeenCalled();
        expect(mockDeleteHabit).not.toHaveBeenCalled();
    });
});
