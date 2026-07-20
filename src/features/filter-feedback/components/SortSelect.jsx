import { SORT_OPTIONS } from '../../../shared/constants/enums';

function SortSelect({ value, onChange }) {
  return (
    <select
      value={value || 'newest'}
      onChange={(e) => onChange(e.target.value)}
      className="px-3 py-2 bg-surface border border-border rounded-lg text-sm text-ink
        focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent
        hover:border-accent/40 transition-colors cursor-pointer"
    >
      {SORT_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export default SortSelect;
