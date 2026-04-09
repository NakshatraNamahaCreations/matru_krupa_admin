import React, { useState } from 'react';
import { MdArrowBack, MdVisibility, MdDelete, MdPerson, MdWarning } from 'react-icons/md';
import './HierarchySetup.css';

const commissionRules = [
  { level: 'STATE ADMIN', badge: 'state', creates: 'Assistant District Admin', commission: '\u20B91,000 per sale', split: '-' },
  { level: 'ASS DISTRICT ADMIN', badge: 'ass-district', creates: 'District Admins', commission: '\u20B91,000 per sale', split: '-' },
  { level: 'DISTRICT ADMIN', badge: 'district', creates: 'Taluk Admins', commission: '\u20B91,000 per sale', split: 'by %' },
  { level: 'TALUK ADMIN', badge: 'taluk', creates: 'Promoters + Shops', commission: '\u20B91,000 per sale', split: '-' },
  { level: 'PROMOTERS', badge: 'promoter', creates: 'Brings Buyers', commission: '\u20B92,000 per sale', split: '-' },
];

const demoAdmins = [
  { sl: 1, level: 'State Admin', name: 'Suresh', id: 'KA-SA-001', email: 'Suresh@gmail.com', phone: '9991773013', status: 'Active' },
  { sl: 2, level: 'Assistant District Admin', name: 'Ravi', id: 'KA-ADA-002', email: 'Ravi@gmail.com', phone: '9089208890', status: 'Active' },
  { sl: 3, level: 'District Admin', name: 'Mahesh', id: 'KA-DA-003', email: 'Mahesh@gmail.com', phone: '9297409109', status: 'Active' },
  { sl: 4, level: 'District Admin', name: 'Ankit', id: 'KA-DA-004', email: 'Ankit123@gmail.com', phone: '9809102849', status: 'Active' },
  { sl: 5, level: 'Taluk Admin', name: 'Manish', id: 'KA-TA-009', email: 'Manish@gmail.com', phone: '8907654329', status: 'Active' },
];

const demoSplitData = [
  { name: 'Suresh', pct: 50, color: '#3b82f6', earned: 4500 },
  { name: 'Deepak', pct: 30, color: '#22c55e', earned: 3300 },
  { name: 'Karthik', pct: 20, color: '#f59e0b', earned: 2200 },
];

const demoShops = [
  { name: 'Lakshmi Electronics', code: 'MK-KA-001', hobli: 'Jayapura', owner: 'Sujay', sales: 10, status: 'Active' },
  { name: 'Star Appliances', code: 'MK-KA-002', hobli: 'Hunsur Town', owner: 'Ajith', sales: 6, status: 'Active' },
  { name: 'Srikanth Electronics', code: 'MK-KA-003', hobli: 'Bettadapura', owner: 'Raman', sales: 14, status: 'Active' },
];

const hobliData = [
  { name: 'Jayapura hobli', shops: 3, sales: 10 },
  { name: 'Hunsur Town', shops: 3, sales: 10 },
  { name: 'Koppa hobli', shops: 3, sales: 10 },
  { name: 'Bettadapura Hobli', shops: 3, sales: 10 },
];

const adminDetail = {
  name: 'Ravi', email: 'Ravi@gmail.com', phone: '9089208890', role: 'Assistant District Admin',
  personal: { fullName: 'Ravi', mobile: '9089208890', email: 'Ravi@gmail.com', aadhar: '8902 8937 1257', pan: 'KL22M78T' },
  location: { state: 'Karnataka', district: 'Mysuru', taluk: 'Hunsur', pincode: 'N/A' },
  bank: { holder: 'Ravi', account: '5097289089208890', ifsc: 'KB1009200', bank: 'Karnataka Bank', branch: 'Jp Nagar' },
};

export default function HierarchySetup() {
  const [activeTab, setActiveTab] = useState('create');
  const [viewDetail, setViewDetail] = useState(null);
  const [adminLevel, setAdminLevel] = useState('Taluk Admin');
  const [splitDistrict, setSplitDistrict] = useState('Mysore');
  const [splits, setSplits] = useState(demoSplitData.map(d => ({ ...d })));

  // Form states
  const [formData, setFormData] = useState({
    fullName: '', dob: '', district: '', talukName: '',
    mobile: '', email: '', aadhar: '', pan: '',
    bankName: '', accountNumber: '', accountHolder: '', ifsc: '', accountType: 'Savings',
  });

  // Shop form
  const [shopForm, setShopForm] = useState({
    talukCode: '', hobli: 'Hunsur Town Hobli', shopName: '', ownerName: '',
    mobile: '', email: '', gst: '', address: '', category: 'Electronics', pos: 'Matru Krupa POS',
  });

  const tabs = [
    { key: 'create', label: 'Create Admin' },
    { key: 'overview', label: 'Overview' },
    { key: 'split', label: 'District Admin split %' },
    { key: 'shop', label: 'Shop Registration' },
  ];

  const handleSlider = (idx, val) => {
    const updated = [...splits];
    updated[idx].pct = parseInt(val);
    setSplits(updated);
  };

  // Detail View
  if (viewDetail) {
    return (
      <div className="hs">
        <h1 className="hs-title">Hierarchy Setup</h1>
        <p className="hs-subtitle">Build the state &rarr; district &rarr; taluk &rarr; hobli &rarr; shop network. Each level creates the next.</p>
        <button className="hs-back-btn" onClick={() => setViewDetail(null)}>
          <MdArrowBack /> Back
        </button>
        <div className="hs-profile-card">
          <div className="hs-profile-header">
            <div className="hs-profile-avatar"><MdPerson /></div>
            <div className="hs-profile-info">
              <h3>{adminDetail.name}</h3>
              <p>{adminDetail.email} &middot; {adminDetail.phone}</p>
            </div>
          </div>
          <span className="hs-profile-role-badge">{adminDetail.role}</span>
        </div>

        <div className="hs-detail-tabs">
          <button className="hs-detail-tab active">Person Details</button>
        </div>

        <div className="hs-detail-grid">
          <div className="hs-detail-section">
            <h4>Personal Information</h4>
            {Object.entries(adminDetail.personal).map(([key, val]) => (
              <div className="hs-detail-row" key={key}>
                <div className="hs-detail-label">{key === 'fullName' ? 'Full Name' : key === 'mobile' ? 'Mobile Number' : key === 'email' ? 'Email ID' : key === 'aadhar' ? 'Aadhar Number' : 'Pan Number'}</div>
                <div className="hs-detail-value">{val}</div>
              </div>
            ))}
          </div>
          <div className="hs-detail-section">
            <h4>Location Information</h4>
            {Object.entries(adminDetail.location).map(([key, val]) => (
              <div className="hs-detail-row" key={key}>
                <div className="hs-detail-label">{key.charAt(0).toUpperCase() + key.slice(1)}</div>
                <div className="hs-detail-value">{val}</div>
              </div>
            ))}
          </div>
          <div className="hs-detail-section">
            <h4>Bank Account Information</h4>
            <div className="hs-detail-row">
              <div className="hs-detail-label">Account Holder Name</div>
              <div className="hs-detail-value">{adminDetail.bank.holder}</div>
            </div>
            <div className="hs-detail-row">
              <div className="hs-detail-label">Account Number</div>
              <div className="hs-detail-value">{adminDetail.bank.account}</div>
            </div>
            <div className="hs-detail-row">
              <div className="hs-detail-label">IFSC Code</div>
              <div className="hs-detail-value">{adminDetail.bank.ifsc}</div>
            </div>
            <div className="hs-detail-row">
              <div className="hs-detail-label">Bank name</div>
              <div className="hs-detail-value">{adminDetail.bank.bank}</div>
            </div>
            <div className="hs-detail-row">
              <div className="hs-detail-label">Branch</div>
              <div className="hs-detail-value">{adminDetail.bank.branch}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="hs">
      <h1 className="hs-title">Hierarchy Setup</h1>
      <p className="hs-subtitle">Build the state &rarr; district &rarr; taluk &rarr; hobli &rarr; shop network. Each level creates the next.</p>

      <div className="hs-tabs">
        {tabs.map(t => (
          <button key={t.key} className={`hs-tab ${activeTab === t.key ? 'active' : ''}`} onClick={() => setActiveTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* === CREATE ADMIN TAB === */}
      {activeTab === 'create' && (
        <div className="hs-two-col">
          <div className="hs-card">
            <div className="hs-card-title">NEW ADMIN SETUP</div>
            <div className="hs-form-group">
              <label className="hs-label">Admin Level</label>
              <select className="hs-select" value={adminLevel} onChange={e => setAdminLevel(e.target.value)}>
                <option>Taluk Admin</option>
                <option>District Admin</option>
                <option>Assistant District Admin</option>
                <option>State Admin</option>
              </select>
            </div>
            <div className="hs-form-group">
              <label className="hs-label">Full Name</label>
              <input className="hs-input" placeholder="Enter Full Name" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
            </div>
            <div className="hs-row">
              <div className="hs-form-group">
                <label className="hs-label">Date of Birth</label>
                <input type="date" className="hs-input" value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} />
              </div>
              <div className="hs-form-group">
                <label className="hs-label">{adminLevel === 'Taluk Admin' ? 'District(Parent)' : 'District'}</label>
                <select className="hs-select" value={formData.district} onChange={e => setFormData({...formData, district: e.target.value})}>
                  <option value="">Select District</option>
                  <option>Mysuru</option>
                  <option>Bangalore</option>
                  <option>Mangalore</option>
                </select>
              </div>
            </div>
            {adminLevel === 'Taluk Admin' && (
              <div className="hs-form-group">
                <label className="hs-label">Taluk Name</label>
                <input className="hs-input" placeholder="e.g. Hunsur" value={formData.talukName} onChange={e => setFormData({...formData, talukName: e.target.value})} />
              </div>
            )}
            <div className="hs-row">
              <div className="hs-form-group">
                <label className="hs-label">Mobile Number</label>
                <input className="hs-input" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} />
              </div>
              <div className="hs-form-group">
                <label className="hs-label">Email Id</label>
                <input className="hs-input" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
            </div>
            <div className="hs-form-group">
              <label className="hs-label">Aadhar Number</label>
              <input className="hs-input" value={formData.aadhar} onChange={e => setFormData({...formData, aadhar: e.target.value})} />
            </div>
            <div className="hs-form-group">
              <label className="hs-label">PAN Number</label>
              <input className="hs-input" value={formData.pan} onChange={e => setFormData({...formData, pan: e.target.value})} />
            </div>

            {/* Bank Details */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 24, marginBottom: 16 }}>
              <div className="hs-card-title" style={{ marginBottom: 0 }}>BANK DETAILS</div>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#16a34a', background: '#dcfce7', padding: '3px 12px', borderRadius: 20 }}>For payout</span>
            </div>
            <div className="hs-form-group">
              <label className="hs-label">Bank Name</label>
              <input className="hs-input" placeholder="Enter Bank Name" value={formData.bankName} onChange={e => setFormData({...formData, bankName: e.target.value})} />
            </div>
            <div className="hs-form-group">
              <label className="hs-label">Account Number</label>
              <input className="hs-input" placeholder="Enter Account Number" value={formData.accountNumber} onChange={e => setFormData({...formData, accountNumber: e.target.value})} />
            </div>
            <div className="hs-form-group">
              <label className="hs-label">Account Holder Name</label>
              <input className="hs-input" placeholder="Enter Account Holder Name" value={formData.accountHolder} onChange={e => setFormData({...formData, accountHolder: e.target.value})} />
            </div>
            <div className="hs-row">
              <div className="hs-form-group">
                <label className="hs-label">IFSC Code</label>
                <input className="hs-input" placeholder="Enter IFSC Code" value={formData.ifsc} onChange={e => setFormData({...formData, ifsc: e.target.value})} />
              </div>
              <div className="hs-form-group">
                <label className="hs-label">Account Type</label>
                <select className="hs-select" value={formData.accountType} onChange={e => setFormData({...formData, accountType: e.target.value})}>
                  <option>Savings</option>
                  <option>Current</option>
                </select>
              </div>
            </div>
            <button className="hs-btn hs-btn-primary" style={{ marginTop: 16 }}>Create Admin</button>
          </div>

          <div className="hs-card">
            <div className="hs-card-title">COMMISSION RULES BY LEVEL</div>
            <table className="hs-rules-table">
              <thead>
                <tr>
                  <th>LEVEL</th>
                  <th>CREATES</th>
                  <th>COMMISSION/SALE</th>
                  <th>SPLIT</th>
                </tr>
              </thead>
              <tbody>
                {commissionRules.map((r, i) => (
                  <tr key={i}>
                    <td><span className={`hs-level-badge ${r.badge}`}>{r.level}</span></td>
                    <td>{r.creates}</td>
                    <td>{r.commission}</td>
                    <td>{r.split === 'by %' ? <span className="hs-split-link">{r.split}</span> : r.split}</td>
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
          <div className="hs-overview-filters">
            <div className="hs-form-group" style={{ marginBottom: 0 }}>
              <label className="hs-label">Select Level</label>
              <select className="hs-select" style={{ minWidth: 120 }}>
                <option>All</option>
                <option>State Admin</option>
                <option>Assistant District Admin</option>
                <option>District Admin</option>
                <option>Taluk Admin</option>
              </select>
            </div>
            <div className="hs-form-group" style={{ marginBottom: 0 }}>
              <label className="hs-label">Status</label>
              <select className="hs-select" style={{ minWidth: 100 }}>
                <option>All</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
          </div>
          <div className="hs-table-card">
            <table className="hs-table">
              <thead>
                <tr>
                  <th>Sl. No</th>
                  <th>Level</th>
                  <th>Name</th>
                  <th>Admin ID</th>
                  <th>Contact Details</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {demoAdmins.map(a => (
                  <tr key={a.sl}>
                    <td>{a.sl}</td>
                    <td>{a.level}</td>
                    <td style={{ fontWeight: 600 }}>{a.name}</td>
                    <td>{a.id}</td>
                    <td>
                      <span style={{ display: 'block' }}>{a.email}</span>
                      <span style={{ fontSize: 12, color: '#64748b' }}>{a.phone}</span>
                    </td>
                    <td><span className="hs-active-badge">{a.status}</span></td>
                    <td>
                      <button className="hs-action-btn" onClick={() => setViewDetail(a)}><MdVisibility /></button>
                      <button className="hs-action-btn delete"><MdDelete /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* === DISTRICT SPLIT TAB === */}
      {activeTab === 'split' && (
        <div className="hs-two-col">
          <div className="hs-split-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div className="hs-split-title">DISTRICT SPLIT EDITOR</div>
              <div className="hs-form-group" style={{ marginBottom: 0 }}>
                <label className="hs-label">Select District</label>
                <select className="hs-select" style={{ minWidth: 140 }} value={splitDistrict} onChange={e => setSplitDistrict(e.target.value)}>
                  <option>Mysore</option>
                  <option>Bangalore</option>
                  <option>Mangalore</option>
                </select>
              </div>
            </div>

            <div className="hs-split-warning">
              <MdWarning className="hs-split-warning-icon" />
              <div className="hs-split-warning-text">
                Total Must be equal to 100%. Changes only applies to future sales.<br />
                Existing credited commissions are unaffected.
              </div>
            </div>

            {splits.map((s, i) => (
              <div className="hs-slider-row" key={i}>
                <span className="hs-slider-dot" style={{ background: s.color }} />
                <span className="hs-slider-name">{s.name}</span>
                <input
                  type="range"
                  className="hs-slider"
                  min="0"
                  max="100"
                  value={s.pct}
                  onChange={e => handleSlider(i, e.target.value)}
                />
                <span className="hs-slider-pct" style={{ color: s.color }}>{s.pct}%</span>
              </div>
            ))}

            <div className="hs-split-actions">
              <button className="hs-btn hs-btn-primary">+Add District Admin</button>
              <button className="hs-btn hs-btn-outline">Save Split</button>
            </div>
          </div>

          <div>
            <div className="hs-split-card" style={{ marginBottom: 20 }}>
              <div className="hs-earned-title">Commission earned this month</div>
              {splits.map((s, i) => (
                <div className="hs-bar-row" key={i}>
                  <span className="hs-bar-name">{s.name}</span>
                  <div className="hs-bar-track">
                    <div className="hs-bar-fill" style={{ width: `${s.pct}%`, background: s.color }} />
                  </div>
                  <span className="hs-bar-pct" style={{ color: s.color }}>{s.pct}%</span>
                </div>
              ))}
              <table className="hs-earned-table">
                <tbody>
                  {splits.map((s, i) => (
                    <tr key={i}>
                      <td>{s.name}</td>
                      <td>{'\u20B9'}{s.earned.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="hs-split-card">
              <div className="hs-impact-section">
                <div className="hs-impact-title">IMPACT PREVIEW</div>
                <span className="hs-impact-badge">{'\u20B9'}1,000 Commission per sale</span>
                {splits.map((s, i) => (
                  <div className="hs-impact-card" key={i}>
                    <div>
                      <div className="hs-impact-name">{s.name}</div>
                      <div className="hs-impact-desc">{s.pct}% of {'\u20B9'}1,000 per sale</div>
                    </div>
                    <div className="hs-impact-amount">{'\u20B9'}{(1000 * s.pct / 100).toFixed(0)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* === SHOP REGISTRATION TAB === */}
      {activeTab === 'shop' && (
        <div className="hs-two-col">
          <div className="hs-card">
            <div className="hs-card-title">REGISTER SHOP UNDER HOBLI</div>
            <div className="hs-form-group">
              <label className="hs-label">Taluk Admin Code</label>
              <input className="hs-input" placeholder="e.g KA-TA-001" value={shopForm.talukCode} onChange={e => setShopForm({...shopForm, talukCode: e.target.value})} />
            </div>
            <div className="hs-form-group">
              <label className="hs-label">Select Hobli</label>
              <select className="hs-select" value={shopForm.hobli} onChange={e => setShopForm({...shopForm, hobli: e.target.value})}>
                <option>Hunsur Town Hobli</option>
                <option>Jayapura Hobli</option>
                <option>Koppa Hobli</option>
                <option>Bettadapura Hobli</option>
              </select>
            </div>
            <div className="hs-form-group">
              <label className="hs-label">Shop Name</label>
              <input className="hs-input" placeholder="Enter shop name" value={shopForm.shopName} onChange={e => setShopForm({...shopForm, shopName: e.target.value})} />
            </div>
            <div className="hs-form-group">
              <label className="hs-label">Owner Full Name</label>
              <input className="hs-input" placeholder="Enter owner full name" value={shopForm.ownerName} onChange={e => setShopForm({...shopForm, ownerName: e.target.value})} />
            </div>
            <div className="hs-row">
              <div className="hs-form-group">
                <label className="hs-label">Mobile Number</label>
                <input className="hs-input" value={shopForm.mobile} onChange={e => setShopForm({...shopForm, mobile: e.target.value})} />
              </div>
              <div className="hs-form-group">
                <label className="hs-label">Email Id</label>
                <input className="hs-input" value={shopForm.email} onChange={e => setShopForm({...shopForm, email: e.target.value})} />
              </div>
            </div>
            <div className="hs-form-group">
              <label className="hs-label">GST Number</label>
              <input className="hs-input" value={shopForm.gst} onChange={e => setShopForm({...shopForm, gst: e.target.value})} />
            </div>
            <div className="hs-form-group">
              <label className="hs-label">Shop Address</label>
              <input className="hs-input" value={shopForm.address} onChange={e => setShopForm({...shopForm, address: e.target.value})} />
            </div>
            <div className="hs-row">
              <div className="hs-form-group">
                <label className="hs-label">Shop Category</label>
                <select className="hs-select" value={shopForm.category} onChange={e => setShopForm({...shopForm, category: e.target.value})}>
                  <option>Electronics</option>
                  <option>General</option>
                  <option>Appliances</option>
                </select>
              </div>
              <div className="hs-form-group">
                <label className="hs-label">POS System</label>
                <select className="hs-select" value={shopForm.pos} onChange={e => setShopForm({...shopForm, pos: e.target.value})}>
                  <option>Matru Krupa POS</option>
                  <option>External POS</option>
                </select>
              </div>
            </div>
            <button className="hs-btn hs-btn-primary" style={{ marginTop: 16 }}>Register Shop</button>
          </div>

          <div>
            {/* Filters & Hobli Coverage */}
            <div className="hs-card" style={{ marginBottom: 20 }}>
              <div className="hs-shop-filters">
                <div className="hs-form-group" style={{ marginBottom: 0 }}>
                  <label className="hs-label">Select Taluk</label>
                  <select className="hs-select" style={{ minWidth: 120 }}>
                    <option>Hunsur</option>
                    <option>Mysuru</option>
                  </select>
                </div>
                <div className="hs-form-group" style={{ marginBottom: 0 }}>
                  <label className="hs-label">Select Date</label>
                  <select className="hs-select" style={{ minWidth: 140 }}>
                    <option>Last 30 days</option>
                    <option>Last 7 days</option>
                    <option>Last 90 days</option>
                  </select>
                </div>
                <div className="hs-form-group" style={{ marginBottom: 0 }}>
                  <label className="hs-label">From</label>
                  <input type="date" className="hs-input" />
                </div>
                <div className="hs-form-group" style={{ marginBottom: 0 }}>
                  <label className="hs-label">To</label>
                  <input type="date" className="hs-input" />
                </div>
              </div>

              <div className="hs-hobli-label" style={{ fontWeight: 700, fontSize: 13, color: '#1e293b', marginBottom: 12 }}>HOBLI COVERAGE</div>
              <div className="hs-hobli-grid">
                {hobliData.map((h, i) => (
                  <div className="hs-hobli-card" key={i}>
                    <div className="hs-hobli-name">{h.name}</div>
                    <div className="hs-hobli-shops">{h.shops} shops</div>
                    <div className="hs-hobli-sales">{h.sales} sales</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Registered Shops */}
            <div className="hs-table-card">
              <div style={{ padding: '16px 20px', fontWeight: 700, fontSize: 14, color: '#1e293b' }}>Registered Shops</div>
              <table className="hs-table">
                <thead>
                  <tr>
                    <th>Shop Name</th>
                    <th>Hobli</th>
                    <th>Owner</th>
                    <th>Sales</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {demoShops.map((s, i) => (
                    <tr key={i}>
                      <td>
                        <span style={{ fontWeight: 600, display: 'block' }}>{s.name}</span>
                        <span style={{ fontSize: 11, color: '#94a3b8' }}>{s.code}</span>
                      </td>
                      <td>{s.hobli}</td>
                      <td>{s.owner}</td>
                      <td>{s.sales}</td>
                      <td><span className="hs-active-badge">{s.status}</span></td>
                      <td>
                        <button className="hs-action-btn"><MdVisibility /></button>
                        <button className="hs-action-btn delete"><MdDelete /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
