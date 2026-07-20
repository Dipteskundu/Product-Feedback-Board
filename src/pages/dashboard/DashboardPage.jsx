import DashboardWidget from '../../widgets/dashboard/DashboardWidget';
import ErrorBoundary from '../../shared/components/ErrorBoundary';

function DashboardPage() {
  return (
    <ErrorBoundary>
      <DashboardWidget />
    </ErrorBoundary>
  );
}

export default DashboardPage;
