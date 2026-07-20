function StatCard({ label, value, color = 'text-ink', icon }) {
  return (
    <div className="bg-surface border border-border rounded-xl p-5 text-center hover:shadow-card-hover transition-shadow">
      {icon && (
        <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg bg-accent-light text-accent mb-3`}>
          {icon}
        </div>
      )}
      <p className={`text-2xl sm:text-3xl font-bold font-mono ${color}`}>{value}</p>
      <p className="text-xs text-ink-muted mt-1 font-medium">{label}</p>
    </div>
  );
}

export default StatCard;
