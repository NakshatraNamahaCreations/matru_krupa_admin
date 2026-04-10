import { useState, useEffect, useCallback } from 'react';
import { MdArrowBack, MdVisibility, MdDelete, MdPerson, MdWarning } from 'react-icons/md';
import { hierarchyAdminApi, shopApi, commissionRuleApi, districtSplitApi } from '../services/api';
import Loader from '../components/Loader';
import './HierarchySetup.css';

const LEVEL_OPTIONS = ['State Admin', 'Assistant District Admin', 'District Admin', 'Taluk Admin'];
const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const emptyForm = {
  fullName: '', dob: '', district: '', talukName: '',
  mobile: '', email: '', aadhar: '', pan: '',
  bankName: '', accountNumber: '', accountHolder: '', ifsc: '', accountType: 'Savings',
};

const emptyShopForm = {
  talukCode: '', hobli: 'Hunsur Town Hobli', shopName: '', ownerName: '',
  mobile: '', email: '', gst: '', address: '', category: 'Electronics', pos: 'Matru Krupa POS',
};

export default function HierarchySetup() {
  const [activeTab, setActiveTab] = useState('create');
  const [viewDetail, setViewDetail] = useState(null);

  // ── Loading / Error / Toast ──
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});

  // ── Create Admin ──
  const [adminLevel, setAdminLevel] = useState('Taluk Admin');
  const [formData, setFormData] = useState({ ...emptyForm });
  const [commissionRules, setCommissionRules] = useState([]);

  // ── Overview ──
  const [admins, setAdmins] = useState([]);
  const [levelFilter, setLevelFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // ── District Split ──
  const [splitDistrict, setSplitDistrict] = useState('Mysore');
  const [splits, setSplits] = useState([]);
  const [splitLoading, setSplitLoading] = useState(false);

  // ── Shop Registration ──
  const [shopForm, setShopForm] = useState({ ...emptyShopForm });
  const [shops, setShops] = useState([]);
  const [hobliStats, setHobliStats] = useState([]);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── FETCH DATA ──

  const fetchAdmins = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (levelFilter !== 'All') params.level = levelFilter;
      if (statusFilter !== 'All') params.status = statusFilter;
      const data = await hierarchyAdminApi.getAll(params);
      setAdmins(data);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [levelFilter, statusFilter]);

  const fetchRules = useCallback(async () => {
    try {
      const data = await commissionRuleApi.getAll();
      setCommissionRules(data);
    } catch (err) {
      showToast(err.message, 'error');
    }
  }, []);

  const fetchSplits = useCallback(async () => {
    try {
      setSplitLoading(true);
      const data = await districtSplitApi.get(splitDistrict);
      setSplits((data.splits || []).map((s, i) => ({
        ...s,
        pct: s.percentage,
        color: s.color || COLORS[i % COLORS.length],
      })));
    } catch (err) {
      setSplits([]);
    } finally {
      setSplitLoading(false);
    }
  }, [splitDistrict]);

  const fetchShops = useCallback(async () => {
    try {
      setLoading(true);
      const [shopsData, hobliData] = await Promise.all([
        shopApi.getAll(),
        shopApi.getHobliStats(),
      ]);
      setShops(shopsData);
      setHobliStats(hobliData);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'overview') fetchAdmins();
    if (activeTab === 'create') fetchRules();
    if (activeTab === 'split') fetchSplits();
    if (activeTab === 'shop') fetchShops();
  }, [activeTab, fetchAdmins, fetchRules, fetchSplits, fetchShops]);

  // ── VALIDATION ──

  const validateAdmin = () => {
    const e = {};
    if (!formData.fullName.trim()) e.fullName = 'Full name is required';
    if (!formData.mobile.trim()) e.mobile = 'Mobile is required';
    else if (!/^\d{10}$/.test(formData.mobile.trim())) e.mobile = 'Must be 10 digits';
    if (!formData.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = 'Invalid email';
    if (!formData.district) e.district = 'District is required';
    if (adminLevel === 'Taluk Admin' && !formData.talukName.trim()) e.talukName = 'Taluk name is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateShop = () => {
    const e = {};
    if (!shopForm.shopName.trim()) e.shopName = 'Shop name is required';
    if (!shopForm.ownerName.trim()) e.ownerName = 'Owner name is required';
    if (!shopForm.hobli) e.hobli = 'Hobli is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── HANDLERS ──

  const handleCreateAdmin = async () => {
    if (!validateAdmin()) return;
    try {
      setSubmitting(true);
      await hierarchyAdminApi.create({ ...formData, level: adminLevel });
      showToast('Admin created successfully!');
      setFormData({ ...emptyForm });
      setErrors({});
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAdmin = async (id) => {
    try {
      await hierarchyAdminApi.delete(id);
      showToast('Admin deleted');
      setDeleteConfirm(null);
      fetchAdmins();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleToggleAdmin = async (id) => {
    try {
      await hierarchyAdminApi.toggle(id);
      fetchAdmins();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleSaveSplit = async () => {
    const total = splits.reduce((sum, s) => sum + s.pct, 0);
    if (splits.length > 0 && total !== 100) {
      showToast(`Total must be 100%. Current: ${total}%`, 'error');
      return;
    }
    try {
      setSubmitting(true);
      await districtSplitApi.save({
        district: splitDistrict,
        splits: splits.map(s => ({
          name: s.name,
          percentage: s.pct,
          color: s.color,
          earned: s.earned || 0,
        })),
      });
      showToast('Split saved!');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateShop = async () => {
    if (!validateShop()) return;
    try {
      setSubmitting(true);
      await shopApi.create(shopForm);
      showToast('Shop registered!');
      setShopForm({ ...emptyShopForm });
      setErrors({});
      fetchShops();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteShop = async (id) => {
    try {
      await shopApi.delete(id);
      showToast('Shop deleted');
      fetchShops();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleSlider = (idx, val) => {
    const updated = [...splits];
    updated[idx].pct = parseInt(val);
    setSplits(updated);
  };

  const tabs = [
    { key: 'create', label: 'Create Admin' },
    { key: 'overview', label: 'Overview' },
    { key: 'split', label: 'District Admin split %' },
    { key: 'shop', label: 'Shop Registration' },
  ];

  // ── Detail View ──
  if (viewDetail) {
    const a = viewDetail;
    return (
      <div className="hs">
        <h1 className="hs-title">Hierarchy Setup</h1>
        <p className="hs-subtitle">Build the state &rarr; district &rarr; taluk &rarr; hobli &rarr; shop network. Each level creates the next.</p>
        <button className="hs-back-btn" onClick={() => setViewDetail(null)}><MdArrowBack /> Back</button>
        <div className="hs-profile-card">
          <div className="hs-profile-header">
            <div className="hs-profile-avatar"><MdPerson /></div>
            <div className="hs-profile-info">
              <h3>{a.fullName}</h3>
              <p>{a.email} &middot; {a.mobile}</p>
            </div>
          </div>
          <span className="hs-profile-role-badge">{a.level}</span>
        </div>

        <div className="hs-detail-tabs">
          <button className="hs-detail-tab active">Person Details</button>
        </div>

        <div className="hs-detail-grid">
          <div className="hs-detail-section">
            <h4>Personal Information</h4>
            <div className="hs-detail-row"><div className="hs-detail-label">Full Name</div><div className="hs-detail-value">{a.fullName}</div></div>
            <div className="hs-detail-row"><div className="hs-detail-label">Mobile Number</div><div className="hs-detail-value">{a.mobile}</div></div>
            <div className="hs-detail-row"><div className="hs-detail-label">Email ID</div><div className="hs-detail-value">{a.email}</div></div>
            <div className="hs-detail-row"><div className="hs-detail-label">Aadhar Number</div><div className="hs-detail-value">{a.aadhar || 'N/A'}</div></div>
            <div className="hs-detail-row"><div className="hs-detail-label">Pan Number</div><div className="hs-detail-value">{a.pan || 'N/A'}</div></div>
          </div>
          <div className="hs-detail-section">
            <h4>Location Information</h4>
            <div className="hs-detail-row"><div className="hs-detail-label">State</div><div className="hs-detail-value">{a.state || 'Karnataka'}</div></div>
            <div className="hs-detail-row"><div className="hs-detail-label">District</div><div className="hs-detail-value">{a.district || 'N/A'}</div></div>
            <div className="hs-detail-row"><div className="hs-detail-label">Taluk</div><div className="hs-detail-value">{a.talukName || 'N/A'}</div></div>
            <div className="hs-detail-row"><div className="hs-detail-label">Pincode</div><div className="hs-detail-value">{a.pincode || 'N/A'}</div></div>
          </div>
          <div className="hs-detail-section">
            <h4>Bank Account Information</h4>
            <div className="hs-detail-row"><div className="hs-detail-label">Account Holder Name</div><div className="hs-detail-value">{a.accountHolder || 'N/A'}</div></div>
            <div className="hs-detail-row"><div className="hs-detail-label">Account Number</div><div className="hs-detail-value">{a.accountNumber || 'N/A'}</div></div>
            <div className="hs-detail-row"><div className="hs-detail-label">IFSC Code</div><div className="hs-detail-value">{a.ifsc || 'N/A'}</div></div>
            <div className="hs-detail-row"><div className="hs-detail-label">Bank name</div><div className="hs-detail-value">{a.bankName || 'N/A'}</div></div>
            <div className="hs-detail-row"><div className="hs-detail-label">Account Type</div><div className="hs-detail-value">{a.accountType || 'N/A'}</div></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="hs">
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: 20, right: 20, zIndex: 9999,
          padding: '12px 24px', borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 600,
          background: toast.type === 'error' ? '#ef4444' : '#16a34a',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}>
          {toast.msg}
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 9998, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 24, maxWidth: 400, width: '90%' }}>
            <h3 style={{ margin: '0 0 12px', fontSize: 16 }}>Confirm Delete</h3>
            <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 20px' }}>Are you sure you want to delete this admin? This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button className="hs-btn hs-btn-outline" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="hs-btn" style={{ background: '#ef4444', color: '#fff', border: 'none' }} onClick={() => handleDeleteAdmin(deleteConfirm)}>Delete</button>
            </div>
          </div>
        </div>
      )}

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
                {LEVEL_OPTIONS.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div className="hs-form-group">
              <label className="hs-label">Full Name *</label>
              <input className="hs-input" placeholder="Enter Full Name" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
              {errors.fullName && <span style={{ color: '#ef4444', fontSize: 11 }}>{errors.fullName}</span>}
            </div>
            <div className="hs-row">
              <div className="hs-form-group">
                <label className="hs-label">Date of Birth</label>
                <input type="date" className="hs-input" value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} />
              </div>
              <div className="hs-form-group">
                <label className="hs-label">{adminLevel === 'Taluk Admin' ? 'District(Parent) *' : 'District *'}</label>
                <select className="hs-select" value={formData.district} onChange={e => setFormData({...formData, district: e.target.value})}>
                  <option value="">Select District</option>
                  <option>Mysuru</option>
                  <option>Bangalore</option>
                  <option>Mangalore</option>
                </select>
                {errors.district && <span style={{ color: '#ef4444', fontSize: 11 }}>{errors.district}</span>}
              </div>
            </div>
            {adminLevel === 'Taluk Admin' && (
              <div className="hs-form-group">
                <label className="hs-label">Taluk Name *</label>
                <input className="hs-input" placeholder="e.g. Hunsur" value={formData.talukName} onChange={e => setFormData({...formData, talukName: e.target.value})} />
                {errors.talukName && <span style={{ color: '#ef4444', fontSize: 11 }}>{errors.talukName}</span>}
              </div>
            )}
            <div className="hs-row">
              <div className="hs-form-group">
                <label className="hs-label">Mobile Number *</label>
                <input className="hs-input" placeholder="10 digit number" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} />
                {errors.mobile && <span style={{ color: '#ef4444', fontSize: 11 }}>{errors.mobile}</span>}
              </div>
              <div className="hs-form-group">
                <label className="hs-label">Email Id *</label>
                <input className="hs-input" placeholder="email@example.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                {errors.email && <span style={{ color: '#ef4444', fontSize: 11 }}>{errors.email}</span>}
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
            <button className="hs-btn hs-btn-primary" style={{ marginTop: 16 }} onClick={handleCreateAdmin} disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Admin'}
            </button>
          </div>

          <div className="hs-card">
            <div className="hs-card-title">COMMISSION RULES BY LEVEL</div>
            {commissionRules.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>Loading rules...</div>
            ) : (
              <table className="hs-rules-table">
                <thead>
                  <tr><th>LEVEL</th><th>CREATES</th><th>COMMISSION/SALE</th><th>SPLIT</th></tr>
                </thead>
                <tbody>
                  {commissionRules.map((r) => (
                    <tr key={r._id}>
                      <td><span className={`hs-level-badge ${r.badge}`}>{r.level}</span></td>
                      <td>{r.creates}</td>
                      <td>{'\u20B9'}{r.commissionPerSale?.toLocaleString()} per sale</td>
                      <td>{r.split === 'by %' ? <span className="hs-split-link">{r.split}</span> : r.split}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* === OVERVIEW TAB === */}
      {activeTab === 'overview' && (
        <>
          <div className="hs-overview-filters">
            <div className="hs-form-group" style={{ marginBottom: 0 }}>
              <label className="hs-label">Select Level</label>
              <select className="hs-select" style={{ minWidth: 120 }} value={levelFilter} onChange={e => setLevelFilter(e.target.value)}>
                <option>All</option>
                {LEVEL_OPTIONS.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div className="hs-form-group" style={{ marginBottom: 0 }}>
              <label className="hs-label">Status</label>
              <select className="hs-select" style={{ minWidth: 100 }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <option>All</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><Loader /></div>
          ) : admins.length === 0 ? (
            <div className="hs-table-card" style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>
              No admins found. Create one in the "Create Admin" tab.
            </div>
          ) : (
            <div className="hs-table-card">
              <table className="hs-table">
                <thead>
                  <tr><th>Sl. No</th><th>Level</th><th>Name</th><th>Admin ID</th><th>Contact Details</th><th>Status</th><th>Action</th></tr>
                </thead>
                <tbody>
                  {admins.map((a, i) => (
                    <tr key={a._id}>
                      <td>{i + 1}</td>
                      <td>{a.level}</td>
                      <td style={{ fontWeight: 600 }}>{a.fullName}</td>
                      <td>{a.adminId}</td>
                      <td>
                        <span style={{ display: 'block' }}>{a.email}</span>
                        <span style={{ fontSize: 12, color: '#64748b' }}>{a.mobile}</span>
                      </td>
                      <td>
                        <span
                          className={a.isActive ? 'hs-active-badge' : 'hs-inactive-badge'}
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleToggleAdmin(a._id)}
                        >
                          {a.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <button className="hs-action-btn" onClick={() => setViewDetail(a)}><MdVisibility /></button>
                        <button className="hs-action-btn delete" onClick={() => setDeleteConfirm(a._id)}><MdDelete /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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

            {splitLoading ? (
              <div style={{ textAlign: 'center', padding: 30 }}><Loader /></div>
            ) : splits.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 30, color: '#94a3b8', fontSize: 13 }}>
                No splits configured for {splitDistrict}. Add district admins to configure.
              </div>
            ) : (
              splits.map((s, i) => (
                <div className="hs-slider-row" key={i}>
                  <span className="hs-slider-dot" style={{ background: s.color }} />
                  <span className="hs-slider-name">{s.name}</span>
                  <input type="range" className="hs-slider" min="0" max="100" value={s.pct} onChange={e => handleSlider(i, e.target.value)} />
                  <span className="hs-slider-pct" style={{ color: s.color }}>{s.pct}%</span>
                </div>
              ))
            )}

            <div className="hs-split-actions">
              <button className="hs-btn hs-btn-primary" onClick={() => setActiveTab('create')}>+Add District Admin</button>
              <button className="hs-btn hs-btn-outline" onClick={handleSaveSplit} disabled={submitting || splits.length === 0}>
                {submitting ? 'Saving...' : 'Save Split'}
              </button>
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
                    <tr key={i}><td>{s.name}</td><td>{'\u20B9'}{(s.earned || 0).toLocaleString()}</td></tr>
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
              <label className="hs-label">Select Hobli *</label>
              <select className="hs-select" value={shopForm.hobli} onChange={e => setShopForm({...shopForm, hobli: e.target.value})}>
                <option>Hunsur Town Hobli</option>
                <option>Jayapura Hobli</option>
                <option>Koppa Hobli</option>
                <option>Bettadapura Hobli</option>
              </select>
              {errors.hobli && <span style={{ color: '#ef4444', fontSize: 11 }}>{errors.hobli}</span>}
            </div>
            <div className="hs-form-group">
              <label className="hs-label">Shop Name *</label>
              <input className="hs-input" placeholder="Enter shop name" value={shopForm.shopName} onChange={e => setShopForm({...shopForm, shopName: e.target.value})} />
              {errors.shopName && <span style={{ color: '#ef4444', fontSize: 11 }}>{errors.shopName}</span>}
            </div>
            <div className="hs-form-group">
              <label className="hs-label">Owner Full Name *</label>
              <input className="hs-input" placeholder="Enter owner full name" value={shopForm.ownerName} onChange={e => setShopForm({...shopForm, ownerName: e.target.value})} />
              {errors.ownerName && <span style={{ color: '#ef4444', fontSize: 11 }}>{errors.ownerName}</span>}
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
            <button className="hs-btn hs-btn-primary" style={{ marginTop: 16 }} onClick={handleCreateShop} disabled={submitting}>
              {submitting ? 'Registering...' : 'Register Shop'}
            </button>
          </div>

          <div>
            <div className="hs-card" style={{ marginBottom: 20 }}>
              <div className="hs-shop-filters">
                <div className="hs-form-group" style={{ marginBottom: 0 }}>
                  <label className="hs-label">Select Taluk</label>
                  <select className="hs-select" style={{ minWidth: 120 }}><option>Hunsur</option><option>Mysuru</option></select>
                </div>
                <div className="hs-form-group" style={{ marginBottom: 0 }}>
                  <label className="hs-label">Select Date</label>
                  <select className="hs-select" style={{ minWidth: 140 }}><option>Last 30 days</option><option>Last 7 days</option><option>Last 90 days</option></select>
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

              <div style={{ fontWeight: 700, fontSize: 13, color: '#1e293b', marginBottom: 12 }}>HOBLI COVERAGE</div>
              <div className="hs-hobli-grid">
                {hobliStats.length === 0 ? (
                  <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 20, color: '#94a3b8', fontSize: 13 }}>
                    No hobli data yet. Register shops to see coverage.
                  </div>
                ) : (
                  hobliStats.map((h, i) => (
                    <div className="hs-hobli-card" key={i}>
                      <div className="hs-hobli-name">{h.name}</div>
                      <div className="hs-hobli-shops">{h.shops} shops</div>
                      <div className="hs-hobli-sales">{h.sales} sales</div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="hs-table-card">
              <div style={{ padding: '16px 20px', fontWeight: 700, fontSize: 14, color: '#1e293b' }}>Registered Shops</div>
              {loading ? (
                <div style={{ textAlign: 'center', padding: 30 }}><Loader /></div>
              ) : shops.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 30, color: '#94a3b8', fontSize: 13 }}>No shops registered yet.</div>
              ) : (
                <table className="hs-table">
                  <thead>
                    <tr><th>Shop Name</th><th>Hobli</th><th>Owner</th><th>Sales</th><th>Status</th><th>Action</th></tr>
                  </thead>
                  <tbody>
                    {shops.map(s => (
                      <tr key={s._id}>
                        <td>
                          <span style={{ fontWeight: 600, display: 'block' }}>{s.shopName}</span>
                          <span style={{ fontSize: 11, color: '#94a3b8' }}>{s.shopCode}</span>
                        </td>
                        <td>{s.hobli}</td>
                        <td>{s.ownerName}</td>
                        <td>{s.sales}</td>
                        <td><span className="hs-active-badge">{s.isActive ? 'Active' : 'Inactive'}</span></td>
                        <td>
                          <button className="hs-action-btn"><MdVisibility /></button>
                          <button className="hs-action-btn delete" onClick={() => handleDeleteShop(s._id)}><MdDelete /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
