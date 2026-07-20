import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css'; // Reusing styles
import { Search, FileText, FileSpreadsheet, RefreshCw, ChevronUp, Edit, Trash2, PlusCircle } from 'lucide-react';
import AddSubCategoryModal from '../components/modals/AddSubCategoryModal';
import EditSubCategoryModal from '../components/modals/EditSubCategoryModal';
import { getSubCategories, deleteSubCategory } from '../services/inventoryService';

const SubCategoryList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSubCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSubCategories();
      setSubCategories(data);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to fetch sub categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubCategories();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await deleteSubCategory(id);
        setSubCategories(prev => prev.filter(s => s._id !== id));
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleEdit = (item) => {
    setSelectedSubCategory(item);
    setIsEditModalOpen(true);
  };

  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Sub Category</h1>
          <p className={styles.subtitle}>Manage your sub categories</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.iconBtn}><FileText size={18} color="#EA5455" /></button>
          <button className={styles.iconBtn}><FileSpreadsheet size={18} color="#28C76F" /></button>
          <button className={styles.iconBtn}><RefreshCw size={18} /></button>
          <button className={styles.iconBtn}><ChevronUp size={18} /></button>
          <button className={styles.btnPrimary} onClick={() => setIsModalOpen(true)}>
            <PlusCircle size={18} /> Add Sub Category
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
              <option>Category</option>
            </select>
            <select className={styles.select}>
              <option>Status</option>
            </select>
          </div>
        </div>

        <div className={styles.tableResponsive}>
          {error && <div style={{ color: 'red', marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#fee2e2', borderRadius: '4px' }}>{error}</div>}
          <table className={styles.productTable}>
            <thead>
              <tr>
                <th><input type="checkbox" /></th>
                <th>Image</th>
                <th>Sub Category</th>
                <th>Category</th>
                <th>Category Code</th>
                <th>Description</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="8" style={{textAlign: 'center', padding: '2rem'}}>Loading...</td></tr>
              ) : subCategories.length === 0 ? (
                <tr><td colSpan="8" style={{textAlign: 'center', padding: '2rem'}}>No sub categories found</td></tr>
              ) : (
                subCategories.map((item) => (
                  <tr key={item._id}>
                    <td><input type="checkbox" /></td>
                    <td>
                      {item.image ? (
                        <img src={item.image} alt={item.name} style={{width: '32px', height: '32px', borderRadius: '4px', objectFit: 'cover'}} />
                      ) : (
                        <div className={styles.productImg} style={{width: '32px', height: '32px'}}></div>
                      )}
                    </td>
                    <td>{item.name}</td>
                    <td>{item.categoryId?.name || item.categoryId || '-'}</td>
                    <td>{item.slug || '-'}</td>
                    <td>-</td>
                    <td>
                       <span style={{backgroundColor: '#28C76F', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px'}}>Active</span>
                    </td>
                    <td>
                      <div className={styles.actionCell}>
                        <button className={styles.actionBtn} onClick={() => handleEdit(item)}><Edit size={16} /></button>
                        <button className={`${styles.actionBtn} ${styles.danger}`} onClick={() => handleDelete(item._id)}><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
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
              <button className={styles.pageBtn}>&gt;</button>
           </div>
        </div>
      </Card>

      <AddSubCategoryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={fetchSubCategories} />
      <EditSubCategoryModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} onSuccess={fetchSubCategories} subCategory={selectedSubCategory} />
    </DashboardLayout>
  );
};

export default SubCategoryList;
