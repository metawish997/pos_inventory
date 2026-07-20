import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css'; // Reusing global list styles
import { Search, FileText, FileSpreadsheet, RefreshCw, ChevronUp, Edit, Trash2, PlusCircle } from 'lucide-react';
import AddTaxModal from '../components/modals/AddTaxModal';
import EditTaxModal from '../components/modals/EditTaxModal';
import { getTaxes, deleteTax } from '../services/inventoryService';

const TaxList = () => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedTax, setSelectedTax] = useState(null);
    const [taxes, setTaxes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTaxes = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getTaxes();
            setTaxes(data);
        } catch (err) {
            console.error(err);
            setError(err.message || 'Failed to fetch tax list');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchTaxes(); }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this tax config?')) {
            try {
                await deleteTax(id);
                setTaxes(prev => prev.filter(t => t._id !== id));
            } catch (err) {
                alert(err.message);
            }
        }
    };

    const handleEdit = (item) => {
        setSelectedTax(item);
        setIsEditModalOpen(true);
    };

    return (
        <DashboardLayout>
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.title}>Tax Master</h1>
                    <p className={styles.subtitle}>Configure tax rates and sub-components</p>
                </div>
                <div className={styles.headerActions}>
                    <button className={styles.iconBtn}><FileText size={18} color="#EA5455" /></button>
                    <button className={styles.iconBtn}><FileSpreadsheet size={18} color="#28C76F" /></button>
                    <button className={styles.iconBtn}><RefreshCw size={18} onClick={fetchTaxes} /></button>
                    <button className={styles.iconBtn}><ChevronUp size={18} /></button>
                    <button className={styles.btnPrimary} onClick={() => setIsAddModalOpen(true)}>
                        <PlusCircle size={18} /> Add Tax Rate
                    </button>
                </div>
            </div>

            <Card className={styles.tableCard}>
                <div className={styles.filterBar}>
                    <div className={styles.searchBox}>
                        <Search size={18} className={styles.searchIcon} />
                        <input type="text" placeholder="Search tax records..." />
                    </div>
                </div>

                <div className={styles.tableResponsive}>
                    {error && <div style={{ color: 'red', marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#fee2e2', borderRadius: '4px' }}>{error}</div>}
                    <table className={styles.productTable}>
                        <thead>
                            <tr>
                                <th><input type="checkbox" /></th>
                                <th>Tax Type Name</th>
                                <th>Total Value (%)</th>
                                <th>Components Split</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>Loading taxes...</td></tr>
                            ) : taxes.length === 0 ? (
                                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No tax rates found</td></tr>
                            ) : (
                                taxes.map((item) => (
                                    <tr key={item._id}>
                                        <td><input type="checkbox" /></td>
                                        <td><strong>{item.name}</strong></td>
                                        <td>{item.taxValue}%</td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                                {item.components && item.components.length > 0 ? (
                                                    item.components.map((comp, idx) => (
                                                        <span key={idx} style={{ backgroundColor: '#EDF2F7', color: '#4A5568', padding: '2px 6px', borderRadius: '4px', fontSize: '11px' }}>
                                                            {comp.name}: {comp.value}%
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span style={{ color: '#A0AEC0' }}>— Single Value</span>
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            <span style={{ backgroundColor: item.status === 'Active' ? '#28C76F' : '#EA5455', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>
                                                • {item.status || 'Active'}
                                            </span>
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

            <AddTaxModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSuccess={fetchTaxes} />
            <EditTaxModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} onSuccess={fetchTaxes} tax={selectedTax} />
        </DashboardLayout>
    );
};

export default TaxList;