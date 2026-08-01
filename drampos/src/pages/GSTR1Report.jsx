import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css';
import { RefreshCw, Printer, Calendar, FileText } from 'lucide-react';
import { API_BASE_URL } from '../api/endpoints';

const GSTR1Report = () => {
  const [activeTab, setActiveTab] = useState('b2b'); // 'b2b', 'b2c', 'hsn', 'docs'
  const [data, setData] = useState({ b2b: [], b2c: [], hsnSummary: [], documentSummary: {} });
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchGSTR1 = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      const res = await fetch(`${API_BASE_URL}/gst/gstr-1?${params.toString()}`);
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
    fetchGSTR1();
  }, []);

  const handleGenerateReport = (e) => {
    e.preventDefault();
    fetchGSTR1();
  };

  const handleResetFilters = () => {
    setStartDate('');
    setEndDate('');
    setTimeout(() => fetchGSTR1(), 0);
  };

  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>GSTR-1 Sales Report</h1>
          <p className={styles.subtitle}>Outward supplies, B2B, B2C, HSN summaries & document sequences</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.iconBtn} onClick={fetchGSTR1} title="Reload"><RefreshCw size={18} /></button>
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

      {/* Tabs */}
      <div style={{display: 'flex', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid #E5E7EB', paddingBottom: '0.5rem'}}>
        {[
          { key: 'b2b', label: 'B2B Invoices' },
          { key: 'b2c', label: 'B2C Invoices' },
          { key: 'hsn', label: 'HSN/SAC Summary' },
          { key: 'docs', label: 'Document Summary' }
        ].map(tab => (
          <button 
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '0.5rem 1rem', 
              backgroundColor: activeTab === tab.key ? '#FF9F43' : 'transparent',
              color: activeTab === tab.key ? 'white' : '#6B7280', 
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 500,
              fontSize: '0.875rem'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <Card className={styles.tableCard}>
        {loading ? (
          <div style={{padding: '3rem', textAlign: 'center', color: '#6B7280'}}>Loading report data...</div>
        ) : (
          <div className={styles.tableResponsive}>
            {activeTab === 'b2b' && (
              <table className={styles.productTable}>
                <thead>
                  <tr>
                    <th>Invoice No</th>
                    <th>Invoice Date</th>
                    <th>Customer Name</th>
                    <th>GSTIN</th>
                    <th>Place of Supply</th>
                    <th>Taxable Value</th>
                    <th>Tax Amount</th>
                    <th>Invoice Value</th>
                  </tr>
                </thead>
                <tbody>
                  {data.b2b.length === 0 ? (
                    <tr><td colSpan="8" style={{textAlign: 'center', padding: '2rem'}}>No B2B invoices found.</td></tr>
                  ) : data.b2b.map((inv, idx) => (
                    <tr key={idx}>
                      <td style={{color: '#1B2850', fontWeight: 600}}>{inv.invoiceNo}</td>
                      <td>{new Date(inv.invoiceDate).toLocaleDateString('en-GB')}</td>
                      <td>{inv.customerName}</td>
                      <td><span style={{backgroundColor: '#E8F9F0', color: '#28C76F', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 600}}>{inv.gstin}</span></td>
                      <td>{inv.placeOfSupply}</td>
                      <td>₹{inv.taxableValue.toFixed(2)}</td>
                      <td>₹{inv.taxAmount.toFixed(2)}</td>
                      <td style={{fontWeight: 600}}>₹{inv.invoiceValue.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === 'b2c' && (
              <table className={styles.productTable}>
                <thead>
                  <tr>
                    <th>Invoice No</th>
                    <th>Invoice Date</th>
                    <th>Customer Name</th>
                    <th>Place of Supply</th>
                    <th>Taxable Value</th>
                    <th>Tax Amount</th>
                    <th>Invoice Value</th>
                  </tr>
                </thead>
                <tbody>
                  {data.b2c.length === 0 ? (
                    <tr><td colSpan="7" style={{textAlign: 'center', padding: '2rem'}}>No B2C transactions found.</td></tr>
                  ) : data.b2c.map((inv, idx) => (
                    <tr key={idx}>
                      <td style={{color: '#1B2850', fontWeight: 600}}>{inv.invoiceNo}</td>
                      <td>{new Date(inv.invoiceDate).toLocaleDateString('en-GB')}</td>
                      <td>{inv.customerName}</td>
                      <td>{inv.placeOfSupply}</td>
                      <td>₹{inv.taxableValue.toFixed(2)}</td>
                      <td>₹{inv.taxAmount.toFixed(2)}</td>
                      <td style={{fontWeight: 600}}>₹{inv.invoiceValue.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === 'hsn' && (
              <table className={styles.productTable}>
                <thead>
                  <tr>
                    <th>HSN/SAC</th>
                    <th>Description</th>
                    <th>Tax Rate</th>
                    <th>Total Qty</th>
                    <th>Taxable Value</th>
                    <th>CGST</th>
                    <th>SGST</th>
                    <th>IGST</th>
                    <th>Total Tax</th>
                    <th>Total Value</th>
                  </tr>
                </thead>
                <tbody>
                  {data.hsnSummary.length === 0 ? (
                    <tr><td colSpan="10" style={{textAlign: 'center', padding: '2rem'}}>No HSN data found.</td></tr>
                  ) : data.hsnSummary.map((hsn, idx) => (
                    <tr key={idx}>
                      <td style={{color: '#1B2850', fontWeight: 600}}>{hsn.hsn}</td>
                      <td>{hsn.description}</td>
                      <td>{hsn.taxRate}%</td>
                      <td>{hsn.totalQty}</td>
                      <td>₹{hsn.taxableValue.toFixed(2)}</td>
                      <td style={{color: '#6B7280'}}>₹{hsn.cgst.toFixed(2)}</td>
                      <td style={{color: '#6B7280'}}>₹{hsn.sgst.toFixed(2)}</td>
                      <td style={{color: '#6B7280'}}>₹{hsn.igst.toFixed(2)}</td>
                      <td style={{color: '#EA5455', fontWeight: 500}}>₹{hsn.totalTax.toFixed(2)}</td>
                      <td style={{fontWeight: 600}}>₹{hsn.totalValue.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === 'docs' && (
              <table className={styles.productTable}>
                <thead>
                  <tr>
                    <th>Document Nature</th>
                    <th>Serial No From</th>
                    <th>Serial No To</th>
                    <th>Total Count</th>
                    <th>Cancelled Count</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{color: '#1B2850', fontWeight: 600}}>Invoices for outward supply</td>
                    <td>{data.documentSummary.from || 'N/A'}</td>
                    <td>{data.documentSummary.to || 'N/A'}</td>
                    <td style={{fontWeight: 600}}>{data.documentSummary.total || 0}</td>
                    <td style={{color: '#EA5455', fontWeight: 600}}>{data.documentSummary.cancelled || 0}</td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>
        )}
      </Card>
    </DashboardLayout>
  );
};

export default GSTR1Report;
