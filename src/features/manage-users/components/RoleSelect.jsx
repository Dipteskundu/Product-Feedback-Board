import { useUpdateUserRole } from '../hooks/useUpdateUserRole';
import { useToast } from '../../../shared/components/Toast';

const ROLE_OPTIONS = ['user', 'manager', 'admin'];

function RoleSelect({ userId, currentRole }) {
  const updateRole = useUpdateUserRole();
  const toast = useToast();

  const handleChange = (e) => {
    updateRole.mutate(
      { userId, role: e.target.value },
      {
        onSuccess: () => toast('Role updated successfully', 'success'),
        onError: (error) => toast(error.message || 'Failed to update role', 'error'),
      }
    );
  };

  return (
    <select
      value={currentRole}
      onChange={handleChange}
      disabled={updateRole.isPending}
      className="px-2 py-1 bg-surface border border-border rounded text-xs text-ink
        focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent
        hover:border-accent/40 transition-colors cursor-pointer"
    >
      {ROLE_OPTIONS.map((r) => (
        <option key={r} value={r}>
          {r.charAt(0).toUpperCase() + r.slice(1)}
        </option>
      ))}
    </select>
  );
}

export default RoleSelect;
