import React, { useState } from 'react';
import './SupportTickets.css';

const ticketsData = [
  {
    id: '#101',
    franchise: 'North Branch',
    product: '4K LED TV',
    sku: 'SKU1234',
    quantity: 10,
    issue: 'Technical Malfunction',
    sla: 'Overdue 3m',
    slaType: 'overdue',
    dueTime: '12:27 PM 2026-03-18',
    value: '\u20B93,60,000',
    price: '\u20B962,000',
  },
  {
    id: '#102',
    franchise: 'West Coast',
    product: 'Electric Kettle',
    sku: 'SKU4678',
    quantity: 20,
    issue: 'Billing Inquiry',
    sla: 'Overdue 9m',
    slaType: 'overdue',
    dueTime: '12:27 PM 2026-03-18',
    value: '\u20B960,000',
    price: '\u20B93,000',
  },
  {
    id: '#103',
    franchise: 'City Central',
    product: 'Front Load Washing Machine',
    sku: 'SKU7976',
    quantity: 30,
    issue: 'Damaged Shipment',
    sla: 'Due in 2m',
    slaType: 'due',
    dueTime: '12:27 PM 2026-03-18',
    value: '\u20B93,10,000',
    price: '\u20B910,333',
  },
];

function SupportTickets() {
  const [view, setView] = useState('list');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [formData, setFormData] = useState({});

  const handleViewDetails = (ticket) => {
    setSelectedTicket(ticket);
    setFormData({
      franchise: ticket.franchise,
      product: ticket.product,
      sku: ticket.sku,
      quantity: ticket.quantity,
      price: ticket.price,
      issue: ticket.issue,
      status: ticket.slaType === 'overdue' ? 'Missed' : 'Open',
      assignTo: '',
      remark: '',
    });
    setView('detail');
  };

  const handleBack = () => {
    setView('list');
    setSelectedTicket(null);
  };

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // ========== DETAIL VIEW ==========
  if (view === 'detail' && selectedTicket) {
    return (
      <div className="support-page">
        <div className="support-detail-card">
          <div className="support-detail-header">
            <h1 className="support-detail-title">Ticket: {selectedTicket.id}</h1>
            <span
              className={`support-detail-sla ${selectedTicket.slaType === 'overdue' ? 'overdue' : 'due'}`}
            >
              {selectedTicket.sla}
            </span>
          </div>

          {/* Franchise Name */}
          <div className="support-form-row">
            <div className="support-form-group full-width">
              <label className="support-form-label">Franchise Name</label>
              <input
                className="support-form-input"
                type="text"
                value={formData.franchise}
                onChange={(e) => handleFormChange('franchise', e.target.value)}
              />
            </div>
          </div>

          {/* Product Name */}
          <div className="support-form-row">
            <div className="support-form-group full-width">
              <label className="support-form-label">Product Name</label>
              <input
                className="support-form-input"
                type="text"
                value={formData.product}
                onChange={(e) => handleFormChange('product', e.target.value)}
              />
            </div>
          </div>

          {/* SKU | Quantity */}
          <div className="support-form-row">
            <div className="support-form-group">
              <label className="support-form-label">SKU</label>
              <input
                className="support-form-input"
                type="text"
                value={formData.sku}
                onChange={(e) => handleFormChange('sku', e.target.value)}
              />
            </div>
            <div className="support-form-group">
              <label className="support-form-label">Quantity</label>
              <input
                className="support-form-input"
                type="text"
                value={formData.quantity}
                onChange={(e) => handleFormChange('quantity', e.target.value)}
              />
            </div>
          </div>

          {/* Price */}
          <div className="support-form-row">
            <div className="support-form-group">
              <label className="support-form-label">Price</label>
              <input
                className="support-form-input"
                type="text"
                value={formData.price}
                onChange={(e) => handleFormChange('price', e.target.value)}
              />
            </div>
          </div>

          {/* Issue */}
          <div className="support-form-row">
            <div className="support-form-group full-width">
              <label className="support-form-label">Issue</label>
              <input
                className="support-form-input"
                type="text"
                value={formData.issue}
                onChange={(e) => handleFormChange('issue', e.target.value)}
              />
            </div>
          </div>

          {/* Attachment */}
          <div className="support-form-row">
            <div className="support-form-group full-width">
              <label className="support-form-label">Attachment</label>
              <div className="support-attachment">
                <div className="support-attachment-thumb">&#128444;</div>
                <span className="support-attachment-name">image1.png</span>
              </div>
            </div>
          </div>

          {/* Status | Assign To */}
          <div className="support-form-row">
            <div className="support-form-group">
              <label className="support-form-label">Status</label>
              <select
                className="support-form-select"
                value={formData.status}
                onChange={(e) => handleFormChange('status', e.target.value)}
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Missed">Missed</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
            <div className="support-form-group">
              <label className="support-form-label">Assign To</label>
              <select
                className="support-form-select"
                value={formData.assignTo}
                onChange={(e) => handleFormChange('assignTo', e.target.value)}
              >
                <option value="">-- Select --</option>
                <option value="Agent A">Agent A</option>
                <option value="Agent B">Agent B</option>
                <option value="Agent C">Agent C</option>
              </select>
            </div>
          </div>

          {/* Remark */}
          <div className="support-form-row">
            <div className="support-form-group full-width">
              <label className="support-form-label">Remark</label>
              <textarea
                className="support-form-textarea"
                value={formData.remark}
                onChange={(e) => handleFormChange('remark', e.target.value)}
                placeholder="Enter remark..."
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="support-detail-actions">
            <button className="support-btn-update">Update Ticket</button>
            <button className="support-btn-close">Close Ticket</button>
            <button className="support-btn-back" onClick={handleBack}>Back</button>
          </div>
        </div>
      </div>
    );
  }

  // ========== LIST VIEW ==========
  return (
    <div className="support-page">
      <div className="support-header">
        <h1 className="support-title">Support &amp; Tickets</h1>
        <select
          className="support-status-dropdown"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">Status</option>
          <option value="All">All</option>
          <option value="overdue">Overdue</option>
          <option value="due">Due</option>
        </select>
      </div>

      <div className="support-table-card">
        <table className="support-table">
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Franchise Name</th>
              <th>Product Name</th>
              <th>SKU</th>
              <th>Quantity</th>
              <th>Issue</th>
              <th>SLA Status</th>
              <th>Due Time</th>
              <th>Value</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {ticketsData
              .filter((t) => statusFilter === 'All' || t.slaType === statusFilter)
              .map((ticket) => (
                <tr key={ticket.id}>
                  <td>{ticket.id}</td>
                  <td>{ticket.franchise}</td>
                  <td>{ticket.product}</td>
                  <td>{ticket.sku}</td>
                  <td>{ticket.quantity}</td>
                  <td>{ticket.issue}</td>
                  <td>
                    <span
                      className={
                        ticket.slaType === 'overdue'
                          ? 'support-sla-overdue'
                          : 'support-sla-due'
                      }
                    >
                      {ticket.sla}
                    </span>
                  </td>
                  <td>{ticket.dueTime}</td>
                  <td>{ticket.value}</td>
                  <td>
                    <button
                      className="support-view-btn"
                      onClick={() => handleViewDetails(ticket)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SupportTickets;
