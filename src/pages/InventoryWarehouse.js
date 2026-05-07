/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from 'react';
import {
  MdSearch,
  MdFilterList,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdDelete,
  MdVisibility,
  MdEdit,
  MdCheck,
  MdArrowUpward,
  MdArrowDownward,
  MdArrowForward,
  MdCalendarToday,
  MdArrowBack,
} from 'react-icons/md';
import {
  centralStockApi,
  reservationApi,
  reorderSuggestionApi,
  binRackApi,
  damageReportApi,
} from '../services/api';
import './InventoryWarehouse.css';

/* ==============================
   SUB-VIEW COMPONENTS
   ============================== */

function CentralStockDashboard() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [items, setItems] = useState([]);
  const [totalStock, setTotalStock] = useState(0);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const params = {};
    if (search.trim()) params.search = search.trim();
    if (category) params.category = category;
    centralStockApi.getAll(params)
      .then((data) => {
        setItems(data.items || []);
        setTotalStock(data.totalStock || 0);
        // Build unique category list from results
        if (!category && !search) {
          const cats = [...new Set((data.items || []).map((i) => i.category).filter(Boolean))];
          setCategories(cats);
        }
      })
      .catch(() => { setItems([]); setTotalStock(0); });
  }, [search, category]);

  return (
    <div className="iw-subview">
      <div className="iw-toolbar">
        <div className="iw-toolbar-left">
          <div className="iw-search">
            <MdSearch className="iw-search-icon" />
            <input
              type="text"
              placeholder="Search by Product name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select className="iw-select" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Category</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="iw-table-wrapper">
        <table className="iw-table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Brand</th>
              <th>Current Stock</th>
            </tr>
          </thead>
          <tbody>
            {items.map((row) => (
              <tr key={row._id || row.sku}>
                <td>{row.sku}</td>
                <td>{row.name}</td>
                <td>{row.category}</td>
                <td>{row.brand}</td>
                <td>{row.stock?.toLocaleString('en-IN') ?? 0}</td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan="5" className="iw-empty">No products found.</td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="4" className="iw-footer-label">Tot:</td>
              <td className="iw-footer-value">{totalStock.toLocaleString('en-IN')}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

function AutoReservation() {
  const [search, setSearch] = useState('');
  const [date, setDate] = useState('');
  const [items, setItems] = useState([]);
  const [detailItem, setDetailItem] = useState(null);
  const [editStatus, setEditStatus] = useState('');

  const loadReservations = useCallback(() => {
    const params = {};
    if (search.trim()) params.search = search.trim();
    if (date) params.date = date;
    reservationApi.getAll(params)
      .then((data) => setItems(data))
      .catch(() => setItems([]));
  }, [search, date]);

  useEffect(() => { loadReservations(); }, [loadReservations]);

  const handleSave = async () => {
    if (!detailItem?._id) { setDetailItem(null); return; }
    try {
      await reservationApi.update(detailItem._id, { status: editStatus });
      setDetailItem(null);
      loadReservations();
    } catch { setDetailItem(null); }
  };

  const formatDate = (d) => {
    if (!d) return '';
    return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const toInputDate = (d) => {
    if (!d) return '';
    return new Date(d).toISOString().split('T')[0];
  };

  if (detailItem) {
    return (
      <div className="iw-subview">
        <div className="iw-detail-form">
          <h3 className="iw-detail-title">Reservation Detail</h3>
          <div className="iw-form-grid">
            <div className="iw-form-group">
              <label>Order ID</label>
              <input type="text" value={detailItem.orderId} readOnly />
            </div>
            <div className="iw-form-group">
              <label>Channel</label>
              <input type="text" value={detailItem.channel} readOnly />
            </div>
            <div className="iw-form-group">
              <label>SKU</label>
              <input type="text" value={detailItem.sku} readOnly />
            </div>
            <div className="iw-form-group">
              <label>Quantity</label>
              <input type="number" value={detailItem.qty} readOnly />
            </div>
            <div className="iw-form-group">
              <label>Reserved on</label>
              <input type="date" value={toInputDate(detailItem.reservedOn)} readOnly />
            </div>
            <div className="iw-form-group">
              <label>Status</label>
              <select value={editStatus} onChange={(e) => setEditStatus(e.target.value)}>
                <option value="Confirmed">Confirmed</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>
          <div className="iw-detail-actions">
            <button className="iw-btn iw-btn-primary" onClick={handleSave}>Save</button>
            <button className="iw-btn iw-btn-outline" onClick={() => setDetailItem(null)}>
              <MdArrowBack /> Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="iw-subview">
      <div className="iw-toolbar">
        <div className="iw-toolbar-left">
          <div className="iw-search">
            <MdSearch className="iw-search-icon" />
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="iw-date-picker">
            <MdCalendarToday className="iw-date-icon" />
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
        </div>
      </div>

      <h3 className="iw-section-title">Order Reservations</h3>

      <div className="iw-table-wrapper">
        <table className="iw-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Channel</th>
              <th>SKU</th>
              <th>Quantity</th>
              <th>Reserved On</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((row) => (
              <tr key={row._id}>
                <td>{row.orderId}</td>
                <td>{row.channel}</td>
                <td>{row.sku}</td>
                <td>{row.qty}</td>
                <td>{formatDate(row.reservedOn)}</td>
                <td>
                  <span className={`iw-badge ${row.status === 'Confirmed' ? 'iw-badge-green' : 'iw-badge-orange'}`}>
                    {row.status}
                  </span>
                </td>
                <td>
                  <div className="iw-actions">
                    <button
                      className="iw-icon-btn"
                      onClick={() => { setDetailItem(row); setEditStatus(row.status); }}
                      title="View"
                    >
                      <MdVisibility />
                    </button>
                    <button
                      className="iw-icon-btn"
                      onClick={() => { setDetailItem(row); setEditStatus(row.status); }}
                      title="Edit"
                    >
                      <MdEdit />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan="7" className="iw-empty">No reservations found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ReorderSuggestions() {
  const [search, setSearch] = useState('');
  const [items, setItems] = useState([]);

  const loadData = useCallback(() => {
    const params = {};
    if (search.trim()) params.search = search.trim();
    reorderSuggestionApi.getAll(params)
      .then((data) => setItems(data))
      .catch(() => setItems([]));
  }, [search]);

  useEffect(() => { loadData(); }, [loadData]);

  const trendIcon = (trend) => {
    if (trend === 'High') return <span className="iw-trend iw-trend-high"><MdArrowUpward /> High</span>;
    if (trend === 'Stable') return <span className="iw-trend iw-trend-stable"><MdArrowForward /> Stable</span>;
    return <span className="iw-trend iw-trend-low"><MdArrowDownward /> Low</span>;
  };

  const handleToggle = async (id) => {
    try {
      await reorderSuggestionApi.toggle(id);
      loadData();
    } catch { /* ignore */ }
  };

  const handleDelete = async (id) => {
    try {
      await reorderSuggestionApi.delete(id);
      loadData();
    } catch { /* ignore */ }
  };

  return (
    <div className="iw-subview">
      <div className="iw-toolbar">
        <div className="iw-toolbar-left">
          <div className="iw-search">
            <MdSearch className="iw-search-icon" />
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="iw-filter-btn"><MdFilterList /> Filter</button>
        </div>
      </div>

      <div className="iw-table-wrapper">
        <table className="iw-table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Product Name</th>
              <th>Past Sales Velocity/week</th>
              <th>Current Stock</th>
              <th>Safety Stock</th>
              <th>Lead Time</th>
              <th>Demand Trend</th>
              <th>Recommended Reorder Qty.</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((row) => (
              <tr key={row._id}>
                <td>{row.sku}</td>
                <td>{row.productName}</td>
                <td>{row.salesVelocity}</td>
                <td>{row.currentStock}</td>
                <td>{row.safetyStock}</td>
                <td>{row.leadTime}</td>
                <td>{trendIcon(row.trend)}</td>
                <td className={row.reorderQty > 1000 ? 'iw-text-red' : ''}>{row.reorderQty}</td>
                <td>
                  <div className="iw-actions">
                    <label className="iw-toggle">
                      <input type="checkbox" checked={row.isActive} onChange={() => handleToggle(row._id)} />
                      <span className="iw-toggle-slider" />
                    </label>
                    <button className="iw-delete-btn" onClick={() => handleDelete(row._id)}>
                      <MdDelete />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan="9" className="iw-empty">No suggestions found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function BinRackMapping() {
  const [search, setSearch] = useState('');
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({ totalRacks: 0, totalBins: 0, fragile: 0, tempSensitive: 0 });
  const [selectedItem, setSelectedItem] = useState(null);
  const [rackNumber, setRackNumber] = useState('');
  const [shelfBin, setShelfBin] = useState('');
  const [zoneArea, setZoneArea] = useState('');
  const [storageType, setStorageType] = useState('');
  const [saving, setSaving] = useState(false);

  const loadData = useCallback(() => {
    const params = {};
    if (search.trim()) params.search = search.trim();
    binRackApi.getAll(params)
      .then((data) => {
        setItems(data.mappings || []);
        setStats(data.stats || { totalRacks: 0, totalBins: 0, fragile: 0, tempSensitive: 0 });
      })
      .catch(() => { setItems([]); });
  }, [search]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleSelectRow = (row) => {
    setSelectedItem(row);
    setRackNumber(row.rackNo);
    setShelfBin(row.shelfBin);
    setZoneArea(row.zone);
    setStorageType(row.storageType);
  };

  const handleSaveMapping = async () => {
    if (!selectedItem || !rackNumber || !shelfBin || !zoneArea || !storageType) return;
    setSaving(true);
    try {
      await binRackApi.update(selectedItem._id, {
        rackNo: rackNumber,
        shelfBin,
        zone: zoneArea,
        storageType,
      });
      loadData();
    } catch { /* ignore */ }
    setSaving(false);
  };

  return (
    <div className="iw-subview">
      <div className="iw-toolbar">
        <div className="iw-toolbar-left">
          <div className="iw-search">
            <MdSearch className="iw-search-icon" />
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="iw-stats-row">
        <div className="iw-stat-card">
          <span className="iw-stat-label">Total Racks</span>
          <span className="iw-stat-value">{stats.totalRacks}</span>
        </div>
        <div className="iw-stat-card">
          <span className="iw-stat-label">Total Bins</span>
          <span className="iw-stat-value">{stats.totalBins}</span>
        </div>
        <div className="iw-stat-card">
          <span className="iw-stat-label">Fragile Storage</span>
          <span className="iw-stat-value">{stats.fragile}</span>
        </div>
        <div className="iw-stat-card">
          <span className="iw-stat-label">Temperature Sensitive</span>
          <span className="iw-stat-value">{stats.tempSensitive}</span>
        </div>
      </div>

      <div className="iw-split-layout">
        <div className="iw-table-wrapper iw-split-main">
          <table className="iw-table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>Rack No</th>
                <th>Shelf/Bin No</th>
                <th>Zone/Area</th>
                <th>Storage Type</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((row) => (
                <tr key={row._id} className={selectedItem?._id === row._id ? 'iw-row-active' : ''} onClick={() => handleSelectRow(row)}>
                  <td>{row.sku}</td>
                  <td>{row.productName}</td>
                  <td>{row.category}</td>
                  <td>{row.rackNo}</td>
                  <td>{row.shelfBin}</td>
                  <td>{row.zone}</td>
                  <td>{row.storageType}</td>
                  <td>
                    <button className="iw-check-btn" onClick={(e) => { e.stopPropagation(); handleSelectRow(row); }}><MdCheck /></button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan="8" className="iw-empty">No mappings found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="iw-side-panel">
          <h3 className="iw-panel-title">Assign Bin</h3>
          <div className="iw-panel-form">
            <div className="iw-form-group">
              <label>Product Name</label>
              <input type="text" value={selectedItem?.productName || ''} readOnly />
            </div>
            <div className="iw-form-group">
              <label>SKU</label>
              <input type="text" value={selectedItem?.sku || ''} readOnly />
            </div>
            <div className="iw-form-group">
              <label>Category</label>
              <input type="text" value={selectedItem?.category || ''} readOnly />
            </div>
            <div className="iw-form-group">
              <label>Rack Number</label>
              <input type="text" placeholder="Enter rack number" value={rackNumber} onChange={(e) => setRackNumber(e.target.value)} />
            </div>
            <div className="iw-form-group">
              <label>Shelf/Bin Number</label>
              <input type="text" placeholder="Enter shelf/bin number" value={shelfBin} onChange={(e) => setShelfBin(e.target.value)} />
            </div>
            <div className="iw-form-group">
              <label>Zone/Area</label>
              <input type="text" placeholder="Enter zone/area" value={zoneArea} onChange={(e) => setZoneArea(e.target.value)} />
            </div>
            <div className="iw-form-group">
              <label>Storage Type</label>
              <select value={storageType} onChange={(e) => setStorageType(e.target.value)}>
                <option value="">Select storage type</option>
                <option value="Bulky">Bulky</option>
                <option value="Heavy">Heavy</option>
                <option value="Fragile">Fragile</option>
                <option value="Temperature Sensitive">Temperature Sensitive</option>
              </select>
            </div>
            <button className="iw-btn iw-btn-primary iw-btn-full" onClick={handleSaveMapping} disabled={saving || !selectedItem}>
              {saving ? 'Saving...' : 'Save Mapping'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DamageShrinkage() {
  const [search, setSearch] = useState('');
  const [items, setItems] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportType, setReportType] = useState('');
  const [reasonCode, setReasonCode] = useState('');
  const [description, setDescription] = useState('');
  const [suggestedAction, setSuggestedAction] = useState('');

  const loadData = useCallback(() => {
    const params = {};
    if (search.trim()) params.search = search.trim();
    damageReportApi.getAll(params)
      .then((data) => setItems(data))
      .catch(() => setItems([]));
  }, [search]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleSelectReport = (row) => {
    setSelectedReport(row);
    setReportType(row.type);
    setReasonCode(row.reasonCode || '');
    setDescription(row.description || '');
    setSuggestedAction(row.suggestedAction || '');
  };

  const handleStatusUpdate = async (status) => {
    if (!selectedReport?._id) return;
    try {
      const updateData = { status, type: reportType, reasonCode, description, suggestedAction };
      await damageReportApi.update(selectedReport._id, updateData);
      loadData();
      setSelectedReport(null);
    } catch { /* ignore */ }
  };

  const handleToggle = async (row) => {
    const newStatus = row.status === 'Approved' ? 'Disapproved' : 'Approved';
    try {
      await damageReportApi.updateStatus(row._id, newStatus);
      loadData();
    } catch { /* ignore */ }
  };

  const handleDelete = async (id) => {
    try {
      await damageReportApi.delete(id);
      loadData();
    } catch { /* ignore */ }
  };

  const formatDate = (d) => {
    if (!d) return '';
    const dt = new Date(d);
    return dt.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: '2-digit' }) +
      ' ' + dt.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const toInputDate = (d) => {
    if (!d) return '';
    return new Date(d).toISOString().split('T')[0];
  };

  return (
    <div className="iw-subview">
      <div className="iw-toolbar">
        <div className="iw-toolbar-left">
          <div className="iw-search">
            <MdSearch className="iw-search-icon" />
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="iw-filter-btn"><MdFilterList /> Filter</button>
        </div>
      </div>

      <div className="iw-split-layout">
        <div className="iw-table-wrapper iw-split-main">
          <table className="iw-table">
            <thead>
              <tr>
                <th>Report ID</th>
                <th>Reported On</th>
                <th>Reported By</th>
                <th>SKU</th>
                <th>Bin Location</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((row) => (
                <tr key={row._id} className={selectedReport?._id === row._id ? 'iw-row-active' : ''} onClick={() => handleSelectReport(row)}>
                  <td>{row.reportId}</td>
                  <td>{formatDate(row.reportedOn)}</td>
                  <td>{row.reportedBy}</td>
                  <td>{row.sku}</td>
                  <td>{row.binLocation}</td>
                  <td>{row.type}</td>
                  <td>{row.qty}</td>
                  <td>
                    <span className={`iw-badge ${row.status === 'Approved' ? 'iw-badge-green' : 'iw-badge-red'}`}>
                      {row.status}
                    </span>
                  </td>
                  <td>
                    <div className="iw-actions" onClick={(e) => e.stopPropagation()}>
                      <label className="iw-toggle">
                        <input type="checkbox" checked={row.status === 'Approved'} onChange={() => handleToggle(row)} />
                        <span className="iw-toggle-slider" />
                      </label>
                      <button className="iw-delete-btn" onClick={() => handleDelete(row._id)}>
                        <MdDelete />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan="9" className="iw-empty">No reports found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="iw-side-panel">
          <h3 className="iw-panel-title">Report</h3>
          <div className="iw-panel-form">
            <div className="iw-form-group">
              <label>Report ID</label>
              <input type="text" value={selectedReport?.reportId || ''} readOnly />
            </div>
            <div className="iw-form-group">
              <label>Product Name</label>
              <input type="text" value={selectedReport?.productName || ''} readOnly />
            </div>
            <div className="iw-form-group">
              <label>Reported By</label>
              <input type="text" value={selectedReport?.reportedBy || ''} readOnly />
            </div>
            <div className="iw-form-group">
              <label>SKU</label>
              <input type="text" value={selectedReport?.sku || ''} readOnly />
            </div>
            <div className="iw-form-group">
              <label>Bin Location</label>
              <input type="text" value={selectedReport?.binLocation || ''} readOnly />
            </div>
            <div className="iw-form-group">
              <label>Type</label>
              <select value={reportType || ''} onChange={(e) => setReportType(e.target.value)}>
                <option value="Damaged">Damaged</option>
                <option value="Lost">Lost</option>
                <option value="Theft">Theft</option>
                <option value="Courier Return">Courier Return</option>
              </select>
            </div>
            <div className="iw-form-group">
              <label>Quantity</label>
              <input type="number" value={selectedReport?.qty || ''} readOnly />
            </div>
            <div className="iw-form-group">
              <label>Reported on</label>
              <input type="date" value={toInputDate(selectedReport?.reportedOn)} readOnly />
            </div>
            <div className="iw-form-group">
              <label>Reason Code</label>
              <input type="text" placeholder="Enter reason code" value={reasonCode} onChange={(e) => setReasonCode(e.target.value)} />
            </div>
            <div className="iw-form-group">
              <label>Description</label>
              <textarea placeholder="Enter description" rows="3" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className="iw-form-group">
              <label>Suggested Inventory Action</label>
              <select value={suggestedAction} onChange={(e) => setSuggestedAction(e.target.value)}>
                <option value="">Select action</option>
                <option value="Write Off">Write Off</option>
                <option value="Return to Vendor">Return to Vendor</option>
                <option value="Restock">Restock</option>
                <option value="Dispose">Dispose</option>
              </select>
            </div>
            <div className="iw-detail-actions">
              <button className="iw-btn iw-btn-green" disabled={!selectedReport} onClick={() => handleStatusUpdate('Approved')}>Approve</button>
              <button className="iw-btn iw-btn-red" disabled={!selectedReport} onClick={() => handleStatusUpdate('Disapproved')}>Disapprove</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==============================
   MAIN COMPONENT
   ============================== */

const subViews = [
  { key: 'central-stock', label: 'Central Stock Dashboard' },
  { key: 'auto-reservation', label: 'Auto Reservation' },
  { key: 'reorder-suggestions', label: 'Reorder Suggestions' },
  { key: 'bin-rack', label: 'Bin/Rack Mapping' },
  { key: 'damage-shrinkage', label: 'Damage & Shrinkage' },
];

export default function InventoryWarehouse() {
  const [activeView, setActiveView] = useState('central-stock');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const activeLabel = subViews.find((v) => v.key === activeView)?.label || '';

  const renderView = () => {
    switch (activeView) {
      case 'central-stock': return <CentralStockDashboard />;
      case 'auto-reservation': return <AutoReservation />;
      case 'reorder-suggestions': return <ReorderSuggestions />;
      case 'bin-rack': return <BinRackMapping />;
      case 'damage-shrinkage': return <DamageShrinkage />;
      default: return <CentralStockDashboard />;
    }
  };

  return (
    <div className="iw-page">
      <div className="iw-header">
        <div className="iw-dropdown-wrapper">
          <button
            className="iw-dropdown-btn"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <span className="iw-dropdown-title">{activeLabel.toUpperCase()}</span>
            {dropdownOpen ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
          </button>
          {dropdownOpen && (
            <div className="iw-dropdown-menu">
              {subViews.map((view) => (
                <button
                  key={view.key}
                  className={`iw-dropdown-item ${activeView === view.key ? 'active' : ''}`}
                  onClick={() => {
                    setActiveView(view.key);
                    setDropdownOpen(false);
                  }}
                >
                  {view.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {renderView()}
    </div>
  );
}
