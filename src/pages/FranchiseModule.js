import React, { useState, useEffect, useCallback } from 'react';
import {
  MdVisibility,
  MdEdit,
  MdBlock,
  MdSearch,
  MdFilterList,
  MdKeyboardArrowDown,
  MdAdd,
  MdCloudUpload,
  MdDelete,
  MdClose,
  MdRefresh,
} from 'react-icons/md';
import './FranchiseModule.css';
import { franchiseApi, franchiseApplicationApi } from '../services/api';

const emptyForm = {
  franchiseName: '',
  owner: '',
  email: '',
  mobile: '',
  gstNumber: '',
  address: '',
  stateRegion: '',
  accountHolderName: '',
  accountNumber: '',
  reEnterAccountNumber: '',
  ifscCode: '',
  bankName: '',
  branch: '',
  accountType: '',
  documentUpload: null,
  addressProof: null,
  idProof: null,
};

const STATUS_OPTIONS = ['pending', 'reviewing', 'approved', 'rejected'];

const generateFranchiseId = () =>
  `FR${Math.floor(1000 + Math.random() * 9000)}`;

export default function FranchiseModule() {
  const [franchises, setFranchises] = useState([]);
  const [franchisesLoading, setFranchisesLoading] = useState(false);
  const [franchisesError, setFranchisesError] = useState('');
  const [savingFranchise, setSavingFranchise] = useState(false);
  const [search, setSearch] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState({ ...emptyForm });
  const [editingId, setEditingId] = useState(null);
  const [editingFranchiseId, setEditingFranchiseId] = useState('');

  // Tab + applications state
  const [tab, setTab] = useState('onboarded');
  const [applications, setApplications] = useState([]);
  const [appsLoading, setAppsLoading] = useState(false);
  const [appsError, setAppsError] = useState('');
  const [appSearch, setAppSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApp, setSelectedApp] = useState(null);
  const [savingApp, setSavingApp] = useState(false);
  const [selectedFranchise, setSelectedFranchise] = useState(null);
  const [togglingFranchiseId, setTogglingFranchiseId] = useState(null);

  const loadApplications = useCallback(async () => {
    setAppsLoading(true);
    setAppsError('');
    try {
      const params = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      if (appSearch.trim()) params.search = appSearch.trim();
      const data = await franchiseApplicationApi.getAll(params);
      setApplications(Array.isArray(data) ? data : []);
    } catch (err) {
      setAppsError(err.message || 'Failed to load applications');
    } finally {
      setAppsLoading(false);
    }
  }, [statusFilter, appSearch]);

  useEffect(() => {
    if (tab === 'applications') loadApplications();
  }, [tab, loadApplications]);

  const loadFranchises = useCallback(async () => {
    setFranchisesLoading(true);
    setFranchisesError('');
    try {
      const data = await franchiseApi.getAll();
      setFranchises(Array.isArray(data) ? data : []);
    } catch (err) {
      setFranchisesError(err.message || 'Failed to load franchises');
    } finally {
      setFranchisesLoading(false);
    }
  }, []);

  // Load onboarded franchises on mount.
  useEffect(() => {
    loadFranchises();
  }, [loadFranchises]);

  const handleToggleFranchise = async (franchise) => {
    const action = franchise.isActive ? 'Deactivate' : 'Activate';
    if (!window.confirm(`${action} ${franchise.franchiseName}?`)) return;
    setTogglingFranchiseId(franchise._id);
    try {
      const updated = await franchiseApi.toggle(franchise._id);
      setFranchises((prev) =>
        prev.map((f) => (f._id === franchise._id ? updated : f)),
      );
      if (selectedFranchise && selectedFranchise._id === franchise._id) {
        setSelectedFranchise(updated);
      }
    } catch (err) {
      alert(err.message || 'Failed to update franchise status');
    } finally {
      setTogglingFranchiseId(null);
    }
  };

  const handleUpdateAppStatus = async (id, status) => {
    setSavingApp(true);
    try {
      const updated = await franchiseApplicationApi.update(id, { status });
      setApplications((prev) =>
        prev.map((a) => (a._id === id ? updated : a)),
      );
      if (selectedApp && selectedApp._id === id) setSelectedApp(updated);
      // Backend auto-creates a Franchise when status flips to approved.
      // Refresh the onboarded list so the new entry shows up immediately.
      if (status === 'approved') loadFranchises();
    } catch (err) {
      alert(err.message || 'Failed to update status');
    } finally {
      setSavingApp(false);
    }
  };

  const handleDeleteApp = async (id) => {
    if (!window.confirm('Delete this application? This cannot be undone.')) return;
    try {
      await franchiseApplicationApi.delete(id);
      setApplications((prev) => prev.filter((a) => a._id !== id));
      if (selectedApp && selectedApp._id === id) setSelectedApp(null);
    } catch (err) {
      alert(err.message || 'Failed to delete application');
    }
  };

  const filtered = franchises.filter(
    (item) =>
      item.franchiseName.toLowerCase().includes(search.toLowerCase()) ||
      item.franchiseId.toLowerCase().includes(search.toLowerCase()) ||
      item.owner.toLowerCase().includes(search.toLowerCase()) ||
      item.gstNumber.toLowerCase().includes(search.toLowerCase())
  );

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setForm((prev) => ({ ...prev, [name]: files[0] || null }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (savingFranchise) return;
    const payload = {
      franchiseName: form.franchiseName.trim(),
      owner: form.owner.trim(),
      email: form.email.trim(),
      mobile: form.mobile.trim(),
      gstNumber: form.gstNumber.trim(),
      address: form.address.trim(),
      stateRegion: form.stateRegion.trim(),
      accountHolderName: form.accountHolderName.trim(),
      accountNumber: form.accountNumber.trim(),
      ifscCode: form.ifscCode.trim(),
      bankName: form.bankName.trim(),
      branch: form.branch.trim(),
      accountType: form.accountType.trim(),
    };
    setSavingFranchise(true);
    try {
      if (editingId != null) {
        await franchiseApi.update(editingId, payload);
      } else {
        await franchiseApi.create({
          ...payload,
          franchiseId: editingFranchiseId || undefined,
        });
      }
      await loadFranchises();
      setShowAddForm(false);
      setForm({ ...emptyForm });
      setEditingId(null);
      setEditingFranchiseId('');
    } catch (err) {
      alert(err.message || 'Failed to save franchise');
    } finally {
      setSavingFranchise(false);
    }
  };

  const handleBack = () => {
    setShowAddForm(false);
    setForm({ ...emptyForm });
    setEditingId(null);
    setEditingFranchiseId('');
  };

  const handleEdit = (item) => {
    setForm({
      ...emptyForm,
      franchiseName: item.franchiseName || '',
      owner: item.owner || '',
      email: item.email || '',
      mobile: item.mobile || '',
      gstNumber: item.gstNumber || '',
      address: item.address || '',
      stateRegion: item.stateRegion || '',
      accountHolderName: item.accountHolderName || '',
      accountNumber: item.accountNumber || '',
      ifscCode: item.ifscCode || '',
      bankName: item.bankName || '',
      branch: item.branch || '',
      accountType: item.accountType || '',
    });
    setEditingId(item._id);
    setEditingFranchiseId(item.franchiseId);
    setShowAddForm(true);
  };

  if (showAddForm) {
    return (
      <div className="franchise-page">
        {/* Form Header */}
        <div className="franchise-form-header">
          <h1 className="franchise-form-title">Add / Edit Franchise profile</h1>
          <p className="franchise-form-subtitle">
            Franchise ID: <span>{editingFranchiseId || '(auto-generated)'}</span>
          </p>
        </div>

        <div className="franchise-form-card">
          <form onSubmit={handleSave} className="franchise-form">
            {/* ---- Basic Info Section ---- */}
            <h2 className="franchise-section-heading">Basic Info</h2>
            <div className="franchise-form-grid">
              {/* Franchise Name - full width */}
              <div className="franchise-form-group franchise-form-full">
                <label className="franchise-form-label">Franchise Name</label>
                <input
                  type="text"
                  name="franchiseName"
                  value={form.franchiseName}
                  onChange={handleFormChange}
                  className="franchise-form-input"
                  placeholder="Enter franchise name"
                />
              </div>

              {/* Owner | Email */}
              <div className="franchise-form-group">
                <label className="franchise-form-label">Owner</label>
                <input
                  type="text"
                  name="owner"
                  value={form.owner}
                  onChange={handleFormChange}
                  className="franchise-form-input"
                  placeholder="Enter owner name"
                />
              </div>
              <div className="franchise-form-group">
                <label className="franchise-form-label">Email ID</label>
                <input
                  type="text"
                  name="email"
                  value={form.email}
                  onChange={handleFormChange}
                  className="franchise-form-input"
                  placeholder="Enter email id"
                />
              </div>

              {/* Mobile | GST */}
              <div className="franchise-form-group">
                <label className="franchise-form-label">Mobile Number</label>
                <input
                  type="text"
                  name="mobile"
                  value={form.mobile}
                  onChange={handleFormChange}
                  className="franchise-form-input"
                  placeholder="Enter mobile number"
                />
              </div>
              <div className="franchise-form-group">
                <label className="franchise-form-label">GST Number</label>
                <input
                  type="text"
                  name="gstNumber"
                  value={form.gstNumber}
                  onChange={handleFormChange}
                  className="franchise-form-input"
                  placeholder="Enter GST number"
                />
              </div>

              {/* Address - full width */}
              <div className="franchise-form-group franchise-form-full">
                <label className="franchise-form-label">Address</label>
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleFormChange}
                  className="franchise-form-input"
                  placeholder="Enter address"
                />
              </div>

              {/* State/Region - half width */}
              <div className="franchise-form-group">
                <label className="franchise-form-label">State/Region</label>
                <input
                  type="text"
                  name="stateRegion"
                  value={form.stateRegion}
                  onChange={handleFormChange}
                  className="franchise-form-input"
                  placeholder="Enter state/region"
                />
              </div>
            </div>

            {/* ---- Banking Details Section ---- */}
            <h2 className="franchise-section-heading">Banking Details</h2>
            <div className="franchise-form-grid">
              {/* Account Holder Name | Account Number */}
              <div className="franchise-form-group">
                <label className="franchise-form-label">Account Holder Name</label>
                <input
                  type="text"
                  name="accountHolderName"
                  value={form.accountHolderName}
                  onChange={handleFormChange}
                  className="franchise-form-input"
                  placeholder="Enter account holder name"
                />
              </div>
              <div className="franchise-form-group">
                <label className="franchise-form-label">Account Number</label>
                <input
                  type="text"
                  name="accountNumber"
                  value={form.accountNumber}
                  onChange={handleFormChange}
                  className="franchise-form-input"
                  placeholder="Enter account number"
                />
              </div>

              {/* Re-enter Account Number | IFSC Code */}
              <div className="franchise-form-group">
                <label className="franchise-form-label">Re-enter Account Number</label>
                <input
                  type="text"
                  name="reEnterAccountNumber"
                  value={form.reEnterAccountNumber}
                  onChange={handleFormChange}
                  className="franchise-form-input"
                  placeholder="Re-enter account number"
                />
              </div>
              <div className="franchise-form-group">
                <label className="franchise-form-label">IFSC Code</label>
                <input
                  type="text"
                  name="ifscCode"
                  value={form.ifscCode}
                  onChange={handleFormChange}
                  className="franchise-form-input"
                  placeholder="Enter IFSC code"
                />
              </div>

              {/* Bank Name | Branch */}
              <div className="franchise-form-group">
                <label className="franchise-form-label">Bank Name</label>
                <input
                  type="text"
                  name="bankName"
                  value={form.bankName}
                  onChange={handleFormChange}
                  className="franchise-form-input"
                  placeholder="Enter bank name"
                />
              </div>
              <div className="franchise-form-group">
                <label className="franchise-form-label">Branch</label>
                <input
                  type="text"
                  name="branch"
                  value={form.branch}
                  onChange={handleFormChange}
                  className="franchise-form-input"
                  placeholder="Enter branch"
                />
              </div>

              {/* Account Type - half width */}
              <div className="franchise-form-group">
                <label className="franchise-form-label">Account Type</label>
                <input
                  type="text"
                  name="accountType"
                  value={form.accountType}
                  onChange={handleFormChange}
                  className="franchise-form-input"
                  placeholder="Enter account type"
                />
              </div>
            </div>

            {/* ---- Document Upload Section ---- */}
            <h2 className="franchise-section-heading">Document Upload</h2>
            <div className="franchise-form-grid">
              {/* Document Upload | Address Proof */}
              <div className="franchise-form-group">
                <label className="franchise-form-label">Document Upload</label>
                <div className="franchise-file-upload">
                  <input
                    type="file"
                    name="documentUpload"
                    id="documentUpload"
                    onChange={handleFileChange}
                    className="franchise-file-input"
                  />
                  <label htmlFor="documentUpload" className="franchise-file-label">
                    <MdCloudUpload className="franchise-file-icon" />
                    <span>
                      {form.documentUpload ? form.documentUpload.name : 'Choose file'}
                    </span>
                  </label>
                </div>
              </div>
              <div className="franchise-form-group">
                <label className="franchise-form-label">Address Proof</label>
                <div className="franchise-file-upload">
                  <input
                    type="file"
                    name="addressProof"
                    id="addressProof"
                    onChange={handleFileChange}
                    className="franchise-file-input"
                  />
                  <label htmlFor="addressProof" className="franchise-file-label">
                    <MdCloudUpload className="franchise-file-icon" />
                    <span>
                      {form.addressProof ? form.addressProof.name : 'Choose file'}
                    </span>
                  </label>
                </div>
              </div>

              {/* ID Proof - half width */}
              <div className="franchise-form-group">
                <label className="franchise-form-label">ID Proof</label>
                <div className="franchise-file-upload">
                  <input
                    type="file"
                    name="idProof"
                    id="idProof"
                    onChange={handleFileChange}
                    className="franchise-file-input"
                  />
                  <label htmlFor="idProof" className="franchise-file-label">
                    <MdCloudUpload className="franchise-file-icon" />
                    <span>
                      {form.idProof ? form.idProof.name : 'Choose file'}
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* ---- Action Buttons ---- */}
            <div className="franchise-form-actions">
              <button
                type="submit"
                className="franchise-save-btn"
                disabled={savingFranchise}
              >
                {savingFranchise ? 'Saving…' : 'Save'}
              </button>
              <button
                type="button"
                className="franchise-back-btn"
                onClick={handleBack}
              >
                Back
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="franchise-page">
      {/* Header */}
      <div className="franchise-header">
        <h1 className="franchise-title">Franchise Module</h1>
        {tab === 'onboarded' && (
          <button
            className="franchise-add-btn"
            onClick={() => {
              setEditingId(null);
              setForm({ ...emptyForm });
              setEditingFranchiseId(generateFranchiseId());
              setShowAddForm(true);
            }}
          >
            <MdAdd className="franchise-add-icon" />
            Add Franchise
          </button>
        )}
        {tab === 'applications' && (
          <button
            className="franchise-add-btn franchise-refresh-btn"
            onClick={loadApplications}
            disabled={appsLoading}
            title="Refresh"
          >
            <MdRefresh className="franchise-add-icon" />
            Refresh
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="franchise-tabs">
        <button
          className={`franchise-tab ${tab === 'onboarded' ? 'franchise-tab--active' : ''}`}
          onClick={() => setTab('onboarded')}
        >
          Onboarded Franchises
        </button>
        <button
          className={`franchise-tab ${tab === 'applications' ? 'franchise-tab--active' : ''}`}
          onClick={() => setTab('applications')}
        >
          Website Applications
          {applications.length > 0 && (
            <span className="franchise-tab-badge">{applications.length}</span>
          )}
        </button>
      </div>

      {tab === 'onboarded' && (
        <>
          {/* Search & Filter Row */}
          <div className="franchise-toolbar">
            <div className="franchise-search">
              <MdSearch className="franchise-search-icon" />
              <input
                type="text"
                placeholder="Search by name, owner, GST"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button className="franchise-filter-btn">
              <MdFilterList className="franchise-filter-icon" />
              Filter
              <MdKeyboardArrowDown className="franchise-filter-arrow" />
            </button>
          </div>

          {/* Onboarded Table */}
          <div className="franchise-table-wrapper">
            {franchisesError && (
              <div className="franchise-error-banner">{franchisesError}</div>
            )}
            <table className="franchise-table">
              <thead>
                <tr>
                  <th>Franchise ID</th>
                  <th>Franchise Name</th>
                  <th>Owner</th>
                  <th>Email Id</th>
                  <th>Mobile Number</th>
                  <th>GST Number</th>
                  <th>State/Region</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {franchisesLoading && (
                  <tr>
                    <td colSpan="8" className="franchise-empty">Loading…</td>
                  </tr>
                )}
                {!franchisesLoading && filtered.map((item) => (
                  <tr
                    key={item._id}
                    className={
                      item.isActive === false ? 'franchise-row--inactive' : ''
                    }
                  >
                    <td>{item.franchiseId}</td>
                    <td>
                      {item.franchiseName}
                      {item.isActive === false && (
                        <span className="franchise-status franchise-status--rejected" style={{ marginLeft: 8 }}>
                          Inactive
                        </span>
                      )}
                    </td>
                    <td>{item.owner}</td>
                    <td>{item.email}</td>
                    <td>{item.mobile}</td>
                    <td>{item.gstNumber}</td>
                    <td>{item.stateRegion}</td>
                    <td>
                      <div className="franchise-actions">
                        <button
                          className="franchise-action-btn franchise-view-btn"
                          title="View"
                          onClick={() => setSelectedFranchise(item)}
                        >
                          <MdVisibility />
                        </button>
                        <button
                          className="franchise-action-btn franchise-edit-btn"
                          title="Edit"
                          onClick={() => handleEdit(item)}
                        >
                          <MdEdit />
                        </button>
                        <button
                          className="franchise-action-btn franchise-deactivate-btn"
                          title={item.isActive ? 'Deactivate' : 'Activate'}
                          disabled={togglingFranchiseId === item._id}
                          onClick={() => handleToggleFranchise(item)}
                        >
                          <MdBlock />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!franchisesLoading && filtered.length === 0 && (
                  <tr>
                    <td colSpan="8" className="franchise-empty">
                      No franchise records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === 'applications' && (
        <>
          {/* Search & Status Filter */}
          <div className="franchise-toolbar">
            <div className="franchise-search">
              <MdSearch className="franchise-search-icon" />
              <input
                type="text"
                placeholder="Search by name, email, mobile, firm, city, pincode"
                value={appSearch}
                onChange={(e) => setAppSearch(e.target.value)}
              />
            </div>
            <select
              className="franchise-status-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All statuses</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Applications Table */}
          <div className="franchise-table-wrapper">
            {appsError && <div className="franchise-error-banner">{appsError}</div>}
            <table className="franchise-table">
              <thead>
                <tr>
                  <th>Submitted</th>
                  <th>Applicant</th>
                  <th>Email</th>
                  <th>Mobile</th>
                  <th>City / State</th>
                  <th>Firm</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {appsLoading && (
                  <tr>
                    <td colSpan="8" className="franchise-empty">Loading…</td>
                  </tr>
                )}
                {!appsLoading && applications.length === 0 && (
                  <tr>
                    <td colSpan="8" className="franchise-empty">
                      No applications received yet.
                    </td>
                  </tr>
                )}
                {!appsLoading &&
                  applications.map((app) => (
                    <tr key={app._id}>
                      <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                      <td>{app.firstName} {app.lastName}</td>
                      <td>{app.email}</td>
                      <td>{app.mobile}</td>
                      <td>{app.city}, {app.state}</td>
                      <td>{app.firmName}</td>
                      <td>
                        <span className={`franchise-status franchise-status--${app.status}`}>
                          {app.status}
                        </span>
                      </td>
                      <td>
                        <div className="franchise-actions">
                          <button
                            className="franchise-action-btn franchise-view-btn"
                            title="View details"
                            onClick={() => setSelectedApp(app)}
                          >
                            <MdVisibility />
                          </button>
                          <button
                            className="franchise-action-btn franchise-deactivate-btn"
                            title="Delete"
                            onClick={() => handleDeleteApp(app._id)}
                          >
                            <MdDelete />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Application Detail Modal */}
      {selectedApp && (
        <div className="franchise-modal-overlay" onClick={() => setSelectedApp(null)}>
          <div className="franchise-modal" onClick={(e) => e.stopPropagation()}>
            <div className="franchise-modal-head">
              <div>
                <h2 className="franchise-modal-title">
                  {selectedApp.firstName} {selectedApp.lastName}
                </h2>
                <p className="franchise-modal-sub">
                  Submitted {new Date(selectedApp.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                className="franchise-modal-close"
                onClick={() => setSelectedApp(null)}
                aria-label="Close"
              >
                <MdClose />
              </button>
            </div>

            <div className="franchise-modal-status-row">
              <label className="franchise-modal-status-label">Status</label>
              <select
                className="franchise-status-select"
                value={selectedApp.status}
                disabled={savingApp}
                onChange={(e) => handleUpdateAppStatus(selectedApp._id, e.target.value)}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
              <span className={`franchise-status franchise-status--${selectedApp.status}`}>
                {selectedApp.status}
              </span>
            </div>

            <div className="franchise-modal-body">
              <DetailSection title="Personal Information">
                <DetailRow label="Email" value={selectedApp.email} />
                <DetailRow label="Mobile" value={selectedApp.mobile} />
                <DetailRow label="State" value={selectedApp.state} />
                <DetailRow label="City" value={selectedApp.city} />
                <DetailRow label="Pincode" value={selectedApp.pincode} />
              </DetailSection>

              <DetailSection title="Career / Business Information">
                <DetailRow label="Firm Name" value={selectedApp.firmName} />
                <DetailRow label="Firm Address" value={selectedApp.firmAddress} />
                <DetailRow label="GST Number" value={selectedApp.gstNumber || '—'} />
                <DetailRow label="Employment" value={selectedApp.employment} />
                <DetailRow label="Nature of Firm" value={selectedApp.firmNature} />
                <DetailRow label="Position" value={selectedApp.position} />
                <DetailRow label="Last FY Turnover" value={selectedApp.turnover} />
                <DetailRow label="Type of Business" value={selectedApp.businessType} />
                <DetailRow label="Owns Retail Shop" value={selectedApp.ownsRetail} />
                <DetailRow label="Legal Disputes" value={selectedApp.legalDisputes} />
              </DetailSection>

              <DetailSection title="Investment / Property">
                <DetailRow label="Cities of Interest" value={selectedApp.cities} />
                <DetailRow label="Owns Property" value={selectedApp.ownsProperty} />
              </DetailSection>

              <DetailSection title="Bank Details">
                <DetailRow label="Account Holder" value={selectedApp.accountHolder} />
                <DetailRow label="Bank Name" value={selectedApp.bankName} />
                <DetailRow label="Branch" value={selectedApp.branchName} />
                <DetailRow label="Account Number" value={selectedApp.accountNumber} />
                <DetailRow label="IFSC Code" value={selectedApp.ifsc} />
                <DetailRow label="Account Type" value={selectedApp.accountType} />
              </DetailSection>

              <DetailSection title="Other">
                <DetailRow label="Comments" value={selectedApp.comments || '—'} />
                <DetailRow
                  label="Confirmed ₹5,00,000 Deposit"
                  value={selectedApp.depositConfirm ? 'Yes' : 'No'}
                />
                <DetailRow
                  label="Accepted Terms"
                  value={selectedApp.acceptTerms ? 'Yes' : 'No'}
                />
              </DetailSection>
            </div>
          </div>
        </div>
      )}

      {/* Franchise Detail Modal */}
      {selectedFranchise && (
        <div
          className="franchise-modal-overlay"
          onClick={() => setSelectedFranchise(null)}
        >
          <div
            className="franchise-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="franchise-modal-head">
              <div>
                <h2 className="franchise-modal-title">
                  {selectedFranchise.franchiseName}
                </h2>
                <p className="franchise-modal-sub">
                  {selectedFranchise.franchiseId}
                  {selectedFranchise.stateRegion
                    ? ` · ${selectedFranchise.stateRegion}`
                    : ''}
                </p>
              </div>
              <button
                className="franchise-modal-close"
                onClick={() => setSelectedFranchise(null)}
                aria-label="Close"
              >
                <MdClose />
              </button>
            </div>

            <div className="franchise-modal-status-row">
              <span
                className={`franchise-status franchise-status--${
                  selectedFranchise.isActive ? 'approved' : 'rejected'
                }`}
              >
                {selectedFranchise.isActive ? 'Active' : 'Inactive'}
              </span>
              <button
                className="franchise-add-btn"
                style={{ marginLeft: 'auto' }}
                disabled={togglingFranchiseId === selectedFranchise._id}
                onClick={() => handleToggleFranchise(selectedFranchise)}
              >
                <MdBlock className="franchise-add-icon" />
                {selectedFranchise.isActive ? 'Deactivate' : 'Activate'}
              </button>
            </div>

            <div className="franchise-modal-body">
              <DetailSection title="Basic Info">
                <DetailRow label="Owner" value={selectedFranchise.owner} />
                <DetailRow label="Email" value={selectedFranchise.email} />
                <DetailRow label="Mobile" value={selectedFranchise.mobile} />
                <DetailRow
                  label="GST Number"
                  value={selectedFranchise.gstNumber || '—'}
                />
                <DetailRow
                  label="Address"
                  value={selectedFranchise.address || '—'}
                />
                <DetailRow
                  label="State / Region"
                  value={selectedFranchise.stateRegion || '—'}
                />
              </DetailSection>

              <DetailSection title="Banking Details">
                <DetailRow
                  label="Account Holder"
                  value={selectedFranchise.accountHolderName || '—'}
                />
                <DetailRow
                  label="Bank Name"
                  value={selectedFranchise.bankName || '—'}
                />
                <DetailRow
                  label="Branch"
                  value={selectedFranchise.branch || '—'}
                />
                <DetailRow
                  label="Account Number"
                  value={selectedFranchise.accountNumber || '—'}
                />
                <DetailRow
                  label="IFSC Code"
                  value={selectedFranchise.ifscCode || '—'}
                />
                <DetailRow
                  label="Account Type"
                  value={selectedFranchise.accountType || '—'}
                />
              </DetailSection>

              {selectedFranchise.sourceApplication && (
                <DetailSection title="Source">
                  <DetailRow
                    label="Onboarded From"
                    value="Website Application"
                  />
                </DetailSection>
              )}

              <DetailSection title="Meta">
                <DetailRow
                  label="Created"
                  value={
                    selectedFranchise.createdAt
                      ? new Date(selectedFranchise.createdAt).toLocaleString()
                      : '—'
                  }
                />
                <DetailRow
                  label="Last Updated"
                  value={
                    selectedFranchise.updatedAt
                      ? new Date(selectedFranchise.updatedAt).toLocaleString()
                      : '—'
                  }
                />
              </DetailSection>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailSection({ title, children }) {
  return (
    <div className="franchise-detail-section">
      <h3 className="franchise-detail-title">{title}</h3>
      <div className="franchise-detail-grid">{children}</div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="franchise-detail-row">
      <span className="franchise-detail-label">{label}</span>
      <span className="franchise-detail-value">{value}</span>
    </div>
  );
}
