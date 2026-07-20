import { createBrowserRouter } from 'react-router-dom';
import AppLayout from '../shared/components/AppLayout';
import ProtectedRoute from '../shared/components/ProtectedRoute';
import RequireRole from '../shared/components/RequireRole';
import GuestRoute from '../shared/components/GuestRoute';
import WelcomePage from '../pages/welcome/WelcomePage';
import LoginPage from '../pages/login/LoginPage';
import RegisterPage from '../pages/register/RegisterPage';
import FeedbackBoardPage from '../pages/feedback-board/FeedbackBoardPage';
import FeedbackDetailPage from '../pages/feedback-detail/FeedbackDetailPage';
import DashboardPage from '../pages/dashboard/DashboardPage';
import AdminPage from '../pages/admin/AdminPage';

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
          {
            path: '/admin',
            element: (
              <RequireRole role="admin">
                <AdminPage />
              </RequireRole>
            ),
          },
        ],
      },
    ],
  },
]);

export default router;
