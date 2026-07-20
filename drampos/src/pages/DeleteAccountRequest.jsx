import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css';
import { Trash2 } from 'lucide-react';

const DeleteAccountRequest = () => {
  return (
    <DashboardLayout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Delete Account Request</h1>
        </div>
      </div>

      <Card className={styles.tableCard}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', borderBottom: '1px solid #F3F4F6'}}>
          <div style={{position: 'relative', width: '300px'}}>
            <input type="text" placeholder="Search" className={styles.input} style={{paddingLeft: '2.5rem', width: '100%', boxSizing: 'border-box'}} />
          </div>
        </div>

        <div className={styles.tableResponsive}>
          <table className={styles.productTable}>
            <thead>
              <tr>
                <th><input type="checkbox" /></th>
                <th>User Name</th>
                <th>Requisition Date</th>
                <th>Delete Request Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Steven', req: '25 Sep 2023', del: '01 Oct 2023', img: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=50' },
                { name: 'Susan Lopez', req: '30 Sep 2023', del: '05 Oct 2023', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50' },
                { name: 'Robert Grossman', req: '10 Sep 2023', del: '25 Sep 2023', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50' },
                { name: 'Janet Hembre', req: '15 Sep 2023', del: '20 Sep 2023', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50' },
                { name: 'Russell Belle', req: '15 Aug 2023', del: '01 Sep 2023', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50' },
                { name: 'Henry Bryant', req: '12 Aug 2023', del: '01 Sep 2023', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=50' },
                { name: 'Michael Dawson', req: '15 Sep 2023', del: '01 Oct 2023', img: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=50' },
                { name: 'Thomas Ward', req: '01 Jan 2023', del: '01 Feb 2023', img: 'https://images.unsplash.com/photo-1547425260-76bcad8ce875?w=50' },
                { name: 'Jada Robinson', req: '22 Oct 2023', del: '15 Nov 2023', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=50' },
                { name: 'Aliza Duncan', req: '02 Nov 2023', del: '01 Dec 2023', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=50' },
              ].map((item, i) => (
                <tr key={i}>
                  <td><input type="checkbox" /></td>
                  <td>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                      <img src={item.img} alt={item.name} style={{width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover'}} />
                      <span style={{color: '#1B2850', fontWeight: 500}}>{item.name}</span>
                    </div>
                  </td>
                  <td style={{color: '#6B7280'}}>{item.req}</td>
                  <td style={{color: '#6B7280'}}>{item.del}</td>
                  <td>
                    <button className={styles.iconBtn}><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      
    </DashboardLayout>
  );
};

export default DeleteAccountRequest;
