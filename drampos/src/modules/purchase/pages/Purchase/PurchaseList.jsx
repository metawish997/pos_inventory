import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import Card from '../../../../components/ui/Card';
import styles from '../../purchase.module.css';
import { getPurchases, deletePurchase, approvePurchase } from '../../services/purchaseService';
import { getPurchaseStatusBadge } from '../../components/StatusBadge';
import { Search, PlusCircle, Eye, Edit, Trash2, FileText, FileSpreadsheet, RefreshCw, CheckCircle } from 'lucide-react';

const PurchaseList = () => {
    const navigate = useNavigate();
    const [purchases, setPurchases] = useState([]);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(true);

    const load = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            if (status) params.append('status', status);
            const data = await getPurchases(params.toString() ? `?${params}` : '');
            setPurchases(data);
        } catch (e) { setPurchases([]); }
        setLoading(false);
    };

    useEffect(() => { load(); }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this purchase? Stock will be reversed if already received.')) return;
        await deletePurchase(id);
        load();
    };

    const handleApprove = async (id) => {
        await approvePurchase(id);
        load();
    };

    const openAdd = () => { navigate('/create-purchase'); };
    const openEdit = (p) => { navigate(`/edit-purchase/${p._id}`); };

    return (
        <DashboardLayout>
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.title}>Purchase Orders</h1>
                    <p className={styles.subtitle}>Manage purchase orders & receipts</p>
                </div>
                <div className={styles.headerActions}>
                    <button className={styles.iconBtn}><FileText size={18} color="#EA5455" /></button>
                    <button className={styles.iconBtn}><FileSpreadsheet size={18} color="#28C76F" /></button>
                    <button className={styles.iconBtn} onClick={load}><RefreshCw size={18} /></button>
                    <button className={styles.btnPrimary} onClick={openAdd}><PlusCircle size={18} /> Add Purchase</button>
                </div>
            </div>

            <Card className={styles.tableCard}>
                <div className={styles.filterBar}>
                    <div className={styles.searchBox}>
                        <Search size={18} className={styles.searchIcon} />
                        <input type="text" placeholder="Search purchase / invoice..." value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && load()} />
                    </div>
                    <div className={styles.filters}>
                        <select className={styles.select} value={status} onChange={(e) => setStatus(e.target.value)}>
                            <option value="">All Status</option>
                            <option>Draft</option>
                            <option>Pending</option>
                            <option>Approved</option>
                            <option>Received</option>
                            <option>Completed</option>
                            <option>Cancelled</option>
                        </select>
                    </div>
                </div>

                <div className={styles.tableResponsive}>
                    <table className={styles.productTable}>
                        <thead>
                            <tr>
                                <th>Purchase #</th>
                                <th>Vendor</th>
                                <th>Warehouse</th>
                                <th>Date</th>
                                <th>Invoice</th>
                                <th>Status</th>
                                <th>Grand Total</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {purchases.map((p) => (
                                <tr key={p._id}>
                                    <td style={{ color: '#1B2850', fontWeight: 500 }}>{p.purchaseNumber}</td>
                                    <td>{p.vendor?.vendorName || '—'}</td>
                                    <td>{p.warehouse?.name || '—'}</td>
                                    <td>{p.purchaseDate ? new Date(p.purchaseDate).toLocaleDateString() : '—'}</td>
                                    <td>{p.invoiceNumber || '—'}</td>
                                    <td>{getPurchaseStatusBadge(p.status)}</td>
                                    <td>₹{(p.grandTotal || 0).toFixed(2)}</td>
                                    <td>
                                        <div className={styles.actionCell}>
                                            <button className={styles.actionBtn} onClick={() => navigate(`/purchase-details/${p._id}`)}><Eye size={16} /></button>
                                            <button className={styles.actionBtn} onClick={() => openEdit(p)}><Edit size={16} /></button>
                                            {p.status === 'Pending' && (
                                                <button className={styles.actionBtn} onClick={() => handleApprove(p._id)} title="Approve"><CheckCircle size={16} color="#28C76F" /></button>
                                            )}
                                            <button className={`${styles.actionBtn} ${styles.danger}`} onClick={() => handleDelete(p._id)}><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {!loading && purchases.length === 0 && (
                                <tr><td colSpan="8" className={styles.emptyState}>No purchases found</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </DashboardLayout>
    );
};

export default PurchaseList;