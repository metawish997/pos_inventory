import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css';
import { Search, RefreshCw, Printer, Power, Plus, Minus, Trash2 } from 'lucide-react';
import GenerateBarcodeModal from '../components/modals/GenerateBarcodeModal';
import { getAllProducts } from '../services/productService';

const PrintBarcode = () => {
  const [products, setProducts] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [paperSize, setPaperSize] = useState('40 Per Sheet');
  const [showStoreName, setShowStoreName] = useState(true);
  const [showProductName, setShowProductName] = useState(true);
  const [showPrice, setShowPrice] = useState(true);

  useEffect(() => {
    getAllProducts().then(res => {
      if (res.success || Array.isArray(res)) {
        const list = res.data || res;
        setProducts(list);
        if (list.length > 0) {
          setSelectedItems(list.slice(0, 2).map(p => ({
            id: p._id,
            name: p.productName || p.name,
            sku: p.sku || 'SKU001',
            code: p.itemCode || p.barcode || 'BC123',
            price: p.sellingPrice || p.price || 100,
            qty: 4
          })));
        }
      }
    }).catch(console.error);
  }, []);

  const handleSelectProduct = (product) => {
    if (selectedItems.some(item => item.id === product._id)) {
      setShowSearchResults(false);
      setSearchTerm('');
      return;
    }
    setSelectedItems(prev => [
      ...prev,
      {
        id: product._id,
        name: product.productName || product.name,
        sku: product.sku || 'SKU001',
        code: product.itemCode || product.barcode || 'BC123',
        price: product.sellingPrice || product.price || 100,
        qty: 1
      }
    ]);
    setShowSearchResults(false);
    setSearchTerm('');
  };

  const handleQtyChange = (id, delta) => {
    setSelectedItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.qty + delta);
        return { ...item, qty: newQty };
      }
      return item;
    }));
  };

  const handleRemoveItem = (id) => {
    setSelectedItems(prev => prev.filter(item => item.id !== id));
  };

  const handleReset = () => {
    setSelectedItems([]);
  };

  const filteredProducts = products.filter(p =>
    (p.productName || p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.itemCode || p.barcode || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Print Barcode</h1>
          <p className={styles.subtitle}>Generate and Print Product Barcodes</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.iconBtn} onClick={() => setSearchTerm('')}><RefreshCw size={18} /></button>
        </div>
      </div>

      <Card style={{padding: '1.5rem'}}>
        <div style={{marginBottom: '1.5rem', position: 'relative'}}>
          <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem'}}>
            Product Search <span style={{color: '#EA5455'}}>*</span>
          </label>
          <div style={{position: 'relative'}}>
            <Search size={18} style={{position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF'}} />
            <input 
              type="text" 
              placeholder="Search product by name or barcode code..." 
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setShowSearchResults(true); }}
              style={{width: '100%', padding: '0.625rem 0.75rem 0.625rem 2.5rem', border: '1px solid #D1D5DB', borderRadius: '4px', boxSizing: 'border-box'}} 
            />
          </div>

          {showSearchResults && searchTerm && (
            <div style={{position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '4px', zIndex: 100, maxHeight: '200px', overflowY: 'auto', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}}>
              {filteredProducts.length === 0 ? (
                <div style={{padding: '0.75rem', color: '#6B7280', fontSize: '0.875rem'}}>No products match search</div>
              ) : (
                filteredProducts.map(p => (
                  <div 
                    key={p._id} 
                    onClick={() => handleSelectProduct(p)}
                    style={{padding: '0.75rem 1rem', cursor: 'pointer', borderBottom: '1px solid #F3F4F6', fontSize: '0.875rem'}}
                  >
                    <strong>{p.productName || p.name}</strong> - ₹{p.sellingPrice || p.price} (Code: {p.itemCode || p.barcode || 'N/A'})
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div style={{border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden', marginBottom: '1.5rem'}}>
          <table style={{width: '100%', borderCollapse: 'collapse', textAlign: 'left'}}>
            <thead>
              <tr style={{backgroundColor: '#F3F4F6', color: '#1B2850', fontSize: '0.875rem'}}>
                <th style={{padding: '0.75rem 1rem', fontWeight: 600}}>Product</th>
                <th style={{padding: '0.75rem 1rem', fontWeight: 600}}>SKU</th>
                <th style={{padding: '0.75rem 1rem', fontWeight: 600}}>Barcode Code</th>
                <th style={{padding: '0.75rem 1rem', fontWeight: 600}}>Price</th>
                <th style={{padding: '0.75rem 1rem', fontWeight: 600}}>Labels Qty</th>
                <th style={{padding: '0.75rem 1rem', fontWeight: 600}}>Action</th>
              </tr>
            </thead>
            <tbody>
              {selectedItems.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{textAlign: 'center', padding: '2rem', color: '#6B7280'}}>No products added to barcode print queue</td>
                </tr>
              ) : (
                selectedItems.map((item) => (
                  <tr key={item.id} style={{borderTop: '1px solid #E5E7EB'}}>
                    <td style={{padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#1B2850', fontWeight: 600}}>{item.name}</td>
                    <td style={{padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#6B7280'}}>{item.sku}</td>
                    <td style={{padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#6B7280'}}>{item.code}</td>
                    <td style={{padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#28C76F', fontWeight: 600}}>₹{item.price}</td>
                    <td style={{padding: '0.75rem 1rem'}}>
                      <div style={{display: 'flex', alignItems: 'center', border: '1px solid #E5E7EB', borderRadius: '4px', width: 'fit-content'}}>
                        <button onClick={() => handleQtyChange(item.id, -1)} style={{padding: '4px 8px', border: 'none', background: 'none', cursor: 'pointer', color: '#1B2850'}}><Minus size={14} /></button>
                        <span style={{padding: '0 12px', fontSize: '0.875rem', borderLeft: '1px solid #E5E7EB', borderRight: '1px solid #E5E7EB', fontWeight: 600}}>{item.qty}</span>
                        <button onClick={() => handleQtyChange(item.id, 1)} style={{padding: '4px 8px', border: 'none', background: 'none', cursor: 'pointer', color: '#1B2850'}}><Plus size={14} /></button>
                      </div>
                    </td>
                    <td style={{padding: '0.75rem 1rem'}}>
                      <button onClick={() => handleRemoveItem(item.id)} style={{border: 'none', background: 'none', borderRadius: '4px', padding: '4px', cursor: 'pointer', color: '#EA5455'}}>
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div style={{display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem', flexWrap: 'wrap'}}>
          <div style={{flex: 1, minWidth: '200px'}}>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem'}}>
              Paper Size
            </label>
            <select value={paperSize} onChange={(e) => setPaperSize(e.target.value)} style={{width: '100%', padding: '0.625rem 0.75rem', border: '1px solid #D1D5DB', borderRadius: '4px', backgroundColor: 'white'}}>
              <option value="40 Per Sheet">40 Per Sheet (a4)</option>
              <option value="30 Per Sheet">30 Per Sheet (a4)</option>
              <option value="24 Per Sheet">24 Per Sheet (a4)</option>
              <option value="Thermal Roll">Continuous Thermal Roll</option>
            </select>
          </div>
          
          <div style={{display: 'flex', gap: '2rem', flex: 2, alignItems: 'flex-end', paddingBottom: '0.25rem'}}>
            <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600, color: '#1B2850'}}>
              <input type="checkbox" checked={showStoreName} onChange={(e) => setShowStoreName(e.target.checked)} />
              Show Store Name
            </label>
            <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600, color: '#1B2850'}}>
              <input type="checkbox" checked={showProductName} onChange={(e) => setShowProductName(e.target.checked)} />
              Show Product Name
            </label>
            <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600, color: '#1B2850'}}>
              <input type="checkbox" checked={showPrice} onChange={(e) => setShowPrice(e.target.checked)} />
              Show Price
            </label>
          </div>
        </div>

        <div style={{display: 'flex', justifyContent: 'flex-end', gap: '1rem', borderTop: '1px solid #E5E7EB', paddingTop: '1.5rem'}}>
          <button 
            style={{backgroundColor: '#FF9F43', color: 'white', border: 'none', borderRadius: '4px', padding: '0.625rem 1.25rem', fontWeight: 600, cursor: 'pointer'}}
            onClick={() => {
              if (selectedItems.length === 0) {
                alert('Please select at least one product');
                return;
              }
              setIsModalOpen(true);
            }}
          >
            Generate Barcode
          </button>
          <button onClick={handleReset} style={{backgroundColor: '#1B2850', color: 'white', border: 'none', borderRadius: '4px', padding: '0.625rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, cursor: 'pointer'}}>
            <Power size={18} /> Reset Barcode
          </button>
          <button onClick={() => window.print()} style={{backgroundColor: '#EA5455', color: 'white', border: 'none', borderRadius: '4px', padding: '0.625rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, cursor: 'pointer'}}>
            <Printer size={18} /> Print Barcode
          </button>
        </div>
      </Card>

      <GenerateBarcodeModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        selectedItems={selectedItems}
        options={{ showStoreName, showProductName, showPrice }}
      />
    </DashboardLayout>
  );
};

export default PrintBarcode;
