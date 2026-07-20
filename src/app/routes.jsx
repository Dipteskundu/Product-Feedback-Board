import { createBrowserRouter } from 'react-router-dom';
import AppLayout from '../shared/components/AppLayout';
import ProtectedRoute from '../shared/components/ProtectedRoute';
import GuestRoute from '../shared/components/GuestRoute';
import WelcomePage from '../pages/welcome/WelcomePage';
import LoginPage from '../pages/login/LoginPage';
import RegisterPage from '../pages/register/RegisterPage';
import FeedbackBoardPage from '../pages/feedback-board/FeedbackBoardPage';
import FeedbackDetailPage from '../pages/feedback-detail/FeedbackDetailPage';
import DashboardPage from '../pages/dashboard/DashboardPage';

const router = createBrowserRouter([
  {
    element: <GuestRoute />,
    children: [
      { path: '/welcome', element: <WelcomePage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/', element: <FeedbackBoardPage /> },
          { path: '/feedback/:id', element: <FeedbackDetailPage /> },
          { path: '/dashboard', element: <DashboardPage /> },
        ],
      },
    ],
  },
]);

export default router;
