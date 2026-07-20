import React, { useState } from 'react';
import Modal from '../ui/Modal';
import styles from './ModalForm.module.css';
import { createTax } from '../../services/inventoryService';
import { Plus, Trash } from 'lucide-react';

const AddTaxModal = ({ isOpen, onClose, onSuccess }) => {
    const [name, setName] = useState('');
    const [taxValue, setTaxValue] = useState('');
    const [components, setComponents] = useState([{ name: '', value: '' }]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleAddComponent = () => {
        setComponents([...components, { name: '', value: '' }]);
    };

    const handleRemoveComponent = (index) => {
        setComponents(components.filter((_, i) => i !== index));
    };

    const handleComponentChange = (index, field, val) => {
        const updated = [...components];
        updated[index][field] = val;
        setComponents(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const totalVal = parseFloat(taxValue);
        if (!name || isNaN(totalVal)) {
            setError('Tax classification name and valid total percentage are required.');
            return;
        }

        // Filter out half-filled components
        const cleanComponents = components
            .map(c => ({ name: c.name.trim(), value: parseFloat(c.value) }))
            .filter(c => c.name && !isNaN(c.value));

        // Validation: If items are added, verify total matching sum integrity
        if (cleanComponents.length > 0) {
            const sum = cleanComponents.reduce((acc, curr) => acc + curr.value, 0);
            if (Math.abs(sum - totalVal) > 0.01) {
                setError(`Component splits (${sum}%) must match the Total Tax Value (${totalVal}%).`);
                return;
            }
        }

        setIsSubmitting(true);
        try {
            await createTax({ name, taxValue: totalVal, components: cleanComponents });
            if (onSuccess) onSuccess();
            onClose();
            setName('');
            setTaxValue('');
            setComponents([{ name: '', value: '' }]);
        } catch (err) {
            setError(err.message || 'Failed to create tax master configuration.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add Tax Option" maxWidth="550px">
            <form onSubmit={handleSubmit} className={styles.form}>
                {error && <div style={{ color: 'red', marginBottom: '1rem', fontSize: '13px' }}>{error}</div>}

                <div className={styles.formGroup}>
                    <label>Tax Label Name <span className={styles.required}>*</span></label>
                    <input type="text" className={styles.input} value={name} onChange={e => setName(e.target.value)} placeholder="e.g., GST 3%" required />
                </div>

                <div className={styles.formGroup}>
                    <label>Total Tax Rate (%) <span className={styles.required}>*</span></label>
                    <input type="number" step="0.01" className={styles.input} value={taxValue} onChange={e => setTaxValue(e.target.value)} placeholder="e.g., 3" required />
                </div>

                <div style={{ marginTop: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <label style={{ fontWeight: 600, fontSize: '14px' }}>Sub Components / Sub Splits (Optional)</label>
                        <button type="button" onClick={handleAddComponent} style={{ display: 'flex', alignItems: 'center', gap: '4px', border: '1px solid #FF9F43', color: '#FF9F43', background: 'none', padding: '2px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
                            <Plus size={14} /> Split Component
                        </button>
                    </div>

                    {components.map((comp, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: '10px', marginBottom: '8px', alignItems: 'center' }}>
                            <input type="text" className={styles.input} style={{ flex: 2 }} placeholder="e.g., CGST" value={comp.name} onChange={e => handleComponentChange(idx, 'name', e.target.value)} />
                            <input type="number" step="0.01" className={styles.input} style={{ flex: 1 }} placeholder="%" value={comp.value} onChange={e => handleComponentChange(idx, 'value', e.target.value)} />
                            <button type="button" onClick={() => handleRemoveComponent(idx)} style={{ background: 'none', border: 'none', color: '#EA5455', cursor: 'pointer' }}>
                                <Trash size={16} />
                            </button>
                        </div>
                    ))}
                </div>

                <div className={styles.footerActions}>
                    <button type="button" className={styles.btnCancel} onClick={onClose} disabled={isSubmitting}>Cancel</button>
                    <button type="submit" className={styles.btnSubmit} disabled={isSubmitting}>
                        {isSubmitting ? 'Adding...' : 'Add Tax Configuration'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default AddTaxModal;