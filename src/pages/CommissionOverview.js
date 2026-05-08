import React, { useEffect, useMemo, useState } from 'react';
import { MdVisibility, MdPerson } from 'react-icons/md';
import './CommissionOverview.css';
import { promoterSaleApi, hierarchyAdminApi } from '../services/api';

const LEVEL_DEFS = [
  { id: 'State Admin', label: 'STATE ADMIN', desc: 'Karnataka' },
  { id: 'Assistant District Admin', label: 'ASS DISTRICT ADMIN', desc: 'MULTIPLE PER STATE' },
  { id: 'District Admin', label: 'DISTRICT ADMIN', desc: 'MULTIPLE PER STATE' },
  { id: 'Taluk Admin', label: 'TALUK ADMIN', desc: '' /* filled with taluk count */ },
  { id: 'Promoters', label: 'PROMOTERS', desc: 'Active' },
];

const fmt = (n) => Number(n || 0).toLocaleString('en-IN');

const fmtDateTime = (d) => {
  if (!d) return { date: '—', time: '' };
  const dt = new Date(d);
  return {
    date: dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    time: dt.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true }),
  };
};

export default function CommissionOverview() {
  const [dateRange, setDateRange] = useState('last7');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const [sales, setSales] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedSale, setSelectedSale] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    Promise.all([
      promoterSaleApi.getAll().catch(() => []),
      hierarchyAdminApi.getAll().catch(() => []),
    ])
      .then(([s, a]) => {
        if (cancelled) return;
        setSales(Array.isArray(s) ? s : []);
        setAdmins(Array.isArray(a) ? a : []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Failed to load commissions');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Active window
  const range = useMemo(() => {
    const now = new Date();
    if (dateRange === 'custom') {
      const from = fromDate ? new Date(fromDate) : null;
      const to = toDate ? new Date(new Date(toDate).getTime() + 86_399_999) : null;
      return { from, to };
    }
    const days = dateRange === 'last7' ? 7 : dateRange === 'last30' ? 30 : 90;
    const from = new Date(now);
    from.setDate(from.getDate() - days);
    return { from, to: now };
  }, [dateRange, fromDate, toDate]);

  // Previous period of same length (used for trend)
  const prevRange = useMemo(() => {
    if (!range.from || !range.to) return null;
    const len = range.to.getTime() - range.from.getTime();
    return { from: new Date(range.from.getTime() - len), to: new Date(range.from.getTime()) };
  }, [range]);

  const filteredSales = useMemo(() => {
    return sales.filter((s) => {
      if (!s.saleDate) return false;
      const t = new Date(s.saleDate).getTime();
      if (range.from && t < range.from.getTime()) return false;
      if (range.to && t > range.to.getTime()) return false;
      return true;
    });
  }, [sales, range]);

  const stats = useMemo(() => {
    const credited = filteredSales.filter((s) => s.status === 'Credited');
    const pending = filteredSales.filter((s) => s.status === 'Pending');
    const onHoldList = filteredSales.filter(
      (s) => s.kyc && s.kyc !== 'KYC Verified',
    );
    const totalDisbursed = credited.reduce((sum, x) => sum + (x.commissionAmount || 0), 0);
    const pendingPayouts = pending.reduce((sum, x) => sum + (x.commissionAmount || 0), 0);
    const tdsCharges = Math.round(totalDisbursed * 0.1);
    const commOnHold = onHoldList.reduce((sum, x) => sum + (x.commissionAmount || 0), 0);
    const onHoldCount = onHoldList.length;

    // Trend: total disbursed vs same length previous period
    let trend = null;
    if (prevRange) {
      const prevDisbursed = sales
        .filter((s) => {
          if (!s.saleDate || s.status !== 'Credited') return false;
          const t = new Date(s.saleDate).getTime();
          return t >= prevRange.from.getTime() && t < prevRange.to.getTime();
        })
        .reduce((sum, x) => sum + (x.commissionAmount || 0), 0);
      if (prevDisbursed > 0) {
        trend = ((totalDisbursed - prevDisbursed) / prevDisbursed) * 100;
      } else if (totalDisbursed > 0) {
        trend = 100;
      }
    }
    return { totalDisbursed, pendingPayouts, tdsCharges, commOnHold, onHoldCount, trend };
  }, [filteredSales, prevRange, sales]);

  const hierarchyCards = useMemo(() => {
    const counts = {};
    admins.forEach((a) => {
      counts[a.level] = (counts[a.level] || 0) + 1;
    });
    const uniqueTaluks = new Set(
      admins
        .filter((a) => a.level === 'Taluk Admin' && a.talukName)
        .map((a) => a.talukName),
    );
    return LEVEL_DEFS.map((l) => {
      const count = counts[l.id] || 0;
      let desc = l.desc;
      if (l.id === 'Taluk Admin') {
        desc = `ACROSS ${uniqueTaluks.size} TALUK${uniqueTaluks.size === 1 ? '' : 'S'}`;
      }
      return { ...l, desc, count };
    });
  }, [admins]);

  const periodLabel = useMemo(() => {
    if (dateRange === 'custom') {
      if (fromDate && toDate) return `${fromDate} → ${toDate}`;
      if (fromDate) return `From ${fromDate}`;
      if (toDate) return `Until ${toDate}`;
      return 'Custom range';
    }
    if (dateRange === 'last7') return 'Last 7 days';
    if (dateRange === 'last30') return 'Last 30 days';
    return 'Last 90 days';
  }, [dateRange, fromDate, toDate]);

  const recentRows = useMemo(
    () =>
      [...filteredSales]
        .sort((a, b) => new Date(b.saleDate) - new Date(a.saleDate))
        .slice(0, 10),
    [filteredSales],
  );

  return (
    <div className="co">
      <h1 className="co-title">Commission Overview</h1>
      <p className="co-subtitle">
        Real-time snapshot of the entire payout ecosystem
      </p>

      {/* Filters */}
      <div className="co-filters">
        <label style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>
          Select Date
        </label>
        <select
          className="co-filter-select"
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
        >
          <option value="last7">Last 7 days</option>
          <option value="last30">Last 30 days</option>
          <option value="last90">Last 90 days</option>
          <option value="custom">Custom</option>
        </select>
        <label style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>
          From
        </label>
        <input
          type="date"
          className="co-filter-input"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          disabled={dateRange !== 'custom'}
        />
        <label style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>
          To
        </label>
        <input
          type="date"
          className="co-filter-input"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          disabled={dateRange !== 'custom'}
        />
      </div>

      {error && (
        <div style={{ color: '#dc2626', marginBottom: 12 }}>{error}</div>
      )}

      {/* Stat Cards */}
      <div className="co-stats">
        <div className="co-stat-card">
          <div className="co-stat-label">TOTAL DISBURSED</div>
          <div className="co-stat-row">
            <span className="co-stat-value">₹{fmt(stats.totalDisbursed)}</span>
            {stats.trend != null && (
              <span
                className={`co-stat-badge ${stats.trend >= 0 ? 'green' : 'red'}`}
              >
                {stats.trend >= 0 ? '↗' : '↘'}{' '}
                {Math.abs(Math.round(stats.trend))}%
              </span>
            )}
          </div>
          <div className="co-stat-sub">{periodLabel}</div>
        </div>
        <div className="co-stat-card">
          <div className="co-stat-label">PENDING PAYOUTS</div>
          <div className="co-stat-row">
            <span className="co-stat-value" style={{ color: '#ea580c' }}>
              ₹{fmt(stats.pendingPayouts)}
            </span>
          </div>
          <div className="co-stat-sub">Awaiting Approval</div>
        </div>
        <div className="co-stat-card">
          <div className="co-stat-label">TDS & SERVICES CHARGES HELD</div>
          <div className="co-stat-row">
            <span className="co-stat-value">₹{fmt(stats.tdsCharges)}</span>
          </div>
          <div className="co-stat-sub">5% TDS + 5% Service</div>
          <div className="co-stat-sub">Remittable to IT Dept</div>
        </div>
        <div className="co-stat-card">
          <div className="co-stat-label">COMM ON HOLD</div>
          <div className="co-stat-row">
            <span className="co-stat-value" style={{ color: '#ea580c' }}>
              ₹{fmt(stats.commOnHold)}
            </span>
          </div>
          <div className="co-stat-sub">KYC Pending</div>
          {stats.onHoldCount > 0 && (
            <span
              className="co-stat-badge red"
              style={{ marginTop: 6, display: 'inline-block' }}
            >
              {stats.onHoldCount} KYC Awaited
            </span>
          )}
        </div>
      </div>

      {/* Hierarchy Overview */}
      <h2 className="co-hierarchy-title">Hierarchy Overview</h2>
      <div className="co-hierarchy-cards">
        {hierarchyCards.map((h) => (
          <div className="co-hcard" key={h.id}>
            <div className="co-hcard-icon">
              <MdPerson />
            </div>
            <div className="co-hcard-info">
              <span className="co-hcard-level">{h.label}</span>
              <span className="co-hcard-desc">{h.desc}</span>
            </div>
            <span className="co-hcard-count">{h.count}</span>
            <button
              className="co-action-btn"
              title={`View ${h.label}`}
              disabled={h.count === 0}
              onClick={() => setSelectedLevel(h)}
              style={{ marginLeft: 8 }}
            >
              <MdVisibility />
            </button>
          </div>
        ))}
      </div>

      {selectedLevel && (
        <LevelDetailModal
          level={selectedLevel}
          admins={admins.filter((a) => a.level === selectedLevel.id)}
          onClose={() => setSelectedLevel(null)}
        />
      )}

      {selectedSale && (
        <SaleDetailModal
          sale={selectedSale}
          onClose={() => setSelectedSale(null)}
        />
      )}

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
            {loading && (
              <tr>
                <td
                  colSpan="8"
                  style={{ textAlign: 'center', padding: 24, color: '#94a3b8' }}
                >
                  Loading…
                </td>
              </tr>
            )}
            {!loading && recentRows.length === 0 && (
              <tr>
                <td
                  colSpan="8"
                  style={{ textAlign: 'center', padding: 24, color: '#94a3b8' }}
                >
                  No commissions in this period.
                </td>
              </tr>
            )}
            {!loading &&
              recentRows.map((c) => {
                const { date, time } = fmtDateTime(c.saleDate);
                return (
                  <tr key={c._id}>
                    <td>
                      <span style={{ fontWeight: 500 }}>{date}</span>
                      <br />
                      <span style={{ fontSize: 11, color: '#94a3b8' }}>
                        {time}
                      </span>
                    </td>
                    <td>
                      <span className="co-promoter-name">
                        {c.promoterName || '—'}
                      </span>
                      <span className="co-promoter-code">{c.promoterCode}</span>
                    </td>
                    <td>
                      <span className="co-shop-name">
                        {c.billingShop || '—'}
                      </span>
                      <span className="co-shop-hobli">{c.hobli || ''}</span>
                    </td>
                    <td>
                      <span className="co-product-name">{c.productName}</span>
                      <span className="co-product-price">₹{c.price}</span>
                    </td>
                    <td>{c.district}</td>
                    <td>{c.taluk}</td>
                    <td>
                      <div className="co-status-cell">
                        <span
                          className={`co-badge ${(c.status || '').toLowerCase()}`}
                        >
                          {c.status}
                        </span>
                        {c.kyc && (
                          <span className="co-badge kyc">{c.kyc}</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <button
                        className="co-action-btn"
                        title="View details"
                        onClick={() => setSelectedSale(c)}
                      >
                        <MdVisibility />
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SaleDetailModal({ sale, onClose }) {
  const { date, time } = fmtDateTime(sale.saleDate);
  const rows = [
    ['Promoter', sale.promoterName || '—'],
    ['Promoter Code', sale.promoterCode || '—'],
    ['Billing Shop', sale.billingShop || '—'],
    ['Hobli', sale.hobli || '—'],
    ['Taluk', sale.taluk || '—'],
    ['District', sale.district || '—'],
    ['Product', sale.productName || '—'],
    ['Price', sale.price ? `₹${sale.price}` : '—'],
    ['Quantity', sale.quantity ?? '—'],
    ['Commission', `₹${fmt(sale.commissionAmount)}`],
    ['Sale Date', `${date} · ${time}`],
  ];
  return (
    <div className="co-modal-overlay" onClick={onClose}>
      <div className="co-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 560 }}>
        <div className="co-modal__head">
          <div>
            <h2 className="co-modal__title">Commission Detail</h2>
            <p className="co-modal__sub">
              {sale.promoterName || sale.promoterCode}
              {sale.productName ? ` · ${sale.productName}` : ''}
            </p>
          </div>
          <button className="co-modal__close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="co-modal__body">
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <span className={`co-badge ${(sale.status || '').toLowerCase()}`}>
              {sale.status || '—'}
            </span>
            {sale.kyc && <span className="co-badge kyc">{sale.kyc}</span>}
          </div>

          <div className="co-modal__rows">
            {rows.map(([label, value]) => (
              <div key={label} className="co-modal__row">
                <span>{label}</span>
                <span>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function LevelDetailModal({ level, admins, onClose }) {
  return (
    <div className="co-modal-overlay" onClick={onClose}>
      <div className="co-modal" onClick={(e) => e.stopPropagation()}>
        <div className="co-modal__head">
          <div>
            <h2 className="co-modal__title">{level.label}</h2>
            <p className="co-modal__sub">
              {admins.length} {admins.length === 1 ? 'admin' : 'admins'}
              {level.desc ? ` · ${level.desc}` : ''}
            </p>
          </div>
          <button className="co-modal__close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="co-modal__body">
          {admins.length === 0 ? (
            <div className="co-modal__empty">No admins at this level.</div>
          ) : (
            <table className="co-modal__table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Code</th>
                  <th>District</th>
                  <th>Taluk</th>
                  <th>Mobile</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((a) => (
                  <tr key={a._id || a.adminId}>
                    <td>{a.fullName || '—'}</td>
                    <td>{a.adminId || '—'}</td>
                    <td>{a.district || '—'}</td>
                    <td>{a.talukName || '—'}</td>
                    <td>{a.mobile || '—'}</td>
                    <td>
                      <span
                        style={{
                          color: a.isActive ? '#16a34a' : '#dc2626',
                          fontWeight: 600,
                          fontSize: 12,
                        }}
                      >
                        {a.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
