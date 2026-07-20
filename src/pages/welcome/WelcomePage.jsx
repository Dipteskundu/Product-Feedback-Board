import { Link } from 'react-router-dom';
import AuthLayout from '../../features/auth/components/AuthLayout.jsx';

function WelcomePage() {
  return (
    <AuthLayout>
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent-light mb-2">
            <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
          </div>
          <h2 className="font-heading font-bold text-2xl text-ink">
            Welcome to Feedback Board
          </h2>
          <p className="text-ink-muted text-sm max-w-sm mx-auto">
            A collaborative space to submit ideas, report bugs, and vote on what matters most.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Link
            to="/login"
            className="block w-full px-4 py-2.5 bg-accent hover:bg-accent-hover text-white font-medium rounded-lg
              transition-[background-color,box-shadow,transform,colors] duration-150 text-center
              focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="block w-full px-4 py-2.5 bg-surface border border-border text-ink font-medium rounded-lg
              hover:bg-accent-light hover:border-accent/30
              transition-[background-color,box-shadow,transform,colors] duration-150 text-center
              focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
          >
            Create Account
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}

export default WelcomePage;
