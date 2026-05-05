import { useState } from 'react';
import './Withdrawal.css';

const pendingRequests = [
  {
    name: 'Ramesh', initial: 'R', color: '#ef4444', role: 'Taluk Admin', kyc: 'KYC Verified',
    location: 'Hunsur Taluk - KA-TA-003 - Mysuru District',
    requestDate: 'Requested on 25 Mar', bank: 'Bank: SBI A/C ending 8849',
    wallet: '16,000', gross: '16,000', deduction: '-\u20B91,500', net: '14,500',
    note1: 'Commission from 16 hoblis in March 2026', note2: 'KYC Verified 18 Mar 2026',
  },
  {
    name: 'Manish', initial: 'M', color: '#3b82f6', role: 'Taluk Admin', kyc: 'KYC Pending',
    location: 'Mysuru District - KA-DA-001',
    requestDate: 'Requested on 23 Mar', bank: 'Bank: HDFC A/C ending 2282',
    wallet: '12,000', gross: '12,000', deduction: '-\u20B91,000', net: '11,000',
    note1: '30% of Mysuru District \u20B91,000 per sale \u2022 40 sales in March 2026', note2: '',
  },
  {
    name: 'Punarv', initial: 'P', color: '#8b5cf6', role: 'Promoter', kyc: 'KYC Verified',
    location: 'Hunsur Taluk - KA-PA-001 -',
    requestDate: 'Requested on 19 Mar', bank: 'Bank: SBI A/C ending 1929',
    wallet: '24,000', gross: '24,000', deduction: '-\u20B92,000', net: '22,000',
    note1: '12 sales x \u20B92,000', note2: 'KYC Verified 09 Mar 2026',
  },
];

const referenceTable = [
  { gross: '1,000', tds: '50', service: '50', net: '900' },
  { gross: '2,000', tds: '100', service: '100', net: '800' },
  { gross: '5,000', tds: '250', service: '250', net: '4,500' },
  { gross: '10,000', tds: '500', service: '500', net: '9,000' },
  { gross: '15,000', tds: '750', service: '750', net: '13,500' },
  { gross: '20,000', tds: '1,000', service: '1,000', net: '18,000' },
  { gross: '25,000', tds: '1,250', service: '1,250', net: '23,000' },
  { gross: '50,000', tds: '2,500', service: '2,500', net: '45,000' },
];

const processedHistory = [
  { date: '12 Mar 2026', name: 'Ravi', code: 'KA-PA-001', role: 'Promoter', district: 'Mysuru', gross: '8,000', tds: '400', service: '400', net: '7,200', utr: 'NEFT20384704' },
  { date: '11 Mar 2026', name: 'Suresh', code: 'KA-TA-003', role: 'Taluk Admin', district: 'Mysuru', gross: '12,000', tds: '600', service: '600', net: '10,800', utr: 'NEFT3839037' },
  { date: '10 Mar 2026', name: 'Abhay', code: 'KA-DA-001', role: 'District Admin', district: 'Mysuru', gross: '20,000', tds: '1,000', service: '1,000', net: '18,000', utr: 'NEFT0936839' },
];

export default function Withdrawal() {
  const [activeTab, setActiveTab] = useState('pending');
  const [calcForm, setCalcForm] = useState({ name: 'Puran', level: 'Promoter', balance: '24,000', amount: '24,000' });

  const tabs = [
    { key: 'pending', label: 'Pending Requests' },
    { key: 'calculator', label: 'Payout Calculator' },
    { key: 'history', label: 'Processed History' },
  ];

  const grossNum = parseInt((calcForm.amount || '0').replace(/,/g, '')) || 0;
  const tds = Math.round(grossNum * 0.05);
  const service = Math.round(grossNum * 0.05);
  const netAmount = grossNum - tds - service;

  return (
    <div className="wd">
      <h1 className="wd-title">Withdrawals</h1>

      <div className="wd-tabs">
        {tabs.map(t => (
          <button key={t.key} className={`wd-tab ${activeTab === t.key ? 'active' : ''}`} onClick={() => setActiveTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* === PENDING REQUESTS === */}
      {activeTab === 'pending' && (
        <>
          <div className="wd-stats">
            <div className="wd-stat-card">
              <div className="wd-stat-label">PENDING REQUESTS</div>
              <div className="wd-stat-value" style={{ color: '#ea580c' }}>3</div>
              <div className="wd-stat-sub">Awaiting Super Admin Approval</div>
            </div>
            <div className="wd-stat-card">
              <div className="wd-stat-label">TOTAL GROSS REQUESTED</div>
              <div className="wd-stat-value" style={{ color: '#3b82f6' }}>{'\u20B9'}47,000</div>
              <div className="wd-stat-sub">Before 10% deductions</div>
            </div>
            <div className="wd-stat-card">
              <div className="wd-stat-label">NET AFTER DEDUCTIONS</div>
              <div className="wd-stat-value">{'\u20B9'}42,000</div>
              <div className="wd-stat-sub">Actual Transfer Amount</div>
            </div>
          </div>

          {pendingRequests.map((req, i) => (
            <div className="wd-request-card" key={i}>
              <div className="wd-req-header">
                <div className="wd-req-avatar" style={{ background: req.color }}>{req.initial}</div>
                <span className="wd-req-name">{req.name}</span>
                <div className="wd-req-badges">
                  <span className="wd-req-badge role">{req.role}</span>
                  <span className={`wd-req-badge ${req.kyc === 'KYC Verified' ? 'kyc-verified' : 'kyc-pending'}`}>{req.kyc}</span>
                </div>
              </div>
              <div className="wd-req-meta">{req.location}</div>
              <div className="wd-req-meta">{req.requestDate} &bull; {req.bank}</div>

              <div className="wd-req-breakdown">
                <div className="wd-req-box neutral">
                  <div className="wd-req-box-label">Wallet Balance</div>
                  <div className="wd-req-box-value">{'\u20B9'}{req.wallet}</div>
                </div>
                <div className="wd-req-box dark">
                  <div className="wd-req-box-label">Gross Amount</div>
                  <div className="wd-req-box-value">{'\u20B9'}{req.gross}</div>
                </div>
                <div className="wd-req-box danger">
                  <div className="wd-req-box-label">TDS 5% + Service 5%</div>
                  <div className="wd-req-box-value">{req.deduction}</div>
                </div>
                <div className="wd-req-box success">
                  <div className="wd-req-box-label">Net Payable</div>
                  <div className="wd-req-box-value">{'\u20B9'}{req.net}</div>
                </div>
              </div>

              {req.note1 && <div className="wd-req-note">{req.note1}</div>}
              {req.note2 && <div className="wd-req-note">{req.note2}</div>}

              <div className="wd-req-footer">
                <button className="wd-btn wd-btn-outline">Reject</button>
                <button className="wd-btn wd-btn-primary">Approve & Invoice</button>
              </div>
            </div>
          ))}
        </>
      )}

      {/* === PAYOUT CALCULATOR === */}
      {activeTab === 'calculator' && (
        <div className="wd-two-col">
          <div className="wd-card">
            <div className="wd-card-title">
              PAYOUT CALCULATOR
              <span className="wd-realtime-badge">Real Time</span>
            </div>

            <div className="wd-form-group">
              <label className="wd-label">Requester name</label>
              <input className="wd-form-input" value={calcForm.name} onChange={e => setCalcForm({ ...calcForm, name: e.target.value })} />
            </div>
            <div className="wd-form-group">
              <label className="wd-label">Level</label>
              <select className="wd-form-select" value={calcForm.level} onChange={e => setCalcForm({ ...calcForm, level: e.target.value })}>
                <option>Promoter</option>
                <option>Taluk Admin</option>
                <option>District Admin</option>
                <option>State Admin</option>
              </select>
            </div>
            <div className="wd-form-group">
              <label className="wd-label">Commission Wallet Balance ({'\u20B9'})</label>
              <input className="wd-form-input" value={`\u20B9${calcForm.balance}`} readOnly />
            </div>
            <div className="wd-form-group">
              <label className="wd-label">Amount to withdraw ({'\u20B9'})</label>
              <input className="wd-form-input" value={`\u20B9${calcForm.amount}`} onChange={e => setCalcForm({ ...calcForm, amount: e.target.value.replace(/[^\d,]/g, '') })} />
            </div>

            <div className="wd-payout-section">
              <div className="wd-payout-title">PAYOUT BREAKDOWN</div>
              <div className="wd-payout-row">
                <span>Gross withdrawal amount</span>
                <span className="wd-payout-row-value blue">{'\u20B9'}{grossNum.toLocaleString()}</span>
              </div>
              <div className="wd-payout-row">
                <span>TDS Deduction @5%</span>
                <span className="wd-payout-row-value red">-{'\u20B9'}{tds.toLocaleString()}</span>
              </div>
              <div className="wd-payout-row">
                <span>Service charge @5%</span>
                <span className="wd-payout-row-value red">-{'\u20B9'}{service.toLocaleString()}</span>
              </div>
              <div className="wd-payout-row">
                <span style={{ fontWeight: 700 }}>Net Amount Transferred</span>
                <span className="wd-payout-row-value blue">{'\u20B9'}{netAmount.toLocaleString()}</span>
              </div>
            </div>

            <div className="wd-payout-actions">
              <button className="wd-btn-green">Approve & Invoice</button>
              <button className="wd-btn-reject">Reject</button>
            </div>
          </div>

          <div className="wd-card">
            <div className="wd-card-title">NET PAYOUT REFERENCE TABLE</div>
            <table className="wd-ref-table">
              <thead>
                <tr>
                  <th>GROSS EARNED</th>
                  <th>TDS 5%</th>
                  <th>SERVICE 5%</th>
                  <th>NET RECEIVED</th>
                </tr>
              </thead>
              <tbody>
                {referenceTable.map((r, i) => (
                  <tr key={i}>
                    <td>{'\u20B9'}{r.gross}</td>
                    <td className="red">{'\u20B9'}{r.tds}</td>
                    <td className="red">{'\u20B9'}{r.service}</td>
                    <td style={{ fontWeight: 600 }}>{'\u20B9'}{r.net}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* === PROCESSED HISTORY === */}
      {activeTab === 'history' && (
        <>
          <div className="wd-history-toolbar">
            <input className="wd-search" placeholder="Search by name or code" />
            <div className="wd-history-right">
              <button className="wd-export-btn pdf">Export PDF</button>
              <button className="wd-export-btn csv">Export CSV</button>
            </div>
          </div>

          <div className="wd-filters">
            <div className="wd-filter-group">
              <label className="wd-filter-label">Role</label>
              <select className="wd-select"><option>Select Role</option><option>Promoter</option><option>Taluk Admin</option><option>District Admin</option></select>
            </div>
            <div className="wd-filter-group">
              <label className="wd-filter-label">Select Date</label>
              <select className="wd-select"><option>Last 7 days</option><option>Last 30 days</option></select>
            </div>
            <div className="wd-filter-group">
              <label className="wd-filter-label">From</label>
              <input type="date" className="wd-date-input" />
            </div>
            <div className="wd-filter-group">
              <label className="wd-filter-label">To</label>
              <input type="date" className="wd-date-input" />
            </div>
          </div>

          <div className="wd-table-card">
            <table className="wd-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Recipient</th>
                  <th>Role</th>
                  <th>District</th>
                  <th>Gross</th>
                  <th>TDS 5%</th>
                  <th>Service 5%</th>
                  <th>Net Paid</th>
                  <th>UTR/REF</th>
                </tr>
              </thead>
              <tbody>
                {processedHistory.map((h, i) => (
                  <tr key={i}>
                    <td>{h.date}</td>
                    <td>
                      <span style={{ fontWeight: 600, display: 'block' }}>{h.name}</span>
                      <span style={{ fontSize: 11, color: '#94a3b8' }}>{h.code}</span>
                    </td>
                    <td>{h.role}</td>
                    <td>{h.district}</td>
                    <td>{'\u20B9'}{h.gross}</td>
                    <td style={{ color: '#ef4444' }}>{'\u20B9'}{h.tds}</td>
                    <td style={{ color: '#ef4444' }}>{'\u20B9'}{h.service}</td>
                    <td style={{ fontWeight: 600 }}>{'\u20B9'}{h.net}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{h.utr}</td>
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
