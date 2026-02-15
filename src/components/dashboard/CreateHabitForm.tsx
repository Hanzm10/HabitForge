import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHabits } from '../../hooks/useHabits';
import { IconPicker } from './IconPicker';

const PRESET_COLORS = [
    '#6366F1', // Indigo (default)
    '#10B981', // Emerald
    '#F59E0B', // Amber
    '#EF4444', // Red
    '#8B5CF6', // Violet
    '#06B6D4', // Cyan
    '#EC4899', // Pink
    '#F97316', // Orange
];

export const CreateHabitForm = () => {
    const navigate = useNavigate();
    const { createHabit, isLoading } = useHabits();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [color, setColor] = useState('#6366F1');
    const [icon, setIcon] = useState('');
    const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily');
    const [submitError, setSubmitError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setSubmitError(null);
        const result = await createHabit({
            name: name.trim(),
            description: description.trim() || undefined,
            color,
            icon: icon.trim() || undefined,
            frequency,
        });

        if (result.success) {
            navigate('/dashboard');
        } else {
            setSubmitError(result.error || 'Failed to create habit');
        }
    };

    return (
        <div className="max-w-xl mx-auto">
            <h1 className="text-2xl font-bold text-text-primary mb-6">Create New Habit</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                    <label htmlFor="habit-name" className="block text-sm font-medium text-text-secondary mb-2">
                        Habit Name
                    </label>
                    <input
                        id="habit-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Morning Run"
                        className="w-full px-4 py-3 bg-bg-secondary border border-border-subtle rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-all"
                    />
                </div>

                {/* Description */}
                <div>
                    <label htmlFor="habit-description" className="block text-sm font-medium text-text-secondary mb-2">
                        Description
                    </label>
                    <textarea
                        id="habit-description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="What does this habit involve?"
                        rows={3}
                        className="w-full px-4 py-3 bg-bg-secondary border border-border-subtle rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-all resize-none"
                    />
                </div>

                {/* Color Picker */}
                <div>
                    <span className="block text-sm font-medium text-text-secondary mb-3">Color</span>
                    <div className="flex gap-3 flex-wrap">
                        {PRESET_COLORS.map((c) => (
                            <button
                                key={c}
                                type="button"
                                data-testid={`color-option-${c}`}
                                aria-pressed={color === c}
                                onClick={() => setColor(c)}
                                className={`w-10 h-10 rounded-full transition-all duration-200 ${color === c
                                    ? 'ring-2 ring-offset-2 ring-offset-bg-primary ring-white scale-110'
                                    : 'hover:scale-105 opacity-70 hover:opacity-100'
                                    }`}
                                style={{ backgroundColor: c }}
                            >
                                <span className="sr-only">Select color {c}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Icon */}
                <div>
                    <IconPicker value={icon} onChange={setIcon} />
                </div>

                {/* Frequency */}
                <div>
                    <span className="block text-sm font-medium text-text-secondary mb-3">Frequency</span>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => setFrequency('daily')}
                            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${frequency === 'daily'
                                ? 'bg-accent-primary text-white shadow-lg shadow-accent-primary/25'
                                : 'bg-bg-secondary text-text-secondary hover:bg-white/5 border border-border-subtle'
                                }`}
                        >
                            Daily
                        </button>
                        <button
                            type="button"
                            onClick={() => setFrequency('weekly')}
                            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${frequency === 'weekly'
                                ? 'bg-accent-primary text-white shadow-lg shadow-accent-primary/25'
                                : 'bg-bg-secondary text-text-secondary hover:bg-white/5 border border-border-subtle'
                                }`}
                        >
                            Weekly
                        </button>
                    </div>
                </div>

                {/* Error */}
                {submitError && (
                    <div className="p-3 bg-error/10 border border-error/30 rounded-lg text-error text-sm">
                        {submitError}
                    </div>
                )}

                {/* Submit */}
                <button
                    type="submit"
                    disabled={!name.trim() || isLoading}
                    className="w-full py-3 bg-accent-primary text-white font-semibold rounded-lg transition-all duration-200 hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-accent-primary/25 hover:shadow-accent-hover/30"
                >
                    {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Creating...
                        </span>
                    ) : (
                        'Create Habit'
                    )}
                </button>
            </form>
        </div>
    );
};
