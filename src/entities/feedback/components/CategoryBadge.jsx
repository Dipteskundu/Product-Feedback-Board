import Badge from '../../../shared/components/Badge';
import categoryColorMap from '../config/categoryColorMap';

function CategoryBadge({ category }) {
  const colorKey = categoryColorMap[category] || 'accent';
  return <Badge color={colorKey}>{category}</Badge>;
}

export default CategoryBadge;
