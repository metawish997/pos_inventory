import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import Card from '../../../../components/ui/Card';
import Modal from '../../../../components/ui/Modal';
import styles from '../../purchase.module.css';
import { getPurchaseReturns, deletePurchaseReturn, getPurchases, createPurchaseReturn } from '../../services/purchaseService';
import { PlusCircle, Trash2, RefreshCw, FileText, FileSpreadsheet } from 'lucide-react';

const PurchaseReturn = () => {
    const [returns, setReturns] = useState([]);
    const [purchases, setPurchases] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedPurchase, setSelectedPurchase] = useState('');
    const [returnItems, setReturnItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const load = async () => {
        setLoading(true);
        try {
            const [r, p] = await Promise.all([getPurchaseReturns(), getPurchases('?status=Received')]);
            setReturns(r);
            setPurchases(p);
        } catch (e) { setReturns([]); setPurchases([]); }
        setLoading(false);
    };

    useEffect(() => { load(); }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this return? Stock will be restored.')) return;
        await deletePurchaseReturn(id);
        load();
    };

    const openReturn = () => {
        setSelectedPurchase('');
        setReturnItems([]);
        setError(null);
        setIsOpen(true);
    };

    const onSelectPurchase = async (pid) => {
        setSelectedPurchase(pid);
        try {
            const all = await getPurchases();
            const found = all.find((x) => x._id === pid);
            if (found) {
                setReturnItems(found.items.map((it) => ({
                    product: it.product?._id || it.product,
                    productName: it.product?.name || '',
                    variant: it.variant?._id || it.variant || null,
                    sku: it.sku,
                    purchasedQty: it.quantity,
                    returnQty: 0,
                    reason: ''
                })));
            }
        } catch (e) { setReturnItems([]); }
    };

    const updateReturnItem = (idx, field, value) => {
        setReturnItems((prev) => {
            const next = [...prev];
            next[idx] = { ...next[idx], [field]: value };
            return next;
        });
    };

    const submitReturn = async () => {
        setError(null);
        if (!selectedPurchase) return setError('Select a purchase');
        const valid = returnItems.filter((it) => Number(it.returnQty) > 0);
        if (valid.length === 0) return setError('Enter at least one return quantity');
        for (const it of valid) {
            if (Number(it.returnQty) > Number(it.purchasedQty)) return setError('Return qty exceeds purchased qty');
        }
        try {
            await createPurchaseReturn({ purchase: selectedPurchase, items: valid });
            setIsOpen(false);
            load();
        } catch (err) { setError(err.message); }
    };

    return (
        <DashboardLayout>
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.title}>Purchase Returns</h1>
                    <p className={styles.subtitle}>Return stock to vendors</p>
                </div>
                <div className={styles.headerActions}>
                    <button className={styles.iconBtn}><FileText size={18} color="#EA5455" /></button>
                    <button className={styles.iconBtn}><FileSpreadsheet size={18} color="#28C76F" /></button>
                    <button className={styles.iconBtn} onClick={load}><RefreshCw size={18} /></button>
                    <button className={styles.btnPrimary} onClick={openReturn}><PlusCircle size={18} /> New Return</button>
                </div>
            </div>

            <Card className={styles.tableCard}>
                <div className={styles.tableResponsive}>
                    <table className={styles.productTable}>
                        <thead>
                            <tr>
                                <th>Return #</th>
                                <th>Purchase</th>
                                <th>Vendor</th>
                                <th>Date</th>
                                <th>Items</th>
                                <th>Return Amount</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {returns.map((r) => (
                                <tr key={r._id}>
                                    <td style={{ color: '#1B2850', fontWeight: 500 }}>{r.returnNumber}</td>
                                    <td>{r.purchase?.purchaseNumber || '—'}</td>
                                    <td>{r.vendor?.vendorName || '—'}</td>
                                    <td>{r.returnDate ? new Date(r.returnDate).toLocaleDateString() : '—'}</td>
                                    <td>{r.items?.length || 0}</td>
                                    <td>₹{(r.totalReturnAmount || 0).toFixed(2)}</td>
                                    <td>
                                        <div className={styles.actionCell}>
                                            <button className={`${styles.actionBtn} ${styles.danger}`} onClick={() => handleDelete(r._id)}><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {!loading && returns.length === 0 && (
                                <tr><td colSpan="7" className={styles.emptyState}>No purchase returns</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="New Purchase Return" maxWidth="900px">
                <div className={styles.formRow}>
                    <div className={styles.formCol}>
                        <label>Purchase (Received) <span className={styles.required}>*</span></label>
                        <select className={styles.select} value={selectedPurchase} onChange={(e) => onSelectPurchase(e.target.value)}>
                            <option value="">Select Purchase</option>
                            {purchases.map((p) => <option key={p._id} value={p._id}>{p.purchaseNumber} — {p.vendor?.vendorName}</option>)}
                        </select>
                    </div>
                </div>

                <div className={styles.itemsTableWrap}>
                    <table className={styles.itemsTable}>
                        <thead>
                            <tr><th>Product</th><th>SKU</th><th>Purchased</th><th>Return Qty</th><th>Reason</th></tr>
                        </thead>
                        <tbody>
                            {returnItems.map((it, idx) => (
                                <tr key={idx}>
                                    <td>{it.productName}</td>
                                    <td>{it.sku}</td>
                                    <td>{it.purchasedQty}</td>
                                    <td><input type="number" min="0" max={it.purchasedQty} value={it.returnQty} onChange={(e) => updateReturnItem(idx, 'returnQty', e.target.value)} style={{ width: 80 }} /></td>
                                    <td><input className={styles.input} value={it.reason} onChange={(e) => updateReturnItem(idx, 'reason', e.target.value)} /></td>
                                </tr>
                            ))}
                            {returnItems.length === 0 && <tr><td colSpan="5" className={styles.emptyState}>Select a received purchase to load items</td></tr>}
                        </tbody>
                    </table>
                </div>

                {error && <div style={{ color: '#EA5455', margin: '1rem 0', fontSize: '0.875rem' }}>{error}</div>}

                <div className={styles.footerActions}>
                    <button type="button" className={styles.btnCancel} onClick={() => setIsOpen(false)}>Cancel</button>
                    <button type="button" className={styles.btnSubmit} onClick={submitReturn}>Submit Return</button>
                </div>
            </Modal>
        </DashboardLayout>
    );
};

export default PurchaseReturn;