import React, { useState } from 'react';
import { MdEdit, MdDelete, MdBlock, MdFirstPage, MdLastPage, MdChevronLeft, MdChevronRight } from 'react-icons/md';
import './ManageTeams.css';

const allPermissions = [
  'Product & Catalogue Management',
  'Inventory & Warehouse Control',
  'Pricing & Financial Engines',
  'Franchise Module',
  'Franchise Deposit & Allocation Engine',
  'Franchise Credit Control',
  'Franchise Purchase Order Handling',
  'Franchise Performance & Analytics',
  'Support & Tickets',
  'E-commerce Operations - Web Operations',
  'Order & Customer Management',
  'Payment & Reconciliation',
  'Settings',
];

const teamsData = [
  {
    id: 1,
    role: 'Super Admin',
    email: 'admin123@gmail.com',
    mobile: '9900990019',
    password: 'admin123',
    permissions: [
      'Product & Catalogue Management',
      'Inventory & Warehouse Control',
      'Pricing & Financial Engines',
      'Franchise Module',
      'Franchise Credit Control',
      'Franchise Purchase Order Handling',
      'Franchise Performance & Analytics',
      'Support & Tickets',
      'E-commerce Operations - Web Operations',
      'Order & Customer Management',
      'Payment & Reconciliation',
      'Settings',
    ],
  },
  {
    id: 2,
    role: 'Catalog Team',
    email: 'catalo123@gmail.com',
    mobile: '9808080908',
    password: 'wel23qu',
    permissions: ['Product & Catalogue Management', 'Settings'],
  },
  {
    id: 3,
    role: 'Finance Team',
    email: 'finance13@gmail.com',
    mobile: '9123990019',
    password: 'dopwknfepe',
    permissions: [
      'Pricing & Financial Engines',
      'Franchise Deposit & Allocation Engine',
      'Franchise Credit Control',
      'Franchise Performance & Analytics',
      'Payment & Reconciliation',
      'Settings',
    ],
  },
  {
    id: 4,
    role: 'Warehouse Team',
    email: 'warehou@gmail.com',
    mobile: '9890990019',
    password: 'dlkevckkjveln',
    permissions: [
      'Inventory & Warehouse Control',
      'Franchise Purchase Order Handling -Dispatch, Partial Dispatch, Backorders',
      'Settings',
    ],
  },
  {
    id: 5,
    role: 'Support Team',
    email: 'support1@gmail.com',
    mobile: '9808080908',
    password: 'wel23qu',
    permissions: ['Support & Tickets', 'Order & Customer Management', 'Settings'],
  },
];

function ManageTeams() {
  const [view, setView] = useState('list');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(3);
  const [formData, setFormData] = useState({
    role: '',
    email: '',
    mobile: '',
    password: '',
    permissions: [],
  });

  const filtered = teamsData.filter((t) =>
    t.role.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const pageData = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const startRow = filtered.length === 0 ? 0 : page * rowsPerPage + 1;
  const endRow = Math.min((page + 1) * rowsPerPage, filtered.length);

  const handlePermissionToggle = (perm) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(perm)
        ? prev.permissions.filter((p) => p !== perm)
        : [...prev.permissions, perm],
    }));
  };

  const handleSave = () => {
    setView('list');
    setFormData({ role: '', email: '', mobile: '', password: '', permissions: [] });
  };

  if (view === 'form') {
    return (
      <div className="teams-page">
        <h1 className="teams-title">Add Team Member</h1>
        <div className="teams-form-card">
          <div className="teams-form">
            <div className="teams-form-group">
              <label>Role Name</label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="Enter role name"
              />
            </div>
            <div className="teams-form-group">
              <label>Email ID</label>
              <input
                type="text"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter email"
              />
            </div>
            <div className="teams-form-group">
              <label>Mobile Number</label>
              <input
                type="text"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                placeholder="Enter mobile number"
              />
            </div>
            <div className="teams-form-group">
              <label>Password</label>
              <input
                type="text"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter password"
              />
            </div>
            <div className="teams-permissions-group">
              <label>Permissions</label>
              <div className="teams-checkboxes">
                {allPermissions.map((perm) => (
                  <label className="teams-checkbox-item" key={perm}>
                    <input
                      type="checkbox"
                      checked={formData.permissions.includes(perm)}
                      onChange={() => handlePermissionToggle(perm)}
                    />
                    {perm}
                  </label>
                ))}
              </div>
            </div>
            <div className="teams-form-actions">
              <button className="teams-save-btn" onClick={handleSave}>Save</button>
              <button className="teams-back-btn" onClick={() => setView('list')}>Back</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="teams-page">
      <h1 className="teams-title">Manage Teams</h1>
      <div className="teams-topbar">
        <button className="teams-add-btn" onClick={() => setView('form')}>
          + Add Team Member
        </button>
        <input
          className="teams-search"
          type="text"
          placeholder="Search by role name"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
        />
      </div>
      <div className="teams-card">
        <table className="teams-table">
          <thead>
            <tr>
              <th>Details</th>
              <th>Permission</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {pageData.map((team) => (
              <tr key={team.id}>
                <td>
                  <div><span className="teams-detail-label">Role:</span> {team.role}</div>
                  <div><span className="teams-detail-label">Email ID:</span> {team.email}</div>
                  <div><span className="teams-detail-label">Mobile Number:</span> {team.mobile}</div>
                  <div><span className="teams-detail-label">Password:</span> {team.password}</div>
                </td>
                <td>
                  <div className="teams-permissions">
                    {team.permissions.map((p, i) => (
                      <div key={i}>{p}</div>
                    ))}
                  </div>
                </td>
                <td>
                  <div className="teams-actions">
                    <button className="teams-action-btn teams-action-edit" title="Edit">
                      <MdEdit />
                    </button>
                    <button className="teams-action-btn teams-action-delete" title="Delete">
                      <MdDelete />
                    </button>
                    <button className="teams-action-btn teams-action-deactivate" title="Deactivate">
                      <MdBlock />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="teams-pagination">
          <span>Rows per page:</span>
          <select
            value={rowsPerPage}
            onChange={(e) => { setRowsPerPage(Number(e.target.value)); setPage(0); }}
          >
            <option value={3}>3</option>
            <option value={5}>5</option>
            <option value={10}>10</option>
          </select>
          <span className="teams-pagination-info">
            {startRow}-{endRow} of {filtered.length}
          </span>
          <div className="teams-pagination-arrows">
            <button className="teams-page-arrow" disabled={page === 0} onClick={() => setPage(0)}>
              <MdFirstPage />
            </button>
            <button className="teams-page-arrow" disabled={page === 0} onClick={() => setPage(page - 1)}>
              <MdChevronLeft />
            </button>
            <button className="teams-page-arrow" disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>
              <MdChevronRight />
            </button>
            <button className="teams-page-arrow" disabled={page >= totalPages - 1} onClick={() => setPage(totalPages - 1)}>
              <MdLastPage />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageTeams;
