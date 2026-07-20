import React from 'react';
import Card from '../ui/Card';
import styles from './Row5Widgets.module.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', revenue: 4000, expense: -2400 },
  { name: 'Feb', revenue: 3000, expense: -1398 },
  { name: 'Mar', revenue: 2000, expense: -9800 },
  { name: 'Apr', revenue: 2780, expense: -3908 },
  { name: 'May', revenue: 1890, expense: -4800 },
  { name: 'Jun', revenue: 2390, expense: -3800 },
];

export const SalesStatics = () => {
  return (
    <Card className={styles.chartCard}>
      <div className={styles.header}>
        <h3>Sales Statics</h3>
        <select className={styles.select}><option>2026</option></select>
      </div>
      <div className={styles.metrics}>
        <div className={styles.metricItem}>
          <span className={styles.label}>Revenue</span>
          <span className={styles.value}>$12,189</span>
          <span className={styles.upTrend}>+25%</span>
        </div>
        <div className={styles.metricItem}>
          <span className={styles.label}>Expense</span>
          <span className={styles.value}>$48,988,078</span>
          <span className={styles.downTrend}>-25%</span>
        </div>
      </div>
      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data} stackOffset="sign">
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
  return (
    <Card className={styles.tableCard}>
      <div className={styles.header}>
        <h3>Recent Transactions</h3>
        <a href="#" className={styles.viewAll}>View All</a>
      </div>
      <div className={styles.tabs}>
        <span className={styles.activeTab}>Sale</span>
        <span>Purchase</span>
        <span>Quotation</span>
        <span>Expenses</span>
        <span>Invoices</span>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Customer</th>
            <th>Status</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {[1,2,3,4].map(i => (
            <tr key={i}>
              <td>12 Jan 2026</td>
              <td><div className={styles.customer}><div className={styles.avatar}>A</div> Alice</div></td>
              <td><span className={styles.badgeSuccess}>Completed</span></td>
              <td>$12,450</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
};
