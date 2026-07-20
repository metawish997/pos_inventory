import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import Card from '../../../../components/ui/Card';
import styles from '../../purchase.module.css';
import { getVendors, deleteVendor } from '../../services/purchaseService';
import { Search, PlusCircle, Eye, Edit, Trash2, FileText, FileSpreadsheet, RefreshCw } from 'lucide-react';

const VendorList = () => {
    const [vendors, setVendors] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const load = async () => {
        setLoading(true);
        try {
            const data = await getVendors(search ? `?search=${encodeURIComponent(search)}` : '');
            setVendors(data);
        } catch (e) { setVendors([]); }
        setLoading(false);
    };

    useEffect(() => { load(); }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this vendor?')) return;
        await deleteVendor(id);
        load();
    };

    const openAdd = () => { navigate('/create-vendor'); };
    const openEdit = (v) => { navigate(`/edit-vendor/${v._id}`); };

    return (
        <DashboardLayout>
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.title}>Vendors</h1>
                    <p className={styles.subtitle}>Manage your vendors / suppliers</p>
                </div>
                <div className={styles.headerActions}>
                    <button className={styles.iconBtn}><FileText size={18} color="#EA5455" /></button>
                    <button className={styles.iconBtn}><FileSpreadsheet size={18} color="#28C76F" /></button>
                    <button className={styles.iconBtn} onClick={load}><RefreshCw size={18} /></button>
                    <button className={styles.btnPrimary} onClick={openAdd}><PlusCircle size={18} /> Add Vendor</button>
                </div>
            </div>

            <Card className={styles.tableCard}>
                <div className={styles.filterBar}>
                    <div className={styles.searchBox}>
                        <Search size={18} className={styles.searchIcon} />
                        <input type="text" placeholder="Search vendors..." value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && load()} />
                    </div>
                </div>

                <div className={styles.tableResponsive}>
                    <table className={styles.productTable}>
                        <thead>
                            <tr>
                                <th>Code</th>
                                <th>Vendor Name</th>
                                <th>Company</th>
                                <th>Email</th>
                                <th>Mobile</th>
                                <th>GSTIN</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vendors.map((v) => (
                                <tr key={v._id}>
                                    <td>{v.vendorCode || '—'}</td>
                                    <td style={{ color: '#1B2850', fontWeight: 500 }}>{v.vendorName}</td>
                                    <td>{v.companyName || '—'}</td>
                                    <td>{v.email || '—'}</td>
                                    <td>{v.mobile || '—'}</td>
                                    <td>{v.gstin || '—'}</td>
                                    <td>
                                        <span style={{ backgroundColor: v.status === 'Active' ? '#E5F8ED' : '#FCEAEA', color: v.status === 'Active' ? '#28C76F' : '#EA5455', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>{v.status}</span>
                                    </td>
                                    <td>
                                        <div className={styles.actionCell}>
                                            <button className={styles.actionBtn} onClick={() => openEdit(v)}><Edit size={16} /></button>
                                            <button className={`${styles.actionBtn} ${styles.danger}`} onClick={() => handleDelete(v._id)}><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {!loading && vendors.length === 0 && (
                                <tr><td colSpan="8" className={styles.emptyState}>No vendors found</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </DashboardLayout>
    );
};

export default VendorList;