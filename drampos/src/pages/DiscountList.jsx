import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css';
import { Search, RefreshCw, PlusCircle, Edit, Trash2 } from 'lucide-react';
import AddDiscountModal from '../components/modals/AddDiscountModal';
import EditDiscountModal from '../components/modals/EditDiscountModal';
import { getDiscounts, deleteDiscount } from '../services/promoService';

const DiscountList = () => {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState(null);

  const fetchDiscounts = async () => {
    try {
      setLoading(true);
      const res = await getDiscounts();
      if (res.success) {
        setDiscounts(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch discounts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this discount?')) {
      try {
        await deleteDiscount(id);
        fetchDiscounts();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
        return <span style={{backgroundColor: '#28C76F', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px'}}>{status}</span>;
      case 'Inactive':
        return <span style={{backgroundColor: '#EA5455', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px'}}>{status}</span>;
      default:
        return <span>{status || 'Active'}</span>;
    }
  };

  const filteredDiscounts = discounts.filter(d =>
    (d.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (d.planType || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Discounts</h1>
          <p className={styles.subtitle}>Manage Discount Plans & Rates</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.iconBtn} onClick={fetchDiscounts}><RefreshCw size={18} /></button>
          <button className={styles.btnPrimary} onClick={() => setIsAddOpen(true)}>
            <PlusCircle size={18} /> Add Discount
          </button>
        </div>
      </div>

      <Card className={styles.tableCard}>
        <div className={styles.filterBar}>
          <div className={styles.searchBox}>
            <Search size={18} className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Search Discount Name or Plan" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.tableResponsive}>
          <table className={styles.productTable}>
            <thead>
              <tr>
                <th><input type="checkbox" /></th>
                <th>Name</th>
                <th>Plan Type</th>
                <th>Value</th>
                <th>Valid Till</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{textAlign: 'center', padding: '2rem'}}>Loading Discounts...</td>
                </tr>
              ) : filteredDiscounts.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{textAlign: 'center', padding: '2rem'}}>No discounts found</td>
                </tr>
              ) : (
                filteredDiscounts.map((item) => (
                  <tr key={item._id}>
                    <td><input type="checkbox" /></td>
                    <td style={{color: '#1B2850', fontWeight: 600}}>{item.name}</td>
                    <td>{item.planType || 'General'}</td>
                    <td>{item.discountType === 'Percentage' ? `${item.value}%` : `₹${item.value}`}</td>
                    <td>{new Date(item.validTo || item.createdAt).toLocaleDateString()}</td>
                    <td>{getStatusBadge(item.status)}</td>
                    <td>
                      <div style={{display: 'flex', gap: '0.5rem'}}>
                        <button 
                          style={{border: 'none', background: 'none', cursor: 'pointer', color: '#6B7280'}}
                          onClick={() => { setSelectedDiscount(item); setIsEditOpen(true); }}
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          style={{border: 'none', background: 'none', cursor: 'pointer', color: '#EA5455'}}
                          onClick={() => handleDelete(item._id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
      
      <AddDiscountModal isOpen={isAddOpen} onClose={() => { setIsAddOpen(false); fetchDiscounts(); }} />
      <EditDiscountModal isOpen={isEditOpen} onClose={() => { setIsEditOpen(false); fetchDiscounts(); }} discount={selectedDiscount} />
    </DashboardLayout>
  );
};

export default DiscountList;
