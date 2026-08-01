import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css';
import { FileText, FileSpreadsheet, RefreshCw, ChevronUp, Printer, Calendar } from 'lucide-react';
import { API_BASE_URL } from '../api/endpoints';

const InvoiceReport = () => {
  const [invoices, setInvoices] = useState([]);
  const [summary, setSummary] = useState({
    totalAmount: 0,
    totalPaid: 0,
    totalUnpaid: 0,
    overdue: 0
  });
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [customerName, setCustomerName] = useState('All');
  const [status, setStatus] = useState('All');

  const fetchInvoiceReport = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      if (customerName && customerName !== 'All') params.append('customerName', customerName);
      if (status && status !== 'All') params.append('status', status);

      const res = await fetch(`${API_BASE_URL}/sales/invoices/report?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setInvoices(data.data.invoices || []);
        setSummary(data.data.summary || {
          totalAmount: 0,
          totalPaid: 0,
          totalUnpaid: 0,
          overdue: 0
        });
        setCustomers(data.data.customers || []);
      }
    } catch (err) {
      console.error('Error fetching invoice report:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoiceReport();
  }, []);

  const handleGenerateReport = (e) => {
    e.preventDefault();
    fetchInvoiceReport();
  };

  const handleResetFilters = () => {
    setStartDate('');
    setEndDate('');
    setCustomerName('All');
    setStatus('All');
    setTimeout(() => {
      fetchInvoiceReport();
    }, 0);
  };

  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Invoice Report</h1>
          <p className={styles.subtitle}>Manage and Analyze Your Invoice Data</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.iconBtn} onClick={fetchInvoiceReport} title="Reload"><RefreshCw size={18} /></button>
          <button className={styles.iconBtn} onClick={handleResetFilters} title="Reset Filters">Reset</button>
        </div>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '1.5rem'}}>
        <Card style={{padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid #28C76F'}}>
          <div style={{backgroundColor: '#28C76F', color: 'white', width: '48px', height: '48px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <FileText size={24} />
          </div>
          <div>
            <div style={{color: '#6B7280', fontSize: '0.875rem', marginBottom: '0.25rem'}}>Total Amount</div>
            <div style={{fontSize: '1.25rem', fontWeight: 600, color: '#1B2850'}}>₹{(summary.totalAmount || 0).toFixed(2)}</div>
          </div>
        </Card>
        <Card style={{padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid #00CFE8'}}>
          <div style={{backgroundColor: '#00CFE8', color: 'white', width: '48px', height: '48px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <FileText size={24} />
          </div>
          <div>
            <div style={{color: '#6B7280', fontSize: '0.875rem', marginBottom: '0.25rem'}}>Total Paid</div>
            <div style={{fontSize: '1.25rem', fontWeight: 600, color: '#1B2850'}}>₹{(summary.totalPaid || 0).toFixed(2)}</div>
          </div>
        </Card>
        <Card style={{padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid #FF9F43'}}>
          <div style={{backgroundColor: '#FF9F43', color: 'white', width: '48px', height: '48px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <FileText size={24} />
          </div>
          <div>
            <div style={{color: '#6B7280', fontSize: '0.875rem', marginBottom: '0.25rem'}}>Total Unpaid</div>
            <div style={{fontSize: '1.25rem', fontWeight: 600, color: '#1B2850'}}>₹{(summary.totalUnpaid || 0).toFixed(2)}</div>
          </div>
        </Card>
        <Card style={{padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid #EA5455'}}>
          <div style={{backgroundColor: '#EA5455', color: 'white', width: '48px', height: '48px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <FileText size={24} />
          </div>
          <div>
            <div style={{color: '#6B7280', fontSize: '0.875rem', marginBottom: '0.25rem'}}>Overdue</div>
            <div style={{fontSize: '1.25rem', fontWeight: 600, color: '#1B2850'}}>₹{(summary.overdue || 0).toFixed(2)}</div>
          </div>
        </Card>
      </div>

      <Card style={{padding: '1.5rem', marginBottom: '1.5rem'}}>
        <form onSubmit={handleGenerateReport} style={{display: 'flex', gap: '1.5rem', alignItems: 'flex-end', flexWrap: 'wrap'}}>
          <div style={{flex: '1 1 200px'}}>
            <label style={{display: 'block', fontSize: '0.875rem', color: '#1B2850', marginBottom: '0.5rem', fontWeight: 500}}>Start Date</label>
            <div>
              <input 
                type="date" 
                className={styles.input} 
                value={startDate} 
                onChange={e => setStartDate(e.target.value)} 
              />
            </div>
          </div>
          <div style={{flex: '1 1 200px'}}>
            <label style={{display: 'block', fontSize: '0.875rem', color: '#1B2850', marginBottom: '0.5rem', fontWeight: 500}}>End Date</label>
            <div>
              <input 
                type="date" 
                className={styles.input} 
                value={endDate} 
                onChange={e => setEndDate(e.target.value)} 
              />
            </div>
          </div>
          <div style={{flex: '1 1 200px'}}>
            <label style={{display: 'block', fontSize: '0.875rem', color: '#1B2850', marginBottom: '0.5rem', fontWeight: 500}}>Customer</label>
            <select className={styles.select} value={customerName} onChange={e => setCustomerName(e.target.value)}>
              <option value="All">All Customers</option>
              {customers.map((cust, idx) => (
                <option key={idx} value={cust}>{cust}</option>
              ))}
            </select>
          </div>
          <div style={{flex: '1 1 200px'}}>
            <label style={{display: 'block', fontSize: '0.875rem', color: '#1B2850', marginBottom: '0.5rem', fontWeight: 500}}>Status</label>
            <select className={styles.select} value={status} onChange={e => setStatus(e.target.value)}>
              <option value="All">All Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Unpaid">Unpaid</option>
              <option value="Partially Paid">Partially Paid</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
          <div>
            <button type="submit" className={styles.btnPrimary} style={{backgroundColor: '#FF9F43', color: 'white', border: 'none', height: '40px', padding: '0 1.5rem', borderRadius: '4px', cursor: 'pointer'}}>
              Generate Report
            </button>
          </div>
        </form>
      </Card>

      <Card className={styles.tableCard}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', borderBottom: '1px solid #F3F4F6'}}>
          <h2 style={{fontSize: '1rem', fontWeight: 600, color: '#1B2850', margin: 0}}>Invoices</h2>
          <div style={{display: 'flex', gap: '0.5rem'}}>
             <button className={styles.iconBtn} onClick={() => window.print()} title="Print"><Printer size={18} color="#6B7280" /></button>
          </div>
        </div>

        <div className={styles.tableResponsive}>
          {loading ? (
            <div style={{padding: '3rem', textAlign: 'center', color: '#6B7280'}}>Loading invoice report...</div>
          ) : invoices.length === 0 ? (
            <div style={{padding: '3rem', textAlign: 'center', color: '#6B7280'}}>No invoice data found.</div>
          ) : (
            <table className={styles.productTable}>
              <thead>
                <tr>
                  <th>Invoice No</th>
                  <th>Customer</th>
                  <th>Invoice Date</th>
                  <th>Due Date</th>
                  <th>Amount</th>
                  <th>Paid</th>
                  <th>Amount Due</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((item) => (
                  <tr key={item._id}>
                    <td style={{color: '#1B2850', fontWeight: 600}}>{item.invoiceNumber}</td>
                    <td style={{color: '#6B7280'}}>{item.customerName}</td>
                    <td style={{color: '#6B7280'}}>{new Date(item.invoiceDate).toLocaleDateString('en-GB')}</td>
                    <td style={{color: '#6B7280'}}>{new Date(item.dueDate).toLocaleDateString('en-GB')}</td>
                    <td style={{color: '#6B7280', fontWeight: '500'}}>₹{item.totalAmount.toFixed(2)}</td>
                    <td style={{color: '#28C76F', fontWeight: '500'}}>₹{item.paidAmount.toFixed(2)}</td>
                    <td style={{color: '#EA5455', fontWeight: '500'}}>₹{item.dueAmount.toFixed(2)}</td>
                    <td>
                      <span style={{
                        backgroundColor: item.status === 'Paid' ? '#E8F9F0' : (item.status === 'Partially Paid' ? '#FFF5EA' : '#FCEAEA'), 
                        color: item.status === 'Paid' ? '#28C76F' : (item.status === 'Partially Paid' ? '#FF9F43' : '#EA5455'), 
                        padding: '4px 8px', borderRadius: '4px', fontSize: '12px',
                        fontWeight: 600
                      }}>&bull; {item.status}</span>
                    </td>
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

export default InvoiceReport;
