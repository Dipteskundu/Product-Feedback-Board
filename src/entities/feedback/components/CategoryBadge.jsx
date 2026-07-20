import Badge from '../../../shared/components/Badge';
import categoryColorMap from '../config/categoryColorMap';

function CategoryBadge({ category }) {
  const color = categoryColorMap[category] || '#666';
  return <Badge color={color}>{category}</Badge>;
}

export default CategoryBadge;
