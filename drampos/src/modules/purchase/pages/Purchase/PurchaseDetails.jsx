import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import Card from '../../../../components/ui/Card';
import styles from '../../purchase.module.css';
import { getPurchaseById } from '../../services/purchaseService';
import { getPurchaseStatusBadge } from '../../components/StatusBadge';

const PurchaseDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [purchase, setPurchase] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getPurchaseById(id);
                setPurchase(data);
            } catch (e) { setPurchase(null); }
            setLoading(false);
        };
        load();
    }, [id]);

    if (loading) return <DashboardLayout><div className={styles.emptyState}>Loading...</div></DashboardLayout>;
    if (!purchase) return <DashboardLayout><div className={styles.emptyState}>Purchase not found</div></DashboardLayout>;

    return (
        <DashboardLayout>
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.title}>Purchase {purchase.purchaseNumber}</h1>
                    <p className={styles.subtitle}>Purchase order details</p>
                </div>
                <div className={styles.headerActions}>
                    <button className={styles.btnDark} onClick={() => navigate('/purchase-orders')}>Back to List</button>
                </div>
            </div>

            <Card className={styles.detailCard}>
                <div className={styles.detailRow}><span>Vendor</span><span>{purchase.vendor?.vendorName} {purchase.vendor?.vendorCode ? `(${purchase.vendor.vendorCode})` : ''}</span></div>
                <div className={styles.detailRow}><span>Warehouse</span><span>{purchase.warehouse?.name}</span></div>
                <div className={styles.detailRow}><span>Purchase Date</span><span>{purchase.purchaseDate ? new Date(purchase.purchaseDate).toLocaleDateString() : '—'}</span></div>
                <div className={styles.detailRow}><span>Invoice Number</span><span>{purchase.invoiceNumber || '—'}</span></div>
                <div className={styles.detailRow}><span>Invoice Date</span><span>{purchase.invoiceDate ? new Date(purchase.invoiceDate).toLocaleDateString() : '—'}</span></div>
                <div className={styles.detailRow}><span>Due Date</span><span>{purchase.dueDate ? new Date(purchase.dueDate).toLocaleDateString() : '—'}</span></div>
                <div className={styles.detailRow}><span>Reference</span><span>{purchase.referenceNumber || '—'}</span></div>
                <div className={styles.detailRow}><span>Status</span><span>{getPurchaseStatusBadge(purchase.status)}</span></div>
            </Card>

            <Card className={styles.tableCard}>
                <div className={styles.tableResponsive}>
                    <table className={styles.productTable}>
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Variant</th>
                                <th>SKU</th>
                                <th>Qty</th>
                                <th>Free Qty</th>
                                <th>Rate</th>
                                <th>Disc</th>
                                <th>Tax</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {purchase.items.map((it, i) => (
                                <tr key={i}>
                                    <td>{it.product?.name || '—'}</td>
                                    <td>{it.variant?.variantLabel || (it.variant ? 'Variant' : '—')}</td>
                                    <td>{it.sku || '—'}</td>
                                    <td>{it.quantity}</td>
                                    <td>{it.freeQuantity || 0}</td>
                                    <td>₹{it.purchasePrice}</td>
                                    <td>{it.discountType ? `${it.discount}${it.discountType === 'Percentage' ? '%' : ''}` : '—'}</td>
                                    <td>{it.taxRate ? `${it.taxRate}%` : '—'}</td>
                                    <td>₹{(it.total || 0).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className={styles.totalsBox}>
                    <div className={styles.totalsRow}><span>Subtotal</span><span>₹{(purchase.subtotal || 0).toFixed(2)}</span></div>
                    <div className={styles.totalsRow}><span>Discount</span><span>₹{(purchase.totalDiscount || 0).toFixed(2)}</span></div>
                    <div className={styles.totalsRow}><span>Tax</span><span>₹{(purchase.totalTax || 0).toFixed(2)}</span></div>
                    <div className={styles.totalsRow}><span>Shipping</span><span>₹{(purchase.shipping || 0).toFixed(2)}</span></div>
                    <div className={styles.totalsRow}><span>Round Off</span><span>₹{(purchase.roundOff || 0).toFixed(2)}</span></div>
                    <div className={`${styles.totalsRow} ${styles.grand}`}><span>Grand Total</span><span>₹{(purchase.grandTotal || 0).toFixed(2)}</span></div>
                </div>
            </Card>
        </DashboardLayout>
    );
};

export default PurchaseDetails;