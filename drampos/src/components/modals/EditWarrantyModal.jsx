import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import styles from './ModalForm.module.css';
import { updateWarranty } from '../../services/inventoryService';

const EditWarrantyModal = ({ isOpen, onClose, onSuccess, warranty }) => {
    const [name, setName] = useState('');
    const [duration, setDuration] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('Active');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (warranty) {
            setName(warranty.name || '');
            setDuration(warranty.duration || '');
            setDescription(warranty.description || '');
            setStatus(warranty.status || 'Active');
            setError(null);
        }
    }, [warranty]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !duration || !description) {
            setError('Please fill out all required fields.');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            await updateWarranty(warranty._id, { name, duration, description, status });
            if (onSuccess) onSuccess();
            onClose();
        } catch (err) {
            setError(err.message || 'Failed to update warranty');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Edit Warranty Plan" maxWidth="600px">
            <form onSubmit={handleSubmit} className={styles.form}>
                {error && <div style={{ color: 'red', marginBottom: '1rem', fontSize: '14px' }}>{error}</div>}

                <div className={styles.formGroup}>
                    <label>Warranty Label <span className={styles.required}>*</span></label>
                    <input type="text" className={styles.input} value={name} onChange={e => setName(e.target.value)} required />
                </div>

                <div className={styles.formGroup}>
                    <label>Custom Duration <span className={styles.required}>*</span></label>
                    <input type="text" className={styles.input} value={duration} onChange={e => setDuration(e.target.value)} required />
                </div>

                <div className={styles.formGroup}>
                    <label>Policy Details / Description <span className={styles.required}>*</span></label>
                    <textarea className={styles.textarea} rows={4} value={description} onChange={e => setDescription(e.target.value)} required></textarea>
                </div>

                <div className={styles.formGroup} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label style={{ marginBottom: 0 }}>Status</label>
                    <label className={styles.switch}>
                        <input type="checkbox" checked={status === 'Active'} onChange={e => setStatus(e.target.checked ? 'Active' : 'Inactive')} />
                        <span className={`${styles.slider} ${styles.round}`}></span>
                    </label>
                </div>

                <div className={styles.footerActions}>
                    <button type="button" className={styles.btnCancel} onClick={onClose} disabled={isSubmitting}>Cancel</button>
                    <button type="submit" className={styles.btnSubmit} disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default EditWarrantyModal;