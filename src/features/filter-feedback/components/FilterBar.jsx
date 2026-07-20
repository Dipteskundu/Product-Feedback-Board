import CategoryFilter from './CategoryFilter';
import PriorityFilter from './PriorityFilter';
import StatusFilter from './StatusFilter';
import SortSelect from './SortSelect';
import SearchBar from '../../search-feedback/components/SearchBar';

function FilterBar({ filters, setFilter }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <SearchBar
        value={filters.search}
        onChange={(val) => setFilter('search', val)}
      />
      <CategoryFilter
        value={filters.category}
        onChange={(val) => setFilter('category', val)}
      />
      <PriorityFilter
        value={filters.priority}
        onChange={(val) => setFilter('priority', val)}
      />
      <StatusFilter
        value={filters.status}
        onChange={(val) => setFilter('status', val)}
      />
      <SortSelect
        value={filters.sort}
        onChange={(val) => setFilter('sort', val)}
      />
    </div>
  );
}

export default FilterBar;
