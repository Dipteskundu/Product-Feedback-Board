import { createBrowserRouter } from 'react-router-dom';
import AppLayout from '../shared/components/AppLayout';
import FeedbackBoardPage from '../pages/feedback-board/FeedbackBoardPage';
import FeedbackDetailPage from '../pages/feedback-detail/FeedbackDetailPage';
import DashboardPage from '../pages/dashboard/DashboardPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout><FeedbackBoardPage /></AppLayout>,
  },
  {
    path: '/feedback/:id',
    element: <AppLayout><FeedbackDetailPage /></AppLayout>,
  },
  {
    path: '/dashboard',
    element: <AppLayout><DashboardPage /></AppLayout>,
  },
]);

export default router;
