import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import styles from './Row5Widgets.module.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getAllSales } from '../../services/salesService';
import { getFinancialSummary } from '../../services/financeService';

const chartData = [
  { name: 'Jan', revenue: 4000, expense: -2400 },
  { name: 'Feb', revenue: 3000, expense: -1398 },
  { name: 'Mar', revenue: 2000, expense: -9800 },
  { name: 'Apr', revenue: 2780, expense: -3908 },
  { name: 'May', revenue: 1890, expense: -4800 },
  { name: 'Jun', revenue: 2390, expense: -3800 },
];

export const SalesStatics = () => {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    getFinancialSummary().then(res => {
      if (res && res.success) setSummary(res.data);
    }).catch(console.error);
  }, []);

  return (
    <Card className={styles.chartCard}>
      <div className={styles.header}>
        <h3>Sales & Revenue Performance</h3>
      </div>
      <div className={styles.metrics}>
        <div className={styles.metricItem}>
          <span className={styles.label}>Total Revenue</span>
          <span className={styles.value}>₹{summary?.totalSales || 0}</span>
          <span className={styles.upTrend}>+25%</span>
        </div>
        <div className={styles.metricItem}>
          <span className={styles.label}>Total Expenses</span>
          <span className={styles.value}>₹{summary?.totalExpenses || 0}</span>
          <span className={styles.downTrend}>Logged</span>
        </div>
      </div>
      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={summary?.revenueExpenseTrends && summary.revenueExpenseTrends.length > 0 ? summary.revenueExpenseTrends : chartData} stackOffset="sign">
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip />
            <Bar dataKey="revenue" fill="#28C76F" stackId="stack" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expense" fill="#EA5455" stackId="stack" radius={[0, 0, 4, 4]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export const RecentTransactions = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllSales().then(res => {
      if (res && res.success) setSales((res.data || []).slice(0, 5));
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <Card className={styles.tableCard}>
      <div className={styles.header}>
        <h3>Recent Transactions</h3>
        <a href="/sales-list" className={styles.viewAll}>View All</a>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Customer / Reference</th>
            <th>Status</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan="4" style={{textAlign: 'center', padding: '1rem'}}>Loading Transactions...</td></tr>
          ) : sales.length === 0 ? (
            <tr><td colSpan="4" style={{textAlign: 'center', padding: '1rem'}}>No recent transactions</td></tr>
          ) : (
            sales.map(item => (
              <tr key={item._id}>
                <td>{new Date(item.saleDate || item.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className={styles.customer}>
                    <div className={styles.avatar}>{(item.customerName || item.reference || 'C')[0]}</div>
                    {item.customerName || item.reference}
                  </div>
                </td>
                <td><span className={styles.badgeSuccess}>Completed</span></td>
                <td style={{fontWeight: 600}}>₹{item.grandTotal}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </Card>
  );
};
