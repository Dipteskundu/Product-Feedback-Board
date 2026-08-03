import { Link } from 'react-router-dom';

function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <Link to="/welcome" className="flex items-center justify-center gap-2.5 mb-8">
          <img src="/brand-logo.svg" alt="" className="w-8 h-8" />
          <span className="font-heading font-bold text-lg text-ink">Feedback Board</span>
        </Link>

        {children}
      </div>
    </div>
  );
}

export default AuthLayout;
