import { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HabitHeatmapProps {
    history: Map<string, number>;
    isLoading: boolean;
    year: number;
    onYearChange: (year: number) => void;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const HabitHeatmap: React.FC<HabitHeatmapProps> = ({ history, isLoading, year, onYearChange }) => {

    const formatDate = (date: Date) => {
        const offset = date.getTimezoneOffset();
        const localDate = new Date(date.getTime() - (offset * 60 * 1000));
        return localDate.toISOString().split('T')[0];
    };

    const { weeks, totalCount, activeDays, maxDaily } = useMemo(() => {
        const weeksArray = [];
        let total = 0;
        let active = 0;
        let max = 0;

        // Start from Jan 1st of the selected year
        const startDate = new Date(year, 0, 1);
        // End at Dec 31st
        const endDate = new Date(year, 11, 31);

        // Adjust start date to the previous Sunday to align grid
        const dayOfWeek = startDate.getDay(); // 0 = Sun
        const current = new Date(startDate);
        current.setDate(current.getDate() - dayOfWeek);

        // Iterate week by week
        while (current <= endDate || current.getDay() !== 0) {
            const week = [];
            for (let i = 0; i < 7; i++) {
                const dateStr = formatDate(current);
                const count = history.get(dateStr) || 0;

                // Only count habits for the selected year
                if (current.getFullYear() === year) {
                    total += count;
                    if (count > 0) active++;
                    if (count > max) max = count;
                }

                week.push({
                    date: dateStr,
                    count,
                    inYear: current.getFullYear() === year
                });
                current.setDate(current.getDate() + 1);
            }
            weeksArray.push(week);

            // Safety break just in case
            if (weeksArray.length > 54) break;
        }

        return { weeks: weeksArray, totalCount: total, activeDays: active, maxDaily: max };
    }, [history, year]);

    const getIntensityClass = (count: number) => {
        if (count === 0) return 'bg-bg-secondary';
        if (count <= 2) return 'bg-success/40';
        if (count <= 4) return 'bg-success/70';
        return 'bg-success';
    };

    if (isLoading) {
        return (
            <div data-testid="heatmap-loading" className="animate-pulse flex flex-col xl:flex-row gap-6 p-6 bg-card rounded-xl border border-subtle">
                <div className="flex-1 h-48 bg-bg-secondary rounded-lg"></div>
                <div className="w-full xl:w-64 h-48 bg-bg-secondary rounded-lg"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col xl:flex-row gap-6 bg-card rounded-xl p-6 border border-subtle">
            {/* Heatmap Section */}
            {/* Heatmap Section */}
            <div className="flex-1 min-w-0 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                        <span className="text-xl">🔥</span> Activity Overview
                    </h3>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onYearChange(year - 1)}
                            className="p-1.5 hover:bg-bg-secondary rounded-md text-text-muted hover:text-text-primary transition-colors"
                            aria-label="Previous year"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <span className="text-sm font-medium text-text-primary min-w-[3ch] text-center">{year}</span>
                        <button
                            onClick={() => onYearChange(year + 1)}
                            className="p-1.5 hover:bg-bg-secondary rounded-md text-text-muted hover:text-text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={year >= new Date().getFullYear()}
                            aria-label="Next year"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-x-auto flex flex-col justify-center">
                    <div className="flex gap-2 min-w-max pb-2">
                        {/* Day labels column */}
                        <div className="flex flex-col gap-1 pt-6 text-xs text-text-muted font-medium w-8">
                            <div className="h-3 flex items-center"></div> {/* Sun */}
                            <div className="h-3 flex items-center">Mon</div>
                            <div className="h-3 flex items-center"></div> {/* Tue */}
                            <div className="h-3 flex items-center">Wed</div>
                            <div className="h-3 flex items-center"></div> {/* Thu */}
                            <div className="h-3 flex items-center">Fri</div>
                            <div className="h-3 flex items-center"></div> {/* Sat */}
                        </div>

                        {/* Heatmap Grid */}
                        <div className="flex flex-col gap-1">
                            {/* Month labels */}
                            <div className="flex text-xs text-text-muted relative h-5 mb-1">
                                {weeks.map((week, index) => {
                                    const firstDay = new Date(week[0].date);
                                    if (firstDay.getDate() <= 7) {
                                        return (
                                            <span key={index} className="absolute font-medium" style={{ left: `${index * 16}px` }}>
                                                {MONTHS[firstDay.getMonth()]}
                                            </span>
                                        );
                                    }
                                    return null;
                                })}
                            </div>

                            <div className="flex gap-1" role="grid">
                                {weeks.map((week, wIndex) => (
                                    <div key={wIndex} className="flex flex-col gap-1" role="row">
                                        {week.map((day) => (
                                            <div
                                                key={day.date}
                                                data-date={day.date}
                                                data-level={day.count}
                                                className={`w-3 h-3 rounded-[2px] ${day.inYear ? getIntensityClass(day.count) : 'bg-transparent'} relative group transition-colors duration-200`}
                                                role="gridcell"
                                                aria-label={`${day.count} habits on ${day.date}`}
                                            >
                                                {/* Custom Tooltip */}
                                                {day.inYear && (
                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50 whitespace-nowrap pointer-events-none">
                                                        <div className="bg-bg-secondary text-text-primary text-xs rounded px-3 py-2 shadow-xl border border-border-subtle">
                                                            <div className="font-semibold">{day.count} habits</div>
                                                            <div className="text-text-secondary text-[10px]">{new Date(day.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                                                        </div>
                                                        {/* Arrow */}
                                                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-border-subtle"></div>
                                                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-bg-secondary -mt-[1px]"></div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Yearly Overview Stats Panel */}
            <div className="w-full xl:w-64 shrink-0 flex flex-col gap-4 border-t xl:border-t-0 xl:border-l border-subtle pt-6 xl:pt-0 xl:pl-6">
                <h4 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Yearly Overview</h4>

                <div className="grid grid-cols-2 xl:grid-cols-1 gap-4">
                    <div className="p-4 bg-bg-secondary/50 rounded-lg border border-subtle/50">
                        <div className="text-2xl font-bold text-text-primary">{totalCount}</div>
                        <div className="text-xs text-text-muted mt-1">Total Habits Done</div>
                    </div>

                    <div className="p-4 bg-bg-secondary/50 rounded-lg border border-subtle/50">
                        <div className="text-2xl font-bold text-text-primary">{activeDays}</div>
                        <div className="text-xs text-text-muted mt-1">Active Days</div>
                    </div>

                    <div className="p-4 bg-bg-secondary/50 rounded-lg border border-subtle/50">
                        <div className="text-2xl font-bold text-text-primary">{maxDaily}</div>
                        <div className="text-xs text-text-muted mt-1">Max Daily Habits</div>
                    </div>
                </div>
            </div>
        </div>
    );
};
