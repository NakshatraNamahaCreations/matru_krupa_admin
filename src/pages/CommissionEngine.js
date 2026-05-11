import React, { useState, useEffect } from 'react';
import { MdArrowBack, MdVisibility, MdPerson } from 'react-icons/md';
import { districtApi, talukApi, hobliApi, shopApi, promoterSaleApi } from '../services/api';
import './CommissionEngine.css';

const commissionRules = [
  { level: 'STATE ADMIN', badge: 'state', perSale: '\u20B91,000', condition: 'KYC must be verified', deduction: '5% tds+ 5% svC' },
  { level: 'ASS DISTRICT ADMIN', badge: 'ass-district', perSale: '\u20B91,000', condition: 'KYC must be verified', deduction: '5% tds+ 5% svC' },
  { level: 'DISTRICT ADMIN', badge: 'district', perSale: '\u20B91,000', condition: 'KYC must be verified', deduction: '5% tds+ 5% svC' },
  { level: 'TALUK ADMIN', badge: 'taluk', perSale: '\u20B91,000', condition: 'KYC must be verified', deduction: '5% tds+ 5% svC' },
  { level: 'PROMOTERS', badge: 'promoter', perSale: '\u20B92,000', condition: 'KYC must be verified', deduction: '5% tds+ 5% svC' },
];

function formatSaleForDisplay(sale) {
  const dt = new Date(sale.saleDate);
  return {
    _id: sale._id,
    date: dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    time: dt.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true }),
    promoter: sale.promoterName || sale.promoterCode,
    code: sale.promoterCode,
    shop: sale.billingShop,
    hobli: sale.hobli,
    product: sale.quantity > 1 ? `${sale.productName} (x${sale.quantity})` : sale.productName,
    price: sale.price || '-',
    district: sale.district,
    taluk: sale.taluk,
    status: sale.status,
    kyc: sale.kyc || 'KYC Verified',
  };
}

export default function CommissionEngine() {
  const [activeTab, setActiveTab] = useState('simulator');
  const [viewDetail, setViewDetail] = useState(null);

  // Simulator form
  const [simForm, setSimForm] = useState({
    promoterCode: '', district: '', taluk: '', hobli: '',
    billingShop: '',
    productName: '', quantity: '', dateTime: '',
  });

  const [districtOptions, setDistrictOptions] = useState([]);
  const [talukOptions, setTalukOptions] = useState([]);
  const [hobliOptions, setHobliOptions] = useState([]);
  const [shopOptions, setShopOptions] = useState([]);
  const [promoterCodeError, setPromoterCodeError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Load promoter sales from backend
  const loadSales = (params = {}) => {
    promoterSaleApi.getAll(params)
      .then(items => setCommissions(items.map(formatSaleForDisplay)))
      .catch(() => setCommissions([]));
  };

  useEffect(() => {
    districtApi.getAll()
      .then(items => setDistrictOptions(items.map(d => d.name)))
      .catch(() => setDistrictOptions([]));
  }, []);

  useEffect(() => {
    if (!simForm.district) { setTalukOptions([]); return; }
    talukApi.getAll({ district: simForm.district })
      .then(items => setTalukOptions(items.map(t => t.name)))
      .catch(() => setTalukOptions([]));
  }, [simForm.district]);

  useEffect(() => {
    if (!simForm.taluk) { setHobliOptions([]); return; }
    hobliApi.getAll({ taluk: simForm.taluk })
      .then(items => setHobliOptions(items.map(h => h.name)))
      .catch(() => setHobliOptions([]));
  }, [simForm.taluk]);

  useEffect(() => {
    shopApi.getAll()
      .then(items => setShopOptions(items || []))
      .catch(() => setShopOptions([]));
  }, []);

  const filteredShopOptions = shopOptions.filter(s => {
    if (simForm.district && talukOptions.length > 0 && s.taluk && !talukOptions.includes(s.taluk)) return false;
    if (simForm.taluk && s.taluk && s.taluk !== simForm.taluk) return false;
    if (simForm.hobli && s.hobli && s.hobli !== simForm.hobli) return false;
    return true;
  });

  // Commissions list (loaded from backend)
  const [commissions, setCommissions] = useState([]);

  const handleApplyCode = async () => {
    if (!simForm.promoterCode || !simForm.district || !simForm.taluk || !simForm.hobli || !simForm.billingShop || !simForm.productName || !simForm.quantity || !simForm.dateTime) {
      return;
    }

    const code = simForm.promoterCode.trim().toUpperCase();
    if (!code.startsWith('KA-PR-')) {
      if (code.startsWith('KA-DA-')) {
        setPromoterCodeError('District Admin codes are not allowed. Please enter a Promoter code (KA-PR-XXX).');
      } else if (code.startsWith('KA-TA-')) {
        setPromoterCodeError('Taluk Admin codes are not allowed. Please enter a Promoter code (KA-PR-XXX).');
      } else if (code.startsWith('KA-SA-')) {
        setPromoterCodeError('State Admin codes are not allowed. Please enter a Promoter code (KA-PR-XXX).');
      } else if (code.startsWith('KA-ADA-')) {
        setPromoterCodeError('Ass. District Admin codes are not allowed. Please enter a Promoter code (KA-PR-XXX).');
      } else {
        setPromoterCodeError('Invalid code. Please enter a valid Promoter code (KA-PR-XXX).');
      }
      return;
    }
    setPromoterCodeError('');
    setSubmitting(true);

    try {
      await promoterSaleApi.create({
        promoterCode: code,
        district: simForm.district,
        taluk: simForm.taluk,
        hobli: simForm.hobli,
        billingShop: simForm.billingShop,
        productName: simForm.productName,
        quantity: simForm.quantity,
        saleDate: simForm.dateTime,
      });

      setSimForm({
        promoterCode: '', district: '', taluk: '', hobli: '',
        billingShop: '',
        productName: '', quantity: '', dateTime: '',
      });
      loadSales();
      setActiveTab('overview');
    } catch (err) {
      setPromoterCodeError(err.message || 'Failed to save sale');
    } finally {
      setSubmitting(false);
    }
  };

  // Overview filters
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // Re-fetch when any filter changes
  useEffect(() => {
    const params = {};
    if (searchQuery.trim()) params.search = searchQuery.trim();
    if (roleFilter) params.status = roleFilter;
    if (fromDate) {
      params.from = fromDate;
    } else if (dateFilter) {
      const now = new Date();
      const days = dateFilter === 'last7' ? 7 : dateFilter === 'last30' ? 30 : dateFilter === 'last90' ? 90 : 0;
      if (days) {
        const d = new Date(now);
        d.setDate(d.getDate() - days);
        params.from = d.toISOString().split('T')[0];
      }
    }
    if (toDate) params.to = toDate;
    loadSales(params);
  }, [searchQuery, roleFilter, dateFilter, fromDate, toDate]);

  // Detail view
  if (viewDetail) {
    const c = viewDetail;
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
                <span className="ce-profile-name">{c.promoter}</span>
                <span className="ce-profile-code">&middot; {c.code}</span>
              </div>
              <div className="ce-profile-sub">{c.district} &middot; {c.taluk} &middot; {c.hobli}</div>
              <span className="ce-profile-role">Promoter</span>
            </div>
          </div>
          <div className="ce-profile-right">
            <div className="ce-profile-earned-label">Commission Earned</div>
            <div className="ce-profile-earned-value">{'\u20B9'}2,000.00</div>
          </div>
        </div>

        <div className="ce-breakdown-section">
          <div className="ce-breakdown-title">SALE DETAILS</div>
          <div className="ce-breakdown-row">
            <div className="ce-breakdown-card">
              <div className="ce-breakdown-level">Product</div>
              <div className="ce-breakdown-name">{c.product}</div>
              {c.price && c.price !== '-' && <div className="ce-breakdown-amount">{'\u20B9'}{c.price}</div>}
            </div>
            <div className="ce-breakdown-card">
              <div className="ce-breakdown-level">Shop</div>
              <div className="ce-breakdown-name">{c.shop}</div>
              <div style={{ fontSize: 12, color: '#94a3b8' }}>{c.hobli}</div>
            </div>
            <div className="ce-breakdown-card">
              <div className="ce-breakdown-level">Date</div>
              <div className="ce-breakdown-name">{c.date}</div>
              <div style={{ fontSize: 12, color: '#94a3b8' }}>{c.time}</div>
            </div>
          </div>
        </div>

        <div className="ce-breakdown-section">
          <div className="ce-breakdown-title">COMMISSION BREAKDOWN</div>
          <div className="ce-breakdown-row">
            {commissionRules.map((r, i) => (
              <div className="ce-breakdown-card" key={i}>
                <div className="ce-breakdown-level">{r.level}</div>
                <div className="ce-breakdown-amount">{r.perSale}</div>
                <span className={`ce-breakdown-status`}>{c.status}</span>
              </div>
            ))}
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
              <input className="ce-input" placeholder="Enter Promoter Code (e.g. KA-PR-001)" value={simForm.promoterCode} onChange={e => { setSimForm({...simForm, promoterCode: e.target.value}); setPromoterCodeError(''); }} />
              {promoterCodeError && <span style={{ color: '#ef4444', fontSize: 12, marginTop: 4, display: 'block' }}>{promoterCodeError}</span>}
            </div>
            <div className="ce-form-group">
              <label className="ce-label">Select District</label>
              <select
                className="ce-select"
                value={simForm.district}
                onChange={e => setSimForm({ ...simForm, district: e.target.value, taluk: '', hobli: '', billingShop: '' })}
              >
                <option value="">Select District</option>
                {districtOptions.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="ce-form-group">
              <label className="ce-label">Select Taluk</label>
              <select
                className="ce-select"
                value={simForm.taluk}
                onChange={e => setSimForm({ ...simForm, taluk: e.target.value, hobli: '', billingShop: '' })}
                disabled={!simForm.district}
              >
                <option value="">Select Taluk</option>
                {talukOptions.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="ce-form-group">
              <label className="ce-label">Select Hobli</label>
              <select
                className="ce-select"
                value={simForm.hobli}
                onChange={e => setSimForm({ ...simForm, hobli: e.target.value, billingShop: '' })}
                disabled={!simForm.taluk}
              >
                <option value="">Select Hobli</option>
                {hobliOptions.map(h => <option key={h} value={h}>{h}</option>)}
              </select>
            </div>
            <div className="ce-form-group">
              <label className="ce-label">Select Billing shop</label>
              <select className="ce-select" value={simForm.billingShop} onChange={e => setSimForm({...simForm, billingShop: e.target.value})} disabled={!simForm.district}>
                <option value="">Select Billing Shop</option>
                {filteredShopOptions.map(s => (
                  <option key={s._id || s.shopCode || s.shopName} value={s.shopName}>
                    {s.shopName}{s.hobli ? ` - ${s.hobli}` : ''}
                  </option>
                ))}
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
            <button className="ce-btn ce-btn-primary" style={{ marginTop: 8 }} onClick={handleApplyCode} disabled={submitting}>{submitting ? 'Saving...' : 'Apply Code'}</button>
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
              <select className="ce-select" style={{ minWidth: 140 }} value={dateFilter} onChange={e => { setDateFilter(e.target.value); if (e.target.value) { setFromDate(''); setToDate(''); } }}>
                <option value="">All Time</option>
                <option value="last7">Last 7 days</option>
                <option value="last30">Last 30 days</option>
                <option value="last90">Last 90 days</option>
              </select>
            </div>
            <div className="ce-form-group" style={{ marginBottom: 0 }}>
              <label className="ce-label">From</label>
              <input type="date" className="ce-input" style={{ minWidth: 140 }} value={fromDate} onChange={e => { setFromDate(e.target.value); if (e.target.value) setDateFilter(''); }} />
            </div>
            <div className="ce-form-group" style={{ marginBottom: 0 }}>
              <label className="ce-label">To</label>
              <input type="date" className="ce-input" style={{ minWidth: 140 }} value={toDate} onChange={e => { setToDate(e.target.value); if (e.target.value) setDateFilter(''); }} />
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
                {commissions.map((c, i) => (
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
                      <span style={{ fontSize: 12, color: '#64748b' }}>{c.price && c.price !== '-' ? `\u20B9${c.price}` : '-'}</span>
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
