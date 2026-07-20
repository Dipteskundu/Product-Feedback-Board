import FeedbackDetail from '../../widgets/feedback-detail/FeedbackDetail';
import ErrorBoundary from '../../shared/components/ErrorBoundary';

function FeedbackDetailPage() {
  return (
    <ErrorBoundary>
      <FeedbackDetail />
    </ErrorBoundary>
  );
}

export default FeedbackDetailPage;
