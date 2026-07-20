import { NavLink, Outlet } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { useNotifications } from '../../shared/hooks/useNotifications';
import { useCreateManagerRequest } from '../../features/manager-request/hooks/useCreateManagerRequest';
import { useToast } from '../../shared/components/Toast';
import { useTheme } from '../../app/providers/ThemeProvider';

const ROLE_CONFIG = {
  admin: {
    label: 'Admin',
    colors: 'bg-red-50 text-red-600 border-red-100 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900/40',
    icon: (
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  manager: {
    label: 'Manager',
    colors: 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/40',
    icon: (
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
  },
  user: {
    label: 'User',
    colors: 'bg-gray-100 text-gray-500 border-gray-200 dark:bg-white/5 dark:text-gray-400 dark:border-white/10',
    icon: (
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
};

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout, isAdmin, isUser } = useAuth();
  const { data: notifications } = useNotifications();
  const pendingCount = notifications?.length || 0;
  const roleConfig = ROLE_CONFIG[user?.role] || ROLE_CONFIG.user;
  const createManagerRequest = useCreateManagerRequest();
  const toast = useToast();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col lg:flex-row">
      {/* Mobile header */}
      <header className="lg:hidden bg-surface/80 backdrop-blur-lg border-b border-border/60 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg overflow-hidden">
            <img src="/brand-logo.svg" alt="Feedback Board" className="w-full h-full object-contain" />
          </div>
          <span className="font-heading font-bold text-lg text-ink">Feedback Board</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors duration-150"
          aria-label="Toggle menu"
        >
          <svg className="w-5 h-5 text-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {sidebarOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </header>

      {/* Sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 dark:bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-200"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-50 lg:z-auto
          w-72 lg:w-72 h-full lg:h-screen
          bg-gradient-to-b from-gray-50/80 via-white to-white
          dark:from-[#0E1019] dark:via-[#11131C] dark:to-[#13151F]
          flex flex-col
          shadow-[4px_0_24px_-4px_rgba(0,0,0,0.06)]
          dark:shadow-[4px_0_24px_-4px_rgba(0,0,0,0.5)]
          lg:shadow-none lg:border-r lg:border-border/40
          transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="p-5 border-b border-border/40">
          <NavLink to="/" className="flex items-center gap-3 group" onClick={() => setSidebarOpen(false)}>
            <div className="w-9 h-9 rounded-xl overflow-hidden shadow-md shadow-accent/20 group-hover:shadow-lg group-hover:shadow-accent/30 transition-shadow duration-200">
              <img src="/brand-logo.svg" alt="Feedback Board" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="font-heading font-bold text-[15px] text-ink leading-tight">
                Feedback
              </h1>
              <h1 className="font-heading font-bold text-[15px] text-accent leading-tight">
                Board
              </h1>
            </div>
          </NavLink>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-0.5 overflow-y-auto">
          <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-ink-muted/50">
            Navigation
          </p>

          <NavLink
            to="/"
            end
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) => `
              group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium
              transition-all duration-150
              ${isActive
                ? 'bg-accent-light/60 text-accent font-semibold'
                : 'text-ink-muted hover:bg-gray-100/80 dark:hover:bg-white/5 hover:text-ink'
              }
            `}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-accent rounded-full" />
                )}
                <svg className="w-[18px] h-[18px] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={isActive ? 2.2 : 1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>Feedback Board</span>
              </>
            )}
          </NavLink>

          <NavLink
            to="/dashboard"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) => `
              group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium
              transition-all duration-150
              ${isActive
                ? 'bg-accent-light/60 text-accent font-semibold'
                : 'text-ink-muted hover:bg-gray-100/80 dark:hover:bg-white/5 hover:text-ink'
              }
            `}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-accent rounded-full" />
                )}
                <svg className="w-[18px] h-[18px] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={isActive ? 2.2 : 1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span>Dashboard</span>
              </>
            )}
          </NavLink>
        </nav>

        {isAdmin && (
          <div className="px-4 pb-2">
            <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-ink-muted/50">
              Admin
            </p>
            <NavLink
              to="/admin"
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => `
                group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium
                transition-all duration-150
                ${isActive
                  ? 'bg-accent-light/60 text-accent font-semibold'
                  : 'text-ink-muted hover:bg-gray-100/80 dark:hover:bg-white/5 hover:text-ink'
                }
              `}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-accent rounded-full" />
                  )}
                  <svg className="w-[18px] h-[18px] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={isActive ? 2.2 : 1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Admin Panel</span>
                  {pendingCount > 0 && (
                    <span className="ml-auto w-5 h-5 rounded-full bg-bug text-white text-[10px] font-bold flex items-center justify-center">
                      {pendingCount > 9 ? '9+' : pendingCount}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          </div>
        )}

        {/* Theme Toggle */}
        <div className="px-4 py-4 border-t border-border/40">
          <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-ink-muted/50">
            Appearance
          </p>
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium
              text-ink-muted hover:bg-gray-100/80 dark:hover:bg-white/5 hover:text-ink
              transition-all duration-150 cursor-pointer"
          >
            {theme === 'dark' ? (
              <svg className="w-[18px] h-[18px] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-[18px] h-[18px] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </div>

        {/* Spacer - only on desktop to push user card to bottom */}
        <div className="hidden lg:block flex-1" />

        {/* User Profile Card */}
        {user && (
          <div className="mx-4 mb-4 p-3 rounded-xl bg-gray-50/80 dark:bg-white/[0.03] border border-border/30">
            {/* Manager Request CTA - sits above user details */}
            {isUser && (
              <button
                onClick={() => {
                  if (createManagerRequest.isPending) return;
                  createManagerRequest.mutate(undefined, {
                    onSuccess: () => toast('Manager request sent successfully', 'success'),
                    onError: (error) => toast(error.message || 'Failed to submit request', 'error'),
                  });
                }}
                disabled={createManagerRequest.isPending}
                className={`mb-2.5 w-full p-2.5 rounded-lg text-left transition-all duration-150 ${
                  createManagerRequest.isPending
                    ? 'opacity-60 cursor-not-allowed bg-gradient-to-br from-accent-light/80 to-accent/5 border border-accent/10 dark:from-accent/10 dark:to-accent/5'
                    : 'cursor-pointer bg-gradient-to-br from-accent-light/80 to-accent/5 border border-accent/10 dark:from-accent/10 dark:to-accent/5 hover:shadow-md hover:shadow-accent/10 hover:border-accent/20 active:scale-[0.98]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-md bg-accent/10 dark:bg-accent/20 flex items-center justify-center shrink-0">
                    {createManagerRequest.isPending ? (
                      <svg className="w-3.5 h-3.5 text-accent animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    ) : (
                      <svg className="w-3.5 h-3.5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-semibold text-ink leading-tight">
                      {createManagerRequest.isPending ? 'Requesting...' : 'Upgrade to Manager'}
                    </p>
                    <p className="text-[10px] text-ink-muted leading-tight">
                      {createManagerRequest.isPending ? 'Please wait' : 'Request elevated access'}
                    </p>
                  </div>
                  {!createManagerRequest.isPending && (
                    <svg className="w-3.5 h-3.5 text-ink-muted/40 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </div>
              </button>
            )}

            <div className="flex items-center gap-3 mb-2.5">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-indigo-600 flex items-center justify-center text-white font-semibold text-sm shadow-md shadow-accent/20 shrink-0">
                {user.name?.charAt(0).toUpperCase() || '?'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold text-ink truncate leading-tight">{user.name}</p>
                <p className="text-[11px] text-ink-muted truncate leading-tight mt-0.5">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase border ${roleConfig.colors}`}>
                {roleConfig.icon}
                {roleConfig.label}
              </span>

              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-ink-muted/50 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-500 transition-colors duration-150"
                aria-label="Sign out"
                title="Sign out"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* Main content */}
      <main className="flex-1 min-h-screen lg:min-h-0">
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
