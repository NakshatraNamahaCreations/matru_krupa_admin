import React, { useState } from 'react';
import { MdVisibility } from 'react-icons/md';
import './CommissionPlaceholder.css';

const demoTalukAdmins = [
  { name: 'Manish', code: 'KA-TA-009', taluk: 'HD Kote', district: 'Mysuru', shops: 8, promoters: 15, sales: 42, commission: '18,000', status: 'Active' },
  { name: 'Purav', code: 'KA-TA-005', taluk: 'Hunsur', district: 'Mysuru', shops: 12, promoters: 22, sales: 65, commission: '28,000', status: 'Active' },
  { name: 'Kiran', code: 'KA-TA-011', taluk: 'Nanjungud', district: 'Mysuru', shops: 6, promoters: 10, sales: 28, commission: '12,000', status: 'Active' },
  { name: 'Vinay', code: 'KA-TA-014', taluk: 'T Narasipura', district: 'Mysuru', shops: 5, promoters: 8, sales: 18, commission: '8,000', status: 'Active' },
  { name: 'Sachin', code: 'KA-TA-018', taluk: 'Periyapatna', district: 'Mysuru', shops: 4, promoters: 7, sales: 14, commission: '6,000', status: 'Active' },
];

export default function TalukAdminPower() {
  const [districtFilter, setDistrictFilter] = useState('');

  return (
    <div className="cp">
      <h1 className="cp-title">Taluk Admin Power</h1>
      <p className="cp-subtitle">Monitor taluk admin performance, shop coverage, and promoter networks</p>

      <div className="cp-stats">
        <div className="cp-stat-card">
          <div className="cp-stat-label">TOTAL TALUK ADMINS</div>
          <div className="cp-stat-value">62</div>
        </div>
        <div className="cp-stat-card">
          <div className="cp-stat-label">TOTAL SHOPS</div>
          <div className="cp-stat-value" style={{ color: '#3b82f6' }}>184</div>
        </div>
        <div className="cp-stat-card">
          <div className="cp-stat-label">TOTAL PROMOTERS</div>
          <div className="cp-stat-value" style={{ color: '#16a34a' }}>200</div>
        </div>
        <div className="cp-stat-card">
          <div className="cp-stat-label">TOTAL SALES</div>
          <div className="cp-stat-value">892</div>
        </div>
      </div>

      <div className="cp-filters">
        <input className="cp-search" placeholder="Search by name, code or taluk" />
        <select className="cp-select" value={districtFilter} onChange={e => setDistrictFilter(e.target.value)}>
          <option value="">All Districts</option>
          <option>Mysuru</option>
          <option>Bangalore</option>
          <option>Mangalore</option>
        </select>
        <select className="cp-select">
          <option>Last 30 days</option>
          <option>Last 7 days</option>
          <option>Last 90 days</option>
        </select>
      </div>

      <div className="cp-table-card">
        <table className="cp-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Taluk</th>
              <th>District</th>
              <th>Shops</th>
              <th>Promoters</th>
              <th>Sales</th>
              <th>Commission</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {demoTalukAdmins.map((t, i) => (
              <tr key={i}>
                <td>
                  <span style={{ fontWeight: 600, display: 'block' }}>{t.name}</span>
                  <span style={{ fontSize: 11, color: '#94a3b8' }}>{t.code}</span>
                </td>
                <td>{t.taluk}</td>
                <td>{t.district}</td>
                <td style={{ fontWeight: 600, color: '#3b82f6' }}>{t.shops}</td>
                <td style={{ fontWeight: 600 }}>{t.promoters}</td>
                <td>{t.sales}</td>
                <td style={{ fontWeight: 600 }}>{'\u20B9'}{t.commission}</td>
                <td><span className="cp-badge active">{t.status}</span></td>
                <td>
                  <button className="cp-action-btn"><MdVisibility /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
