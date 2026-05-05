import React, { useState } from 'react';
import {
  MdVisibility,
  MdEdit,
  MdBlock,
  MdSearch,
  MdFilterList,
  MdKeyboardArrowDown,
  MdAdd,
  MdCloudUpload,
} from 'react-icons/md';
import './FranchiseModule.css';

const initialFranchises = [
  {
    id: 1,
    franchiseId: 'FR1234',
    franchiseName: 'Central Hub',
    owner: 'Sara',
    email: 'Sara123@gmail.com',
    mobile: '9900990001',
    gstNumber: '23AAAAA00004125',
    stateRegion: 'All-India',
  },
  {
    id: 2,
    franchiseId: 'FR4624',
    franchiseName: 'North Branch',
    owner: 'Manvith',
    email: 'Manvith@gmail.com',
    mobile: '9898989801',
    gstNumber: '42CCCC124962222',
    stateRegion: 'Karnataka',
  },
  {
    id: 3,
    franchiseId: 'FR1494',
    franchiseName: 'West Coast',
    owner: 'Samantha',
    email: 'Samantha@gmail.com',
    mobile: '9797642101',
    gstNumber: '94JJJJ4124962222',
    stateRegion: 'All-India',
  },
];

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

export default function FranchiseModule() {
  const [franchises] = useState(initialFranchises);
  const [search, setSearch] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState({ ...emptyForm });
  const [editingFranchiseId, setEditingFranchiseId] = useState('FR1234');

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

  const handleSave = (e) => {
    e.preventDefault();
    setShowAddForm(false);
    setForm({ ...emptyForm });
    setEditingFranchiseId('FR1234');
  };

  const handleBack = () => {
    setShowAddForm(false);
    setForm({ ...emptyForm });
    setEditingFranchiseId('FR1234');
  };

  const handleEdit = (item) => {
    setForm({
      ...emptyForm,
      franchiseName: item.franchiseName,
      owner: item.owner,
      email: item.email,
      mobile: item.mobile,
      gstNumber: item.gstNumber,
      stateRegion: item.stateRegion,
    });
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
            Franchise ID: <span>{editingFranchiseId}</span>
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
              <button type="submit" className="franchise-save-btn">
                Save
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
        <button
          className="franchise-add-btn"
          onClick={() => setShowAddForm(true)}
        >
          <MdAdd className="franchise-add-icon" />
          Add Franchise
        </button>
      </div>

      {/* Search & Filter Row */}
      <div className="franchise-toolbar">
        <div className="franchise-search">
          <MdSearch className="franchise-search-icon" />
          <input
            type="text"
            placeholder="Search HSN, Product Name"
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

      {/* Table */}
      <div className="franchise-table-wrapper">
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
            {filtered.map((item) => (
              <tr key={item.id}>
                <td>{item.franchiseId}</td>
                <td>{item.franchiseName}</td>
                <td>{item.owner}</td>
                <td>{item.email}</td>
                <td>{item.mobile}</td>
                <td>{item.gstNumber}</td>
                <td>{item.stateRegion}</td>
                <td>
                  <div className="franchise-actions">
                    <button className="franchise-action-btn franchise-view-btn" title="View">
                      <MdVisibility />
                    </button>
                    <button
                      className="franchise-action-btn franchise-edit-btn"
                      title="Edit"
                      onClick={() => handleEdit(item)}
                    >
                      <MdEdit />
                    </button>
                    <button className="franchise-action-btn franchise-deactivate-btn" title="Deactivate">
                      <MdBlock />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="8" className="franchise-empty">
                  No franchise records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
