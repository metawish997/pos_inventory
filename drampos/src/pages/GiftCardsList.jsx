import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css';
import { Search, RefreshCw, PlusCircle, Trash2 } from 'lucide-react';
import { getGiftCards, createGiftCard, deleteGiftCard } from '../services/promoService';

const GiftCardsList = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCards = async () => {
    try {
      setLoading(true);
      const res = await getGiftCards();
      if (res.success) {
        setCards(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch gift cards:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const handleAddGiftCard = async () => {
    const cardNo = prompt('Enter Gift Card Number (e.g. GFT2001):');
    if (!cardNo) return;
    const customerName = prompt('Enter Customer Name:', 'Walk-in Customer') || 'Walk-in Customer';
    const amountStr = prompt('Enter Card Amount (₹):', '500');
    if (!amountStr) return;

    try {
      const res = await createGiftCard({
        cardNo: cardNo.toUpperCase(),
        customerName,
        amount: Number(amountStr),
        balance: Number(amountStr),
        status: 'Active'
      });
      if (res.success) {
        alert('Gift card created successfully!');
        fetchCards();
      }
    } catch (err) {
      alert(`Failed to create gift card: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this gift card?')) {
      try {
        await deleteGiftCard(id);
        fetchCards();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
        return <span style={{backgroundColor: '#28C76F', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px'}}>{status}</span>;
      case 'Inactive':
        return <span style={{backgroundColor: '#EA5455', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px'}}>{status}</span>;
      case 'Redeemed':
        return <span style={{backgroundColor: '#E83E8C', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px'}}>{status}</span>;
      default:
        return <span>{status || 'Active'}</span>;
    }
  };

  const filteredCards = cards.filter(c =>
    (c.cardNo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.customerName || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Gift Cards</h1>
          <p className={styles.subtitle}>Manage Gift Cards & Balances</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.iconBtn} onClick={fetchCards}><RefreshCw size={18} /></button>
          <button className={styles.btnPrimary} onClick={handleAddGiftCard}>
            <PlusCircle size={18} /> Add Gift Card
          </button>
        </div>
      </div>

      <Card className={styles.tableCard}>
        <div className={styles.filterBar}>
          <div className={styles.searchBox}>
            <Search size={18} className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Search Card No or Customer" 
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
                <th>Gift Card No</th>
                <th>Customer</th>
                <th>Issued Date</th>
                <th>Expiry Date</th>
                <th>Amount</th>
                <th>Balance</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" style={{textAlign: 'center', padding: '2rem'}}>Loading Gift Cards...</td>
                </tr>
              ) : filteredCards.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{textAlign: 'center', padding: '2rem'}}>No gift cards found</td>
                </tr>
              ) : (
                filteredCards.map((item) => (
                  <tr key={item._id}>
                    <td><input type="checkbox" /></td>
                    <td style={{color: '#1B2850', fontWeight: 600}}>{item.cardNo}</td>
                    <td>{item.customerName}</td>
                    <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                    <td>{new Date(item.expiryDate || item.createdAt).toLocaleDateString()}</td>
                    <td>₹{item.amount}</td>
                    <td>₹{item.balance}</td>
                    <td>{getStatusBadge(item.status)}</td>
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

export default GiftCardsList;
