import { COLORS } from '../../../shared/constants/tokens';
import { PRIORITIES } from '../../../shared/constants/enums';

function PriorityFilter({ value, onChange }) {
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
      <option value="">All Priorities</option>
      {PRIORITIES.map((p) => (
        <option key={p} value={p}>
          {p}
        </option>
      ))}
    </select>
  );
}

export default PriorityFilter;
