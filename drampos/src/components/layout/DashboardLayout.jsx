import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import styles from './DashboardLayout.module.css';

const DashboardLayout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  return (
    <div className={`${styles.layout} ${isCollapsed ? styles.collapsed : ''}`}>
      <Header 
        isCollapsed={isCollapsed} 
        toggleCollapse={() => setIsCollapsed(!isCollapsed)} 
        toggleMobile={() => setIsMobileOpen(!isMobileOpen)}
      />
      <div className={styles.mainContainer}>
        {isMobileOpen && (
          <div className={styles.backdrop} onClick={() => setIsMobileOpen(false)}></div>
        )}
        <Sidebar 
          isCollapsed={isCollapsed} 
          isMobileOpen={isMobileOpen}
          closeMobile={() => setIsMobileOpen(false)}
        />
        <main className={`${styles.content} ${isCollapsed ? styles.contentCollapsed : ''}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
