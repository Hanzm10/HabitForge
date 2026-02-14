import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EditHabitForm } from './EditHabitForm.tsx';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

// Mock useHabits hook
const mockUpdateHabit = vi.fn();
const mockFetchHabits = vi.fn();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockHabitsData = vi.fn((): any[] => []);

vi.mock('../../hooks/useHabits', () => ({
    useHabits: () => ({
        habits: mockHabitsData(),
        fetchHabits: mockFetchHabits,
        updateHabit: mockUpdateHabit,
        isLoading: false,
        error: null,
    }),
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

const sampleHabit = {
    id: 'habit-1',
    name: 'Morning Run',
    description: 'Run 5km every morning',
    color: '#10B981',
    icon: '🏃',
    frequency: 'daily',
    is_archived: false,
    profile_id: 'profile-123',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
};

const renderEditForm = (habitId = 'habit-1') => {
    return render(
        <MemoryRouter initialEntries={[`/dashboard/habits/${habitId}/edit`]}>
            <Routes>
                <Route path="/dashboard/habits/:habitId/edit" element={<EditHabitForm />} />
            </Routes>
        </MemoryRouter>
    );
};

describe('EditHabitForm', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockFetchHabits.mockResolvedValue(undefined);
        mockUpdateHabit.mockResolvedValue({ success: true });
        mockHabitsData.mockReturnValue([sampleHabit]);
    });

    it('renders form with pre-populated fields from existing habit', async () => {
        renderEditForm();

        await waitFor(() => {
            expect(screen.getByDisplayValue('Morning Run')).toBeInTheDocument();
            expect(screen.getByDisplayValue('Run 5km every morning')).toBeInTheDocument();
            expect(screen.getByDisplayValue('🏃')).toBeInTheDocument();
        });
    });

    it('renders the heading "Edit Habit"', async () => {
        renderEditForm();

        await waitFor(() => {
            expect(screen.getByRole('heading', { name: /edit habit/i })).toBeInTheDocument();
        });
    });

    it('calls updateHabit with correct payload on submit', async () => {
        renderEditForm();
        const user = userEvent.setup();

        await waitFor(() => {
            expect(screen.getByDisplayValue('Morning Run')).toBeInTheDocument();
        });

        // Change the name
        const nameInput = screen.getByDisplayValue('Morning Run');
        await user.clear(nameInput);
        await user.type(nameInput, 'Evening Run');

        // Submit
        const submitBtn = screen.getByRole('button', { name: /save changes/i });
        await user.click(submitBtn);

        await waitFor(() => {
            expect(mockUpdateHabit).toHaveBeenCalledWith(
                'habit-1',
                expect.objectContaining({
                    name: 'Evening Run',
                })
            );
        });
    });

    it('navigates back to habits list on successful update', async () => {
        renderEditForm();
        const user = userEvent.setup();

        await waitFor(() => {
            expect(screen.getByDisplayValue('Morning Run')).toBeInTheDocument();
        });

        const submitBtn = screen.getByRole('button', { name: /save changes/i });
        await user.click(submitBtn);

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
        });
    });

    it('has a cancel link that navigates back', async () => {
        renderEditForm();

        await waitFor(() => {
            expect(screen.getByRole('link', { name: /cancel/i })).toBeInTheDocument();
        });
    });

    it('shows not found message when habit does not exist', async () => {
        mockHabitsData.mockReturnValue([]);

        renderEditForm('nonexistent-id');

        await waitFor(() => {
            expect(screen.getByText(/habit not found/i)).toBeInTheDocument();
        });
    });
});
