import Badge from '../../../shared/components/Badge';
import statusColorMap from '../config/statusColorMap';

function StatusBadge({ status }) {
  const colorKey = statusColorMap[status] || 'open';
  return <Badge color={colorKey} dot>{status}</Badge>;
}

export default StatusBadge;
