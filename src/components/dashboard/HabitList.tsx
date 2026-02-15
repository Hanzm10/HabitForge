import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useHabits } from '../../hooks/useHabits';
import { useCompletions } from '../../hooks/useCompletions';
import { DailyToggle } from './DailyToggle';
import { HabitHeatmap } from './HabitHeatmap';

const getTodayDate = () => new Date().toISOString().split('T')[0];
const getOneYearAgoDate = () => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 1);
    return d.toISOString().split('T')[0];
};

export const HabitList = () => {
    const { habits, fetchHabits, deleteHabit, isLoading } = useHabits();
    const {
        completions,
        history,
        fetchCompletions,
        fetchHistory,
        toggleCompletion,
        isLoading: isCompletionsLoading
    } = useCompletions();
    const [togglingHabitId, setTogglingHabitId] = useState<string | null>(null);

    useEffect(() => {
        fetchHabits();
        fetchCompletions(getTodayDate());
        fetchHistory(getOneYearAgoDate(), getTodayDate());
    }, [fetchHabits, fetchCompletions, fetchHistory]);

    const handleToggle = async (habitId: string) => {
        setTogglingHabitId(habitId);
        await toggleCompletion(habitId, getTodayDate());
        setTogglingHabitId(null);
    };

    const handleDelete = async (habitId: string, habitName: string) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${habitName}"? This action cannot be undone.`
        );
        if (!confirmed) return;
        await deleteHabit(habitId);
    };

    if (isLoading && habits.length === 0) {
        return (
            <div className="flex items-center justify-center py-20">
                <svg className="animate-spin h-8 w-8 text-accent-primary" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
            </div>
        );
    }

    if (habits.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 rounded-full bg-bg-secondary flex items-center justify-center mb-6">
                    <Plus size={32} className="text-text-muted" />
                </div>
                <h2 className="text-xl font-semibold text-text-primary mb-2">No habits yet</h2>
                <p className="text-text-secondary mb-6 max-w-sm">
                    Start building your daily routine by creating your first habit.
                </p>
                <Link
                    to="/dashboard/habits/new"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-accent-primary text-white font-semibold rounded-lg transition-all duration-200 hover:bg-accent-hover shadow-lg shadow-accent-primary/25 hover:shadow-accent-hover/30"
                >
                    <Plus size={20} />
                    Create Your First Habit
                </Link>
            </div>
        );
    }

    return (
        <div>
            {/* Activity Heatmap */}
            <div className="mb-8">
                <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                    <span className="text-xl">🔥</span> Activity Overview
                </h2>
                <div className="bg-card border border-subtle rounded-xl p-1 overflow-hidden">
                    <HabitHeatmap history={history} isLoading={isCompletionsLoading && !togglingHabitId} />
                </div>
            </div>

            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-text-primary">My Habits</h1>
                <Link
                    to="/dashboard/habits/new"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-accent-primary text-white text-sm font-semibold rounded-lg transition-all duration-200 hover:bg-accent-hover shadow-lg shadow-accent-primary/25"
                >
                    <Plus size={16} />
                    New Habit
                </Link>
            </div>

            <div className="grid gap-4">
                {habits.map((habit) => (
                    <div
                        key={habit.id}
                        className="group flex items-center gap-4 p-4 bg-card border border-subtle rounded-xl transition-all duration-200 hover:border-accent-primary/30 hover:shadow-lg hover:shadow-accent-primary/5"
                    >
                        {/* Daily toggle */}
                        <DailyToggle
                            habitId={habit.id}
                            habitColor={habit.color}
                            isCompleted={completions.has(habit.id)}
                            onToggle={() => handleToggle(habit.id)}
                            isLoading={isCompletionsLoading && togglingHabitId === habit.id}
                        />

                        {/* Icon */}
                        {habit.icon && (
                            <span className="text-2xl flex-shrink-0">{habit.icon}</span>
                        )}

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-text-primary truncate">{habit.name}</h3>
                            {habit.description && (
                                <p className="text-sm text-text-secondary truncate mt-0.5">{habit.description}</p>
                            )}
                        </div>

                        {/* Frequency badge */}
                        <span className="hidden sm:inline-flex px-3 py-1 text-xs font-medium rounded-full bg-bg-secondary text-text-secondary border border-subtle capitalize">
                            {habit.frequency}
                        </span>

                        {/* Actions */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <Link
                                to={`/dashboard/habits/${habit.id}/edit`}
                                className="p-2 rounded-lg text-text-muted hover:text-accent-primary hover:bg-accent-primary/10 transition-colors"
                                aria-label={`Edit ${habit.name}`}
                            >
                                <Pencil size={16} />
                            </Link>
                            <button
                                onClick={() => handleDelete(habit.id, habit.name)}
                                className="p-2 rounded-lg text-text-muted hover:text-error hover:bg-error/10 transition-colors"
                                aria-label={`Delete ${habit.name}`}
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
