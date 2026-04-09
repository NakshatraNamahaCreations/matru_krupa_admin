import { useState } from 'react';
import { MdVisibility, MdDelete, MdCheckCircle, MdInfo } from 'react-icons/md';
import './KycVerification.css';

const roleTabs = ['Overview', 'State Admin', 'Assistant District Admin', 'District Admin', 'Taluk Admin', 'Promoters'];

// Data per role tab
const kycDataByRole = {
  'State Admin': {
    title: 'STATE ADMIN KYC',
    formTitle: 'STATE ADMIN SELF REGISTERED FORM',
    codeLabel: null,
    persons: [
      { name: 'Suresh', initial: 'S', color: '#3b82f6', code: 'KA-SA-001', role: 'State Admin', location: 'Karnataka', kycStatus: 'KYC Pending', heldAmount: '0', balance: '\u20B90' },
    ],
  },
  'Assistant District Admin': {
    title: 'ASS. DISTRICT ADMIN KYC',
    formTitle: 'ASS DISTRICT ADMIN SELF REGISTERED FORM',
    codeLabel: 'Admin Code (Assigned by State Admin)',
    persons: [
      { name: 'Ravi', initial: 'R', color: '#ef4444', code: 'KA-ADA-002', role: 'Ass. District Admin', location: 'Mysore', kycStatus: 'KYC Pending', heldAmount: '20,000', heldLabel: 'Held Commission' },
    ],
  },
  'District Admin': {
    title: 'DISTRICT ADMIN KYC',
    formTitle: 'DISTRICT ADMIN SELF REGISTERED FORM',
    codeLabel: 'Admin Code (Assigned by Assistant District Admin)',
    persons: [
      { name: 'Mahesh', initial: 'M', color: '#3b82f6', code: 'KA-DA-003', role: 'District Admin', location: 'Mysore', kycStatus: 'KYC Pending', heldAmount: '16,000', heldLabel: 'Held Commission' },
      { name: 'Ankit', initial: 'A', color: '#3b82f6', code: 'KA-DA-004', role: 'District Admin', location: 'Mysore', kycStatus: 'KYC Pending', heldAmount: '20,000', heldLabel: 'Held Commission' },
    ],
  },
  'Taluk Admin': {
    title: 'TALUK ADMIN KYC',
    formTitle: 'TALUK ADMIN SELF REGISTERED FORM',
    codeLabel: 'Taluk Admin Code',
    persons: [
      { name: 'Sushant', initial: 'S', color: '#3b82f6', code: 'KA-TA-003', role: 'Taluk Admin', location: 'Mysore', kycStatus: 'KYC Pending', heldAmount: '16,000', heldLabel: 'Held Commission' },
      { name: 'Purav', initial: 'P', color: '#3b82f6', code: 'KA-TA-004', role: 'Taluk Admin', location: 'Mysore', kycStatus: 'KYC Pending', heldAmount: '20,000', heldLabel: 'Held Commission' },
    ],
  },
  'Promoters': {
    title: 'PROMOTER KYC',
    formTitle: 'PROMOTER SELF REGISTERED FORM',
    codeLabel: 'Promoter Code',
    persons: [
      { name: 'Anish', initial: 'A', color: '#3b82f6', code: 'KA-PA-003', role: 'Promoter', location: 'Mysore', kycStatus: 'KYC Pending', heldAmount: '16,000', heldLabel: 'Held Commission' },
      { name: 'Rahul', initial: 'R', color: '#ef4444', code: 'KA-PA-004', role: 'Promoter', location: 'Mysore', kycStatus: 'KYC Pending', heldAmount: '20,000', heldLabel: 'Held Commission' },
    ],
  },
};

const kycDocs = [
  { name: 'Aadhar Card', value: 'xxxx xxxx 3901', status: 'Verified' },
  { name: 'PAN Card', value: 'KP019083903', status: 'Verified' },
  { name: 'Bank Account', value: 'SBI A/C ending 3901', extra: 'IFSC: SBI127930', status: 'Verified' },
];

const formData = {
  fullName: 'Suresh', dob: '02/10/1992', mobile: '9991773013', email: 'Suresh@gmail.com',
  address: 'Karnataka', aadhar: '9801 9303 3901', pan: 'KP019083903',
  bankAccount: '78012 89303 13901', ifsc: 'SBI127930',
};

const overviewData = [
  { sl: 1, level: 'State Admin', name: 'Suresh', code: 'KA-SA-001', district: 'Mysuru', held: '20,000', aadhar: true, pan: true, bank: false, status: 'Pending' },
  { sl: 2, level: 'Assistant District Admin', name: 'Ravi', code: 'KA-ADA-002', district: 'Mysuru', held: '16,000', aadhar: true, pan: true, bank: false, status: 'Pending' },
  { sl: 3, level: 'District Admin', name: 'Mahesh', code: 'KA-DA-003', district: 'Mysuru', held: '24,000', aadhar: true, pan: true, bank: false, status: 'Pending' },
  { sl: 4, level: 'District Admin', name: 'Ankit', code: 'KA-DA-004', district: 'Mysuru', held: '20,000', aadhar: true, pan: true, bank: true, status: 'Pending' },
  { sl: 5, level: 'Taluk Admin', name: 'Manish', code: 'KA-TA-009', district: 'Mysuru/ Hunsur Town', held: '19,000', aadhar: true, pan: true, bank: false, status: 'Pending' },
  { sl: 6, level: 'Promoter', name: 'Ankit', code: 'KA-PA-006', district: 'Mysuru/ Nanjungud', held: '20,000', aadhar: true, pan: true, bank: false, status: 'Pending' },
];

export default function KycVerification() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [selectedPerson, setSelectedPerson] = useState(0);

  const roleData = kycDataByRole[activeTab];

  return (
    <div className="kyc">
      <h1 className="kyc-title">KYC Verification Requests</h1>

      <div className="kyc-tabs">
        {roleTabs.map(t => (
          <button key={t} className={`kyc-tab ${activeTab === t ? 'active' : ''}`} onClick={() => { setActiveTab(t); setSelectedPerson(0); }}>
            {t}
          </button>
        ))}
      </div>

      {/* === OVERVIEW TAB === */}
      {activeTab === 'Overview' && (
        <>
          <div className="kyc-filter-bar">
            <div className="kyc-filter-group">
              <label className="kyc-filter-label">Level</label>
              <select className="kyc-select"><option>All</option><option>State Admin</option><option>District Admin</option><option>Taluk Admin</option><option>Promoter</option></select>
            </div>
            <div className="kyc-filter-group">
              <label className="kyc-filter-label">Select Date</label>
              <select className="kyc-select"><option>Last 7 days</option><option>Last 30 days</option></select>
            </div>
            <div className="kyc-filter-group">
              <label className="kyc-filter-label">From</label>
              <input type="date" className="kyc-input" />
            </div>
            <div className="kyc-filter-group">
              <label className="kyc-filter-label">To</label>
              <input type="date" className="kyc-input" />
            </div>
            <div className="kyc-filter-group">
              <label className="kyc-filter-label">Status</label>
              <select className="kyc-select"><option>Pending</option><option>Verified</option><option>All</option></select>
            </div>
          </div>

          <div className="kyc-stats">
            <div className="kyc-stat-card">
              <div className="kyc-stat-label">TOTAL KYC PENDING</div>
              <div className="kyc-stat-value" style={{ color: '#3b82f6' }}>43</div>
              <div className="kyc-stat-sub">Across all 5 levels</div>
            </div>
            <div className="kyc-stat-card">
              <div className="kyc-stat-label">TOTAL COMMISSION HELD</div>
              <div className="kyc-stat-value" style={{ color: '#ea580c' }}>{'\u20B9'}2,47,000</div>
              <div className="kyc-stat-sub">All levels combined</div>
            </div>
            <div className="kyc-stat-card">
              <div className="kyc-stat-label">VERIFIED KYC REQUESTS</div>
              <div className="kyc-stat-value" style={{ color: '#16a34a' }}>10</div>
              <div className="kyc-stat-sub">Admin Verified</div>
            </div>
          </div>

          <div className="kyc-table-card">
            <table className="kyc-table">
              <thead>
                <tr>
                  <th>Sl. No</th>
                  <th>Level</th>
                  <th>Name</th>
                  <th>District/Taluk</th>
                  <th>Commission Held</th>
                  <th>Aadhar</th>
                  <th>PAN</th>
                  <th>Bank</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {overviewData.map(o => (
                  <tr key={o.sl}>
                    <td>{o.sl}</td>
                    <td>{o.level}</td>
                    <td>
                      <span style={{ fontWeight: 600, display: 'block' }}>{o.name}</span>
                      <span style={{ fontSize: 11, color: '#94a3b8' }}>{o.code}</span>
                    </td>
                    <td>{o.district}</td>
                    <td style={{ fontWeight: 600 }}>{'\u20B9'}{o.held}</td>
                    <td>{o.aadhar ? <span className="kyc-check">&#10003;</span> : <span className="kyc-cross">&#10007;</span>}</td>
                    <td>{o.pan ? <span className="kyc-check">&#10003;</span> : <span className="kyc-cross">&#10007;</span>}</td>
                    <td>{o.bank ? <span className="kyc-check">&#10003;</span> : <span className="kyc-cross">&#10007;</span>}</td>
                    <td><span className="kyc-table-badge">{o.status}</span></td>
                    <td>
                      <button className="kyc-table-action"><MdVisibility /></button>
                      <button className="kyc-table-action delete"><MdDelete /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* === ROLE TABS === */}
      {activeTab !== 'Overview' && roleData && (
        <>
          <div className="kyc-filter-bar">
            <div className="kyc-filter-group">
              <label className="kyc-filter-label">State</label>
              <select className="kyc-select"><option>Karnataka</option><option>District</option></select>
            </div>
            <div className="kyc-filter-group">
              <label className="kyc-filter-label">Select Date</label>
              <select className="kyc-select"><option>Last 7 days</option><option>Last 30 days</option></select>
            </div>
            <div className="kyc-filter-group">
              <label className="kyc-filter-label">From</label>
              <input type="date" className="kyc-input" />
            </div>
            <div className="kyc-filter-group">
              <label className="kyc-filter-label">To</label>
              <input type="date" className="kyc-input" />
            </div>
          </div>

          <div className="kyc-two-col">
            {/* Left: KYC Cards + Review */}
            <div>
              <div className="kyc-card-title">
                {roleData.title}
                {roleData.persons.length > 0 && (
                  <span className="kyc-pending-badge">{roleData.persons.length} Pending</span>
                )}
              </div>

              {roleData.persons.map((p, idx) => (
                <div key={idx} className="kyc-person-card" style={{ border: selectedPerson === idx ? '2px solid #3b82f6' : undefined, cursor: 'pointer' }} onClick={() => setSelectedPerson(idx)}>
                  <div className="kyc-person-row">
                    <div className="kyc-person-header">
                      <div className="kyc-person-avatar" style={{ background: p.color }}>{p.initial}</div>
                      <div>
                        <div className="kyc-person-name">{p.name}</div>
                        <div className="kyc-person-meta">{p.code}</div>
                        <div className="kyc-person-meta">{p.role} &bull; {p.location}</div>
                        <div className="kyc-kyc-status">{p.kycStatus}</div>
                      </div>
                    </div>
                    {p.heldLabel && (
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 11, color: '#64748b' }}>{p.heldLabel}</div>
                        <div className="kyc-held-value">{'\u20B9'}{p.heldAmount}</div>
                      </div>
                    )}
                    {!p.heldLabel && p.balance && (
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 11, color: '#64748b' }}>Available Balance</div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: '#16a34a' }}>{p.balance}</div>
                      </div>
                    )}
                  </div>
                  <div className="kyc-person-actions">
                    <button className="kyc-btn kyc-btn-outline">Approve KYC</button>
                    <button className="kyc-btn kyc-btn-outline">Request Re-Submit</button>
                  </div>
                </div>
              ))}

              {/* KYC Review */}
              <div className="kyc-review-title">
                {roleData.title.replace(' KYC', '')} KYC REVIEW: {roleData.persons[selectedPerson]?.name?.toUpperCase()}
              </div>

              {kycDocs.map((doc, i) => (
                <div className="kyc-doc-item" key={i}>
                  <div className="kyc-doc-left">
                    <div className={`kyc-doc-icon ${doc.status === 'Verified' ? 'verified' : 'pending'}`}>
                      {doc.status === 'Verified' ? <MdCheckCircle /> : '...'}
                    </div>
                    <div>
                      <div className="kyc-doc-name">{doc.name}</div>
                      <div className="kyc-doc-value">{doc.value}</div>
                      {doc.extra && <div className="kyc-doc-value">{doc.extra}</div>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className={`kyc-doc-badge ${doc.status.toLowerCase()}`}>{doc.status}</span>
                    {doc.name === 'Bank Account' && doc.status !== 'Verified' && (
                      <div className="kyc-doc-actions">
                        <button className="kyc-doc-btn">Verify</button>
                        <button className="kyc-doc-btn">Reject</button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              <div className="kyc-progress-label">KYC Completion 2/3 Steps Complete</div>
              <div className="kyc-progress-bar">
                <div className="kyc-progress-fill" style={{ width: '66%' }} />
              </div>

              <div className="kyc-progress-note">
                2/3 KYC Verified. Withdrawal is locked. 5% TDS + 5% service charge applies at each withdrawal.
              </div>
            </div>

            {/* Right: Self Registered Form */}
            <div className="kyc-card">
              <div className="kyc-card-title">{roleData.formTitle}</div>

              <div className="kyc-info-banner">
                <MdInfo style={{ fontSize: 18, flexShrink: 0 }} />
                State Admins are onboarded by Super Admin. KYC documents are filled by themselves at the time of account creation and verified by Super Admin.
              </div>

              <div className="kyc-form-row">
                <div className="kyc-form-group" style={{ marginBottom: 0 }}>
                  <label className="kyc-form-label">Full Name</label>
                  <input className="kyc-form-input" value={formData.fullName} readOnly />
                </div>
                <div className="kyc-form-group" style={{ marginBottom: 0 }}>
                  <label className="kyc-form-label">Date of Birth</label>
                  <input className="kyc-form-input" value={formData.dob} readOnly />
                </div>
              </div>

              <div className="kyc-form-row">
                <div className="kyc-form-group" style={{ marginBottom: 0 }}>
                  <label className="kyc-form-label">Mobile Number</label>
                  <input className="kyc-form-input" value={formData.mobile} readOnly />
                </div>
                <div className="kyc-form-group" style={{ marginBottom: 0 }}>
                  <label className="kyc-form-label">Email Id</label>
                  <input className="kyc-form-input" value={formData.email} readOnly />
                </div>
              </div>

              {roleData.codeLabel && (
                <div className="kyc-form-group">
                  <label className="kyc-form-label">{roleData.codeLabel}</label>
                  <input className="kyc-form-input" value={roleData.persons[selectedPerson]?.code || ''} readOnly />
                </div>
              )}

              <div className="kyc-form-group">
                <label className="kyc-form-label">Residential Address</label>
                <input className="kyc-form-input" value={formData.address} readOnly />
              </div>

              <div className="kyc-form-row">
                <div className="kyc-form-group" style={{ marginBottom: 0 }}>
                  <label className="kyc-form-label">Aadhar Number</label>
                  <input className="kyc-form-input" value={formData.aadhar} readOnly />
                </div>
                <div className="kyc-form-group" style={{ marginBottom: 0 }}>
                  <label className="kyc-form-label">PAN Number</label>
                  <input className="kyc-form-input" value={formData.pan} readOnly />
                </div>
              </div>

              <div className="kyc-form-row">
                <div className="kyc-form-group" style={{ marginBottom: 0 }}>
                  <label className="kyc-form-label">Bank Account Number</label>
                  <input className="kyc-form-input" value={formData.bankAccount} readOnly />
                </div>
                <div className="kyc-form-group" style={{ marginBottom: 0 }}>
                  <label className="kyc-form-label">IFSC Code</label>
                  <input className="kyc-form-input" value={formData.ifsc} readOnly />
                </div>
              </div>

              {/* Document uploads */}
              <div className="kyc-uploads">
                <div className="kyc-upload-card">
                  <div className="kyc-upload-icon">&#128196;</div>
                  <div className="kyc-upload-filename blue">img1.jpg</div>
                  <div className="kyc-upload-label">Aadhar Front + Back</div>
                  <div className="kyc-upload-hint">Pdf/.JPG &bull; Max 5MB</div>
                </div>
                <div className="kyc-upload-card">
                  <div className="kyc-upload-icon">&#128196;</div>
                  <div className="kyc-upload-filename green">img2.jpg</div>
                  <div className="kyc-upload-label">PAN Card</div>
                  <div className="kyc-upload-hint">Pdf/.JPG &bull; Max 5MB</div>
                </div>
                <div className="kyc-upload-card">
                  <div className="kyc-upload-icon">&#128196;</div>
                  <div className="kyc-upload-filename red">img3.jpg</div>
                  <div className="kyc-upload-label">Bank Passbook</div>
                  <div className="kyc-upload-hint">Pdf/.JPG &bull; Max 5MB</div>
                </div>
              </div>

              <button className="kyc-btn-full">Verify KYC</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
