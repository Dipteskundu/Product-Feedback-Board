import { FeedbackBoard } from '../../widgets/feedback-board';
import ErrorBoundary from '../../shared/components/ErrorBoundary';

function FeedbackBoardPage() {
  return (
    <ErrorBoundary>
      <FeedbackBoard />
    </ErrorBoundary>
  );
}

export default FeedbackBoardPage;
