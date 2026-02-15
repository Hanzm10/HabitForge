import { useEffect } from 'react';
import {
    Users,
    UserPlus,
    Activity,
    TrendingUp,
    AlertCircle
} from 'lucide-react';
import { useAdminAnalytics } from '../../hooks/useAdminAnalytics';
import { AnalyticsCard } from '../../components/admin/AnalyticsCard';
import { GrowthGraph } from '../../components/admin/GrowthGraph';
import { EngagementMetrics } from '../../components/admin/EngagementMetrics';

export default function AdminDashboard() {
    const { analytics, isLoading, error, fetchAnalytics } = useAdminAnalytics();

    useEffect(() => {
        fetchAnalytics();
    }, [fetchAnalytics]);

    if (isLoading && !analytics) {
        return (
            <div className="p-8 space-y-8 animate-pulse">
                <div className="h-10 w-64 bg-bg-secondary rounded-lg"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-32 bg-bg-secondary rounded-xl"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[400px]">
                <div className="text-center max-w-md">
                    <div className="inline-flex items-center justify-center p-3 bg-error/10 rounded-full mb-4">
                        <AlertCircle className="w-6 h-6 text-error" />
                    </div>
                    <h2 className="text-xl font-bold text-text-primary mb-2">Failed to load analytics</h2>
                    <p className="text-text-secondary mb-6">{error}</p>
                    <button
                        onClick={() => fetchAnalytics()}
                        className="px-4 py-2 bg-accent-primary hover:bg-accent-hover text-white rounded-lg transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <header className="mb-10">
                <h1 className="text-3xl font-bold text-text-primary font-satoshi mb-2">Admin Console</h1>
                <p className="text-text-secondary">Comprehensive analytics and system monitoring.</p>
            </header>

            {/* Main KPI Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <AnalyticsCard
                    label="Total Users"
                    value={analytics?.totalUsers ?? 0}
                    icon={Users}
                    description="Total registered profiles"
                />
                <AnalyticsCard
                    label="DAU"
                    value={analytics?.dau ?? 0}
                    icon={Activity}
                    description="Active in last 24h"
                />
                <AnalyticsCard
                    label="MAU"
                    value={analytics?.mau ?? 0}
                    icon={TrendingUp}
                    description="Active in last 30d"
                />
                <AnalyticsCard
                    label="New (7d)"
                    value={analytics?.newUsers7d ?? 0}
                    icon={UserPlus}
                    description="Joined in last 7 days"
                />
            </div>

            {/* Growth Visualization */}
            <div className="mb-10">
                <GrowthGraph />
            </div>

            {/* Secondary Metrics */}
            <EngagementMetrics analytics={analytics} />
        </div>
    );
}
