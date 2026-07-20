import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import Card from '../../../../components/ui/Card';
import styles from '../../purchase.module.css';
import { getDraftPurchases, deletePurchase } from '../../services/purchaseService';
import { getPurchaseStatusBadge } from '../../components/StatusBadge';
import { PlusCircle, Edit, Trash2, RefreshCw } from 'lucide-react';

const DraftPurchases = () => {
    const navigate = useNavigate();
    const [drafts, setDrafts] = useState([]);
    const [loading, setLoading] = useState(true);

    const load = async () => {
        setLoading(true);
        try {
            const data = await getDraftPurchases();
            setDrafts(data);
        } catch (e) { setDrafts([]); }
        setLoading(false);
    };

    useEffect(() => { load(); }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this draft?')) return;
        await deletePurchase(id);
        load();
    };

    const openEdit = (p) => { navigate(`/edit-purchase/${p._id}`); };

    return (
        <DashboardLayout>
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.title}>Draft Purchases</h1>
                    <p className={styles.subtitle}>Unfinished purchase orders</p>
                </div>
                <div className={styles.headerActions}>
                    <button className={styles.iconBtn} onClick={load}><RefreshCw size={18} /></button>
                    <button className={styles.btnPrimary} onClick={() => navigate('/create-purchase')}><PlusCircle size={18} /> New Draft</button>
                </div>
            </div>

            <Card className={styles.tableCard}>
                <div className={styles.tableResponsive}>
                    <table className={styles.productTable}>
                        <thead>
                            <tr>
                                <th>Purchase #</th>
                                <th>Vendor</th>
                                <th>Warehouse</th>
                                <th>Date</th>
                                <th>Items</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {drafts.map((p) => (
                                <tr key={p._id}>
                                    <td style={{ color: '#1B2850', fontWeight: 500 }}>{p.purchaseNumber}</td>
                                    <td>{p.vendor?.vendorName || '—'}</td>
                                    <td>{p.warehouse?.name || '—'}</td>
                                    <td>{p.purchaseDate ? new Date(p.purchaseDate).toLocaleDateString() : '—'}</td>
                                    <td>{p.items?.length || 0}</td>
                                    <td>{getPurchaseStatusBadge(p.status)}</td>
                                    <td>
                                        <div className={styles.actionCell}>
                                            <button className={styles.actionBtn} onClick={() => openEdit(p)}><Edit size={16} /></button>
                                            <button className={`${styles.actionBtn} ${styles.danger}`} onClick={() => handleDelete(p._id)}><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {!loading && drafts.length === 0 && (
                                <tr><td colSpan="7" className={styles.emptyState}>No draft purchases</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </DashboardLayout>
    );
};

export default DraftPurchases;
