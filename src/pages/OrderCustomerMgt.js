import React, { useState, useEffect, useCallback } from 'react';
import {
  MdVisibility,
  MdDelete,
  MdArrowBack,
  MdToggleOn,
  MdToggleOff,
  MdRefresh,
} from 'react-icons/md';
import { orderApi } from '../services/api';
import './OrderCustomerMgt.css';

// ==================== DATA ====================

const returnsData = [
  {
    returnId: 'R1234',
    customerName: 'Anjali Sharma',
    date: '27/12/2025',
    reason: 'Defective Item',
    pickupStatus: 'Completed',
    refundAmount: '₹2,000',
    refundStatus: 'Initiated',
    description: '4K LED arrived with a small crack on the screen',
    orderId: '1234',
    productName: '4K LED TV',
    sku: 'SKU2469',
    category: 'Television',
    brand: 'Sony Bravia',
    quantity: 1,
    mobile: '9900990010',
    pickupAddress: '42, JP Nagar, 2nd Phase, Mysore, Karnataka - 570008',
    pickupAgent: 'Ekart',
    pickupAgentStatus: 'Completed',
  },
  {
    returnId: 'R2346',
    customerName: 'Mihira',
    date: '20/12/2025',
    reason: 'Wrong Item',
    pickupStatus: 'Pending',
    refundAmount: '₹1,000',
    refundStatus: 'Pending',
    description: 'Received a different product than what was ordered',
    orderId: '2346',
    productName: 'Electric Kettle',
    sku: 'SKU4424',
    category: 'Kitchen Appliance',
    brand: 'Prestige',
    quantity: 1,
    mobile: '9800980010',
    pickupAddress: '15, Lakshmipuram, Mysore, Karnataka - 570004',
    pickupAgent: 'Delhivery',
    pickupAgentStatus: 'Pending',
  },
  {
    returnId: 'R4679',
    customerName: 'Rashmitha',
    date: '19/11/2025',
    reason: 'Changed Mind',
    pickupStatus: 'Completed',
    refundAmount: '₹1,900',
    refundStatus: 'Completed',
    description: 'Customer decided to go with a different brand',
    orderId: '4679',
    productName: 'Air Conditioner',
    sku: 'SKU7890',
    category: 'Home Appliance',
    brand: 'Daikin',
    quantity: 1,
    mobile: '9101010109',
    pickupAddress: '8, Vijayanagar, Mysore, Karnataka - 570017',
    pickupAgent: 'BlueDart',
    pickupAgentStatus: 'Completed',
  },
];

const rmaData = [
  {
    rmaId: 'RMA1234',
    returnId: 'R2121',
    orderId: '1234',
    customerName: 'Anjali Sharma',
    productName: '4K LED TV',
    createdOn: '27/12/2025',
    rmaStatus: 'In Transit',
    category: 'Television',
    sku: 'SKU2469',
    quantity: 1,
    brand: 'Sony Bravia',
    reason: 'Defective Item',
    qcStatus: 'Pending',
    condition: 'Opened',
    deposition: 'Scrap',
    inventoryImpact: 'Write-off, no stock increase',
  },
  {
    rmaId: 'RMA2346',
    returnId: 'R3131',
    orderId: '2346',
    customerName: 'Mihira',
    productName: 'Electric Kettle',
    createdOn: '20/12/2025',
    rmaStatus: 'QC Pending',
    category: 'Kitchen Appliance',
    sku: 'SKU4424',
    quantity: 1,
    brand: 'Prestige',
    reason: 'Wrong Item',
    qcStatus: 'Pending',
    condition: 'Sealed',
    deposition: 'Restock',
    inventoryImpact: 'Stock increase after QC pass',
  },
  {
    rmaId: 'RMA4679',
    returnId: 'R9191',
    orderId: '4679',
    customerName: 'Rashmitha',
    productName: 'Air Conditioner',
    createdOn: '19/11/2025',
    rmaStatus: 'QC Passed',
    category: 'Home Appliance',
    sku: 'SKU7890',
    quantity: 1,
    brand: 'Daikin',
    reason: 'Changed Mind',
    qcStatus: 'Passed',
    condition: 'Sealed',
    deposition: 'Restock',
    inventoryImpact: 'Stock increased',
  },
];

const customersData = [
  {
    customerName: 'Anjali Sharma',
    mobile: '9900990010',
    email: 'Anjali@gmail.com',
    totalOrders: 10,
    totalSpent: '₹20,000',
    lastOrderDate: '27/12/2025',
    status: 'Active',
    gender: 'Female',
    dob: '19/11/1982',
    age: 32,
    address: 'JP Nagar, Mysore',
    state: 'Karnataka',
    city: 'Mysore',
    memberSince: '19/10/2025',
  },
  {
    customerName: 'Mihira',
    mobile: '9800980010',
    email: 'mihira@gmail.com',
    totalOrders: 3,
    totalSpent: '₹10,000',
    lastOrderDate: '20/12/2025',
    status: 'Blocked',
    gender: 'Female',
    dob: '05/03/1990',
    age: 35,
    address: 'Lakshmipuram, Mysore',
    state: 'Karnataka',
    city: 'Mysore',
    memberSince: '01/11/2025',
  },
  {
    customerName: 'Rashmitha',
    mobile: '9101010109',
    email: 'Rashmitha@gmail.com',
    totalOrders: 7,
    totalSpent: '₹9,000',
    lastOrderDate: '19/11/2025',
    status: 'Active',
    gender: 'Female',
    dob: '22/07/1995',
    age: 30,
    address: 'Vijayanagar, Mysore',
    state: 'Karnataka',
    city: 'Mysore',
    memberSince: '15/09/2025',
  },
];

const customerOrderHistory = [
  {
    orderId: '#1234',
    date: '27/12/2025',
    productName: '4K LED TV',
    sku: 'SKU123',
    paymentMode: 'UPI',
    orderValue: '₹20,000',
    deliveryStatus: 'Delivered',
  },
  {
    orderId: '#2346',
    date: '20/12/2025',
    productName: 'Washing Machine',
    sku: 'SKU424',
    paymentMode: 'COD',
    orderValue: '₹10,000',
    deliveryStatus: 'Returned',
  },
  {
    orderId: '#4679',
    date: '19/11/2025',
    productName: 'Electric Kettle',
    sku: 'SKU628',
    paymentMode: 'Credit Card',
    orderValue: '₹1,900',
    deliveryStatus: 'Delivered',
  },
];

const customerReturnRefundData = [
  {
    returnId: 'R1234',
    orderId: '#1234',
    productName: 'Speakers',
    date: '27/12/2025',
    reason: 'Defective Item',
    pickupStatus: 'Completed',
    refundAmount: '₹2,000',
    refundStatus: 'Refunded',
  },
  {
    returnId: 'R2346',
    orderId: '#2346',
    productName: 'Headphones',
    date: '20/12/2025',
    reason: 'Wrong Item',
    pickupStatus: 'Pending',
    refundAmount: '₹1,000',
    refundStatus: 'Rejected',
  },
  {
    returnId: 'R4679',
    orderId: '#4679',
    productName: 'Air Fryer',
    date: '19/11/2025',
    reason: 'Changed Mind',
    pickupStatus: 'Completed',
    refundAmount: '₹1,900',
    refundStatus: 'Refunded',
  },
];

const customerRMAData = [
  {
    rmaId: 'RMA1234',
    returnId: 'R2121',
    orderId: '1234',
    productName: '4K LED TV',
    createdOn: '27/11/2025',
    issue: 'Screen Flickering',
    technicalNotes: 'Quality Check Passed',
    rmaStatus: 'QC Passed',
  },
  {
    rmaId: 'RMA2346',
    returnId: 'R3131',
    orderId: '2346',
    productName: 'Electric Kettle',
    createdOn: '20/10/2025',
    issue: 'Defective product',
    technicalNotes: 'Customer Damaged',
    rmaStatus: 'Rejected',
  },
  {
    rmaId: 'RMA4679',
    returnId: 'R9191',
    orderId: '4679',
    productName: 'Air Cooler',
    createdOn: '19/09/2025',
    issue: 'Drum Noise',
    technicalNotes: 'Quality Check Passed',
    rmaStatus: 'QC Passed',
  },
];

const customerTicketsData = [
  {
    ticketId: '#101',
    createdOn: '19/10/2025',
    issue: 'HDMI Cable not working',
    productName: '4K LED TV',
    sku: 'SKU4678',
    assignedTo: 'Support Team',
    updatedOn: '08/11/2025',
    status: 'Missed',
  },
  {
    ticketId: '#102',
    createdOn: '09/09/2025',
    issue: 'Damaged Shipment',
    productName: 'Front Load Washing Machine',
    sku: 'SKU7976',
    assignedTo: 'Support Team',
    updatedOn: '14/09/2025',
    status: 'Resolved',
  },
  {
    ticketId: '#103',
    createdOn: '11/03/2025',
    issue: 'Late Delivery',
    productName: 'Microwave Oven',
    sku: 'SKU1678',
    assignedTo: 'Support Team',
    updatedOn: '19/03/2025',
    status: 'Resolved',
  },
];

const customerPaymentsData = [
  {
    txnId: 'TXN224466',
    orderId: '1234',
    date: '27/11/2025',
    paymentMode: 'UPI',
    orderValue: '₹20,000',
    status: 'Success',
  },
  {
    txnId: 'TXN199966',
    orderId: '2346',
    date: '20/10/2025',
    paymentMode: 'UPI',
    orderValue: '₹10,000',
    status: 'Success',
  },
  {
    txnId: 'TXN444466',
    orderId: '4679',
    date: '19/09/2025',
    paymentMode: 'COD',
    orderValue: '₹1,900',
    status: 'Success',
  },
];

// ==================== HELPERS ====================

const badgeClass = (value) => {
  const v = value.toLowerCase();
  if (['paid', 'approved', 'completed', 'delivered', 'active', 'qc passed', 'in stock', 'refunded', 'success', 'resolved'].includes(v))
    return 'ocm-badge ocm-badge-green';
  if (['pending', 'on hold', 'qc pending'].includes(v))
    return 'ocm-badge ocm-badge-orange';
  if (['initiated', 'in transit'].includes(v))
    return 'ocm-badge ocm-badge-blue';
  if (['blocked', 'returned', 'rejected', 'missed'].includes(v))
    return 'ocm-badge ocm-badge-red';
  return 'ocm-badge ocm-badge-blue';
};

// ==================== COMPONENT ====================

function OrderCustomerMgt() {
  const [activeTab, setActiveTab] = useState(0);
  const [view, setView] = useState('list');
  const [selectedItem, setSelectedItem] = useState(null);
  const [customerSubTab, setCustomerSubTab] = useState(0);
  const [pickupAgentStatus, setPickupAgentStatus] = useState('Completed');
  const [resolution, setResolution] = useState('Refund');
  const [refundMethod, setRefundMethod] = useState('UPI');
  const [remark, setRemark] = useState('');
  const [accountStatus, setAccountStatus] = useState('Active');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterValue, setFilterValue] = useState('All');

  // Live orders from backend
  const [liveOrders, setLiveOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const fetchOrders = useCallback(async () => {
    setOrdersLoading(true);
    try {
      const data = await orderApi.getAll({ limit: 50 });
      // Map backend order shape → display shape
      const mapped = (data.orders || []).map((o) => ({
        orderId: `#${o.orderNumber || o._id.toString().slice(-6)}`,
        _id: o._id,
        customerName: o.user?.name || 'Guest',
        date: new Date(o.createdAt).toLocaleDateString('en-IN'),
        paymentMode: o.paymentMethod,
        paymentStatus: o.paymentStatus === 'paid' ? 'Paid' : 'Pending',
        orderValue: `₹${o.totalAmount.toLocaleString('en-IN')}`,
        status: o.orderStatus.charAt(0).toUpperCase() + o.orderStatus.slice(1),
        transactionId: o._id,
        items: o.items || [],
        productName: o.items?.[0]?.name || '-',
        sku: '-',
        category: '-',
        brand: o.items?.[0]?.brand || '-',
        quantity: o.items?.reduce((s, i) => s + i.quantity, 0) || 0,
        stockStatus: 'In Stock',
        mobile: o.user?.phone || '-',
        shippingAddress: o.shippingAddress
          ? `${o.shippingAddress.line1}, ${o.shippingAddress.city}, ${o.shippingAddress.state} - ${o.shippingAddress.pincode}`
          : '-',
      }));
      setLiveOrders(mapped);
    } catch (_) {}
    finally { setOrdersLoading(false); }
  }, []);

  useEffect(() => {
    if (activeTab === 0) fetchOrders();
  }, [activeTab, fetchOrders]);

  const handleStatusUpdate = async (id, orderStatus) => {
    try {
      await orderApi.updateStatus(id, { orderStatus });
      fetchOrders();
    } catch (err) { alert(err.message); }
  };

  const handleTabChange = (idx) => {
    setActiveTab(idx);
    setView('list');
    setSelectedItem(null);
  };

  const handleView = (item) => {
    setSelectedItem(item);
    setView('detail');
    if (item.pickupAgentStatus) setPickupAgentStatus(item.pickupAgentStatus);
    if (item.status) setAccountStatus(item.status);
  };

  const handleBack = () => {
    setView('list');
    setSelectedItem(null);
    setCustomerSubTab(0);
  };

  const tabs = [
    'Order Verification Dashboard',
    'Return & Refund Management',
    'RMA Process Control',
    'Customer 360° View',
  ];

  // ==================== TAB 1: ORDER VERIFICATION ====================

  const renderOrderList = () => (
    <div className="ocm-table-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span style={{ fontSize: 13, color: '#64748b' }}>
          {ordersLoading ? 'Loading orders...' : `${liveOrders.length} orders`}
        </span>
        <button className="ocm-icon-btn" onClick={fetchOrders} title="Refresh" style={{ padding: '6px 12px', display: 'flex', gap: 4, alignItems: 'center' }}>
          <MdRefresh /> Refresh
        </button>
      </div>
      <table className="ocm-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer Name</th>
            <th>Date</th>
            <th>Payment Mode</th>
            <th>Payment Status</th>
            <th>Order Value</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {liveOrders.length === 0 && !ordersLoading && (
            <tr><td colSpan="8" style={{ textAlign: 'center', color: '#94a3b8', padding: 32 }}>No orders found</td></tr>
          )}
          {liveOrders.map((o, i) => (
            <tr key={o._id || i}>
              <td>{o.orderId}</td>
              <td>{o.customerName}</td>
              <td>{o.date}</td>
              <td>{o.paymentMode}</td>
              <td><span className={badgeClass(o.paymentStatus)}>{o.paymentStatus}</span></td>
              <td>{o.orderValue}</td>
              <td>
                <select
                  className={badgeClass(o.status.toLowerCase())}
                  value={o.status.toLowerCase()}
                  onChange={(e) => handleStatusUpdate(o._id, e.target.value)}
                  style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 12 }}
                >
                  {['placed','confirmed','packed','shipped','delivered','cancelled'].map(s => (
                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>
              </td>
              <td>
                <div className="ocm-action-icons">
                  <button className="ocm-icon-btn ocm-icon-view" title="View" onClick={() => handleView(o)}><MdVisibility /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderOrderDetail = () => {
    const o = selectedItem;
    return (
      <>
        <button className="ocm-back-btn" onClick={handleBack}><MdArrowBack /> Back</button>
        <div className="ocm-detail-card">
          <h3 className="ocm-section-heading">Order Details</h3>
          <div className="ocm-detail-grid">
            <div className="ocm-detail-item"><label>Order ID</label><span>{o.orderId.replace('#', '')}</span></div>
            <div className="ocm-detail-item"><label>Date</label><span>{o.date}</span></div>
            <div className="ocm-detail-item"><label>Payment Mode</label><span>{o.paymentMode}</span></div>
            <div className="ocm-detail-item"><label>Order Value</label><span>{o.orderValue}</span></div>
            <div className="ocm-detail-item"><label>Transaction ID</label><span>{o.transactionId}</span></div>
            <div className="ocm-detail-item"><label>Payment Status</label><span>{o.paymentStatus}</span></div>
          </div>
        </div>
        <div className="ocm-detail-card">
          <h3 className="ocm-section-heading">Product Details ({o.items.length} item{o.items.length !== 1 ? 's' : ''})</h3>
          {o.items.length > 0 ? o.items.map((item, idx) => (
            <div key={idx} style={{ marginBottom: idx < o.items.length - 1 ? 16 : 0, paddingBottom: idx < o.items.length - 1 ? 16 : 0, borderBottom: idx < o.items.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
              <div className="ocm-detail-grid">
                <div className="ocm-detail-item"><label>Product Name</label><span>{item.name || '-'}</span></div>
                <div className="ocm-detail-item"><label>Brand</label><span>{item.brand || '-'}</span></div>
                <div className="ocm-detail-item"><label>Quantity</label><span>{item.quantity || 0}</span></div>
                <div className="ocm-detail-item"><label>Price</label><span>₹{(item.price || 0).toLocaleString('en-IN')}</span></div>
              </div>
            </div>
          )) : (
            <div className="ocm-detail-grid">
              <div className="ocm-detail-item"><label>Product Name</label><span>{o.productName}</span></div>
              <div className="ocm-detail-item"><label>Brand</label><span>{o.brand}</span></div>
              <div className="ocm-detail-item"><label>Quantity</label><span>{o.quantity}</span></div>
            </div>
          )}
        </div>
        <div className="ocm-detail-card">
          <h3 className="ocm-section-heading">Customer Details</h3>
          <div className="ocm-detail-grid">
            <div className="ocm-detail-item"><label>Customer Name</label><span>{o.customerName}</span></div>
            <div className="ocm-detail-item"><label>Mobile Number</label><span>{o.mobile}</span></div>
            <div className="ocm-detail-item full-width"><label>Shipping Address</label><span>{o.shippingAddress}</span></div>
          </div>
        </div>
        <div className="ocm-action-btns">
          <button className="ocm-btn ocm-btn-green">Approve</button>
          <button className="ocm-btn ocm-btn-orange">Put on Hold</button>
          <button className="ocm-btn ocm-btn-red">Reject</button>
        </div>
      </>
    );
  };

  // ==================== TAB 2: RETURN & REFUND ====================

  const renderReturnList = () => (
    <div className="ocm-table-card">
      <table className="ocm-table">
        <thead>
          <tr>
            <th>Return ID</th>
            <th>Customer Name</th>
            <th>Date</th>
            <th>Reason</th>
            <th>Pickup Status</th>
            <th>Refund Amount</th>
            <th>Refund Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {returnsData.map((r, i) => (
            <tr key={i}>
              <td>{r.returnId}</td>
              <td>{r.customerName}</td>
              <td>{r.date}</td>
              <td>{r.reason}</td>
              <td><span className={badgeClass(r.pickupStatus)}>{r.pickupStatus}</span></td>
              <td>{r.refundAmount}</td>
              <td><span className={badgeClass(r.refundStatus)}>{r.refundStatus}</span></td>
              <td>
                <div className="ocm-action-icons">
                  <button className="ocm-icon-btn ocm-icon-view" title="View" onClick={() => handleView(r)}><MdVisibility /></button>
                  <button className="ocm-icon-btn ocm-icon-delete" title="Delete"><MdDelete /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderReturnDetail = () => {
    const r = selectedItem;
    return (
      <>
        <button className="ocm-back-btn" onClick={handleBack}><MdArrowBack /> Back</button>
        <div className="ocm-detail-card">
          <h3 className="ocm-section-heading">Return ID: {r.returnId}</h3>
          <div className="ocm-detail-grid">
            <div className="ocm-detail-item"><label>Reason</label><span>{r.reason}</span></div>
            <div className="ocm-detail-item full-width"><label>Description</label><span>{r.description}</span></div>
          </div>
        </div>
        <div className="ocm-detail-card">
          <h3 className="ocm-section-heading">Order Details</h3>
          <div className="ocm-detail-grid">
            <div className="ocm-detail-item"><label>Order ID</label><span>{r.orderId}</span></div>
            <div className="ocm-detail-item"><label>Date</label><span>{r.date}</span></div>
            <div className="ocm-detail-item"><label>Product Name</label><span>{r.productName}</span></div>
            <div className="ocm-detail-item"><label>SKU</label><span>{r.sku}</span></div>
            <div className="ocm-detail-item"><label>Category</label><span>{r.category}</span></div>
            <div className="ocm-detail-item"><label>Brand</label><span>{r.brand}</span></div>
            <div className="ocm-detail-item"><label>Quantity</label><span>{r.quantity}</span></div>
          </div>
        </div>
        <div className="ocm-detail-card">
          <h3 className="ocm-section-heading">Pickup Information</h3>
          <div className="ocm-detail-grid">
            <div className="ocm-detail-item"><label>Customer Name</label><span>{r.customerName}</span></div>
            <div className="ocm-detail-item"><label>Mobile Number</label><span>{r.mobile}</span></div>
            <div className="ocm-detail-item full-width"><label>Pickup Address</label><span>{r.pickupAddress}</span></div>
            <div className="ocm-detail-item"><label>Pickup Agent</label><span>{r.pickupAgent}</span></div>
            <div className="ocm-detail-item">
              <label>Pickup Agent Status</label>
              <select value={pickupAgentStatus} onChange={(e) => setPickupAgentStatus(e.target.value)}>
                <option>Completed</option>
                <option>Pending</option>
                <option>In Transit</option>
              </select>
            </div>
          </div>
        </div>
        <div className="ocm-detail-card">
          <h3 className="ocm-section-heading">Refund Information</h3>
          <div className="ocm-detail-grid">
            <div className="ocm-detail-item">
              <label>Resolution</label>
              <select value={resolution} onChange={(e) => setResolution(e.target.value)}>
                <option>Refund</option>
                <option>Replacement</option>
                <option>Store Credit</option>
              </select>
            </div>
            <div className="ocm-detail-item"><label>Refund Amount</label><span>{r.refundAmount}</span></div>
            <div className="ocm-detail-item">
              <label>Refund Method</label>
              <select value={refundMethod} onChange={(e) => setRefundMethod(e.target.value)}>
                <option>UPI</option>
                <option>Bank Transfer</option>
                <option>Credit Card</option>
                <option>Store Credit</option>
              </select>
            </div>
          </div>
          <div className="ocm-action-btns">
            <button className="ocm-btn ocm-btn-blue">Refund</button>
            <button className="ocm-btn ocm-btn-red">Cancel</button>
          </div>
        </div>
      </>
    );
  };

  // ==================== TAB 3: RMA PROCESS CONTROL ====================

  const renderRMAList = () => (
    <div className="ocm-table-card">
      <table className="ocm-table">
        <thead>
          <tr>
            <th>RMA ID</th>
            <th>Return ID</th>
            <th>Order ID</th>
            <th>Customer Name</th>
            <th>Product Name</th>
            <th>Created On</th>
            <th>RMA Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {rmaData.map((r, i) => (
            <tr key={i}>
              <td>{r.rmaId}</td>
              <td>{r.returnId}</td>
              <td>{r.orderId}</td>
              <td>{r.customerName}</td>
              <td>{r.productName}</td>
              <td>{r.createdOn}</td>
              <td><span className={badgeClass(r.rmaStatus)}>{r.rmaStatus}</span></td>
              <td>
                <div className="ocm-action-icons">
                  <button className="ocm-icon-btn ocm-icon-view" title="View" onClick={() => handleView(r)}><MdVisibility /></button>
                  <button className="ocm-icon-btn ocm-icon-delete" title="Delete"><MdDelete /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderRMADetail = () => {
    const r = selectedItem;
    return (
      <>
        <button className="ocm-back-btn" onClick={handleBack}><MdArrowBack /> Back</button>
        <div className="ocm-detail-card">
          <h3 className="ocm-section-heading">RMA Summary</h3>
          <table className="ocm-summary-table">
            <tbody>
              <tr><td>RMA ID</td><td>{r.rmaId}</td><td>Return ID</td><td>{r.returnId}</td></tr>
              <tr><td>RMA Status</td><td><span className={badgeClass(r.rmaStatus)}>{r.rmaStatus}</span></td><td>Created On</td><td>{r.createdOn}</td></tr>
            </tbody>
          </table>
        </div>
        <div className="ocm-detail-card">
          <h3 className="ocm-section-heading">Order Details</h3>
          <table className="ocm-summary-table">
            <tbody>
              <tr><td>Order ID</td><td>{r.orderId}</td><td>Product Name</td><td>{r.productName}</td></tr>
              <tr><td>Category</td><td>{r.category}</td><td>SKU</td><td>{r.sku}</td></tr>
              <tr><td>Quantity</td><td>{r.quantity}</td><td>Brand</td><td>{r.brand}</td></tr>
              <tr><td>Reason</td><td>{r.reason}</td><td></td><td></td></tr>
            </tbody>
          </table>
        </div>
        <div className="ocm-detail-card">
          <h3 className="ocm-section-heading">Quality Check</h3>
          <table className="ocm-summary-table">
            <tbody>
              <tr><td>QC Status</td><td>{r.qcStatus}</td><td>Condition</td><td>{r.condition}</td></tr>
            </tbody>
          </table>
          <div className="ocm-detail-grid">
            <div className="ocm-detail-item full-width">
              <label>Remark</label>
              <input type="text" value={remark} onChange={(e) => setRemark(e.target.value)} placeholder="Enter remark..." />
            </div>
          </div>
        </div>
        <div className="ocm-detail-card">
          <h3 className="ocm-section-heading">Deposition & Inventory Impact</h3>
          <div className="ocm-detail-grid">
            <div className="ocm-detail-item full-width"><label>Description</label><span>{r.deposition}</span></div>
            <div className="ocm-detail-item full-width"><label>Inventory Impact</label><span>{r.inventoryImpact}</span></div>
            <div className="ocm-detail-item"><label>Resolution Type</label><input type="text" defaultValue="" placeholder="Enter resolution type" /></div>
            <div className="ocm-detail-item"><label>Reference ID</label><input type="text" defaultValue="" placeholder="Enter reference ID" /></div>
          </div>
          <div className="ocm-action-btns">
            <button className="ocm-btn ocm-btn-blue">Update</button>
            <button className="ocm-btn ocm-btn-red">Cancel</button>
          </div>
        </div>
      </>
    );
  };

  // ==================== TAB 4: CUSTOMER 360 ====================

  const renderCustomerList = () => (
    <>
      <div className="ocm-search-bar">
        <input
          className="ocm-search-input"
          type="text"
          placeholder="Search by name, mobile number"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select className="ocm-filter-select" value={filterValue} onChange={(e) => setFilterValue(e.target.value)}>
          <option>All</option>
          <option>Active</option>
          <option>Blocked</option>
        </select>
      </div>
      <div className="ocm-table-card">
        <table className="ocm-table">
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Mobile Number</th>
              <th>Email ID</th>
              <th>Total Orders</th>
              <th>Total Spent</th>
              <th>Last Order Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {customersData
              .filter((c) => {
                const q = searchQuery.toLowerCase();
                const matchSearch = !q || c.customerName.toLowerCase().includes(q) || c.mobile.includes(q);
                const matchFilter = filterValue === 'All' || c.status === filterValue;
                return matchSearch && matchFilter;
              })
              .map((c, i) => (
                <tr key={i}>
                  <td>{c.customerName}</td>
                  <td>{c.mobile}</td>
                  <td>{c.email}</td>
                  <td>{c.totalOrders}</td>
                  <td>{c.totalSpent}</td>
                  <td>{c.lastOrderDate}</td>
                  <td><span className={badgeClass(c.status)}>{c.status}</span></td>
                  <td>
                    <div className="ocm-action-icons">
                      <button className="ocm-icon-btn ocm-icon-view" title="View" onClick={() => handleView(c)}><MdVisibility /></button>
                      <button className="ocm-icon-btn ocm-icon-delete" title="Delete"><MdDelete /></button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );

  const renderCustomerDetail = () => {
    const c = selectedItem;
    const subTabs = [
      'Customer Details',
      'Order History',
      'Return & Refund',
      'RMA Process Control',
      'Tickets & Support',
      'Payments & History',
    ];

    const renderCustomerInfo = () => (
      <>
        <div className="ocm-cards-row">
          <div className="ocm-info-card">
            <h4>Customer Information</h4>
            <div className="ocm-card-row"><span className="ocm-card-label">Full Name</span><span className="ocm-card-value">{c.customerName}</span></div>
            <div className="ocm-card-row"><span className="ocm-card-label">Mobile Number</span><span className="ocm-card-value">{c.mobile}</span></div>
            <div className="ocm-card-row"><span className="ocm-card-label">Email ID</span><span className="ocm-card-value">{c.email}</span></div>
            <div className="ocm-card-row"><span className="ocm-card-label">Gender</span><span className="ocm-card-value">{c.gender}</span></div>
            <div className="ocm-card-row"><span className="ocm-card-label">Date of Birth</span><span className="ocm-card-value">{c.dob}</span></div>
            <div className="ocm-card-row"><span className="ocm-card-label">Age</span><span className="ocm-card-value">{c.age}</span></div>
          </div>
          <div className="ocm-info-card">
            <h4>Location Information</h4>
            <div className="ocm-card-row"><span className="ocm-card-label">Address</span><span className="ocm-card-value">{c.address}</span></div>
            <div className="ocm-card-row"><span className="ocm-card-label">State</span><span className="ocm-card-value">{c.state}</span></div>
            <div className="ocm-card-row"><span className="ocm-card-label">City</span><span className="ocm-card-value">{c.city}</span></div>
          </div>
          <div className="ocm-info-card">
            <h4>Account Status</h4>
            <div className="ocm-card-row">
              <span className="ocm-card-label">Status</span>
              <select className="ocm-filter-select" value={accountStatus} onChange={(e) => setAccountStatus(e.target.value)} style={{ padding: '4px 10px', fontSize: '12px' }}>
                <option>Active</option>
                <option>Blocked</option>
              </select>
            </div>
            <div className="ocm-card-row"><span className="ocm-card-label">Member Since</span><span className="ocm-card-value">{c.memberSince}</span></div>
          </div>
        </div>
        <div className="ocm-save-wrap">
          <button className="ocm-btn ocm-btn-blue">Save</button>
        </div>
      </>
    );

    const renderOrderHistory = () => (
      <div className="ocm-table-card">
        <table className="ocm-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Product Name</th>
              <th>SKU</th>
              <th>Payment Mode</th>
              <th>Order Value</th>
              <th>Delivery Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {customerOrderHistory.map((oh, i) => (
              <tr key={i}>
                <td>{oh.orderId}</td>
                <td>{oh.date}</td>
                <td>{oh.productName}</td>
                <td>{oh.sku}</td>
                <td>{oh.paymentMode}</td>
                <td>{oh.orderValue}</td>
                <td><span className={badgeClass(oh.deliveryStatus)}>{oh.deliveryStatus}</span></td>
                <td>
                  <div className="ocm-action-icons">
                    <button className="ocm-icon-btn ocm-icon-toggle" title="Toggle">
                      {oh.deliveryStatus === 'Delivered' ? <MdToggleOn /> : <MdToggleOff />}
                    </button>
                    <button className="ocm-icon-btn ocm-icon-delete" title="Delete"><MdDelete /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );

    const renderCustomerReturnRefund = () => (
      <div className="ocm-table-card">
        <table className="ocm-table">
          <thead>
            <tr>
              <th>Return ID</th>
              <th>Order ID</th>
              <th>Product Name</th>
              <th>Date</th>
              <th>Reason</th>
              <th>Pickup Status</th>
              <th>Refund Amount</th>
              <th>Refund Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {customerReturnRefundData.map((rr, i) => (
              <tr key={i}>
                <td>{rr.returnId}</td>
                <td>{rr.orderId}</td>
                <td>{rr.productName}</td>
                <td>{rr.date}</td>
                <td>{rr.reason}</td>
                <td><span className={badgeClass(rr.pickupStatus)}>{rr.pickupStatus}</span></td>
                <td>{rr.refundAmount}</td>
                <td><span className={badgeClass(rr.refundStatus)}>{rr.refundStatus}</span></td>
                <td>
                  <div className="ocm-action-icons">
                    <button className="ocm-icon-btn ocm-icon-toggle" title="Toggle">
                      {rr.refundStatus === 'Refunded' ? <MdToggleOn /> : <MdToggleOff />}
                    </button>
                    <button className="ocm-icon-btn ocm-icon-delete" title="Delete"><MdDelete /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );

    const renderCustomerRMA = () => (
      <div className="ocm-table-card">
        <table className="ocm-table">
          <thead>
            <tr>
              <th>RMA ID</th>
              <th>Return ID</th>
              <th>Order ID</th>
              <th>Product Name</th>
              <th>Created on</th>
              <th>Issue</th>
              <th>Technical notes</th>
              <th>RMA Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {customerRMAData.map((rm, i) => (
              <tr key={i}>
                <td>{rm.rmaId}</td>
                <td>{rm.returnId}</td>
                <td>{rm.orderId}</td>
                <td>{rm.productName}</td>
                <td>{rm.createdOn}</td>
                <td>{rm.issue}</td>
                <td>{rm.technicalNotes}</td>
                <td><span className={badgeClass(rm.rmaStatus)}>{rm.rmaStatus}</span></td>
                <td>
                  <div className="ocm-action-icons">
                    <button className="ocm-icon-btn ocm-icon-toggle" title="Toggle">
                      {rm.rmaStatus === 'QC Passed' ? <MdToggleOn /> : <MdToggleOff />}
                    </button>
                    <button className="ocm-icon-btn ocm-icon-delete" title="Delete"><MdDelete /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );

    const renderCustomerTickets = () => (
      <div className="ocm-table-card">
        <table className="ocm-table">
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Created On</th>
              <th>Issue</th>
              <th>Product Name</th>
              <th>SKU</th>
              <th>Assigned To</th>
              <th>Updated On</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {customerTicketsData.map((tk, i) => (
              <tr key={i}>
                <td>{tk.ticketId}</td>
                <td>{tk.createdOn}</td>
                <td>{tk.issue}</td>
                <td>{tk.productName}</td>
                <td>{tk.sku}</td>
                <td>{tk.assignedTo}</td>
                <td>{tk.updatedOn}</td>
                <td><span className={badgeClass(tk.status)}>{tk.status}</span></td>
                <td>
                  <div className="ocm-action-icons">
                    <button className="ocm-icon-btn ocm-icon-toggle" title="Toggle">
                      {tk.status === 'Resolved' ? <MdToggleOn /> : <MdToggleOff />}
                    </button>
                    <button className="ocm-icon-btn ocm-icon-delete" title="Delete"><MdDelete /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );

    const renderCustomerPayments = () => (
      <div className="ocm-table-card">
        <table className="ocm-table">
          <thead>
            <tr>
              <th>TXN ID</th>
              <th>Order ID</th>
              <th>Date</th>
              <th>Payment Mode</th>
              <th>Order Value</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {customerPaymentsData.map((pm, i) => (
              <tr key={i}>
                <td>{pm.txnId}</td>
                <td>{pm.orderId}</td>
                <td>{pm.date}</td>
                <td>{pm.paymentMode}</td>
                <td>{pm.orderValue}</td>
                <td><span className={badgeClass(pm.status)}>{pm.status}</span></td>
                <td>
                  <div className="ocm-action-icons">
                    <button className="ocm-icon-btn ocm-icon-toggle" title="Toggle">
                      {pm.status === 'Success' ? <MdToggleOn /> : <MdToggleOff />}
                    </button>
                    <button className="ocm-icon-btn ocm-icon-delete" title="Delete"><MdDelete /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );

    return (
      <>
        <button className="ocm-back-btn" onClick={handleBack}><MdArrowBack /> Back</button>
        <h3 className="ocm-section-heading" style={{ marginBottom: 16 }}>Customer 360° View</h3>
        <div className="ocm-subtabs">
          {subTabs.map((st, i) => (
            <button
              key={i}
              className={`ocm-subtab${customerSubTab === i ? ' active' : ''}`}
              onClick={() => setCustomerSubTab(i)}
            >
              {st}
            </button>
          ))}
        </div>
        {customerSubTab === 0 && renderCustomerInfo()}
        {customerSubTab === 1 && renderOrderHistory()}
        {customerSubTab === 2 && renderCustomerReturnRefund()}
        {customerSubTab === 3 && renderCustomerRMA()}
        {customerSubTab === 4 && renderCustomerTickets()}
        {customerSubTab === 5 && renderCustomerPayments()}
      </>
    );
  };

  // ==================== RENDER ====================

  const renderContent = () => {
    if (view === 'detail' && selectedItem) {
      if (activeTab === 0) return renderOrderDetail();
      if (activeTab === 1) return renderReturnDetail();
      if (activeTab === 2) return renderRMADetail();
      if (activeTab === 3) return renderCustomerDetail();
    }
    if (activeTab === 0) return renderOrderList();
    if (activeTab === 1) return renderReturnList();
    if (activeTab === 2) return renderRMAList();
    if (activeTab === 3) return renderCustomerList();
    return null;
  };

  return (
    <div className="ocm-page">
      <div className="ocm-header">
        <h1 className="ocm-title">Order & Customer Management</h1>
      </div>
      <div className="ocm-tabs">
        {tabs.map((t, i) => (
          <button
            key={i}
            className={`ocm-tab${activeTab === i ? ' active' : ''}`}
            onClick={() => handleTabChange(i)}
          >
            {t}
          </button>
        ))}
      </div>
      {renderContent()}
    </div>
  );
}

export default OrderCustomerMgt;
