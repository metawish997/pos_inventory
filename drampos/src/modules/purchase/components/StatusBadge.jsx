import React from 'react';

export const getPurchaseStatusBadge = (status) => {
    switch (status) {
        case 'Received':
        case 'Completed':
            return <span style={{ backgroundColor: '#28C76F', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>{status}</span>;
        case 'Approved':
            return <span style={{ backgroundColor: '#7367F0', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>{status}</span>;
        case 'Pending':
            return <span style={{ backgroundColor: '#00CFE8', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>{status}</span>;
        case 'Draft':
            return <span style={{ backgroundColor: '#6B7280', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>{status}</span>;
        case 'Cancelled':
            return <span style={{ backgroundColor: '#EA5455', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>{status}</span>;
        default:
            return <span>{status}</span>;
    }
};

export const getPaymentStatusBadge = (status) => {
    switch (status) {
        case 'Paid':
            return <span style={{ backgroundColor: '#E5F8ED', color: '#28C76F', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#28C76F' }}></div> Paid</span>;
        case 'Unpaid':
            return <span style={{ backgroundColor: '#FCEAEA', color: '#EA5455', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#EA5455' }}></div> Unpaid</span>;
        case 'Overdue':
            return <span style={{ backgroundColor: '#FFF2E5', color: '#FF9F43', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#FF9F43' }}></div> Overdue</span>;
        default:
            return <span>{status}</span>;
    }
};