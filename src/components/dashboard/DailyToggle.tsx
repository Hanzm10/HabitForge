import { Check } from 'lucide-react';

interface DailyToggleProps {
    habitId: string;
    habitColor: string;
    isCompleted: boolean;
    onToggle: () => void;
    isLoading?: boolean;
}

export const DailyToggle = ({
    habitColor,
    isCompleted,
    onToggle,
    isLoading = false,
}: DailyToggleProps) => {
    const ariaLabel = isCompleted ? 'Mark as incomplete' : 'Mark as complete';

    return (
        <button
            onClick={onToggle}
            disabled={isLoading}
            aria-label={ariaLabel}
            className="relative flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-200 ease-out active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
                borderColor: habitColor,
                backgroundColor: isCompleted ? habitColor : 'transparent',
            }}
        >
            {isCompleted && (
                <Check
                    size={16}
                    strokeWidth={3}
                    className="text-white"
                    data-testid="check-icon"
                />
            )}
            {isLoading && (
                <svg
                    className="animate-spin absolute h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    data-testid="loading-spinner"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                </svg>
            )}
        </button>
    );
};
