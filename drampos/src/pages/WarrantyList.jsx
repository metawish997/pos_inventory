import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css';
import { Search, FileText, FileSpreadsheet, RefreshCw, ChevronUp, Edit, Trash2, PlusCircle } from 'lucide-react';
import AddWarrantyModal from '../components/modals/AddWarrantyModal';
import EditWarrantyModal from '../components/modals/EditWarrantyModal';
import { getWarranties, deleteWarranty } from '../services/inventoryService';
import { exportToCSV, exportToPDF } from '../utils/exportUtils';

const WarrantyList = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedWarranty, setSelectedWarranty] = useState(null);
  const [warranties, setWarranties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWarranties = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getWarranties();
      setWarranties(data);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to fetch warranties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchWarranties(); }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this warranty record?')) {
      try {
        await deleteWarranty(id);
        setWarranties(prev => prev.filter(w => w._id !== id));
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleEdit = (item) => {
    setSelectedWarranty(item);
    setIsEditModalOpen(true);
  };

  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Warranties</h1>
          <p className={styles.subtitle}>Manage your warranty terms and configurations</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.iconBtn} onClick={() => exportToPDF(warranties, 'Warranty Term List')}><FileText size={18} color="#EA5455" /></button>
          <button className={styles.iconBtn} onClick={() => exportToCSV(warranties, 'warranties.csv')}><FileSpreadsheet size={18} color="#28C76F" /></button>
          <button className={styles.iconBtn} onClick={fetchWarranties}><RefreshCw size={18} /></button>
          <button className={styles.iconBtn}><ChevronUp size={18} /></button>
          <button className={styles.btnPrimary} onClick={() => setIsAddModalOpen(true)}>
            <PlusCircle size={18} /> Add Warranty
          </button>
        </div>
      </div>

      <Card className={styles.tableCard}>
        <div className={styles.filterBar}>
          <div className={styles.searchBox}>
            <Search size={18} className={styles.searchIcon} />
            <input type="text" placeholder="Search warranties..." />
          </div>
        </div>

        <div className={styles.tableResponsive}>
          {error && <div style={{ color: 'red', marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#fee2e2', borderRadius: '4px' }}>{error}</div>}
          <table className={styles.productTable}>
            <thead>
              <tr>
                <th><input type="checkbox" /></th>
                <th>Warranty</th>
                <th>Description</th>
                <th>Duration</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>Loading...</td></tr>
              ) : warranties.length === 0 ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No warranty options found</td></tr>
              ) : (
                warranties.map((item) => (
                  <tr key={item._id}>
                    <td><input type="checkbox" /></td>
                    <td><strong>{item.name}</strong></td>
                    <td>{item.description}</td>
                    <td>{item.duration}</td>
                    <td>
                      <span style={{
                        backgroundColor: item.status === 'Active' ? '#28C76F' : '#EA5455',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px'
                      }}>• {item.status || 'Active'}</span>
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
      </Card>

      <AddWarrantyModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSuccess={fetchWarranties} />
      <EditWarrantyModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} onSuccess={fetchWarranties} warranty={selectedWarranty} />
    </DashboardLayout>
  );
};

export default WarrantyList;