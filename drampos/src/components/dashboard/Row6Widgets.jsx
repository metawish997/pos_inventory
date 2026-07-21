import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import styles from './Row6Widgets.module.css';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { API_BASE_URL } from '../../api/endpoints';
import { getCategories } from '../../services/inventoryService';

export const TopCustomers = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/vendors/customers`)
      .then(res => res.json())
      .then(data => {
        const list = Array.isArray(data) ? data : (data?.data || []);
        setCustomers(list.slice(0, 5));
      })
      .catch(console.error);
  }, []);

  return (
    <Card className={styles.widgetCard}>
      <div className={styles.widgetHeader}>
        <h3>Top Customers</h3>
        <a href="/customers" className={styles.viewAll}>View All</a>
      </div>
      <div className={styles.customerList}>
        {customers.length === 0 ? (
          <div style={{padding: '1rem', color: '#6B7280', textAlign: 'center'}}>No customer records found</div>
        ) : (
          customers.map(item => (
            <div key={item._id} className={styles.customerItem}>
              <div className={styles.customerInfo}>
                <div className={styles.avatar}>{(item.name || item.customerName || 'C')[0]}</div>
                <div>
                  <div className={styles.name}>{item.name || item.customerName}</div>
                  <div className={styles.meta}>{item.phone || item.email || 'Customer'}</div>
                </div>
              </div>
              <div className={styles.spent}>Active</div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

const COLORS = ['#FF9F43', '#28C76F', '#2878EB'];

export const TopCategories = () => {
  const [categories, setCategories] = useState([]);
  const [totalCategories, setTotalCategories] = useState(0);

  useEffect(() => {
    getCategories().then(res => {
      if (res) {
        const list = Array.isArray(res) ? res : (res.data || []);
        setCategories(list.slice(0, 3));
        setTotalCategories(list.length);
      }
    }).catch(console.error);
  }, []);

  const categoryData = categories.map((c, i) => ({
    name: c.categoryName || c.name || `Category ${i+1}`,
    value: (i + 1) * 10
  }));

  return (
    <Card className={styles.widgetCard}>
      <div className={styles.widgetHeader}>
        <h3>Top Categories</h3>
      </div>
      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={categoryData.length > 0 ? categoryData : [{ name: 'General', value: 10 }]} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
              {(categoryData.length > 0 ? categoryData : [{ name: 'General', value: 10 }]).map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className={styles.categoryStats}>
        <div className={styles.statLine}><span>Total Number Of Categories:</span> <strong>{totalCategories}</strong></div>
      </div>
    </Card>
  );
};

export const OrderStatistics = () => {
  return (
    <Card className={styles.widgetCard}>
      <div className={styles.widgetHeader}>
        <h3>Order Activity Matrix</h3>
      </div>
      <div className={styles.heatmapPlaceholder}>
         <div className={styles.grid}>
            {Array.from({length: 49}).map((_, i) => (
              <div key={i} className={styles.gridCell} style={{ opacity: Math.random() * 0.8 + 0.2 }}></div>
            ))}
         </div>
      </div>
    </Card>
  );
};
