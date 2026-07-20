import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import Card from '../../../../components/ui/Card';
import styles from '../../purchase.module.css';
import { createVendor, updateVendor, getVendorById } from '../../services/purchaseService';

const Field = ({ label, children }) => (
    <div className={styles.formCol}>
        <label>{label}</label>
        {children}
    </div>
);

const AddVendor = () => {
    const { id } = useParams();
    const isEdit = !!id;
    const navigate = useNavigate();
    
    const [form, setForm] = useState({
        vendorName: '', companyName: '', shopName: '', gstin: '', pan: '', email: '', mobile: '', phone: '',
        billingAddress: '', shippingAddress: '', shopAddress: '', city: '', state: '', country: '', pincode: '',
        paymentTerms: '', creditLimit: 0, openingBalance: 0, status: 'Active', notes: ''
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(isEdit);

    useEffect(() => {
        if (isEdit) {
            getVendorById(id)
                .then(data => {
                    setForm({
                        vendorName: data.vendorName || '',
                        companyName: data.companyName || '',
                        shopName: data.shopName || '',
                        gstin: data.gstin || '',
                        pan: data.pan || '',
                        email: data.email || '',
                        mobile: data.mobile || '',
                        phone: data.phone || '',
                        billingAddress: data.billingAddress || '',
                        shippingAddress: data.shippingAddress || '',
                        shopAddress: data.shopAddress || '',
                        city: data.city || '',
                        state: data.state || '',
                        country: data.country || '',
                        pincode: data.pincode || '',
                        paymentTerms: data.paymentTerms || '',
                        creditLimit: data.creditLimit || 0,
                        openingBalance: data.openingBalance || 0,
                        status: data.status || 'Active',
                        notes: data.notes || ''
                    });
                    setLoading(false);
                })
                .catch(err => {
                    setError('Failed to load vendor details');
                    setLoading(false);
                });
        }
    }, [id, isEdit]);

    const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        if (!form.vendorName) return setError('Vendor name is required');
        setSaving(true);
        try {
            if (isEdit) await updateVendor(id, form);
            else await createVendor(form);
            setSaving(false);
            navigate('/vendors');
        } catch (err) {
            setSaving(false);
            setError(err.message);
        }
    };

    return (
        <DashboardLayout>
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.title}>{isEdit ? 'Edit Vendor' : 'Add Vendor'}</h1>
                    <p className={styles.subtitle}>{isEdit ? 'Update vendor details' : 'Create a new vendor profile'}</p>
                </div>
            </div>

            <Card>
                {loading ? (
                    <div style={{ padding: '2rem', textAlign: 'center' }}>Loading vendor data...</div>
                ) : (
                    <form onSubmit={handleSubmit} style={{ padding: '1rem' }}>
                        <div className={styles.formRow}>
                            <Field label="Vendor Name *"><input className={styles.input} value={form.vendorName} onChange={(e) => set('vendorName', e.target.value)} /></Field>
                            <Field label="Company Name"><input className={styles.input} value={form.companyName} onChange={(e) => set('companyName', e.target.value)} /></Field>
                            <Field label="Shop Name"><input className={styles.input} value={form.shopName} onChange={(e) => set('shopName', e.target.value)} /></Field>
                            <Field label="GSTIN"><input className={styles.input} value={form.gstin} onChange={(e) => set('gstin', e.target.value)} /></Field>
                        </div>
                        <div className={styles.formRow}>
                            <Field label="PAN"><input className={styles.input} value={form.pan} onChange={(e) => set('pan', e.target.value)} /></Field>
                            <Field label="Email"><input className={styles.input} value={form.email} onChange={(e) => set('email', e.target.value)} /></Field>
                            <Field label="Mobile"><input className={styles.input} value={form.mobile} onChange={(e) => set('mobile', e.target.value)} /></Field>
                            <Field label="Phone"><input className={styles.input} value={form.phone} onChange={(e) => set('phone', e.target.value)} /></Field>
                        </div>
                        <div className={styles.formRow}>
                            <Field label="Billing Address"><input className={styles.input} value={form.billingAddress} onChange={(e) => set('billingAddress', e.target.value)} /></Field>
                            <Field label="Shipping Address"><input className={styles.input} value={form.shippingAddress} onChange={(e) => set('shippingAddress', e.target.value)} /></Field>
                            <Field label="Shop Address"><input className={styles.input} value={form.shopAddress} onChange={(e) => set('shopAddress', e.target.value)} /></Field>
                        </div>
                        <div className={styles.formRow}>
                            <Field label="City"><input className={styles.input} value={form.city} onChange={(e) => set('city', e.target.value)} /></Field>
                            <Field label="State"><input className={styles.input} value={form.state} onChange={(e) => set('state', e.target.value)} /></Field>
                            <Field label="Country"><input className={styles.input} value={form.country} onChange={(e) => set('country', e.target.value)} /></Field>
                            <Field label="Pincode"><input className={styles.input} value={form.pincode} onChange={(e) => set('pincode', e.target.value)} /></Field>
                        </div>
                        <div className={styles.formRow}>
                            <Field label="Payment Terms"><input className={styles.input} value={form.paymentTerms} onChange={(e) => set('paymentTerms', e.target.value)} /></Field>
                            <Field label="Credit Limit"><input type="number" className={styles.input} value={form.creditLimit} onChange={(e) => set('creditLimit', e.target.value)} /></Field>
                            <Field label="Opening Balance"><input type="number" className={styles.input} value={form.openingBalance} onChange={(e) => set('openingBalance', e.target.value)} /></Field>
                            <Field label="Status">
                                <select className={styles.select} value={form.status} onChange={(e) => set('status', e.target.value)}>
                                    <option>Active</option>
                                    <option>Inactive</option>
                                </select>
                            </Field>
                        </div>
                        <div className={styles.formCol}>
                            <label>Notes</label>
                            <textarea className={styles.textarea} rows={3} value={form.notes} onChange={(e) => set('notes', e.target.value)} />
                        </div>

                        {error && <div style={{ color: '#EA5455', margin: '1rem 0', fontSize: '0.875rem' }}>{error}</div>}

                        <div className={styles.footerActions} style={{ marginTop: '2rem', justifyContent: 'flex-end', display: 'flex', gap: '1rem' }}>
                            <button type="button" className={styles.btnCancel} onClick={() => navigate('/vendors')}>Cancel</button>
                            <button type="submit" className={styles.btnSubmit} disabled={saving}>{saving ? 'Saving...' : 'Save Vendor'}</button>
                        </div>
                    </form>
                )}
            </Card>
        </DashboardLayout>
    );
};

export default AddVendor;
