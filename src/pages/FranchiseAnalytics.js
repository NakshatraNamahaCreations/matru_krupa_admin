import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import './FranchiseAnalytics.css';

const tabs = ['Sales Reports', 'Stock Movement', 'Profit & Loss', 'Leaderboard & Incentive'];

/* ───── Chart Data ───── */
const salesChartData = [
  { day: 'Mon', Sales: 20000 },
  { day: 'Tue', Sales: 15000 },
  { day: 'Wed', Sales: 18000 },
  { day: 'Thu', Sales: 25000 },
  { day: 'Fri', Sales: 30000 },
  { day: 'Sat', Sales: 22000 },
  { day: 'Sun', Sales: 24000 },
];

const stockChartData = [
  { day: 'Mon', Inbound: 250, Sold: 200 },
  { day: 'Tue', Inbound: 180, Sold: 90 },
  { day: 'Wed', Inbound: 300, Sold: 270 },
  { day: 'Thu', Inbound: 220, Sold: 180 },
  { day: 'Fri', Inbound: 280, Sold: 250 },
  { day: 'Sat', Inbound: 150, Sold: 120 },
  { day: 'Sun', Inbound: 200, Sold: 170 },
];

const profitChartData = [
  { month: 'May 2025', Revenue: 130000, 'Net Profit': 40000 },
  { month: 'Jun 2025', Revenue: 110000, 'Net Profit': 30000 },
  { month: 'Jul 2025', Revenue: 95000, 'Net Profit': 25000 },
  { month: 'Aug 2025', Revenue: 120000, 'Net Profit': 35000 },
  { month: 'Sep 2025', Revenue: 140000, 'Net Profit': 45000 },
  { month: 'Oct 2025', Revenue: 125000, 'Net Profit': 38000 },
];

/* ───── Table Data ───── */
const salesTableData = [
  { date: '01/12/2025', product: '4K LED TV', sku: 'SKU1234', category: 'Television', sales: '25,200' },
  { date: '30/11/2025', product: 'Electric kettle', sku: 'SKU2467', category: 'Appliances', sales: '22,000' },
  { date: '29/11/2025', product: 'Microwave oven', sku: 'SKU2678', category: 'Appliances', sales: '12,200' },
  { date: '28/11/2025', product: 'Double door Refrigerator', sku: 'SKU4678', category: 'Refrigerator', sales: '24,100' },
];

const stockTableData = [
  { sku: 'SKU1234', product: '4K LED TV', billed: 400, sold: 360, damaged: 10, balance: 30 },
  { sku: 'SKU9234', product: 'Electric Kettle', billed: 200, sold: 140, damaged: 20, balance: 40 },
  { sku: 'SKU6734', product: 'Air Conditioner', billed: 300, sold: 200, damaged: 30, balance: 70 },
];

const profitTableData = [
  { month: 'May 2025', revenue: '2,12,000', cogs: '1,10,000', gross: '95,000', expenses: '60,000', net: '36,000' },
  { month: 'June 2025', revenue: '1,08,000', cogs: '2,24,000', gross: '95,000', expenses: '36,000', net: '27,000' },
];

const leaderboardData = [
  { franchise: 'North Branch', revenue: '₹40,000', sales: 860 },
  { franchise: 'West Coast', revenue: '₹48,000', sales: 740 },
  { franchise: 'City Central', revenue: '₹18,000', sales: 410 },
];

const incentiveData = [
  { franchise: 'North Branch', reward: '₹1,12,000', target: '₹1,10,000', period: 'May' },
  { franchise: 'West Coast', reward: '₹80,000', target: '₹60,000', period: 'June' },
  { franchise: 'City Central', reward: '₹60,000', target: '₹40,000', period: 'July' },
];

/* ───── Filter Bar Component ───── */
function FilterBar({ dateDefault }) {
  return (
    <div className="fpa-filter-bar">
      <div className="fpa-filter-group">
        <span className="fpa-filter-label">Select Franchise</span>
        <select className="fpa-filter-select" defaultValue="mysore-south">
          <option value="mysore-south">Mysore South</option>
        </select>
      </div>
      <div className="fpa-filter-group">
        <span className="fpa-filter-label">Select Date</span>
        <select className="fpa-filter-select" defaultValue={dateDefault || '7'}>
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
        </select>
      </div>
      <div className="fpa-filter-group">
        <span className="fpa-filter-label">From</span>
        <input type="date" className="fpa-filter-input" />
      </div>
      <div className="fpa-filter-group">
        <span className="fpa-filter-label">To</span>
        <input type="date" className="fpa-filter-input" />
      </div>
    </div>
  );
}

/* ───── Tab Content Components ───── */
function SalesTab() {
  return (
    <>
      <FilterBar />
      <div className="fpa-chart-card">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={salesChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Sales" fill="#1e40af" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="fpa-table-wrapper">
        <table className="fpa-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Product Name</th>
              <th>SKU</th>
              <th>Category</th>
              <th>Sales</th>
            </tr>
          </thead>
          <tbody>
            {salesTableData.map((row, i) => (
              <tr key={i}>
                <td>{row.date}</td>
                <td>{row.product}</td>
                <td>{row.sku}</td>
                <td>{row.category}</td>
                <td>{row.sales}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function StockTab() {
  return (
    <>
      <FilterBar />
      <div className="fpa-chart-card">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stockChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Inbound" fill="#22c55e" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Sold" fill="#1e40af" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="fpa-table-wrapper">
        <h3 className="fpa-section-title" style={{ padding: '16px 14px 0' }}>Stock Movement</h3>
        <table className="fpa-table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Product Name</th>
              <th>Billed Qty</th>
              <th>Sold Qty</th>
              <th>Damaged Qty</th>
              <th>Balance Stock</th>
            </tr>
          </thead>
          <tbody>
            {stockTableData.map((row, i) => (
              <tr key={i}>
                <td>{row.sku}</td>
                <td>{row.product}</td>
                <td>{row.billed}</td>
                <td>{row.sold}</td>
                <td>{row.damaged}</td>
                <td>{row.balance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function ProfitTab() {
  return (
    <>
      <FilterBar dateDefault="30" />
      <div className="fpa-chart-card">
        <h3 className="fpa-section-title">Revenue &amp; Profit</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={profitChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Revenue" fill="#1e40af" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Net Profit" fill="#60a5fa" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="fpa-table-wrapper">
        <table className="fpa-table">
          <thead>
            <tr>
              <th>Month</th>
              <th>Revenue</th>
              <th>Costs of Goods Sold</th>
              <th>Gross Margin</th>
              <th>Expenses</th>
              <th>Net Profit</th>
            </tr>
          </thead>
          <tbody>
            {profitTableData.map((row, i) => (
              <tr key={i}>
                <td>{row.month}</td>
                <td>{row.revenue}</td>
                <td>{row.cogs}</td>
                <td>{row.gross}</td>
                <td>{row.expenses}</td>
                <td>{row.net}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function LeaderboardTab() {
  return (
    <>
      {/* Stat Cards */}
      <div className="fpa-stat-cards">
        <div className="fpa-stat-card blue">
          <span className="fpa-stat-icon">&#127942;</span>
          <div className="fpa-stat-info">
            <span className="fpa-stat-label">Top Franchise</span>
            <span className="fpa-stat-value">North Branch</span>
          </div>
        </div>
        <div className="fpa-stat-card green">
          <span className="fpa-stat-icon">&#127873;</span>
          <div className="fpa-stat-info">
            <span className="fpa-stat-label">Qualified for Incentive</span>
            <span className="fpa-stat-value"><span className="fpa-stat-badge">3</span></span>
          </div>
        </div>
        <div className="fpa-stat-card red">
          <span className="fpa-stat-icon">&#128176;</span>
          <div className="fpa-stat-info">
            <span className="fpa-stat-label">Total Incentive</span>
            <span className="fpa-stat-value">&#8377;2,40,000</span>
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="fpa-leaderboard-section">
        <div className="fpa-leaderboard-table-wrapper">
          <table className="fpa-leaderboard-table">
            <thead>
              <tr>
                <th className="blue-header">#</th>
                <th className="blue-header">Franchise</th>
                <th className="blue-header">Revenue</th>
                <th className="blue-header">Sales</th>
              </tr>
            </thead>
            <tbody>
              {leaderboardData.map((row, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{row.franchise}</td>
                  <td>{row.revenue}</td>
                  <td>{row.sales}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Incentive Table */}
      <div className="fpa-leaderboard-section">
        <div className="fpa-leaderboard-table-wrapper">
          <table className="fpa-leaderboard-table">
            <thead>
              <tr>
                <th className="green-header">#</th>
                <th className="green-header">Franchise</th>
                <th className="green-header">Reward</th>
                <th className="green-header">Target</th>
                <th className="green-header">Period</th>
              </tr>
            </thead>
            <tbody>
              {incentiveData.map((row, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{row.franchise}</td>
                  <td>{row.reward}</td>
                  <td>{row.target}</td>
                  <td>{row.period}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

/* ───── Main Component ───── */
function FranchiseAnalytics() {
  const [activeTab, setActiveTab] = useState(0);

  const renderTab = () => {
    switch (activeTab) {
      case 0: return <SalesTab />;
      case 1: return <StockTab />;
      case 2: return <ProfitTab />;
      case 3: return <LeaderboardTab />;
      default: return <SalesTab />;
    }
  };

  return (
    <div className="fpa-page">
      <h1 className="fpa-title">Franchise Performance &amp; Analytics</h1>
      <div className="fpa-tabs">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            className={`fpa-tab${activeTab === i ? ' active' : ''}`}
            onClick={() => setActiveTab(i)}
          >
            {tab}
          </button>
        ))}
      </div>
      {renderTab()}
    </div>
  );
}

export default FranchiseAnalytics;
