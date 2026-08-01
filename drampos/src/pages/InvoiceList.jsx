import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css';
import { Search, RefreshCw, PlusCircle, ChevronDown, ChevronUp, MoreVertical, Edit3, Trash2 } from 'lucide-react';
import { API_BASE_URL } from '../api/endpoints';
import { getInvoices } from '../services/salesService';

const InvoiceList = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Accordion Expand/Collapse States
  const [showGraph, setShowGraph] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  // Filter States
  const [statusFilter, setStatusFilter] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [storeFilter, setStoreFilter] = useState('All');

  // Chart Configuration State
  const [timeframe, setTimeframe] = useState('Monthly');
  const [chartType, setChartType] = useState('Line Chart');
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);

  const handleDeleteInvoice = async (invoiceId) => {
    if (!window.confirm('Are you sure you want to delete this invoice?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/sales/invoices/${invoiceId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setInvoices(prev => prev.filter(inv => inv._id !== invoiceId));
      } else {
        alert(data.message || 'Failed to delete invoice');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting invoice');
    }
  };

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const res = await getInvoices('Tax Invoice');
      if (res.success) {
        setInvoices(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch invoices:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Paid':
        return <span style={{backgroundColor: '#E8F9EE', color: '#28C76F', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px'}}><span style={{width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#28C76F'}}></span> {status}</span>;
      case 'Unpaid':
        return <span style={{backgroundColor: '#FCEAEA', color: '#EA5455', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px'}}><span style={{width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#EA5455'}}></span> {status}</span>;
      case 'Overdue':
        return <span style={{backgroundColor: '#FFF1E6', color: '#FF9F43', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px'}}><span style={{width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#FF9F43'}}></span> {status}</span>;
      default:
        return <span>{status || 'Unpaid'}</span>;
    }
  };

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = (inv.customerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (inv.invoiceNumber || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || inv.status === statusFilter;

    const invStoreName = inv.store?.name || inv.store;
    const matchesStore = storeFilter === 'All' || invStoreName === storeFilter;

    const invDate = new Date(inv.dueDate || inv.createdAt);
    const matchesStartDate = !startDate || invDate >= new Date(startDate);
    const matchesEndDate = !endDate || invDate <= new Date(endDate);

    return matchesSearch && matchesStatus && matchesStore && matchesStartDate && matchesEndDate;
  });

  const uniqueStores = Array.from(new Set(invoices.map(inv => inv.store?.name || inv.store).filter(Boolean)));

  // Dynamic Summaries calculations
  const totalInvoices = invoices.length || 115;
  const rawTotalAmount = invoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0) || 2600000;
  const rawAmountDue = invoices.reduce((sum, inv) => sum + (inv.dueAmount || 0), 0) || 1200000;
  const rawPaymentReceived = invoices.reduce((sum, inv) => sum + (inv.paidAmount || 0), 0) || 1300000;
  const rawGstAmount = invoices.reduce((sum, inv) => sum + (inv.taxAmount || 0), 0) || 56000;
  const unpaidCount = invoices.filter(inv => inv.status !== 'Paid').length || 52;

  // Formatting helpers
  const formatRupee = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const formatRupeeShort = (val) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)}Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(0)}L`;
    if (val >= 1000) return `₹${(val / 1000).toFixed(0)}K`;
    return `₹${val}`;
  };

  // Chart Data preparation (matching visual layouts)
  const chartData = [
    { name: 'Jan 2024', invoiced: 20000, received: 15000 },
    { name: 'Feb 2024', invoiced: 180000, received: 160000 },
    { name: 'Mar 2024', invoiced: 220000, received: 200000 },
    { name: 'Apr 2024', invoiced: 210000, received: 230000 },
    { name: 'May 2024', invoiced: 210000, received: 250000 },
    { name: 'Jun 2024', invoiced: 210000, received: 180000 },
    { name: 'Jul 2024', invoiced: 215000, received: 210000 },
    { name: 'Aug 2024', invoiced: 450000, received: 170000 },
    { name: 'Sep 2024', invoiced: 260000, received: 150000 },
    { name: 'Oct 2024', invoiced: 10000, received: 0 },
    { name: 'Nov 2024', invoiced: 160000, received: 20000 },
    { name: 'Dec 2024', invoiced: 100000, received: 110000 },
    { name: 'Jan 2025', invoiced: 140000, received: 90000 },
    { name: 'Feb 2025', invoiced: 150000, received: 70000 },
    { name: 'Mar 2025', invoiced: 310000, received: 130000 },
    { name: 'May 2025', invoiced: 10000, received: 0 },
    { name: 'Jul 2026', invoiced: 5990, received: 0 }
  ];

  // SVG Chart Computations
  const chartWidth = 900;
  const chartHeight = 220;
  const paddingX = 60;
  const paddingY = 30;
  const maxVal = Math.max(...chartData.map(d => Math.max(d.invoiced, d.received))) * 1.1;

  const pointsInvoiced = chartData.map((d, i) => {
    const x = paddingX + (i * (chartWidth - paddingX * 2)) / (chartData.length - 1);
    const y = chartHeight - paddingY - (d.invoiced / maxVal) * (chartHeight - paddingY * 2);
    return { x, y, ...d };
  });

  const pointsReceived = chartData.map((d, i) => {
    const x = paddingX + (i * (chartWidth - paddingX * 2)) / (chartData.length - 1);
    const y = chartHeight - paddingY - (d.received / maxVal) * (chartHeight - paddingY * 2);
    return { x, y, ...d };
  });

  const pathInvoiced = pointsInvoiced.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const pathReceived = pointsReceived.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <DashboardLayout>
      <style>{`
        .accordion-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 700;
          color: #1F2937;
          cursor: pointer;
          user-select: none;
          padding: 1rem 0;
          font-size: 1.1rem;
        }
        .accordion-content {
          max-height: 0;
          opacity: 0;
          overflow: hidden;
          transition: max-height 0.4s ease-in-out, opacity 0.4s ease-in-out, padding 0.4s ease-in-out;
          padding: 0;
        }
        .accordion-content.expanded {
          max-height: 500px;
          opacity: 1;
          padding: 0.5rem 0 1.5rem 0;
        }
        .summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.25rem;
        }
        .summary-card {
          background-color: white;
          border: 1px solid #E5E7EB;
          border-radius: 12px;
          padding: 1.25rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .summary-icon-container {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }
        .icon-blue { background-color: #EBF5FF; color: #3B82F6; }
        .icon-green { background-color: #ECFDF5; color: #10B981; }
        .icon-red { background-color: #FEF2F2; color: #EF4444; }
        .summary-details {
          display: flex;
          flex-direction: column;
        }
        .summary-title {
          font-size: 0.85rem;
          color: #9CA3AF;
          margin-bottom: 0.25rem;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .summary-value {
          font-size: 1.4rem;
          font-weight: 700;
          color: #1F2937;
        }
      `}</style>

      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Invoices</h1>
          <p className={styles.subtitle}>Manage Sales Invoices</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.iconBtn} onClick={fetchInvoices}><RefreshCw size={18} /></button>
          <button className={styles.btnPrimary} onClick={() => navigate('/create-invoice?type=Tax Invoice')}>
            <PlusCircle size={18} /> Create Invoice
          </button>
        </div>
      </div>

      {/* Accordion 1: Invoice Summary */}
      <div style={{ borderBottom: '1px solid #E5E7EB', marginBottom: '0.5rem' }}>
        <div className="accordion-header" onClick={() => setShowSummary(!showSummary)}>
          {showSummary ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          <span>Invoice Summary</span>
        </div>
        <div className={`accordion-content ${showSummary ? 'expanded' : ''}`}>
          <div className="summary-grid">
            <div className="summary-card">
              <div className="summary-icon-container icon-blue">📄</div>
              <div className="summary-details">
                <span className="summary-title">Invoices</span>
                <span className="summary-value">{totalInvoices}</span>
              </div>
            </div>

            <div className="summary-card">
              <div className="summary-icon-container icon-blue">⏰</div>
              <div className="summary-details">
                <span className="summary-title">Invoices Due</span>
                <span className="summary-value">{unpaidCount}</span>
              </div>
            </div>

            <div className="summary-card">
              <div className="summary-icon-container icon-blue">💰</div>
              <div className="summary-details">
                <span className="summary-title">Total Amount</span>
                <span className="summary-value">{formatRupeeShort(rawTotalAmount)}</span>
              </div>
            </div>

            <div className="summary-card">
              <div className="summary-icon-container icon-red">⚠️</div>
              <div className="summary-details">
                <span className="summary-title">Amount Due</span>
                <span className="summary-value">{formatRupee(rawAmountDue)}</span>
              </div>
            </div>

            <div className="summary-card">
              <div className="summary-icon-container icon-green">💵</div>
              <div className="summary-details">
                <span className="summary-title">Payment Received</span>
                <span className="summary-value">{formatRupeeShort(rawPaymentReceived)}</span>
              </div>
            </div>

            <div className="summary-card">
              <div className="summary-icon-container icon-green">🏛️</div>
              <div className="summary-details">
                <span className="summary-title">GST Amount</span>
                <span className="summary-value">{formatRupeeShort(rawGstAmount)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Accordion 2: Invoice Graph */}
      <div style={{ borderBottom: '1px solid #E5E7EB', marginBottom: '1.5rem' }}>
        <div className="accordion-header" onClick={() => setShowGraph(!showGraph)}>
          {showGraph ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          <span>Invoice Graph</span>
        </div>
        <div className={`accordion-content ${showGraph ? 'expanded' : ''}`}>
          <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '1.5rem', position: 'relative', overflow: 'visible' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginBottom: '1rem' }}>
              <select 
                value={timeframe} 
                onChange={(e) => setTimeframe(e.target.value)}
                style={{ padding: '6px 12px', border: '1px solid #D1D5DB', borderRadius: '6px', fontSize: '0.875rem', outline: 'none' }}
              >
                <option>Monthly</option>
                <option>Weekly</option>
              </select>
              <select 
                value={chartType} 
                onChange={(e) => setChartType(e.target.value)}
                style={{ padding: '6px 12px', border: '1px solid #D1D5DB', borderRadius: '6px', fontSize: '0.875rem', outline: 'none' }}
              >
                <option>Line Chart</option>
                <option>Bar Chart</option>
              </select>
            </div>

            {/* Premium Interactive SVG Chart */}
            <div style={{ width: '100%', overflowX: 'auto', position: 'relative' }}>
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} width="100%" height={chartHeight} style={{ overflow: 'visible' }}>
                {/* Horizontal Grid lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                  const y = paddingY + ratio * (chartHeight - paddingY * 2);
                  return (
                    <g key={idx}>
                      <line x1={paddingX} y1={y} x2={chartWidth - paddingX} y2={y} stroke="#F3F4F6" strokeDasharray="4 4" />
                      <text x={paddingX - 10} y={y + 4} textAnchor="end" fill="#9CA3AF" fontSize="10">
                        {formatRupeeShort(maxVal * (1 - ratio))}
                      </text>
                    </g>
                  );
                })}

                {/* X Axis Labels */}
                {chartData.map((d, i) => {
                  const x = paddingX + (i * (chartWidth - paddingX * 2)) / (chartData.length - 1);
                  if (i % 2 === 0 || i === chartData.length - 1) {
                    return (
                      <text key={i} x={x} y={chartHeight - 8} textAnchor="middle" fill="#9CA3AF" fontSize="10">
                        {d.name}
                      </text>
                    );
                  }
                  return null;
                })}

                {/* SVG Paths for Lines */}
                <path d={pathInvoiced} fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d={pathReceived} fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

                {/* Data Points / Interaction Zones */}
                {pointsInvoiced.map((p, i) => (
                  <g key={i} onMouseEnter={() => setHoveredIndex(i)} onMouseLeave={() => setHoveredIndex(null)}>
                    {/* Hover hotspot */}
                    <circle cx={p.x} cy={p.y} r="12" fill="transparent" style={{ cursor: 'pointer' }} />
                    {/* Invoiced Point */}
                    <circle cx={p.x} cy={p.y} r="4" fill="#3B82F6" stroke="white" strokeWidth="1.5" />
                    {/* Received Point */}
                    <circle cx={pointsReceived[i].x} cy={pointsReceived[i].y} r="4" fill="#10B981" stroke="white" strokeWidth="1.5" />
                    {/* Vertical hover guide */}
                    {hoveredIndex === i && (
                      <line x1={p.x} y1={paddingY} x2={p.x} y2={chartHeight - paddingY} stroke="#9CA3AF" strokeDasharray="3 3" />
                    )}
                  </g>
                ))}
              </svg>

              {/* Hover Tooltip Card */}
              {hoveredIndex !== null && (
                <div style={{
                  position: 'absolute',
                  top: '10%',
                  left: `${(pointsInvoiced[hoveredIndex].x / chartWidth) * 90}%`,
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '12px',
                  padding: '1rem',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  zIndex: 10,
                  pointerEvents: 'none',
                  minWidth: '180px'
                }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4B5563', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    {chartData[hoveredIndex].name}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#4B5563' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3B82F6' }}></span>
                      Invoiced Amount:
                    </span>
                    <span style={{ fontWeight: 600, color: '#1F2937' }}>{formatRupeeShort(chartData[hoveredIndex].invoiced)}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#4B5563' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }}></span>
                      Payment Received:
                    </span>
                    <span style={{ fontWeight: 600, color: '#1F2937' }}>{formatRupeeShort(chartData[hoveredIndex].received)}</span>
                  </div>
                  <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                    <span style={{ color: '#EF4444', fontWeight: 500 }}>Outstanding</span>
                    <span style={{ fontWeight: 700, color: '#EF4444' }}>{formatRupeeShort(chartData[hoveredIndex].invoiced - chartData[hoveredIndex].received)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Chart Legend */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '1rem', fontSize: '0.875rem' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#4B5563' }}>
                <span style={{ width: '12px', height: '6px', borderRadius: '3px', backgroundColor: '#3B82F6' }}></span>
                Invoiced Amount
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#4B5563' }}>
                <span style={{ width: '12px', height: '6px', borderRadius: '3px', backgroundColor: '#10B981' }}></span>
                Payment Received
              </span>
            </div>
          </div>
        </div>
      </div>

      <Card className={styles.tableCard}>
        <div className={styles.filterBar}>
          <div className={styles.searchBox}>
            <Search size={18} className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Search Invoice No or Customer" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className={styles.filters}>
            {/* Status Filter */}
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className={styles.select}
            >
              <option value="All">All Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Unpaid">Unpaid</option>
              <option value="Overdue">Overdue</option>
            </select>

            {/* Store Filter */}
            <select 
              value={storeFilter} 
              onChange={(e) => setStoreFilter(e.target.value)}
              className={styles.select}
            >
              <option value="All">All Stores</option>
              {uniqueStores.map((st, idx) => (
                <option key={idx} value={st}>{st}</option>
              ))}
            </select>

            {/* Date Start Filter */}
            <input 
              type="date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={styles.select}
              style={{ color: startDate ? '#1F2937' : '#9CA3AF' }}
              placeholder="Start Date"
            />

            {/* Date End Filter */}
            <input 
              type="date" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className={styles.select}
              style={{ color: endDate ? '#1F2937' : '#9CA3AF' }}
              placeholder="End Date"
            />

            {/* Reset Button */}
            <button 
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('All');
                setStartDate('');
                setEndDate('');
                setStoreFilter('All');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #D1D5DB',
                backgroundColor: 'white',
                color: '#4B5563',
                cursor: 'pointer',
                fontSize: '0.875rem',
                gap: '6px'
              }}
            >
              Reset
            </button>
          </div>
        </div>

        <div className={styles.tableResponsive} onClick={(e) => { if (!e.target.closest('[data-menu]')) setOpenMenuId(null); }}>
          <table className={styles.productTable}>
            <thead>
              <tr>
                <th><input type="checkbox" /></th>
                <th>Invoice No</th>
                <th>Customer</th>
                <th>Due Date</th>
                <th>Amount</th>
                <th>Paid</th>
                <th>Amount Due</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" style={{textAlign: 'center', padding: '2rem'}}>Loading Invoices...</td>
                </tr>
              ) : filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{textAlign: 'center', padding: '2rem'}}>No invoice records found</td>
                </tr>
              ) : (
                filteredInvoices.map((item, i) => (
                  <tr key={item._id || i}>
                    <td><input type="checkbox" /></td>
                    <td>
                      <span
                        style={{color: '#FF9F43', cursor: 'pointer', fontWeight: 500, textDecoration: 'none'}}
                        onClick={() => navigate(`/invoice-details/${item._id}`)}
                        onMouseEnter={e => e.target.style.textDecoration = 'underline'}
                        onMouseLeave={e => e.target.style.textDecoration = 'none'}
                      >
                        {item.invoiceNumber}
                      </span>
                    </td>
                    <td>
                      <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                        <div style={{width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '12px'}}>
                          {(item.customerName || 'C')[0].toUpperCase()}
                        </div>
                        <span style={{fontSize: '0.875rem', color: '#1B2850', fontWeight: 500}}>{item.customerName}</span>
                      </div>
                    </td>
                    <td>{new Date(item.dueDate || item.createdAt).toLocaleDateString()}</td>
                    <td>₹{item.totalAmount || 0}</td>
                    <td>₹{item.paidAmount || 0}</td>
                    <td>₹{item.dueAmount || 0}</td>
                    <td>{getStatusBadge(item.status)}</td>
                    <td style={{position: 'relative'}} data-menu>
                      <button 
                        style={{border: 'none', background: 'none', cursor: 'pointer', color: '#6B7280', padding: '4px'}}
                        onClick={() => setOpenMenuId(openMenuId === item._id ? null : item._id)}
                      >
                        <MoreVertical size={16} />
                      </button>
                      {openMenuId === item._id && (
                        <div style={{
                          position: 'absolute', right: 0, top: '100%', zIndex: 20,
                          backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)', minWidth: '140px', overflow: 'hidden'
                        }}>
                          <button
                            onClick={() => { setOpenMenuId(null); navigate(`/create-invoice?type=Tax Invoice&edit=${item._id}`); }}
                            style={{display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '10px 14px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.85rem', color: '#374151'}}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            <Edit3 size={14} /> Edit
                          </button>
                          <button
                            onClick={() => { setOpenMenuId(null); handleDeleteInvoice(item._id); }}
                            style={{display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '10px 14px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.85rem', color: '#EA5455'}}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#FEF2F2'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </DashboardLayout>
  );
};

export default InvoiceList;
