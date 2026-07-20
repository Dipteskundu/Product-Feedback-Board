import CategoryFilter from './CategoryFilter';
import PriorityFilter from './PriorityFilter';

function FilterBar({ filters, setFilter }) {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <CategoryFilter
        value={filters.category}
        onChange={(val) => setFilter('category', val)}
      />
      <PriorityFilter
        value={filters.priority}
        onChange={(val) => setFilter('priority', val)}
      />
    </div>
  );
}

export default FilterBar;
