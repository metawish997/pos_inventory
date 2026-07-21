import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css';
import { Search, RefreshCw, PlusCircle } from 'lucide-react';
import { getIncomeCategories, createIncomeCategory } from '../services/financeService';

const IncomeCategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await getIncomeCategories();
      if (res.success) setCategories(res.data);
    } catch (err) {
      console.error('Failed to fetch income categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    const categoryName = prompt('Enter Income Category Name:');
    if (!categoryName) return;
    const description = prompt('Enter Description (optional):', '') || '';

    try {
      const res = await createIncomeCategory({ categoryName, description, status: 'Active' });
      if (res.success) {
        alert('Income category created!');
        fetchCategories();
      }
    } catch (err) {
      alert(`Failed to create category: ${err.message}`);
    }
  };

  const filteredCategories = categories.filter(c =>
    (c.categoryName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Income Category</h1>
          <p className={styles.subtitle}>Manage Income Categories</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.iconBtn} onClick={fetchCategories}><RefreshCw size={18} /></button>
          <button className={styles.btnPrimary} onClick={handleAddCategory}>
            <PlusCircle size={18} /> Add Category
          </button>
        </div>
      </div>

      <Card className={styles.tableCard}>
        <div className={styles.filterBar}>
          <div className={styles.searchBox}>
            <Search size={18} className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Search Category Name" 
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
                <th>Category Name</th>
                <th>Description</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" style={{textAlign: 'center', padding: '2rem'}}>Loading Income Categories...</td>
                </tr>
              ) : filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{textAlign: 'center', padding: '2rem'}}>No categories found</td>
                </tr>
              ) : (
                filteredCategories.map((item) => (
                  <tr key={item._id}>
                    <td><input type="checkbox" /></td>
                    <td style={{color: '#1B2850', fontWeight: 600}}>{item.categoryName}</td>
                    <td style={{color: '#6B7280'}}>{item.description || '-'}</td>
                    <td>
                      <span style={{backgroundColor: '#28C76F', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px'}}>{item.status || 'Active'}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </DashboardLayout>
  );
};

export default IncomeCategoryList;
