import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css';
import { FileText, FileSpreadsheet, RefreshCw, ChevronUp, Printer, Package, Layers, DollarSign, TrendingUp } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { API_BASE_URL } from '../api/endpoints';

const InventoryReport = () => {
  const location = useLocation();
  
  const [products, setProducts] = useState([]);
  const [summary, setSummary] = useState({
    totalProducts: 0,
    totalItems: 0,
    totalStockValue: 0,
    totalExpectedSalesValue: 0
  });
  const [warehouses, setWarehouses] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [warehouseId, setWarehouseId] = useState('All');
  const [storeId, setStoreId] = useState('All');

  // Fetch metadata for filter dropdowns
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const warehouseRes = await fetch(`${API_BASE_URL}/inventory/warehouses`);
        const warehouseData = await warehouseRes.json();
        if (warehouseData.success) {
          setWarehouses(warehouseData.data || []);
        }

        const storeRes = await fetch(`${API_BASE_URL}/inventory/stores`);
        const storeData = await storeRes.json();
        if (storeData.success) {
          setStores(storeData.data || []);
        }
      } catch (err) {
        console.error('Error fetching metadata:', err);
      }
    };
    fetchMetadata();
  }, []);

  const fetchInventoryReport = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (warehouseId && warehouseId !== 'All') params.append('warehouseId', warehouseId);
      if (storeId && storeId !== 'All') params.append('storeId', storeId);

      const res = await fetch(`${API_BASE_URL}/products/inventory-report?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.data.products || []);
        setSummary(data.data.summary || {
          totalProducts: 0,
          totalItems: 0,
          totalStockValue: 0,
          totalExpectedSalesValue: 0
        });
      }
    } catch (err) {
      console.error('Error fetching inventory report:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventoryReport();
  }, []);

  const handleGenerateReport = (e) => {
    e.preventDefault();
    fetchInventoryReport();
  };

  const handleResetFilters = () => {
    setWarehouseId('All');
    setStoreId('All');
    setTimeout(() => {
      fetchInventoryReport();
    }, 0);
  };

  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
          <div style={{display: 'flex', gap: '0.5rem', marginBottom: '1rem'}}>
            <Link to="/inventory-report" style={{padding: '0.5rem 1rem', backgroundColor: location.pathname === '/inventory-report' ? '#FF9F43' : '#E5E7EB', color: location.pathname === '/inventory-report' ? 'white' : '#6B7280', textDecoration: 'none', borderRadius: '4px', fontSize: '0.875rem', fontWeight: 500}}>Inventory Report</Link>
          </div>
          <h1 className={styles.title}>Inventory Report</h1>
          <p className={styles.subtitle}>Current stock levels, values, and expected values</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.iconBtn} onClick={fetchInventoryReport} title="Reload"><RefreshCw size={18} /></button>
          <button className={styles.iconBtn} onClick={handleResetFilters} title="Reset Filters">Reset</button>
        </div>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '1.5rem'}}>
        <Card style={{padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid #28C76F'}}>
          <div style={{backgroundColor: '#28C76F', color: 'white', width: '48px', height: '48px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Package size={24} />
          </div>
          <div>
            <div style={{color: '#6B7280', fontSize: '0.875rem', marginBottom: '0.25rem'}}>Total SKUs</div>
            <div style={{fontSize: '1.25rem', fontWeight: 600, color: '#1B2850'}}>{summary.totalProducts}</div>
          </div>
        </Card>
        <Card style={{padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid #00CFE8'}}>
          <div style={{backgroundColor: '#00CFE8', color: 'white', width: '48px', height: '48px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Layers size={24} />
          </div>
          <div>
            <div style={{color: '#6B7280', fontSize: '0.875rem', marginBottom: '0.25rem'}}>Total Stock Qty</div>
            <div style={{fontSize: '1.25rem', fontWeight: 600, color: '#1B2850'}}>{summary.totalItems}</div>
          </div>
        </Card>
        <Card style={{padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid #FF9F43'}}>
          <div style={{backgroundColor: '#FF9F43', color: 'white', width: '48px', height: '48px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <DollarSign size={24} />
          </div>
          <div>
            <div style={{color: '#6B7280', fontSize: '0.875rem', marginBottom: '0.25rem'}}>Total Stock Cost</div>
            <div style={{fontSize: '1.25rem', fontWeight: 600, color: '#1B2850'}}>₹{(summary.totalStockValue || 0).toFixed(2)}</div>
          </div>
        </Card>
        <Card style={{padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid #EA5455'}}>
          <div style={{backgroundColor: '#EA5455', color: 'white', width: '48px', height: '48px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <TrendingUp size={24} />
          </div>
          <div>
            <div style={{color: '#6B7280', fontSize: '0.875rem', marginBottom: '0.25rem'}}>Expected Retail Value</div>
            <div style={{fontSize: '1.25rem', fontWeight: 600, color: '#1B2850'}}>₹{(summary.totalExpectedSalesValue || 0).toFixed(2)}</div>
          </div>
        </Card>
      </div>

      <Card style={{padding: '1.5rem', marginBottom: '1.5rem'}}>
        <form onSubmit={handleGenerateReport} style={{display: 'flex', gap: '1.5rem', alignItems: 'flex-end', flexWrap: 'wrap'}}>
          <div style={{flex: '1 1 200px'}}>
            <label style={{display: 'block', fontSize: '0.875rem', color: '#1B2850', marginBottom: '0.5rem', fontWeight: 500}}>Store</label>
            <select className={styles.select} value={storeId} onChange={e => setStoreId(e.target.value)}>
              <option value="All">All Stores</option>
              {stores.map(store => (
                <option key={store._id} value={store._id}>{store.name}</option>
              ))}
            </select>
          </div>
          <div style={{flex: '1 1 200px'}}>
            <label style={{display: 'block', fontSize: '0.875rem', color: '#1B2850', marginBottom: '0.5rem', fontWeight: 500}}>Warehouse</label>
            <select className={styles.select} value={warehouseId} onChange={e => setWarehouseId(e.target.value)}>
              <option value="All">All Warehouses</option>
              {warehouses.map(wh => (
                <option key={wh._id} value={wh._id}>{wh.name}</option>
              ))}
            </select>
          </div>
          <div>
            <button type="submit" className={styles.btnPrimary} style={{backgroundColor: '#FF9F43', color: 'white', border: 'none', height: '40px', padding: '0 1.5rem', borderRadius: '4px', cursor: 'pointer'}}>
              Generate Report
            </button>
          </div>
        </form>
      </Card>

      <Card className={styles.tableCard} style={{marginTop: '1.5rem'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', borderBottom: '1px solid #F3F4F6'}}>
          <h2 style={{fontSize: '1rem', fontWeight: 600, color: '#1B2850', margin: 0}}>Stock Inventory</h2>
          <div style={{display: 'flex', gap: '0.5rem'}}>
             <button className={styles.iconBtn} onClick={() => window.print()} title="Print"><Printer size={18} color="#6B7280" /></button>
          </div>
        </div>

        <div className={styles.tableResponsive}>
          {loading ? (
            <div style={{padding: '3rem', textAlign: 'center', color: '#6B7280'}}>Loading inventory report...</div>
          ) : products.length === 0 ? (
            <div style={{padding: '3rem', textAlign: 'center', color: '#6B7280'}}>No products in stock found.</div>
          ) : (
            <table className={styles.productTable}>
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Product Name</th>
                  <th>Store / Warehouse</th>
                  <th>Category</th>
                  <th>In Stock</th>
                  <th>Cost Price</th>
                  <th>Selling Price</th>
                  <th>Total Cost Value</th>
                </tr>
              </thead>
              <tbody>
                {products.map((item) => (
                  <tr key={item._id}>
                    <td style={{color: '#6B7280'}}>{item.sku}</td>
                    <td>
                      <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                        {item.images && item.images[0] ? (
                          <img src={item.images[0].startsWith('http') ? item.images[0] : `${API_BASE_URL.replace('/api', '')}/${item.images[0]}`} alt={item.name} style={{width: '32px', height: '32px', borderRadius: '4px', objectFit: 'cover'}} />
                        ) : (
                          <div style={{width: '32px', height: '32px', borderRadius: '4px', backgroundColor: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: '#9CA3AF'}}>No Img</div>
                        )}
                        <span style={{color: '#1B2850', fontWeight: 500}}>{item.name}</span>
                      </div>
                    </td>
                    <td style={{color: '#6B7280'}}>
                      <div>{item.store?.name || 'N/A'}</div>
                      <div style={{fontSize: '11px', color: '#9CA3AF'}}>{item.warehouse?.name || 'N/A'}</div>
                    </td>
                    <td style={{color: '#6B7280'}}>{item.category?.name || 'N/A'}</td>
                    <td style={{color: (item.quantity || 0) <= (item.quantityAlert || 10) ? '#EA5455' : '#6B7280', fontWeight: 'bold'}}>
                      {item.quantity || 0}
                    </td>
                    <td style={{color: '#6B7280'}}>₹{(item.price || 0).toFixed(2)}</td>
                    <td style={{color: '#28C76F'}}>₹{(item.finalPrice || 0).toFixed(2)}</td>
                    <td style={{color: '#1B2850', fontWeight: '600'}}>₹{((item.quantity || 0) * (item.price || 0)).toFixed(2)}</td>
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

export default InventoryReport;
