import { Navigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth';

function RequireRole({ role, children }) {
  const { user, isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-ink-muted">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (role === 'admin' && user.role !== 'admin') return <Navigate to="/" replace />;
  if (role === 'manager' && !['admin', 'manager'].includes(user.role)) return <Navigate to="/" replace />;

  return children;
}

export default RequireRole;
