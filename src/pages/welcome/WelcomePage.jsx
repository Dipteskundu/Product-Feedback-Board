import { Link } from 'react-router-dom';
import Button from '../../shared/components/Button.jsx';

function WelcomePage() {
  return (
    <div className="min-h-screen bg-bg overflow-hidden relative">
      {/* ── Blue left stripe ── */}
      <div className="fixed left-0 top-0 w-1.5 h-full bg-accent z-50" />

      {/* ── Hero Section ── */}
      <section className="relative pt-24 pb-16 px-6">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h1 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl text-ink leading-[1.1] tracking-tight text-balance">
            Your users have ideas.{' '}
            <span className="text-accent">Listen</span> to them.
          </h1>

          <p className="text-ink-muted text-lg max-w-2xl mx-auto leading-relaxed">
            The central feedback hub for modern product teams. Capture feature
            requests, prioritize what matters, and ship what your users actually want.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/register">
              <Button variant="primary" size="lg" className="w-full sm:w-auto px-8 py-3 text-base">
                Get Started Free
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto px-8 py-3 text-base">
                Explore Board
              </Button>
            </Link>
          </div>

          {/* Brand trust line */}
          <div className="flex items-center justify-center gap-2.5 pt-2">
            <img src="/brand-logo.svg" alt="" className="w-7 h-7" />
            <span className="font-heading font-bold text-sm text-ink">Feedback Board</span>
            <span className="text-ink-muted text-sm">— trusted by 500+ product teams worldwide</span>
          </div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section className="relative px-6 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Left column: Submit Feedback + preview card */}
            <div className="space-y-6">
              <div className="bg-surface border border-border rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-heading font-bold text-xl text-ink">Submit Feedback</h3>
                </div>
                <p className="text-ink-muted text-sm leading-relaxed">
                  Customers can submit ideas, bugs, and your app in one clean interface.
                </p>
              </div>

              {/* Live preview card */}
              <div className="bg-surface border border-border rounded-xl shadow-card p-5">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-heading font-semibold text-sm text-ink leading-snug">Dark Mode Support</p>
                    <p className="text-xs text-ink-muted mt-0.5">by @sarah_chen</p>
                  </div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-feature/10 text-feature text-[11px] font-medium shrink-0">Feature Request</span>
                </div>

                <p className="text-sm text-ink-muted leading-relaxed mb-3">
                  Would love a dark mode option for late-night sessions. Many users have requested this.
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex items-center gap-3">
                    <button className="flex items-center gap-1.5 text-accent font-semibold text-sm">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                      247
                    </button>
                    <span className="text-ink-muted text-sm flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      18
                    </span>
                  </div>
                  <span className="text-xs text-ink-muted">2 days ago</span>
                </div>
              </div>
            </div>

            {/* Right column: Vote & Prioritize + Track Progress */}
            <div className="space-y-6">
              <div className="bg-surface border border-border rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-feature/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-feature" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </div>
                  <h3 className="font-heading font-bold text-xl text-ink">Vote & Prioritize</h3>
                </div>
                <p className="text-ink-muted text-sm leading-relaxed">
                  Upvote what matters most. Let your community surface the ideas with the highest impact.
                </p>
              </div>

              <div className="bg-surface border border-border rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-improvement/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-improvement" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="font-heading font-bold text-xl text-ink">Track Progress</h3>
                </div>
                <p className="text-ink-muted text-sm leading-relaxed">
                  Watch your feedback move from idea to planned to in-progress to shipped.
                </p>
              </div>
            </div>
          </div>

          {/* Integrations row */}
          <div className="mt-8 bg-surface border border-border rounded-xl p-6">
            <p className="text-sm font-medium text-ink-muted mb-4">Integrates with your stack</p>
            <div className="flex items-center gap-6 flex-wrap">
              {[
                { name: 'GitHub', icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg> },
                { name: 'Slack', icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/></svg> },
                { name: 'Jira', icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M11.396 11.297l-5.39 2.974 5.016 6.364 5.39-2.974-5.016-6.364zm-.892-4.594L5.114 9.677l5.016 6.364 5.39-2.974-5.016-6.364zm8.188-4.203L13.692 4.874l5.016 6.364 5.39-2.974-5.016-6.364z"/></svg> },
                { name: 'Notion', icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L18.2 2.16c-.42-.326-.98-.7-2.055-.607l-12.8.934c-.466.047-.56.28-.374.466l1.432 1.282zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.166V6.354c0-.606-.233-.933-.748-.886l-15.177.887c-.56.046-.747.326-.747.932zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.118v6.885l1.449.327s0 .84-1.168.84l-3.222.187c-.093-.187 0-.653.327-.746l.84-.233V9.854c0-.654.14-1.027.56-1.12.326-.093.793-.233 1.213-.233l4.483.046v6.465l-1.403-.187c-.093-.42-.233-.84-.745-.84l-3.129.188c-.094.187-.14.513.14.653l2.029 5.426 4.67-7.352z"/></svg> },
                { name: 'Figma', icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M15.852 8.981h-4.588V0h4.588c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.491-4.49 4.491zM12.735 7.51h3.117c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-3.117V7.51zm0 8.942h-4.588c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h4.588v8.98zM3.657 7.51c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h3.117V7.51H3.657zm4.588 8.942v-4.588H3.657c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h4.588V.027h-4.588C3.183.027.01 3.2.01 7.012s3.173 6.986 7.235 6.986h4.588v3.46h-4.588zm4.588-4.588v4.588c2.476 0 4.49-2.014 4.49-4.49s-2.014-4.49-4.49-4.49h4.588v-3.46h-4.588c-2.476 0-4.49 2.014-4.49 4.49s2.014 4.49 4.49 4.49zm4.588-4.588c1.665 0 3.019-1.355 3.019-3.019S17.517.489 15.852.489v3.46h3.117v3.46h-3.117z"/></svg> },
                { name: 'Linear', icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M3.303 14.84a8.46 8.46 0 0 0-.485.458c-.771.748-1.165 1.542-1.165 2.31 0 .676.36 1.27 1.028 1.73.646.449 1.524.676 2.556.676.864 0 1.754-.15 2.587-.47l.138-.056-1.286-2.229-.124.048c-.534.205-1.148.31-1.765.31-.535 0-.95-.107-1.212-.314-.277-.216-.385-.502-.385-.827 0-.172.058-.352.181-.538l1.696-2.474-3.364-.02zm5.982-6.84c.336 0 .683.03 1.03.094l.174.034-1.502 2.584-.142-.038c-.242-.072-.492-.11-.748-.11-.592 0-1.114.25-1.458.67l-1.42 1.73 5.355 9.274 1.42-1.73-3.827-6.63a1.738 1.738 0 0 1-.28.136c-.39.15-.84.226-1.32.226h-.248l-.038.066 2.734 4.736.126.03c.374.102.762.155 1.154.155 1.026 0 1.946-.36 2.63-1.014.657-.627 1.04-1.454 1.04-2.342 0-.7-.282-1.368-.814-1.952l-1.156-1.266 1.65-2.858c.126-.218.222-.466.266-.746a2.096 2.096 0 0 0-.118-.978 1.848 1.848 0 0 0-1.578-1.254l-.17-.014-5.83.046zm8.85 1.456c-.174 0-.352.018-.532.054l-.15.032 1.244 2.154.13-.036c.682-.2 1.44-.31 2.194-.31.952 0 1.806.21 2.456.646.672.45 1.076 1.092 1.076 1.81 0 .55-.256 1.072-.732 1.508l-2.208 2.004 2.358 3.89.16.042c.214.06.434.09.654.09.77 0 1.456-.37 1.956-1.01.51-.654.8-1.494.8-2.4 0-.766-.216-1.468-.62-2.046a3.24 3.24 0 0 0-1.752-1.276 6.396 6.396 0 0 0-.864-.2l-.162-.016-5.006-.036zm.756 2.09c.29 0 .59.054.894.166.468.174.786.472.918.866.112.336.128.714.042 1.094l-.038.132-2.112 1.92 1.468 2.42-1.572-.054-2.268-3.746 2.108-1.92c.138-.15.312-.228.486-.252.108-.018.216-.024.324-.024l-.25.41z"/></svg> },
              ].map((integration) => (
                <div key={integration.name} className="flex items-center gap-2 text-ink-muted hover:text-ink transition-colors">
                  {integration.icon}
                  <span className="text-sm font-medium">{integration.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="py-24 border-t border-border">
        <div className="max-w-3xl mx-auto px-6 text-center space-y-6">
          <h2 className="font-heading font-bold text-3xl sm:text-4xl text-accent">
            Ready to hear from your users?
          </h2>
          <p className="text-ink-muted text-lg max-w-xl mx-auto">
            Start collecting actionable feedback in minutes. No credit card required.
            Built for teams that care about their users.
          </p>
          <div className="pt-2">
            <Link to="/register">
              <Button variant="primary" size="lg" className="px-8 py-3 text-base">
                Create Free Account
              </Button>
            </Link>
          </div>
          <p className="text-xs text-ink-muted">No credit card required. Free for small teams.</p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-8 border-t border-border">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/brand-logo.svg" alt="Feedback Board" className="w-6 h-6" />
            <span className="font-heading font-semibold text-sm text-ink">Feedback Board</span>
          </div>
          <p className="text-xs text-ink-muted">
            Built with care for better product decisions.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default WelcomePage;
