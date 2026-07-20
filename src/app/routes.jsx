import { createBrowserRouter } from 'react-router-dom';
import FeedbackBoardPage from '../pages/feedback-board/FeedbackBoardPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <FeedbackBoardPage />,
  },
]);

export default router;
