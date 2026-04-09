import React, { useState } from 'react';
import { MdVisibility, MdPerson } from 'react-icons/md';
import './CommissionOverview.css';

const demoStats = {
  totalDisbursed: { value: '2,00,300', trend: '+24%', sub: 'This Month Mar 2026' },
  pendingPayouts: { value: '99,000', sub: 'Awaiting Approval' },
  tdsCharges: { value: '40,100', sub: '5% TDS + 5% Service', sub2: 'Remittable to IT Dept' },
  commOnHold: { value: '66,300', sub: 'KYC Pending', badge: '39 KYC Awaited' },
};

const hierarchyData = [
  { level: 'STATE ADMIN', name: 'Karnataka', count: 1 },
  { level: 'ASS DISTRICT ADMIN', desc: 'MULTIPLE PER STATE', count: 2 },
  { level: 'DISTRICT ADMIN', desc: 'MULTIPLE PER STATE', count: 10 },
  { level: 'TALUK ADMIN', desc: 'ACROSS 26 TALUKS', count: 62 },
  { level: 'PROMOTERS', desc: 'Active', count: 200 },
];

const recentCommissions = [
  {
    date: '12 Mar 2026', time: '2:30 PM',
    promoter: 'Sushant', code: 'KA-PA-001',
    shop: 'Srinivasa Electronics', hobli: 'Jayapura Hobli',
    product: '4K LED TV 65"', price: '42,000',
    district: 'Mysuru', taluk: 'Nanjungud',
    status: 'Credited', kyc: 'KYC Verified',
  },
  {
    date: '11 Mar 2026', time: '11:30 AM',
    promoter: 'Rahul', code: 'KA-PA-004',
    shop: 'Lakshmi stores', hobli: 'Hunsur Town Hobli',
    product: 'Washing Machine', price: '18,000',
    district: 'Mysuru', taluk: 'Hunsur',
    status: 'Pending', kyc: 'KYC Verified',
  },
  {
    date: '10 Mar 2026', time: '12:30 PM',
    promoter: 'Suresh', code: 'KA-PA-009',
    shop: 'Srinivasa Electronics', hobli: 'Bettadapura Hobli',
    product: 'LED TV "32', price: '22,000',
    district: 'Mysuru', taluk: 'HD kote',
    status: 'Credited', kyc: 'KYC Verified',
  },
];

export default function CommissionOverview() {
  const [dateRange, setDateRange] = useState('last7');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  return (
    <div className="co">
      <h1 className="co-title">Commission Overview</h1>
      <p className="co-subtitle">Real-time snapshot of the entire payout ecosystem</p>

      {/* Filters */}
      <div className="co-filters">
        <label style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>Select Date</label>
        <select className="co-filter-select" value={dateRange} onChange={e => setDateRange(e.target.value)}>
          <option value="last7">Last 7 days</option>
          <option value="last30">Last 30 days</option>
          <option value="last90">Last 90 days</option>
          <option value="custom">Custom</option>
        </select>
        <label style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>From</label>
        <input type="date" className="co-filter-input" value={fromDate} onChange={e => setFromDate(e.target.value)} />
        <label style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>To</label>
        <input type="date" className="co-filter-input" value={toDate} onChange={e => setToDate(e.target.value)} />
      </div>

      {/* Stat Cards */}
      <div className="co-stats">
        <div className="co-stat-card">
          <div className="co-stat-label">TOTAL DISBURSED</div>
          <div className="co-stat-row">
            <span className="co-stat-value">{'\u20B9'}{demoStats.totalDisbursed.value}</span>
            <span className="co-stat-badge green">{'\u2197'} {demoStats.totalDisbursed.trend}</span>
          </div>
          <div className="co-stat-sub">{demoStats.totalDisbursed.sub}</div>
        </div>
        <div className="co-stat-card">
          <div className="co-stat-label">PENDING PAYOUTS</div>
          <div className="co-stat-row">
            <span className="co-stat-value" style={{ color: '#ea580c' }}>{'\u20B9'}{demoStats.pendingPayouts.value}</span>
          </div>
          <div className="co-stat-sub">{demoStats.pendingPayouts.sub}</div>
        </div>
        <div className="co-stat-card">
          <div className="co-stat-label">TDS & SERVICES CHARGES HELD</div>
          <div className="co-stat-row">
            <span className="co-stat-value">{'\u20B9'}{demoStats.tdsCharges.value}</span>
          </div>
          <div className="co-stat-sub">{demoStats.tdsCharges.sub}</div>
          <div className="co-stat-sub">{demoStats.tdsCharges.sub2}</div>
        </div>
        <div className="co-stat-card">
          <div className="co-stat-label">COMM ON HOLD</div>
          <div className="co-stat-row">
            <span className="co-stat-value" style={{ color: '#ea580c' }}>{'\u20B9'}{demoStats.commOnHold.value}</span>
          </div>
          <div className="co-stat-sub">{demoStats.commOnHold.sub}</div>
          {demoStats.commOnHold.badge && (
            <span className="co-stat-badge red" style={{ marginTop: 6, display: 'inline-block' }}>{demoStats.commOnHold.badge}</span>
          )}
        </div>
      </div>

      {/* Hierarchy Overview */}
      <h2 className="co-hierarchy-title">Hierarchy Overview</h2>
      <div className="co-hierarchy-cards">
        {hierarchyData.map((h, i) => (
          <div className="co-hcard" key={i}>
            <div className="co-hcard-icon"><MdPerson /></div>
            <div className="co-hcard-info">
              <span className="co-hcard-level">{h.level}</span>
              <span className="co-hcard-desc">{h.name || h.desc}</span>
            </div>
            <span className="co-hcard-count">{h.count}</span>
          </div>
        ))}
      </div>

      {/* Recent Commissions Table */}
      <div className="co-table-section">
        <table className="co-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Promoter</th>
              <th>Shop/Hobli</th>
              <th>Product</th>
              <th>District</th>
              <th>Taluk</th>
              <th>Withdrawal Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {recentCommissions.map((c, i) => (
              <tr key={i}>
                <td>
                  <span style={{ fontWeight: 500 }}>{c.date}</span><br />
                  <span style={{ fontSize: 11, color: '#94a3b8' }}>{c.time}</span>
                </td>
                <td>
                  <span className="co-promoter-name">{c.promoter}</span>
                  <span className="co-promoter-code">{c.code}</span>
                </td>
                <td>
                  <span className="co-shop-name">{c.shop}</span>
                  <span className="co-shop-hobli">{c.hobli}</span>
                </td>
                <td>
                  <span className="co-product-name">{c.product}</span>
                  <span className="co-product-price">{'\u20B9'}{c.price}</span>
                </td>
                <td>{c.district}</td>
                <td>{c.taluk}</td>
                <td>
                  <div className="co-status-cell">
                    <span className={`co-badge ${c.status.toLowerCase()}`}>{c.status}</span>
                    <span className="co-badge kyc">{c.kyc}</span>
                  </div>
                </td>
                <td>
                  <button className="co-action-btn"><MdVisibility /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
