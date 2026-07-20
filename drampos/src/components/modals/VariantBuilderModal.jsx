import React from 'react';
import styles from '../../pages/AddProduct.module.css';
import { Copy, Trash2, Plus } from 'lucide-react';

const computePricing = (price, taxRate = 0, taxType = 'Exclusive', discountType = '', discountValue = 0) => {
    const base = Number(price) || 0;
    const rate = Number(taxRate) || 0;
    const discVal = Number(discountValue) || 0;
    let taxAmount = 0;
    let finalPriceBeforeDiscount = base;

    if (taxType === 'Inclusive') {
        taxAmount = rate > 0 ? base - (base / (1 + rate / 100)) : 0;
        finalPriceBeforeDiscount = base;
    } else {
        taxAmount = (base * rate) / 100;
        finalPriceBeforeDiscount = base + taxAmount;
    }

    let discountAmount = 0;
    if (discountType === 'Percentage') {
        discountAmount = (finalPriceBeforeDiscount * discVal) / 100;
    } else if (discountType === 'Fixed') {
        discountAmount = discVal;
    }

    const finalPrice = Math.max(0, finalPriceBeforeDiscount - discountAmount);
    return {
        taxableAmount: taxType === 'Inclusive' ? base - taxAmount : base,
        taxAmount: Number(taxAmount.toFixed(2)),
        discountAmount: Number(discountAmount.toFixed(2)),
        finalPrice: Number(finalPrice.toFixed(2))
    };
};

const VariantRowBuilder = ({
    variantMasters,
    enabledAttributeIds,
    setEnabledAttributeIds,
    variantRows,
    setVariantRows,
    baseSku,
    baseQuantity,
    basePrice,
    taxType = 'Exclusive',
    tax = '',
    taxes = [],
    discountType = '',
    discountValue = 0,
    onTaxFieldChange
}) => {
    const taxRate = taxes.find(t => t._id === tax)?.taxValue || 0;
    
    // New state for custom Options (e.g. Option 1: RAM)
    const [options, setOptions] = React.useState([
        { id: Date.now(), name: '', valuesText: '', values: [] }
    ]);

    // Keep custom options in sync if variants already exist in edit mode
    React.useEffect(() => {
        if (enabledAttributeIds.length > 0 && variantRows.length > 0 && options.length === 1 && !options[0].name) {
            const initialOptions = enabledAttributeIds.map((attrName, idx) => {
                const valuesSet = new Set();
                variantRows.forEach(row => {
                    if (row.selections[attrName]) valuesSet.add(row.selections[attrName]);
                });
                const values = Array.from(valuesSet);
                return {
                    id: Date.now() + idx,
                    name: attrName,
                    valuesText: values.join(', '),
                    values: values
                };
            });
            setOptions(initialOptions);
        }
    }, [enabledAttributeIds, variantRows]);

    const handleOptionNameChange = (id, newName) => {
        setOptions(prev => prev.map(opt => opt.id === id ? { ...opt, name: newName } : opt));
    };

    const handleOptionValuesChange = (id, newText) => {
        const arr = newText.split(',').map(s => s.trim()).filter(s => s.length > 0);
        setOptions(prev => prev.map(opt => opt.id === id ? { ...opt, valuesText: newText, values: arr } : opt));
    };

    const addOptionRow = () => {
        if (options.length >= 3) return;
        setOptions(prev => [...prev, { id: Date.now(), name: '', valuesText: '', values: [] }]);
    };

    const removeOptionRow = (id) => {
        setOptions(prev => prev.filter(opt => opt.id !== id));
    };

    const handleGenerateCombinations = () => {
        const validOptions = options.filter(opt => opt.name.trim() && opt.values.length > 0);
        if (validOptions.length === 0) return;

        // Update enabledAttributeIds in ProductForm to be the custom names
        const newEnabledIds = validOptions.map(opt => opt.name.trim());
        setEnabledAttributeIds(newEnabledIds);

        const arraysToCombine = validOptions.map(opt => opt.values);

        const cartesianProduct = arraysToCombine.reduce((acc, curr) => {
            const res = [];
            acc.forEach(a => {
                curr.forEach(c => {
                    res.push([...a, c]);
                });
            });
            return res;
        }, [[]]);

        const newRows = cartesianProduct.map(comboArray => {
            const selectionsObj = {};
            validOptions.forEach((opt, index) => {
                selectionsObj[opt.name.trim()] = comboArray[index];
            });

            const labelTokens = comboArray.map(c => c.replace(/\s+/g, ''));
            const skuVal = `${baseSku || 'SKU'}-${labelTokens.join('-').toUpperCase()}`;

            return {
                selections: selectionsObj,
                sku: skuVal,
                quantity: baseQuantity || 0,
                price: basePrice || 0
            };
        });

        setVariantRows(newRows);
    };

    // Obsolete function kept just in case
    const handleToggleAttributeScope = (masterId) => {};

    const handleAddNewManualRow = () => {
        const freshSelectionsObj = {};
        enabledAttributeIds.forEach(id => {
            freshSelectionsObj[id] = '';
        });

        const newRow = {
            selections: freshSelectionsObj,
            sku: `${baseSku || 'SKU'}-${Math.floor(1000 + Math.random() * 9000)}`,
            quantity: baseQuantity || 0,
            price: basePrice || 0
        };
        setVariantRows(prev => [...prev, newRow]);
    };

    const handleCopyRow = (index) => {
        const sourceRow = variantRows[index];
        const duplicatedRow = {
            selections: { ...sourceRow.selections },
            sku: `${baseSku || 'SKU'}-${Math.floor(1000 + Math.random() * 9000)}`,
            quantity: sourceRow.quantity,
            price: sourceRow.price
        };

        const updatedRows = [...variantRows];
        updatedRows.splice(index + 1, 0, duplicatedRow);
        setVariantRows(updatedRows);
    };

    const handleRemoveRow = (index) => {
        setVariantRows(variantRows.filter((_, i) => i !== index));
    };

    const handleRowDropdownChange = (rowIndex, masterId, selectedVal) => {
        const updatedRows = [...variantRows];
        updatedRows[rowIndex].selections[masterId] = selectedVal;

        const labelTokens = [];
        enabledAttributeIds.forEach(id => {
            const currentVal = updatedRows[rowIndex].selections[id];
            if (currentVal) labelTokens.push(currentVal.replace(/\s+/g, ''));
        });

        if (labelTokens.length > 0) {
            updatedRows[rowIndex].sku = `${baseSku || 'SKU'}-${labelTokens.join('-').toUpperCase()}`;
        }

        setVariantRows(updatedRows);
    };

    const handleRowFieldChange = (index, subField, val) => {
        const updatedRows = [...variantRows];
        updatedRows[index][subField] = val;
        setVariantRows(updatedRows);
    };

    return (
        <div style={{ marginTop: '1.5rem', width: '100%' }}>

            {/* Step 1: Custom Options Scope */}
            <div style={{ backgroundColor: '#F9FAFB', padding: '1rem', borderRadius: '6px', border: '1px solid #E5E7EB', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ fontWeight: 700, color: '#1B2850', display: 'block' }}>
                        1. Define Variant Options
                    </span>
                    <button
                        type="button"
                        onClick={handleGenerateCombinations}
                        style={{
                            backgroundColor: '#4F46E5', color: 'white', border: 'none', 
                            padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', 
                            fontSize: '0.85rem', fontWeight: 500
                        }}
                    >
                        Generate Combinations Automatically
                    </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {options.map((opt, idx) => (
                        <div key={opt.id} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', fontSize: '0.85rem', color: '#4B5563', marginBottom: '0.25rem', fontWeight: 500 }}>
                                    Option {idx + 1} Name
                                </label>
                                <input 
                                    type="text"
                                    placeholder="e.g. RAM, Storage, Color"
                                    value={opt.name}
                                    onChange={(e) => handleOptionNameChange(opt.id, e.target.value)}
                                    style={{ padding: '0.4rem', fontSize: '0.85rem', width: '100%', border: '1px solid #D1D5DB', borderRadius: '4px' }}
                                />
                            </div>
                            <div style={{ flex: 2 }}>
                                <label style={{ display: 'block', fontSize: '0.85rem', color: '#4B5563', marginBottom: '0.25rem', fontWeight: 500 }}>
                                    Option {idx + 1} Values (Comma separated)
                                </label>
                                <input 
                                    type="text"
                                    placeholder="e.g. 8GB, 16GB"
                                    value={opt.valuesText}
                                    onChange={(e) => handleOptionValuesChange(opt.id, e.target.value)}
                                    style={{ padding: '0.4rem', fontSize: '0.85rem', width: '100%', border: '1px solid #D1D5DB', borderRadius: '4px' }}
                                />
                                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                                    {opt.values.map((val, vIdx) => (
                                        <span key={vIdx} style={{ backgroundColor: '#EEF2FF', color: '#4338CA', padding: '0.15rem 0.5rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 500, border: '1px solid #C7D2FE' }}>
                                            {val}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div style={{ paddingTop: '1.4rem' }}>
                                {options.length > 1 && (
                                    <button type="button" onClick={() => removeOptionRow(opt.id)} style={{ background: 'none', border: 'none', color: '#EA5455', cursor: 'pointer', padding: '0.4rem' }}>
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                    {options.length < 3 && (
                        <div>
                            <button type="button" onClick={addOptionRow} style={{ background: 'none', border: 'none', color: '#4F46E5', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Plus size={14} /> Add another option
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Tax & Discount applied to every variant (right after attribute scope) */}
            <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#F0F4FF', border: '1px solid #C7D2FE', borderRadius: '8px' }}>
                <div style={{ fontWeight: 700, color: '#1B2850', marginBottom: '0.75rem', fontSize: '0.9rem' }}>
                    Tax & Discount (applied to every variant)
                </div>
                <div className={styles.grid3}>
                    <div className={styles.formGroup}>
                        <label>Tax Type <span style={{ color: '#EA5455' }}>*</span></label>
                        <select className={styles.input} value={taxType} onChange={e => onTaxFieldChange('taxType', e.target.value)}>
                            <option value="">Select</option>
                            <option value="Exclusive">Exclusive</option>
                            <option value="Inclusive">Inclusive</option>
                        </select>
                    </div>
                    <div className={styles.formGroup}>
                        <label>Tax <span style={{ color: '#EA5455' }}>*</span></label>
                        <select className={styles.input} value={tax} onChange={e => onTaxFieldChange('tax', e.target.value)}>
                            <option value="">Select Tax Configuration</option>
                            {taxes.map(item => <option key={item._id} value={item._id}>{item.name} ({item.taxValue}%)</option>)}
                        </select>
                    </div>
                    <div className={styles.formGroup}>
                        <label>Discount Type <span style={{ color: '#EA5455' }}>*</span></label>
                        <select className={styles.input} value={discountType} onChange={e => onTaxFieldChange('discountType', e.target.value)}>
                            <option value="">Select</option>
                            <option value="Percentage">Percentage</option>
                            <option value="Fixed">Fixed Amount</option>
                        </select>
                    </div>
                </div>
                <div className={styles.grid3}>
                    <div className={styles.formGroup}>
                        <label>Discount Value <span style={{ color: '#EA5455' }}>*</span></label>
                        <input type="number" className={styles.input} value={discountValue} onChange={e => onTaxFieldChange('discountValue', e.target.value)} />
                    </div>
                </div>
            </div>

            {/* Step 2: Row Configurations Controls Panel */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontWeight: 700, color: '#1B2850' }}>2. Configure Individual Custom Variant Variations</span>
                <button
                    type="button"
                    onClick={handleAddNewManualRow}
                    disabled={enabledAttributeIds.length === 0}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#1B2850', color: 'white',
                        border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', opacity: enabledAttributeIds.length === 0 ? 0.5 : 1
                    }}
                >
                    <Plus size={16} /> Add Combination Row
                </button>
            </div>

            {variantRows.length > 0 ? (
                <div style={{ backgroundColor: '#F8F9FA', padding: '0.75rem', borderRadius: '8px', overflowX: 'auto', border: '1px solid #E5E7EB' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', color: '#1B2850', fontSize: '0.875rem', fontWeight: 600, borderBottom: '2px solid #E5E7EB' }}>
                                {enabledAttributeIds.map((name, idx) => (
                                    <th key={idx} style={{ padding: '0.75rem 0.5rem' }}>{name}</th>
                                ))}
                                <th style={{ padding: '0.75rem 0.5rem' }}>Variant SKU</th>
                                <th style={{ padding: '0.75rem 0.5rem', width: '100px' }}>Quantity</th>
                                <th style={{ padding: '0.75rem 0.5rem', width: '120px' }}>Price ($)</th>
                                <th style={{ padding: '0.75rem 0.5rem', width: '130px' }}>Final Price ($)</th>
                                <th style={{ padding: '0.75rem 0.5rem', textAlign: 'center', width: '90px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {variantRows.map((row, rowIndex) => (
                                <tr key={rowIndex} style={{ borderBottom: '1px solid #F3F4F6', backgroundColor: '#FFF' }}>

                                    {enabledAttributeIds.map((attrName, idx) => {
                                        const optDef = options.find(o => o.name.trim() === attrName);
                                        return (
                                            <td key={idx} style={{ padding: '0.5rem' }}>
                                                <select
                                                    className={styles.input}
                                                    style={{ padding: '0.35rem', fontSize: '0.85rem', minWidth: '110px' }}
                                                    value={row.selections[attrName] || ''}
                                                    onChange={e => handleRowDropdownChange(rowIndex, attrName, e.target.value)}
                                                >
                                                    <option value="">Select</option>
                                                    {(optDef?.values || []).map((val, vIdx) => (
                                                        <option key={vIdx} value={val}>{val}</option>
                                                    ))}
                                                </select>
                                            </td>
                                        );
                                    })}

                                    <td style={{ padding: '0.5rem' }}>
                                        <input
                                            type="text"
                                            className={styles.input}
                                            style={{ padding: '0.35rem', fontSize: '0.85rem' }}
                                            value={row.sku}
                                            onChange={e => handleRowFieldChange(rowIndex, 'sku', e.target.value)}
                                        />
                                    </td>
                                    <td style={{ padding: '0.5rem' }}>
                                        <input
                                            type="number"
                                            className={styles.input}
                                            style={{ padding: '0.35rem', fontSize: '0.85rem' }}
                                            value={row.quantity}
                                            onChange={e => handleRowFieldChange(rowIndex, 'quantity', Number(e.target.value))}
                                        />
                                    </td>
                                    <td style={{ padding: '0.5rem' }}>
                                        <input
                                            type="number"
                                            className={styles.input}
                                            style={{ padding: '0.35rem', fontSize: '0.85rem' }}
                                            value={row.price}
                                            onChange={e => handleRowFieldChange(rowIndex, 'price', Number(e.target.value))}
                                        />
                                    </td>
                                    <td style={{ padding: '0.5rem' }}>
                                        {(() => {
                                            const p = computePricing(row.price, taxRate, taxType, discountType, discountValue);
                                            return (
                                                <div>
                                                    <div style={{ fontWeight: 600, color: '#1B2850' }}>${p.finalPrice}</div>
                                                    <div style={{ fontSize: '0.7rem', color: '#6B7280', lineHeight: 1.3 }}>
                                                        Tax: ${p.taxAmount.toFixed(2)}
                                                        {discountType === 'Percentage'
                                                            ? ` · Disc ${discountValue}%`
                                                            : discountType === 'Fixed'
                                                                ? ` · Disc $${Number(discountValue || 0).toFixed(2)}`
                                                                : ''}
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                    </td>

                                    <td style={{ padding: '0.5rem', textAlign: 'center' }}>
                                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                                            <button
                                                type="button"
                                                onClick={() => handleCopyRow(rowIndex)}
                                                style={{ backgroundColor: '#28C76F', color: 'white', border: 'none', borderRadius: '4px', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                            >
                                                <Copy size={14} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveRow(rowIndex)}
                                                style={{ backgroundColor: '#EA5455', color: 'white', border: 'none', borderRadius: '4px', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '2rem', border: '2px dashed #E5E7EB', borderRadius: '6px', color: '#9CA3AF', fontSize: '0.9rem' }}>
                    No variation rows generated yet. Click "Add Combination Row" above to map your pairs.
                </div>
            )}
        </div>
    );
};

export default VariantRowBuilder;