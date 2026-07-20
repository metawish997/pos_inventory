import React from 'react';
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

const barData = [
  { name: '2am', sales: 4000, purchase: 2400 },
  { name: '6am', sales: 3000, purchase: 1398 },
  { name: '10am', sales: 2000, purchase: 9800 },
  { name: '2pm', sales: 2780, purchase: 3908 },
  { name: '6pm', sales: 1890, purchase: 4800 },
  { name: '10pm', sales: 2390, purchase: 3800 },
];

const pieData = [
  { name: 'First Time', value: 5500 },
  { name: 'Return', value: 3500 },
];
const COLORS = ['#FF9F43', '#1B2850'];

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Welcome, Admin</h1>
          <p className={styles.subtitle}>You have 200+ Orders, Today</p>
        </div>
        <div className={styles.datePicker}>
          <Calendar size={16} /> 07/04/2026 - 07/10/2026
        </div>
      </div>

      <div className={styles.alert}>
        <div className={styles.alertContent}>
          <AlertCircle size={16} className={styles.alertIcon} />
          <span>Your Product <span className={styles.alertHighlight}>Apple Iphone 15 is running Low</span>, already below 5 Pcs., <a href="#" className={styles.alertLink}>Add Stock</a></span>
        </div>
        <button className={styles.alertClose}>
          <X size={16} />
        </button>
      </div>

      <div className={styles.metricsGrid}>
        <StatCard title="Total Sales" value="$48,988,078" trend="+22%" isPositive={true} variant="primary" icon={FileText} />
        <StatCard title="Total Sales Return" value="$16,478,145" trend="-22%" isPositive={false} variant="navy" icon={RefreshCw} />
        <StatCard title="Total Purchase" value="$24,145,789" trend="+22%" isPositive={true} variant="teal" icon={Package} />
        <StatCard title="Total Purchase Return" value="$18,458,747" trend="+22%" isPositive={true} variant="blue" icon={ArrowDownSquare} />
      </div>

      <div className={styles.secondaryMetricsGrid}>
        {[
          { title: 'Profit', value: '$8,458,798', trend: '+35% vs Last Month', color: 'teal' },
          { title: 'Invoice Due', value: '$48,988.78', trend: '+35% vs Last Month', color: 'teal' },
          { title: 'Total Expenses', value: '$8,980,097', trend: '+41% vs Last Month', color: 'teal' },
          { title: 'Total Payment Returns', value: '$78,458,798', trend: '-20% vs Last Month', color: 'danger' }
        ].map((item, i) => (
          <Card key={i} className={styles.secCard}>
            <div className={styles.secCardContent}>
              <div>
                <h4 className={styles.secCardTitle}>{item.title}</h4>
                <p className={styles.secCardValue}>{item.value}</p>
                <span className={`${styles.secCardTrend} ${styles[item.color]}`}>{item.trend}</span>
              </div>
            </div>
            <a href="#" className={styles.viewAll}>View All</a>
          </Card>
        ))}
      </div>

      <div className={styles.chartsGrid}>
        <Card className={styles.mainChart}>
          <div className={styles.cardHeader}>
            <h3>Sales & Purchase</h3>
            <div className={styles.tabs}>
              <span>1D</span><span>1W</span><span>1M</span><span>3M</span><span>6M</span><span className={styles.activeTab}>1Y</span>
            </div>
          </div>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
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
            <div className={styles.cMetric}>Suppliers: 6987</div>
            <div className={styles.cMetric}>Customer: 4896</div>
            <div className={styles.cMetric}>Orders: 487</div>
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
