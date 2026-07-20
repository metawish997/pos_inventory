import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css'; // Reusing some header styles
import { Search, RefreshCw, ChevronUp, Printer, Power, Plus, Minus, Trash2 } from 'lucide-react';
import GenerateBarcodeModal from '../components/modals/GenerateBarcodeModal';

const PrintBarcode = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Print Barcode</h1>
          <p className={styles.subtitle}>Manage your barcodes</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.iconBtn}><RefreshCw size={18} /></button>
          <button className={styles.iconBtn}><ChevronUp size={18} /></button>
        </div>
      </div>

      <Card style={{padding: '1.5rem'}}>
        <div style={{display: 'flex', gap: '1.5rem', marginBottom: '1.5rem'}}>
          <div style={{flex: 1}}>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem'}}>
              Warehouse <span style={{color: '#EA5455'}}>*</span>
            </label>
            <select style={{width: '100%', padding: '0.625rem 0.75rem', border: '1px solid #D1D5DB', borderRadius: '4px', backgroundColor: 'white'}}>
              <option>Select</option>
            </select>
          </div>
          <div style={{flex: 1}}>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem'}}>
              Store <span style={{color: '#EA5455'}}>*</span>
            </label>
            <select style={{width: '100%', padding: '0.625rem 0.75rem', border: '1px solid #D1D5DB', borderRadius: '4px', backgroundColor: 'white'}}>
              <option>Select</option>
            </select>
          </div>
          <div style={{flex: 2}}></div>
        </div>

        <div style={{marginBottom: '1.5rem'}}>
          <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem'}}>
            Product <span style={{color: '#EA5455'}}>*</span>
          </label>
          <div style={{position: 'relative'}}>
            <Search size={18} style={{position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF'}} />
            <input type="text" placeholder="Search Product by Code" style={{width: '100%', padding: '0.625rem 0.75rem 0.625rem 2.5rem', border: '1px solid #D1D5DB', borderRadius: '4px', boxSizing: 'border-box'}} />
          </div>
        </div>

        <div style={{border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden', marginBottom: '1.5rem'}}>
          <table style={{width: '100%', borderCollapse: 'collapse', textAlign: 'left'}}>
            <thead>
              <tr style={{backgroundColor: '#F3F4F6', color: '#1B2850', fontSize: '0.875rem'}}>
                <th style={{padding: '0.75rem 1rem', fontWeight: 600}}>Product</th>
                <th style={{padding: '0.75rem 1rem', fontWeight: 600}}>SKU</th>
                <th style={{padding: '0.75rem 1rem', fontWeight: 600}}>Code</th>
                <th style={{padding: '0.75rem 1rem', fontWeight: 600}}>Qty</th>
                <th style={{padding: '0.75rem 1rem', fontWeight: 600}}></th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Nike Jordan', sku: 'PT002', code: 'HG3FK' },
                { name: 'Apple Series 5 Watch', sku: 'PT003', code: 'TEUIU7' },
              ].map((item, i) => (
                <tr key={i} style={{borderTop: '1px solid #E5E7EB'}}>
                  <td style={{padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                    <div style={{width: '24px', height: '24px', backgroundColor: '#F3F4F6', borderRadius: '4px'}}></div>
                    <span style={{fontSize: '0.875rem', color: '#1B2850'}}>{item.name}</span>
                  </td>
                  <td style={{padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#6B7280'}}>{item.sku}</td>
                  <td style={{padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#6B7280'}}>{item.code}</td>
                  <td style={{padding: '0.75rem 1rem'}}>
                    <div style={{display: 'flex', alignItems: 'center', border: '1px solid #E5E7EB', borderRadius: '4px', width: 'fit-content'}}>
                      <button style={{padding: '4px 8px', border: 'none', background: 'none', cursor: 'pointer', color: '#1B2850'}}><Minus size={14} /></button>
                      <span style={{padding: '0 8px', fontSize: '0.875rem', borderLeft: '1px solid #E5E7EB', borderRight: '1px solid #E5E7EB'}}>4</span>
                      <button style={{padding: '4px 8px', border: 'none', background: 'none', cursor: 'pointer', color: '#1B2850'}}><Plus size={14} /></button>
                    </div>
                  </td>
                  <td style={{padding: '0.75rem 1rem'}}>
                    <button style={{border: '1px solid #E5E7EB', background: 'none', borderRadius: '4px', padding: '4px', cursor: 'pointer', color: '#6B7280'}}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem'}}>
          <div style={{flex: 1}}>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem'}}>
              Paper Size <span style={{color: '#EA5455'}}>*</span>
            </label>
            <select style={{width: '100%', padding: '0.625rem 0.75rem', border: '1px solid #D1D5DB', borderRadius: '4px', backgroundColor: 'white'}}>
              <option>Select</option>
            </select>
          </div>
          
          <div style={{display: 'flex', gap: '2rem', flex: 2, alignItems: 'flex-end', paddingBottom: '0.25rem'}}>
            <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
              <span style={{fontSize: '0.875rem', fontWeight: 600, color: '#1B2850'}}>Show Store Name</span>
              <label style={{position: 'relative', display: 'inline-block', width: '36px', height: '20px'}}>
                <input type="checkbox" defaultChecked style={{opacity: 0, width: 0, height: 0}} />
                <span style={{position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#28C76F', borderRadius: '20px', transition: '.4s'}}>
                  <span style={{position: 'absolute', content: '""', height: '16px', width: '16px', left: '18px', bottom: '2px', backgroundColor: 'white', borderRadius: '50%', transition: '.4s'}}></span>
                </span>
              </label>
            </div>
            <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
              <span style={{fontSize: '0.875rem', fontWeight: 600, color: '#1B2850'}}>Show Product Name</span>
              <label style={{position: 'relative', display: 'inline-block', width: '36px', height: '20px'}}>
                <input type="checkbox" defaultChecked style={{opacity: 0, width: 0, height: 0}} />
                <span style={{position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#28C76F', borderRadius: '20px', transition: '.4s'}}>
                  <span style={{position: 'absolute', content: '""', height: '16px', width: '16px', left: '18px', bottom: '2px', backgroundColor: 'white', borderRadius: '50%', transition: '.4s'}}></span>
                </span>
              </label>
            </div>
            <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
              <span style={{fontSize: '0.875rem', fontWeight: 600, color: '#1B2850'}}>Show Price</span>
              <label style={{position: 'relative', display: 'inline-block', width: '36px', height: '20px'}}>
                <input type="checkbox" defaultChecked style={{opacity: 0, width: 0, height: 0}} />
                <span style={{position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#28C76F', borderRadius: '20px', transition: '.4s'}}>
                  <span style={{position: 'absolute', content: '""', height: '16px', width: '16px', left: '18px', bottom: '2px', backgroundColor: 'white', borderRadius: '50%', transition: '.4s'}}></span>
                </span>
              </label>
            </div>
          </div>
        </div>

        <div style={{display: 'flex', justifyContent: 'flex-end', gap: '1rem', borderTop: '1px solid #E5E7EB', paddingTop: '1.5rem'}}>
          <button 
            style={{backgroundColor: '#FF9F43', color: 'white', border: 'none', borderRadius: '4px', padding: '0.625rem 1.25rem', fontWeight: 600, cursor: 'pointer'}}
            onClick={() => setIsModalOpen(true)}
          >
            Generate Barcode
          </button>
          <button style={{backgroundColor: '#1B2850', color: 'white', border: 'none', borderRadius: '4px', padding: '0.625rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, cursor: 'pointer'}}>
            <Power size={18} /> Reset Barcode
          </button>
          <button style={{backgroundColor: '#EA5455', color: 'white', border: 'none', borderRadius: '4px', padding: '0.625rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, cursor: 'pointer'}}>
            <Printer size={18} /> Print Barcode
          </button>
        </div>
      </Card>

      <GenerateBarcodeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </DashboardLayout>
  );
};

export default PrintBarcode;
