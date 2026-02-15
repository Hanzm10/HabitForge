import {
    ListTodo,
    CheckCircle2,
    Repeat
} from 'lucide-react';
import { AnalyticsCard } from './AnalyticsCard';
import type { AdminAnalytics } from '../../hooks/useAdminAnalytics';

interface EngagementMetricsProps {
    analytics: AdminAnalytics | null;
}

export function EngagementMetrics({ analytics }: EngagementMetricsProps) {
    return (
        <section>
            <h2 className="text-xl font-bold text-text-primary font-satoshi mb-6">Engagement Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <AnalyticsCard
                    label="Avg Habits / User"
                    value={analytics?.avgHabits ?? 0}
                    icon={ListTodo}
                    description="Per registered user"
                />
                <AnalyticsCard
                    label="Daily Completion %"
                    value={`${analytics?.avgCompletionRate ?? 0}%`}
                    icon={CheckCircle2}
                    description="Global average"
                />
                <AnalyticsCard
                    label="Retention Rate"
                    value={`${analytics?.retentionRate ?? 0}%`}
                    icon={Repeat}
                    description="Daily active / Monthly active"
                />
            </div>
        </section>
    );
}
