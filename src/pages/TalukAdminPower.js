import React, { useEffect, useMemo, useState } from 'react';
import { MdVisibility } from 'react-icons/md';
import './CommissionPlaceholder.css';
import {
  hierarchyAdminApi,
  shopApi,
  commissionRuleApi,
} from '../services/api';

export default function TalukAdminPower() {
  const [districtFilter, setDistrictFilter] = useState('');
  const [search, setSearch] = useState('');

  const [admins, setAdmins] = useState([]);
  const [shops, setShops] = useState([]);
  const [promoters, setPromoters] = useState([]);
  const [commissionPerSale, setCommissionPerSale] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    Promise.all([
      hierarchyAdminApi.getAll({ level: 'Taluk Admin' }).catch(() => []),
      hierarchyAdminApi.getAll({ level: 'Promoters' }).catch(() => []),
      shopApi.getAll().catch(() => []),
      commissionRuleApi.getAll().catch(() => []),
    ])
      .then(([adminList, promoterList, shopList, rules]) => {
        if (cancelled) return;
        setAdmins(Array.isArray(adminList) ? adminList : []);
        setPromoters(Array.isArray(promoterList) ? promoterList : []);
        setShops(Array.isArray(shopList) ? shopList : []);
        const rule = Array.isArray(rules)
          ? rules.find((r) => r?.level === 'TALUK ADMIN')
          : null;
        setCommissionPerSale(rule?.commissionPerSale || 0);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Failed to load taluk admins');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Match a promoter to a taluk admin: prefer the explicit parentAdmin link,
  // and fall back to talukName + district matching for legacy records that
  // were created before the parentAdmin field existed.
  const promotersForAdmin = (a) =>
    promoters.filter((p) => {
      if (p.parentAdmin) return String(p.parentAdmin) === String(a._id);
      return (
        (p.talukName || '').toLowerCase() ===
          (a.talukName || '').toLowerCase() &&
        (p.district || '').toLowerCase() ===
          (a.district || '').toLowerCase()
      );
    });

  // Aggregate shops, promoters, sales, commission per admin
  const enrichedAdmins = useMemo(() => {
    return admins.map((a) => {
      const adminShops = shops.filter((s) => s.talukCode === a.adminId);
      const shopCount = adminShops.length;
      const salesCount = adminShops.reduce(
        (s, sh) => s + (Number(sh.sales) || 0),
        0,
      );
      const promoterCount = promotersForAdmin(a).length;
      const commission = salesCount * commissionPerSale;
      return {
        ...a,
        shopCount,
        salesCount,
        promoterCount,
        commission,
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [admins, shops, promoters, commissionPerSale]);

  // Apply district filter + free-text search
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return enrichedAdmins.filter((a) => {
      if (
        districtFilter &&
        (a.district || '').toLowerCase() !== districtFilter.toLowerCase()
      ) {
        return false;
      }
      if (!q) return true;
      return (
        (a.fullName || '').toLowerCase().includes(q) ||
        (a.adminId || '').toLowerCase().includes(q) ||
        (a.talukName || '').toLowerCase().includes(q)
      );
    });
  }, [enrichedAdmins, districtFilter, search]);

  // Top stat cards (computed from full enriched list, not filtered)
  const totalAdmins = enrichedAdmins.length;
  const totalShops = enrichedAdmins.reduce((s, a) => s + a.shopCount, 0);
  const totalPromoters = enrichedAdmins.reduce(
    (s, a) => s + a.promoterCount,
    0,
  );
  const totalSales = enrichedAdmins.reduce((s, a) => s + a.salesCount, 0);

  // District options derived from data
  const districts = useMemo(() => {
    const set = new Set();
    admins.forEach((a) => {
      if (a.district) set.add(a.district);
    });
    return Array.from(set).sort();
  }, [admins]);

  return (
    <div className="cp">
      <h1 className="cp-title">Taluk Admin Power</h1>
      <p className="cp-subtitle">
        Monitor taluk admin performance, shop coverage, and promoter networks
      </p>

      <div className="cp-stats">
        <div className="cp-stat-card">
          <div className="cp-stat-label">TOTAL TALUK ADMINS</div>
          <div className="cp-stat-value">{totalAdmins}</div>
        </div>
        <div className="cp-stat-card">
          <div className="cp-stat-label">TOTAL SHOPS</div>
          <div className="cp-stat-value" style={{ color: '#3b82f6' }}>
            {totalShops}
          </div>
        </div>
        <div className="cp-stat-card">
          <div className="cp-stat-label">TOTAL PROMOTERS</div>
          <div className="cp-stat-value" style={{ color: '#16a34a' }}>
            {totalPromoters}
          </div>
        </div>
        <div className="cp-stat-card">
          <div className="cp-stat-label">TOTAL SALES</div>
          <div className="cp-stat-value">{totalSales}</div>
        </div>
      </div>

      <div className="cp-filters">
        <input
          className="cp-search"
          placeholder="Search by name, code or taluk"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="cp-select"
          value={districtFilter}
          onChange={(e) => setDistrictFilter(e.target.value)}
        >
          <option value="">All Districts</option>
          {districts.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <select className="cp-select">
          <option>Last 30 days</option>
          <option>Last 7 days</option>
          <option>Last 90 days</option>
        </select>
      </div>

      <div className="cp-table-card">
        {error && (
          <div style={{ padding: 12, color: '#dc2626' }}>{error}</div>
        )}
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
            {loading && (
              <tr>
                <td
                  colSpan="9"
                  style={{ textAlign: 'center', padding: 24, color: '#94a3b8' }}
                >
                  Loading taluk admins…
                </td>
              </tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr>
                <td
                  colSpan="9"
                  style={{ textAlign: 'center', padding: 24, color: '#94a3b8' }}
                >
                  No taluk admins found.
                </td>
              </tr>
            )}
            {!loading &&
              filtered.map((t) => (
                <tr key={t._id || t.adminId}>
                  <td>
                    <span style={{ fontWeight: 600, display: 'block' }}>
                      {t.fullName}
                    </span>
                    <span style={{ fontSize: 11, color: '#94a3b8' }}>
                      {t.adminId}
                    </span>
                  </td>
                  <td>{t.talukName || '—'}</td>
                  <td>{t.district || '—'}</td>
                  <td style={{ fontWeight: 600, color: '#3b82f6' }}>
                    {t.shopCount}
                  </td>
                  <td style={{ fontWeight: 600 }}>{t.promoterCount}</td>
                  <td>{t.salesCount}</td>
                  <td style={{ fontWeight: 600 }}>
                    {'₹'}
                    {t.commission.toLocaleString('en-IN')}
                  </td>
                  <td>
                    <span
                      className={`cp-badge ${t.isActive ? 'active' : 'inactive'}`}
                    >
                      {t.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <button
                      className="cp-action-btn"
                      title="View details"
                      onClick={() => setSelected(t)}
                    >
                      <MdVisibility />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <TalukAdminDetailModal
          admin={selected}
          shops={shops.filter((s) => s.talukCode === selected.adminId)}
          promoters={promotersForAdmin(selected)}
          commissionPerSale={commissionPerSale}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}

function TalukAdminDetailModal({ admin, shops, promoters, commissionPerSale, onClose }) {
  const salesCount = shops.reduce((s, sh) => s + (Number(sh.sales) || 0), 0);
  const commission = salesCount * (commissionPerSale || 0);
  return (
    <div className="cp-modal-overlay" onClick={onClose}>
      <div className="cp-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cp-modal__head">
          <div>
            <h2 className="cp-modal__title">{admin.fullName}</h2>
            <p className="cp-modal__sub">
              {admin.adminId}
              {admin.talukName ? ` · ${admin.talukName}` : ''}
              {admin.district ? `, ${admin.district}` : ''}
            </p>
          </div>
          <button className="cp-modal__close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="cp-modal__body">
          <div className="cp-modal__stats">
            <div className="cp-modal__stat cp-modal__stat--accent">
              <div className="cp-modal__stat-label">Total Promoters Created</div>
              <div className="cp-modal__stat-value">{promoters.length}</div>
            </div>
            <div className="cp-modal__stat">
              <div className="cp-modal__stat-label">Shops Linked</div>
              <div className="cp-modal__stat-value">{shops.length}</div>
            </div>
            <div className="cp-modal__stat">
              <div className="cp-modal__stat-label">Total Sales</div>
              <div className="cp-modal__stat-value">{salesCount}</div>
            </div>
            <div className="cp-modal__stat">
              <div className="cp-modal__stat-label">Commission</div>
              <div className="cp-modal__stat-value">
                ₹{commission.toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          <div className="cp-modal__section">
            <h3 className="cp-modal__section-title">Contact</h3>
            <div className="cp-modal__grid">
              <div className="cp-modal__row">
                <span>Mobile</span>
                <span>{admin.mobile || '—'}</span>
              </div>
              <div className="cp-modal__row">
                <span>Email</span>
                <span>{admin.email || '—'}</span>
              </div>
              <div className="cp-modal__row">
                <span>Pincode</span>
                <span>{admin.pincode || '—'}</span>
              </div>
              <div className="cp-modal__row">
                <span>Status</span>
                <span style={{ color: admin.isActive ? '#16a34a' : '#dc2626' }}>
                  {admin.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>

          <div className="cp-modal__section">
            <h3 className="cp-modal__section-title">Shops ({shops.length})</h3>
            {shops.length === 0 ? (
              <div className="cp-modal__list-empty">No shops linked.</div>
            ) : (
              <ul className="cp-modal__list">
                {shops.map((s) => (
                  <li key={s._id || s.shopCode}>
                    <span>
                      <strong>{s.shopName}</strong>
                      <span style={{ color: '#94a3b8', marginLeft: 6 }}>
                        {s.shopCode}
                      </span>
                    </span>
                    <span>{Number(s.sales) || 0} sales</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="cp-modal__section">
            <h3 className="cp-modal__section-title">
              Promoters ({promoters.length})
            </h3>
            {promoters.length === 0 ? (
              <div className="cp-modal__list-empty">No promoters under this taluk.</div>
            ) : (
              <ul className="cp-modal__list">
                {promoters.map((p) => (
                  <li key={p._id || p.adminId}>
                    <span>
                      <strong>{p.fullName}</strong>
                      <span style={{ color: '#94a3b8', marginLeft: 6 }}>
                        {p.adminId}
                      </span>
                    </span>
                    <span>{p.mobile || '—'}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
