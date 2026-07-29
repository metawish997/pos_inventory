import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import Card from '../../../../components/ui/Card';
import styles from '../../purchase.module.css';
import { getVendors, getWarehouses, getTaxes, createPurchase, updatePurchase, getPurchaseById, getProductVariants } from '../../services/purchaseService';
import ProductModal from '../../../../components/modals/ProductModal';
import { Plus, Edit, Trash2, Calendar, FileText, Landmark, ShieldAlert } from 'lucide-react';

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
                        let filtered = filteredPrev;
                        if (editUnsavedPayload) {
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

    const removeProductGroup = (productId) => {
        setItems((prev) => {
            const filtered = prev.filter(it => it.product !== productId);
            return filtered.length > 0 ? filtered : [{ ...emptyItem }];
        });
    };

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

    const selectedVendorDetails = vendors.find(v => v._id === header.vendor);
    const selectedWarehouseDetails = warehouses.find(w => w._id === header.warehouse);

    const labelStyle = {
        fontSize: '0.825rem',
        fontWeight: 600,
        color: '#4B5563',
        marginBottom: '0.4rem',
        display: 'block'
    };

    const inputStyle = {
        width: '100%',
        padding: '0.4rem 0.5rem',
        border: 'none',
        borderBottom: '1px solid #D1D5DB',
        fontSize: '0.875rem',
        color: '#111827',
        backgroundColor: 'transparent',
        outline: 'none',
        boxSizing: 'border-box'
    };

    return (
        <DashboardLayout>
            <div style={{ backgroundColor: '#F9FAFB', minHeight: '100vh', padding: '2rem 1.5rem' }}>
                <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', padding: '2.5rem' }}>
                    
                    {/* Centered Page Title */}
                    <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            {isEdit ? 'Edit Purchase' : 'Record Purchase'}
                        </h2>
                        <div style={{ height: '3px', width: '60px', backgroundColor: '#FF9F43', margin: '0.75rem auto 0 auto', borderRadius: '2px' }} />
                    </div>

                    {pageLoading ? (
                        <div style={{ padding: '4rem', textAlign: 'center', fontSize: '1.1rem', color: '#6B7280' }}>Loading...</div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                            
                            {/* Top Grid: Metadata Inputs */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '4rem', borderBottom: '1px solid #F3F4F6', paddingBottom: '2.5rem' }}>
                                
                                {/* Left Side: Underlying Styled Text Inputs */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                    <div>
                                        <label style={labelStyle}>Ref / PO Number</label>
                                        <input 
                                            type="text" 
                                            placeholder="Enter Reference Number"
                                            value={header.referenceNumber} 
                                            onChange={(e) => setHeader({ ...header, referenceNumber: e.target.value })} 
                                            style={inputStyle} 
                                        />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Invoice Number</label>
                                        <input 
                                            type="text" 
                                            placeholder="Enter Invoice Number"
                                            value={header.invoiceNumber} 
                                            onChange={(e) => setHeader({ ...header, invoiceNumber: e.target.value })} 
                                            style={inputStyle} 
                                        />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Purchase Date*</label>
                                        <input 
                                            type="date" 
                                            value={header.purchaseDate} 
                                            onChange={(e) => setHeader({ ...header, purchaseDate: e.target.value })} 
                                            style={inputStyle} 
                                        />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Invoice Date</label>
                                        <input 
                                            type="date" 
                                            value={header.invoiceDate} 
                                            onChange={(e) => setHeader({ ...header, invoiceDate: e.target.value })} 
                                            style={inputStyle} 
                                        />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Due Date</label>
                                        <input 
                                            type="date" 
                                            value={header.dueDate} 
                                            onChange={(e) => setHeader({ ...header, dueDate: e.target.value })} 
                                            style={inputStyle} 
                                        />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Payment Terms</label>
                                        <input 
                                            type="text" 
                                            placeholder="e.g. Net 30, Due on Receipt"
                                            value={header.paymentTerms} 
                                            onChange={(e) => setHeader({ ...header, paymentTerms: e.target.value })} 
                                            style={inputStyle} 
                                        />
                                    </div>
                                </div>

                                {/* Right Side: Simple Placeholder/Details Card */}
                                <div style={{ border: '1px dashed #D1D5DB', borderRadius: '8px', backgroundColor: '#F9FAFB', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', textAlign: 'center' }}>
                                    <FileText size={28} style={{ color: '#FF9F43', marginBottom: '0.5rem' }} />
                                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.25rem' }}>Purchase Details</span>
                                    <span style={{ fontSize: '0.75rem', color: '#6B7280', display: 'block', lineHeight: 1.4 }}>Status is automatically set to Approved on submission to register stock updates.</span>
                                </div>
                            </div>

                            {/* Vendor & Warehouse details row */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                
                                {/* Vendor Card (Billed By Vendor) */}
                                <div style={{ border: '1px solid #F3F4F6', borderRadius: '8px', padding: '1.5rem', backgroundColor: '#F9FAFB' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                        <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#374151' }}>Vendor / Supplier <span style={{ fontSize: '0.75rem', color: '#EA5455', fontWeight: 400 }}>*</span></span>
                                    </div>
                                    <div style={{ position: 'relative', marginBottom: '1rem' }}>
                                        <select 
                                            value={header.vendor} 
                                            onChange={(e) => setHeader({ ...header, vendor: e.target.value })}
                                            style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #D1D5DB', backgroundColor: 'white', fontSize: '0.875rem', fontWeight: 500, outline: 'none' }}
                                        >
                                            <option value="">Select Vendor</option>
                                            {vendors.map((v) => (
                                                <option key={v._id} value={v._id}>{v.vendorName} {v.vendorCode ? `(${v.vendorCode})` : ''}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {selectedVendorDetails && (
                                        <div style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #E5E7EB', padding: '1.25rem' }}>
                                            <div style={{ fontWeight: 600, color: '#111827', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{selectedVendorDetails.vendorName}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#6B7280', marginBottom: '0.5rem' }}>
                                                {selectedVendorDetails.address || 'No address provided'}
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '0.25rem', fontSize: '0.8rem' }}>
                                                <span style={{ color: '#9CA3AF' }}>Email</span>
                                                <span style={{ fontWeight: 500, color: '#374151' }}>{selectedVendorDetails.email || 'N/A'}</span>
                                                <span style={{ color: '#9CA3AF' }}>Phone</span>
                                                <span style={{ fontWeight: 500, color: '#374151' }}>{selectedVendorDetails.phone || 'N/A'}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Warehouse Card (Deliver To) */}
                                <div style={{ border: '1px solid #F3F4F6', borderRadius: '8px', padding: '1.5rem', backgroundColor: '#F9FAFB' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                        <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#374151' }}>Deliver To (Warehouse) <span style={{ fontSize: '0.75rem', color: '#EA5455', fontWeight: 400 }}>*</span></span>
                                    </div>
                                    <div style={{ position: 'relative', marginBottom: '1rem' }}>
                                        <select 
                                            value={header.warehouse} 
                                            onChange={(e) => setHeader({ ...header, warehouse: e.target.value })}
                                            style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #D1D5DB', backgroundColor: 'white', fontSize: '0.875rem', fontWeight: 500, outline: 'none' }}
                                        >
                                            <option value="">Select Warehouse</option>
                                            {warehouses.map((w) => (
                                                <option key={w._id} value={w._id}>{w.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {selectedWarehouseDetails && (
                                        <div style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #E5E7EB', padding: '1.25rem' }}>
                                            <div style={{ fontWeight: 600, color: '#111827', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{selectedWarehouseDetails.name}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#6B7280', marginBottom: '0.5rem' }}>
                                                {selectedWarehouseDetails.location || 'No location configured'}
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '0.25rem', fontSize: '0.8rem' }}>
                                                <span style={{ color: '#9CA3AF' }}>Type</span>
                                                <span style={{ fontWeight: 500, color: '#374151' }}>Stock Warehouse</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Billing Items Table Section */}
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <span style={{ fontSize: '1rem', fontWeight: 700, color: '#1F2937' }}>Purchase Items</span>
                                    <button 
                                        type="button" 
                                        onClick={() => setIsProductModalOpen(true)} 
                                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', border: 'none', backgroundColor: '#FF9F43', color: 'white', padding: '0.5rem 1.25rem', borderRadius: '6px', fontSize: '0.825rem', cursor: 'pointer', fontWeight: 600, boxShadow: '0 2px 4px rgba(255, 159, 67, 0.2)' }}
                                    >
                                        <Plus size={16} /> Add / Select Items
                                    </button>
                                </div>

                                <div style={{ border: '1px solid #E5E7EB', borderRadius: '8px 8px 0 0', overflow: 'hidden', marginBottom: '1.5rem' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr style={{ backgroundColor: '#FF9F43', color: 'white', fontSize: '0.875rem' }}>
                                                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600 }}>Product</th>
                                                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, width: '120px' }}>Variant Info</th>
                                                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, width: '100px' }}>Total Qty</th>
                                                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, width: '120px' }}>Total Discount</th>
                                                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, width: '100px' }}>Avg Tax</th>
                                                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, width: '110px' }}>Total GST</th>
                                                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, width: '130px' }}>Total Amount</th>
                                                <th style={{ padding: '0.75rem 1rem', textAlign: 'center', fontWeight: 600, width: '150px' }}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {groupedItems.map((group, idx) => (
                                                <tr key={idx} style={{ borderBottom: '1px solid #F3F4F6', fontSize: '0.875rem' }}>
                                                    <td style={{ padding: '1rem', fontWeight: 600, color: '#111827' }}>
                                                        {group.productName || 'Unknown Product'}
                                                    </td>
                                                    <td style={{ padding: '1rem' }}>
                                                        <span style={{ fontSize: '0.75rem', color: '#4B5563', backgroundColor: '#F3F4F6', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 500 }}>
                                                            {group.variantsCount > 0 ? `${group.variantsCount} Variants` : 'Single Product'}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '1rem', fontWeight: 500 }}>{group.quantity}</td>
                                                    <td style={{ padding: '1rem', color: '#EF4444', fontWeight: 500 }}>-₹{group.discountAmount.toFixed(2)}</td>
                                                    <td style={{ padding: '1rem', color: '#4B5563' }}>{group.taxTypeStr}</td>
                                                    <td style={{ padding: '1rem', color: '#4B5563' }}>₹{group.taxAmount.toFixed(2)}</td>
                                                    <td style={{ padding: '1rem', fontWeight: 700, color: '#10B981' }}>₹{group.total.toFixed(2)}</td>
                                                    <td style={{ padding: '1rem', textAlign: 'center' }}>
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
                                                                style={{ border: '1px solid #FF9F43', background: 'none', color: '#FF9F43', padding: '0.3rem 0.65rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                                                            >
                                                                <Edit size={12} /> Edit
                                                            </button>
                                                            <button 
                                                                type="button" 
                                                                onClick={() => removeProductGroup(group.productId)} 
                                                                style={{ border: '1px solid #FCA5A5', background: 'none', color: '#EF4444', padding: '0.3rem 0.65rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                                                            >
                                                                <Trash2 size={12} /> Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            {items.length === 0 && (
                                                <tr>
                                                    <td colSpan="8" style={{ padding: '3rem', textAlign: 'center', color: '#9CA3AF', fontSize: '0.875rem' }}>
                                                        No items added yet. Click "+ Add / Select Items" to begin.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Bottom row: Note, Shipping & Totals grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '3rem' }}>
                                
                                {/* Left Side: Notes & Extra Inputs */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    <div>
                                        <label style={labelStyle}>Notes / Remarks</label>
                                        <textarea 
                                            rows={4} 
                                            placeholder="Write internal purchase remarks or vendor guidelines here..." 
                                            value={header.notes} 
                                            onChange={(e) => setHeader({ ...header, notes: e.target.value })} 
                                            style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #D1D5DB', borderRadius: '8px', outline: 'none', fontSize: '0.875rem', resize: 'vertical', boxSizing: 'border-box' }}
                                        />
                                    </div>
                                    
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                        <div>
                                            <label style={labelStyle}>Shipping Charges (₹)</label>
                                            <input 
                                                type="number" 
                                                value={header.shipping} 
                                                onChange={(e) => setHeader({ ...header, shipping: e.target.value })} 
                                                style={{ width: '100%', padding: '0.6rem 0.85rem', border: '1px solid #D1D5DB', borderRadius: '6px', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }}
                                            />
                                        </div>
                                        <div>
                                            <label style={labelStyle}>Round Off Adjust (₹)</label>
                                            <input 
                                                type="number" 
                                                value={header.roundOff} 
                                                onChange={(e) => setHeader({ ...header, roundOff: e.target.value })} 
                                                style={{ width: '100%', padding: '0.6rem 0.85rem', border: '1px solid #D1D5DB', borderRadius: '6px', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side: Totals Card */}
                                <div>
                                    <div style={{ backgroundColor: '#F9FAFB', borderRadius: '8px', border: '1px solid #E5E7EB', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#4B5563' }}>
                                            <span>Subtotal</span>
                                            <span style={{ fontWeight: 500 }}>₹{totals.subtotal.toFixed(2)}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#EF4444' }}>
                                            <span>Total Discount</span>
                                            <span style={{ fontWeight: 500 }}>-₹{totals.discount.toFixed(2)}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#4B5563' }}>
                                            <span>GST Tax Paid</span>
                                            <span style={{ fontWeight: 500 }}>₹{totals.tax.toFixed(2)}</span>
                                        </div>
                                        {header.shipping > 0 && (
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#4B5563' }}>
                                                <span>Shipping</span>
                                                <span style={{ fontWeight: 500 }}>₹{Number(header.shipping).toFixed(2)}</span>
                                            </div>
                                        )}
                                        {header.roundOff !== 0 && (
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#4B5563' }}>
                                                <span>Round Off</span>
                                                <span style={{ fontWeight: 500 }}>₹{Number(header.roundOff).toFixed(2)}</span>
                                            </div>
                                        )}
                                        <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '0.85rem', marginTop: '0.25rem', display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem', fontWeight: 800, color: '#111827' }}>
                                            <span>Grand Total</span>
                                            <span style={{ color: '#FF9F43' }}>₹{grandTotal.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Error alerts */}
                            {error && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', color: '#EF4444', padding: '0.75rem 1rem', borderRadius: '6px', fontSize: '0.875rem', fontWeight: 500 }}>
                                    <ShieldAlert size={16} /> {error}
                                </div>
                            )}

                            {/* Footer Actions */}
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid #F3F4F6', paddingTop: '1.5rem', marginTop: '1rem' }}>
                                <button type="button" onClick={() => navigate('/purchase-orders')} style={{ border: 'none', backgroundColor: '#F3F4F6', color: '#4B5563', padding: '0.65rem 1.5rem', borderRadius: '6px', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                                <button 
                                    type="button" 
                                    disabled={saving} 
                                    onClick={() => handleSave('Approved')} 
                                    style={{ border: 'none', backgroundColor: '#FF9F43', color: 'white', padding: '0.65rem 2rem', borderRadius: '6px', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 4px rgba(255, 159, 67, 0.2)' }}
                                >
                                    {saving ? 'Saving...' : 'Save & Approve'}
                                </button>
                            </div>

                        </div>
                    )}
                </div>
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
