import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import Card from '../../../../components/ui/Card';
import styles from '../../purchase.module.css';
import { getPurchaseSummary, getVendorPurchaseReport, getGstSummary, getWarehousePurchaseReport, getPurchaseReturnReport } from '../../services/purchaseService';
import { ShoppingBag, Users, FileText, TrendingUp, Package, ArrowLeftRight } from 'lucide-react';

const StatCard = ({ icon, title, value, color }) => (
    <Card className={styles.detailCard} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: 0 }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>{icon}</div>
        <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{title}</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-navy)' }}>{value}</div>
        </div>
    </Card>
);

const PurchaseDashboard = () => {
    const navigate = useNavigate();
    const [summary, setSummary] = useState(null);
    const [vendorReport, setVendorReport] = useState([]);
    const [gstReport, setGstReport] = useState([]);
    const [warehouseReport, setWarehouseReport] = useState([]);
    const [returnReport, setReturnReport] = useState(null);

    useEffect(() => {
        const load = async () => {
            try {
                const [s, v, g, w, r] = await Promise.all([
                    getPurchaseSummary(), getVendorPurchaseReport(), getGstSummary(), getWarehousePurchaseReport(), getPurchaseReturnReport()
                ]);
                setSummary(s); setVendorReport(v); setGstReport(g); setWarehouseReport(w); setReturnReport(r);
            } catch (e) { /* ignore */ }
        };
        load();
    }, []);

    return (
        <DashboardLayout>
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.title}>Purchase Dashboard</h1>
                    <p className={styles.subtitle}>Overview of your purchasing activity</p>
                </div>
                <div className={styles.headerActions}>
                    <button className={styles.btnPrimary} onClick={() => navigate('/purchase-orders')}><ShoppingBag size={18} /> Purchases</button>
                    <button className={styles.btnDark} onClick={() => navigate('/vendors')}><Users size={18} /> Vendors</button>
                </div>
            </div>

            <div className={styles.statGrid}>
                <StatCard icon={<FileText size={22} />} title="Total Purchases" value={summary?.total || 0} color="#FF9F43" />
                <StatCard icon={<TrendingUp size={22} />} title="Total Amount" value={`₹${(summary?.totalAmount || 0).toFixed(2)}`} color="#28C76F" />
                <StatCard icon={<ArrowLeftRight size={22} />} title="Returns" value={returnReport?.count || 0} color="#EA5455" />
                <StatCard icon={<Package size={22} />} title="Return Value" value={`₹${(returnReport?.totalReturnAmount || 0).toFixed(2)}`} color="#7367F0" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
                <Card className={styles.detailCard}>
                    <h3 style={{ marginBottom: '1rem', color: 'var(--color-navy)' }}>Status Breakdown</h3>
                    {summary && Object.entries(summary.byStatus || {}).map(([k, v]) => (
                        <div key={k} className={styles.detailRow}><span>{k}</span><span>{v}</span></div>
                    ))}
                    {(!summary || Object.keys(summary?.byStatus || {}).length === 0) && <div className={styles.emptyState}>No data</div>}
                </Card>

                <Card className={styles.detailCard}>
                    <h3 style={{ marginBottom: '1rem', color: 'var(--color-navy)' }}>GST Summary</h3>
                    {gstReport.map((g, i) => (
                        <div key={i} className={styles.detailRow}><span>{g.taxRate}% GST</span><span>₹{g.taxAmount.toFixed(2)}</span></div>
                    ))}
                    {gstReport.length === 0 && <div className={styles.emptyState}>No data</div>}
                </Card>

                <Card className={styles.detailCard}>
                    <h3 style={{ marginBottom: '1rem', color: 'var(--color-navy)' }}>Warehouse Purchases</h3>
                    {warehouseReport.map((w, i) => (
                        <div key={i} className={styles.detailRow}><span>{w.warehouse}</span><span>₹{w.totalAmount.toFixed(2)}</span></div>
                    ))}
                    {warehouseReport.length === 0 && <div className={styles.emptyState}>No data</div>}
                </Card>

                <Card className={styles.detailCard}>
                    <h3 style={{ marginBottom: '1rem', color: 'var(--color-navy)' }}>Top Vendors</h3>
                    {vendorReport.slice(0, 6).map((v, i) => (
                        <div key={i} className={styles.detailRow}><span>{v.vendor}</span><span>₹{v.totalAmount.toFixed(2)}</span></div>
                    ))}
                    {vendorReport.length === 0 && <div className={styles.emptyState}>No data</div>}
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default PurchaseDashboard;