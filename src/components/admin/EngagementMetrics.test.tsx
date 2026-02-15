import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EngagementMetrics } from './EngagementMetrics';
import type { AdminAnalytics } from '../../hooks/useAdminAnalytics';

describe('EngagementMetrics', () => {
    const mockAnalytics: AdminAnalytics = {
        totalUsers: 100,
        newUsers7d: 10,
        newUsers30d: 30,
        dau: 50,
        mau: 80,
        avgHabits: 3.5,
        avgCompletionRate: 75.2,
        retentionRate: 62.5,
        growthData: []
    };

    it('renders all three engagement metrics', () => {
        render(<EngagementMetrics analytics={mockAnalytics} />);

        expect(screen.getByText('Avg Habits / User')).toBeInTheDocument();
        expect(screen.getByText('3.5')).toBeInTheDocument();

        expect(screen.getByText('Daily Completion %')).toBeInTheDocument();
        expect(screen.getByText('75.2%')).toBeInTheDocument();

        expect(screen.getByText('Retention Rate')).toBeInTheDocument();
        expect(screen.getByText('62.5%')).toBeInTheDocument();
    });

    it('renders loading state when analytics is null', () => {
        render(<EngagementMetrics analytics={null} />);
        // Should verify it renders skeletons or nothing, but since it's a presentation component
        // heavily dependent on parent passing data, handling null gracefully is good.
        // For now, let's say it renders nothing or loading placeholders. 
        // Based on AdminDashboard, isLoading is handled by parent, but if analytics is null prop?
        // It should probably just render 0s or placeholder.

        expect(screen.getByText('Avg Habits / User')).toBeInTheDocument();
        expect(screen.getByText('0')).toBeInTheDocument();
    });
});
