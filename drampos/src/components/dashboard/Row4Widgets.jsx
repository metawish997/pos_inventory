import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import styles from './DashboardWidgets.module.css';
import { API_BASE_URL } from '../../api/endpoints';
import { getAllSales } from '../../services/salesService';

export const TopSellingProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/products`)
      .then(res => res.json())
      .then(data => {
        const list = Array.isArray(data) ? data : (data?.data || []);
        setProducts(list.slice(0, 5));
      })
      .catch(console.error);
  }, []);

  return (
    <Card className={styles.widgetCard}>
      <div className={styles.widgetHeader}>
        <h3>Top Selling Products</h3>
      </div>
      <div className={styles.widgetList}>
        {products.length === 0 ? (
          <div style={{padding: '1rem', color: '#6B7280', textAlign: 'center'}}>No products found</div>
        ) : (
          products.map(item => (
            <div key={item._id} className={styles.listItem}>
              <div className={styles.itemInfo}>
                <div className={styles.itemImg} style={{fontSize: '12px', fontWeight: 'bold'}}>{(item.productName || item.name || 'P')[0]}</div>
                <div>
                  <div className={styles.itemName}>{item.productName || item.name}</div>
                  <div className={styles.itemMeta}>₹{item.sellingPrice || item.price || 0} • {item.sku || 'SKU'}</div>
                </div>
              </div>
              <div className={styles.itemTrend}>Hot</div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

export const LowStockProducts = () => {
  const [lowStocks, setLowStocks] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/products/low-stocks`)
      .then(res => res.json())
      .then(data => {
        if (data && data.success) {
          setLowStocks((data.data?.lowStocks || []).slice(0, 5));
        }
      })
      .catch(console.error);
  }, []);

  return (
    <Card className={styles.widgetCard}>
      <div className={styles.widgetHeader}>
        <h3>Low Stock Products</h3>
        <a href="/low-stocks" className={styles.viewAll}>View All</a>
      </div>
      <div className={styles.widgetList}>
        {lowStocks.length === 0 ? (
          <div style={{padding: '1rem', color: '#28C76F', textAlign: 'center'}}>No low stock items!</div>
        ) : (
          lowStocks.map(item => (
            <div key={item._id} className={styles.listItem}>
              <div className={styles.itemInfo}>
                <div className={styles.itemImg} style={{backgroundColor: '#FFF1E6', color: '#FF9F43', fontSize: '12px', fontWeight: 'bold'}}>{(item.productName || item.name || 'P')[0]}</div>
                <div>
                  <div className={styles.itemName}>{item.productName || item.name}</div>
                  <div className={styles.itemMeta}>Qty: <span className={styles.dangerText}>{item.quantity || item.stock || 0}</span></div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

export const RecentSales = () => {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    getAllSales().then(res => {
      if (res && res.success) setSales((res.data || []).slice(0, 5));
    }).catch(console.error);
  }, []);

  return (
    <Card className={styles.widgetCard}>
      <div className={styles.widgetHeader}>
        <h3>Recent Sales</h3>
      </div>
      <div className={styles.widgetList}>
        {sales.length === 0 ? (
          <div style={{padding: '1rem', color: '#6B7280', textAlign: 'center'}}>No sales recorded yet</div>
        ) : (
          sales.map(item => (
            <div key={item._id} className={styles.listItem}>
              <div className={styles.itemInfo}>
                <div className={styles.itemImg} style={{backgroundColor: '#E8F9F0', color: '#28C76F', fontSize: '12px', fontWeight: 'bold'}}>₹</div>
                <div>
                  <div className={styles.itemName}>{item.reference || item.invoiceNumber}</div>
                  <div className={styles.itemMeta}>₹{item.grandTotal} • {item.paymentType || 'Cash'}</div>
                </div>
              </div>
              <div className={styles.badgeSuccess}>Completed</div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};
