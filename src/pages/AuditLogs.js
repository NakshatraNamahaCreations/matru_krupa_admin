import React, { useState } from 'react';
import './AuditLogs.css';

const logTypeOptions = ['All Log Types', 'Price Change', 'Ledger Update', 'Coupon Modification', 'User Login', 'Role Change'];
const userOptions = ['All Users', 'Admin', 'Finance', 'Catalogue', 'Support'];
const dateRangeOptions = ['All Time', 'Today', 'Last 7 Days', 'Last 30 Days', 'Custom Range'];

const auditData = [
  {
    timestamp: '12/11/2025 10:00 AM',
    user: 'Admin',
    actionType: 'Price Change',
    entity: 'SKU1234',
    beforeValue: '₹10,000',
    afterValue: '₹19,000',
    description: 'Updated MRP',
  },
  {
    timestamp: '11/11/2025 02:30 PM',
    user: 'Finance',
    actionType: 'Ledger Update',
    entity: 'Ledger#4567',
    beforeValue: 'Balance ₹82,000',
    afterValue: 'Balance ₹92,000',
    description: 'Closing balance updated',
  },
  {
    timestamp: '10/11/2025 12:30 PM',
    user: 'Catalogue',
    actionType: 'Coupon Modification',
    entity: 'FEST20',
    beforeValue: '50% off',
    afterValue: '40% off',
    description: 'Changed coupon discount',
  },
];

function AuditLogs() {
  const [logType, setLogType] = useState('All Log Types');
  const [user, setUser] = useState('All Users');
  const [dateRange, setDateRange] = useState('All Time');

  const handleExport = () => {
    alert('Exporting audit logs...');
  };

  return (
    <div className="audit-container">
      <h1 className="audit-title">Audit &amp; Compliance Logs</h1>

      {/* Filter Bar */}
      <div className="audit-filter-bar">
        <div className="audit-filters">
          <select
            className="audit-dropdown"
            value={logType}
            onChange={(e) => setLogType(e.target.value)}
          >
            {logTypeOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>

          <select
            className="audit-dropdown"
            value={user}
            onChange={(e) => setUser(e.target.value)}
          >
            {userOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>

          <select
            className="audit-dropdown"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            {dateRangeOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        <button className="audit-export-btn" onClick={handleExport}>
          Export
        </button>
      </div>

      {/* Table */}
      <div className="audit-table-wrapper">
        <table className="audit-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>User</th>
              <th>Action Type</th>
              <th>Entity</th>
              <th>Before Value</th>
              <th>After Value</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {auditData.map((row, idx) => (
              <tr key={idx}>
                <td>{row.timestamp}</td>
                <td>{row.user}</td>
                <td>{row.actionType}</td>
                <td>{row.entity}</td>
                <td>{row.beforeValue}</td>
                <td>{row.afterValue}</td>
                <td>{row.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AuditLogs;
