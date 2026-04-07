import React, { useState } from 'react';
import {
  MdVisibility,
  MdDelete,
  MdFilterList,
  MdClose,
  MdArrowBack,
  MdSearch,
} from 'react-icons/md';
import './PaymentReconciliation.css';

// ==================== DATA ====================

const settlementData = [
  { date: '27/11/2025', gateway: 'Razorpay', settlementId: 'STM1101', settlementAmount: '₹20,000', orderMappedAmount: '₹20,000', difference: '₹0', status: 'Matched' },
  { date: '26/11/2025', gateway: 'PayU', settlementId: 'STM2108', settlementAmount: '₹19,000', orderMappedAmount: '₹17,000', difference: '₹2,000', status: 'MisMatch' },
  { date: '25/11/2025', gateway: 'RazorPay', settlementId: 'STM1901', settlementAmount: '₹39,000', orderMappedAmount: '₹39,000', difference: '₹0', status: 'Matched' },
  { date: '24/11/2025', gateway: 'RazorPay', settlementId: 'STM2207', settlementAmount: '₹29,000', orderMappedAmount: '₹34,000', difference: '₹5,000', status: 'Extra Received' },
];

const discrepancyData = [
  { discrepancyId: 'DISC-101', settlementId: 'STM1101', orderId: '2346', expectedAmount: '₹2,000', receivedAmount: '₹1,200', difference: '-₹1,800', reason: 'Short Payment', status: 'Resolved' },
  { discrepancyId: 'DISC-102', settlementId: 'STM2108', orderId: '2424', expectedAmount: '₹4,000', receivedAmount: '₹2,700', difference: '-₹1,300', reason: 'Short Payment', status: 'Resolved' },
  { discrepancyId: 'DISC-103', settlementId: 'STM1901', orderId: '1962', expectedAmount: '₹9,000', receivedAmount: '₹6,200', difference: '-₹2,800', reason: 'Partial Payment', status: 'Resolved' },
  { discrepancyId: 'DISC-104', settlementId: 'STM2207', orderId: '1982', expectedAmount: '₹6,000', receivedAmount: '₹8,900', difference: '+₹1,900', reason: 'Extra Payment', status: 'Resolved' },
];

const failedDuplicateData = [
  { paymentId: 'PAY1234099', date: '22/11/2025', customerName: 'Anjali Sharma', totalAmount: '₹20,000', paymentMode: 'UPI', gateway: 'Razorpay', status: 'Success', mappingStatus: 'Duplicate', mobile: '9900990010', gatewayRef: 'pay_xy1332789ee019', duplicateCount: 2, orderId: '1234', orderAmount: '₹20,000', orderStatus: 'Delivered' },
  { paymentId: 'PAY994099', date: '21/11/2025', customerName: 'Mihira', totalAmount: '₹10,000', paymentMode: 'Credit Card', gateway: 'Razorpay', status: 'Success', mappingStatus: 'Unmapped', mobile: '9800980010', gatewayRef: 'pay_ab9987654cd321', duplicateCount: 1, orderId: '', orderAmount: '', orderStatus: '' },
  { paymentId: 'PAY240099', date: '20/11/2025', customerName: 'Sumana', totalAmount: '₹9,000', paymentMode: 'UPI', gateway: 'PayU', status: 'Failed', mappingStatus: 'Unmapped', mobile: '9700970010', gatewayRef: 'pay_cd5567890ef456', duplicateCount: 1, orderId: '', orderAmount: '', orderStatus: '' },
  { paymentId: 'PAY877499', date: '19/11/2025', customerName: 'Nischay', totalAmount: '₹26,000', paymentMode: 'UPI', gateway: 'Razorpay', status: 'Success', mappingStatus: 'Mapped', mobile: '9600960010', gatewayRef: 'pay_ef7712345gh789', duplicateCount: 0, orderId: '4567', orderAmount: '₹26,000', orderStatus: 'Delivered' },
];

// ==================== HELPERS ====================

const statusBadge = (status) => {
  const map = {
    'Matched': 'green',
    'MisMatch': 'red',
    'Extra Received': 'orange',
    'Resolved': 'green',
    'Success': 'green',
    'Failed': 'red',
    'Duplicate': 'blue',
    'Unmapped': 'orange',
    'Mapped': 'green',
    'Delivered': 'blue',
  };
  return <span className={`payment-badge ${map[status] || 'blue'}`}>{status}</span>;
};

// ==================== COMPONENT ====================

export default function PaymentReconciliation() {
  const [activeTab, setActiveTab] = useState('settlement');
  const [settlementModal, setSettlementModal] = useState(null);
  const [discrepancyDetail, setDiscrepancyDetail] = useState(null);
  const [failedDetail, setFailedDetail] = useState(null);
  const [searchText, setSearchText] = useState('');

  const tabs = [
    { key: 'settlement', label: 'Settlement Verification' },
    { key: 'discrepancy', label: 'Discrepancy Flagging' },
    { key: 'failed', label: 'Failed/Duplicate Payment Tracking' },
  ];

  // ---- Tab 1: Settlement Verification ----
  const renderSettlementTab = () => (
    <>
      <div className="payment-toolbar">
        <button className="payment-filter-btn"><MdFilterList /> Filter</button>
      </div>
      <div className="payment-table-card">
        <table className="payment-table">
          <thead>
            <tr>
              <th>Settlement Date</th>
              <th>Gateway</th>
              <th>Settlement ID</th>
              <th>Settlement Amount</th>
              <th>Order Mapped Amount</th>
              <th>Difference</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {settlementData.map((row, i) => (
              <tr key={i}>
                <td>{row.date}</td>
                <td>{row.gateway}</td>
                <td>{row.settlementId}</td>
                <td>{row.settlementAmount}</td>
                <td>{row.orderMappedAmount}</td>
                <td>{row.difference}</td>
                <td>{statusBadge(row.status)}</td>
                <td>
                  <button className="payment-action-btn view" title="View" onClick={() => setSettlementModal(row)}><MdVisibility /></button>
                  <button className="payment-action-btn delete" title="Delete"><MdDelete /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Settlement Modal */}
      {settlementModal && (
        <div className="payment-modal-overlay">
          <div className="payment-modal">
            <div className="payment-modal-header">
              <h3>Settlement ID: {settlementModal.settlementId}</h3>
              <button className="payment-modal-close" onClick={() => setSettlementModal(null)}><MdClose /></button>
            </div>
            <div className="payment-modal-body">
              <h4 className="payment-modal-section-title">Order Summary</h4>
              <div className="payment-modal-grid">
                <div className="payment-modal-field">
                  <label>Order ID</label>
                  <span>1234</span>
                </div>
                <div className="payment-modal-field">
                  <label>Amount</label>
                  <span>₹10,000</span>
                </div>
                <div className="payment-modal-field">
                  <label>Customer Name</label>
                  <span>Anjali Sharma</span>
                </div>
                <div className="payment-modal-field">
                  <label>Payment Mode</label>
                  <span>UPI</span>
                </div>
              </div>
              <div className="payment-modal-field">
                <label>Status</label>
                {statusBadge('Delivered')}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );

  // ---- Tab 2: Discrepancy Flagging ----
  const renderDiscrepancyTab = () => {
    if (discrepancyDetail) return renderDiscrepancyDetail();
    return (
      <>
        <div className="payment-toolbar">
          <button className="payment-filter-btn"><MdFilterList /> Filter</button>
        </div>
        <div className="payment-table-card">
          <table className="payment-table">
            <thead>
              <tr>
                <th>Discrepancy ID</th>
                <th>Settlement ID</th>
                <th>Order ID</th>
                <th>Expected Amount</th>
                <th>Received Amount</th>
                <th>Difference</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {discrepancyData.map((row, i) => (
                <tr key={i}>
                  <td>{row.discrepancyId}</td>
                  <td>{row.settlementId}</td>
                  <td>{row.orderId}</td>
                  <td>{row.expectedAmount}</td>
                  <td>{row.receivedAmount}</td>
                  <td>{row.difference}</td>
                  <td>{row.reason}</td>
                  <td>{statusBadge(row.status)}</td>
                  <td>
                    <button className="payment-action-btn view" title="View" onClick={() => setDiscrepancyDetail(row)}><MdVisibility /></button>
                    <button className="payment-action-btn delete" title="Delete"><MdDelete /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  };

  const renderDiscrepancyDetail = () => (
    <div className="payment-detail-view">
      <div className="payment-detail-header">Resolve Summary</div>
      <div className="payment-detail-body">
        {/* Discrepancy Summary */}
        <div className="payment-detail-section">
          <h4 className="payment-detail-section-title">Discrepancy Summary</h4>
          <div className="payment-detail-grid">
            <div className="payment-detail-field">
              <label>Settlement ID</label>
              <span>{discrepancyDetail.settlementId}</span>
            </div>
            <div className="payment-detail-field">
              <label>Order ID</label>
              <span>{discrepancyDetail.orderId}</span>
            </div>
            <div className="payment-detail-field">
              <label>Expected Amount</label>
              <span>{discrepancyDetail.expectedAmount}</span>
            </div>
            <div className="payment-detail-field">
              <label>Received Amount</label>
              <span>{discrepancyDetail.receivedAmount}</span>
            </div>
            <div className="payment-detail-field">
              <label>Gateway</label>
              <span>PayU</span>
            </div>
            <div className="payment-detail-field">
              <label>Settlement Date</label>
              <span>27/11/2025</span>
            </div>
          </div>
        </div>

        {/* Order Information */}
        <div className="payment-detail-section">
          <h4 className="payment-detail-section-title">Order Information</h4>
          <div className="payment-detail-grid">
            <div className="payment-detail-field">
              <label>Customer Name</label>
              <span>Anjali Sharma</span>
            </div>
            <div className="payment-detail-field">
              <label>Payment Mode</label>
              <span>COD</span>
            </div>
            <div className="payment-detail-field">
              <label>Order Status</label>
              <span>Delivered</span>
            </div>
            <div className="payment-detail-field">
              <label>Invoice Value</label>
              <span>₹2,000</span>
            </div>
          </div>
        </div>

        {/* Resolution Reasons */}
        <div className="payment-detail-section">
          <label className="payment-detail-input-label">Resolution Reason</label>
          <input className="payment-detail-input" type="text" defaultValue="Short Settlement (Remaining will come tomorrow)" readOnly />
          <label className="payment-detail-input-label">Resolution Reason</label>
          <input className="payment-detail-input" type="text" defaultValue="Refund of ₹800 was auto-deducted by PayU" readOnly />
        </div>

        <div className="payment-detail-footer">
          <button className="payment-btn blue">Resolve</button>
          <button className="payment-btn red" onClick={() => setDiscrepancyDetail(null)}>Cancel</button>
        </div>
      </div>
    </div>
  );

  // ---- Tab 3: Failed/Duplicate Payment Tracking ----
  const renderFailedTab = () => {
    if (failedDetail) return renderFailedDetail();
    return (
      <>
        <div className="payment-toolbar">
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <MdSearch style={{ position: 'absolute', left: 10, color: '#94a3b8', fontSize: 18 }} />
            <input
              className="payment-search-input"
              style={{ paddingLeft: 34 }}
              type="text"
              placeholder="Search by payment ID, order ID"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
            />
          </div>
          <button className="payment-filter-btn"><MdFilterList /> Filter</button>
        </div>
        <div className="payment-table-card">
          <table className="payment-table">
            <thead>
              <tr>
                <th>Payment ID</th>
                <th>Date</th>
                <th>Customer Name</th>
                <th>Total Amount</th>
                <th>Payment Mode</th>
                <th>Gateway</th>
                <th>Status</th>
                <th>Mapping Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {failedDuplicateData
                .filter(row => {
                  if (!searchText) return true;
                  const s = searchText.toLowerCase();
                  return row.paymentId.toLowerCase().includes(s) || (row.orderId && row.orderId.toLowerCase().includes(s));
                })
                .map((row, i) => (
                  <tr key={i}>
                    <td>{row.paymentId}</td>
                    <td>{row.date}</td>
                    <td>{row.customerName}</td>
                    <td>{row.totalAmount}</td>
                    <td>{row.paymentMode}</td>
                    <td>{row.gateway}</td>
                    <td>{statusBadge(row.status)}</td>
                    <td>{statusBadge(row.mappingStatus)}</td>
                    <td>
                      <button className="payment-action-btn view" title="View" onClick={() => setFailedDetail(row)}><MdVisibility /></button>
                      <button className="payment-action-btn delete" title="Delete"><MdDelete /></button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </>
    );
  };

  const renderFailedDetail = () => {
    const row = failedDetail;
    const ms = row.mappingStatus;

    const sectionTitle = ms === 'Duplicate' ? 'Duplicate Payment' : ms === 'Unmapped' ? 'Unmapped Order' : 'Mapped Order';

    return (
      <div className="payment-detail-view">
        <div className="payment-detail-header">Failed/Duplicate Payment Tracking</div>
        <div className="payment-detail-body">
          {/* Main info section */}
          <div className="payment-detail-section">
            <h4 className="payment-detail-section-title">{sectionTitle}</h4>
            <div className="payment-detail-grid">
              <div className="payment-detail-field">
                <label>Payment ID</label>
                <span>{row.paymentId}</span>
              </div>
              <div className="payment-detail-field">
                <label>Date</label>
                <span>{row.date}</span>
              </div>
              <div className="payment-detail-field">
                <label>Gateway</label>
                <span>{row.gateway}</span>
              </div>
              <div className="payment-detail-field">
                <label>Gateway Reference ID</label>
                <span>{row.gatewayRef}</span>
              </div>
              <div className="payment-detail-field">
                <label>Amount</label>
                <span>{row.totalAmount}</span>
              </div>
              <div className="payment-detail-field">
                <label>Payment Mode</label>
                <span>{row.paymentMode}</span>
              </div>
              <div className="payment-detail-field">
                <label>Status</label>
                <span>{statusBadge(row.status)}</span>
              </div>
              <div className="payment-detail-field">
                <label>Duplicate Count</label>
                <span>{row.duplicateCount}</span>
              </div>
              <div className="payment-detail-field">
                <label>Customer Name</label>
                <span>{row.customerName}</span>
              </div>
              <div className="payment-detail-field">
                <label>Mobile Number</label>
                <span>{row.mobile}</span>
              </div>
            </div>
          </div>

          {/* Linked Order - for Duplicate and Mapped */}
          {(ms === 'Duplicate' || ms === 'Mapped') && (
            <div className="payment-detail-section">
              <h4 className="payment-detail-section-title">Linked Order</h4>
              <div className="payment-detail-grid">
                <div className="payment-detail-field">
                  <label>Order ID</label>
                  <span>{row.orderId}</span>
                </div>
                <div className="payment-detail-field">
                  <label>Amount</label>
                  <span>{row.orderAmount}</span>
                </div>
                <div className="payment-detail-field half">
                  <label>Status</label>
                  <span>{statusBadge(row.orderStatus || 'Delivered')}</span>
                </div>
              </div>
            </div>
          )}

          {/* System Check - for Unmapped and Mapped */}
          {(ms === 'Unmapped' || ms === 'Mapped') && (
            <div className="payment-detail-section">
              <h4 className="payment-detail-section-title">System Check</h4>
              <table className="payment-check-table">
                <thead>
                  <tr>
                    <th>Check</th>
                    <th>Result</th>
                  </tr>
                </thead>
                <tbody>
                  {ms === 'Unmapped' ? (
                    <>
                      <tr><td>Matching Order Found</td><td>No</td></tr>
                      <tr><td>Customer Email/Phone Number Match</td><td>No record</td></tr>
                      <tr><td>SKU</td><td>No order</td></tr>
                    </>
                  ) : (
                    <>
                      <tr><td>Matching Order Found</td><td>Yes</td></tr>
                      <tr><td>Customer Email/Phone Number Match</td><td>Yes</td></tr>
                      <tr><td>SKU Match</td><td>Yes</td></tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Reason / Resolution */}
          {ms === 'Duplicate' && (
            <div className="payment-detail-section">
              <label className="payment-detail-input-label">Reason</label>
              <input className="payment-detail-input" type="text" defaultValue="Two successful payments received for the same customer for the same order" readOnly />
              <label className="payment-detail-input-label">Resolution Reason</label>
              <input className="payment-detail-input" type="text" defaultValue="System marked additional payment as duplicate" readOnly />
            </div>
          )}

          {ms === 'Unmapped' && (
            <div className="payment-detail-section">
              <label className="payment-detail-input-label">Reason</label>
              <input className="payment-detail-input" type="text" defaultValue="Customer completed payment but order failed to generate" readOnly />
            </div>
          )}

          {/* Footer Buttons */}
          <div className="payment-detail-footer">
            {ms === 'Duplicate' && (
              <>
                <button className="payment-btn blue">Refund Duplicate</button>
                <button className="payment-btn red" onClick={() => setFailedDetail(null)}>Cancel</button>
              </>
            )}
            {ms === 'Unmapped' && (
              <>
                <button className="payment-btn blue">Issue Refund</button>
                <button className="payment-btn red" onClick={() => setFailedDetail(null)}>Cancel</button>
              </>
            )}
            {ms === 'Mapped' && (
              <button className="payment-btn blue" onClick={() => setFailedDetail(null)}>Back</button>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ---- Main Render ----
  return (
    <div className="payment-page">
      <div className="payment-header">
        <h1 className="payment-title">
          {discrepancyDetail || failedDetail ? (
            <button
              className="payment-action-btn view"
              style={{ marginRight: 8, fontSize: 20, verticalAlign: 'middle' }}
              onClick={() => { setDiscrepancyDetail(null); setFailedDetail(null); }}
            >
              <MdArrowBack />
            </button>
          ) : null}
          Payment &amp; Reconciliation
        </h1>
      </div>

      {!discrepancyDetail && !failedDetail && (
        <div className="payment-tabs">
          {tabs.map(t => (
            <button
              key={t.key}
              className={`payment-tab${activeTab === t.key ? ' active' : ''}`}
              onClick={() => setActiveTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      {activeTab === 'settlement' && !discrepancyDetail && !failedDetail && renderSettlementTab()}
      {activeTab === 'discrepancy' && renderDiscrepancyTab()}
      {activeTab === 'failed' && renderFailedTab()}
    </div>
  );
}
