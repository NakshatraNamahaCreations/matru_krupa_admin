import { useEffect, useState } from 'react';
import './Withdrawal.css';
import { withdrawalRequestApi } from '../services/api';

const fmt = (n) => Number(n || 0).toLocaleString('en-IN');
const colorFor = (name) => {
  const palette = ['#ef4444', '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899'];
  let h = 0;
  for (let i = 0; i < (name || '').length; i += 1) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return palette[h % palette.length];
};

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

export default function Withdrawal() {
  const [activeTab, setActiveTab] = useState('pending');
  const [calcForm, setCalcForm] = useState({ name: 'Puran', level: 'Promoter', balance: '24,000', amount: '24,000' });
  const [pending, setPending] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [acting, setActing] = useState(null);

  const loadRequests = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await withdrawalRequestApi.getAll();
      const list = Array.isArray(data) ? data : [];
      setPending(list.filter((r) => r.status === 'pending'));
      setHistory(list.filter((r) => r.status === 'paid' || r.status === 'rejected' || r.status === 'approved'));
    } catch (err) {
      setError(err.message || 'Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const updateRequest = async (id, body) => {
    setActing(id);
    try {
      await withdrawalRequestApi.update(id, body);
      await loadRequests();
    } catch (err) {
      alert(err.message || 'Failed to update');
    } finally {
      setActing(null);
    }
  };

  const approveRequest = (id) => updateRequest(id, { status: 'approved' });
  const rejectRequest = (id) => {
    if (!window.confirm('Reject this withdrawal request?')) return;
    updateRequest(id, { status: 'rejected' });
  };
  const markPaid = (id) => {
    const utr = window.prompt('Enter UTR / reference number for this payment:');
    if (!utr) return;
    updateRequest(id, { status: 'paid', utr });
  };

  const totalGross = pending.reduce((s, r) => s + (r.amount || 0), 0);
  const totalNet = pending.reduce((s, r) => s + Math.round((r.amount || 0) * 0.9), 0);

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
              <div className="wd-stat-value" style={{ color: '#ea580c' }}>{pending.length}</div>
              <div className="wd-stat-sub">Awaiting Super Admin Approval</div>
            </div>
            <div className="wd-stat-card">
              <div className="wd-stat-label">TOTAL GROSS REQUESTED</div>
              <div className="wd-stat-value" style={{ color: '#3b82f6' }}>{'\u20B9'}{fmt(totalGross)}</div>
              <div className="wd-stat-sub">Before 10% deductions</div>
            </div>
            <div className="wd-stat-card">
              <div className="wd-stat-label">NET AFTER DEDUCTIONS</div>
              <div className="wd-stat-value">{'\u20B9'}{fmt(totalNet)}</div>
              <div className="wd-stat-sub">Actual Transfer Amount</div>
            </div>
          </div>

          {error && <div style={{ color: '#dc2626', marginBottom: 12 }}>{error}</div>}
          {loading && (
            <div style={{ padding: 24, textAlign: 'center', color: '#94a3b8' }}>
              Loading requests\u2026
            </div>
          )}
          {!loading && pending.length === 0 && (
            <div style={{ padding: 24, textAlign: 'center', color: '#94a3b8' }}>
              No pending withdrawal requests.
            </div>
          )}

          {!loading && pending.map((req) => {
            const gross = req.amount || 0;
            const tdsCut = Math.round(gross * 0.05);
            const serviceCut = Math.round(gross * 0.05);
            const net = gross - tdsCut - serviceCut;
            const initial = (req.fullName || '?').charAt(0).toUpperCase();
            const bank = req.bankName
              ? `Bank: ${req.bankName} A/C ending ${(req.accountNumber || '').slice(-4)}`
              : 'Bank: \u2014';
            const location = [
              req.talukName ? `${req.talukName} Taluk` : '',
              req.adminId,
              req.district ? `${req.district} District` : '',
            ]
              .filter(Boolean)
              .join(' \u00B7 ');
            const requested = req.createdAt
              ? `Requested on ${new Date(req.createdAt).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}`
              : '';
            const isActing = acting === req._id;
            return (
              <div className="wd-request-card" key={req._id}>
                <div className="wd-req-header">
                  <div
                    className="wd-req-avatar"
                    style={{ background: colorFor(req.fullName) }}
                  >
                    {initial}
                  </div>
                  <span className="wd-req-name">{req.fullName}</span>
                  <div className="wd-req-badges">
                    <span className="wd-req-badge role">{req.level}</span>
                  </div>
                </div>
                <div className="wd-req-meta">{location}</div>
                <div className="wd-req-meta">
                  {requested} {requested && bank ? '\u2022 ' : ''} {bank}
                </div>

                <div className="wd-req-breakdown">
                  <div className="wd-req-box neutral">
                    <div className="wd-req-box-label">Wallet Balance</div>
                    <div className="wd-req-box-value">
                      {'\u20B9'}{fmt(req.walletBalance)}
                    </div>
                  </div>
                  <div className="wd-req-box dark">
                    <div className="wd-req-box-label">Gross Amount</div>
                    <div className="wd-req-box-value">
                      {'\u20B9'}{fmt(gross)}
                    </div>
                  </div>
                  <div className="wd-req-box danger">
                    <div className="wd-req-box-label">TDS 5% + Service 5%</div>
                    <div className="wd-req-box-value">
                      -{'\u20B9'}{fmt(tdsCut + serviceCut)}
                    </div>
                  </div>
                  <div className="wd-req-box success">
                    <div className="wd-req-box-label">Net Payable</div>
                    <div className="wd-req-box-value">
                      {'\u20B9'}{fmt(net)}
                    </div>
                  </div>
                </div>

                {req.note && <div className="wd-req-note">{req.note}</div>}

                <div className="wd-req-footer">
                  <button
                    className="wd-btn wd-btn-outline"
                    onClick={() => rejectRequest(req._id)}
                    disabled={isActing}
                  >
                    Reject
                  </button>
                  <button
                    className="wd-btn wd-btn-outline"
                    onClick={() => approveRequest(req._id)}
                    disabled={isActing}
                  >
                    Approve
                  </button>
                  <button
                    className="wd-btn wd-btn-primary"
                    onClick={() => markPaid(req._id)}
                    disabled={isActing}
                  >
                    Mark Paid
                  </button>
                </div>
              </div>
            );
          })}
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
                {history.length === 0 && (
                  <tr>
                    <td colSpan="9" style={{ textAlign: 'center', padding: 24, color: '#94a3b8' }}>
                      No processed requests yet.
                    </td>
                  </tr>
                )}
                {history.map((h) => {
                  const gross = h.amount || 0;
                  const tdsCut = Math.round(gross * 0.05);
                  const serviceCut = Math.round(gross * 0.05);
                  const net = gross - tdsCut - serviceCut;
                  const dateStr = h.processedAt
                    ? new Date(h.processedAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })
                    : new Date(h.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      });
                  return (
                    <tr key={h._id}>
                      <td>{dateStr}</td>
                      <td>
                        <span style={{ fontWeight: 600, display: 'block' }}>
                          {h.fullName}
                        </span>
                        <span style={{ fontSize: 11, color: '#94a3b8' }}>
                          {h.adminId}
                        </span>
                      </td>
                      <td>{h.level}</td>
                      <td>{h.district || '\u2014'}</td>
                      <td>{'\u20B9'}{fmt(gross)}</td>
                      <td style={{ color: '#ef4444' }}>{'\u20B9'}{fmt(tdsCut)}</td>
                      <td style={{ color: '#ef4444' }}>{'\u20B9'}{fmt(serviceCut)}</td>
                      <td style={{ fontWeight: 600 }}>{'\u20B9'}{fmt(net)}</td>
                      <td style={{ fontFamily: 'monospace', fontSize: 12 }}>
                        {h.utr || `(${h.status})`}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
