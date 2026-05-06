import React, { useState, useEffect, useCallback } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { MdHelpOutline, MdSettings } from 'react-icons/md';
import { dashboardApi } from '../services/api';
import './ExecutiveDashboard.css';

const formatINR = (num) => {
  if (!num && num !== 0) return '₹0';
  return '₹' + Number(num).toLocaleString('en-IN');
};

const filters = ['Daily', 'Weekly', 'Monthly', 'YoY'];

export default function ExecutiveDashboard() {
  const [activeFilter, setActiveFilter] = useState('Daily');
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      const [statsRes, chartRes] = await Promise.all([
        dashboardApi.getStats(),
        dashboardApi.getOrdersChart(),
      ]);
      setStats(statsRes);
      setChartData(chartRes);
    } catch (err) {
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  // Compute top products as percentage bars (relative to max)
  const topSkus = stats?.topProducts?.length
    ? (() => {
        const maxCount = Math.max(...stats.topProducts.map((p) => p.count));
        return stats.topProducts.map((p) => ({
          name: p._id,
          count: p.count,
          revenue: p.revenue,
          value: maxCount > 0 ? Math.round((p.count / maxCount) * 100) : 0,
        }));
      })()
    : [];

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <h1 className="dashboard-title">EXECUTIVE DASHBOARD</h1>
        <div className="header-right">
          <button className="header-icon-btn"><MdHelpOutline /></button>
          <button className="header-icon-btn"><MdSettings /></button>
          <div className="user-profile">
            <div className="user-avatar">
              <span>👤</span>
            </div>
            <div className="user-info">
              <span className="user-name">abcdefgh</span>
              <span className="user-role">Superadmin</span>
            </div>
          </div>
        </div>
      </header>

      {/* Stat Cards */}
      <div className="stat-cards">
        <div className="stat-card">
          <div className="stat-icon revenue-icon">💰</div>
          <div className="stat-content">
            <span className="stat-label">Total Revenue</span>
            <span className="stat-value">{loading ? '...' : formatINR(stats?.revenue?.total)}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon sales-icon">📈</div>
          <div className="stat-content">
            <span className="stat-label">This Month</span>
            <span className="stat-value">{loading ? '...' : formatINR(stats?.revenue?.thisMonth)}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon sku-icon">📦</div>
          <div className="stat-content">
            <span className="stat-label">Products</span>
            <span className="stat-value">{loading ? '...' : `${stats?.products?.active || 0} / ${stats?.products?.total || 0}`}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orders-icon">🛒</div>
          <div className="stat-content">
            <span className="stat-label">Orders</span>
            <span className="stat-value">{loading ? '...' : stats?.orders?.total || 0}</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        {/* Revenue Chart */}
        <div className="chart-card revenue-chart">
          <div className="filter-bar">
            <span className="filter-label">Filter</span>
            <div className="filter-buttons">
              {filters.map((f) => (
                <button
                  key={f}
                  className={`filter-btn ${activeFilter === f ? 'active' : ''}`}
                  onClick={() => setActiveFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <h3 className="chart-title">Revenue (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip formatter={(val) => formatINR(val)} />
              <Bar dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top SKUs */}
        <div className="chart-card sku-chart">
          <h3 className="chart-title">Top Products</h3>
          <div className="sku-list">
            {topSkus.length > 0 ? topSkus.map((sku) => (
              <div key={sku.name} className="sku-row">
                <span className="sku-name" title={sku.name}>{sku.name}</span>
                <div className="sku-bar-container">
                  <div
                    className="sku-bar"
                    style={{ width: `${sku.value}%` }}
                  />
                </div>
                <span className="sku-count">{sku.count} sold</span>
              </div>
            )) : (
              <p className="sku-empty">No product data yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders + Quick Stats */}
      <div className="dashboard-bottom-row">
        <div className="franchise-section">
          <h3 className="section-title">Recent Orders</h3>
          <table className="franchise-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentOrders?.length > 0 ? stats.recentOrders.map((order, idx) => (
                <tr key={order._id}>
                  <td>{idx + 1}</td>
                  <td>{order.user?.name || 'Guest'}</td>
                  <td>{formatINR(order.totalAmount)}</td>
                  <td>
                    <span className={`order-status-badge order-status-${(order.orderStatus || '').toLowerCase()}`}>
                      {order.orderStatus || 'N/A'}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', color: '#94a3b8', padding: '24px' }}>
                    No recent orders.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Quick Stats Card */}
        <div className="quick-stats-card">
          <h3 className="section-title">Quick Stats</h3>
          <div className="quick-stats-list">
            <div className="quick-stat-item">
              <span className="quick-stat-label">Total Customers</span>
              <span className="quick-stat-value">{stats?.customers?.total || 0}</span>
            </div>
            <div className="quick-stat-item">
              <span className="quick-stat-label">New This Month</span>
              <span className="quick-stat-value">{stats?.customers?.thisMonth || 0}</span>
            </div>
            <div className="quick-stat-item">
              <span className="quick-stat-label">Categories</span>
              <span className="quick-stat-value">{stats?.categories?.total || 0}</span>
            </div>
            <div className="quick-stat-item">
              <span className="quick-stat-label">Orders This Month</span>
              <span className="quick-stat-value">{stats?.orders?.thisMonth || 0}</span>
            </div>
            <div className="quick-stat-item">
              <span className="quick-stat-label">Pending Orders</span>
              <span className="quick-stat-value pending">{stats?.orders?.pending || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
