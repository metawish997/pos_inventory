import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css';
import { Search, FileText, FileSpreadsheet, RefreshCw, ChevronUp, Edit, Trash2, PlusCircle } from 'lucide-react';
import AddVariantModal from '../components/modals/AddVariantModal';
import EditVariantModal from '../components/modals/EditVariantModal';
import { getVariantAttributes, deleteVariantAttribute } from '../services/inventoryService';
import { exportToCSV, exportToPDF } from '../utils/exportUtils';

const VariantList = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVariants = async () => {
    try {
      setLoading(true);
      const data = await getVariantAttributes();
      setVariants(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchVariants(); }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this variant attribute?')) {
      try {
        await deleteVariantAttribute(id);
        setVariants(prev => prev.filter(v => v._id !== id));
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleEdit = (item) => {
    setSelectedVariant(item);
    setIsEditModalOpen(true);
  };

  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Variant Attributes</h1>
          <p className={styles.subtitle}>Manage your variant attributes</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.iconBtn} onClick={() => exportToPDF(variants, 'Variant Attribute List')}><FileText size={18} color="#EA5455" /></button>
          <button className={styles.iconBtn} onClick={() => exportToCSV(variants, 'variants.csv')}><FileSpreadsheet size={18} color="#28C76F" /></button>
          <button className={styles.iconBtn}><RefreshCw size={18} /></button>
          <button className={styles.iconBtn}><ChevronUp size={18} /></button>
          <button className={styles.btnPrimary} onClick={() => setIsAddModalOpen(true)}>
            <PlusCircle size={18} /> Add Variant
          </button>
        </div>
      </div>

      <Card className={styles.tableCard}>
        <div className={styles.filterBar}>
          <div className={styles.searchBox}>
            <Search size={18} className={styles.searchIcon} />
            <input type="text" placeholder="Search" />
          </div>
        </div>

        <div className={styles.tableResponsive}>
          <table className={styles.productTable}>
            <thead>
              <tr>
                <th><input type="checkbox" /></th>
                <th>Variant Attribute</th>
                <th>Values</th>
                <th>Created Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" style={{textAlign: 'center', padding: '2rem'}}>Loading...</td></tr>
              ) : variants.length === 0 ? (
                <tr><td colSpan="6" style={{textAlign: 'center', padding: '2rem'}}>No variant attributes found</td></tr>
              ) : (
                variants.map((item) => (
                  <tr key={item._id}>
                    <td><input type="checkbox" /></td>
                    <td>{item.name}</td>
                    <td>{item.values && item.values.length > 0 ? item.values.join(', ') : '—'}</td>
                    <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span style={{backgroundColor: '#28C76F', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px'}}>• Active</span>
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

      <AddVariantModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSuccess={fetchVariants} />
      <EditVariantModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} onSuccess={fetchVariants} variant={selectedVariant} />
    </DashboardLayout>
  );
};

export default VariantList;