import React, { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css'; // Reusing styles
import { Search, FileText, FileSpreadsheet, RefreshCw, ChevronUp, PlusCircle, MoreVertical, Eye, Edit, DollarSign, Download, Trash2, Plus } from 'lucide-react';
import AddSalesModal from '../components/modals/AddSalesModal';
import SalesDetailModal from '../components/modals/SalesDetailModal';
import EditSalesModal from '../components/modals/EditSalesModal';
import ShowPaymentsModal from '../components/modals/ShowPaymentsModal';
import CreatePaymentModal from '../components/modals/CreatePaymentModal';

const SalesList = () => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isShowPaymentOpen, setIsShowPaymentOpen] = useState(false);
  const [isCreatePaymentOpen, setIsCreatePaymentOpen] = useState(false);
  
  const [activeMenu, setActiveMenu] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return <span style={{backgroundColor: '#28C76F', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px'}}>{status}</span>;
      case 'Pending':
        return <span style={{backgroundColor: '#00CFE8', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px'}}>{status}</span>;
      default:
        return <span>{status}</span>;
    }
  };

  const getPaymentBadge = (status) => {
    switch (status) {
      case 'Paid':
        return <span style={{backgroundColor: '#E8F9EE', color: '#28C76F', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px'}}><span style={{width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#28C76F'}}></span> {status}</span>;
      case 'Unpaid':
        return <span style={{backgroundColor: '#FCEAEA', color: '#EA5455', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px'}}><span style={{width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#EA5455'}}></span> {status}</span>;
      case 'Overdue':
        return <span style={{backgroundColor: '#FFF1E6', color: '#FF9F43', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px'}}><span style={{width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#FF9F43'}}></span> {status}</span>;
      default:
        return <span>{status}</span>;
    }
  };

  const handleAction = (action, index) => {
    setActiveMenu(null);
    if (action === 'detail') setIsDetailOpen(true);
    if (action === 'edit') setIsEditOpen(true);
    if (action === 'show-payment') setIsShowPaymentOpen(true);
    if (action === 'create-payment') setIsCreatePaymentOpen(true);
  };

  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Sales</h1>
          <p className={styles.subtitle}>Manage Your Sales</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.iconBtn}><FileText size={18} color="#EA5455" /></button>
          <button className={styles.iconBtn}><FileSpreadsheet size={18} color="#28C76F" /></button>
          <button className={styles.iconBtn}><RefreshCw size={18} /></button>
          <button className={styles.iconBtn}><ChevronUp size={18} /></button>
          <button className={styles.btnPrimary} onClick={() => setIsAddOpen(true)}>
            <PlusCircle size={18} /> Add Sales
          </button>
        </div>
      </div>

      <Card className={styles.tableCard}>
        <div className={styles.filterBar}>
          <div className={styles.searchBox}>
            <Search size={18} className={styles.searchIcon} />
            <input type="text" placeholder="Search" />
          </div>
          <div className={styles.filters}>
            <select className={styles.select}>
              <option>Customer</option>
            </select>
            <select className={styles.select}>
              <option>Status</option>
            </select>
            <select className={styles.select}>
              <option>Payment Status</option>
            </select>
            <select className={styles.select}>
              <option>Sort By : Last 7 Days</option>
            </select>
          </div>
        </div>

        <div className={styles.tableResponsive}>
          <table className={styles.productTable}>
            <thead>
              <tr>
                <th><input type="checkbox" /></th>
                <th>Customer</th>
                <th>Reference</th>
                <th>Date</th>
                <th>Status</th>
                <th>Grand Total</th>
                <th>Paid</th>
                <th>Due</th>
                <th>Payment Status</th>
                <th>Biller</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Carl Evans', ref: 'SL001', date: '24 Dec 2024', status: 'Completed', total: '$1000', paid: '$1000', due: '$0.00', pstatus: 'Paid', biller: 'Admin' },
                { name: 'Minerva Rameriz', ref: 'SL002', date: '10 Dec 2024', status: 'Pending', total: '$1500', paid: '$0.00', due: '$1500', pstatus: 'Unpaid', biller: 'Admin' },
                { name: 'Robert Lamon', ref: 'SL003', date: '08 Feb 2023', status: 'Completed', total: '$1500', paid: '$0.00', due: '$1500', pstatus: 'Paid', biller: 'Admin' },
                { name: 'Patricia Lewis', ref: 'SL004', date: '12 Feb 2023', status: 'Completed', total: '$2000', paid: '$1000', due: '$1000', pstatus: 'Overdue', biller: 'Admin' },
                { name: 'Mark Joslyn', ref: 'SL005', date: '17 Mar 2023', status: 'Completed', total: '$800', paid: '$800', due: '$0.00', pstatus: 'Paid', biller: 'Admin' },
                { name: 'Marsha Betts', ref: 'SL006', date: '24 Mar 2023', status: 'Pending', total: '$750', paid: '$0.00', due: '$750', pstatus: 'Unpaid', biller: 'Admin' },
                { name: 'Daniel Jude', ref: 'SL007', date: '06 Apr 2023', status: 'Completed', total: '$1300', paid: '$1300', due: '$0.00', pstatus: 'Paid', biller: 'Admin' },
                { name: 'Emma Bates', ref: 'SL008', date: '16 Apr 2023', status: 'Completed', total: '$1100', paid: '$1100', due: '$0.00', pstatus: 'Paid', biller: 'Admin' },
                { name: 'Richard Fralick', ref: 'SL009', date: '04 May 2023', status: 'Pending', total: '$2300', paid: '$2300', due: '$0.00', pstatus: 'Paid', biller: 'Admin' },
              ].map((item, i) => (
                <tr key={i}>
                  <td><input type="checkbox" /></td>
                  <td>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                      <div style={{width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#F3F4F6'}}></div>
                      <span style={{fontSize: '0.875rem', color: '#1B2850', fontWeight: 500}}>{item.name}</span>
                    </div>
                  </td>
                  <td>{item.ref}</td>
                  <td>{item.date}</td>
                  <td>{getStatusBadge(item.status)}</td>
                  <td>{item.total}</td>
                  <td>{item.paid}</td>
                  <td>{item.due}</td>
                  <td>{getPaymentBadge(item.pstatus)}</td>
                  <td>{item.biller}</td>
                  <td style={{position: 'relative'}}>
                    <button 
                      style={{border: 'none', background: 'none', cursor: 'pointer', color: '#6B7280'}}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenu(activeMenu === i ? null : i);
                      }}
                    >
                      <MoreVertical size={16} />
                    </button>
                    {activeMenu === i && (
                      <div ref={menuRef} style={{position: 'absolute', right: '100%', top: '50%', transform: 'translateY(-50%)', backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', padding: '0.5rem', zIndex: 10, minWidth: '180px'}}>
                        <button onClick={() => handleAction('detail', i)} style={{display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', padding: '0.5rem', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '0.875rem', color: '#374151', borderRadius: '4px', ':hover': {backgroundColor: '#F3F4F6'}}}>
                          <Eye size={16} /> Sale Detail
                        </button>
                        <button onClick={() => handleAction('edit', i)} style={{display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', padding: '0.5rem', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '0.875rem', color: '#374151', borderRadius: '4px'}}>
                          <Edit size={16} /> Edit Sale
                        </button>
                        <button onClick={() => handleAction('show-payment', i)} style={{display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', padding: '0.5rem', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '0.875rem', color: '#374151', borderRadius: '4px'}}>
                          <DollarSign size={16} /> Show Payments
                        </button>
                        <button onClick={() => handleAction('create-payment', i)} style={{display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', padding: '0.5rem', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '0.875rem', color: '#374151', borderRadius: '4px'}}>
                          <Plus size={16} /> Create Payment
                        </button>
                        <button onClick={() => handleAction('download', i)} style={{display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', padding: '0.5rem', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '0.875rem', color: '#374151', borderRadius: '4px'}}>
                          <Download size={16} /> Download pdf
                        </button>
                        <button onClick={() => handleAction('delete', i)} style={{display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', padding: '0.5rem', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '0.875rem', color: '#EA5455', borderRadius: '4px'}}>
                          <Trash2 size={16} /> Delete Sale
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <AddSalesModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
      <SalesDetailModal isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} />
      <EditSalesModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} />
      <ShowPaymentsModal isOpen={isShowPaymentOpen} onClose={() => setIsShowPaymentOpen(false)} />
      <CreatePaymentModal isOpen={isCreatePaymentOpen} onClose={() => setIsCreatePaymentOpen(false)} />
    </DashboardLayout>
  );
};

export default SalesList;
