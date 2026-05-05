import { useState } from 'react';
import './CommissionPlaceholder.css';

const reportTypes = [
  { name: 'Commission Summary', desc: 'Overall commission disbursement summary', period: 'Monthly' },
  { name: 'Hierarchy Performance', desc: 'Performance breakdown by hierarchy level', period: 'Weekly' },
  { name: 'TDS & Deductions', desc: 'Tax deductions and service charges report', period: 'Monthly' },
  { name: 'Withdrawal History', desc: 'Complete withdrawal transaction log', period: 'Daily' },
  { name: 'KYC Compliance', desc: 'KYC verification status across network', period: 'Weekly' },
  { name: 'Top Performers', desc: 'Highest earning admins and promoters', period: 'Monthly' },
];

const recentReports = [
  { name: 'Commission Summary - Mar 2026', generated: '01 Apr 2026', type: 'Commission Summary', status: 'Ready' },
  { name: 'Hierarchy Performance - W12', generated: '25 Mar 2026', type: 'Hierarchy Performance', status: 'Ready' },
  { name: 'TDS Report - Feb 2026', generated: '01 Mar 2026', type: 'TDS & Deductions', status: 'Ready' },
  { name: 'KYC Compliance - W11', generated: '18 Mar 2026', type: 'KYC Compliance', status: 'Processing' },
];

export default function CommissionReports() {
  const [selectedReport, setSelectedReport] = useState(''); // eslint-disable-line no-unused-vars

  return (
    <div className="cp">
      <h1 className="cp-title">Commission Reports</h1>
      <p className="cp-subtitle">Generate and download commission module reports</p>

      <div className="cp-cards-grid">
        {reportTypes.map((r, i) => (
          <div className="cp-card" key={i} style={{ cursor: 'pointer' }} onClick={() => setSelectedReport(r.name)}>
            <div className="cp-card-header">
              <span className="cp-card-name">{r.name}</span>
              <span className="cp-card-role">{r.period}</span>
            </div>
            <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>{r.desc}</p>
          </div>
        ))}
      </div>

      <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1e293b', marginBottom: 16 }}>Recent Reports</h2>
      <div className="cp-table-card">
        <table className="cp-table">
          <thead>
            <tr>
              <th>Report Name</th>
              <th>Type</th>
              <th>Generated</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {recentReports.map((r, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 600 }}>{r.name}</td>
                <td>{r.type}</td>
                <td>{r.generated}</td>
                <td>
                  <span className={`cp-badge ${r.status === 'Ready' ? 'verified' : 'pending'}`}>{r.status}</span>
                </td>
                <td>
                  {r.status === 'Ready' ? (
                    <button className="cp-action-btn" style={{ fontSize: 12, padding: '6px 12px' }}>Download</button>
                  ) : (
                    <span style={{ fontSize: 12, color: '#94a3b8' }}>Processing...</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
