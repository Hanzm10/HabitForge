import React, { useEffect, useState } from 'react';
import { useCompletionRate } from '../../hooks/useCompletionRate';

interface CompletionRateProps {
    habitId: string;
    createdAt: string;
}

export const CompletionRate: React.FC<CompletionRateProps> = ({ habitId, createdAt }) => {
    const { getRate, isLoading } = useCompletionRate();
    const [rate, setRate] = useState<number | null>(null);

    useEffect(() => {
        const fetchRate = async () => {
            const calculatedRate = await getRate(habitId, '30d', createdAt);
            setRate(calculatedRate);
        };
        fetchRate();
    }, [habitId, createdAt, getRate]);

    if (isLoading && rate === null) {
        return (
            <div className="text-xs text-text-muted animate-pulse">
                --%
            </div>
        );
    }

    const colorClass = rate !== null
        ? rate >= 80 ? 'text-success'
            : rate >= 50 ? 'text-warning'
                : 'text-error'
        : 'text-text-muted';

    return (
        <div className={`text-xs font-semibold ${colorClass}`}>
            {rate !== null ? `${Math.round(rate)}%` : '--%'}
        </div>
    );
};
