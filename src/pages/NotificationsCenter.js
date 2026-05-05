import React, { useState } from 'react';
import './NotificationsCenter.css';

const TABS = ['Email Template', 'SMS Template', 'Push Notifications'];

const initialEmailTemplates = [
  { id: 1, name: 'Order Confirmation', category: 'Order', trigger: 'Order Placed', updated: '12/11/2025', status: 'Active' },
  { id: 2, name: 'Failed Payment', category: 'Payment', trigger: 'Payment Failure', updated: '29/10/2025', status: 'Active' },
];

const initialSmsTemplates = [
  { id: 1, name: 'Order Confirmation', content: 'Hi {{customer_name}} your order {{order_id}} has been confirmed.', updated: '12/11/2025', status: 'Active' },
  { id: 2, name: 'Failed Payment', content: 'Payment for order {{order_id}} has Failed. Please try again.', updated: '29/10/2025', status: 'Active' },
];

const initialPushNotifications = [
  { id: 1, name: 'Order Confirmation', trigger: 'Order Placed', audience: 'Customer', updated: '12/11/2025', status: 'Active' },
  { id: 2, name: 'Order Out for delivery', trigger: 'Out for delivery', audience: 'Customer', updated: '29/10/2025', status: 'Active' },
  { id: 3, name: 'Price Drop Alert', trigger: 'Price Drop', audience: 'All Users', updated: '21/10/2025', status: 'Active' },
];

function NotificationsCenter() {
  const [activeTab, setActiveTab] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('All');

  // Email form state
  const [emailForm, setEmailForm] = useState({ name: '', audience: '', category: 'Order', trigger: '', subject: '', body: '' });
  // SMS form state
  const [smsForm, setSmsForm] = useState({ name: '', audience: '', content: '', trigger: '' });
  // Push form state
  const [pushForm, setPushForm] = useState({ name: '', audience: '', message: '', trigger: '' });

  const [emailTemplates] = useState(initialEmailTemplates);
  const [smsTemplates] = useState(initialSmsTemplates);
  const [pushNotifications] = useState(initialPushNotifications);

  const handleOpenForm = () => setShowForm(true);
  const handleCloseForm = () => {
    setShowForm(false);
    setEmailForm({ name: '', audience: '', category: 'Order', trigger: '', subject: '', body: '' });
    setSmsForm({ name: '', audience: '', content: '', trigger: '' });
    setPushForm({ name: '', audience: '', message: '', trigger: '' });
  };

  const handleCreateEmail = (e) => {
    e.preventDefault();
    handleCloseForm();
  };
  const handleCreateSms = (e) => {
    e.preventDefault();
    handleCloseForm();
  };
  const handleCreatePush = (e) => {
    e.preventDefault();
    handleCloseForm();
  };

  const renderStatusBadge = () => (
    <span className="notif-badge-active">Active</span>
  );

  const renderActions = () => (
    <span>
      <button className="notif-action-btn notif-action-edit">Edit</button>
      <button className="notif-action-btn notif-action-delete">Delete</button>
    </span>
  );

  // ---- Email Tab ----
  const renderEmailTab = () => (
    <>
      <div className="notif-toolbar">
        <button className="notif-create-btn" onClick={handleOpenForm}>+ Create New Template</button>
        <select className="notif-filter-dropdown" value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="All">Filter: All</option>
          <option value="Order">Order</option>
          <option value="Payment">Payment</option>
        </select>
      </div>
      <div className="notif-table-card">
        <table className="notif-table">
          <thead>
            <tr>
              <th>Template Name</th>
              <th>Category</th>
              <th>Trigger Event</th>
              <th>Last Updated</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {emailTemplates.map(t => (
              <tr key={t.id}>
                <td>{t.name}</td>
                <td>{t.category}</td>
                <td>{t.trigger}</td>
                <td>{t.updated}</td>
                <td>{renderStatusBadge()}</td>
                <td>{renderActions()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );

  // ---- SMS Tab ----
  const renderSmsTab = () => (
    <>
      <div className="notif-toolbar">
        <button className="notif-create-btn" onClick={handleOpenForm}>+ Create New Template</button>
        <select className="notif-filter-dropdown" value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="All">Filter: All</option>
          <option value="Order">Order</option>
          <option value="Payment">Payment</option>
        </select>
      </div>
      <div className="notif-table-card">
        <table className="notif-table">
          <thead>
            <tr>
              <th>Template Name</th>
              <th>SMS Content</th>
              <th>Last Updated</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {smsTemplates.map(t => (
              <tr key={t.id}>
                <td>{t.name}</td>
                <td><span className="notif-sms-content">{t.content}</span></td>
                <td>{t.updated}</td>
                <td>{renderStatusBadge()}</td>
                <td>{renderActions()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );

  // ---- Push Notifications Tab ----
  const renderPushTab = () => (
    <>
      <div className="notif-toolbar">
        <button className="notif-create-btn" onClick={handleOpenForm}>+ Create New Push Notification</button>
        <select className="notif-filter-dropdown" value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="All">Filter: All</option>
          <option value="Customer">Customer</option>
          <option value="All Users">All Users</option>
        </select>
      </div>
      <div className="notif-table-card">
        <table className="notif-table">
          <thead>
            <tr>
              <th>Notification Name</th>
              <th>Trigger Event</th>
              <th>Audience</th>
              <th>Last Updated</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {pushNotifications.map(t => (
              <tr key={t.id}>
                <td>{t.name}</td>
                <td>{t.trigger}</td>
                <td>{t.audience}</td>
                <td>{t.updated}</td>
                <td>{renderStatusBadge()}</td>
                <td>{renderActions()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );

  // ---- Forms ----
  const renderEmailForm = () => (
    <div className="notif-form-overlay" onClick={handleCloseForm}>
      <div className="notif-form-card" onClick={e => e.stopPropagation()}>
        <h3 className="notif-form-title">Create New Email Template</h3>
        <form onSubmit={handleCreateEmail}>
          <div className="notif-form-row">
            <div className="notif-form-group">
              <label className="notif-form-label">Template Name</label>
              <input className="notif-form-input" type="text" placeholder="Enter template name" value={emailForm.name} onChange={e => setEmailForm({ ...emailForm, name: e.target.value })} />
            </div>
            <div className="notif-form-group">
              <label className="notif-form-label">Target Audience</label>
              <select className="notif-form-select" value={emailForm.audience} onChange={e => setEmailForm({ ...emailForm, audience: e.target.value })}>
                <option value="">Select Audience</option>
                <option value="Customer">Customer</option>
                <option value="All Users">All Users</option>
                <option value="Franchise">Franchise</option>
              </select>
            </div>
          </div>
          <div className="notif-form-row">
            <div className="notif-form-group">
              <label className="notif-form-label">Category</label>
              <input className="notif-form-input" type="text" value={emailForm.category} onChange={e => setEmailForm({ ...emailForm, category: e.target.value })} />
            </div>
            <div className="notif-form-group">
              <label className="notif-form-label">Trigger Event</label>
              <select className="notif-form-select" value={emailForm.trigger} onChange={e => setEmailForm({ ...emailForm, trigger: e.target.value })}>
                <option value="">Select Trigger</option>
                <option value="Order Placed">Order Placed</option>
                <option value="Payment Failure">Payment Failure</option>
                <option value="Order Shipped">Order Shipped</option>
                <option value="Order Delivered">Order Delivered</option>
              </select>
            </div>
          </div>
          <div className="notif-form-row">
            <div className="notif-form-group half">
              <label className="notif-form-label">Subject</label>
              <input className="notif-form-input" type="text" placeholder="Enter email subject" value={emailForm.subject} onChange={e => setEmailForm({ ...emailForm, subject: e.target.value })} />
            </div>
          </div>
          <div className="notif-form-row">
            <div className="notif-form-group full">
              <label className="notif-form-label">Email Body</label>
              <textarea className="notif-form-textarea large" placeholder="Enter email body content..." value={emailForm.body} onChange={e => setEmailForm({ ...emailForm, body: e.target.value })} />
            </div>
          </div>
          <div className="notif-form-actions">
            <button type="button" className="notif-form-cancel" onClick={handleCloseForm}>Cancel</button>
            <button type="submit" className="notif-form-submit">Create</button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderSmsForm = () => (
    <div className="notif-form-overlay" onClick={handleCloseForm}>
      <div className="notif-form-card" onClick={e => e.stopPropagation()}>
        <h3 className="notif-form-title">Create New SMS Template</h3>
        <form onSubmit={handleCreateSms}>
          <div className="notif-form-row">
            <div className="notif-form-group">
              <label className="notif-form-label">Template Name</label>
              <input className="notif-form-input" type="text" placeholder="Enter template name" value={smsForm.name} onChange={e => setSmsForm({ ...smsForm, name: e.target.value })} />
            </div>
            <div className="notif-form-group">
              <label className="notif-form-label">Target Audience</label>
              <select className="notif-form-select" value={smsForm.audience} onChange={e => setSmsForm({ ...smsForm, audience: e.target.value })}>
                <option value="">Select Audience</option>
                <option value="Customer">Customer</option>
                <option value="All Users">All Users</option>
                <option value="Franchise">Franchise</option>
              </select>
            </div>
          </div>
          <div className="notif-form-row">
            <div className="notif-form-group">
              <label className="notif-form-label">SMS Content</label>
              <textarea className="notif-form-textarea medium" placeholder="Enter SMS content..." maxLength={180} value={smsForm.content} onChange={e => setSmsForm({ ...smsForm, content: e.target.value })} />
              <span className="notif-char-counter">{smsForm.content.length}/180</span>
            </div>
            <div className="notif-form-group">
              <label className="notif-form-label">Trigger Event</label>
              <select className="notif-form-select" value={smsForm.trigger} onChange={e => setSmsForm({ ...smsForm, trigger: e.target.value })}>
                <option value="">Select Trigger</option>
                <option value="Order Placed">Order Placed</option>
                <option value="Payment Failure">Payment Failure</option>
                <option value="Order Shipped">Order Shipped</option>
                <option value="Order Delivered">Order Delivered</option>
              </select>
            </div>
          </div>
          <div className="notif-form-actions">
            <button type="button" className="notif-form-cancel" onClick={handleCloseForm}>Cancel</button>
            <button type="submit" className="notif-form-submit">Create</button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderPushForm = () => (
    <div className="notif-form-overlay" onClick={handleCloseForm}>
      <div className="notif-form-card" onClick={e => e.stopPropagation()}>
        <h3 className="notif-form-title">Create New Push Notification</h3>
        <form onSubmit={handleCreatePush}>
          <div className="notif-form-row">
            <div className="notif-form-group">
              <label className="notif-form-label">Notification Name</label>
              <input className="notif-form-input" type="text" placeholder="Enter notification name" value={pushForm.name} onChange={e => setPushForm({ ...pushForm, name: e.target.value })} />
            </div>
            <div className="notif-form-group">
              <label className="notif-form-label">Target Audience</label>
              <select className="notif-form-select" value={pushForm.audience} onChange={e => setPushForm({ ...pushForm, audience: e.target.value })}>
                <option value="">Select Audience</option>
                <option value="Customer">Customer</option>
                <option value="All Users">All Users</option>
                <option value="Franchise">Franchise</option>
              </select>
            </div>
          </div>
          <div className="notif-form-row">
            <div className="notif-form-group">
              <label className="notif-form-label">Message</label>
              <textarea className="notif-form-textarea medium" placeholder="Enter notification message..." maxLength={180} value={pushForm.message} onChange={e => setPushForm({ ...pushForm, message: e.target.value })} />
              <span className="notif-char-counter">{pushForm.message.length}/180</span>
            </div>
            <div className="notif-form-group">
              <label className="notif-form-label">Trigger Event</label>
              <select className="notif-form-select" value={pushForm.trigger} onChange={e => setPushForm({ ...pushForm, trigger: e.target.value })}>
                <option value="">Select Trigger</option>
                <option value="Order Placed">Order Placed</option>
                <option value="Out for delivery">Out for delivery</option>
                <option value="Price Drop">Price Drop</option>
                <option value="Payment Failure">Payment Failure</option>
              </select>
            </div>
          </div>
          <div className="notif-form-actions">
            <button type="button" className="notif-form-cancel" onClick={handleCloseForm}>Cancel</button>
            <button type="submit" className="notif-form-submit">Create</button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="notif-page">
      <div className="notif-header">
        <h1 className="notif-title">Notifications Center</h1>
      </div>

      <div className="notif-tabs">
        {TABS.map((tab, idx) => (
          <button
            key={tab}
            className={`notif-tab${activeTab === idx ? ' active' : ''}`}
            onClick={() => { setActiveTab(idx); setShowForm(false); setFilter('All'); }}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 0 && renderEmailTab()}
      {activeTab === 1 && renderSmsTab()}
      {activeTab === 2 && renderPushTab()}

      {showForm && activeTab === 0 && renderEmailForm()}
      {showForm && activeTab === 1 && renderSmsForm()}
      {showForm && activeTab === 2 && renderPushForm()}
    </div>
  );
}

export default NotificationsCenter;
