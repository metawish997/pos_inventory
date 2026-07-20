import React from 'react';
import Card from '../ui/Card';
import styles from './Row6Widgets.module.css';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export const TopCustomers = () => {
  return (
    <Card className={styles.widgetCard}>
      <div className={styles.widgetHeader}>
        <h3>Top Customers</h3>
        <a href="#" className={styles.viewAll}>View All</a>
      </div>
      <div className={styles.customerList}>
        {[1,2,3,4,5].map(i => (
          <div key={i} className={styles.customerItem}>
            <div className={styles.customerInfo}>
              <div className={styles.avatar}>C</div>
              <div>
                <div className={styles.name}>Carlos Curran</div>
                <div className={styles.meta}>USA • 24 Orders</div>
              </div>
            </div>
            <div className={styles.spent}>$8,9645</div>
          </div>
        ))}
      </div>
    </Card>
  );
};

const categoryData = [
  { name: 'Electronics', value: 698 },
  { name: 'Sports', value: 545 },
  { name: 'Lifestyles', value: 456 },
];
const COLORS = ['#FF9F43', '#28C76F', '#2878EB'];

export const TopCategories = () => {
  return (
    <Card className={styles.widgetCard}>
      <div className={styles.widgetHeader}>
        <h3>Top Categories</h3>
        <select className={styles.select}><option>Weekly</option></select>
      </div>
      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={categoryData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className={styles.categoryStats}>
        <div className={styles.statLine}><span>Total Number Of Categories:</span> <strong>698</strong></div>
        <div className={styles.statLine}><span>Total Number Of Products:</span> <strong>7899</strong></div>
      </div>
    </Card>
  );
};

export const OrderStatistics = () => {
  // A simple placeholder for a heatmap
  return (
    <Card className={styles.widgetCard}>
      <div className={styles.widgetHeader}>
        <h3>Order Statistics</h3>
        <select className={styles.select}><option>Weekly</option></select>
      </div>
      <div className={styles.heatmapPlaceholder}>
         {/* Simple grid to simulate heatmap */}
         <div className={styles.grid}>
            {Array.from({length: 49}).map((_, i) => (
              <div key={i} className={styles.gridCell} style={{ opacity: Math.random() * 0.8 + 0.2 }}></div>
            ))}
         </div>
      </div>
    </Card>
  );
};
