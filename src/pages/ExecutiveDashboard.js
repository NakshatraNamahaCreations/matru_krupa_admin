import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { MdHelpOutline, MdSettings } from 'react-icons/md';
import './ExecutiveDashboard.css';

const revenueData = [
  { day: 'Mon', revenue: 1800 },
  { day: 'Tue', revenue: 1600 },
  { day: 'Wed', revenue: 1900 },
  { day: 'Thu', revenue: 2200 },
  { day: 'Fri', revenue: 2500 },
  { day: 'Sat', revenue: 2100 },
  { day: 'Sun', revenue: 2400 },
];

const topSkus = [
  { name: 'SKU #1', value: 95 },
  { name: 'SKU #2', value: 82 },
  { name: 'SKU #3', value: 70 },
  { name: 'SKU #4', value: 55 },
  { name: 'SKU #5', value: 45 },
];

const franchiseData = [
  { rank: 1, name: 'North Branch', revenue: '25000', sales: '5,200' },
  { rank: 2, name: 'West Coast', revenue: '15000', sales: '3200' },
  { rank: 3, name: 'East Region', revenue: '12000', sales: '1200' },
  { rank: 4, name: 'City Central', revenue: '22000', sales: '4100' },
];

const filters = ['Daily', 'Weekly', 'Monthly', 'YoY'];

export default function ExecutiveDashboard() {
  const [activeFilter, setActiveFilter] = useState('Daily');

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
            <span className="stat-label">Revenue</span>
            <span className="stat-value">250</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon sales-icon">📈</div>
          <div className="stat-content">
            <span className="stat-label">Sales</span>
            <span className="stat-value">25000</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon sku-icon">📦</div>
          <div className="stat-content">
            <span className="stat-label">Top SKU's</span>
            <span className="stat-value">32000</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orders-icon">🛒</div>
          <div className="stat-content">
            <span className="stat-label">Orders</span>
            <span className="stat-value">625</span>
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
          <h3 className="chart-title">Revenue</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top SKUs */}
        <div className="chart-card sku-chart">
          <h3 className="chart-title">Top SKUs</h3>
          <div className="sku-list">
            {topSkus.map((sku) => (
              <div key={sku.name} className="sku-row">
                <span className="sku-name">{sku.name}</span>
                <div className="sku-bar-container">
                  <div
                    className="sku-bar"
                    style={{ width: `${sku.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Franchise Ranking */}
      <div className="franchise-section">
        <h3 className="section-title">Franchise ranking</h3>
        <table className="franchise-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Franchise</th>
              <th>Revenue</th>
              <th>Sales</th>
            </tr>
          </thead>
          <tbody>
            {franchiseData.map((row) => (
              <tr key={row.rank}>
                <td>{row.rank}</td>
                <td>{row.name}</td>
                <td>{row.revenue}</td>
                <td>{row.sales}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
