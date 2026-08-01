import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css';
import { RefreshCw, Printer } from 'lucide-react';
import { API_BASE_URL } from '../api/endpoints';

const GSTR3BReport = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchGSTR3B = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      const res = await fetch(`${API_BASE_URL}/gst/gstr-3b?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGSTR3B();
  }, []);

  const handleGenerateReport = (e) => {
    e.preventDefault();
    fetchGSTR3B();
  };

  const handleResetFilters = () => {
    setStartDate('');
    setEndDate('');
    setTimeout(() => fetchGSTR3B(), 0);
  };

  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>GSTR-3B Summary</h1>
          <p className={styles.subtitle}>Monthly consolidated outward supplies, eligible ITC & net tax liability</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.iconBtn} onClick={fetchGSTR3B} title="Reload"><RefreshCw size={18} /></button>
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

      {loading || !data ? (
        <Card style={{padding: '3rem', textAlign: 'center', color: '#6B7280'}}>Loading GSTR-3B Summary...</Card>
      ) : (
        <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
          {/* Summary Cards */}
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem'}}>
            <Card style={{padding: '1.5rem', border: '1px solid #EA5455', display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
              <div style={{color: '#6B7280', fontSize: '0.875rem'}}>Outward supplies Tax (A)</div>
              <div style={{fontSize: '1.5rem', fontWeight: 600, color: '#EA5455'}}>₹{data.outwardSupplies.totalTax.toFixed(2)}</div>
              <div style={{fontSize: '11px', color: '#9CA3AF'}}>CGST: ₹{data.outwardSupplies.cgst.toFixed(2)} | SGST: ₹{data.outwardSupplies.sgst.toFixed(2)} | IGST: ₹{data.outwardSupplies.igst.toFixed(2)}</div>
            </Card>
            <Card style={{padding: '1.5rem', border: '1px solid #28C76F', display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
              <div style={{color: '#6B7280', fontSize: '0.875rem'}}>Eligible Inward ITC (B)</div>
              <div style={{fontSize: '1.5rem', fontWeight: 600, color: '#28C76F'}}>₹{data.eligibleITC.totalTax.toFixed(2)}</div>
              <div style={{fontSize: '11px', color: '#9CA3AF'}}>CGST: ₹{data.eligibleITC.cgst.toFixed(2)} | SGST: ₹{data.eligibleITC.sgst.toFixed(2)} | IGST: ₹{data.eligibleITC.igst.toFixed(2)}</div>
            </Card>
            <Card style={{padding: '1.5rem', border: '1px solid #FF9F43', display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
              <div style={{color: '#6B7280', fontSize: '0.875rem'}}>Net Payable Tax (A - B)</div>
              <div style={{fontSize: '1.5rem', fontWeight: 600, color: '#FF9F43'}}>₹{data.netLiability.totalTax.toFixed(2)}</div>
              <div style={{fontSize: '11px', color: '#9CA3AF'}}>CGST: ₹{data.netLiability.cgst.toFixed(2)} | SGST: ₹{data.netLiability.sgst.toFixed(2)} | IGST: ₹{data.netLiability.igst.toFixed(2)}</div>
            </Card>
          </div>

          {/* Detailed GSTR-3B Table */}
          <Card className={styles.tableCard}>
            <div style={{padding: '1.5rem', borderBottom: '1px solid #F3F4F6'}}>
              <h2 style={{fontSize: '1rem', fontWeight: 600, color: '#1B2850', margin: 0}}>Tax Details Breakdown</h2>
            </div>
            <div className={styles.tableResponsive}>
              <table className={styles.productTable}>
                <thead>
                  <tr>
                    <th>Detail Section</th>
                    <th>Taxable Value</th>
                    <th>Integrated Tax (IGST)</th>
                    <th>Central Tax (CGST)</th>
                    <th>State/UT Tax (SGST)</th>
                    <th>Total Tax Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{fontWeight: 600, color: '#1B2850'}}>1. Outward Taxable Supplies (Sales)</td>
                    <td>₹{data.outwardSupplies.taxableValue.toFixed(2)}</td>
                    <td>₹{data.outwardSupplies.igst.toFixed(2)}</td>
                    <td>₹{data.outwardSupplies.cgst.toFixed(2)}</td>
                    <td>₹{data.outwardSupplies.sgst.toFixed(2)}</td>
                    <td style={{fontWeight: 600, color: '#EA5455'}}>₹{data.outwardSupplies.totalTax.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td style={{fontWeight: 600, color: '#1B2850'}}>2. Eligible Input Tax Credit (ITC)</td>
                    <td>₹{data.eligibleITC.taxableValue.toFixed(2)}</td>
                    <td>₹{data.eligibleITC.igst.toFixed(2)}</td>
                    <td>₹{data.eligibleITC.cgst.toFixed(2)}</td>
                    <td>₹{data.eligibleITC.sgst.toFixed(2)}</td>
                    <td style={{fontWeight: 600, color: '#28C76F'}}>₹{data.eligibleITC.totalTax.toFixed(2)}</td>
                  </tr>
                  <tr style={{borderTop: '2px solid #E5E7EB', backgroundColor: '#F9FAFB'}}>
                    <td style={{fontWeight: 700, color: '#1B2850'}}>Net Tax Payable Liability</td>
                    <td>—</td>
                    <td style={{fontWeight: 600}}>₹{data.netLiability.igst.toFixed(2)}</td>
                    <td style={{fontWeight: 600}}>₹{data.netLiability.cgst.toFixed(2)}</td>
                    <td style={{fontWeight: 600}}>₹{data.netLiability.sgst.toFixed(2)}</td>
                    <td style={{fontWeight: 700, color: '#FF9F43'}}>₹{data.netLiability.totalTax.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
};

export default GSTR3BReport;
