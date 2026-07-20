import { COLORS } from '../../../shared/constants/tokens';
import { CATEGORIES } from '../../../shared/constants/enums';

function CategoryFilter({ value, onChange }) {
  return (
    <select
      value={value || ''}
      onChange={(e) => onChange(e.target.value || undefined)}
      style={{
        padding: '6px 12px',
        borderRadius: 6,
        border: `1px solid ${COLORS.border}`,
        fontSize: 14,
        fontFamily: "'Inter', sans-serif",
        backgroundColor: COLORS.surface,
        color: COLORS.ink,
      }}
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
