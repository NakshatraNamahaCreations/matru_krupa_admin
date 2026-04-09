import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  MdDashboard,
  MdInventory,
  MdStorefront,
  MdAccountBalance,
  MdAnalytics,
  MdShoppingCart,
  MdSupportAgent,
  MdWeb,
  MdReceipt,
  MdPayment,

  MdAccountTree,
  MdSettings,
  MdNotifications,
  MdGavel,
  MdAssessment,
  MdGroups,
  MdMonetizationOn,
  MdAccountBalanceWallet,
  MdVerifiedUser,
  MdMenu,
} from 'react-icons/md';
import './Sidebar.css';

const menuSections = [
  {
    items: [
      { label: 'Dashboard', icon: <MdDashboard />, path: '/' },
    ],
  },
  {
    items: [
      { label: 'Product & Data Mgt', icon: <MdInventory />, path: '/products' },
      { label: 'Inventory & Warehouse Control', icon: <MdStorefront />, path: '/inventory' },
      { label: 'Pricing', icon: <MdMonetizationOn />, path: '/pricing' },
    ],
  },
  {
    title: 'FRANCHISE MANAGEMENT',
    items: [
      { label: 'Franchise Module', icon: <MdStorefront />, path: '/franchise' },
      { label: 'Deposit & Allocation Engine', icon: <MdAccountBalance />, path: '/deposits' },
      { label: 'Franc Performance & Analytics', icon: <MdAnalytics />, path: '/franchise-analytics' },
      { label: 'Franc Purchase Order Handling', icon: <MdShoppingCart />, path: '/purchase-orders' },
      { label: 'Support & Tickets', icon: <MdSupportAgent />, path: '/support' },
    ],
  },
  {
    title: 'E-COMMERCE OPERATIONS',
    items: [
      { label: 'Web Ops Mgt', icon: <MdWeb />, path: '/web-ops' },
      { label: 'Order & Customer Mgt', icon: <MdReceipt />, path: '/orders' },
      { label: 'Payments & Reconciliation', icon: <MdPayment />, path: '/payments' },
    ],
  },
  {
    title: 'Commission Module',
    items: [
      { label: 'Overview', icon: <MdAssessment />, path: '/commission-overview' },
      { label: 'Hierarchy Setup', icon: <MdAccountTree />, path: '/hierarchy' },
      { label: 'Commission Engine', icon: <MdSettings />, path: '/commission-engine' },
      { label: 'Withdrawal', icon: <MdAccountBalanceWallet />, path: '/withdrawal' },
      { label: 'KYC Verification', icon: <MdVerifiedUser />, path: '/kyc-verification' },
      { label: 'Earnings', icon: <MdMonetizationOn />, path: '/earnings' },
      { label: 'Taluk Admin Power', icon: <MdAccountTree />, path: '/taluk-admin-power' },
      { label: 'Reports', icon: <MdAssessment />, path: '/commission-reports' },
    ],
  },
  {
    title: 'SETTINGS',
    items: [
      { label: 'Teams', icon: <MdGroups />, path: '/teams' },
      { label: 'Notifications', icon: <MdNotifications />, path: '/notifications' },
      { label: 'Audit & Compliance logs', icon: <MdGavel />, path: '/audit' },
      { label: 'Reports', icon: <MdAssessment />, path: '/reports' },
    ],
  },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        {!collapsed && <span className="sidebar-brand">Matru Krupa</span>}
        <button className="sidebar-toggle" onClick={() => setCollapsed(!collapsed)}>
          <MdMenu />
        </button>
      </div>
      <nav className="sidebar-nav">
        {menuSections.map((section, si) => (
          <div key={si} className="sidebar-section">
            {section.title && !collapsed && (
              <div className="sidebar-section-title">{section.title}</div>
            )}
            {section.items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `sidebar-item ${isActive ? 'active' : ''}`
                }
                title={item.label}
              >
                <span className="sidebar-icon">{item.icon}</span>
                {!collapsed && <span className="sidebar-label">{item.label}</span>}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  );
}
