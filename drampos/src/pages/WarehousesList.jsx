import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css';
import { Search, FileText, FileSpreadsheet, RefreshCw, ChevronUp, Eye, Edit, Trash2, PlusCircle } from 'lucide-react';
import { getWarehouses, deleteWarehouse } from '../services/inventoryService';
import { exportToCSV, exportToPDF } from '../utils/exportUtils';
import AddWarehouseModal from '../components/modals/AddWarehouseModal';
import EditWarehouseModal from '../components/modals/EditWarehouseModal';

const WarehousesList = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);

  const fetchWarehouses = async () => {
    try {
      setLoading(true);
      const data = await getWarehouses();
      setWarehouses(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchWarehouses(); }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await deleteWarehouse(id);
        setWarehouses(warehouses.filter(w => w._id !== id));
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleEdit = (item) => {
    setSelectedWarehouse(item);
    setIsEditModalOpen(true);
  };

  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Warehouses</h1>
          <p className={styles.subtitle}>Manage your warehouses</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.iconBtn} onClick={() => exportToPDF(warehouses, 'Warehouse List')}><FileText size={18} color="#EA5455" /></button>
          <button className={styles.iconBtn} onClick={() => exportToCSV(warehouses, 'warehouses.csv')}><FileSpreadsheet size={18} color="#28C76F" /></button>
          <button className={styles.iconBtn}><RefreshCw size={18} /></button>
          <button className={styles.iconBtn}><ChevronUp size={18} /></button>
          <button className={styles.btnPrimary} style={{ backgroundColor: '#FF9F43', color: 'white', border: 'none' }} onClick={() => setIsModalOpen(true)}>
            <PlusCircle size={18} /> Add Warehouse
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
                <th>Warehouse</th>
                <th>Store</th>
                <th>Location</th>
                <th>Created On</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>Loading...</td></tr>
              ) : warehouses.length === 0 ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No warehouses found</td></tr>
              ) : (
                warehouses.map((item) => (
                  <tr key={item._id}>
                    <td><input type="checkbox" /></td>
                    <td style={{ color: '#1B2850', fontWeight: 500 }}>{item.name}</td>
                    <td style={{ color: '#6B7280' }}>{item.storeId?.name || item.storeId || '-'}</td>
                    <td style={{ color: '#6B7280' }}>{item.location || '-'}</td>
                    <td style={{ color: '#6B7280' }}>{new Date(item.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className={styles.actionCell}>
                        <button className={styles.actionBtn}><Eye size={16} /></button>
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
            Row Per Page <select style={{ margin: '0 0.5rem', padding: '0.25rem', border: '1px solid #e5e7eb', borderRadius: '4px' }}><option>10</option></select> Entries
          </div>
          <div className={styles.pageControls}>
            <button className={styles.pageBtn}>&lt;</button>
            <button className={`${styles.pageBtn} ${styles.activePage}`} style={{ backgroundColor: '#FF9F43', color: 'white', border: 'none' }}>1</button>
            <button className={styles.pageBtn}>&gt;</button>
          </div>
        </div>
      </Card>
      <AddWarehouseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={fetchWarehouses} />
      <EditWarehouseModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} onSuccess={fetchWarehouses} warehouse={selectedWarehouse} />
    </DashboardLayout>
  );
};

export default WarehousesList;
