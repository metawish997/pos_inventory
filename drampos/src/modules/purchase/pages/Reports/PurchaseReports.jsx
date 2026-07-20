import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import Card from '../../../../components/ui/Card';
import styles from '../../purchase.module.css';
import { getVendorPurchaseReport, getGstSummary, getWarehousePurchaseReport } from '../../services/purchaseService';
import { FileText, FileSpreadsheet, RefreshCw } from 'lucide-react';

const PurchaseReports = () => {
    const [vendorReport, setVendorReport] = useState([]);
    const [gstReport, setGstReport] = useState([]);
    const [warehouseReport, setWarehouseReport] = useState([]);
    const [loading, setLoading] = useState(true);

    const load = async () => {
        setLoading(true);
        try {
            const [v, g, w] = await Promise.all([
                getVendorPurchaseReport(), getGstSummary(), getWarehousePurchaseReport()
            ]);
            setVendorReport(v); setGstReport(g); setWarehouseReport(w);
        } catch (e) { /* ignore */ }
        setLoading(false);
    };

    useEffect(() => { load(); }, []);

    const ReportTable = ({ title, headers, rows, emptyMsg }) => (
        <Card className={styles.tableCard} style={{ marginBottom: '1.5rem' }}>
            <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)', fontWeight: 700, color: 'var(--color-navy)' }}>{title}</div>
            <div className={styles.tableResponsive}>
                <table className={styles.productTable}>
                    <thead><tr>{headers.map((h, i) => <th key={i}>{h}</th>)}</tr></thead>
                    <tbody>
                        {rows.map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>)}
                        {rows.length === 0 && <tr><td colSpan={headers.length} className={styles.emptyState}>{emptyMsg}</td></tr>}
                    </tbody>
                </table>
            </div>
        </Card>
    );

    return (
        <DashboardLayout>
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.title}>Purchase Reports</h1>
                    <p className={styles.subtitle}>Vendor, GST, warehouse & return reports</p>
                </div>
                <div className={styles.headerActions}>
                    <button className={styles.iconBtn}><FileText size={18} color="#EA5455" /></button>
                    <button className={styles.iconBtn}><FileSpreadsheet size={18} color="#28C76F" /></button>
                    <button className={styles.iconBtn} onClick={load}><RefreshCw size={18} /></button>
                </div>
            </div>

            <ReportTable
                title="Vendor Purchase Report"
                headers={['Vendor', 'Code', 'Orders', 'Total Amount']}
                rows={vendorReport.map((v) => [v.vendor, v.vendorCode || '—', v.purchaseCount, `₹${v.totalAmount.toFixed(2)}`])}
                emptyMsg="No vendor purchases"
            />

            <ReportTable
                title="GST Summary"
                headers={['Tax Rate', 'Taxable', 'Tax Amount']}
                rows={gstReport.map((g) => [`${g.taxRate}%`, `₹${g.taxable.toFixed(2)}`, `₹${g.taxAmount.toFixed(2)}`])}
                emptyMsg="No GST data"
            />

            <ReportTable
                title="Warehouse Purchase Report"
                headers={['Warehouse', 'Orders', 'Total Amount']}
                rows={warehouseReport.map((w) => [w.warehouse, w.purchaseCount, `₹${w.totalAmount.toFixed(2)}`])}
                emptyMsg="No warehouse purchases"
            />
        </DashboardLayout>
    );
};

export default PurchaseReports;