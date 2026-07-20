import React, { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Accordion from '../components/ui/Accordion';
import styles from '../pages/AddProduct.module.css';
import { PlusCircle, X } from 'lucide-react';
import VariantRowBuilder from '../components/modals/VariantBuilderModal';

import {
    getStores,
    getWarehouses,
    getCategories,
    getSubCategories,
    getBrands,
    getTaxes,
    getWarranties,
    getVariantAttributes,
    uploadImage
} from '../services/inventoryService';
import { createProduct, updateProduct } from '../services/productService';
import { API_BASE_URL } from '../api/endpoints';

const getImageUrl = (url) => {
    if (!url) return '';
    const base = API_BASE_URL.replace('/api', '');
    
    try {
        if (url.startsWith('http://localhost:')) {
            const urlObj = new URL(url);
            return `${base}${urlObj.pathname}`;
        }
    } catch (e) {
        // ignore
    }

    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) return url;
    return `${base}/${url.replace(/^\/+/, '')}`;
};

const SinglePricingSummary = ({ price, taxType, tax, discountType, discountValue }) => {
    const base = Number(price) || 0;
    const taxRate = tax?.taxValue || 0;
    const discVal = Number(discountValue) || 0;

    let taxAmount = 0;
    let finalPriceBeforeDiscount = base;
    let reverseNote = '';

    if (taxType === 'Inclusive') {
        taxAmount = taxRate > 0 ? base - (base / (1 + taxRate / 100)) : 0;
        finalPriceBeforeDiscount = base;
        reverseNote = `Inclusive: tax (${taxRate}%) is already inside the base price.`;
    } else {
        taxAmount = (base * taxRate) / 100;
        finalPriceBeforeDiscount = base + taxAmount;
        reverseNote = `Exclusive: tax (${taxRate}%) is added on top of the base price.`;
    }

    let discountAmount = 0;
    if (discountType === 'Percentage') {
        discountAmount = (finalPriceBeforeDiscount * discVal) / 100;
    } else if (discountType === 'Fixed') {
        discountAmount = discVal;
    }

    const finalPrice = Math.max(0, finalPriceBeforeDiscount - discountAmount);

    return (
        <div style={{ marginTop: '1rem', backgroundColor: '#F0F4FF', border: '1px solid #C7D2FE', borderRadius: '8px', padding: '1rem' }}>
            <div style={{ fontWeight: 700, color: '#1B2850', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                Computed Tax & Discount
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem', fontSize: '0.85rem', color: '#374151' }}>
                <div><strong>Base Price:</strong> ${base.toFixed(2)}</div>
                <div><strong>Tax ({taxRate}%):</strong> ${taxAmount.toFixed(2)}</div>
                <div><strong>Discount:</strong> ${discountAmount.toFixed(2)}</div>
                <div style={{ color: '#1B2850', fontWeight: 700 }}><strong>Final Price:</strong> ${finalPrice.toFixed(2)}</div>
            </div>
            <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#6B7280' }}>
                {reverseNote}. {discountType === 'Percentage' ? `Discount ${discVal}% of taxable.` : discountType === 'Fixed' ? `Flat discount $${discVal.toFixed(2)}.` : 'No discount.'} Final price is stored as the product price.
            </div>
        </div>
    );
};

const ProductForm = ({ mode = 'create', initialData = null, initialVariants = [], onSuccess, asModal = false }) => {
    const isEdit = mode === 'edit';

    const [hasWarranty, setHasWarranty] = useState(false);
    const [hasManufacturer, setHasManufacturer] = useState(false);
    const [hasExpiry, setHasExpiry] = useState(false);
    const [productType, setProductType] = useState('single');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    // Dynamic Master Collections States
    const [stores, setStores] = useState([]);
    const [allWarehouses, setAllWarehouses] = useState([]);
    const [filteredWarehouses, setFilteredWarehouses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [allSubCategories, setAllSubCategories] = useState([]);
    const [filteredSubCategories, setFilteredSubCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [taxes, setTaxes] = useState([]);
    const [warranties, setWarranties] = useState([]);
    const [variantMasters, setVariantMasters] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Image handling: existing (URLs) + new (File objects)
    const [existingImages, setExistingImages] = useState([]);
    const [newImages, setNewImages] = useState([]);
    const fileInputRef = useRef(null);

    // Variant rows
    const [enabledAttributeIds, setEnabledAttributeIds] = useState([]);
    const [variantRows, setVariantRows] = useState([]);

    const [formData, setFormData] = useState({
        store: '',
        warehouse: '',
        name: '',
        slug: '',
        sku: '',
        sellingType: '',
        category: '',
        subCategory: '',
        brand: '',
        barcodeSymbology: '',
        itemBarcode: '',
        description: '',
        quantity: '',
        price: '',
        taxType: '',
        tax: '',
        discountType: '',
        discountValue: '',
        quantityAlert: '',
        warrantyPlan: '',
        manufacturer: '',
        manufacturedDate: '',
        expiryOn: '',
        status: 'Active'
    });

    const handleNameChange = (nameVal) => {
        const slugCalculated = nameVal
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');

        setFormData(prev => ({
            ...prev,
            name: nameVal,
            slug: slugCalculated
        }));
    };

    const handleGenerateSKU = () => {
        const randomCode = 'SKU-' + Math.random().toString(36).substring(2, 8).toUpperCase();
        setFormData(prev => ({ ...prev, sku: randomCode }));
    };

    const handleGenerateBarcode = () => {
        const randomBarcode = Math.floor(10000000 + Math.random() * 90000000).toString();
        setFormData(prev => ({ ...prev, itemBarcode: randomBarcode }));
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        if (field === 'store') {
            setFormData(prev => ({ ...prev, store: value, warehouse: '' }));
            if (!value) {
                setFilteredWarehouses([]);
            } else {
                const matches = allWarehouses.filter(w => w.store === value || w.storeId === value);
                setFilteredWarehouses(matches.length > 0 ? matches : allWarehouses);
            }
        }

        if (field === 'category') {
            setFormData(prev => ({ ...prev, category: value, subCategory: '' }));
            if (!value) {
                setFilteredSubCategories([]);
            } else {
                const matches = allSubCategories.filter(sc => sc.category === value || sc.categoryId === value);
                setFilteredSubCategories(matches.length > 0 ? matches : allSubCategories);
            }
        }
    };

    // Fetch masters + populate edit data
    useEffect(() => {
        const fetchAllMasters = async () => {
            try {
                setIsLoading(true);
                const [
                    storesRes, warehousesRes, categoriesRes, subCategoriesRes,
                    brandsRes, taxesRes, warrantiesRes, variantsRes
                ] = await Promise.all([
                    getStores(), getWarehouses(), getCategories(), getSubCategories(),
                    getBrands(), getTaxes(), getWarranties(), getVariantAttributes()
                ]);

                setStores(Array.isArray(storesRes) ? storesRes : []);
                setAllWarehouses(Array.isArray(warehousesRes) ? warehousesRes : []);
                setCategories(Array.isArray(categoriesRes) ? categoriesRes : []);
                setAllSubCategories(Array.isArray(subCategoriesRes) ? subCategoriesRes : []);
                setBrands(Array.isArray(brandsRes) ? brandsRes : []);
                setTaxes(Array.isArray(taxesRes) ? taxesRes : []);
                setWarranties(Array.isArray(warrantiesRes) ? warrantiesRes : []);
                setVariantMasters(Array.isArray(variantsRes) ? variantsRes : []);

                if (initialData) {
                    // Populate form from existing product
                    setFormData({
                        store: initialData.store?._id || initialData.store || '',
                        warehouse: initialData.warehouse?._id || initialData.warehouse || '',
                        name: initialData.name || '',
                        slug: initialData.slug || '',
                        sku: initialData.sku || '',
                        sellingType: initialData.sellingType || '',
                        category: initialData.category?._id || initialData.category || '',
                        subCategory: initialData.subCategory?._id || initialData.subCategory || '',
                        brand: initialData.brand?._id || initialData.brand || '',
                        barcodeSymbology: initialData.barcodeSymbology || '',
                        itemBarcode: initialData.itemBarcode || '',
                        description: initialData.description || '',
                        quantity: initialData.quantity ?? '',
                        price: initialData.price ?? '',
                        taxType: initialData.taxType || '',
                        tax: initialData.tax?._id || initialData.tax || '',
                        discountType: initialData.discountType || '',
                        discountValue: initialData.discountValue ?? '',
                        quantityAlert: initialData.quantityAlert ?? '',
                        warrantyPlan: initialData.warrantyPlan?._id || initialData.warrantyPlan || '',
                        manufacturer: initialData.manufacturer || '',
                        manufacturedDate: initialData.manufacturedDate
                            ? new Date(initialData.manufacturedDate).toISOString().split('T')[0]
                            : '',
                        expiryOn: initialData.expiryOn
                            ? new Date(initialData.expiryOn).toISOString().split('T')[0]
                            : '',
                        status: initialData.status || 'Active'
                    });

                    setHasWarranty(!!initialData.hasWarranty);
                    setHasManufacturer(!!initialData.hasManufacturer);
                    setHasExpiry(!!initialData.hasExpiry);
                    setProductType(initialData.productType || 'single');
                    setExistingImages(Array.isArray(initialData.images) ? initialData.images : []);

                    // Pre-populate dependent dropdowns from the product's store/category
                    const storeId = initialData.store?._id || initialData.store;
                    if (storeId) {
                        const whMatches = allWarehouses.filter(w => w.store === storeId || w.storeId === storeId);
                        setFilteredWarehouses(whMatches.length > 0 ? whMatches : allWarehouses);
                    }
                    const catId = initialData.category?._id || initialData.category;
                    if (catId) {
                        const scMatches = allSubCategories.filter(sc => sc.category === catId || sc.categoryId === catId);
                        setFilteredSubCategories(scMatches.length > 0 ? scMatches : allSubCategories);
                    }

                    // Populate variant rows from existing items
                    if (initialData.productType === 'variable' && Array.isArray(initialVariants) && initialVariants.length > 0) {
                        const vRes = Array.isArray(variantsRes) ? variantsRes : [];
                        const rows = initialVariants.map(v => {
                            const translatedSelections = {};
                            if (v.selections && typeof v.selections === 'object') {
                                Object.keys(v.selections).forEach(k => {
                                    const masterAttr = vRes.find(m => m._id === k);
                                    const newKey = masterAttr ? masterAttr.name : k;
                                    translatedSelections[newKey] = v.selections[k];
                                });
                            }
                            return {
                                _id: v._id,
                                selections: translatedSelections,
                                sku: v.sku || '',
                                quantity: v.quantity ?? 0,
                                price: v.price ?? 0,
                                status: v.status || 'Active'
                            };
                        });
                        setVariantRows(rows);

                        // Derive enabled attribute ids from union of selection keys
                        const attrKeys = new Set();
                        rows.forEach(r => Object.keys(r.selections).forEach(k => attrKeys.add(k)));
                        setEnabledAttributeIds(Array.from(attrKeys));
                    }
                }
            } catch (err) {
                console.error('Critical error while loading master tables selections:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllMasters();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleImageChange = (e) => {
        if (e.target.files) {
            setNewImages(prev => [...prev, ...Array.from(e.target.files)]);
        }
    };

    const removeNewImage = (index) => {
        setNewImages(prev => prev.filter((_, i) => i !== index));
    };

    const removeExistingImage = (index) => {
        setExistingImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(null);
        setIsSubmitting(true);

        try {
            const uploadedImageUrls = [];
            for (const file of newImages) {
                const res = await uploadImage(file);
                if (res?.url) uploadedImageUrls.push(res.url);
            }

            const finalPayload = {
                ...formData,
                productType,
                images: [...existingImages, ...uploadedImageUrls],
                variantRows: productType === 'variable' ? variantRows : [],
                hasWarranty,
                hasManufacturer,
                hasExpiry
            };

            let resObj;
            if (isEdit && initialData?._id) {
                resObj = await updateProduct(initialData._id, finalPayload);
                if (!asModal) alert('Product updated successfully!');
            } else if (asModal && !initialData?._id) {
                // This covers both 'create' mode and 'edit' mode for virtual unsaved products
                if (onSuccess) {
                    onSuccess({ isUnsavedNewProduct: true, payload: finalPayload });
                }
                return;
            } else if (mode === 'create') {
                resObj = await createProduct(finalPayload);
                if (!asModal) alert('Product created successfully!');
            }

            if (onSuccess) onSuccess(resObj);
            else if (!asModal) window.location.href = '/products';
        } catch (err) {
            setErrorMessage(err.message || 'Operational exception occurred saving product.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const formContent = (
            <form className={styles.formContainer} onSubmit={handleFormSubmit} style={asModal ? { padding: 0 } : {}}>
                {errorMessage && <div style={{ color: 'red', margin: '0 1rem 1rem', fontSize: '14px', fontWeight: 600 }}>{errorMessage}</div>}

                <Accordion title="Product Information">
                    <div className={styles.grid2}>
                        <div className={styles.formGroup}>
                            <label>Store <span style={{ color: '#EA5455' }}>*</span></label>
                            <select className={styles.input} value={formData.store} onChange={e => handleInputChange('store', e.target.value)} required>
                                <option value="">{isLoading ? 'Loading stores...' : 'Select Store'}</option>
                                {stores.map(item => <option key={item._id} value={item._id}>{item.name}</option>)}
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Warehouse <span style={{ color: '#EA5455' }}>*</span></label>
                            <select className={styles.input} value={formData.warehouse} onChange={e => handleInputChange('warehouse', e.target.value)} disabled={!formData.store} required>
                                <option value="">
                                    {!formData.store ? 'Select store first' : (filteredWarehouses.length === 0 && allWarehouses.length === 0) ? 'No Warehouses found' : 'Select Warehouse'}
                                </option>
                                {(filteredWarehouses.length > 0 ? filteredWarehouses : allWarehouses).map(item => <option key={item._id} value={item._id}>{item.name}</option>)}
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Product Name <span style={{ color: '#EA5455' }}>*</span></label>
                            <input type="text" className={styles.input} value={formData.name} onChange={e => handleNameChange(e.target.value)} required />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Slug <span style={{ color: '#EA5455' }}>*</span></label>
                            <input type="text" className={styles.input} value={formData.slug} onChange={e => handleInputChange('slug', e.target.value)} required readOnly style={{ backgroundColor: '#f3f4f6', cursor: 'not-allowed' }} />
                        </div>

                        <div className={styles.formGroup}>
                            <label>SKU <span style={{ color: '#EA5455' }}>*</span></label>
                            <div className={styles.inputGroup}>
                                <input type="text" className={styles.input} value={formData.sku} onChange={e => handleInputChange('sku', e.target.value)} required />
                                <button type="button" onClick={handleGenerateSKU} className={styles.btnSecondary} style={{ backgroundColor: '#FF9F43', color: 'white', border: 'none' }}>Generate</button>
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Selling Type <span style={{ color: '#EA5455' }}>*</span></label>
                            <select className={styles.input} value={formData.sellingType} onChange={e => handleInputChange('sellingType', e.target.value)} required>
                                <option value="">Select</option>
                                <option value="Retail">Retail</option>
                                <option value="Wholesale">Wholesale</option>
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <label>Category <span style={{ color: '#EA5455' }}>*</span></label>
                                <a href="/categories" style={{ color: '#FF9F43', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}><PlusCircle size={14} /> Add New</a>
                            </div>
                            <select className={styles.input} value={formData.category} onChange={e => handleInputChange('category', e.target.value)} required>
                                <option value="">Select Category</option>
                                {categories.map(item => <option key={item._id} value={item._id}>{item.name}</option>)}
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Sub Category <span style={{ color: '#EA5455' }}>*</span></label>
                            <select className={styles.input} value={formData.subCategory} onChange={e => handleInputChange('subCategory', e.target.value)} disabled={!formData.category} required>
                                <option value="">
                                    {!formData.category ? 'Select category first' : (filteredSubCategories.length === 0 && allSubCategories.length === 0) ? 'No Sub Categories found' : 'Select Sub Category'}
                                </option>
                                {(filteredSubCategories.length > 0 ? filteredSubCategories : allSubCategories).map(item => <option key={item._id} value={item._id}>{item.name}</option>)}
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Brand <span style={{ color: '#EA5455' }}>*</span></label>
                            <select className={styles.input} value={formData.brand} onChange={e => handleInputChange('brand', e.target.value)} required>
                                <option value="">Select Brand</option>
                                {brands.map(item => <option key={item._id} value={item._id}>{item.name}</option>)}
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Barcode Symbology <span style={{ color: '#EA5455' }}>*</span></label>
                            <select className={styles.input} value={formData.barcodeSymbology} onChange={e => handleInputChange('barcodeSymbology', e.target.value)} required>
                                <option value="">Select</option>
                                <option value="Code128">Code 128</option>
                                <option value="EAN8">EAN 8</option>
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Item Barcode <span style={{ color: '#EA5455' }}>*</span></label>
                            <div className={styles.inputGroup}>
                                <input type="text" className={styles.input} value={formData.itemBarcode} onChange={e => handleInputChange('itemBarcode', e.target.value)} required />
                                <button type="button" onClick={handleGenerateBarcode} className={styles.btnSecondary} style={{ backgroundColor: '#FF9F43', color: 'white', border: 'none' }}>Generate</button>
                            </div>
                        </div>
                    </div>

                    <div className={styles.formGroup} style={{ marginTop: '1.5rem' }}>
                        <label>Description</label>
                        <div style={{ border: '1px solid #E5E7EB', borderRadius: '4px', overflow: 'hidden' }}>
                            <textarea className={styles.textarea} rows="4" value={formData.description} onChange={e => handleInputChange('description', e.target.value)}></textarea>
                        </div>
                    </div>
                </Accordion>

                <Accordion title="Pricing & Stocks">
                    <div className={styles.formGroup} style={{ marginBottom: '1.5rem' }}>
                        <label>Product Type <span style={{ color: '#EA5455' }}>*</span></label>
                        <div className={styles.radioGroup}>
                            <label className={styles.radioLabel}>
                                <input type="radio" name="productType" checked={productType === 'single'} onChange={() => setProductType('single')} /> Single Product
                            </label>
                            <label className={styles.radioLabel}>
                                <input type="radio" name="productType" checked={productType === 'variable'} onChange={() => setProductType('variable')} /> Variable Product
                            </label>
                        </div>
                    </div>

                    {productType === 'single' ? (
                        <>
                            <div className={styles.grid3}>
                                <div className={styles.formGroup}>
                                    <label>Quantity <span style={{ color: '#EA5455' }}>*</span></label>
                                    <input type="number" className={styles.input} value={formData.quantity} onChange={e => handleInputChange('quantity', e.target.value)} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Price <span style={{ color: '#EA5455' }}>*</span></label>
                                    <input type="number" className={styles.input} value={formData.price} onChange={e => handleInputChange('price', e.target.value)} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Tax Type <span style={{ color: '#EA5455' }}>*</span></label>
                                    <select className={styles.input} value={formData.taxType} onChange={e => handleInputChange('taxType', e.target.value)}>
                                        <option value="">Select</option>
                                        <option value="Exclusive">Exclusive</option>
                                        <option value="Inclusive">Inclusive</option>
                                    </select>
                                </div>
                            </div>

                            <div className={styles.grid3}>
                                <div className={styles.formGroup}>
                                    <label>Tax <span style={{ color: '#EA5455' }}>*</span></label>
                                    <select className={styles.input} value={formData.tax} onChange={e => handleInputChange('tax', e.target.value)}>
                                        <option value="">Select Tax Configuration</option>
                                        {taxes.map(item => <option key={item._id} value={item._id}>{item.name} ({item.taxValue}%)</option>)}
                                    </select>
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Discount Type <span style={{ color: '#EA5455' }}>*</span></label>
                                    <select className={styles.input} value={formData.discountType} onChange={e => handleInputChange('discountType', e.target.value)}>
                                        <option value="">Select</option>
                                        <option value="Percentage">Percentage</option>
                                        <option value="Fixed">Fixed Amount</option>
                                    </select>
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Discount Value <span style={{ color: '#EA5455' }}>*</span></label>
                                    <input type="number" className={styles.input} value={formData.discountValue} onChange={e => handleInputChange('discountValue', e.target.value)} />
                                </div>
                            </div>

                            <div className={styles.grid3}>
                                <div className={styles.formGroup}>
                                    <label>Quantity Alert <span style={{ color: '#EA5455' }}>*</span></label>
                                    <input type="number" className={styles.input} value={formData.quantityAlert} onChange={e => handleInputChange('quantityAlert', e.target.value)} />
                                </div>
                            </div>

                            <SinglePricingSummary
                                price={formData.price}
                                taxType={formData.taxType}
                                tax={taxes.find(t => t._id === formData.tax)}
                                discountType={formData.discountType}
                                discountValue={formData.discountValue}
                            />
                        </>
                    ) : (
                        <VariantRowBuilder
                            variantMasters={variantMasters}
                            enabledAttributeIds={enabledAttributeIds}
                            setEnabledAttributeIds={setEnabledAttributeIds}
                            variantRows={variantRows}
                            setVariantRows={setVariantRows}
                            baseSku={formData.sku}
                            baseQuantity={formData.quantity}
                            basePrice={formData.price}
                            taxType={formData.taxType}
                            tax={formData.tax}
                            taxes={taxes}
                            discountType={formData.discountType}
                            discountValue={formData.discountValue}
                            onTaxFieldChange={handleInputChange}
                        />
                    )}
                </Accordion>

                <Accordion title="Product Images">
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            style={{ width: '120px', height: '120px', border: '1px dashed #D1D5DB', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#9CA3AF', backgroundColor: '#FAFAFA' }}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '0.5rem' }}><circle cx="12" cy="12" r="10" /><path d="M12 8v8" /><path d="M8 12h8" /></svg>
                            <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>Upload Images</span>
                        </div>

                        <input type="file" ref={fileInputRef} style={{ display: 'none' }} multiple accept="image/*" onChange={handleImageChange} />

                        {existingImages.map((imgUrl, index) => (
                            <div key={`existing-${index}`} style={{ width: '120px', height: '120px', border: '1px solid #E5E7EB', borderRadius: '8px', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF' }}>
                                <img src={getImageUrl(imgUrl)} alt={`Existing ${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <button
                                    type="button"
                                    onClick={() => removeExistingImage(index)}
                                    style={{ position: 'absolute', top: '4px', right: '4px', width: '22px', height: '22px', backgroundColor: 'rgba(234, 84, 85, 0.9)', color: 'white', border: 'none', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ))}

                        {newImages.map((imgFile, index) => (
                            <div key={`new-${index}`} style={{ width: '120px', height: '120px', border: '1px solid #E5E7EB', borderRadius: '8px', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF' }}>
                                <img src={URL.createObjectURL(imgFile)} alt={`Preview ${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <button
                                    type="button"
                                    onClick={() => removeNewImage(index)}
                                    style={{ position: 'absolute', top: '4px', right: '4px', width: '22px', height: '22px', backgroundColor: 'rgba(234, 84, 85, 0.9)', color: 'white', border: 'none', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                </Accordion>

                <Accordion title="Custom Fields">
                    <div style={{ backgroundColor: '#F8F9FA', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid #E5E7EB' }}>
                        <div className={styles.checkboxGroup} style={{ display: 'flex', gap: '1.5rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 400, color: '#6B7280', fontSize: '0.875rem' }}>
                                <input type="checkbox" checked={hasWarranty} onChange={(e) => setHasWarranty(e.target.checked)} /> Warranties
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 400, color: '#6B7280', fontSize: '0.875rem' }}>
                                <input type="checkbox" checked={hasManufacturer} onChange={(e) => setHasManufacturer(e.target.checked)} /> Manufacturer
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 400, color: '#6B7280', fontSize: '0.875rem' }}>
                                <input type="checkbox" checked={hasExpiry} onChange={(e) => setHasExpiry(e.target.checked)} /> Expiry
                            </label>
                        </div>
                    </div>

                    <div className={styles.grid2}>
                        {hasWarranty && (
                            <div className={styles.formGroup}>
                                <label>Warranty Plan <span style={{ color: '#EA5455' }}>*</span></label>
                                <select className={styles.input} value={formData.warrantyPlan} onChange={e => handleInputChange('warrantyPlan', e.target.value)}>
                                    <option value="">Select Plan Terms</option>
                                    {warranties.map(item => <option key={item._id} value={item._id}>{item.name} ({item.duration})</option>)}
                                </select>
                            </div>
                        )}

                        {hasManufacturer && (
                            <div className={styles.formGroup}>
                                <label>Manufacturer <span style={{ color: '#EA5455' }}>*</span></label>
                                <input type="text" className={styles.input} value={formData.manufacturer} onChange={e => handleInputChange('manufacturer', e.target.value)} />
                            </div>
                        )}

                        {hasExpiry && (
                            <>
                                <div className={styles.formGroup}>
                                    <label>Manufactured Date <span style={{ color: '#EA5455' }}>*</span></label>
                                    <input type="date" className={styles.input} value={formData.manufacturedDate} onChange={e => handleInputChange('manufacturedDate', e.target.value)} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Expiry On <span style={{ color: '#EA5455' }}>*</span></label>
                                    <input type="date" className={styles.input} value={formData.expiryOn} onChange={e => handleInputChange('expiryOn', e.target.value)} />
                                </div>
                            </>
                        )}
                    </div>
                </Accordion>

                <div className={styles.footerActions}>
                    {!asModal && <button type="button" className={styles.btnCancel} onClick={() => window.location.href = '/products'}>Cancel</button>}
                    <button type="submit" className={styles.btnSubmit} disabled={isSubmitting}>
                        {isSubmitting ? (isEdit ? 'Updating Product...' : 'Saving Product...') : (isEdit ? 'Update Product' : 'Save Product')}
                    </button>
                </div>
            </form>
    );

    if (asModal) return formContent;

    return (
        <DashboardLayout>
            <div className={styles.pageHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 className={styles.title} style={{ color: '#1B2850' }}>{isEdit ? 'Edit Product' : 'Create Product'}</h1>
                    <p className={styles.subtitle}>{isEdit ? 'Update existing product' : 'Create new product'}</p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <a href="/products" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#1B2850', color: 'white', padding: '0 1rem', height: '36px', borderRadius: '4px', textDecoration: 'none', fontWeight: 500, fontSize: '0.875rem' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
                        Back to Product
                    </a>
                </div>
            </div>
            {formContent}
        </DashboardLayout>
    );
};

export default ProductForm;