import { useEffect } from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { useGrowthAnalytics } from '../../hooks/useGrowthAnalytics';
import { TrendingUp, AlertCircle, Loader2 } from 'lucide-react';

export function GrowthGraph() {
    const { data, isLoading, error, fetchGrowth } = useGrowthAnalytics(30);

    useEffect(() => {
        fetchGrowth();
    }, [fetchGrowth]);

    if (isLoading) {
        return (
            <div className="bg-bg-card border border-border-subtle rounded-2xl p-6 h-[400px] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 text-accent-primary animate-spin" />
                    <p className="text-text-secondary animate-pulse">Loading growth data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-bg-card border border-border-subtle rounded-2xl p-6 h-[400px] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3 text-error">
                    <AlertCircle className="w-8 h-8" />
                    <p>Failed to fetch growth data: {error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-bg-card border border-border-subtle rounded-2xl p-6 h-[400px] flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-accent-primary/10 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-accent-primary" />
                    </div>
                    <div>
                        <h3 className="text-text-primary font-semibold">User Growth</h3>
                        <p className="text-text-muted text-sm">Cumulative user base over last 30 days</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1F2937" />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748B', fontSize: 12 }}
                            minTickGap={30}
                            tickFormatter={(str) => {
                                const date = new Date(str);
                                return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                            }}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748B', fontSize: 12 }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#111827',
                                border: '1px solid #1F2937',
                                borderRadius: '12px',
                                color: '#F8FAFC'
                            }}
                            itemStyle={{ color: '#6366F1' }}
                            labelStyle={{ color: '#CBD5E1', marginBottom: '4px' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="count"
                            stroke="#6366F1"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorCount)"
                            animationDuration={1500}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
