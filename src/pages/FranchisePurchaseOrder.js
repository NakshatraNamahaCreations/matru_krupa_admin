import React, { useState } from 'react';
import {
  MdSearch,
  MdFilterList,
  MdVisibility,
  MdEdit,
  MdDelete,
  MdClose,
  MdArrowBack,
  MdFileDownload,
  MdShare,
} from 'react-icons/md';
import './FranchisePurchaseOrder.css';

/* ==============================
   DATA
   ============================== */

const initialOrders = [
  {
    id: '20251201-001',
    franchiseName: 'North Branch',
    region: 'Karnataka',
    productName: '4K LED TV',
    orderDate: '01/12/2025',
    quantity: 12,
    value: '\u20B93,60,000',
    paymentStatus: 'Paid',
    status: 'Part Dispatched',
    category: 'Television',
    subcategory: 'Android TV',
    unitPrice: 40000,
    franchiseId: 'FR-1246',
    gstin: '22902737801',
    billingAddress: 'D-Block, JP Nagar Mysore',
    shippingAddress: 'D-Block, JP Nagar Mysore',
  },
  {
    id: '20251128-045',
    franchiseName: 'West Coast',
    region: 'Mumbai',
    productName: 'Double Door Refrigerator',
    orderDate: '28/11/2025',
    quantity: 4,
    value: '\u20B960,000',
    paymentStatus: 'Partial',
    status: 'Approved',
    category: 'Appliances',
    subcategory: 'Refrigerator',
    unitPrice: 15000,
    franchiseId: 'FR-1302',
    gstin: '27801234567',
    billingAddress: 'A-Wing, Andheri West, Mumbai',
    shippingAddress: 'A-Wing, Andheri West, Mumbai',
  },
  {
    id: '20251125-012',
    franchiseName: 'City Central',
    region: 'Karnataka',
    productName: '4K LED TV',
    orderDate: '25/11/2025',
    quantity: 9,
    value: '\u20B93,10,000',
    paymentStatus: 'Pending',
    status: 'Modified',
    category: 'Television',
    subcategory: 'Android TV',
    unitPrice: 40000,
    franchiseId: 'FR-1189',
    gstin: '29456789012',
    billingAddress: 'MG Road, Bengaluru',
    shippingAddress: 'MG Road, Bengaluru',
  },
];

/* ==============================
   COMPONENT
   ============================== */

export default function FranchisePurchaseOrder() {
  const [view, setView] = useState('list'); // list | detail | modify | dispatch | invoice
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [approvedDone, setApprovedDone] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  // Modify view state
  const [modifyRows, setModifyRows] = useState([]);
  const [modifyForm, setModifyForm] = useState({
    productName: '',
    quantity: '',
    unitPrice: '',
    oldPrice: '',
    newPrice: '',
    reason: '',
  });

  // Dispatch state
  const [dispatchForm, setDispatchForm] = useState({
    address: '',
    orderedQty: '9',
    availableQty: '6',
    dispatchQty: '6',
    remainingQty: '3',
    carrier: 'ABC Logistics',
    expectedDate: '03/12/2025',
    awb: 'XYZ123456789',
    serialNumber: '',
  });

  // Invoice state
  const [invoiceDate, setInvoiceDate] = useState('');

  /* helpers */
  const statusBadgeClass = (status) => {
    if (status === 'Part Dispatched') return 'fpo-badge fpo-badge-orange';
    if (status === 'Approved') return 'fpo-badge fpo-badge-green';
    if (status === 'Modified') return 'fpo-badge fpo-badge-blue';
    return 'fpo-badge';
  };

  const filteredOrders = initialOrders.filter(
    (o) =>
      o.franchiseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.region.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openDetail = (order) => {
    setSelectedOrder(order);
    setView('detail');
  };

  const openEdit = (order) => {
    setSelectedOrder(order);
    setModifyRows([
      {
        productName: order.productName,
        quantity: order.quantity,
        unitPrice: `\u20B9${order.unitPrice.toLocaleString('en-IN')}`,
        totalValue: order.value,
        reason: '',
      },
    ]);
    setModifyForm({
      productName: order.productName,
      quantity: String(order.quantity),
      unitPrice: String(order.unitPrice),
      oldPrice: order.value,
      newPrice: '',
      reason: '',
    });
    setView('modify');
  };

  const handleApprove = () => {
    setShowApproveModal(true);
    setApprovedDone(false);
  };

  const confirmApprove = () => {
    setApprovedDone(true);
  };

  const handleReject = () => {
    setShowRejectModal(true);
    setRejectReason('');
  };

  const handleModify = () => {
    openEdit(selectedOrder);
  };

  const openInvoice = () => {
    setView('invoice');
  };

  const goBack = () => {
    setView('list');
    setSelectedOrder(null);
    setShowApproveModal(false);
    setShowRejectModal(false);
    setApprovedDone(false);
  };

  /* ==============================
     RENDER: PO LIST
     ============================== */
  const renderList = () => (
    <>
      <div className="fpo-header">
        <h1 className="fpo-title">Franchise Purchase Order Handling</h1>
      </div>

      <div className="fpo-toolbar">
        <div className="fpo-search-box">
          <MdSearch className="fpo-search-icon" />
          <input
            type="text"
            placeholder="Search by franchise name, region"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="fpo-search-input"
          />
        </div>
        <button className="fpo-filter-btn">
          <MdFilterList /> Filter
        </button>
      </div>

      <div className="fpo-table-wrap">
        <table className="fpo-table">
          <thead>
            <tr>
              <th>PO ID</th>
              <th>Franchise Name</th>
              <th>Region</th>
              <th>Product Name</th>
              <th>Order Date</th>
              <th>Quantity</th>
              <th>Value</th>
              <th>Payment Status</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.franchiseName}</td>
                <td>{order.region}</td>
                <td>{order.productName}</td>
                <td>{order.orderDate}</td>
                <td>{order.quantity}</td>
                <td>{order.value}</td>
                <td>{order.paymentStatus}</td>
                <td>
                  <span className={statusBadgeClass(order.status)}>
                    {order.status}
                  </span>
                </td>
                <td>
                  <div className="fpo-action-btns">
                    <button
                      className="fpo-icon-btn fpo-icon-green"
                      title="View"
                      onClick={() => openDetail(order)}
                    >
                      <MdVisibility />
                    </button>
                    <button
                      className="fpo-icon-btn fpo-icon-orange"
                      title="Edit"
                      onClick={() => openEdit(order)}
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
    </>
  );

  /* ==============================
     RENDER: DETAIL VIEW
     ============================== */
  const renderDetail = () => {
    const o = selectedOrder;
    if (!o) return null;
    return (
      <>
        <div className="fpo-header">
          <h1 className="fpo-title">
            <button className="fpo-back-btn" onClick={goBack}>
              <MdArrowBack />
            </button>
            Franchise Purchase Order Handling
          </h1>
        </div>

        <div className="fpo-card">
          <h2 className="fpo-card-heading">PO #{o.id}</h2>

          <div className="fpo-detail-grid">
            <div className="fpo-field">
              <label>Franchise Name</label>
              <select className="fpo-select" defaultValue={o.franchiseName}>
                <option>{o.franchiseName}</option>
              </select>
            </div>
            <div className="fpo-field">
              <label>Product Name</label>
              <input className="fpo-input" readOnly value={o.productName} />
            </div>
          </div>

          <div className="fpo-detail-grid">
            <div className="fpo-field">
              <label>Region</label>
              <input className="fpo-input" readOnly value={o.region} />
            </div>
            <div className="fpo-field">
              <label>Order Date</label>
              <input className="fpo-input" readOnly value={o.orderDate} />
            </div>
          </div>

          <div className="fpo-detail-grid">
            <div className="fpo-field">
              <label>Category</label>
              <input className="fpo-input" readOnly value={o.category} />
            </div>
            <div className="fpo-field">
              <label>Subcategory</label>
              <input className="fpo-input" readOnly value={o.subcategory} />
            </div>
          </div>

          <div className="fpo-detail-grid">
            <div className="fpo-field">
              <label>Value</label>
              <input className="fpo-input" readOnly value={o.value} />
            </div>
            <div className="fpo-field">
              <label>Quantity</label>
              <select className="fpo-select" defaultValue={o.quantity}>
                <option>{o.quantity}</option>
              </select>
            </div>
          </div>

          <div className="fpo-detail-grid">
            <div className="fpo-field">
              <label>Payment Status</label>
              <select className="fpo-select" defaultValue={o.paymentStatus}>
                <option>Paid</option>
                <option>Partial</option>
                <option>Pending</option>
              </select>
            </div>
          </div>

          <button className="fpo-btn fpo-btn-dark" onClick={openInvoice}>
            <MdFileDownload /> Download Proforma Invoice
          </button>

          <div className="fpo-detail-actions">
            <button className="fpo-btn fpo-btn-green" onClick={handleApprove}>
              Approve
            </button>
            <button className="fpo-btn fpo-btn-red" onClick={handleReject}>
              Reject
            </button>
            <button className="fpo-btn fpo-btn-blue-outline" onClick={handleModify}>
              Modify
            </button>
          </div>
        </div>

        {/* Approve Modal */}
        {showApproveModal && (
          <div className="fpo-modal-overlay">
            <div className="fpo-modal">
              <div className="fpo-modal-header">
                <h3>Confirm Approval</h3>
                <button
                  className="fpo-modal-close"
                  onClick={() => setShowApproveModal(false)}
                >
                  <MdClose />
                </button>
              </div>
              <div className="fpo-modal-body">
                {!approvedDone ? (
                  <>
                    <div className="fpo-modal-details">
                      <p><strong>PO #</strong>{o.id}</p>
                      <p><strong>Franchise Name:</strong> {o.franchiseName}</p>
                      <p><strong>Product Name:</strong> {o.productName}</p>
                      <p><strong>Region:</strong> {o.region}</p>
                      <p><strong>Order Date:</strong> {o.orderDate}</p>
                      <p><strong>Value:</strong> {'\u20B91,25,000'}</p>
                    </div>
                    <div className="fpo-modal-footer">
                      <button className="fpo-btn fpo-btn-green" onClick={confirmApprove}>
                        Confirm Approval
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="fpo-approved-msg">
                    <p className="fpo-bold">Purchase Order #{o.id}</p>
                    <p className="fpo-approved-text">Approved!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Reject Modal */}
        {showRejectModal && (
          <div className="fpo-modal-overlay">
            <div className="fpo-modal">
              <div className="fpo-modal-header">
                <h3>Reject Purchase order</h3>
                <button
                  className="fpo-modal-close"
                  onClick={() => setShowRejectModal(false)}
                >
                  <MdClose />
                </button>
              </div>
              <div className="fpo-modal-body">
                <div className="fpo-field" style={{ width: '100%' }}>
                  <label>Reason</label>
                  <input
                    className="fpo-input"
                    placeholder="Enter reason for rejection"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                  />
                </div>
                <div className="fpo-modal-footer">
                  <button
                    className="fpo-btn fpo-btn-outline"
                    onClick={() => setShowRejectModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="fpo-btn fpo-btn-blue"
                    onClick={() => setShowRejectModal(false)}
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  /* ==============================
     RENDER: MODIFY VIEW
     ============================== */
  const renderModify = () => {
    const o = selectedOrder;
    if (!o) return null;
    return (
      <>
        <div className="fpo-header">
          <h1 className="fpo-title">
            <button className="fpo-back-btn" onClick={goBack}>
              <MdArrowBack />
            </button>
            Franchise Purchase Order Handling
          </h1>
        </div>

        <div className="fpo-modify-layout">
          {/* Left: table */}
          <div className="fpo-card fpo-modify-left">
            <h2 className="fpo-card-heading">Modify Purchase Order</h2>
            <div className="fpo-table-wrap">
              <table className="fpo-table fpo-table-compact">
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Total Value</th>
                    <th>Reason</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {modifyRows.map((row, idx) => (
                    <tr key={idx}>
                      <td>{row.productName}</td>
                      <td>{row.quantity}</td>
                      <td>{row.unitPrice}</td>
                      <td>{row.totalValue}</td>
                      <td>{row.reason || '-'}</td>
                      <td>
                        <div className="fpo-action-btns">
                          <button className="fpo-icon-btn fpo-icon-orange" title="Edit">
                            <MdEdit />
                          </button>
                          <button className="fpo-icon-btn fpo-icon-red" title="Delete">
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

          {/* Right: form */}
          <div className="fpo-card fpo-modify-right">
            <div className="fpo-field">
              <label>Product Name</label>
              <input
                className="fpo-input"
                value={modifyForm.productName}
                onChange={(e) =>
                  setModifyForm({ ...modifyForm, productName: e.target.value })
                }
              />
            </div>
            <div className="fpo-detail-grid">
              <div className="fpo-field">
                <label>Quantity</label>
                <input
                  className="fpo-input"
                  value={modifyForm.quantity}
                  onChange={(e) =>
                    setModifyForm({ ...modifyForm, quantity: e.target.value })
                  }
                />
              </div>
              <div className="fpo-field">
                <label>Unit Price</label>
                <input
                  className="fpo-input"
                  value={modifyForm.unitPrice}
                  onChange={(e) =>
                    setModifyForm({ ...modifyForm, unitPrice: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="fpo-detail-grid">
              <div className="fpo-field">
                <label>Old Price</label>
                <input
                  className="fpo-input"
                  value={modifyForm.oldPrice}
                  onChange={(e) =>
                    setModifyForm({ ...modifyForm, oldPrice: e.target.value })
                  }
                />
              </div>
              <div className="fpo-field">
                <label>New Price</label>
                <input
                  className="fpo-input"
                  value={modifyForm.newPrice}
                  onChange={(e) =>
                    setModifyForm({ ...modifyForm, newPrice: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="fpo-field">
              <label>Reason</label>
              <input
                className="fpo-input"
                value={modifyForm.reason}
                onChange={(e) =>
                  setModifyForm({ ...modifyForm, reason: e.target.value })
                }
              />
            </div>
            <div className="fpo-modify-actions">
              <button className="fpo-btn fpo-btn-outline" onClick={goBack}>
                Cancel
              </button>
              <button className="fpo-btn fpo-btn-blue">Save</button>
            </div>
          </div>
        </div>
      </>
    );
  };

  /* ==============================
     RENDER: PARTIAL DISPATCH
     ============================== */
  const renderDispatch = () => {
    const o = selectedOrder;
    if (!o) return null;
    return (
      <>
        <div className="fpo-header">
          <h1 className="fpo-title">
            <button className="fpo-back-btn" onClick={goBack}>
              <MdArrowBack />
            </button>
            Franchise Purchase Order Handling
          </h1>
        </div>

        <div className="fpo-card">
          <h2 className="fpo-card-heading">Partial Dispatch &amp; Backorders</h2>
          <p className="fpo-sub-heading">PO #{o.id}</p>

          <div className="fpo-detail-grid">
            <div className="fpo-field">
              <label>Franchise Name</label>
              <input className="fpo-input" readOnly value={o.franchiseName} />
            </div>
            <div className="fpo-field">
              <label>Product Name</label>
              <input className="fpo-input" readOnly value={`Product Name: ${o.productName}`} />
            </div>
          </div>

          <div className="fpo-detail-grid">
            <div className="fpo-field">
              <label>Region</label>
              <input className="fpo-input" readOnly value={o.region} />
            </div>
            <div className="fpo-field">
              <label>Order Date</label>
              <input className="fpo-input" readOnly value={o.orderDate} />
            </div>
          </div>

          <div className="fpo-field">
            <label>Address</label>
            <input
              className="fpo-input"
              value={dispatchForm.address}
              onChange={(e) =>
                setDispatchForm({ ...dispatchForm, address: e.target.value })
              }
            />
          </div>

          <div className="fpo-detail-grid">
            <div className="fpo-field">
              <label>Ordered Qty</label>
              <input className="fpo-input" readOnly value={dispatchForm.orderedQty} />
            </div>
            <div className="fpo-field">
              <label>Available Qty</label>
              <input className="fpo-input" readOnly value={dispatchForm.availableQty} />
            </div>
          </div>

          <div className="fpo-detail-grid">
            <div className="fpo-field">
              <label>Dispatch Qty</label>
              <input
                className="fpo-input"
                value={dispatchForm.dispatchQty}
                onChange={(e) =>
                  setDispatchForm({ ...dispatchForm, dispatchQty: e.target.value })
                }
              />
            </div>
            <div className="fpo-field">
              <label>Remaining Qty</label>
              <input className="fpo-input" readOnly value={dispatchForm.remainingQty} />
            </div>
          </div>

          <div className="fpo-detail-grid">
            <div className="fpo-field">
              <label>Shipment/Carrier</label>
              <input
                className="fpo-input"
                value={dispatchForm.carrier}
                onChange={(e) =>
                  setDispatchForm({ ...dispatchForm, carrier: e.target.value })
                }
              />
            </div>
            <div className="fpo-field">
              <label>Expected Date</label>
              <input
                className="fpo-input"
                type="date"
                value="2025-12-03"
                onChange={(e) =>
                  setDispatchForm({ ...dispatchForm, expectedDate: e.target.value })
                }
              />
            </div>
          </div>

          <div className="fpo-detail-grid">
            <div className="fpo-field">
              <label>AWB</label>
              <input
                className="fpo-input"
                value={dispatchForm.awb}
                onChange={(e) =>
                  setDispatchForm({ ...dispatchForm, awb: e.target.value })
                }
              />
            </div>
            <div className="fpo-field">
              <label>Serial Number</label>
              <input
                className="fpo-input"
                value={dispatchForm.serialNumber}
                onChange={(e) =>
                  setDispatchForm({ ...dispatchForm, serialNumber: e.target.value })
                }
              />
            </div>
          </div>

          <button className="fpo-btn fpo-btn-dark" onClick={openInvoice}>
            <MdFileDownload /> Download Proforma Invoice
          </button>

          <button className="fpo-btn fpo-btn-orange fpo-btn-wide" style={{ marginTop: 16 }}>
            Dispatch
          </button>
        </div>
      </>
    );
  };

  /* ==============================
     RENDER: PROFORMA INVOICE
     ============================== */
  const renderInvoice = () => {
    const o = selectedOrder;
    if (!o) return null;
    return (
      <>
        <div className="fpo-header">
          <h1 className="fpo-title">
            <button className="fpo-back-btn" onClick={() => setView('detail')}>
              <MdArrowBack />
            </button>
            Proforma Invoice
          </h1>
        </div>

        {/* Top bar */}
        <div className="fpo-invoice-topbar">
          <div className="fpo-invoice-tab">Proforma Invoice #{o.id}</div>
          <div className="fpo-invoice-topbar-actions">
            <button className="fpo-btn fpo-btn-dark">
              <MdFileDownload /> Download (PDF)
            </button>
            <button className="fpo-btn fpo-btn-green">
              <MdShare /> Share to Franchise
            </button>
          </div>
        </div>

        <div className="fpo-card">
          {/* Invoice details + Estimated total */}
          <div className="fpo-invoice-top-grid">
            <div className="fpo-invoice-details">
              <div className="fpo-detail-grid">
                <div className="fpo-field">
                  <label>Proforma No.</label>
                  <input className="fpo-input" readOnly value={`PI-${o.id}`} />
                </div>
                <div className="fpo-field">
                  <label>Proforma Date</label>
                  <div className="fpo-select-wrap">
                    <select
                      className="fpo-select"
                      value={invoiceDate}
                      onChange={(e) => setInvoiceDate(e.target.value)}
                    >
                      <option value="">Select date</option>
                      <option value="01/12/2025">01/12/2025</option>
                      <option value="02/12/2025">02/12/2025</option>
                      <option value="03/12/2025">03/12/2025</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="fpo-detail-grid">
                <div className="fpo-field">
                  <label>PO Number</label>
                  <input className="fpo-input" readOnly value={`PO-${o.id}`} />
                </div>
                <div className="fpo-field">
                  <label>Order Date</label>
                  <input className="fpo-input" readOnly value={o.orderDate} />
                </div>
              </div>
            </div>

            <div className="fpo-estimated-total">
              <h3>Estimated Total</h3>
              <div className="fpo-est-row">
                <span>Subtotal</span>
                <span>{'\u20B91,04,000'}</span>
              </div>
              <div className="fpo-est-row">
                <span>CGST (9%)</span>
                <span>{'\u20B99,360'}</span>
              </div>
              <div className="fpo-est-row">
                <span>SGST (9%)</span>
                <span>{'\u20B99,360'}</span>
              </div>
              <div className="fpo-est-row fpo-est-grand">
                <span>Est. Grand Total</span>
                <span className="fpo-blue-text">{'\u20B91,22,720'}</span>
              </div>
              <p className="fpo-amount-words">
                Rupees One Lakh Twenty Two Thousand Seven Hundred Twenty Only
              </p>
            </div>
          </div>

          {/* Info boxes */}
          <div className="fpo-invoice-info-boxes">
            <div className="fpo-info-box">
              <h4>Franchise Details</h4>
              <p><strong>Franchise Name:</strong> {o.franchiseName}</p>
              <p><strong>Franchise ID:</strong> {o.franchiseId}</p>
              <p><strong>GSTIN:</strong> {o.gstin}</p>
              <p><strong>Billing Address:</strong> {o.billingAddress}</p>
              <p><strong>Shipping Address:</strong> {o.shippingAddress}</p>
            </div>
            <div className="fpo-info-box">
              <h4>Manufacturer Details</h4>
              <p><strong>Company Name:</strong> Matru Krupa Enterprises</p>
              <p><strong>GSTIN:</strong> 24910737901</p>
              <p><strong>PAN:</strong> CPKSC2832920</p>
              <p><strong>Registered Address:</strong> JP Nagar Bengaluru</p>
              <p><strong>Email ID:</strong> Matrukrupa@gmail.com</p>
            </div>
          </div>

          {/* Product Summary table */}
          <h3 className="fpo-section-title">Product Summary</h3>
          <div className="fpo-table-wrap">
            <table className="fpo-table">
              <thead>
                <tr>
                  <th>Sl.No</th>
                  <th>Product Name</th>
                  <th>SKU</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Discount</th>
                  <th>Total</th>
                  <th>Tax Estimated</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>4K LED TV</td>
                  <td>SKU1234</td>
                  <td>6</td>
                  <td>{'\u20B920,000'}</td>
                  <td>5%</td>
                  <td>{'\u20B91,14,000'}</td>
                  <td>{'\u20B918,720'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Proforma Terms */}
          <div className="fpo-invoice-terms-row">
            <div className="fpo-terms-section">
              <h3 className="fpo-section-title">Proforma Terms</h3>
              <ul className="fpo-terms-list">
                <li>No tax liability at this stage</li>
                <li>Amount is an estimate</li>
                <li>Validity until: 9/12/2025</li>
                <li>Final invoice will be generated after dispatch</li>
                <li>Prices subject to change based on stock availability</li>
              </ul>
            </div>
            <div className="fpo-sign-section">
              <div className="fpo-sign-field">
                <label>Created By:</label>
                <div className="fpo-sign-line"></div>
              </div>
              <div className="fpo-sign-field">
                <label>Approved By:</label>
                <div className="fpo-sign-line"></div>
              </div>
            </div>
          </div>

          <div className="fpo-invoice-bottom-actions">
            <button className="fpo-btn fpo-btn-blue">Save Proforma</button>
            <button className="fpo-btn fpo-btn-outline" onClick={() => setView('detail')}>
              Cancel
            </button>
          </div>
        </div>
      </>
    );
  };

  /* ==============================
     MAIN RENDER
     ============================== */
  return (
    <div className="fpo-page">
      {view === 'list' && renderList()}
      {view === 'detail' && renderDetail()}
      {view === 'modify' && renderModify()}
      {view === 'dispatch' && renderDispatch()}
      {view === 'invoice' && renderInvoice()}
    </div>
  );
}
