import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import StatCard from '../components/ui/StatCard';
import Card from '../components/ui/Card';
import styles from './Dashboard.module.css';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { FileText, RefreshCw, Package, ArrowDownSquare, AlertCircle, X, Calendar } from 'lucide-react';
import { TopSellingProducts, LowStockProducts, RecentSales } from '../components/dashboard/Row4Widgets';
import { SalesStatics, RecentTransactions } from '../components/dashboard/Row5Widgets';
import { TopCustomers, TopCategories, OrderStatistics } from '../components/dashboard/Row6Widgets';
import { getFinancialSummary } from '../services/financeService';
import { API_BASE_URL } from '../api/endpoints';

const barData = [
  { name: 'Jan', sales: 4000, purchase: 2400 },
  { name: 'Feb', sales: 3000, purchase: 1398 },
  { name: 'Mar', sales: 2000, purchase: 9800 },
  { name: 'Apr', sales: 2780, purchase: 3908 },
  { name: 'May', sales: 1890, purchase: 4800 },
  { name: 'Jun', sales: 2390, purchase: 3800 },
];

const pieData = [
  { name: 'First Time', value: 5500 },
  { name: 'Return', value: 3500 },
];
const COLORS = ['#FF9F43', '#1B2850'];

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [lowStockAlertItem, setLowStockAlertItem] = useState(null);
  const [showAlert, setShowAlert] = useState(true);
  const [activeRange, setActiveRange] = useState('1Y');

  useEffect(() => {
    getFinancialSummary().then(res => {
      if (res.success) setSummary(res.data);
    }).catch(console.error);

    fetch(`${API_BASE_URL}/products/low-stocks`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data.lowStocks?.length > 0) {
          setLowStockAlertItem(data.data.lowStocks[0]);
        }
      })
      .catch(console.error);
  }, []);

  const getFilteredChartData = () => {
    const rawData = summary?.monthlyTrends && summary.monthlyTrends.length > 0 ? summary.monthlyTrends : barData;
    if (activeRange === '1M') return rawData.slice(-1);
    if (activeRange === '3M') return rawData.slice(-3);
    if (activeRange === '6M') return rawData.slice(-6);
    return rawData; // '1Y' -> All 12 months
  };

  return (
    <DashboardLayout>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Welcome, Admin</h1>
          <p className={styles.subtitle}>Overview of Store Inventory & Financial Performance</p>
        </div>
        <div className={styles.datePicker}>
          <Calendar size={16} /> {new Date().toLocaleDateString()}
        </div>
      </div>

      {showAlert && (
        <div className={styles.alert}>
          <div className={styles.alertContent}>
            <AlertCircle size={16} className={styles.alertIcon} />
            <span>
              {lowStockAlertItem ? (
                <>Product <span className={styles.alertHighlight}>{lowStockAlertItem.productName || lowStockAlertItem.name} is running Low</span> (Qty: {lowStockAlertItem.quantity || lowStockAlertItem.stock || 0})</>
              ) : (
                <>Product <span className={styles.alertHighlight}>Apple iPhone 15 is running Low</span>, already below 5 Pcs.</>
              )}
            </span>
          </div>
          <button className={styles.alertClose} onClick={() => setShowAlert(false)}>
            <X size={16} />
          </button>
        </div>
      )}

      <div className={styles.metricsGrid}>
        <StatCard title="Total Sales" value={`₹${summary?.totalSales || 0}`} trend="+15%" isPositive={true} variant="primary" icon={FileText} />
        <StatCard title="Total Sales Return" value="₹0" trend="0%" isPositive={true} variant="navy" icon={RefreshCw} />
        <StatCard title="Total Purchase" value={`₹${summary?.totalPurchases || 0}`} trend="+10%" isPositive={true} variant="teal" icon={Package} />
        <StatCard title="Total Purchase Return" value="₹0" trend="0%" isPositive={true} variant="blue" icon={ArrowDownSquare} />
      </div>

      <div className={styles.secondaryMetricsGrid}>
        {[
          { title: 'Net Profit', value: `₹${summary?.netProfit || 0}`, trend: 'Calculated Live', color: 'teal' },
          { title: 'Other Incomes', value: `₹${summary?.totalIncomes || 0}`, trend: 'Incomes Logged', color: 'teal' },
          { title: 'Total Expenses', value: `₹${summary?.totalExpenses || 0}`, trend: 'Expenses Logged', color: 'teal' },
          { title: 'Total Payment Returns', value: '₹0', trend: '0% vs Last Month', color: 'danger' }
        ].map((item, i) => (
          <Card key={i} className={styles.secCard}>
            <div className={styles.secCardContent}>
              <div>
                <h4 className={styles.secCardTitle}>{item.title}</h4>
                <p className={styles.secCardValue}>{item.value}</p>
                <span className={`${styles.secCardTrend} ${styles[item.color]}`}>{item.trend}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className={styles.chartsGrid}>
        <Card className={styles.mainChart}>
          <div className={styles.cardHeader}>
            <h3>Sales & Purchase Trends</h3>
            <div className={styles.tabs}>
              {['1M', '3M', '6M', '1Y'].map(range => (
                <span 
                  key={range} 
                  className={activeRange === range ? styles.activeTab : ''}
                  onClick={() => setActiveRange(range)}
                  style={{ cursor: 'pointer' }}
                >
                  {range}
                </span>
              ))}
            </div>
          </div>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getFilteredChartData()}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <RechartsTooltip />
                <Bar dataKey="purchase" fill="#FF9F43" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="sales" fill="#1B2850" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className={styles.sideChart}>
          <div className={styles.cardHeader}>
            <h3>Customers Overview</h3>
          </div>
          <div className={styles.customerMetrics}>
            <div className={styles.cMetric}>Suppliers: Active</div>
            <div className={styles.cMetric}>Customer: Active</div>
            <div className={styles.cMetric}>Orders: Active</div>
          </div>
          <div className={styles.chartContainer} style={{ height: '200px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className={styles.threeColGrid}>
        <TopSellingProducts />
        <LowStockProducts />
        <RecentSales />
      </div>

      <div className={styles.twoColGridHalf}>
        <SalesStatics />
        <RecentTransactions />
      </div>

      <div className={styles.threeColGrid}>
        <TopCustomers />
        <TopCategories />
        <OrderStatistics />
      </div>

    </DashboardLayout>
  );
};

export default Dashboard;
