function BarChart({ data, labelKey, valueKey }) {
  const max = Math.max(...data.map((d) => d[valueKey] || 0), 1);

  return (
    <div className="bg-surface border border-border rounded-xl p-5">
      <h3 className="text-sm font-heading font-bold text-ink mb-4">
        {labelKey === 'Category' ? 'By Category' : 'By Priority'}
      </h3>
      <div className="space-y-3">
        {data.map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="text-xs text-ink-muted w-20 text-right shrink-0 truncate">{item[labelKey]}</span>
            <div className="flex-1 h-5 bg-bg rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-[width] duration-500"
                style={{
                  width: `${((item[valueKey] || 0) / max) * 100}%`,
                  backgroundColor:
                    item[labelKey] === 'Bug' ? '#DC2626' :
                    item[labelKey] === 'Feature' ? '#2563EB' :
                    item[labelKey] === 'Improvement' ? '#059669' :
                    item[labelKey] === 'High' ? '#DC2626' :
                    item[labelKey] === 'Medium' ? '#F59E0B' :
                    '#4F46E5',
                }}
              />
            </div>
            <span className="text-xs font-mono font-semibold text-ink w-6 text-right">{item[valueKey]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BarChart;
