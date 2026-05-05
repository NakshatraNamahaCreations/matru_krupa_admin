import React, { useState } from 'react';
import './Reports.css';

// ==================== REPORT TYPE TABS ====================

const reportTypes = [
  'Sales Reports',
  'Inventory Report',
  'Franchise Reports',
  'Profit & Loss Reports',
  'Payment & Settlement Report',
  'Customer Reports',
  'Tax & GST Reports',
  'Order Reports',
];

// ==================== SALES DATA ====================

const salesStats = [
  { label: 'Total Sales', value: '₹12,10,000' },
  { label: 'Total Orders', value: '468' },
  { label: 'Avg Order Value', value: '₹2,718' },
  { label: 'Top Franchise', value: 'West Coast' },
];

const salesTableData = [
  { date: '12/11/2025', franchise: 'City Central', orders: 17, sales: '₹2,10,000', return_: '₹10,000', netSales: '₹2,00,000' },
  { date: '11/11/2025', franchise: 'West Coast', orders: 20, sales: '₹3,12,000', return_: '₹0', netSales: '₹3,12,000' },
  { date: '10/11/2025', franchise: 'North Branch', orders: 14, sales: '₹1,80,000', return_: '₹5,000', netSales: '₹1,75,000' },
];

// ==================== INVENTORY DATA ====================

const inventoryStats = [
  { label: "Total SKU's", value: '8,652' },
  { label: 'Out of Stock', value: '124' },
  { label: 'Low Stock Items', value: '431' },
  { label: 'Slow Moving Prod', value: '307' },
];

const stockSummaryData = [
  { sku: 'SKU1234', name: 'Electric Kettle', opening: 150, closing: 60, sold: 12, value: '₹1,00,000' },
  { sku: 'SKU2469', name: 'Wireless Mouse', opening: 250, closing: 90, sold: 19, value: '₹2,12,000' },
  { sku: 'SKU4678', name: 'Speakers', opening: 350, closing: 170, sold: 29, value: '₹3,19,000' },
];

const stockMovementData = [
  { sku: 'SKU1234', name: 'Electric Kettle', opening: 250, inward: 100, outward: 260, returns: 10, closing: 100 },
  { sku: 'SKU2469', name: 'Wireless Mouse', opening: 320, inward: 200, outward: 100, returns: 20, closing: 440 },
  { sku: 'SKU4678', name: 'Speakers', opening: 200, inward: 50, outward: 100, returns: 10, closing: 160 },
];

// ==================== FRANCHISE DATA ====================

const franchiseStats = [
  { label: 'Total Revenue', value: '₹12,10,000' },
  { label: 'Total Orders', value: '468' },
  { label: 'Avg Order Value', value: '₹2,718' },
];

const franchiseSalesData = [
  { month: 'Dec 2025', franchise: 'City Central', orders: 17, sales: '₹2,10,000', return_: '₹10,000', netSales: '₹2,00,000' },
  { month: 'Nov 2025', franchise: 'West Coast', orders: 20, sales: '₹3,12,000', return_: '₹0', netSales: '₹3,12,000' },
  { month: 'Oct 2025', franchise: 'North Branch', orders: 14, sales: '₹1,80,000', return_: '₹5,000', netSales: '₹1,75,000' },
];

const franchiseOrdersData = [
  { date: '12/11/2025', franchise: 'City Central', orders: 18, cancellation: 1, returns: 0, avgOrderValue: '₹2,750' },
  { date: '11/11/2025', franchise: 'West Coast', orders: 22, cancellation: 0, returns: 2, avgOrderValue: '₹2,650' },
  { date: '10/11/2025', franchise: 'North Branch', orders: 15, cancellation: 1, returns: 1, avgOrderValue: '₹2,900' },
];

const franchiseContributionData = [
  { date: '12/11/2025', franchise: 'City Central', sales: '₹5,05,000', contribution: '38%', rank: 1 },
  { date: '11/11/2025', franchise: 'West Coast', sales: '₹4,70,000', contribution: '32%', rank: 2 },
  { date: '10/11/2025', franchise: 'North Branch', sales: '₹3,60,000', contribution: '27%', rank: 3 },
];

// ==================== P&L DATA ====================

const plStats = [
  { label: 'Total Sales', value: '₹12,50,000' },
  { label: 'Gross Profit', value: '₹6,00,000' },
  { label: 'Total Expenses', value: '₹4,50,000' },
  { label: 'Net Profit', value: '₹1,50,000' },
];

const incomeItems = [
  { label: 'Sales', value: '₹12,50,000' },
  { label: 'Cost of Goods Sold', value: '₹6,50,000' },
  { label: 'Gross Profit', value: '₹6,00,000' },
  { label: 'Net Profit', value: '₹1,50,000' },
];

const expenseItems = [
  { label: 'Rent', value: '₹1,20,000' },
  { label: 'Salaries', value: '₹2,50,000' },
  { label: 'Utility', value: '₹30,000' },
  { label: 'Advertising', value: '₹50,000' },
  { label: 'Total Expenses', value: '₹4,50,000' },
];

// ==================== PAYMENT & SETTLEMENT DATA ====================

const starterKitPaymentData = [
  { franchise: 'City Central', totalFee: '₹5,00,000', starterKitValue: '₹4,50,000', deposit: '₹50,000', date: '12/11/2025', paymentMode: 'UPI', status: 'Paid' },
  { franchise: 'West Coast', totalFee: '₹5,00,000', starterKitValue: '₹4,50,000', deposit: '₹50,000', date: '08/11/2025', paymentMode: 'Bank Transfer', status: 'Paid' },
  { franchise: 'North Branch', totalFee: '₹5,00,000', starterKitValue: '₹4,50,000', deposit: '₹50,000', date: '07/11/2025', paymentMode: 'UPI', status: 'Paid' },
];

const purchaseOrderPaymentData = [
  { poId: 'PO-1023', franchise: 'City Central', invoiceAmount: '₹1,20,000', paidAmount: '₹1,20,000', pending: '₹0', dueDate: '-', status: 'Paid' },
  { poId: 'PO-1022', franchise: 'West Coast', invoiceAmount: '₹80,000', paidAmount: '₹50,000', pending: '₹30,000', dueDate: '10/10/2025', status: 'Pending' },
  { poId: 'PO-1021', franchise: 'North Branch', invoiceAmount: '₹1,50,000', paidAmount: '₹1,50,000', pending: '₹0', dueDate: '-', status: 'Paid' },
];

// ==================== CUSTOMER REPORTS DATA ====================

const customerReportsData = [
  { name: 'Anjali Sharma', mobile: '9900990010', totalOrders: 8, totalSpend: '₹10,000', avgOrderValue: '₹1,550', lastOrderDate: '18/10/2025', status: 'Active' },
  { name: 'Mihira', mobile: '9876543210', totalOrders: 4, totalSpend: '₹9,000', avgOrderValue: '₹2,000', lastOrderDate: '16/10/2025', status: 'Active' },
  { name: 'Nyra', mobile: '9234567801', totalOrders: 10, totalSpend: '₹12,000', avgOrderValue: '₹3,000', lastOrderDate: '14/10/2025', status: 'Active' },
];

// ==================== TAX & GST REPORTS DATA ====================

const taxGstReportsData = [
  { invoiceNo: 'INV-1023', date: '12/09/2025', type: 'Customer', customerFranchise: 'Rahul', taxableValue: '₹10,000', gstAmount: '₹1,800', total: '₹11,800' },
  { invoiceNo: 'PO-1124', date: '10/09/2025', type: 'Franchise PO', customerFranchise: 'North Branch', taxableValue: '₹1,21,000', gstAmount: '₹21,000', total: '₹1,42,000' },
  { invoiceNo: 'INV-1024', date: '09/09/2025', type: 'Customer', customerFranchise: 'Meenal', taxableValue: '₹7,000', gstAmount: '₹1,300', total: '₹8,300' },
];

// ==================== ORDER REPORTS DATA ====================

const orderReportsData = [
  { orderId: 'ORD-7892', date: '12/09/2025', type: 'Customer', customerFranchise: 'Rahul', orderValue: '₹10,000', paymentMode: 'UPI', status: 'Delivered' },
  { orderId: 'ORD-7893', date: '11/09/2025', type: 'Franchise', customerFranchise: 'North Branch', orderValue: '₹1,21,000', paymentMode: 'Credit Card', status: 'Pending' },
  { orderId: 'ORD-7894', date: '10/09/2025', type: 'Customer', customerFranchise: 'Meenal', orderValue: '₹7,000', paymentMode: 'UPI', status: 'Cancelled' },
];

// ==================== COMPONENT ====================

function Reports() {
  const [activeReport, setActiveReport] = useState('Sales Reports');
  const [inventorySubTab, setInventorySubTab] = useState('Stock Summary');
  const [franchiseSubTab, setFranchiseSubTab] = useState('Sales');
  const [paymentSubTab, setPaymentSubTab] = useState('Starter Kit Payment');

  // Filters (display only)
  const [salesFranchise, setSalesFranchise] = useState('Mysore South');
  const [salesDate, setSalesDate] = useState('Last 30 days');
  const [salesFrom, setSalesFrom] = useState('');
  const [salesTo, setSalesTo] = useState('');

  const [invSearch, setInvSearch] = useState('');
  const [invDate, setInvDate] = useState('Last 30 days');
  const [invFrom, setInvFrom] = useState('');
  const [invTo, setInvTo] = useState('');

  const [frFranchise, setFrFranchise] = useState('All');
  const [frRange, setFrRange] = useState('Monthly');
  const [frFrom, setFrFrom] = useState('');
  const [frTo, setFrTo] = useState('');

  const [plFranchise, setPlFranchise] = useState('Mysore South');
  const [plRange, setPlRange] = useState('Last 7 days');
  const [plFrom, setPlFrom] = useState('');
  const [plTo, setPlTo] = useState('');

  // Payment & Settlement filters
  const [payFranchise, setPayFranchise] = useState('All');
  const [payRange, setPayRange] = useState('Last 7 days');
  const [payFrom, setPayFrom] = useState('');
  const [payTo, setPayTo] = useState('');
  const [payStatus, setPayStatus] = useState('Paid');

  // Customer Reports filters
  const [custRange, setCustRange] = useState('Last 7 days');
  const [custFrom, setCustFrom] = useState('');
  const [custTo, setCustTo] = useState('');
  const [custLocation, setCustLocation] = useState('All');
  const [custStatus, setCustStatus] = useState('All');

  // Tax & GST Reports filters
  const [taxRange, setTaxRange] = useState('Last 7 days');
  const [taxFrom, setTaxFrom] = useState('');
  const [taxTo, setTaxTo] = useState('');
  const [taxChannel, setTaxChannel] = useState('All');
  const [taxInvoiceType, setTaxInvoiceType] = useState('All');

  // Order Reports filters
  const [orderRange, setOrderRange] = useState('Last 7 days');
  const [orderFrom, setOrderFrom] = useState('');
  const [orderTo, setOrderTo] = useState('');
  const [orderChannel, setOrderChannel] = useState('All');
  const [orderStatus, setOrderStatus] = useState('All');

  const handleDownload = () => {
    alert('Downloading report...');
  };

  // ==================== STAT CARDS ====================

  const renderStatCards = (stats) => (
    <div className="reports-stat-cards">
      {stats.map((s, i) => (
        <div className="reports-stat-card" key={i}>
          <div className="reports-stat-label">{s.label}</div>
          <div className="reports-stat-value">{s.value}</div>
        </div>
      ))}
    </div>
  );

  // ==================== SALES REPORTS ====================

  const renderSalesReports = () => (
    <div className="reports-section">
      <div className="reports-filter-bar">
        <select className="reports-dropdown" value={salesFranchise} onChange={(e) => setSalesFranchise(e.target.value)}>
          <option>Mysore South</option>
          <option>City Central</option>
          <option>West Coast</option>
          <option>North Branch</option>
        </select>
        <select className="reports-dropdown" value={salesDate} onChange={(e) => setSalesDate(e.target.value)}>
          <option>Last 30 days</option>
          <option>Last 7 days</option>
          <option>Last 90 days</option>
        </select>
        <input type="date" className="reports-date-input" value={salesFrom} onChange={(e) => setSalesFrom(e.target.value)} placeholder="From" />
        <input type="date" className="reports-date-input" value={salesTo} onChange={(e) => setSalesTo(e.target.value)} placeholder="To" />
      </div>

      {renderStatCards(salesStats)}

      <div className="reports-table-wrapper">
        <table className="reports-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Franchise</th>
              <th>Orders</th>
              <th>Sales</th>
              <th>Return</th>
              <th>Net Sales</th>
            </tr>
          </thead>
          <tbody>
            {salesTableData.map((row, idx) => (
              <tr key={idx}>
                <td>{row.date}</td>
                <td>{row.franchise}</td>
                <td>{row.orders}</td>
                <td>{row.sales}</td>
                <td>{row.return_}</td>
                <td>{row.netSales}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // ==================== INVENTORY REPORT ====================

  const renderInventoryReport = () => (
    <div className="reports-section">
      <div className="reports-filter-bar">
        <input
          type="text"
          className="reports-search-input"
          placeholder="Search by SKU"
          value={invSearch}
          onChange={(e) => setInvSearch(e.target.value)}
        />
        <select className="reports-dropdown" value={invDate} onChange={(e) => setInvDate(e.target.value)}>
          <option>Last 30 days</option>
          <option>Last 7 days</option>
          <option>Last 90 days</option>
        </select>
        <input type="date" className="reports-date-input" value={invFrom} onChange={(e) => setInvFrom(e.target.value)} />
        <input type="date" className="reports-date-input" value={invTo} onChange={(e) => setInvTo(e.target.value)} />
      </div>

      {renderStatCards(inventoryStats)}

      <div className="reports-sub-tabs">
        {['Stock Summary', 'Stock Movement'].map((tab) => (
          <button
            key={tab}
            className={`reports-sub-tab ${inventorySubTab === tab ? 'active' : ''}`}
            onClick={() => setInventorySubTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {inventorySubTab === 'Stock Summary' ? (
        <div className="reports-table-wrapper">
          <table className="reports-table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Product Name</th>
                <th>Opening Stock</th>
                <th>Closing Stock</th>
                <th>Sold Qty</th>
                <th>Stock Value</th>
              </tr>
            </thead>
            <tbody>
              {stockSummaryData.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.sku}</td>
                  <td>{row.name}</td>
                  <td>{row.opening}</td>
                  <td>{row.closing}</td>
                  <td>{row.sold}</td>
                  <td>{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="reports-table-wrapper">
          <table className="reports-table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Product Name</th>
                <th>Opening Stock</th>
                <th>Inward Stock</th>
                <th>Outward Stock</th>
                <th>Returns</th>
                <th>Closing Stock</th>
              </tr>
            </thead>
            <tbody>
              {stockMovementData.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.sku}</td>
                  <td>{row.name}</td>
                  <td>{row.opening}</td>
                  <td>{row.inward}</td>
                  <td>{row.outward}</td>
                  <td>{row.returns}</td>
                  <td>{row.closing}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  // ==================== FRANCHISE REPORTS ====================

  const renderFranchiseReports = () => (
    <div className="reports-section">
      <div className="reports-filter-bar">
        <select className="reports-dropdown" value={frFranchise} onChange={(e) => setFrFranchise(e.target.value)}>
          <option>All</option>
          <option>City Central</option>
          <option>West Coast</option>
          <option>North Branch</option>
        </select>
        <select className="reports-dropdown" value={frRange} onChange={(e) => setFrRange(e.target.value)}>
          <option>Monthly</option>
          <option>Last 7 days</option>
          <option>Last 30 days</option>
        </select>
        <input type="date" className="reports-date-input" value={frFrom} onChange={(e) => setFrFrom(e.target.value)} />
        <input type="date" className="reports-date-input" value={frTo} onChange={(e) => setFrTo(e.target.value)} />
      </div>

      {renderStatCards(franchiseStats)}

      <div className="reports-sub-tabs">
        {['Sales', 'Orders', 'Contribution'].map((tab) => (
          <button
            key={tab}
            className={`reports-sub-tab ${franchiseSubTab === tab ? 'active' : ''}`}
            onClick={() => setFranchiseSubTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {franchiseSubTab === 'Sales' && (
        <div className="reports-table-wrapper">
          <table className="reports-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Franchise</th>
                <th>Orders</th>
                <th>Sales</th>
                <th>Return</th>
                <th>Net Sales</th>
              </tr>
            </thead>
            <tbody>
              {franchiseSalesData.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.month}</td>
                  <td>{row.franchise}</td>
                  <td>{row.orders}</td>
                  <td>{row.sales}</td>
                  <td>{row.return_}</td>
                  <td>{row.netSales}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {franchiseSubTab === 'Orders' && (
        <div className="reports-table-wrapper">
          <table className="reports-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Franchise</th>
                <th>Orders</th>
                <th>Cancellation</th>
                <th>Returns</th>
                <th>Avg Order Value</th>
              </tr>
            </thead>
            <tbody>
              {franchiseOrdersData.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.date}</td>
                  <td>{row.franchise}</td>
                  <td>{row.orders}</td>
                  <td>{row.cancellation}</td>
                  <td>{row.returns}</td>
                  <td>{row.avgOrderValue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {franchiseSubTab === 'Contribution' && (
        <div className="reports-table-wrapper">
          <table className="reports-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Franchise</th>
                <th>Sales</th>
                <th>Contribution</th>
                <th>Rank</th>
              </tr>
            </thead>
            <tbody>
              {franchiseContributionData.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.date}</td>
                  <td>{row.franchise}</td>
                  <td>{row.sales}</td>
                  <td>{row.contribution}</td>
                  <td>{row.rank}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  // ==================== PROFIT & LOSS REPORTS ====================

  const renderProfitLossReports = () => (
    <div className="reports-section">
      <div className="reports-filter-bar">
        <select className="reports-dropdown" value={plFranchise} onChange={(e) => setPlFranchise(e.target.value)}>
          <option>Mysore South</option>
          <option>City Central</option>
          <option>West Coast</option>
          <option>North Branch</option>
        </select>
        <select className="reports-dropdown" value={plRange} onChange={(e) => setPlRange(e.target.value)}>
          <option>Last 7 days</option>
          <option>Last 30 days</option>
          <option>Monthly</option>
        </select>
        <input type="date" className="reports-date-input" value={plFrom} onChange={(e) => setPlFrom(e.target.value)} />
        <input type="date" className="reports-date-input" value={plTo} onChange={(e) => setPlTo(e.target.value)} />
      </div>

      {renderStatCards(plStats)}

      <div className="reports-pl-statement">
        <div className="reports-pl-header">Profit &amp; Loss Statement</div>
        <div className="reports-pl-body">
          <div className="reports-pl-column">
            <h3 className="reports-pl-column-title">Income</h3>
            {incomeItems.map((item, idx) => (
              <div className="reports-pl-row" key={idx}>
                <span className="reports-pl-label">{item.label}</span>
                <span className="reports-pl-value">{item.value}</span>
              </div>
            ))}
          </div>
          <div className="reports-pl-divider"></div>
          <div className="reports-pl-column">
            <h3 className="reports-pl-column-title">Expenses</h3>
            {expenseItems.map((item, idx) => (
              <div className="reports-pl-row" key={idx}>
                <span className="reports-pl-label">{item.label}</span>
                <span className="reports-pl-value">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // ==================== PAYMENT & SETTLEMENT REPORT ====================

  const getStatusClass = (status) => {
    switch (status) {
      case 'Paid': case 'Active': case 'Delivered': return 'reports-status-green';
      case 'Pending': return 'reports-status-orange';
      case 'Cancelled': return 'reports-status-red';
      default: return '';
    }
  };

  const renderPaymentSettlementReport = () => (
    <div className="reports-section">
      <div className="reports-filter-bar">
        <select className="reports-dropdown" value={payFranchise} onChange={(e) => setPayFranchise(e.target.value)}>
          <option>All</option>
          <option>City Central</option>
          <option>West Coast</option>
          <option>North Branch</option>
        </select>
        <select className="reports-dropdown" value={payRange} onChange={(e) => setPayRange(e.target.value)}>
          <option>Last 7 days</option>
          <option>Last 30 days</option>
          <option>Last 90 days</option>
        </select>
        <input type="date" className="reports-date-input" value={payFrom} onChange={(e) => setPayFrom(e.target.value)} placeholder="From" />
        <input type="date" className="reports-date-input" value={payTo} onChange={(e) => setPayTo(e.target.value)} placeholder="To" />
        <select className="reports-dropdown" value={payStatus} onChange={(e) => setPayStatus(e.target.value)}>
          <option>Paid</option>
          <option>Pending</option>
          <option>All</option>
        </select>
      </div>

      <div className="reports-sub-tabs">
        {['Starter Kit Payment', 'Purchase Order Payment'].map((tab) => (
          <button
            key={tab}
            className={`reports-sub-tab ${paymentSubTab === tab ? 'active' : ''}`}
            onClick={() => setPaymentSubTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {paymentSubTab === 'Starter Kit Payment' ? (
        <div className="reports-table-wrapper">
          <table className="reports-table">
            <thead>
              <tr>
                <th>Franchise</th>
                <th>Total Fee</th>
                <th>Starter kit value</th>
                <th>Deposit</th>
                <th>Date</th>
                <th>Payment Mode</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {starterKitPaymentData.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.franchise}</td>
                  <td>{row.totalFee}</td>
                  <td>{row.starterKitValue}</td>
                  <td>{row.deposit}</td>
                  <td>{row.date}</td>
                  <td>{row.paymentMode}</td>
                  <td><span className={getStatusClass(row.status)}>{row.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="reports-table-wrapper">
          <table className="reports-table">
            <thead>
              <tr>
                <th>PO ID</th>
                <th>Franchise</th>
                <th>Invoice Amount</th>
                <th>Paid Amount</th>
                <th>Pending</th>
                <th>Due Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {purchaseOrderPaymentData.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.poId}</td>
                  <td>{row.franchise}</td>
                  <td>{row.invoiceAmount}</td>
                  <td>{row.paidAmount}</td>
                  <td>{row.pending}</td>
                  <td>{row.dueDate}</td>
                  <td><span className={getStatusClass(row.status)}>{row.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  // ==================== CUSTOMER REPORTS ====================

  const renderCustomerReports = () => (
    <div className="reports-section">
      <div className="reports-filter-bar">
        <select className="reports-dropdown" value={custRange} onChange={(e) => setCustRange(e.target.value)}>
          <option>Last 7 days</option>
          <option>Last 30 days</option>
          <option>Last 90 days</option>
        </select>
        <input type="date" className="reports-date-input" value={custFrom} onChange={(e) => setCustFrom(e.target.value)} placeholder="From" />
        <input type="date" className="reports-date-input" value={custTo} onChange={(e) => setCustTo(e.target.value)} placeholder="To" />
        <select className="reports-dropdown" value={custLocation} onChange={(e) => setCustLocation(e.target.value)}>
          <option>All</option>
          <option>City Central</option>
          <option>West Coast</option>
          <option>North Branch</option>
        </select>
        <select className="reports-dropdown" value={custStatus} onChange={(e) => setCustStatus(e.target.value)}>
          <option>All</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>
      </div>

      <div className="reports-table-wrapper">
        <table className="reports-table">
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Mobile Number</th>
              <th>Total Orders</th>
              <th>Total Spend</th>
              <th>Avg Order Value</th>
              <th>Last Order Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {customerReportsData.map((row, idx) => (
              <tr key={idx}>
                <td>{row.name}</td>
                <td>{row.mobile}</td>
                <td>{row.totalOrders}</td>
                <td>{row.totalSpend}</td>
                <td>{row.avgOrderValue}</td>
                <td>{row.lastOrderDate}</td>
                <td><span className={getStatusClass(row.status)}>{row.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // ==================== TAX & GST REPORTS ====================

  const renderTaxGstReports = () => (
    <div className="reports-section">
      <div className="reports-filter-bar">
        <select className="reports-dropdown" value={taxRange} onChange={(e) => setTaxRange(e.target.value)}>
          <option>Last 7 days</option>
          <option>Last 30 days</option>
          <option>Last 90 days</option>
        </select>
        <input type="date" className="reports-date-input" value={taxFrom} onChange={(e) => setTaxFrom(e.target.value)} placeholder="From" />
        <input type="date" className="reports-date-input" value={taxTo} onChange={(e) => setTaxTo(e.target.value)} placeholder="To" />
        <select className="reports-dropdown" value={taxChannel} onChange={(e) => setTaxChannel(e.target.value)}>
          <option>All</option>
          <option>Online</option>
          <option>Offline</option>
        </select>
        <select className="reports-dropdown" value={taxInvoiceType} onChange={(e) => setTaxInvoiceType(e.target.value)}>
          <option>All</option>
          <option>Customer</option>
          <option>Franchise PO</option>
        </select>
      </div>

      <div className="reports-table-wrapper">
        <table className="reports-table">
          <thead>
            <tr>
              <th>Invoice No</th>
              <th>Date</th>
              <th>Type</th>
              <th>Customer/Franchise</th>
              <th>Taxable Value</th>
              <th>GST Amount</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {taxGstReportsData.map((row, idx) => (
              <tr key={idx}>
                <td>{row.invoiceNo}</td>
                <td>{row.date}</td>
                <td>{row.type}</td>
                <td>{row.customerFranchise}</td>
                <td>{row.taxableValue}</td>
                <td>{row.gstAmount}</td>
                <td>{row.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // ==================== ORDER REPORTS ====================

  const renderOrderReports = () => (
    <div className="reports-section">
      <div className="reports-filter-bar">
        <select className="reports-dropdown" value={orderRange} onChange={(e) => setOrderRange(e.target.value)}>
          <option>Last 7 days</option>
          <option>Last 30 days</option>
          <option>Last 90 days</option>
        </select>
        <input type="date" className="reports-date-input" value={orderFrom} onChange={(e) => setOrderFrom(e.target.value)} placeholder="From" />
        <input type="date" className="reports-date-input" value={orderTo} onChange={(e) => setOrderTo(e.target.value)} placeholder="To" />
        <select className="reports-dropdown" value={orderChannel} onChange={(e) => setOrderChannel(e.target.value)}>
          <option>All</option>
          <option>Online</option>
          <option>Offline</option>
        </select>
        <select className="reports-dropdown" value={orderStatus} onChange={(e) => setOrderStatus(e.target.value)}>
          <option>All</option>
          <option>Delivered</option>
          <option>Pending</option>
          <option>Cancelled</option>
        </select>
      </div>

      <div className="reports-table-wrapper">
        <table className="reports-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Type</th>
              <th>Customer/Franchise</th>
              <th>Order Value</th>
              <th>Payment Mode</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orderReportsData.map((row, idx) => (
              <tr key={idx}>
                <td>{row.orderId}</td>
                <td>{row.date}</td>
                <td>{row.type}</td>
                <td>{row.customerFranchise}</td>
                <td>{row.orderValue}</td>
                <td>{row.paymentMode}</td>
                <td><span className={getStatusClass(row.status)}>{row.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // ==================== CONTENT ROUTER ====================

  const renderContent = () => {
    switch (activeReport) {
      case 'Sales Reports':
        return renderSalesReports();
      case 'Inventory Report':
        return renderInventoryReport();
      case 'Franchise Reports':
        return renderFranchiseReports();
      case 'Profit & Loss Reports':
        return renderProfitLossReports();
      case 'Payment & Settlement Report':
        return renderPaymentSettlementReport();
      case 'Customer Reports':
        return renderCustomerReports();
      case 'Tax & GST Reports':
        return renderTaxGstReports();
      case 'Order Reports':
        return renderOrderReports();
      default:
        return null;
    }
  };

  // ==================== RENDER ====================

  return (
    <div className="reports-container">
      <h1 className="reports-title">Reports</h1>
      <p className="reports-subtitle">Access all business, franchise, sales &amp; inventory reports</p>

      {/* Report Type Buttons */}
      <div className="reports-type-bar">
        <div className="reports-type-buttons">
          <div className="reports-type-row">
            {reportTypes.slice(0, 4).map((type) => (
              <button
                key={type}
                className={`reports-type-btn ${activeReport === type ? 'active' : ''}`}
                onClick={() => setActiveReport(type)}
              >
                {type}
              </button>
            ))}
            <button className="reports-download-btn" onClick={handleDownload}>
              Download Report
            </button>
          </div>
          <div className="reports-type-row">
            {reportTypes.slice(4).map((type) => (
              <button
                key={type}
                className={`reports-type-btn ${activeReport === type ? 'active' : ''}`}
                onClick={() => setActiveReport(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      {renderContent()}
    </div>
  );
}

export default Reports;
