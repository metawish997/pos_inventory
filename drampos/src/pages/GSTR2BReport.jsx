import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css';
import { RefreshCw, Printer } from 'lucide-react';
import { API_BASE_URL } from '../api/endpoints';

const GSTR2BReport = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchGSTR2B = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      const res = await fetch(`${API_BASE_URL}/gst/gstr-2b?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setRecords(json.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGSTR2B();
  }, []);

  const handleGenerateReport = (e) => {
    e.preventDefault();
    fetchGSTR2B();
  };

  const handleResetFilters = () => {
    setStartDate('');
    setEndDate('');
    setTimeout(() => fetchGSTR2B(), 0);
  };

  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>GSTR-2B Purchase Report (ITC)</h1>
          <p className={styles.subtitle}>Inward supplies & Input Tax Credits claimed from vendor purchases</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.iconBtn} onClick={fetchGSTR2B} title="Reload"><RefreshCw size={18} /></button>
          <button className={styles.iconBtn} onClick={() => window.print()} title="Print"><Printer size={18} /></button>
        </div>
      </div>

      {/* Date Filters */}
      <Card style={{padding: '1.5rem', marginBottom: '1.5rem'}}>
        <form onSubmit={handleGenerateReport} style={{display: 'flex', gap: '1.5rem', alignItems: 'flex-end', flexWrap: 'wrap'}}>
          <div style={{flex: '1 1 200px'}}>
            <label style={{display: 'block', fontSize: '0.875rem', color: '#1B2850', marginBottom: '0.5rem', fontWeight: 500}}>Start Date</label>
            <input type="date" className={styles.input} value={startDate} onChange={e => setStartDate(e.target.value)} />
          </div>
          <div style={{flex: '1 1 200px'}}>
            <label style={{display: 'block', fontSize: '0.875rem', color: '#1B2850', marginBottom: '0.5rem', fontWeight: 500}}>End Date</label>
            <input type="date" className={styles.input} value={endDate} onChange={e => setEndDate(e.target.value)} />
          </div>
          <div>
            <button type="submit" className={styles.btnPrimary} style={{backgroundColor: '#FF9F43', color: 'white', border: 'none', height: '40px', padding: '0 1.5rem', borderRadius: '4px', cursor: 'pointer'}}>
              Generate Report
            </button>
          </div>
          <div>
            <button type="button" className={styles.iconBtn} style={{height: '40px'}} onClick={handleResetFilters}>
              Reset
            </button>
          </div>
        </form>
      </Card>

      <Card className={styles.tableCard}>
        <div className={styles.tableResponsive}>
          {loading ? (
            <div style={{padding: '3rem', textAlign: 'center', color: '#6B7280'}}>Loading purchase ITC data...</div>
          ) : records.length === 0 ? (
            <div style={{padding: '3rem', textAlign: 'center', color: '#6B7280'}}>No purchase invoices found.</div>
          ) : (
            <table className={styles.productTable}>
              <thead>
                <tr>
                  <th>Purchase No</th>
                  <th>Invoice No</th>
                  <th>Invoice Date</th>
                  <th>Vendor Name</th>
                  <th>GSTIN</th>
                  <th>Place of Supply</th>
                  <th>Taxable Value</th>
                  <th>CGST</th>
                  <th>SGST</th>
                  <th>IGST</th>
                  <th>Total Tax</th>
                  <th>Total Purchase</th>
                </tr>
              </thead>
              <tbody>
                {records.map((rec, idx) => (
                  <tr key={idx}>
                    <td style={{color: '#6B7280'}}>{rec.purchaseNo}</td>
                    <td style={{color: '#1B2850', fontWeight: 600}}>{rec.invoiceNo}</td>
                    <td>{new Date(rec.invoiceDate).toLocaleDateString('en-GB')}</td>
                    <td>{rec.vendorName}</td>
                    <td><span style={{backgroundColor: '#FFF5EA', color: '#FF9F43', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 600}}>{rec.gstin}</span></td>
                    <td>{rec.placeOfSupply}</td>
                    <td>₹{rec.taxableValue.toFixed(2)}</td>
                    <td style={{color: '#6B7280'}}>₹{rec.cgst.toFixed(2)}</td>
                    <td style={{color: '#6B7280'}}>₹{rec.sgst.toFixed(2)}</td>
                    <td style={{color: '#6B7280'}}>₹{rec.igst.toFixed(2)}</td>
                    <td style={{color: '#EA5455', fontWeight: 500}}>₹{rec.totalTax.toFixed(2)}</td>
                    <td style={{fontWeight: 600}}>₹{rec.grandTotal.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </DashboardLayout>
  );
};

export default GSTR2BReport;
