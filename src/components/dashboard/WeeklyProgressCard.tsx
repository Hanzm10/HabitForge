import { useWeeklyProgress } from '../../hooks/useWeeklyProgress';
import { Target, TrendingUp, AlertCircle } from 'lucide-react';

export const WeeklyProgressCard = () => {
    const { progress, isLoading, error } = useWeeklyProgress();

    if (isLoading) {
        return (
            <div role="status" className="p-6 bg-card border border-subtle rounded-2xl animate-pulse">
                <div className="h-4 w-32 bg-bg-secondary rounded mb-4" />
                <div className="h-8 w-full bg-bg-secondary rounded mb-2" />
                <div className="h-4 w-48 bg-bg-secondary rounded" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 bg-card border border-error/20 rounded-2xl flex items-start gap-3">
                <AlertCircle className="text-error mt-0.5" size={18} />
                <div>
                    <h3 className="font-semibold text-text-primary">Failed to load progress</h3>
                    <p className="text-sm text-text-secondary mt-1">{error}</p>
                </div>
            </div>
        );
    }

    const getMessage = (percentage: number) => {
        if (percentage === 0) return "Start your week strong! Every habit counts.";
        if (percentage < 30) return "Off to a good start. Keep it up!";
        if (percentage < 70) return "Great momentum! You're crushing it.";
        if (percentage < 100) return "Almost there! Finish the week strong.";
        return "Perfect week! Incredible work.";
    };

    return (
        <div className="p-6 bg-card border border-subtle rounded-2xl shadow-sm hover:border-accent-primary/20 transition-colors">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-accent-primary/10 rounded-lg text-accent-primary">
                        <Target size={18} />
                    </div>
                    <h2 className="font-semibold text-text-primary font-satoshi">Weekly Progress</h2>
                </div>
                <div className="flex items-center gap-1.5 text-success font-bold text-lg">
                    <TrendingUp size={18} />
                    <span>{progress.percentage}%</span>
                </div>
            </div>

            <div className="space-y-4">
                {/* Progress Bar Container */}
                <div className="relative w-full h-3 bg-bg-secondary rounded-full overflow-hidden">
                    {/* Progress Bar Fill */}
                    <div
                        className="absolute top-0 left-0 h-full bg-success transition-all duration-1000 ease-out rounded-full shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                        style={{ width: `${progress.percentage}%` }}
                    />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <p className="text-sm text-text-secondary">
                        <span className="text-text-primary font-medium">{progress.actual} of {progress.target}</span> completions this week
                    </p>
                    <p className="text-sm font-medium text-accent-primary italic">
                        {getMessage(progress.percentage)}
                    </p>
                </div>
            </div>
        </div>
    );
};
