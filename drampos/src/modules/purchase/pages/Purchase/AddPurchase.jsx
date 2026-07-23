import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import Card from '../../../../components/ui/Card';
import styles from '../../purchase.module.css';
import { getVendors, getWarehouses, getTaxes, createPurchase, updatePurchase, getPurchaseById, getProductVariants } from '../../services/purchaseService';
import ProductModal from '../../../../components/modals/ProductModal';
import { Plus, Edit, Trash2 } from 'lucide-react';

const emptyItem = {
    product: '',
    productName: '',
    variant: null,
    variantLabel: '',
    sku: '',
    barcode: '',
    quantity: 1,
    freeQuantity: 0,
    purchasePrice: 0,
    discountType: '',
    discount: 0,
    tax: null,
    taxRate: 0,
    taxAmount: 0,
    subtotal: 0,
    total: 0
};

const computeLine = (item, taxes) => {
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
        discountAmount: Number(disc.toFixed(2)),
        taxAmount: Number(taxAmount.toFixed(2)),
        total: Number((taxable + taxAmount).toFixed(2))
    };
};

const AddPurchase = () => {
    const { id } = useParams();
    const isEdit = !!id;
    const navigate = useNavigate();

    const [vendors, setVendors] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [taxes, setTaxes] = useState([]);
    const [items, setItems] = useState([{ ...emptyItem }]);
    const [header, setHeader] = useState({
        vendor: '',
        warehouse: '',
        purchaseDate: new Date().toISOString().split('T')[0],
        invoiceNumber: '',
        invoiceDate: '',
        dueDate: '',
        paymentTerms: '',
        currency: 'INR',
        referenceNumber: '',
        notes: '',
        status: 'Approved',
        shipping: 0,
        roundOff: 0
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [pageLoading, setPageLoading] = useState(true);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);

    // State for the product modal edit mode
    const [editProductId, setEditProductId] = useState(null);
    const [editUnsavedPayload, setEditUnsavedPayload] = useState(null);

    const handleNewProductCreated = async (resObj) => {
        setIsProductModalOpen(false);
        if (resObj) {
            if (resObj.isUnsavedNewProduct) {
                const payload = resObj.payload;
                let tempItems = [];
                const taxId = payload.tax || null;

                if (payload.productType !== 'variable') {
                    tempItems.push({
                        product: `temp_${Date.now()}`,
                        productName: payload.name,
                        sku: payload.sku || '',
                        barcode: payload.itemBarcode || '',
                        purchasePrice: payload.price || 0,
                        discountType: payload.discountType || '',
                        discount: payload.discountValue || 0,
                        quantity: payload.quantity || 0,
                        tax: taxId,
                        newProductPayload: payload
                    });
                } else {
                    const variants = payload.variantRows || [];
                    const tempProductId = `temp_${Date.now()}`;
                    variants.forEach((v, idx) => {
                        tempItems.push({
                            product: tempProductId,
                            productName: payload.name,
                            variant: `temp_var_${Date.now()}_${idx}`,
                            variantLabel: Object.values(v.selections || {}).join(' / '),
                            sku: v.sku,
                            barcode: v.barcode || '',
                            purchasePrice: v.price || 0,
                            discountType: payload.discountType || '',
                            discount: payload.discountValue || 0,
                            quantity: v.quantity || 0,
                            tax: taxId,
                            newProductPayload: payload // Store payload to process in backend
                        });
                    });
                }

                if (tempItems.length > 0) {
                    const computedNew = tempItems.map(it => computeLine({ ...emptyItem, ...it }, taxes));
                    setItems(prev => {
                        const filteredPrev = prev.filter(it => it.product);
                        // If we were editing a virtual product, filter out the old temp rows
                        let filtered = filteredPrev;
                        if (editUnsavedPayload) {
                            // Find the existing temp product ID that holds this payload, or simply rely on the fact
                            // that we are overwriting the whole product's variants.
                            // To be safe, we find which `product` ID currently matches this payload.
                            // Since we didn't store the old temp product ID in state, we look it up by reference or name,
                            // but actually, we CAN store `editTempProductId`! 
                            // Wait, it's easier: just filter out any rows where `newProductPayload === editUnsavedPayload`.
                            filtered = filteredPrev.filter(it => it.newProductPayload !== editUnsavedPayload);
                        }
                        return [...filtered, ...computedNew];
                    });
                }
            } else {
                const productData = resObj.product || (resObj._id ? resObj : null);
                if (productData) {
                    await handleSelectExistingProduct(productData);
                }
            }
        }
    };

    const handleSelectExistingProduct = async (prod) => {
        setIsProductModalOpen(false);
        if (prod) {
            let tempItems = [];
            const taxId = prod.tax?._id || prod.tax || null;
            if (prod.productType !== 'variable') {
                tempItems.push({ 
                    product: prod._id, 
                    productName: prod.name, 
                    sku: prod.sku, 
                    barcode: prod.itemBarcode, 
                    purchasePrice: prod.price || 0, 
                    quantity: Number(prod.quantity) || 0, 
                    tax: taxId,
                    discountType: prod.discountType || '',
                    discount: prod.discountValue || 0 
                });
            } else {
                try {
                    const variants = await getProductVariants(prod._id);
                    if (variants && variants.length > 0) {
                        variants.forEach(v => {
                            tempItems.push({
                                product: prod._id,
                                productName: prod.name,
                                variant: v._id,
                                variantLabel: Object.values(v.selections || {}).join(' / '),
                                sku: v.sku,
                                barcode: v.barcode || '',
                                purchasePrice: v.price || 0,
                                quantity: Number(v.quantity) || 0,
                                tax: v.tax?._id || v.tax || taxId,
                                discountType: v.discountType || prod.discountType || '',
                                discount: v.discountValue || prod.discountValue || 0
                            });
                        });
                    }
                } catch (e) {
                    console.error('Failed to load variants');
                }
            }

            if (tempItems.length > 0) {
                const computedNew = tempItems.map(it => computeLine({ ...emptyItem, ...it }, taxes));
                setItems(prev => {
                    const filteredPrev = prev.filter(it => it.product);
                    const filtered = filteredPrev.filter(it => it.product !== prod._id);
                    const finalItems = [...filtered, ...computedNew];
                    return finalItems.length > 0 ? finalItems : [{ ...emptyItem }];
                });
            }
        }
    };

    useEffect(() => {
        Promise.all([getVendors(), getWarehouses(), getTaxes()])
            .then(([v, w, t]) => {
                setVendors(v);
                setWarehouses(w);
                setTaxes(t);

                if (isEdit) {
                    getPurchaseById(id).then(initialData => {
                        setHeader({
                            vendor: initialData.vendor?._id || initialData.vendor || '',
                            warehouse: initialData.warehouse?._id || initialData.warehouse || '',
                            purchaseDate: initialData.purchaseDate ? initialData.purchaseDate.split('T')[0] : new Date().toISOString().split('T')[0],
                            invoiceNumber: initialData.invoiceNumber || '',
                            invoiceDate: initialData.invoiceDate ? initialData.invoiceDate.split('T')[0] : '',
                            dueDate: initialData.dueDate ? initialData.dueDate.split('T')[0] : '',
                            paymentTerms: initialData.paymentTerms || '',
                            currency: initialData.currency || 'INR',
                            referenceNumber: initialData.referenceNumber || '',
                            notes: initialData.notes || '',
                            status: initialData.status || 'Draft',
                            shipping: initialData.shipping || 0,
                            roundOff: initialData.roundOff || 0
                        });
                        const mapped = (initialData.items || []).map((it) => {
                            const baseItem = {
                                ...emptyItem,
                                product: it.product?._id || it.product,
                                productName: it.product?.name || '',
                                variant: it.variant?._id || it.variant || null,
                                variantLabel: it.variant?.variantLabel || '',
                                sku: it.sku,
                                barcode: it.barcode,
                                quantity: it.quantity,
                                freeQuantity: it.freeQuantity || 0,
                                purchasePrice: it.purchasePrice,
                                discountType: it.discountType || '',
                                discount: it.discount || 0,
                                tax: it.tax?._id || it.tax || null,
                            };
                            return computeLine(baseItem, t);
                        });
                        setItems(mapped.length ? mapped : [{ ...emptyItem }]);
                        setPageLoading(false);
                    }).catch(() => {
                        setError('Failed to load purchase details');
                        setPageLoading(false);
                    });
                } else {
                    setPageLoading(false);
                }
            })
            .catch(() => {
                setError('Failed to load prerequisites');
                setPageLoading(false);
            });
    }, [id, isEdit]);

    const addItem = (newItem) => {
        setItems((prev) => [...prev, computeLine({ ...emptyItem, ...newItem }, taxes)]);
    };

    const updateItem = (idx, field, value) => {
        setItems((prev) => {
            const next = [...prev];
            next[idx] = { ...next[idx], [field]: value };
            next[idx] = computeLine(next[idx], taxes);
            return next;
        });
    };

    const removeItem = (idx) => {
        setItems((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== idx) : prev));
    };

    // Remove all variants for a specific product
    const removeProductGroup = (productId) => {
        setItems((prev) => {
            const filtered = prev.filter(it => it.product !== productId);
            return filtered.length > 0 ? filtered : [{ ...emptyItem }];
        });
    };

    // Group items for display
    const groupedItems = items.reduce((acc, it) => {
        if (!it.product) return acc;
        const existing = acc.find(g => g.productId === it.product);
        if (existing) {
            existing.quantity += Number(it.quantity) || 0;
            existing.discountAmount += Number(it.discountAmount) || 0;
            existing.taxAmount += Number(it.taxAmount) || 0;
            existing.total += Number(it.total) || 0;
            existing.variantsCount += 1;
            existing.items.push(it);
        } else {
            acc.push({
                productId: it.product,
                productName: it.productName,
                quantity: Number(it.quantity) || 0,
                discountAmount: Number(it.discountAmount) || 0,
                taxAmount: Number(it.taxAmount) || 0,
                total: Number(it.total) || 0,
                variantsCount: it.variant ? 1 : 0,
                taxTypeStr: it.tax ? taxes.find(t => t._id === it.tax)?.name : 'None',
                items: [it]
            });
        }
        return acc;
    }, []);

    const totals = items.reduce((acc, it) => {
        acc.subtotal += it.subtotal || 0;
        acc.discount += (it.subtotal || 0) - ((it.subtotal || 0) - (it.discountType === 'Percentage' ? (it.subtotal * (Number(it.discount) || 0)) / 100 : Math.min(Number(it.discount) || 0, it.subtotal || 0)));
        acc.tax += it.taxAmount || 0;
        return acc;
    }, { subtotal: 0, discount: 0, tax: 0 });

    const grandTotal = totals.subtotal - totals.discount + totals.tax + (Number(header.shipping) || 0) + (Number(header.roundOff) || 0);

    const handleSave = async (actionStatus) => {
        setError(null);
        if (!header.vendor) return setError('Vendor is required');
        if (!header.warehouse) return setError('Warehouse is required');
        const validItems = items.filter((it) => it.product && Number(it.quantity) > 0);
        if (validItems.length === 0) return setError('Add at least one item with quantity');

        const payload = {
            vendor: header.vendor,
            warehouse: header.warehouse,
            purchaseDate: header.purchaseDate,
            invoiceNumber: header.invoiceNumber,
            invoiceDate: header.invoiceDate || null,
            dueDate: header.dueDate || null,
            paymentTerms: header.paymentTerms,
            currency: header.currency,
            referenceNumber: header.referenceNumber,
            notes: header.notes,
            status: actionStatus,
            shipping: Number(header.shipping) || 0,
            roundOff: Number(header.roundOff) || 0,
            items: validItems.map((it) => ({
                product: it.product,
                variant: it.variant || null,
                sku: it.sku,
                barcode: it.barcode,
                quantity: Number(it.quantity),
                freeQuantity: Number(it.freeQuantity) || 0,
                purchasePrice: Number(it.purchasePrice),
                discountType: it.discountType,
                discount: Number(it.discount) || 0,
                tax: it.tax || null,
                newProductPayload: it.newProductPayload
            }))
        };

        setSaving(true);
        try {
            if (isEdit) {
                await updatePurchase(id, payload);
            } else {
                await createPurchase(payload);
            }
            setSaving(false);
            navigate('/purchase-orders');
        } catch (err) {
            setSaving(false);
            setError(err.message);
        }
    };

    return (
        <DashboardLayout>
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.title}>{isEdit ? 'Edit Purchase' : 'Add Purchase'}</h1>
                    <p className={styles.subtitle}>{isEdit ? 'Update purchase order details' : 'Create a new purchase order'}</p>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {pageLoading ? (
                    <Card><div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div></Card>
                ) : (
                    <>
                        <Card>
                            <div style={{ padding: '1rem' }}>
                                <div className={styles.formRow}>
                                    <div className={styles.formCol}>
                                        <label>Vendor <span className={styles.required}>*</span></label>
                                        <select className={styles.select} value={header.vendor} onChange={(e) => setHeader({ ...header, vendor: e.target.value })}>
                                            <option value="">Select Vendor</option>
                                            {vendors.map((v) => <option key={v._id} value={v._id}>{v.vendorName} {v.vendorCode ? `(${v.vendorCode})` : ''}</option>)}
                                        </select>
                                    </div>
                                    <div className={styles.formCol}>
                                        <label>Warehouse <span className={styles.required}>*</span></label>
                                        <select className={styles.select} value={header.warehouse} onChange={(e) => setHeader({ ...header, warehouse: e.target.value })}>
                                            <option value="">Select Warehouse</option>
                                            {warehouses.map((w) => <option key={w._id} value={w._id}>{w.name}</option>)}
                                        </select>
                                    </div>
                                    <div className={styles.formCol}>
                                        <label>Purchase Date <span className={styles.required}>*</span></label>
                                        <input type="date" className={styles.input} value={header.purchaseDate} onChange={(e) => setHeader({ ...header, purchaseDate: e.target.value })} />
                                    </div>
                                </div>

                                <div className={styles.formRow}>
                                    <div className={styles.formCol}>
                                        <label>Invoice Number</label>
                                        <input className={styles.input} value={header.invoiceNumber} onChange={(e) => setHeader({ ...header, invoiceNumber: e.target.value })} />
                                    </div>
                                    <div className={styles.formCol}>
                                        <label>Invoice Date</label>
                                        <input type="date" className={styles.input} value={header.invoiceDate} onChange={(e) => setHeader({ ...header, invoiceDate: e.target.value })} />
                                    </div>
                                    <div className={styles.formCol}>
                                        <label>Due Date</label>
                                        <input type="date" className={styles.input} value={header.dueDate} onChange={(e) => setHeader({ ...header, dueDate: e.target.value })} />
                                    </div>
                                    <div className={styles.formCol}>
                                        <label>Reference</label>
                                        <input className={styles.input} value={header.referenceNumber} onChange={(e) => setHeader({ ...header, referenceNumber: e.target.value })} />
                                    </div>
                                    {/* Status is always Approved - hidden from UI */}
                                </div>

                            </div>
                        </Card>

                        <Card>
                            <div style={{ padding: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <label style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1B2850' }}>Purchase Items</label>
                                    <button type="button" onClick={() => setIsProductModalOpen(true)} style={{ backgroundColor: '#1B2850', color: 'white', border: 'none', padding: '0.6rem 1rem', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}>
                                        <Plus size={16} /> Add New Item
                                    </button>
                                </div>

                                <div className={styles.itemsTableWrap}>
                                    <table className={styles.itemsTable}>
                                        <thead>
                                            <tr>
                                                <th>Product</th>
                                                <th>Variant Info</th>
                                                <th>Total Qty</th>
                                                <th>Total Discount</th>
                                                <th>Avg Tax</th>
                                                <th>Total GST</th>
                                                <th>Total Amount</th>
                                                <th style={{ textAlign: 'center' }}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {groupedItems.map((group, idx) => (
                                                <tr key={idx}>
                                                    <td style={{ minWidth: 160 }}>
                                                        <div style={{ fontWeight: 600, color: '#111827' }}>{group.productName || 'Unknown Product'}</div>
                                                    </td>
                                                    <td>
                                                        <span style={{ fontSize: '0.8rem', color: '#6B7280', backgroundColor: '#F3F4F6', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                                                            {group.variantsCount > 0 ? `${group.variantsCount} Variants` : 'Single Product'}
                                                        </span>
                                                    </td>
                                                    <td style={{ fontWeight: 500 }}>{group.quantity}</td>
                                                    <td style={{ color: '#E11D48', fontWeight: 500 }}>-₹{group.discountAmount.toFixed(2)}</td>
                                                    <td>{group.taxTypeStr}</td>
                                                    <td>₹{group.taxAmount.toFixed(2)}</td>
                                                    <td style={{ fontWeight: 600, color: '#047857' }}>₹{group.total.toFixed(2)}</td>
                                                    <td style={{ textAlign: 'center' }}>
                                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    if (group.productId.toString().startsWith('temp_')) {
                                                                        setEditUnsavedPayload(group.items[0].newProductPayload);
                                                                        setEditProductId(null);
                                                                    } else {
                                                                        setEditProductId(group.productId);
                                                                        setEditUnsavedPayload(null);
                                                                    }
                                                                    setIsProductModalOpen(true);
                                                                }}
                                                                className={styles.actionBtn}
                                                                style={{ color: '#4F46E5', backgroundColor: '#EEF2FF', border: '1px solid #C7D2FE', borderRadius: '4px', padding: '0.3rem 0.5rem' }}
                                                            >
                                                                <Edit size={14} /> Edit
                                                            </button>
                                                            <button 
                                                                type="button" 
                                                                className={styles.actionBtn} 
                                                                onClick={() => removeProductGroup(group.productId)} 
                                                                style={{ color: '#EA5455', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '4px', padding: '0.3rem 0.5rem' }}
                                                            >
                                                                <Trash2 size={14} /> Remove
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            {items.length === 0 && (
                                                <tr><td colSpan="11" className={styles.emptyState}>No items added</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                <div className={styles.totalsBox}>
                                    <div className={styles.totalsRow}><span>Subtotal</span><span>₹{totals.subtotal.toFixed(2)}</span></div>
                                    <div className={styles.totalsRow}><span>Discount</span><span>₹{totals.discount.toFixed(2)}</span></div>
                                    <div className={styles.totalsRow}><span>GST</span><span>₹{totals.tax.toFixed(2)}</span></div>
                                    <div className={styles.formRow} style={{ margin: '0.5rem 0' }}>
                                        <div className={styles.formCol}>
                                            <label>Shipping</label>
                                            <input type="number" className={styles.input} value={header.shipping} onChange={(e) => setHeader({ ...header, shipping: e.target.value })} />
                                        </div>
                                        <div className={styles.formCol}>
                                            <label>Round Off</label>
                                            <input type="number" className={styles.input} value={header.roundOff} onChange={(e) => setHeader({ ...header, roundOff: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className={styles.totalsRow}><span>Grand Total</span><span>₹{grandTotal.toFixed(2)}</span></div>
                                </div>

                                {error && <div style={{ color: '#EA5455', margin: '1rem 0', fontSize: '0.875rem' }}>{error}</div>}

                                <div className={styles.footerActions} style={{ marginTop: '2rem', justifyContent: 'flex-end', display: 'flex', gap: '1rem' }}>
                                    <button type="button" className={styles.btnCancel} onClick={() => navigate('/purchase-orders')}>Cancel</button>
                                    <button type="button" className={styles.btnSubmit} disabled={saving} onClick={() => handleSave('Approved')}>
                                        {saving ? 'Saving...' : 'Save & Approve'}
                                    </button>
                                </div>
                            </div>
                        </Card>
                    </>
                )}
            </div>
            <ProductModal
                isOpen={isProductModalOpen}
                onClose={() => {
                    setIsProductModalOpen(false);
                    setEditProductId(null);
                    setEditUnsavedPayload(null);
                }}
                onSuccess={handleNewProductCreated}
                onSelectProduct={handleSelectExistingProduct}
                editProductId={editProductId}
                editUnsavedPayload={editUnsavedPayload}
            />
        </DashboardLayout>
    );
};

export default AddPurchase;
