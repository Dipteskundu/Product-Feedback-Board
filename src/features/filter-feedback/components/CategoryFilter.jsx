import { CATEGORIES } from '../../../shared/constants/enums';

function CategoryFilter({ value, onChange }) {
  return (
    <select
      value={value || ''}
      onChange={(e) => onChange(e.target.value || undefined)}
      className="px-3 py-2 bg-surface border border-border rounded-lg text-sm text-ink
        focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent
        hover:border-accent/40 transition-colors cursor-pointer"
    >
      <option value="">All Categories</option>
      {CATEGORIES.map((c) => (
        <option key={c} value={c}>
          {c}
        </option>
      ))}
    </select>
  );
}

export default CategoryFilter;
