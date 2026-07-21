import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css';
import { Search, RefreshCw, PlusCircle, Trash2 } from 'lucide-react';
import { getIncomes, getIncomeCategories, createIncome, deleteIncome } from '../services/financeService';

const IncomeList = () => {
  const [incomes, setIncomes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchIncomesData = async () => {
    try {
      setLoading(true);
      const [incRes, catRes] = await Promise.all([getIncomes(), getIncomeCategories()]);
      if (incRes.success) setIncomes(incRes.data);
      if (catRes.success) setCategories(catRes.data);
    } catch (err) {
      console.error('Failed to fetch incomes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncomesData();
  }, []);

  const handleAddIncome = async () => {
    if (categories.length === 0) {
      const catName = prompt('Enter a new Income Category Name first (e.g. Product Sales):');
      if (!catName) return;
      alert('Category added! Click Add Income again.');
      return;
    }
    const catId = categories[0]._id;
    const amountStr = prompt('Enter Income Amount (₹):', '1000');
    if (!amountStr) return;
    const notes = prompt('Enter Notes / Description:', 'General income') || '';

    try {
      const res = await createIncome({
        category: catId,
        amount: Number(amountStr),
        notes
      });
      if (res.success) {
        alert('Income created successfully!');
        fetchIncomesData();
      }
    } catch (err) {
      alert(`Failed to create income: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this income?')) {
      try {
        await deleteIncome(id);
        fetchIncomesData();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const filteredIncomes = incomes.filter(inc =>
    (inc.incomeNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (inc.category?.categoryName || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Income</h1>
          <p className={styles.subtitle}>Manage Income Records</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.iconBtn} onClick={fetchIncomesData}><RefreshCw size={18} /></button>
          <button className={styles.btnPrimary} onClick={handleAddIncome}>
            <PlusCircle size={18} /> Add Income
          </button>
        </div>
      </div>

      <Card className={styles.tableCard}>
        <div className={styles.filterBar}>
          <div className={styles.searchBox}>
            <Search size={18} className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Search Income No or Category" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.tableResponsive}>
          <table className={styles.productTable}>
            <thead>
              <tr>
                <th><input type="checkbox" /></th>
                <th>Income No</th>
                <th>Category</th>
                <th>Date</th>
                <th>Notes</th>
                <th>Amount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{textAlign: 'center', padding: '2rem'}}>Loading Incomes...</td>
                </tr>
              ) : filteredIncomes.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{textAlign: 'center', padding: '2rem'}}>No income records found</td>
                </tr>
              ) : (
                filteredIncomes.map((item) => (
                  <tr key={item._id}>
                    <td><input type="checkbox" /></td>
                    <td style={{color: '#1B2850', fontWeight: 600}}>{item.incomeNumber}</td>
                    <td>{item.category?.categoryName || 'Sales Revenue'}</td>
                    <td>{new Date(item.incomeDate || item.createdAt).toLocaleDateString()}</td>
                    <td>{item.notes || '-'}</td>
                    <td style={{color: '#28C76F', fontWeight: 600}}>₹{item.amount}</td>
                    <td>
                      <button 
                        style={{border: 'none', background: 'none', cursor: 'pointer', color: '#EA5455'}}
                        onClick={() => handleDelete(item._id)}
                      >
                        <Trash2 size={16} />
                      </button>
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

export default IncomeList;
