import type { LucideIcon } from 'lucide-react';

interface AnalyticsCardProps {
    label: string;
    value: string | number;
    icon: LucideIcon;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    description?: string;
}

export function AnalyticsCard({ label, value, icon: Icon, trend, description }: AnalyticsCardProps) {
    return (
        <div className="bg-bg-card border border-border-subtle p-6 rounded-xl hover:border-accent-primary/50 transition-colors group">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-text-secondary text-sm font-medium mb-1">{label}</p>
                    <h3 className="text-2xl font-bold text-text-primary mb-1">{value}</h3>
                    {description && (
                        <p className="text-text-muted text-xs">{description}</p>
                    )}
                </div>
                <div className="p-2 bg-accent-primary/10 rounded-lg group-hover:bg-accent-primary/20 transition-colors">
                    <Icon className="w-5 h-5 text-accent-primary" />
                </div>
            </div>

            {trend && (
                <div className="mt-4 flex items-center gap-2">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${trend.isPositive
                        ? 'bg-success/10 text-success'
                        : 'bg-error/10 text-error'
                        }`}>
                        {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
                    </span>
                    <span className="text-text-muted text-xs">vs last month</span>
                </div>
            )}
        </div>
    );
}
