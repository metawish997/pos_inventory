import React from 'react';
import styles from './StatCard.module.css';
import { ArrowUp, ArrowDown } from 'lucide-react';

const StatCard = ({ title, value, trend, isPositive, variant = 'primary', icon: Icon }) => {
  return (
    <div className={`${styles.statCard} ${styles[variant]}`}>
      <div className={styles.iconWrapper}>
         {Icon ? <Icon size={24} className={styles.icon} strokeWidth={1.5} /> : <div className={styles.placeholderIcon}></div>}
      </div>
      <div className={styles.details}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.valueRow}>
          <p className={styles.value}>{value}</p>
          {trend && (
            <div className={styles.trend}>
              <span className={`${styles.trendPill} ${isPositive ? styles.positive : styles.negative}`}>
                {isPositive ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                {trend}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
