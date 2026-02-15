import { Flame, Trophy } from 'lucide-react';

interface StreakCounterProps {
    current: number;
    longest: number;
    className?: string;
}

export const StreakCounter = ({ current, longest, className = '' }: StreakCounterProps) => {
    return (
        <div className={`flex items-center gap-3 text-sm ${className}`}>
            <div className="flex items-center gap-1 text-orange-500" title="Current Streak">
                <Flame size={16} className={current > 0 ? "fill-orange-500" : ""} />
                <span className="font-medium">{current}</span>
            </div>
            <div className="flex items-center gap-1 text-yellow-500" title="Longest Streak">
                <Trophy size={16} className={longest > 0 ? "fill-yellow-500" : ""} />
                <span className="font-medium">{longest}</span>
            </div>
        </div>
    );
};
