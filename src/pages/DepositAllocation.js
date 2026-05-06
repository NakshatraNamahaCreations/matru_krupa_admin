import React, { useState, useMemo } from 'react';
import {
  MdEdit,
  MdDelete,
  MdAdd,
  MdClose,
  MdKeyboardArrowDown,
  MdFilterList,
  MdAccountBalanceWallet,
  MdPieChart,
  MdAccountBalance,
  MdPending,
  MdArrowBack,
  MdSearch,
  MdStorefront,
} from 'react-icons/md';
import './DepositAllocation.css';

const franchiseOverviewData = [
  {
    id: 1,
    franchiseName: 'North Branch',
    ownerName: 'Rajesh Kumar',
    region: 'North',
    tier: 'A',
    depositAmount: 500000,
    allocated: 465000,
    availableBalance: 40000,
    status: 'Active',
  },
  {
    id: 2,
    franchiseName: 'Central Hub',
    ownerName: 'Anita Sharma',
    region: 'Central',
    tier: 'A',
    depositAmount: 750000,
    allocated: 600000,
    availableBalance: 150000,
    status: 'Active',
  },
  {
    id: 3,
    franchiseName: 'South Outlet',
    ownerName: 'Vikram Patel',
    region: 'South',
    tier: 'B',
    depositAmount: 300000,
    allocated: 280000,
    availableBalance: 20000,
    status: 'Active',
  },
  {
    id: 4,
    franchiseName: 'City Central',
    ownerName: 'Priya Nair',
    region: 'West',
    tier: 'A',
    depositAmount: 600000,
    allocated: 450000,
    availableBalance: 150000,
    status: 'Active',
  },
  {
    id: 5,
    franchiseName: 'East Point',
    ownerName: 'Suresh Reddy',
    region: 'East',
    tier: 'B',
    depositAmount: 400000,
    allocated: 350000,
    availableBalance: 50000,
    status: 'Pending',
  },
  {
    id: 6,
    franchiseName: 'Metro Mall',
    ownerName: 'Deepak Joshi',
    region: 'North',
    tier: 'C',
    depositAmount: 200000,
    allocated: 200000,
    availableBalance: 0,
    status: 'Inactive',
  },
];

const initialLedger = [
  {
    id: 1,
    franchise: 'North Branch',
    date: '28/11/2025',
    txnId: 'TXN1001',
    type: 'Initial Deposit',
    description: 'Initial deposit from North Branch',
    credit: 500000,
    debit: 0,
    balance: 500000,
  },
  {
    id: 2,
    franchise: 'North Branch',
    date: '21/10/2025',
    txnId: 'TXN1002',
    type: 'Allocation',
    description: 'Starter Kit',
    credit: 0,
    debit: 450000,
    balance: 50000,
  },
  {
    id: 3,
    franchise: 'North Branch',
    date: '15/10/2025',
    txnId: 'TXN1003',
    type: 'Order Purchase',
    description: 'Order #ORD-2451',
    credit: 0,
    debit: 15000,
    balance: 35000,
  },
  {
    id: 4,
    franchise: 'North Branch',
    date: '10/10/2025',
    txnId: 'TXN1004',
    type: 'Refund Processed',
    description: 'Return #RTN-112',
    credit: 5000,
    debit: 0,
    balance: 40000,
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
  const [selectedFranchise, setSelectedFranchise] = useState(null);
  const [overviewSearch, setOverviewSearch] = useState('');
  const [kits, setKits] = useState(initialKits);
  const [editKit, setEditKit] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ ...emptyKit });

  // Filter franchise overview by search
  const filteredOverview = useMemo(() => {
    if (!overviewSearch.trim()) return franchiseOverviewData;
    const q = overviewSearch.toLowerCase();
    return franchiseOverviewData.filter(
      (f) =>
        f.franchiseName.toLowerCase().includes(q) ||
        f.ownerName.toLowerCase().includes(q) ||
        f.region.toLowerCase().includes(q)
    );
  }, [overviewSearch]);

  // Overview summary stats
  const overviewStats = useMemo(() => {
    const total = franchiseOverviewData.length;
    const active = franchiseOverviewData.filter((f) => f.status === 'Active').length;
    const totalDeposits = franchiseOverviewData.reduce((s, f) => s + f.depositAmount, 0);
    const totalAvailable = franchiseOverviewData.reduce((s, f) => s + f.availableBalance, 0);
    return { total, active, totalDeposits, totalAvailable };
  }, []);

  const handleFranchiseClick = (franchiseName) => {
    setSelectedFranchise(franchiseName);
    setActiveTab('ledger');
  };

  const handleBackToOverview = () => {
    setSelectedFranchise(null);
    setOverviewSearch('');
  };

  // Filter ledger by selected franchise
  const filteredLedger = useMemo(
    () => initialLedger.filter((row) => row.franchise === selectedFranchise),
    [selectedFranchise]
  );

  // Compute summary stats from filtered ledger
  const ledgerStats = useMemo(() => {
    let totalDeposits = 0;
    let totalAllocated = 0;
    let pendingRefunds = 0;
    for (const row of filteredLedger) {
      totalDeposits += row.credit;
      totalAllocated += row.debit;
      if (row.type === 'Refund Processed') pendingRefunds += row.credit;
    }
    const availableBalance = filteredLedger.length > 0 ? filteredLedger[filteredLedger.length - 1].balance : 0;
    return { totalDeposits, totalAllocated, availableBalance, pendingRefunds };
  }, [filteredLedger]);

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

      {/* ======== FRANCHISE OVERVIEW (landing view) ======== */}
      {!selectedFranchise && (
        <>
          {/* Overview Summary Cards */}
          <div className="deposit-stats-row">
            <div className="deposit-stat-card">
              <div className="deposit-stat-icon deposit-stat-icon-blue">
                <MdStorefront />
              </div>
              <div className="deposit-stat-info">
                <span className="deposit-stat-label">Total Franchises</span>
                <span className="deposit-stat-value">{overviewStats.total}</span>
              </div>
            </div>
            <div className="deposit-stat-card">
              <div className="deposit-stat-icon deposit-stat-icon-green">
                <MdAccountBalance />
              </div>
              <div className="deposit-stat-info">
                <span className="deposit-stat-label">Active Franchises</span>
                <span className="deposit-stat-value">{overviewStats.active}</span>
              </div>
            </div>
            <div className="deposit-stat-card">
              <div className="deposit-stat-icon deposit-stat-icon-orange">
                <MdAccountBalanceWallet />
              </div>
              <div className="deposit-stat-info">
                <span className="deposit-stat-label">Total Deposits</span>
                <span className="deposit-stat-value">{formatCurrency(overviewStats.totalDeposits)}</span>
              </div>
            </div>
            <div className="deposit-stat-card">
              <div className="deposit-stat-icon deposit-stat-icon-red">
                <MdPending />
              </div>
              <div className="deposit-stat-info">
                <span className="deposit-stat-label">Available Balance</span>
                <span className="deposit-stat-value">{formatCurrency(overviewStats.totalAvailable)}</span>
              </div>
            </div>
          </div>

          {/* Sub-header with search */}
          <div className="deposit-sub-header">
            <h2 className="deposit-sub-title">Franchise Overview</h2>
            <div className="deposit-ledger-controls">
              <div className="deposit-search-box">
                <MdSearch className="deposit-search-icon" />
                <input
                  type="text"
                  className="deposit-search-input"
                  placeholder="Search franchise..."
                  value={overviewSearch}
                  onChange={(e) => setOverviewSearch(e.target.value)}
                />
              </div>
              <button className="deposit-filter-btn">
                <MdFilterList /> Filter
              </button>
            </div>
          </div>

          {/* Franchise Overview Table */}
          <div className="deposit-table-wrapper">
            <table className="deposit-table">
              <thead>
                <tr>
                  <th>Franchise Name</th>
                  <th>Owner</th>
                  <th>Region</th>
                  <th>Tier</th>
                  <th>Deposit Amount</th>
                  <th>Allocated</th>
                  <th>Available Balance</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredOverview.map((f) => (
                  <tr
                    key={f.id}
                    className="deposit-overview-row"
                    onClick={() => handleFranchiseClick(f.franchiseName)}
                  >
                    <td className="deposit-franchise-name">{f.franchiseName}</td>
                    <td>{f.ownerName}</td>
                    <td>{f.region}</td>
                    <td>
                      <span className={`deposit-tier-badge deposit-tier-${f.tier.toLowerCase()}`}>
                        Tier {f.tier}
                      </span>
                    </td>
                    <td>{formatCurrency(f.depositAmount)}</td>
                    <td>{formatCurrency(f.allocated)}</td>
                    <td className="deposit-balance">{formatCurrency(f.availableBalance)}</td>
                    <td>
                      <span className={`deposit-status-badge deposit-status-${f.status.toLowerCase()}`}>
                        {f.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {filteredOverview.length === 0 && (
                  <tr>
                    <td colSpan="8" className="deposit-empty">
                      No franchises found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ======== FRANCHISE DETAIL VIEW (ledger + kits) ======== */}
      {selectedFranchise && (
        <>
          {/* Back button + Franchise name */}
          <div className="deposit-back-row">
            <button className="deposit-back-btn" onClick={handleBackToOverview}>
              <MdArrowBack /> Back to Franchises
            </button>
            <span className="deposit-franchise-label">{selectedFranchise}</span>
          </div>

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
              {/* Summary Cards */}
              <div className="deposit-stats-row">
                <div className="deposit-stat-card">
                  <div className="deposit-stat-icon deposit-stat-icon-blue">
                    <MdAccountBalanceWallet />
                  </div>
                  <div className="deposit-stat-info">
                    <span className="deposit-stat-label">Total Deposits</span>
                    <span className="deposit-stat-value">{formatCurrency(ledgerStats.totalDeposits)}</span>
                  </div>
                </div>
                <div className="deposit-stat-card">
                  <div className="deposit-stat-icon deposit-stat-icon-orange">
                    <MdPieChart />
                  </div>
                  <div className="deposit-stat-info">
                    <span className="deposit-stat-label">Allocated</span>
                    <span className="deposit-stat-value">{formatCurrency(ledgerStats.totalAllocated)}</span>
                  </div>
                </div>
                <div className="deposit-stat-card">
                  <div className="deposit-stat-icon deposit-stat-icon-green">
                    <MdAccountBalance />
                  </div>
                  <div className="deposit-stat-info">
                    <span className="deposit-stat-label">Available Balance</span>
                    <span className="deposit-stat-value">{formatCurrency(ledgerStats.availableBalance)}</span>
                  </div>
                </div>
                <div className="deposit-stat-card">
                  <div className="deposit-stat-icon deposit-stat-icon-red">
                    <MdPending />
                  </div>
                  <div className="deposit-stat-info">
                    <span className="deposit-stat-label">Pending Refunds</span>
                    <span className="deposit-stat-value">{formatCurrency(ledgerStats.pendingRefunds)}</span>
                  </div>
                </div>
              </div>

              {/* Ledger Sub-header */}
              <div className="deposit-sub-header">
                <h2 className="deposit-sub-title">Deposit Ledger</h2>
                <div className="deposit-ledger-controls">
                  <button className="deposit-filter-btn">
                    <MdFilterList /> Filter
                  </button>
                </div>
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
                    {filteredLedger.map((row) => (
                      <tr key={row.id}>
                        <td>{row.date}</td>
                        <td>{row.txnId}</td>
                        <td>
                          <span className={`deposit-type-badge deposit-type-${row.type.toLowerCase().replace(/\s+/g, '-')}`}>
                            {row.type}
                          </span>
                        </td>
                        <td>{row.description}</td>
                        <td className="deposit-credit">{row.credit ? formatCurrency(row.credit) : '-'}</td>
                        <td className="deposit-debit">{row.debit ? formatCurrency(row.debit) : '-'}</td>
                        <td className="deposit-balance">{formatCurrency(row.balance)}</td>
                      </tr>
                    ))}
                    {filteredLedger.length === 0 && (
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
                  Add Starter Kit
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
