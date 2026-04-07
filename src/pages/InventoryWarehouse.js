import React, { useState } from 'react';
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
import './InventoryWarehouse.css';

/* ==============================
   SUB-VIEW DATA
   ============================== */

const centralStockData = [
  { sku: 'SKU12345', name: '4K LED Television', category: 'Television', brand: 'Sony Bravia', stock: '1,000' },
  { sku: 'SKU25455', name: 'Double Door Refrigerator', category: 'Refrigerator', brand: 'LG', stock: '100' },
  { sku: 'SKU34567', name: 'Front Load Washing Machine', category: 'Washing Machine', brand: 'Samsung', stock: '300' },
  { sku: 'SKU46967', name: 'Electric Kettle', category: 'Appliances', brand: 'Wonderchef', stock: '190' },
];

const autoReservationData = [
  { orderId: '#12345', channel: 'Franchise', sku: 'AC234', qty: 10, reservedOn: 'Jan 16 2024', status: 'Confirmed' },
  { orderId: '#23446', channel: 'E-Commerce', sku: 'FGH789', qty: 3, reservedOn: 'Jan 16 2024', status: 'Pending' },
  { orderId: '#214242', channel: 'E-Commerce', sku: 'JK878', qty: 1, reservedOn: 'Jan 15 2024', status: 'Confirmed' },
  { orderId: '#422442', channel: 'Franchise', sku: 'ABX234', qty: 5, reservedOn: 'Jan 14 2024', status: 'Pending' },
];

const reorderData = [
  { sku: 'SKU2345', name: '4K LED TV', velocity: '120 units', currentStock: 100, safetyStock: 150, leadTime: '10 days', trend: 'High', reorderQty: 1250 },
  { sku: 'SKU3446', name: 'Double Door Refrigerator', velocity: '45 units', currentStock: 20, safetyStock: 50, leadTime: '7 days', trend: 'Stable', reorderQty: 330 },
  { sku: 'SKU4242', name: 'Front Load Washing Machine', velocity: '18 units', currentStock: 12, safetyStock: 25, leadTime: '5 days', trend: 'Low', reorderQty: 103 },
  { sku: 'SKU2442', name: 'Air Conditioner', velocity: '60 units', currentStock: 15, safetyStock: 35, leadTime: '3 days', trend: 'High', reorderQty: 210 },
];

const binRackData = [
  { sku: 'SKU2345', name: '4K LED TV', category: 'Television', rack: 'R12', shelf: 'S2', zone: 'A', storage: 'Bulky' },
  { sku: 'SKU3446', name: 'Double Door Refrigerator', category: 'Refrigerator', rack: 'R07', shelf: 'S3', zone: 'C', storage: 'Heavy' },
  { sku: 'SKU4242', name: 'Front Load Washing Machine', category: 'Washing Machine', rack: 'R01', shelf: 'S16', zone: 'F', storage: 'Bulky' },
  { sku: 'SKU2442', name: 'Split Air Conditioner', category: 'Air Conditioner', rack: 'R11', shelf: 'S4', zone: 'D', storage: 'Bulky' },
];

const damageData = [
  { reportId: 'DR-00012', reportedOn: '28/11/025 11:30AM', reportedBy: 'Ramesh Kumar (WH-02)', sku: 'SKU2345', bin: 'A1-S2', type: 'Damaged', qty: 1, status: 'Disapproved' },
  { reportId: 'DR-00011', reportedOn: '22/11/025 12:30PM', reportedBy: 'Ramya (FR-01)', sku: 'SKU3446', bin: 'D4-S1', type: 'Lost', qty: 3, status: 'Approved' },
  { reportId: 'DR-00009', reportedOn: '14/10/025 09:30AM', reportedBy: 'Satish Kumar (WH-09)', sku: 'SKU4242', bin: 'B2-S9', type: 'Theft', qty: 1, status: 'Approved' },
  { reportId: 'DR-00001', reportedOn: '28/09/025 11:30AM', reportedBy: 'Sandhya (FR-04)', sku: 'SKU2442', bin: '-', type: 'Courier Return', qty: 9, status: 'Disapproved' },
];

/* ==============================
   SUB-VIEW COMPONENTS
   ============================== */

function CentralStockDashboard() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const filtered = centralStockData.filter((r) => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = category ? r.category === category : true;
    return matchSearch && matchCat;
  });

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
            <option value="Television">Television</option>
            <option value="Refrigerator">Refrigerator</option>
            <option value="Washing Machine">Washing Machine</option>
            <option value="Appliances">Appliances</option>
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
            {filtered.map((row, i) => (
              <tr key={i}>
                <td>{row.sku}</td>
                <td>{row.name}</td>
                <td>{row.category}</td>
                <td>{row.brand}</td>
                <td>{row.stock}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="5" className="iw-empty">No products found.</td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="4" className="iw-footer-label">Tot:</td>
              <td className="iw-footer-value">1,590</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

function AutoReservation() {
  const [search, setSearch] = useState('');
  const [date, setDate] = useState('2024-01-16');
  const [detailItem, setDetailItem] = useState(null);
  const [editStatus, setEditStatus] = useState('');

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
              <input type="date" defaultValue="2024-01-16" />
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
            <button className="iw-btn iw-btn-primary" onClick={() => setDetailItem(null)}>Save</button>
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
            {autoReservationData.map((row, i) => (
              <tr key={i}>
                <td>{row.orderId}</td>
                <td>{row.channel}</td>
                <td>{row.sku}</td>
                <td>{row.qty}</td>
                <td>{row.reservedOn}</td>
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
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ReorderSuggestions() {
  const [search, setSearch] = useState('');
  const [items, setItems] = useState(reorderData);

  const trendIcon = (trend) => {
    if (trend === 'High') return <span className="iw-trend iw-trend-high"><MdArrowUpward /> High</span>;
    if (trend === 'Stable') return <span className="iw-trend iw-trend-stable"><MdArrowForward /> Stable</span>;
    return <span className="iw-trend iw-trend-low"><MdArrowDownward /> Low</span>;
  };

  const deleteItem = (sku) => {
    setItems((prev) => prev.filter((r) => r.sku !== sku));
  };

  const filtered = items.filter((r) => r.name.toLowerCase().includes(search.toLowerCase()));

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
            {filtered.map((row, i) => (
              <tr key={i}>
                <td>{row.sku}</td>
                <td>{row.name}</td>
                <td>{row.velocity}</td>
                <td>{row.currentStock}</td>
                <td>{row.safetyStock}</td>
                <td>{row.leadTime}</td>
                <td>{trendIcon(row.trend)}</td>
                <td className={row.reorderQty > 1000 ? 'iw-text-red' : ''}>{row.reorderQty}</td>
                <td>
                  <div className="iw-actions">
                    <label className="iw-toggle">
                      <input type="checkbox" defaultChecked />
                      <span className="iw-toggle-slider" />
                    </label>
                    <button className="iw-delete-btn" onClick={() => deleteItem(row.sku)}>
                      <MdDelete />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function BinRackMapping() {
  const [search, setSearch] = useState('');
  const [rackNumber, setRackNumber] = useState('');
  const [shelfBin, setShelfBin] = useState('');
  const [zoneArea, setZoneArea] = useState('');
  const [storageType, setStorageType] = useState('');

  const filtered = binRackData.filter((r) => r.name.toLowerCase().includes(search.toLowerCase()));

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
          <span className="iw-stat-value">56</span>
        </div>
        <div className="iw-stat-card">
          <span className="iw-stat-label">Total Bins</span>
          <span className="iw-stat-value">240</span>
        </div>
        <div className="iw-stat-card">
          <span className="iw-stat-label">Fragile Storage</span>
          <span className="iw-stat-value">84</span>
        </div>
        <div className="iw-stat-card">
          <span className="iw-stat-label">Temperature Sensitive</span>
          <span className="iw-stat-value">84</span>
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
              {filtered.map((row, i) => (
                <tr key={i}>
                  <td>{row.sku}</td>
                  <td>{row.name}</td>
                  <td>{row.category}</td>
                  <td>{row.rack}</td>
                  <td>{row.shelf}</td>
                  <td>{row.zone}</td>
                  <td>{row.storage}</td>
                  <td>
                    <button className="iw-check-btn"><MdCheck /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="iw-side-panel">
          <h3 className="iw-panel-title">Assign Bin</h3>
          <div className="iw-panel-form">
            <div className="iw-form-group">
              <label>Product Name</label>
              <input type="text" value="4K LED TV" readOnly />
            </div>
            <div className="iw-form-group">
              <label>SKU</label>
              <input type="text" value="SKU12446" readOnly />
            </div>
            <div className="iw-form-group">
              <label>Category</label>
              <input type="text" value="Television" readOnly />
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
            <button className="iw-btn iw-btn-primary iw-btn-full">Save Mapping</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DamageShrinkage() {
  const [search, setSearch] = useState('');
  const [items, setItems] = useState(damageData);
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportType, setReportType] = useState('');
  const [reasonCode, setReasonCode] = useState('');
  const [description, setDescription] = useState('');
  const [suggestedAction, setSuggestedAction] = useState('');

  const deleteItem = (reportId) => {
    setItems((prev) => prev.filter((r) => r.reportId !== reportId));
  };

  const filtered = items.filter(
    (r) => r.reportId.toLowerCase().includes(search.toLowerCase()) ||
           r.reportedBy.toLowerCase().includes(search.toLowerCase()) ||
           r.sku.toLowerCase().includes(search.toLowerCase())
  );

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
              {filtered.map((row, i) => (
                <tr key={i} className={selectedReport?.reportId === row.reportId ? 'iw-row-active' : ''} onClick={() => {
                  setSelectedReport(row);
                  setReportType(row.type);
                }}>
                  <td>{row.reportId}</td>
                  <td>{row.reportedOn}</td>
                  <td>{row.reportedBy}</td>
                  <td>{row.sku}</td>
                  <td>{row.bin}</td>
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
                        <input type="checkbox" defaultChecked={row.status === 'Approved'} />
                        <span className="iw-toggle-slider" />
                      </label>
                      <button className="iw-delete-btn" onClick={() => deleteItem(row.reportId)}>
                        <MdDelete />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="iw-side-panel">
          <h3 className="iw-panel-title">Report</h3>
          <div className="iw-panel-form">
            <div className="iw-form-group">
              <label>Report ID</label>
              <input type="text" value={selectedReport?.reportId || 'DR-00012'} readOnly />
            </div>
            <div className="iw-form-group">
              <label>Product Name</label>
              <input type="text" value={selectedReport ? '4K LED TV' : '4K LED TV'} readOnly />
            </div>
            <div className="iw-form-group">
              <label>Reported By</label>
              <input type="text" value={selectedReport?.reportedBy || 'Ramesh Kumar (WH-02)'} readOnly />
            </div>
            <div className="iw-form-group">
              <label>SKU</label>
              <input type="text" value={selectedReport?.sku || 'SKU2345'} readOnly />
            </div>
            <div className="iw-form-group">
              <label>Bin Location</label>
              <input type="text" value={selectedReport?.bin || 'A1-S2'} readOnly />
            </div>
            <div className="iw-form-group">
              <label>Type</label>
              <select value={reportType || 'Damaged'} onChange={(e) => setReportType(e.target.value)}>
                <option value="Damaged">Damaged</option>
                <option value="Lost">Lost</option>
                <option value="Theft">Theft</option>
                <option value="Courier Return">Courier Return</option>
              </select>
            </div>
            <div className="iw-form-group">
              <label>Quantity</label>
              <input type="number" value={selectedReport?.qty || 1} readOnly />
            </div>
            <div className="iw-form-group">
              <label>Reported on</label>
              <input type="date" defaultValue="2025-11-28" />
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
              <button className="iw-btn iw-btn-green">Approve</button>
              <button className="iw-btn iw-btn-red">Disapprove</button>
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
