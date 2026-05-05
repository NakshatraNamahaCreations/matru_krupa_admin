import { useState } from 'react';
import { MdVisibility, MdDelete, MdArrowBack, MdPerson } from 'react-icons/md';
import './Earnings.css';

const roleTabs = ['State Admin', 'Assistant District Admin', 'District Admin', 'Taluk Admin', 'Promoters'];

const demoPromoters = [
  { sl: 1, name: 'Suresh', code: 'KA-PA-001', email: 'Suresh@gmail.com', phone: '9991773013', type: 'Buyer', district: 'Mysuru', taluk: '', sales: 10, earned: '20,000', status: 'Verified', joined: '12 Mar 2026', joinedTime: '2:30 PM' },
  { sl: 2, name: 'Ravi', code: 'KA-PA-002', email: 'Ravi@gmail.com', phone: '907408990', type: 'New Promoter', district: 'Mysuru', taluk: '', sales: 8, earned: '16,000', status: 'Pending', joined: '11 Mar 2026', joinedTime: '11:30 AM' },
  { sl: 3, name: 'Mahesh', code: 'KA-PA-003', email: 'Mahesh@gmail.com', phone: '9991773013', type: 'Buyer', district: 'Mysuru', taluk: '', sales: 12, earned: '24,000', status: 'Verified', joined: '10 Mar 2026', joinedTime: '12:30 PM' },
  { sl: 4, name: 'Ankit', code: 'KA-PA-004', email: 'Ankit@gmail.com', phone: '9991773013', type: 'New Promoter', district: 'Mysuru', taluk: '', sales: 10, earned: '20,000', status: 'Verified', joined: '09 Mar 2026', joinedTime: '2:30 PM' },
  { sl: 5, name: 'Manish', code: 'KA-PA-009', email: 'Manish@gmail.com', phone: '9991773013', type: 'Buyer', district: 'Mysuru/', taluk: 'Hunsur Town', sales: 14, earned: '28,000', status: 'Pending', joined: '08 Mar 2026', joinedTime: '11:02 AM' },
  { sl: 6, name: 'Purav', code: 'KA-PA-006', email: 'Purav@gmail.com', phone: '9991773013', type: 'New Promoter', district: 'Mysuru/', taluk: 'Nanjungud', sales: 16, earned: '32,000', status: 'Verified', joined: '07 Mar 2026', joinedTime: '6:30 PM' },
];

const earningsHistory = [
  { date: '11/09/2025', orderId: 'ORD-121', product: '4k LED TV', shop: 'Srinivasa Electronics', hobli: 'Bettadapura Hobli', earnings: '1000.00', orderStatus: 'Completed', payStatus: 'Pending' },
  { date: '01/07/2025', orderId: 'ORD-119', product: 'Electric Kettle', shop: 'Lakshmi Stores', hobli: 'Jayapura Hobli', earnings: '1000.00', orderStatus: 'Completed', payStatus: 'Paid' },
];

export default function Earnings() {
  const [activeTab, setActiveTab] = useState('Promoters');
  const [viewDetail, setViewDetail] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('last7');
  const [talukFilter, setTalukFilter] = useState('');

  if (viewDetail) {
    return (
      <div className="earn">
        <h1 className="earn-title">Promoters</h1>
        <button className="earn-back-btn" onClick={() => setViewDetail(null)}>
          <MdArrowBack /> Back
        </button>

        <div className="earn-profile-card">
          <div className="earn-profile-left">
            <div className="earn-profile-avatar"><MdPerson /></div>
            <div>
              <div className="earn-profile-name">{viewDetail.name}</div>
              <div className="earn-profile-sub">{viewDetail.email}{viewDetail.phone}</div>
              <span className="earn-profile-role">Promoter &bull; {viewDetail.code}</span>
            </div>
          </div>
          <div className="earn-profile-right">
            <div className="earn-profile-earned-label">Total Earnings</div>
            <div className="earn-profile-earned-value">{'\u20B9'}4000.00</div>
          </div>
        </div>

        <div className="earn-detail-card">
          <div className="earn-detail-tabs">
            <button className="earn-detail-tab active">Earnings History</button>
          </div>
          <div className="earn-detail-section-title">Earnings</div>
          <table className="earn-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Order Id</th>
                <th>Product</th>
                <th>Shop/Hobli</th>
                <th>Earnings</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {earningsHistory.map((e, i) => (
                <tr key={i}>
                  <td>{e.date}</td>
                  <td>{e.orderId}</td>
                  <td>{e.product}</td>
                  <td>
                    <span style={{ fontWeight: 600, display: 'block' }}>{e.shop}</span>
                    <span style={{ fontSize: 11, color: '#94a3b8' }}>{e.hobli}</span>
                  </td>
                  <td style={{ fontWeight: 600 }}>{'\u20B9'}{e.earnings}</td>
                  <td>
                    <div className="earn-status-cell">
                      <span className={`earn-badge ${e.orderStatus.toLowerCase()}`}>{e.orderStatus}</span>
                      <span className={`earn-badge ${e.payStatus.toLowerCase()}`}>{e.payStatus}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="earn">
      <h1 className="earn-title">Earnings</h1>

      <div className="earn-tabs">
        {roleTabs.map(t => (
          <button key={t} className={`earn-tab ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>
            {t}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="earn-filter-card">
        <div className="earn-filters">
          <input className="earn-search" placeholder="Search by name or code" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          <div className="earn-filter-group">
            <label className="earn-filter-label">Select Date</label>
            <select className="earn-select" value={dateFilter} onChange={e => setDateFilter(e.target.value)}>
              <option value="last7">Last 7 days</option>
              <option value="last30">Last 30 days</option>
              <option value="last90">Last 90 days</option>
            </select>
          </div>
          <div className="earn-filter-group">
            <label className="earn-filter-label">From</label>
            <input type="date" className="earn-input" />
          </div>
          <div className="earn-filter-group">
            <label className="earn-filter-label">To</label>
            <input type="date" className="earn-input" />
          </div>
          <div className="earn-filter-group">
            <label className="earn-filter-label">Taluk</label>
            <select className="earn-select" value={talukFilter} onChange={e => setTalukFilter(e.target.value)}>
              <option value="">All</option>
              <option>Hunsur</option>
              <option>Nanjungud</option>
              <option>HD Kote</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="earn-stats">
        <div className="earn-stat-card">
          <div className="earn-stat-label">TOTAL PROMOTERS</div>
          <div className="earn-stat-value">382</div>
          <div className="earn-stat-sub">Registered this month</div>
        </div>
        <div className="earn-stat-card">
          <div className="earn-stat-label">KYC VERIFIED</div>
          <div className="earn-stat-value" style={{ color: '#16a34a' }}>200</div>
          <div className="earn-stat-sub">Can withdraw commission</div>
        </div>
        <div className="earn-stat-card">
          <div className="earn-stat-label">KYC PENDING</div>
          <div className="earn-stat-value" style={{ color: '#ea580c' }}>182</div>
          <div className="earn-stat-sub">Commission Held</div>
        </div>
        <div className="earn-stat-card">
          <div className="earn-stat-label">COMMISSIONS HELD</div>
          <div className="earn-stat-value" style={{ color: '#ea580c' }}>{'\u20B9'}49,000</div>
          <div className="earn-stat-sub">Released on KYC Approval</div>
        </div>
      </div>

      {/* Table */}
      <div className="earn-table-card">
        <table className="earn-table">
          <thead>
            <tr>
              <th>Sl. No</th>
              <th>Name</th>
              <th>Contact Details</th>
              <th>Type</th>
              <th>District/Taluk</th>
              <th>Total Sales</th>
              <th>Commission Earned</th>
              <th>Status</th>
              <th>Joined on</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {demoPromoters.map(p => (
              <tr key={p.sl}>
                <td>{p.sl}</td>
                <td>
                  <span style={{ fontWeight: 600, display: 'block' }}>{p.name}</span>
                  <span style={{ fontSize: 11, color: '#94a3b8' }}>{p.code}</span>
                </td>
                <td>
                  <span style={{ display: 'block' }}>{p.email}</span>
                  <span style={{ fontSize: 12, color: '#64748b' }}>{p.phone}</span>
                </td>
                <td>{p.type}</td>
                <td>{p.taluk ? `${p.district} ${p.taluk}` : p.district}</td>
                <td>{p.sales}</td>
                <td style={{ fontWeight: 600 }}>{'\u20B9'}{p.earned}</td>
                <td>
                  <span className={`earn-badge ${p.status.toLowerCase()}`}>{p.status}</span>
                </td>
                <td>
                  <span style={{ display: 'block' }}>{p.joined}</span>
                  <span style={{ fontSize: 11, color: '#94a3b8' }}>{p.joinedTime}</span>
                </td>
                <td>
                  <button className="earn-action-btn" onClick={() => setViewDetail(p)}><MdVisibility /></button>
                  <button className="earn-action-btn delete"><MdDelete /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
