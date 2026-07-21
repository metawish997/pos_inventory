import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css';
import { Search, RefreshCw, PlusCircle, Edit, Trash2 } from 'lucide-react';
import AddCouponModal from '../components/modals/AddCouponModal';
import EditCouponModal from '../components/modals/EditCouponModal';
import { getCoupons, deleteCoupon } from '../services/promoService';

const CouponsList = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await getCoupons();
      if (res.success) {
        setCoupons(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch coupons:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      try {
        await deleteCoupon(id);
        fetchCoupons();
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

  const filteredCoupons = coupons.filter(c =>
    (c.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.code || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Coupons</h1>
          <p className={styles.subtitle}>Manage Promotional Coupons</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.iconBtn} onClick={fetchCoupons}><RefreshCw size={18} /></button>
          <button className={styles.btnPrimary} onClick={() => setIsAddOpen(true)}>
            <PlusCircle size={18} /> Add Coupon
          </button>
        </div>
      </div>

      <Card className={styles.tableCard}>
        <div className={styles.filterBar}>
          <div className={styles.searchBox}>
            <Search size={18} className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Search Coupon Name or Code" 
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
                <th>Code</th>
                <th>Discount</th>
                <th>Limit / Used</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{textAlign: 'center', padding: '2rem'}}>Loading Coupons...</td>
                </tr>
              ) : filteredCoupons.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{textAlign: 'center', padding: '2rem'}}>No coupons found</td>
                </tr>
              ) : (
                filteredCoupons.map((item) => (
                  <tr key={item._id}>
                    <td><input type="checkbox" /></td>
                    <td>{item.name}</td>
                    <td><span style={{backgroundColor: '#F3E8FF', color: '#A855F7', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600}}>{item.code}</span></td>
                    <td>{item.discountType === 'Percentage' ? `${item.discountValue}%` : `₹${item.discountValue}`}</td>
                    <td>{item.usedCount} / {item.limit}</td>
                    <td>{getStatusBadge(item.status)}</td>
                    <td>
                      <div style={{display: 'flex', gap: '0.5rem'}}>
                        <button 
                          style={{border: 'none', background: 'none', cursor: 'pointer', color: '#6B7280'}}
                          onClick={() => { setSelectedCoupon(item); setIsEditOpen(true); }}
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

      <AddCouponModal isOpen={isAddOpen} onClose={() => { setIsAddOpen(false); fetchCoupons(); }} />
      <EditCouponModal isOpen={isEditOpen} onClose={() => { setIsEditOpen(false); fetchCoupons(); }} coupon={selectedCoupon} />
    </DashboardLayout>
  );
};

export default CouponsList;
