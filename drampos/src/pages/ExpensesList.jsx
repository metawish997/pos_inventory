import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css';
import { Search, RefreshCw, Trash2 } from 'lucide-react';
import AddExpenseModal from '../components/modals/AddExpenseModal';
import { getExpenses, deleteExpense } from '../services/financeService';

const ExpensesList = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);

  const fetchExpensesData = async () => {
    try {
      setLoading(true);
      const res = await getExpenses();
      if (res.success) setExpenses(res.data);
    } catch (err) {
      console.error('Failed to fetch expenses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpensesData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await deleteExpense(id);
        fetchExpensesData();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const filteredExpenses = expenses.filter(e =>
    (e.expenseNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (e.category?.categoryName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (e.notes || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Expenses</h1>
          <p className={styles.subtitle}>Manage Expense Records</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.iconBtn} onClick={fetchExpensesData}><RefreshCw size={18} /></button>
          <button className={styles.btnPrimary} onClick={() => setIsAddOpen(true)}>
            + Add Expense
          </button>
        </div>
      </div>

      <Card className={styles.tableCard}>
        <div className={styles.filterBar}>
          <div className={styles.searchBox}>
            <Search size={18} className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Search Expense No, Category or Notes" 
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
                <th>Expense No</th>
                <th>Category</th>
                <th>Date</th>
                <th>Mode</th>
                <th>Amount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{textAlign: 'center', padding: '2rem'}}>Loading Expenses...</td>
                </tr>
              ) : filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{textAlign: 'center', padding: '2rem'}}>No expense records found</td>
                </tr>
              ) : (
                filteredExpenses.map((item) => (
                  <tr key={item._id}>
                    <td><input type="checkbox" /></td>
                    <td style={{color: '#1B2850', fontWeight: 600}}>{item.expenseNumber}</td>
                    <td>{item.category?.categoryName || 'General'}</td>
                    <td>{new Date(item.expenseDate || item.createdAt).toLocaleDateString()}</td>
                    <td>{item.paymentType}</td>
                    <td>₹{item.amount}</td>
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

      <AddExpenseModal isOpen={isAddOpen} onClose={() => { setIsAddOpen(false); fetchExpensesData(); }} />
    </DashboardLayout>
  );
};

export default ExpensesList;
