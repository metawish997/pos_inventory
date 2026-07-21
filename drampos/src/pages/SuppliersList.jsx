import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css';
import { Search, FileText, FileSpreadsheet, RefreshCw, ChevronUp, Edit, Trash2 } from 'lucide-react';
import { API_BASE_URL } from '../api/endpoints';
import AddSupplierModal from '../components/modals/AddSupplierModal';
import { exportToCSV, exportToPDF } from '../utils/exportUtils';

const SuppliersList = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Status');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('type', 'supplier');
      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter && statusFilter !== 'Status') params.append('status', statusFilter);

      const res = await fetch(`${API_BASE_URL}/vendors?${params.toString()}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setSuppliers(data);
      }
    } catch (err) {
      console.error('Failed to fetch suppliers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, [searchTerm, statusFilter]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      try {
        await fetch(`${API_BASE_URL}/vendors/${id}`, { method: 'DELETE' });
        fetchSuppliers();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const openAddModal = () => {
    setEditingSupplier(null);
    setIsAddOpen(true);
  };

  const openEditModal = (supplier) => {
    setEditingSupplier(supplier);
    setIsAddOpen(true);
  };

  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Suppliers</h1>
          <p className={styles.subtitle}>Manage your suppliers directory</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.iconBtn} onClick={() => exportToPDF(suppliers, 'Supplier List')}><FileText size={18} color="#EA5455" /></button>
          <button className={styles.iconBtn} onClick={() => exportToCSV(suppliers, 'suppliers.csv')}><FileSpreadsheet size={18} color="#28C76F" /></button>
          <button className={styles.iconBtn} onClick={fetchSuppliers}><RefreshCw size={18} /></button>
          <button className={styles.iconBtn}><ChevronUp size={18} /></button>
          <button className={styles.btnPrimary} onClick={openAddModal} style={{backgroundColor: '#FF9F43', color: 'white', border: 'none'}}>
            + Add Supplier
          </button>
        </div>
      </div>

      <Card className={styles.tableCard}>
        <div className={styles.filterBar}>
          <div className={styles.searchBox}>
            <Search size={18} className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Search by supplier name, company or code" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className={styles.filters}>
            <select 
              className={styles.select}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="Status">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className={styles.tableResponsive}>
          <table className={styles.productTable}>
            <thead>
              <tr>
                <th><input type="checkbox" /></th>
                <th>Code</th>
                <th>Supplier Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Country</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="8" style={{textAlign: 'center', padding: '2rem'}}>Loading suppliers...</td></tr>
              ) : suppliers.length === 0 ? (
                <tr><td colSpan="8" style={{textAlign: 'center', padding: '2rem'}}>No suppliers found. Click "+ Add Supplier" to create one!</td></tr>
              ) : (
                suppliers.map((item) => (
                  <tr key={item._id}>
                    <td><input type="checkbox" /></td>
                    <td style={{color: '#6B7280', fontWeight: 500}}>{item.vendorCode || 'VEN-001'}</td>
                    <td>
                      <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                        <div style={{
                          width: '32px', height: '32px', borderRadius: '4px', backgroundColor: '#2878EB', 
                          color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
                        }}>
                          {(item.vendorName || 'S')[0]}
                        </div>
                        <div>
                          <div style={{color: '#1B2850', fontWeight: 500}}>{item.vendorName}</div>
                          {item.companyName && <div style={{fontSize: '12px', color: '#6B7280'}}>{item.companyName}</div>}
                        </div>
                      </div>
                    </td>
                    <td style={{color: '#6B7280'}}>{item.email || 'N/A'}</td>
                    <td style={{color: '#6B7280'}}>{item.mobile || item.phone || 'N/A'}</td>
                    <td style={{color: '#6B7280'}}>{item.country || 'N/A'}</td>
                    <td>
                      <span style={{
                        backgroundColor: item.status === 'Active' ? '#28C76F' : '#EA5455', 
                        color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px'
                      }}>&bull; {item.status}</span>
                    </td>
                    <td>
                      <div className={styles.actionCell}>
                        <button className={styles.actionBtn} onClick={() => openEditModal(item)}><Edit size={16} /></button>
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
              Showing <strong>{suppliers.length}</strong> Entries
           </div>
           <div className={styles.pageControls}>
              <button className={styles.pageBtn}>&lt;</button>
              <button className={`${styles.pageBtn} ${styles.activePage}`} style={{backgroundColor: '#FF9F43', color: 'white', border: 'none'}}>1</button>
              <button className={styles.pageBtn}>&gt;</button>
           </div>
        </div>
      </Card>

      <AddSupplierModal 
        isOpen={isAddOpen} 
        onClose={() => setIsAddOpen(false)} 
        supplierToEdit={editingSupplier}
        onSuccess={fetchSuppliers}
      />
    </DashboardLayout>
  );
};

export default SuppliersList;
