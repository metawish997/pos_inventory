import React from 'react';
import Card from '../ui/Card';
import styles from './DashboardWidgets.module.css';

export const TopSellingProducts = () => {
  return (
    <Card className={styles.widgetCard}>
      <div className={styles.widgetHeader}>
        <h3>Top Selling Products</h3>
        <select className={styles.widgetSelect}><option>Today</option></select>
      </div>
      <div className={styles.widgetList}>
        {[1,2,3,4,5].map(i => (
          <div key={i} className={styles.listItem}>
            <div className={styles.itemInfo}>
              <div className={styles.itemImg}>Img</div>
              <div>
                <div className={styles.itemName}>Apple Iphone 15</div>
                <div className={styles.itemMeta}>$187 • 247+ Sales</div>
              </div>
            </div>
            <div className={styles.itemTrend}>25%</div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export const LowStockProducts = () => {
  return (
    <Card className={styles.widgetCard}>
      <div className={styles.widgetHeader}>
        <h3>Low Stock Products</h3>
        <a href="#" className={styles.viewAll}>View All</a>
      </div>
      <div className={styles.widgetList}>
        {[1,2,3,4,5].map(i => (
          <div key={i} className={styles.listItem}>
            <div className={styles.itemInfo}>
              <div className={styles.itemImg}>Img</div>
              <div>
                <div className={styles.itemName}>Macbook Pro</div>
                <div className={styles.itemMeta}>Qty: <span className={styles.dangerText}>08</span></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export const RecentSales = () => {
  return (
    <Card className={styles.widgetCard}>
      <div className={styles.widgetHeader}>
        <h3>Recent Sales</h3>
        <select className={styles.widgetSelect}><option>Weekly</option></select>
      </div>
      <div className={styles.widgetList}>
        {[1,2,3,4,5].map(i => (
          <div key={i} className={styles.listItem}>
            <div className={styles.itemInfo}>
              <div className={styles.itemImg}>Img</div>
              <div>
                <div className={styles.itemName}>Lenovo Thinkpad</div>
                <div className={styles.itemMeta}>$250 • Electronics</div>
              </div>
            </div>
            <div className={styles.badgeSuccess}>Completed</div>
          </div>
        ))}
      </div>
    </Card>
  );
};
