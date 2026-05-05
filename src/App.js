import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import LoginPage from './pages/LoginPage';
import ExecutiveDashboard from './pages/ExecutiveDashboard';
import ProductDataMgt from './pages/ProductDataMgt';
import AttributeVariants from './pages/AttributeVariants';
import CategoryManagement from './pages/CategoryManagement';
import InventoryWarehouse from './pages/InventoryWarehouse';
import Pricing from './pages/Pricing';
import FranchiseModule from './pages/FranchiseModule';
import DepositAllocation from './pages/DepositAllocation';
import FranchiseAnalytics from './pages/FranchiseAnalytics';
import SupportTickets from './pages/SupportTickets';
import FranchisePurchaseOrder from './pages/FranchisePurchaseOrder';
import WebOpsMgt from './pages/WebOpsMgt';
import OrderCustomerMgt from './pages/OrderCustomerMgt';
import PaymentReconciliation from './pages/PaymentReconciliation';
import ManageTeams from './pages/ManageTeams';
import NotificationsCenter from './pages/NotificationsCenter';
import AuditLogs from './pages/AuditLogs';
import Reports from './pages/Reports';
import CommissionOverview from './pages/CommissionOverview';
import HierarchySetup from './pages/HierarchySetup';
import CommissionEngine from './pages/CommissionEngine';
import Withdrawal from './pages/Withdrawal';
import KycVerification from './pages/KycVerification';
import Earnings from './pages/Earnings';
import TalukAdminPower from './pages/TalukAdminPower';
import CommissionReports from './pages/CommissionReports';
import './App.css';

function PrivateRoute({ children }) {
  const { isLoggedIn, loading } = useAuth();
  if (loading) return <div className="admin-loading">Loading...</div>;
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return (
    <div className="app-layout">
      <Sidebar />
      {children}
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<PrivateRoute><ExecutiveDashboard /></PrivateRoute>} />
      <Route path="/products" element={<PrivateRoute><ProductDataMgt /></PrivateRoute>} />
      <Route path="/products/attributes" element={<PrivateRoute><AttributeVariants /></PrivateRoute>} />
      <Route path="/products/categories" element={<PrivateRoute><CategoryManagement /></PrivateRoute>} />
      <Route path="/inventory" element={<PrivateRoute><InventoryWarehouse /></PrivateRoute>} />
      <Route path="/pricing" element={<PrivateRoute><Pricing /></PrivateRoute>} />
      <Route path="/franchise" element={<PrivateRoute><FranchiseModule /></PrivateRoute>} />
      <Route path="/deposits" element={<PrivateRoute><DepositAllocation /></PrivateRoute>} />
      <Route path="/franchise-analytics" element={<PrivateRoute><FranchiseAnalytics /></PrivateRoute>} />
      <Route path="/support" element={<PrivateRoute><SupportTickets /></PrivateRoute>} />
      <Route path="/purchase-orders" element={<PrivateRoute><FranchisePurchaseOrder /></PrivateRoute>} />
      <Route path="/web-ops" element={<PrivateRoute><WebOpsMgt /></PrivateRoute>} />
      <Route path="/orders" element={<PrivateRoute><OrderCustomerMgt /></PrivateRoute>} />
      <Route path="/payments" element={<PrivateRoute><PaymentReconciliation /></PrivateRoute>} />
      <Route path="/teams" element={<PrivateRoute><ManageTeams /></PrivateRoute>} />
      <Route path="/notifications" element={<PrivateRoute><NotificationsCenter /></PrivateRoute>} />
      <Route path="/audit" element={<PrivateRoute><AuditLogs /></PrivateRoute>} />
      <Route path="/commission-overview" element={<PrivateRoute><CommissionOverview /></PrivateRoute>} />
      <Route path="/hierarchy" element={<PrivateRoute><HierarchySetup /></PrivateRoute>} />
      <Route path="/commission-engine" element={<PrivateRoute><CommissionEngine /></PrivateRoute>} />
      <Route path="/withdrawal" element={<PrivateRoute><Withdrawal /></PrivateRoute>} />
      <Route path="/kyc-verification" element={<PrivateRoute><KycVerification /></PrivateRoute>} />
      <Route path="/earnings" element={<PrivateRoute><Earnings /></PrivateRoute>} />
      <Route path="/taluk-admin-power" element={<PrivateRoute><TalukAdminPower /></PrivateRoute>} />
      <Route path="/commission-reports" element={<PrivateRoute><CommissionReports /></PrivateRoute>} />
      <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
