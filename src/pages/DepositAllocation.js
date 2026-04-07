import React, { useState } from 'react';
import { MdEdit, MdDelete, MdAdd, MdClose, MdKeyboardArrowDown } from 'react-icons/md';
import './DepositAllocation.css';

const initialLedger = [
  {
    id: 1,
    date: '28/11/2025',
    txnId: 'TXN1001',
    type: 'Initial Deposit',
    description: 'Initial deposit from North Branch',
    credit: '₹5,00,000',
    debit: '-',
    balance: '₹5,00,000',
  },
  {
    id: 2,
    date: '21/10/2025',
    txnId: 'TXN1002',
    type: 'Allocation',
    description: 'Starter Kit',
    credit: '₹4,50,000',
    debit: '-',
    balance: '₹50,000',
  },
];

const initialKits = [
  {
    id: 1,
    productName: '4K LED TV',
    category: 'Television',
    quantity: 5,
    unitPrice: 30000,
    totalValue: 150000,
  },
  {
    id: 2,
    productName: 'Air Conditioner',
    category: 'Appliances',
    quantity: 10,
    unitPrice: 20000,
    totalValue: 200000,
  },
  {
    id: 3,
    productName: 'Electric Kettle',
    category: 'Appliances',
    quantity: 20,
    unitPrice: 1000,
    totalValue: 20000,
  },
];

const categoryOptions = ['Television', 'Appliances', 'Electronics', 'Furniture'];

const formatCurrency = (val) => {
  if (!val && val !== 0) return '';
  return '₹' + Number(val).toLocaleString('en-IN');
};

const emptyKit = {
  productName: '',
  category: 'Television',
  quantity: '',
  unitPrice: '',
  totalValue: '',
};

export default function DepositAllocation() {
  const [activeTab, setActiveTab] = useState('ledger');
  const [kits, setKits] = useState(initialKits);
  const [editKit, setEditKit] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ ...emptyKit });

  // ---- Edit Modal ----
  const openEdit = (kit) => {
    setEditKit({ ...kit });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditKit((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === 'quantity' || name === 'unitPrice') {
        const qty = name === 'quantity' ? Number(value) : Number(prev.quantity);
        const price = name === 'unitPrice' ? Number(value) : Number(prev.unitPrice);
        updated.totalValue = qty * price || 0;
      }
      return updated;
    });
  };

  const saveEdit = () => {
    setKits((prev) =>
      prev.map((k) => (k.id === editKit.id ? { ...editKit } : k))
    );
    setEditKit(null);
  };

  // ---- Add Modal ----
  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setAddForm((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === 'quantity' || name === 'unitPrice') {
        const qty = name === 'quantity' ? Number(value) : Number(prev.quantity);
        const price = name === 'unitPrice' ? Number(value) : Number(prev.unitPrice);
        updated.totalValue = qty * price || 0;
      }
      return updated;
    });
  };

  const saveAdd = () => {
    const newKit = {
      ...addForm,
      id: Date.now(),
      quantity: Number(addForm.quantity),
      unitPrice: Number(addForm.unitPrice),
      totalValue: Number(addForm.quantity) * Number(addForm.unitPrice) || 0,
    };
    setKits((prev) => [...prev, newKit]);
    setAddForm({ ...emptyKit });
    setShowAddModal(false);
  };

  // ---- Delete ----
  const deleteKit = (id) => {
    setKits((prev) => prev.filter((k) => k.id !== id));
  };

  return (
    <div className="deposit-page">
      <h1 className="deposit-title">Deposit &amp; Allocation Engine</h1>

      {/* Tabs */}
      <div className="deposit-tabs">
        <button
          className={`deposit-tab${activeTab === 'ledger' ? ' active' : ''}`}
          onClick={() => setActiveTab('ledger')}
        >
          Deposit Ledger
        </button>
        <button
          className={`deposit-tab${activeTab === 'kits' ? ' active' : ''}`}
          onClick={() => setActiveTab('kits')}
        >
          Starter Kits
        </button>
      </div>

      {/* ======== Tab 1: Deposit Ledger ======== */}
      {activeTab === 'ledger' && (
        <>
          <div className="deposit-sub-header">
            <h2 className="deposit-sub-title">Deposit Ledger</h2>
          </div>
          <div className="deposit-table-wrapper">
            <table className="deposit-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Txn ID</th>
                  <th>Type</th>
                  <th>Description</th>
                  <th>Credit</th>
                  <th>Debit</th>
                  <th>Balance</th>
                </tr>
              </thead>
              <tbody>
                {initialLedger.map((row) => (
                  <tr key={row.id}>
                    <td>{row.date}</td>
                    <td>{row.txnId}</td>
                    <td>{row.type}</td>
                    <td>{row.description}</td>
                    <td>{row.credit}</td>
                    <td>{row.debit}</td>
                    <td>{row.balance}</td>
                  </tr>
                ))}
                {initialLedger.length === 0 && (
                  <tr>
                    <td colSpan="7" className="deposit-empty">
                      No deposit records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ======== Tab 2: Starter Kits ======== */}
      {activeTab === 'kits' && (
        <>
          <div className="deposit-sub-header">
            <h2 className="deposit-sub-title">Starter Kits</h2>
            <button
              className="deposit-add-btn"
              onClick={() => setShowAddModal(true)}
            >
              <MdAdd className="deposit-add-icon" />
              + Add Starter Kit
            </button>
          </div>
          <div className="deposit-table-wrapper">
            <table className="deposit-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Total Value</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {kits.map((kit) => (
                  <tr key={kit.id}>
                    <td>{kit.productName}</td>
                    <td>{kit.category}</td>
                    <td>{kit.quantity}</td>
                    <td>{formatCurrency(kit.unitPrice)}</td>
                    <td>{formatCurrency(kit.totalValue)}</td>
                    <td>
                      <div className="deposit-actions">
                        <button
                          className="deposit-action-btn deposit-edit-btn"
                          title="Edit"
                          onClick={() => openEdit(kit)}
                        >
                          <MdEdit />
                        </button>
                        <button
                          className="deposit-action-btn deposit-delete-btn"
                          title="Delete"
                          onClick={() => deleteKit(kit.id)}
                        >
                          <MdDelete />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {kits.length === 0 && (
                  <tr>
                    <td colSpan="6" className="deposit-empty">
                      No starter kits found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ======== Edit Starter Kit Modal ======== */}
      {editKit && (
        <div className="deposit-modal-overlay">
          <div className="deposit-modal">
            <div className="deposit-modal-header">
              <h3 className="deposit-modal-title">Edit Starter Kit</h3>
              <button
                className="deposit-modal-close"
                onClick={() => setEditKit(null)}
              >
                <MdClose />
              </button>
            </div>
            <div className="deposit-modal-body">
              <div className="deposit-form-single">
                <div className="deposit-form-group">
                  <label className="deposit-form-label">Product Name</label>
                  <input
                    type="text"
                    name="productName"
                    value={editKit.productName}
                    onChange={handleEditChange}
                    className="deposit-form-input"
                    placeholder="Enter product name"
                  />
                </div>
                <div className="deposit-form-group">
                  <label className="deposit-form-label">Category</label>
                  <div className="deposit-select-wrapper">
                    <select
                      name="category"
                      value={editKit.category}
                      onChange={handleEditChange}
                      className="deposit-form-select"
                    >
                      {categoryOptions.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    <MdKeyboardArrowDown className="deposit-select-arrow" />
                  </div>
                </div>
                <div className="deposit-form-group">
                  <label className="deposit-form-label">Quantity</label>
                  <input
                    type="number"
                    name="quantity"
                    value={editKit.quantity}
                    onChange={handleEditChange}
                    className="deposit-form-input"
                    placeholder="Enter quantity"
                  />
                </div>
                <div className="deposit-form-group">
                  <label className="deposit-form-label">Unit Price</label>
                  <input
                    type="text"
                    name="unitPrice"
                    value={editKit.unitPrice}
                    onChange={handleEditChange}
                    className="deposit-form-input"
                    placeholder="Enter unit price"
                  />
                </div>
                <div className="deposit-form-group">
                  <label className="deposit-form-label">Total Value</label>
                  <input
                    type="text"
                    className="deposit-form-input"
                    value={formatCurrency(editKit.totalValue)}
                    readOnly
                  />
                </div>
              </div>
              <div className="deposit-modal-actions">
                <button className="deposit-save-btn" onClick={saveEdit}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======== Add Starter Kit Modal ======== */}
      {showAddModal && (
        <div
          className="deposit-modal-overlay"
          onClick={() => setShowAddModal(false)}
        >
          <div className="deposit-modal" onClick={(e) => e.stopPropagation()}>
            <div className="deposit-modal-header">
              <h3 className="deposit-modal-title">Add Starter Kit</h3>
              <button
                className="deposit-modal-close"
                onClick={() => setShowAddModal(false)}
              >
                <MdClose />
              </button>
            </div>
            <div className="deposit-modal-body">
              <div className="deposit-form-grid">
                <div className="deposit-form-group">
                  <label className="deposit-form-label">Product Name</label>
                  <input
                    type="text"
                    name="productName"
                    value={addForm.productName}
                    onChange={handleAddChange}
                    className="deposit-form-input"
                    placeholder="Enter product name"
                  />
                </div>
                <div className="deposit-form-group">
                  <label className="deposit-form-label">Category</label>
                  <div className="deposit-select-wrapper">
                    <select
                      name="category"
                      value={addForm.category}
                      onChange={handleAddChange}
                      className="deposit-form-select"
                    >
                      {categoryOptions.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    <MdKeyboardArrowDown className="deposit-select-arrow" />
                  </div>
                </div>
                <div className="deposit-form-group">
                  <label className="deposit-form-label">Quantity</label>
                  <input
                    type="number"
                    name="quantity"
                    value={addForm.quantity}
                    onChange={handleAddChange}
                    className="deposit-form-input"
                    placeholder="Enter quantity"
                  />
                </div>
                <div className="deposit-form-group">
                  <label className="deposit-form-label">Unit Price</label>
                  <input
                    type="text"
                    name="unitPrice"
                    value={addForm.unitPrice}
                    onChange={handleAddChange}
                    className="deposit-form-input"
                    placeholder="Enter unit price"
                  />
                </div>
                <div className="deposit-form-group deposit-form-half">
                  <label className="deposit-form-label">Total Value</label>
                  <input
                    type="text"
                    className="deposit-form-input"
                    value={formatCurrency(addForm.totalValue)}
                    readOnly
                  />
                </div>
              </div>
              <div className="deposit-modal-actions">
                <button className="deposit-save-btn" onClick={saveAdd}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
