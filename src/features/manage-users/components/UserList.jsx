import { useUsers } from '../hooks/useUsers';
import RoleSelect from './RoleSelect';

function UserList() {
  const { data, isLoading } = useUsers();
  const users = data?.data || [];

  if (isLoading) {
    return <p className="text-sm text-ink-muted">Loading users...</p>;
  }

  if (users.length === 0) {
    return <p className="text-sm text-ink-muted">No registered users.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-2 px-3 text-xs font-medium text-ink-muted uppercase tracking-wider">Name</th>
            <th className="text-left py-2 px-3 text-xs font-medium text-ink-muted uppercase tracking-wider">Email</th>
            <th className="text-left py-2 px-3 text-xs font-medium text-ink-muted uppercase tracking-wider">Role</th>
            <th className="text-left py-2 px-3 text-xs font-medium text-ink-muted uppercase tracking-wider">Joined</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="border-b border-border/50 hover:bg-bg/50">
              <td className="py-2.5 px-3 font-medium text-ink">{user.name}</td>
              <td className="py-2.5 px-3 text-ink-muted">{user.email}</td>
              <td className="py-2.5 px-3">
                <RoleSelect userId={user._id} currentRole={user.role} />
              </td>
              <td className="py-2.5 px-3 text-ink-muted text-xs">
                {new Date(user.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserList;
