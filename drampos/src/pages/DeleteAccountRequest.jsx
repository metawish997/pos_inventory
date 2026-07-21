import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css';
import { Trash2, RefreshCw, Search } from 'lucide-react';
import { getDeleteRequests, processDeleteRequest } from '../services/userService';

const DeleteAccountRequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await getDeleteRequests();
      if (res.success) setRequests(res.data);
    } catch (err) {
      console.error('Failed to fetch delete requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApproveDelete = async (id) => {
    if (window.confirm('Are you sure you want to approve this account deletion request? The user account will be permanently deleted.')) {
      try {
        await processDeleteRequest(id, 'Approved');
        alert('Account deletion request approved & user account removed');
        fetchRequests();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const filteredRequests = requests.filter(r =>
    (r.userName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.userEmail || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Delete Account Requests</h1>
          <p className={styles.subtitle}>Review User Account Deletion Requests</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.iconBtn} onClick={fetchRequests}><RefreshCw size={18} /></button>
        </div>
      </div>

      <Card className={styles.tableCard}>
        <div className={styles.filterBar}>
          <div className={styles.searchBox}>
            <Search size={18} className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Search User Name or Email" 
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
                <th>User Name</th>
                <th>Email</th>
                <th>Request Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{textAlign: 'center', padding: '2rem'}}>Loading Delete Requests...</td>
                </tr>
              ) : filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{textAlign: 'center', padding: '2rem'}}>No account deletion requests found</td>
                </tr>
              ) : (
                filteredRequests.map((item) => (
                  <tr key={item._id}>
                    <td><input type="checkbox" /></td>
                    <td>
                      <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                        <div style={{width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600}}>
                          {(item.userName || 'U')[0].toUpperCase()}
                        </div>
                        <span style={{color: '#1B2850', fontWeight: 500}}>{item.userName}</span>
                      </div>
                    </td>
                    <td style={{color: '#6B7280'}}>{item.userEmail}</td>
                    <td>{new Date(item.requestDate || item.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span style={{backgroundColor: '#FFF1E6', color: '#FF9F43', padding: '4px 8px', borderRadius: '4px', fontSize: '12px'}}>{item.status || 'Pending'}</span>
                    </td>
                    <td>
                      <button 
                        style={{border: 'none', background: 'none', cursor: 'pointer', color: '#EA5455'}}
                        onClick={() => handleApproveDelete(item._id)}
                        title="Approve & Delete Account"
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

export default DeleteAccountRequest;
