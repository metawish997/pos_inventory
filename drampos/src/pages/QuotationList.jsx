import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css'; // Reusing styles
import { Search, FileText, FileSpreadsheet, RefreshCw, ChevronUp, PlusCircle, Eye, Edit, Trash2 } from 'lucide-react';
import AddQuotationModal from '../components/modals/AddQuotationModal';

const QuotationList = () => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const navigate = useNavigate();

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Sent':
        return <span style={{backgroundColor: '#E8F9EE', color: '#28C76F', padding: '4px 8px', borderRadius: '4px', fontSize: '12px'}}>{status}</span>;
      case 'Pending':
        return <span style={{backgroundColor: '#E5F8FA', color: '#00CFE8', padding: '4px 8px', borderRadius: '4px', fontSize: '12px'}}>{status}</span>;
      case 'Ordered':
        return <span style={{backgroundColor: '#FFF1E6', color: '#FF9F43', padding: '4px 8px', borderRadius: '4px', fontSize: '12px'}}>{status}</span>;
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Quotation List</h1>
          <p className={styles.subtitle}>Manage Your Quotation</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.iconBtn}><FileText size={18} color="#EA5455" /></button>
          <button className={styles.iconBtn}><FileSpreadsheet size={18} color="#28C76F" /></button>
          <button className={styles.iconBtn}><RefreshCw size={18} /></button>
          <button className={styles.iconBtn}><ChevronUp size={18} /></button>
          <button className={styles.btnPrimary} onClick={() => setIsAddOpen(true)}>
            <PlusCircle size={18} /> Add Quotation
          </button>
        </div>
      </div>

      <Card className={styles.tableCard}>
        <div className={styles.filterBar}>
          <div className={styles.searchBox}>
            <Search size={18} className={styles.searchIcon} />
            <input type="text" placeholder="Search" />
          </div>
          <div className={styles.filters}>
            <select className={styles.select}>
              <option>Product</option>
            </select>
            <select className={styles.select}>
              <option>Customer</option>
            </select>
            <select className={styles.select}>
              <option>Status</option>
            </select>
            <select className={styles.select}>
              <option>Sort By : Last 7 Days</option>
            </select>
          </div>
        </div>

        <div className={styles.tableResponsive}>
          <table className={styles.productTable}>
            <thead>
              <tr>
                <th><input type="checkbox" /></th>
                <th>Product Name</th>
                <th>Custmer Name</th>
                <th>Status</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {[
                { product: 'Lenovo 3rd Generation', name: 'Carl Evans', status: 'Sent', total: '$550' },
                { product: 'Bold V3.2', name: 'Minerva Rameriz', status: 'Sent', total: '$430' },
                { product: 'Nike Jordan', name: 'Robert Lamon', status: 'Ordered', total: '$260' },
                { product: 'Apple Series 5 Watch', name: 'Mark Joslyn', status: 'Sent', total: '$470' },
                { product: 'Amazon Echo Dot', name: 'Patricia Lewis', status: 'Pending', total: '$380' },
                { product: 'Lobar Handy', name: 'Marsha Betts', status: 'Sent', total: '$190' },
                { product: 'Red Premium Handy', name: 'Daniel Jude', status: 'Pending', total: '$540' },
                { product: 'Iphone 14 Pro', name: 'Emma Bates', status: 'Ordered', total: '$610' },
                { product: 'Black Slim 200', name: 'Richard Fralick', status: 'Pending', total: '$220' },
                { product: 'Woodcraft Sandal', name: 'Michelle Robison', status: 'Sent', total: '$460' },
              ].map((item, i) => (
                <tr key={i}>
                  <td><input type="checkbox" /></td>
                  <td>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                      <div style={{width: '24px', height: '24px', borderRadius: '4px', backgroundColor: '#F3F4F6'}}></div>
                      <span style={{fontSize: '0.875rem', color: '#1B2850', fontWeight: 500}}>{item.product}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                      <div style={{width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#F3F4F6'}}></div>
                      <span style={{fontSize: '0.875rem', color: '#1B2850', fontWeight: 500}}>{item.name}</span>
                    </div>
                  </td>
                  <td>{getStatusBadge(item.status)}</td>
                  <td>{item.total}</td>
                  <td>
                    <div className={styles.actionCell}>
                      <button className={styles.actionBtn} onClick={() => navigate('/quotation-details')}><Eye size={16} /></button>
                      <button className={styles.actionBtn}><Edit size={16} /></button>
                      <button className={`${styles.actionBtn} ${styles.danger}`}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.pagination}>
           <div className={styles.pageInfo}>
              Row Per Page <select style={{margin: '0 0.5rem', padding: '0.25rem', border: '1px solid #e5e7eb', borderRadius: '4px'}}><option>10</option></select> Entries
           </div>
           <div className={styles.pageControls}>
              <button className={styles.pageBtn}>&lt;</button>
              <button className={`${styles.pageBtn} ${styles.activePage}`} style={{backgroundColor: '#FF9F43', color: 'white', border: 'none'}}>1</button>
              <button className={styles.pageBtn} style={{backgroundColor: '#F3F4F6', border: 'none', color: '#1B2850'}}>2</button>
              <button className={styles.pageBtn}>&gt;</button>
           </div>
        </div>
      </Card>

      <AddQuotationModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
    </DashboardLayout>
  );
};

export default QuotationList;
