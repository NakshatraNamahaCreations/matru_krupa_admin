import React, { useState } from 'react';
import { MdArrowBack, MdVisibility, MdPerson } from 'react-icons/md';
import './CommissionEngine.css';

const commissionRules = [
  { level: 'STATE ADMIN', badge: 'state', perSale: '\u20B91,000', condition: 'KYC must be verified', deduction: '5% tds+ 5% svC' },
  { level: 'ASS DISTRICT ADMIN', badge: 'ass-district', perSale: '\u20B91,000', condition: 'KYC must be verified', deduction: '5% tds+ 5% svC' },
  { level: 'DISTRICT ADMIN', badge: 'district', perSale: '\u20B91,000', condition: 'KYC must be verified', deduction: '5% tds+ 5% svC' },
  { level: 'TALUK ADMIN', badge: 'taluk', perSale: '\u20B91,000', condition: 'KYC must be verified', deduction: '5% tds+ 5% svC' },
  { level: 'PROMOTERS', badge: 'promoter', perSale: '\u20B92,000', condition: 'KYC must be verified', deduction: '5% tds+ 5% svC' },
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

const breakdownData = {
  promoter: { name: 'Sushant', code: 'KA-PA-001', email: 'Sushant@gmail.com', phone: '9089208890', role: 'Promoter', earned: '2000.00' },
  breakdown: [
    [
      { level: 'State Admin', name: 'Suresh', amount: '\u20B91,000', status: 'Credited' },
      { level: 'District Admin', name: 'Mahesh', amount: '\u20B9500', status: 'Credited', split: '50% Split' },
      { level: 'Taluk Admin', name: 'Purav', amount: '\u20B91,000', status: 'Credited' },
    ],
    [
      { level: 'Assistant District Admin', name: 'Ravi', amount: '\u20B91,000', status: 'Credited' },
      { level: 'District Admin', name: 'Ankit', amount: '\u20B9300', status: 'Credited', split: '30% Split' },
    ],
    [
      null,
      { level: 'District Admin', name: 'Manish', amount: '\u20B9200', status: 'Credited', split: '20% Split' },
    ],
  ],
};

export default function CommissionEngine() {
  const [activeTab, setActiveTab] = useState('simulator');
  const [viewDetail, setViewDetail] = useState(null);

  // Simulator form
  const [simForm, setSimForm] = useState({
    promoterCode: '', billingShop: 'Lakshmi Electronics - Hunsur Town Hobli',
    productName: '', quantity: '', dateTime: '',
  });

  // Overview filters
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('last7');

  // Detail view
  if (viewDetail) {
    const p = breakdownData.promoter;
    return (
      <div className="ce">
        <h1 className="ce-title">Commission Engine</h1>
        <button className="ce-back-btn" onClick={() => setViewDetail(null)}>
          <MdArrowBack /> Back
        </button>

        <div className="ce-profile-card">
          <div className="ce-profile-left">
            <div className="ce-profile-avatar"><MdPerson /></div>
            <div>
              <div>
                <span className="ce-profile-name">{p.name}</span>
                <span className="ce-profile-code">&middot; {p.code}</span>
              </div>
              <div className="ce-profile-sub">{p.email} &middot; {p.phone}</div>
              <span className="ce-profile-role">{p.role}</span>
            </div>
          </div>
          <div className="ce-profile-right">
            <div className="ce-profile-earned-label">Commission Earned</div>
            <div className="ce-profile-earned-value">{'\u20B9'}{p.earned}</div>
          </div>
        </div>

        <div className="ce-breakdown-section">
          <div className="ce-breakdown-title">COMMISSION BREAKDOWN</div>

          {/* Row 1 */}
          <div className="ce-breakdown-row">
            {breakdownData.breakdown[0].map((item, i) => item && (
              <div className="ce-breakdown-card" key={i}>
                {item.split && <span className="ce-breakdown-split">{item.split}</span>}
                <div className="ce-breakdown-level">{item.level}</div>
                <div className="ce-breakdown-name">{item.name}</div>
                <div className="ce-breakdown-amount">{item.amount}</div>
                <span className="ce-breakdown-status">{item.status}</span>
              </div>
            ))}
          </div>

          {/* Row 2 */}
          <div className="ce-breakdown-row">
            {breakdownData.breakdown[1].map((item, i) => item && (
              <div className="ce-breakdown-card" key={i}>
                {item.split && <span className="ce-breakdown-split">{item.split}</span>}
                <div className="ce-breakdown-level">{item.level}</div>
                <div className="ce-breakdown-name">{item.name}</div>
                <div className="ce-breakdown-amount">{item.amount}</div>
                <span className="ce-breakdown-status">{item.status}</span>
              </div>
            ))}
          </div>

          {/* Row 3 */}
          <div className="ce-breakdown-row">
            {breakdownData.breakdown[2].map((item, i) => item ? (
              <div className="ce-breakdown-card" key={i}>
                {item.split && <span className="ce-breakdown-split">{item.split}</span>}
                <div className="ce-breakdown-level">{item.level}</div>
                <div className="ce-breakdown-name">{item.name}</div>
                <div className="ce-breakdown-amount">{item.amount}</div>
                <span className="ce-breakdown-status">{item.status}</span>
              </div>
            ) : <div key={i} style={{ flex: 1, minWidth: 200 }} />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ce">
      <h1 className="ce-title">Commission Engine</h1>

      <div className="ce-tabs">
        <button className={`ce-tab ${activeTab === 'simulator' ? 'active' : ''}`} onClick={() => setActiveTab('simulator')}>Sale Simulator</button>
        <button className={`ce-tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>Overview</button>
      </div>

      {/* === SALE SIMULATOR TAB === */}
      {activeTab === 'simulator' && (
        <div className="ce-two-col">
          <div className="ce-card">
            <div className="ce-card-title">SALE SIMULATOR</div>
            <div className="ce-form-group">
              <label className="ce-label">Promoter Code</label>
              <input className="ce-input" placeholder="Enter Promoter Code(Mobile Number)" value={simForm.promoterCode} onChange={e => setSimForm({...simForm, promoterCode: e.target.value})} />
            </div>
            <div className="ce-form-group">
              <label className="ce-label">Select Billing shop</label>
              <select className="ce-select" value={simForm.billingShop} onChange={e => setSimForm({...simForm, billingShop: e.target.value})}>
                <option>Lakshmi Electronics - Hunsur Town Hobli</option>
                <option>Srinivasa Electronics - Jayapura Hobli</option>
                <option>Star Appliances - Bettadapura Hobli</option>
              </select>
            </div>
            <div className="ce-form-group">
              <label className="ce-label">Product Name</label>
              <input className="ce-input" placeholder="Enter Product Name" value={simForm.productName} onChange={e => setSimForm({...simForm, productName: e.target.value})} />
            </div>
            <div className="ce-form-group">
              <label className="ce-label">Quantity</label>
              <select className="ce-select" value={simForm.quantity} onChange={e => setSimForm({...simForm, quantity: e.target.value})}>
                <option value="">Select Quantity</option>
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>5</option>
              </select>
            </div>
            <div className="ce-form-group">
              <label className="ce-label">Select Date & Time</label>
              <input type="datetime-local" className="ce-input" value={simForm.dateTime} onChange={e => setSimForm({...simForm, dateTime: e.target.value})} />
            </div>
            <button className="ce-btn ce-btn-primary" style={{ marginTop: 8 }}>Apply Code</button>
          </div>

          <div className="ce-card">
            <div className="ce-card-title">COMMISSION RULES BY LEVEL</div>
            <table className="ce-rules-table">
              <thead>
                <tr>
                  <th>LEVEL</th>
                  <th>PER SALE</th>
                  <th>CONDITION</th>
                  <th>DEDUCTION</th>
                </tr>
              </thead>
              <tbody>
                {commissionRules.map((r, i) => (
                  <tr key={i}>
                    <td><span className={`ce-level-badge ${r.badge}`}>{r.level}</span></td>
                    <td>{r.perSale}</td>
                    <td><span className="ce-condition">{r.condition}</span></td>
                    <td><span className="ce-deduction">{r.deduction}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* === OVERVIEW TAB === */}
      {activeTab === 'overview' && (
        <>
          <div className="ce-filters">
            <input
              className="ce-search"
              placeholder="Search by name or code"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="ce-filters">
            <div className="ce-form-group" style={{ marginBottom: 0 }}>
              <label className="ce-label">Role</label>
              <select className="ce-select" style={{ minWidth: 120 }} value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
                <option value="">Select Role</option>
                <option>Promoter</option>
                <option>Taluk Admin</option>
                <option>District Admin</option>
              </select>
            </div>
            <div className="ce-form-group" style={{ marginBottom: 0 }}>
              <label className="ce-label">Select Date</label>
              <select className="ce-select" style={{ minWidth: 140 }} value={dateFilter} onChange={e => setDateFilter(e.target.value)}>
                <option value="last7">Last 7 days</option>
                <option value="last30">Last 30 days</option>
                <option value="last90">Last 90 days</option>
              </select>
            </div>
            <div className="ce-form-group" style={{ marginBottom: 0 }}>
              <label className="ce-label">From</label>
              <input type="date" className="ce-input" style={{ minWidth: 140 }} />
            </div>
            <div className="ce-form-group" style={{ marginBottom: 0 }}>
              <label className="ce-label">To</label>
              <input type="date" className="ce-input" style={{ minWidth: 140 }} />
            </div>
          </div>

          <div className="ce-table-card">
            <table className="ce-table">
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
                      <span style={{ fontWeight: 600, display: 'block' }}>{c.promoter}</span>
                      <span style={{ fontSize: 11, color: '#94a3b8' }}>{c.code}</span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 500, display: 'block' }}>{c.shop}</span>
                      <span style={{ fontSize: 11, color: '#94a3b8' }}>{c.hobli}</span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 500, display: 'block' }}>{c.product}</span>
                      <span style={{ fontSize: 12, color: '#64748b' }}>{'\u20B9'}{c.price}</span>
                    </td>
                    <td>{c.district}</td>
                    <td>{c.taluk}</td>
                    <td>
                      <div className="ce-status-cell">
                        <span className={`ce-badge ${c.status.toLowerCase()}`}>{c.status}</span>
                        <span className="ce-badge kyc">{c.kyc}</span>
                      </div>
                    </td>
                    <td>
                      <button className="ce-action-btn" onClick={() => setViewDetail(c)}>
                        <MdVisibility />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
