import React, { useState, useEffect } from 'react';

const PurchaseItemEditModal = ({ isOpen, onClose, productGroup, onSave, taxes }) => {
    const [localItems, setLocalItems] = useState([]);

    useEffect(() => {
        if (isOpen && productGroup && productGroup.items) {
            setLocalItems(JSON.parse(JSON.stringify(productGroup.items)));
        }
    }, [isOpen, productGroup]);

    if (!isOpen) return null;

    const computeLineLocal = (item, taxes) => {
        const qty = Number(item.quantity) || 0;
        const price = Number(item.purchasePrice) || 0;
        const lineBase = qty * price;
        const taxDoc = taxes.find((t) => t._id === item.tax);
        const taxRate = taxDoc ? taxDoc.taxValue : 0;
        let disc = 0;
        if (item.discountType === 'Percentage') disc = (lineBase * (Number(item.discount) || 0)) / 100;
        else if (item.discountType === 'Fixed') disc = Math.min(Number(item.discount) || 0, lineBase);
        const taxable = lineBase - disc;
        const taxAmount = (taxable * taxRate) / 100;
        return {
            ...item,
            taxRate,
            subtotal: Number(lineBase.toFixed(2)),
            taxAmount: Number(taxAmount.toFixed(2)),
            total: Number((taxable + taxAmount).toFixed(2))
        };
    };

    const handleUpdate = (idx, field, value) => {
        const next = [...localItems];
        next[idx] = { ...next[idx], [field]: value };
        next[idx] = computeLineLocal(next[idx], taxes);
        setLocalItems(next);
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999,
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            padding: '2rem'
        }}>
            <div style={{
                backgroundColor: '#fff', borderRadius: '8px',
                width: '100%', maxWidth: '1000px', maxHeight: '90vh',
                display: 'flex', flexDirection: 'column',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
                <div style={{
                    padding: '1rem 1.5rem', borderBottom: '1px solid #E5E7EB',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                    <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#111827' }}>
                        Edit Items for {productGroup?.productName}
                    </h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
                </div>
                
                <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '1px solid #E5E7EB' }}>
                                <th style={{ padding: '0.5rem' }}>Variant</th>
                                <th style={{ padding: '0.5rem' }}>Qty</th>
                                <th style={{ padding: '0.5rem' }}>Rate</th>
                                <th style={{ padding: '0.5rem' }}>Disc Type</th>
                                <th style={{ padding: '0.5rem' }}>Disc</th>
                                <th style={{ padding: '0.5rem' }}>GST</th>
                                <th style={{ padding: '0.5rem' }}>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {localItems.map((it, idx) => (
                                <tr key={idx} style={{ borderBottom: '1px solid #F3F4F6' }}>
                                    <td style={{ padding: '0.5rem' }}>{it.variantLabel || 'Default'}</td>
                                    <td style={{ padding: '0.5rem' }}><input type="number" min="0" value={it.quantity} onChange={e => handleUpdate(idx, 'quantity', e.target.value)} style={{ width: 70, padding: '0.25rem' }} /></td>
                                    <td style={{ padding: '0.5rem' }}><input type="number" min="0" value={it.purchasePrice} onChange={e => handleUpdate(idx, 'purchasePrice', e.target.value)} style={{ width: 90, padding: '0.25rem' }} /></td>
                                    <td style={{ padding: '0.5rem' }}>
                                        <select value={it.discountType} onChange={e => handleUpdate(idx, 'discountType', e.target.value)} style={{ padding: '0.25rem' }}>
                                            <option value="">None</option>
                                            <option value="Percentage">%</option>
                                            <option value="Fixed">Fixed</option>
                                        </select>
                                    </td>
                                    <td style={{ padding: '0.5rem' }}><input type="number" min="0" value={it.discount} onChange={e => handleUpdate(idx, 'discount', e.target.value)} style={{ width: 70, padding: '0.25rem' }} /></td>
                                    <td style={{ padding: '0.5rem' }}>
                                        <select value={it.tax || ''} onChange={e => handleUpdate(idx, 'tax', e.target.value)} style={{ padding: '0.25rem' }}>
                                            <option value="">None</option>
                                            {taxes.map(t => <option key={t._id} value={t._id}>{t.name} ({t.taxValue}%)</option>)}
                                        </select>
                                    </td>
                                    <td style={{ padding: '0.5rem', fontWeight: 600 }}>₹{it.total?.toFixed(2) || '0.00'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #E5E7EB', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                    <button onClick={onClose} style={{ padding: '0.5rem 1rem', border: '1px solid #D1D5DB', borderRadius: '4px', background: '#FFF', cursor: 'pointer' }}>Cancel</button>
                    <button onClick={() => onSave(localItems)} style={{ padding: '0.5rem 1rem', background: '#4F46E5', color: '#FFF', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Save Changes</button>
                </div>
            </div>
        </div>
    );
};
export default PurchaseItemEditModal;
