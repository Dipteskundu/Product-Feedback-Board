import { useState } from 'react';
import { UserList } from '../../features/manage-users';
import { ManagerRequestList } from '../../features/manager-request';
import { DeleteRequestList } from '../../features/delete-request';

function AdminPage() {
  const [activeTab, setActiveTab] = useState('users');

  const tabs = [
    { id: 'users', label: 'Users' },
    { id: 'manager-requests', label: 'Manager Requests' },
    { id: 'delete-requests', label: 'Delete Requests' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-ink">
          Admin Panel
        </h1>
        <p className="text-sm text-ink-muted mt-1">
          Manage users, roles, and requests
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === tab.id
                ? 'text-accent border-accent'
                : 'text-ink-muted border-transparent hover:text-ink hover:border-border'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-surface border border-border rounded-xl p-6">
        {activeTab === 'users' && (
          <div>
            <h2 className="text-lg font-heading font-bold text-ink mb-4">
              User Management
            </h2>
            <UserList />
          </div>
        )}
        {activeTab === 'manager-requests' && (
          <div>
            <h2 className="text-lg font-heading font-bold text-ink mb-4">
              Manager Requests
            </h2>
            <ManagerRequestList />
          </div>
        )}
        {activeTab === 'delete-requests' && (
          <div>
            <h2 className="text-lg font-heading font-bold text-ink mb-4">
              Delete Requests
            </h2>
            <DeleteRequestList />
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPage;
