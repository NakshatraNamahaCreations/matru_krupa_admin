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
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

// Sections / items can be tagged with `hideForRoles: [...]` so they
// disappear when one of the listed roles is logged in.
const HIDE_FOR_BOTH = ['District Admin', 'Taluk Admin', 'Promoters'];

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
    hideForRoles: HIDE_FOR_BOTH,
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
    hideForRoles: HIDE_FOR_BOTH,
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
      { label: 'Withdrawal', icon: <MdAccountBalanceWallet />, path: '/withdrawal', hideForRoles: HIDE_FOR_BOTH },
      { label: 'KYC Verification', icon: <MdVerifiedUser />, path: '/kyc-verification', hideForRoles: HIDE_FOR_BOTH },
      // Earnings = super admin's system-wide view; Wallet = each hierarchy user's own view.
      { label: 'Earnings', icon: <MdMonetizationOn />, path: '/earnings', hideForRoles: HIDE_FOR_BOTH },
      { label: 'Wallet', icon: <MdAccountBalanceWallet />, path: '/wallet', showOnlyForRoles: HIDE_FOR_BOTH },
      { label: 'Taluk Admin Power', icon: <MdAccountTree />, path: '/taluk-admin-power', hideForRoles: ['District Admin', 'Promoters'] },
      { label: 'Reports', icon: <MdAssessment />, path: '/commission-reports' },
    ],
  },
  {
    title: 'SETTINGS',
    hideForRoles: HIDE_FOR_BOTH,
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
  const { staff } = useAuth();
  const currentRole = staff?.level || staff?.role || '';
  const isHidden = (entry) => {
    if (Array.isArray(entry?.hideForRoles) && entry.hideForRoles.includes(currentRole)) {
      return true;
    }
    if (Array.isArray(entry?.showOnlyForRoles) && !entry.showOnlyForRoles.includes(currentRole)) {
      return true;
    }
    return false;
  };

  const visibleSections = menuSections
    .filter((section) => !isHidden(section))
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => !isHidden(item)),
    }))
    .filter((section) => section.items.length > 0);

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
  {!collapsed && (
    <div className="sidebar-brand-wrapper">
      <img
        src="/logo_mm.jpeg" // replace with your logo path
        alt="Miracle Minds Logo"
        className="sidebar-logo"
      />
      <span className="sidebar-brand">MIRACLE MIND</span>
    </div>
  )}

  <button
    className="sidebar-toggle"
    onClick={() => setCollapsed(!collapsed)}
  >
    <MdMenu />
  </button>
</div>
      <nav className="sidebar-nav">
        {visibleSections.map((section, si) => (
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
