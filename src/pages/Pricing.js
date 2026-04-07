import React, { useState } from 'react';
import {
  MdEdit,
  MdDelete,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdSearch,
  MdFilterList,

  MdTrendingUp,
  MdWarning,
  MdError,
  MdToggleOn,
  MdToggleOff,
} from 'react-icons/md';
import './Pricing.css';

/* ==============================
   DATA
   ============================== */

const initialPriceList = [
  {
    id: 1,
    productName: '4K LED TV',
    category: 'Television',
    subcategory: 'LED TV',
    brand: 'Sony',
    hsnCode: '967428',
    basePurchasePrice: '\u20B941,000',
    b2cMRP: '\u20B944,000',
    b2bMRP: '\u20B942,000',
    maxDiscount: '10%',
    currentEffectivePrice: '\u20B943,500',
    priceListName: 'Default',
    region: 'All India',
    channel: 'E-com',
    effectiveFrom: '01/12/2025',
    effectiveTill: '01/12/2025',
    status: 'Active',
    lastUpdatedBy: 'Admin',
    lastUpdatedOn: '29/11/2025 11:30 AM',
  },
  {
    id: 2,
    productName: 'Double Door Refrigerator',
    category: 'Appliances',
    subcategory: 'Refrigerator',
    brand: 'LG',
    hsnCode: '84182110',
    basePurchasePrice: '\u20B919,800',
    b2cMRP: '\u20B923,000',
    b2bMRP: '\u20B920,500',
    maxDiscount: '12%',
    currentEffectivePrice: '\u20B922,300',
    priceListName: 'Winter Appliance Sale 2025',
    region: 'Karnataka',
    channel: 'Franchise',
    effectiveFrom: '05/12/2025',
    effectiveTill: '06/01/2026',
    status: 'Scheduled',
    lastUpdatedBy: 'Pricing Team',
    lastUpdatedOn: '29/11/2025 11:30 AM',
  },
  {
    id: 3,
    productName: 'Front Load Washing Machine',
    category: 'Appliances',
    subcategory: 'Washing Machine',
    brand: 'LG',
    hsnCode: '78218B6',
    basePurchasePrice: '\u20B929,800',
    b2cMRP: '\u20B926,000',
    b2bMRP: '\u20B924,500',
    maxDiscount: '14%',
    currentEffectivePrice: '\u20B925,000',
    priceListName: 'Clearance',
    region: 'Karnataka',
    channel: 'Franchise',
    effectiveFrom: '29/11/2025',
    effectiveTill: '06/12/2025',
    status: 'Active',
    lastUpdatedBy: 'Pricing Team',
    lastUpdatedOn: '29/11/2025 11:30 PM',
  },
];

const franchiseTierData = [
  {
    id: 1,
    franchiseName: 'North Branch',
    region: 'North',
    tier: 'A',
    productName: '4K LED TV',
    sku: 'SKU2346',
    basePurchaseB2B: '\u20B944,000',
    tierPrice: '\u20B941,000',
    maxDiscount: '20%',
    effectiveFrom: '01/12/2025',
    effectiveTill: '01/12/2025',
    lastUpdatedBy: 'Admin',
    lastUpdatedOn: '28/11/2025 11:30 AM',
    status: 'Active',
  },
  {
    id: 2,
    franchiseName: 'Central Hub',
    region: 'Central',
    tier: 'B',
    productName: '4K LED TV',
    sku: 'SKU3448',
    basePurchaseB2B: '\u20B944,000',
    tierPrice: '\u20B942,000',
    maxDiscount: '16%',
    effectiveFrom: '05/12/2025',
    effectiveTill: '06/01/2026',
    lastUpdatedBy: 'Pricing Team',
    lastUpdatedOn: '29/11/2025 11:30 AM',
    status: 'Scheduled',
  },
  {
    id: 3,
    franchiseName: 'South Outlet',
    region: 'South',
    tier: 'C',
    productName: 'Front Load Washing Machine',
    sku: 'SKU4242',
    basePurchaseB2B: '\u20B927,000',
    tierPrice: '\u20B928,500',
    maxDiscount: '10%',
    effectiveFrom: '29/11/2025',
    effectiveTill: '06/12/2025',
    lastUpdatedBy: 'Pricing Team',
    lastUpdatedOn: '28/11/2025 11:30 PM',
    status: 'Active',
  },
  {
    id: 4,
    franchiseName: 'City Central',
    region: 'All-India',
    tier: 'A',
    productName: 'Air Conditioner',
    sku: 'SKU2442',
    basePurchaseB2B: '\u20B925,000',
    tierPrice: '\u20B921,000',
    maxDiscount: '10%',
    effectiveFrom: '29/11/2025',
    effectiveTill: '06/12/2025',
    lastUpdatedBy: 'Pricing Team',
    lastUpdatedOn: '28/11/2025 11:30 PM',
    status: 'Inactive',
  },
];

const couponData = [
  { id: 1, code: 'SUMMER25', audience: 'All Users', discount: '25%', effectiveFrom: '01/12/2025', effectiveTill: '01/12/2025', status: 'Active', active: true },
  { id: 2, code: 'BOGO2024', audience: 'All Users', discount: '10%', effectiveFrom: '05/12/2025', effectiveTill: '06/01/2026', status: 'Active', active: true },
  { id: 3, code: 'SALE500', audience: 'New Users', discount: '50%', effectiveFrom: '29/09/2025', effectiveTill: '10/10/2025', status: 'Expired', active: false },
  { id: 4, code: 'FESTIVE20', audience: 'New Users', discount: '20%', effectiveFrom: '29/11/2025', effectiveTill: '06/12/2025', status: 'Inactive', active: false },
];

const taxData = [
  { id: 1, hsnCode: '86787217', product: '4K LED TV', gst: '18%', taxCategory: 'Normal', applicability: 'All-India', effectiveFrom: '01/12/2025', status: 'Active', active: true },
  { id: 2, hsnCode: '84182110', product: 'Refrigerator Double Door', gst: '18%', taxCategory: 'Normal', applicability: 'Karnataka', effectiveFrom: '09/12/2025', status: 'Active', active: true },
  { id: 3, hsnCode: '87124672', product: 'Washing Machine', gst: '14%', taxCategory: 'Normal', applicability: 'Karnataka', effectiveFrom: '11/12/2025', status: 'Active', active: true },
];

const SUB_VIEWS = [
  { key: 'central', label: 'Central Price List' },
  { key: 'franchise', label: 'Franchise Specific Pricing Tiers' },
  { key: 'coupon', label: 'Coupon Management' },
  { key: 'tax', label: 'Tax Settings' },
  { key: 'margin', label: 'Margin Simulation Tool' },
];

/* ==============================
   SUB-VIEW: Central Price List
   ============================== */

function CentralPriceList() {
  const [search, setSearch] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  const filtered = initialPriceList.filter(
    (item) =>
      item.productName.toLowerCase().includes(search.toLowerCase()) ||
      item.region.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (item) => {
    setFormData({
      productName: item.productName,
      category: item.category,
      subcategory: item.subcategory,
      brand: item.brand,
      hsnCode: item.hsnCode,
      basePurchasePrice: item.basePurchasePrice,
      b2cMRP: item.b2cMRP,
      b2bMRP: item.b2bMRP,
      maxDiscount: item.maxDiscount,
      currentEffectivePrice: item.currentEffectivePrice,
      priceListName: item.priceListName,
      region: item.region,
      channel: item.channel,
      effectiveFrom: item.effectiveFrom,
      effectiveTill: item.effectiveTill,
      lastUpdatedBy: item.lastUpdatedBy,
      lastUpdatedOn: item.lastUpdatedOn,
      status: item.status,
    });
    setEditingItem(item);
  };

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (editingItem) {
    return (
      <div className="pricing-form-card">
        <h2 className="pricing-form-title">Add / Edit Central Price List</h2>
        <div className="pricing-form-grid">
          <div className="pricing-form-row pricing-form-full">
            <label>Product Name</label>
            <input type="text" value={formData.productName} onChange={(e) => handleFormChange('productName', e.target.value)} />
          </div>
          <div className="pricing-form-row">
            <label>Category</label>
            <input type="text" value={formData.category} onChange={(e) => handleFormChange('category', e.target.value)} />
          </div>
          <div className="pricing-form-row">
            <label>Subcategory</label>
            <input type="text" value={formData.subcategory} onChange={(e) => handleFormChange('subcategory', e.target.value)} />
          </div>
          <div className="pricing-form-row">
            <label>Brand</label>
            <input type="text" value={formData.brand} onChange={(e) => handleFormChange('brand', e.target.value)} />
          </div>
          <div className="pricing-form-row">
            <label>HSN Code</label>
            <input type="text" value={formData.hsnCode} onChange={(e) => handleFormChange('hsnCode', e.target.value)} />
          </div>
          <div className="pricing-form-row">
            <label>Base Purchase Price</label>
            <input type="text" value={formData.basePurchasePrice} onChange={(e) => handleFormChange('basePurchasePrice', e.target.value)} />
          </div>
          <div className="pricing-form-row">
            <label>Base Purchase Price (B2C) MRP</label>
            <input type="text" value={formData.b2cMRP} onChange={(e) => handleFormChange('b2cMRP', e.target.value)} />
          </div>
          <div className="pricing-form-row">
            <label>Base Purchase Price (B2B) MRP</label>
            <input type="text" value={formData.b2bMRP} onChange={(e) => handleFormChange('b2bMRP', e.target.value)} />
          </div>
          <div className="pricing-form-row">
            <label>Max Discount %</label>
            <input type="text" value={formData.maxDiscount} onChange={(e) => handleFormChange('maxDiscount', e.target.value)} />
          </div>
          <div className="pricing-form-row">
            <label>Current Effective Price</label>
            <input type="text" value={formData.currentEffectivePrice} onChange={(e) => handleFormChange('currentEffectivePrice', e.target.value)} />
          </div>
          <div className="pricing-form-row">
            <label>Price List Name</label>
            <input type="text" value={formData.priceListName} onChange={(e) => handleFormChange('priceListName', e.target.value)} />
          </div>
          <div className="pricing-form-row">
            <label>Region/Applicability</label>
            <input type="text" value={formData.region} onChange={(e) => handleFormChange('region', e.target.value)} />
          </div>
          <div className="pricing-form-row">
            <label>Channel</label>
            <input type="text" value={formData.channel} onChange={(e) => handleFormChange('channel', e.target.value)} />
          </div>
          <div className="pricing-form-row">
            <label>Effective From</label>
            <input type="date" value={formData.effectiveFrom} onChange={(e) => handleFormChange('effectiveFrom', e.target.value)} />
          </div>
          <div className="pricing-form-row">
            <label>Effective Till</label>
            <input type="date" value={formData.effectiveTill} onChange={(e) => handleFormChange('effectiveTill', e.target.value)} />
          </div>
          <div className="pricing-form-row">
            <label>Last Updated by</label>
            <input type="text" value={formData.lastUpdatedBy} onChange={(e) => handleFormChange('lastUpdatedBy', e.target.value)} />
          </div>
          <div className="pricing-form-row">
            <label>Last Updated On</label>
            <input type="date" value={formData.lastUpdatedOn} onChange={(e) => handleFormChange('lastUpdatedOn', e.target.value)} />
          </div>
          <div className="pricing-form-row pricing-form-full">
            <label>Status</label>
            <select value={formData.status} onChange={(e) => handleFormChange('status', e.target.value)}>
              <option value="Active">Active</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="pricing-form-actions pricing-form-full">
            <button className="pricing-btn-primary pricing-btn-wide">Save</button>
            <button className="pricing-btn-outline pricing-btn-wide" onClick={() => setEditingItem(null)}>Back</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pricing-subview">
      <div className="pricing-toolbar">
        <div className="pricing-search">
          <MdSearch className="pricing-search-icon" />
          <input
            type="text"
            placeholder="Search by region, product name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="pricing-table-wrapper">
        <table className="pricing-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Category</th>
              <th>Subcategory</th>
              <th>Brand</th>
              <th>HSN Code</th>
              <th>Base Purchase Price</th>
              <th>Base Purchase Price(B2C)MRP</th>
              <th>Base Purchase Price(B2B)MRP</th>
              <th>Max Discount % Allowed</th>
              <th>Current Effective Price (Live)</th>
              <th>Price List Name</th>
              <th>Region/Applicability</th>
              <th>Channel</th>
              <th>Effective From</th>
              <th>Effective Till</th>
              <th>Status</th>
              <th>Last Updated by</th>
              <th>Last Updated on</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id}>
                <td>{item.productName}</td>
                <td>{item.category}</td>
                <td>{item.subcategory}</td>
                <td>{item.brand}</td>
                <td>{item.hsnCode}</td>
                <td>{item.basePurchasePrice}</td>
                <td>{item.b2cMRP}</td>
                <td>{item.b2bMRP}</td>
                <td>{item.maxDiscount}</td>
                <td>{item.currentEffectivePrice}</td>
                <td>{item.priceListName}</td>
                <td>{item.region}</td>
                <td>{item.channel}</td>
                <td>{item.effectiveFrom}</td>
                <td>{item.effectiveTill}</td>
                <td>
                  <span className={`pricing-status-badge ${item.status === 'Active' ? 'active' : item.status === 'Scheduled' ? 'scheduled' : 'inactive'}`}>
                    {item.status}
                  </span>
                </td>
                <td>{item.lastUpdatedBy}</td>
                <td>{item.lastUpdatedOn}</td>
                <td>
                  <div className="pricing-actions">
                    <button className="pricing-edit-btn" title="Edit" onClick={() => handleEdit(item)}>
                      <MdEdit />
                    </button>
                    <button className="pricing-delete-btn" title="Delete">
                      <MdDelete />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="19" className="pricing-empty">No pricing records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ==============================
   SUB-VIEW: Franchise Specific Pricing Tiers
   ============================== */

function FranchisePricingTiers() {
  const [search, setSearch] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  const filtered = franchiseTierData.filter(
    (item) =>
      item.franchiseName.toLowerCase().includes(search.toLowerCase()) ||
      item.region.toLowerCase().includes(search.toLowerCase()) ||
      item.productName.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (item) => {
    setFormData({
      franchiseName: item.franchiseName,
      region: item.region,
      tier: item.tier,
      productName: item.productName,
      sku: item.sku,
      tierPrice: item.tierPrice,
      maxDiscount: item.maxDiscount,
      status: item.status,
    });
    setEditingItem(item);
  };

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (editingItem) {
    return (
      <div className="pricing-form-card">
        <h2 className="pricing-form-title">Edit Franchise Tier</h2>
        <div className="pricing-form-grid">
          <div className="pricing-form-row pricing-form-full">
            <label>Franchise Name</label>
            <input type="text" value={formData.franchiseName} onChange={(e) => handleFormChange('franchiseName', e.target.value)} />
          </div>
          <div className="pricing-form-row">
            <label>Region</label>
            <input type="text" value={formData.region} onChange={(e) => handleFormChange('region', e.target.value)} />
          </div>
          <div className="pricing-form-row">
            <label>Tier</label>
            <select value={formData.tier} onChange={(e) => handleFormChange('tier', e.target.value)}>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
            </select>
          </div>
          <div className="pricing-form-row">
            <label>Product Name</label>
            <input type="text" value={formData.productName} onChange={(e) => handleFormChange('productName', e.target.value)} />
          </div>
          <div className="pricing-form-row">
            <label>SKU</label>
            <input type="text" value={formData.sku} onChange={(e) => handleFormChange('sku', e.target.value)} />
          </div>
          <div className="pricing-form-row">
            <label>Tier Price</label>
            <input type="text" value={formData.tierPrice} onChange={(e) => handleFormChange('tierPrice', e.target.value)} />
          </div>
          <div className="pricing-form-row">
            <label>Max Discount %</label>
            <input type="text" value={formData.maxDiscount} onChange={(e) => handleFormChange('maxDiscount', e.target.value)} />
          </div>
          <div className="pricing-form-row pricing-form-full">
            <label>Status</label>
            <select value={formData.status} onChange={(e) => handleFormChange('status', e.target.value)}>
              <option value="Active">Active</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="pricing-form-actions pricing-form-full">
            <button className="pricing-btn-primary pricing-btn-wide">Save</button>
            <button className="pricing-btn-outline pricing-btn-wide" onClick={() => setEditingItem(null)}>Back</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pricing-subview">
      <div className="pricing-toolbar">
        <div className="pricing-search">
          <MdSearch className="pricing-search-icon" />
          <input
            type="text"
            placeholder="Search by franchise, region, product name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="pricing-filter-btn">
          <MdFilterList /> Filter
        </button>
      </div>
      <div className="pricing-table-wrapper">
        <table className="pricing-table pricing-table-franchise">
          <thead>
            <tr>
              <th>Franchise Name</th>
              <th>Region</th>
              <th>Tier</th>
              <th>Product Name</th>
              <th>SKU</th>
              <th>Base Purchase Price(B2B)MRP</th>
              <th>Tier Price</th>
              <th>Max Discount % Allowed</th>
              <th>Effective From</th>
              <th>Effective Till</th>
              <th>Last Updated by</th>
              <th>Last Updated on</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id}>
                <td>{item.franchiseName}</td>
                <td>{item.region}</td>
                <td>{item.tier}</td>
                <td>{item.productName}</td>
                <td>{item.sku}</td>
                <td>{item.basePurchaseB2B}</td>
                <td>{item.tierPrice}</td>
                <td>{item.maxDiscount}</td>
                <td>{item.effectiveFrom}</td>
                <td>{item.effectiveTill}</td>
                <td>{item.lastUpdatedBy}</td>
                <td>{item.lastUpdatedOn}</td>
                <td>
                  <span className={`pricing-status-badge ${item.status === 'Active' ? 'active' : item.status === 'Scheduled' ? 'scheduled' : 'inactive'}`}>
                    {item.status}
                  </span>
                </td>
                <td>
                  <div className="pricing-actions">
                    <button className="pricing-edit-btn" title="Edit" onClick={() => handleEdit(item)}>
                      <MdEdit />
                    </button>
                    <button className="pricing-delete-btn" title="Delete">
                      <MdDelete />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="14" className="pricing-empty">No franchise tier records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ==============================
   SUB-VIEW: Coupon Management
   ============================== */

function CouponManagement() {
  const [search, setSearch] = useState('');
  const [coupons, setCoupons] = useState(couponData);
  const [formData, setFormData] = useState({
    couponCode: '',
    couponName: '',
    discountType: 'Percentage(%)',
    discountValue: '',
    startDate: '',
    endDate: '',
    usageLimit: '',
    couponAudience: 'All Users',
    categoryScope: 'All category',
    status: 'Active',
  });

  const filtered = coupons.filter(
    (item) =>
      item.code.toLowerCase().includes(search.toLowerCase())
  );

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleCoupon = (id) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c))
    );
  };

  return (
    <div className="pricing-subview">
      <div className="pricing-split-layout">
        {/* Left panel - form */}
        <div className="pricing-split-left">
          <div className="pricing-form-card pricing-form-card-inline">
            <h3 className="pricing-form-subtitle">Coupon Details</h3>
            <div className="pricing-form-stack">
              <div className="pricing-form-row pricing-form-full">
                <label>Coupon Code</label>
                <input type="text" value={formData.couponCode} onChange={(e) => handleFormChange('couponCode', e.target.value)} placeholder="Enter coupon code" />
              </div>
              <div className="pricing-form-row pricing-form-full">
                <label>Coupon Name</label>
                <input type="text" value={formData.couponName} onChange={(e) => handleFormChange('couponName', e.target.value)} placeholder="Enter coupon name" />
              </div>
              <div className="pricing-form-row-pair">
                <div className="pricing-form-row">
                  <label>Discount Type</label>
                  <select value={formData.discountType} onChange={(e) => handleFormChange('discountType', e.target.value)}>
                    <option value="Percentage(%)">Percentage(%)</option>
                    <option value="Flat Amount">Flat Amount</option>
                  </select>
                </div>
                <div className="pricing-form-row">
                  <label>Discount Value</label>
                  <div className="pricing-input-suffix">
                    <input type="text" value={formData.discountValue} onChange={(e) => handleFormChange('discountValue', e.target.value)} placeholder="0" />
                    <span className="pricing-suffix">%</span>
                  </div>
                </div>
              </div>
              <div className="pricing-form-row-pair">
                <div className="pricing-form-row">
                  <label>Start Date</label>
                  <input type="date" value={formData.startDate} onChange={(e) => handleFormChange('startDate', e.target.value)} />
                </div>
                <div className="pricing-form-row">
                  <label>End Date</label>
                  <input type="date" value={formData.endDate} onChange={(e) => handleFormChange('endDate', e.target.value)} />
                </div>
              </div>
              <div className="pricing-form-row pricing-form-full">
                <label>Usage Limit</label>
                <input type="text" value={formData.usageLimit} onChange={(e) => handleFormChange('usageLimit', e.target.value)} placeholder="Enter usage limit" />
              </div>
              <div className="pricing-form-row-pair">
                <div className="pricing-form-row">
                  <label>Coupon Audience</label>
                  <select value={formData.couponAudience} onChange={(e) => handleFormChange('couponAudience', e.target.value)}>
                    <option value="All Users">All Users</option>
                    <option value="New Users">New Users</option>
                  </select>
                </div>
                <div className="pricing-form-row">
                  <label>Category Scope</label>
                  <select value={formData.categoryScope} onChange={(e) => handleFormChange('categoryScope', e.target.value)}>
                    <option value="All category">All category</option>
                  </select>
                </div>
              </div>
              <div className="pricing-form-row pricing-form-full">
                <label>Status</label>
                <select value={formData.status} onChange={(e) => handleFormChange('status', e.target.value)}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Expired">Expired</option>
                </select>
              </div>
              <button className="pricing-btn-primary pricing-btn-full">Save</button>
            </div>
          </div>
        </div>

        {/* Right panel - table */}
        <div className="pricing-split-right">
          <div className="pricing-toolbar">
            <button className="pricing-filter-btn">
              <MdFilterList /> Filter
            </button>
            <div className="pricing-search">
              <MdSearch className="pricing-search-icon" />
              <input
                type="text"
                placeholder="Search by coupon code, name"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="pricing-table-wrapper">
            <table className="pricing-table">
              <thead>
                <tr>
                  <th>Coupon Code</th>
                  <th>Coupon Audience</th>
                  <th>Discount</th>
                  <th>Effective From</th>
                  <th>Effective Till</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id}>
                    <td className="pricing-td-bold">{item.code}</td>
                    <td>{item.audience}</td>
                    <td>{item.discount}</td>
                    <td>{item.effectiveFrom}</td>
                    <td>{item.effectiveTill}</td>
                    <td>
                      <span className={`pricing-status-badge ${item.status === 'Active' ? 'active' : item.status === 'Expired' ? 'inactive' : 'scheduled'}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <div className="pricing-actions">
                        <button
                          className={`pricing-toggle-btn ${item.active ? 'on' : 'off'}`}
                          title="Toggle"
                          onClick={() => toggleCoupon(item.id)}
                        >
                          {item.active ? <MdToggleOn /> : <MdToggleOff />}
                        </button>
                        <button className="pricing-delete-btn" title="Delete">
                          <MdDelete />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="7" className="pricing-empty">No coupons found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==============================
   SUB-VIEW: Tax Settings
   ============================== */

function TaxSettings() {
  const [search, setSearch] = useState('');
  const [taxes, setTaxes] = useState(taxData);
  const [formData, setFormData] = useState({
    hsnCode: '86787217',
    productName: '4K LED TV',
    taxCategory: 'Normal',
    gst: '',
    applicability: '',
    effectiveFrom: '',
    status: 'Active',
  });

  const filtered = taxes.filter(
    (item) =>
      item.hsnCode.toLowerCase().includes(search.toLowerCase()) ||
      item.product.toLowerCase().includes(search.toLowerCase())
  );

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleTax = (id) => {
    setTaxes((prev) =>
      prev.map((t) => (t.id === id ? { ...t, active: !t.active } : t))
    );
  };

  return (
    <div className="pricing-subview">
      <div className="pricing-toolbar">
        <div className="pricing-search">
          <MdSearch className="pricing-search-icon" />
          <input
            type="text"
            placeholder="Search HSN, Product Name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="pricing-filter-btn">
          <MdFilterList /> Filter
        </button>
        <button className="pricing-btn-primary">Bulk Upload HSN</button>
      </div>

      <div className="pricing-split-layout">
        {/* Left panel - form */}
        <div className="pricing-split-left">
          <div className="pricing-form-card pricing-form-card-inline">
            <h3 className="pricing-form-subtitle">Add Tax Rule</h3>
            <div className="pricing-form-stack">
              <div className="pricing-form-row pricing-form-full">
                <label>HSN Code</label>
                <input type="text" value={formData.hsnCode} onChange={(e) => handleFormChange('hsnCode', e.target.value)} />
              </div>
              <div className="pricing-form-row pricing-form-full">
                <label>Product Name</label>
                <input type="text" value={formData.productName} onChange={(e) => handleFormChange('productName', e.target.value)} />
              </div>
              <div className="pricing-form-row pricing-form-full">
                <label>Tax Category</label>
                <select value={formData.taxCategory} onChange={(e) => handleFormChange('taxCategory', e.target.value)}>
                  <option value="Normal">Normal</option>
                  <option value="Exempt">Exempt</option>
                  <option value="Special">Special</option>
                </select>
              </div>
              <div className="pricing-form-row pricing-form-full">
                <label>GST %</label>
                <input type="text" value={formData.gst} onChange={(e) => handleFormChange('gst', e.target.value)} placeholder="Enter GST %" />
              </div>
              <div className="pricing-form-row pricing-form-full">
                <label>Applicability</label>
                <input type="text" value={formData.applicability} onChange={(e) => handleFormChange('applicability', e.target.value)} placeholder="e.g. All-India" />
              </div>
              <div className="pricing-form-row pricing-form-full">
                <label>Effective From</label>
                <input type="text" value={formData.effectiveFrom} onChange={(e) => handleFormChange('effectiveFrom', e.target.value)} placeholder="DD/MM/YYYY" />
              </div>
              <div className="pricing-form-row pricing-form-full">
                <label>Status</label>
                <select value={formData.status} onChange={(e) => handleFormChange('status', e.target.value)}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <button className="pricing-btn-primary pricing-btn-full">Apply to Franchise Tier</button>
            </div>
          </div>
        </div>

        {/* Right panel - table */}
        <div className="pricing-split-right">
          <div className="pricing-table-wrapper">
            <table className="pricing-table">
              <thead>
                <tr>
                  <th>HSN Code</th>
                  <th>Product</th>
                  <th>GST</th>
                  <th>Tax Category</th>
                  <th>Applicability</th>
                  <th>Effective from</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id}>
                    <td>{item.hsnCode}</td>
                    <td>{item.product}</td>
                    <td>{item.gst}</td>
                    <td>{item.taxCategory}</td>
                    <td>{item.applicability}</td>
                    <td>{item.effectiveFrom}</td>
                    <td>
                      <span className={`pricing-status-badge ${item.status === 'Active' ? 'active' : 'inactive'}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <div className="pricing-actions">
                        <button
                          className={`pricing-toggle-btn ${item.active ? 'on' : 'off'}`}
                          title="Toggle"
                          onClick={() => toggleTax(item.id)}
                        >
                          {item.active ? <MdToggleOn /> : <MdToggleOff />}
                        </button>
                        <button className="pricing-delete-btn" title="Delete">
                          <MdDelete />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="8" className="pricing-empty">No tax records found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==============================
   SUB-VIEW: Margin Simulation Tool
   ============================== */

function MarginSimulationTool() {
  const [formData, setFormData] = useState({
    basePurchasePrice: '\u20B941,000',
    currentB2CPrice: '\u20B935,000',
    newTierPrice: '\u20B934,000',
    currentB2BPrice: '\u20B935,000',
    newFranchisePrice: '',
    newEComPrice: '',
    maxDiscountAllowed: '',
    newGST: '',
    adjustCost: '',
  });

  const [simulated, setSimulated] = useState(true);

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="pricing-subview">
      <div className="pricing-split-layout pricing-split-equal">
        {/* Left panel - inputs */}
        <div className="pricing-split-left">
          <div className="pricing-form-card pricing-form-card-inline">
            <div className="pricing-product-info">
              <div className="pricing-product-info-row">
                <span className="pricing-product-info-label">Product Name:</span>
                <span className="pricing-product-info-value">4K LED TV</span>
              </div>
              <div className="pricing-product-info-row">
                <span className="pricing-product-info-label">SKU:</span>
                <span className="pricing-product-info-value">SKU42426</span>
              </div>
              <div className="pricing-product-info-row">
                <span className="pricing-product-info-label">Category:</span>
                <span className="pricing-product-info-value">Television</span>
              </div>
              <div className="pricing-product-info-row">
                <span className="pricing-product-info-label">Brand:</span>
                <span className="pricing-product-info-value">Sony</span>
              </div>
            </div>
            <div className="pricing-form-stack">
              <div className="pricing-form-row pricing-form-full">
                <label>Base Purchase Price</label>
                <input type="text" value={formData.basePurchasePrice} onChange={(e) => handleFormChange('basePurchasePrice', e.target.value)} />
              </div>
              <div className="pricing-form-row pricing-form-full">
                <label>Current B2C Price</label>
                <input type="text" value={formData.currentB2CPrice} onChange={(e) => handleFormChange('currentB2CPrice', e.target.value)} />
              </div>
              <div className="pricing-form-row pricing-form-full">
                <label>New Tier Price</label>
                <input type="text" value={formData.newTierPrice} onChange={(e) => handleFormChange('newTierPrice', e.target.value)} />
              </div>
              <div className="pricing-form-row pricing-form-full">
                <label>Current B2B Price</label>
                <input type="text" value={formData.currentB2BPrice} onChange={(e) => handleFormChange('currentB2BPrice', e.target.value)} />
              </div>
              <div className="pricing-form-row pricing-form-full">
                <label>New Franchise Price</label>
                <input type="text" value={formData.newFranchisePrice} onChange={(e) => handleFormChange('newFranchisePrice', e.target.value)} placeholder="Enter price" />
              </div>
              <div className="pricing-form-row pricing-form-full">
                <label>New E-Com Price</label>
                <input type="text" value={formData.newEComPrice} onChange={(e) => handleFormChange('newEComPrice', e.target.value)} placeholder="Enter price" />
              </div>
              <div className="pricing-form-row pricing-form-full">
                <label>Max Discount Allowed</label>
                <input type="text" value={formData.maxDiscountAllowed} onChange={(e) => handleFormChange('maxDiscountAllowed', e.target.value)} placeholder="Enter %" />
              </div>
              <div className="pricing-form-row pricing-form-full">
                <label>New GST%</label>
                <input type="text" value={formData.newGST} onChange={(e) => handleFormChange('newGST', e.target.value)} placeholder="Enter GST %" />
              </div>
              <div className="pricing-form-row pricing-form-full">
                <label>Adjust Cost</label>
                <input type="text" value={formData.adjustCost} onChange={(e) => handleFormChange('adjustCost', e.target.value)} placeholder="Enter cost adjustment" />
              </div>
              <button className="pricing-btn-primary pricing-btn-full" onClick={() => setSimulated(true)}>Simulate</button>
            </div>
          </div>
        </div>

        {/* Right panel - results */}
        <div className="pricing-split-right">
          <div className="pricing-form-card pricing-form-card-inline">
            <h3 className="pricing-form-subtitle">Simulation Results</h3>
            {simulated ? (
              <div className="pricing-sim-results">
                <div className="pricing-sim-grid">
                  <div className="pricing-sim-item">
                    <span className="pricing-sim-label">Gross Margin</span>
                    <span className="pricing-sim-value">7.8%</span>
                  </div>
                  <div className="pricing-sim-item">
                    <span className="pricing-sim-label">Net Margin</span>
                    <span className="pricing-sim-value">6.3%</span>
                  </div>
                  <div className="pricing-sim-item">
                    <span className="pricing-sim-label">Franchise Margin</span>
                    <span className="pricing-sim-value">9.8%</span>
                  </div>
                  <div className="pricing-sim-item">
                    <span className="pricing-sim-label">E-Com Margin</span>
                    <span className="pricing-sim-value">5.8%</span>
                  </div>
                  <div className="pricing-sim-item">
                    <span className="pricing-sim-label">Profit Per Unit</span>
                    <span className="pricing-sim-value pricing-sim-trending">
                      <MdTrendingUp className="pricing-trending-icon" /> 2,500
                    </span>
                  </div>
                </div>
                <div className="pricing-sim-alerts">
                  <div className="pricing-sim-alert pricing-sim-alert-warning">
                    <MdWarning className="pricing-sim-alert-icon" />
                    <span>Net Margin Warning</span>
                  </div>
                  <div className="pricing-sim-alert pricing-sim-alert-error">
                    <MdError className="pricing-sim-alert-icon" />
                    <span>Price Violation warning</span>
                  </div>
                </div>
                <div className="pricing-sim-actions">
                  <button className="pricing-btn-outline pricing-btn-full">Save as Price List</button>
                  <button className="pricing-btn-primary pricing-btn-full">Apply to Franchise Tier</button>
                </div>
              </div>
            ) : (
              <div className="pricing-sim-empty">Click "Simulate" to view results.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==============================
   MAIN PRICING COMPONENT
   ============================== */

export default function Pricing() {
  const [activeView, setActiveView] = useState('central');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const activeLabel = SUB_VIEWS.find((v) => v.key === activeView)?.label || 'Central Price List';

  const handleSelectView = (key) => {
    setActiveView(key);
    setDropdownOpen(false);
  };

  const renderSubView = () => {
    switch (activeView) {
      case 'central':
        return <CentralPriceList />;
      case 'franchise':
        return <FranchisePricingTiers />;
      case 'coupon':
        return <CouponManagement />;
      case 'tax':
        return <TaxSettings />;
      case 'margin':
        return <MarginSimulationTool />;
      default:
        return <CentralPriceList />;
    }
  };

  return (
    <div className="pricing-page">
      {/* Header with dropdown navigation */}
      <div className="pricing-header">
        <div className="pricing-dropdown-wrapper">
          <button
            className="pricing-dropdown-toggle"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <span className="pricing-dropdown-label">{activeLabel.toUpperCase()}</span>
            {dropdownOpen ? (
              <MdKeyboardArrowUp className="pricing-dropdown-arrow" />
            ) : (
              <MdKeyboardArrowDown className="pricing-dropdown-arrow" />
            )}
          </button>
          {dropdownOpen && (
            <div className="pricing-dropdown-menu">
              {SUB_VIEWS.map((view) => (
                <button
                  key={view.key}
                  className={`pricing-dropdown-item ${activeView === view.key ? 'active' : ''}`}
                  onClick={() => handleSelectView(view.key)}
                >
                  {view.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Active sub-view */}
      {renderSubView()}
    </div>
  );
}
