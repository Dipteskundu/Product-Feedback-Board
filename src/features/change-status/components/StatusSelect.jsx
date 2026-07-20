import { STATUSES } from '../../../shared/constants/enums';
import { useChangeStatus } from '../hooks/useChangeStatus';

function StatusSelect({ feedbackId, currentStatus }) {
  const changeStatus = useChangeStatus();

  const handleChange = (e) => {
    changeStatus.mutate({ id: feedbackId, status: e.target.value });
  };

  return (
    <select
      value={currentStatus}
      onChange={handleChange}
      className="px-3 py-1.5 bg-surface border border-border rounded-lg text-sm text-ink
        focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent
        hover:border-accent/40 transition-colors cursor-pointer"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}

export default StatusSelect;
