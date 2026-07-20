function TrendChart({ data }) {
  if (!data || data.length === 0) return null;

  const max = Math.max(...data.map((d) => d.count || 0), 1);

  return (
    <div className="bg-surface border border-border rounded-xl p-5">
      <h3 className="text-sm font-heading font-bold text-ink mb-4">Recent Activity</h3>
      <div className="flex items-end gap-1 h-32">
        {data.map((item, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div
              className="w-full bg-accent rounded-t transition-all duration-500 hover:bg-accent-hover"
              style={{ height: `${((item.count || 0) / max) * 100}%`, minHeight: item.count ? 4 : 0 }}
              title={`${item.date}: ${item.count} items`}
            />
          </div>
        ))}
      </div>
      {data.length <= 10 && (
        <div className="flex gap-1 mt-2">
          {data.map((item, i) => (
            <div key={i} className="flex-1 text-center">
              <span className="text-[9px] text-ink-muted font-mono">
                {item.date?.slice(5) || ''}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TrendChart;
