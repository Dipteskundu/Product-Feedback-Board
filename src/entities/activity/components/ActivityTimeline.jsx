const actionIcons = {
  created: (
    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  ),
  status_changed: (
    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  ),
  priority_changed: (
    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
    </svg>
  ),
  comment_added: (
    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  ),
  vote_cast: (
    <svg className="w-3 h-3" fill="none" viewBox="0 0 10 7" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 6L5 2L9 6" />
    </svg>
  ),
  deleted: (
    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
};

const actionColorClasses = {
  created: 'bg-accent-light text-accent',
  status_changed: 'bg-amber-50 text-status-progress',
  priority_changed: 'bg-blue-50 text-feature',
  comment_added: 'bg-emerald-50 text-improvement',
  vote_cast: 'bg-violet-50 text-status-review',
  deleted: 'bg-red-50 text-bug',
};

function formatAction(activity) {
  switch (activity.action) {
    case 'created':
      return 'Created this feedback';
    case 'status_changed':
      return `Status changed: ${activity.details?.from} → ${activity.details?.to}`;
    case 'priority_changed':
      return `Priority changed: ${activity.details?.from} → ${activity.details?.to}`;
    case 'comment_added':
      return 'Added a comment';
    case 'vote_cast':
      return 'Cast a vote';
    case 'deleted':
      return 'Deleted this feedback';
    default:
      return activity.action;
  }
}

function ActivityItem({ activity }) {
  const icon = actionIcons[activity.action] || <span className="w-3 h-3 block" />;
  const colorClass = actionColorClasses[activity.action] || 'bg-gray-100 text-ink-muted';

  return (
    <div className="flex gap-3 items-start py-2">
      <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${colorClass}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-ink m-0">{formatAction(activity)}</p>
        <span className="text-xs text-ink-muted font-mono">
          {new Date(activity.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
}

function ActivityTimeline({ activities = [] }) {
  if (activities.length === 0) return null;

  return (
    <div>
      <h3 className="text-base font-heading font-bold text-ink mb-3">Activity</h3>
      <div className="border-l-2 border-border ml-3 pl-4 space-y-1">
        {activities.map((activity) => (
          <ActivityItem key={activity._id} activity={activity} />
        ))}
      </div>
    </div>
  );
}

export default ActivityTimeline;
