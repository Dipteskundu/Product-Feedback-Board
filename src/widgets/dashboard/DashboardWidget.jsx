import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchStats } from './model/statsApi';
import StatCard from './components/StatCard';
import BarChart from './components/BarChart';
import TrendChart from './components/TrendChart';
import Button from '../../shared/components/Button';
import { StatSkeleton } from '../../shared/components/Skeleton';

function DashboardWidget() {
  const navigate = useNavigate();
  const { data: stats, isLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: fetchStats,
  });

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {Array.from({ length: 5 }).map((_, i) => (
            <StatSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-ink">
            Dashboard
          </h1>
          <p className="text-sm text-ink-muted mt-1">
            Overview of your feedback data
          </p>
        </div>
        <Button variant="secondary" onClick={() => navigate('/')}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Board
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <StatCard
          label="Total Feedback"
          value={stats?.totalFeedback || 0}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
        />
        <StatCard
          label="Open"
          value={stats?.openCount || 0}
          color="text-status-open"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          label="Completed"
          value={stats?.completedCount || 0}
          color="text-status-completed"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          label="High Priority"
          value={stats?.highPriorityCount || 0}
          color="text-bug"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          }
        />
        <StatCard
          label="This Week"
          value={stats?.thisWeekCount || 0}
          color="text-accent"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
        />
      </div>

      {/* Most Voted */}
      {stats?.mostVoted && (
        <div className="bg-surface border border-border rounded-xl p-5 mb-8">
          <p className="text-xs font-medium text-ink-muted uppercase tracking-wider mb-2">Most Voted</p>
          <div className="flex items-center justify-between">
            <span className="text-base font-heading font-bold text-ink">{stats.mostVoted.title}</span>
            <div className="flex items-center gap-1.5 text-accent">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 10 7" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 6L5 2L9 6" />
              </svg>
              <span className="text-lg font-bold font-mono">{stats.mostVoted.upvoteCount}</span>
            </div>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <BarChart data={stats?.categoryBreakdown || []} labelKey="Category" valueKey="count" />
        <BarChart data={stats?.priorityBreakdown || []} labelKey="Priority" valueKey="count" />
      </div>

      <TrendChart data={stats?.recentTrend || []} />
    </div>
  );
}

export default DashboardWidget;
