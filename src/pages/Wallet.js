import React, { useEffect, useMemo, useState } from 'react';
import {
  MdAccountBalanceWallet,
  MdTrendingUp,
  MdHourglassEmpty,
  MdCheckCircle,
} from 'react-icons/md';
import './Wallet.css';
import {
  promoterSaleApi,
  commissionRuleApi,
  withdrawalRequestApi,
} from '../services/api';
import { useAuth } from '../context/AuthContext';

const LEVEL_TO_RULE = {
  'State Admin': 'STATE ADMIN',
  'Assistant District Admin': 'ASS DISTRICT ADMIN',
  'District Admin': 'DISTRICT ADMIN',
  'Taluk Admin': 'TALUK ADMIN',
  Promoters: 'PROMOTERS',
};

const fmt = (n) => Number(n || 0).toLocaleString('en-IN');

const dayKey = (d) => {
  const dt = new Date(d);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
};
const dayLabel = (key) => {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export default function Wallet() {
  const { staff } = useAuth();
  const [sales, setSales] = useState([]);
  const [rules, setRules] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [amountInput, setAmountInput] = useState('');
  const [noteInput, setNoteInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const role = staff?.level || staff?.role || '';
  const ruleLevel = LEVEL_TO_RULE[role] || null;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([
      promoterSaleApi.getAll().catch(() => []),
      commissionRuleApi.getAll().catch(() => []),
      withdrawalRequestApi.getMine().catch(() => []),
    ])
      .then(([s, r, w]) => {
        if (cancelled) return;
        setSales(Array.isArray(s) ? s : []);
        setRules(Array.isArray(r) ? r : []);
        setRequests(Array.isArray(w) ? w : []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Failed to load wallet');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const commissionPerSale = useMemo(() => {
    const rule = rules.find((r) => r.level === ruleLevel);
    return rule?.commissionPerSale || 0;
  }, [rules, ruleLevel]);

  // Sales attributable to this user, based on level
  const mySales = useMemo(() => {
    if (!staff) return [];
    if (role === 'Promoters') {
      return sales.filter((s) => s.promoterCode === staff.adminId);
    }
    if (role === 'Taluk Admin') {
      return sales.filter(
        (s) =>
          (s.taluk || '').toLowerCase() ===
            (staff.talukName || '').toLowerCase() &&
          (s.district || '').toLowerCase() ===
            (staff.district || '').toLowerCase(),
      );
    }
    if (role === 'District Admin' || role === 'Assistant District Admin') {
      return sales.filter(
        (s) =>
          (s.district || '').toLowerCase() ===
            (staff.district || '').toLowerCase(),
      );
    }
    if (role === 'State Admin') return sales;
    return [];
  }, [sales, staff, role]);

  // Earnings per sale: for Promoters use the commission stored on the sale,
  // otherwise multiply count by the level's commissionPerSale rule.
  const earningsForSale = useMemo(
    () => (sale) =>
      role === 'Promoters'
        ? sale.commissionAmount || 0
        : commissionPerSale,
    [role, commissionPerSale],
  );

  const totalEarned = useMemo(
    () => mySales.reduce((sum, s) => sum + earningsForSale(s), 0),
    [mySales, earningsForSale],
  );

  // Already paid out to this user
  const paidOut = useMemo(
    () =>
      requests
        .filter((r) => r.status === 'paid')
        .reduce((sum, r) => sum + (r.amount || 0), 0),
    [requests],
  );

  // In-flight requests (pending/approved but not yet paid)
  const inFlight = useMemo(
    () =>
      requests
        .filter((r) => r.status === 'pending' || r.status === 'approved')
        .reduce((sum, r) => sum + (r.amount || 0), 0),
    [requests],
  );

  const balance = Math.max(0, totalEarned - paidOut - inFlight);

  // Group sales by day for daily-update list (most recent first, last 14 days)
  const dailyBuckets = useMemo(() => {
    const map = new Map();
    mySales.forEach((s) => {
      if (!s.saleDate) return;
      const key = dayKey(s.saleDate);
      if (!map.has(key)) map.set(key, { count: 0, amount: 0 });
      const b = map.get(key);
      b.count += 1;
      b.amount += earningsForSale(s);
    });
    return Array.from(map.entries())
      .sort((a, b) => (a[0] < b[0] ? 1 : -1))
      .slice(0, 14)
      .map(([k, v]) => ({ key: k, label: dayLabel(k), ...v }));
  }, [mySales, earningsForSale]);

  const handleRequestWithdrawal = async (e) => {
    e.preventDefault();
    setSubmitError('');
    const amt = Number(String(amountInput).replace(/[^\d.]/g, ''));
    if (!amt || amt <= 0) {
      setSubmitError('Enter a valid amount.');
      return;
    }
    if (amt > balance) {
      setSubmitError(`Amount exceeds available balance (₹${fmt(balance)}).`);
      return;
    }
    setSubmitting(true);
    try {
      const created = await withdrawalRequestApi.create({
        amount: amt,
        note: noteInput.trim(),
        walletBalance: balance,
      });
      setRequests((prev) => [created, ...prev]);
      setShowModal(false);
      setAmountInput('');
      setNoteInput('');
    } catch (err) {
      setSubmitError(err.message || 'Could not submit request.');
    } finally {
      setSubmitting(false);
    }
  };

  const lastUpdate = dailyBuckets[0];

  return (
    <div className="wlt">
      <div className="wlt-head">
        <h1 className="wlt-title">My Wallet</h1>
        <p className="wlt-subtitle">
          {staff?.fullName || staff?.name}
          {staff?.adminId ? ` · ${staff.adminId}` : ''}
          {role ? ` · ${role}` : ''}
        </p>
      </div>

      {error && <div className="wlt-error">{error}</div>}

      <div className="wlt-stats">
        <div className="wlt-stat-card wlt-stat-card--accent">
          <div className="wlt-stat-icon">
            <MdAccountBalanceWallet />
          </div>
          <div>
            <div className="wlt-stat-label">Available Balance</div>
            <div className="wlt-stat-value">₹{fmt(balance)}</div>
            <div className="wlt-stat-sub">
              Earned ₹{fmt(totalEarned)} · Paid ₹{fmt(paidOut)} · In flight ₹{fmt(inFlight)}
            </div>
          </div>
        </div>
        <div className="wlt-stat-card">
          <div className="wlt-stat-icon" style={{ color: '#16a34a' }}>
            <MdTrendingUp />
          </div>
          <div>
            <div className="wlt-stat-label">Total Sales</div>
            <div className="wlt-stat-value">{mySales.length}</div>
            <div className="wlt-stat-sub">
              {lastUpdate
                ? `Last sale ${lastUpdate.label}`
                : 'No sales recorded yet'}
            </div>
          </div>
        </div>
        <div className="wlt-stat-card">
          <div className="wlt-stat-icon" style={{ color: '#ea580c' }}>
            <MdHourglassEmpty />
          </div>
          <div>
            <div className="wlt-stat-label">Pending Requests</div>
            <div className="wlt-stat-value">
              {requests.filter((r) => r.status === 'pending').length}
            </div>
            <div className="wlt-stat-sub">Awaiting Super Admin Approval</div>
          </div>
        </div>
      </div>

      <button
        className="wlt-cta"
        onClick={() => setShowModal(true)}
        disabled={balance <= 0}
        title={balance <= 0 ? 'No balance available' : 'Request a withdrawal'}
      >
        Request Withdrawal
      </button>

      <div className="wlt-grid">
        <section className="wlt-section">
          <h2 className="wlt-section-title">Daily Earnings</h2>
          {loading && <div className="wlt-empty">Loading…</div>}
          {!loading && dailyBuckets.length === 0 && (
            <div className="wlt-empty">No earnings yet.</div>
          )}
          {!loading && dailyBuckets.length > 0 && (
            <ul className="wlt-day-list">
              {dailyBuckets.map((d) => (
                <li key={d.key} className="wlt-day-row">
                  <div>
                    <div className="wlt-day-label">{d.label}</div>
                    <div className="wlt-day-sub">
                      {d.count} {d.count === 1 ? 'sale' : 'sales'}
                    </div>
                  </div>
                  <span className="wlt-day-amount">+₹{fmt(d.amount)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="wlt-section">
          <h2 className="wlt-section-title">My Withdrawal Requests</h2>
          {loading && <div className="wlt-empty">Loading…</div>}
          {!loading && requests.length === 0 && (
            <div className="wlt-empty">No requests yet.</div>
          )}
          {!loading && requests.length > 0 && (
            <ul className="wlt-req-list">
              {requests.map((r) => (
                <li key={r._id} className="wlt-req-row">
                  <div>
                    <div className="wlt-req-amount">₹{fmt(r.amount)}</div>
                    <div className="wlt-req-sub">
                      {new Date(r.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                      {r.utr ? ` · ${r.utr}` : ''}
                    </div>
                  </div>
                  <span className={`wlt-req-status wlt-req-status--${r.status}`}>
                    {r.status === 'paid' && (
                      <MdCheckCircle style={{ marginRight: 4, verticalAlign: 'middle' }} />
                    )}
                    {r.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {showModal && (
        <div className="wlt-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="wlt-modal" onClick={(e) => e.stopPropagation()}>
            <div className="wlt-modal-head">
              <h2 className="wlt-modal-title">Request Withdrawal</h2>
              <button
                className="wlt-modal-close"
                onClick={() => setShowModal(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <form className="wlt-modal-body" onSubmit={handleRequestWithdrawal}>
              <p className="wlt-modal-balance">
                Available balance: <strong>₹{fmt(balance)}</strong>
              </p>
              <label className="wlt-label">Amount (₹) *</label>
              <input
                type="text"
                className="wlt-input"
                inputMode="numeric"
                placeholder="Enter amount"
                value={amountInput}
                onChange={(e) =>
                  setAmountInput(e.target.value.replace(/[^\d]/g, ''))
                }
              />
              <label className="wlt-label">Note (optional)</label>
              <textarea
                className="wlt-input"
                rows={3}
                placeholder="Reason or reference"
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
              />
              {submitError && <div className="wlt-error">{submitError}</div>}
              <div className="wlt-modal-actions">
                <button
                  type="button"
                  className="wlt-btn wlt-btn-secondary"
                  onClick={() => setShowModal(false)}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="wlt-btn wlt-btn-primary"
                  disabled={submitting}
                >
                  {submitting ? 'Submitting…' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
