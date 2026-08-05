import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import styles from './ProductList.module.css';
import formStyles from '../components/modals/ModalForm.module.css';
import { 
  Plus, Trash2, ArrowLeft, Save, Search, ChevronDown, ChevronUp, Check, 
  Edit2, Settings, X, Copy, PlusCircle, Eye, EyeOff, BookOpen, Sparkles, Upload, FileText, Mail, Phone, Image,
  RotateCw, RotateCcw
} from 'lucide-react';
import { getAllProducts } from '../services/productService';
import { createSale, getInvoices } from '../services/salesService';
import { getCustomers } from '../services/customerService';
import { getTermsTemplates, createOrUpdateTermsTemplate } from '../services/termsTemplateService';
import { getColumnSettings, saveColumnSettings } from '../services/columnSettingService';
import AddCustomerModal from '../components/modals/AddCustomerModal';
import HsnModal from '../components/modals/HsnModal';
import { API_BASE_URL } from '../api/endpoints';
import { State, Country } from 'country-state-city';

const defaultTermsTemplates = {
  'Brand New': [
    'Warranty: 1-year manufacturer warranty from the date of invoice.',
    'Delivery: Dispatch will be done within 2-3 business days after order confirmation.',
    'Payment: 100% advance payment prior to dispatch.',
    'Validity: Prices are valid for 15 days.'
  ],
  'Refurbished': [
    'Warranty: 90-days seller warranty covering hardware parts.',
    'Delivery: Dispatch within 3-5 business days.',
    'Condition: Fully tested refurbished unit. Minor cosmetic blemishes may be present.',
    'Payment: 50% advance, 50% on delivery.'
  ],
  'Rental': [
    'Rental Period: Minimum contract duration is 3 months.',
    'Security Deposit: Refundable security deposit equivalent to 1 month rental value.',
    'Maintenance: Standard maintenance is covered by the provider.',
    'Payment: Monthly rental due by the 5th of each month.'
  ]
};

const CreateDeliveryChallan = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const invoiceType = 'Delivery Challan';
  const editId = searchParams.get('edit');

  // State Variables matching original form + new fields
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [placeOfSupply, setPlaceOfSupply] = useState('');
  const [clientPoNumber, setClientPoNumber] = useState('');
  
  // HSN active modal states
  const [isHsnModalOpen, setIsHsnModalOpen] = useState(false);
  const [hsnActiveRowIndex, setHsnActiveRowIndex] = useState(null);

  // Configure Tax Modal States
  const [isConfigureTaxModalOpen, setIsConfigureTaxModalOpen] = useState(false);
  const [taxType, setTaxType] = useState('GST (India)');
  const [gstType, setGstType] = useState('CGST & SGST');
  const [isRcmApplicable, setIsRcmApplicable] = useState(false);

  // Configure Cess Modal States
  const [isConfigureCessModalOpen, setIsConfigureCessModalOpen] = useState(false);
  const [cessType, setCessType] = useState('Central Cess');
  const [cessName, setCessName] = useState('');
  
  // Terms & Notes Visibility States
  const [showTermsInput, setShowTermsInput] = useState(false);
  const [showNotesInput, setShowNotesInput] = useState(false);
  const [termsList, setTermsList] = useState([]);
  const [originalTerms, setOriginalTerms] = useState([]);
  const [hasAskedSaveTerms, setHasAskedSaveTerms] = useState(true);
  const [showTermsSaveConfirmModal, setShowTermsSaveConfirmModal] = useState(false);
  const [activeTermFocusIndex, setActiveTermFocusIndex] = useState(null);

  const [templates, setTemplates] = useState([]);
  const [selectedTemplateName, setSelectedTemplateName] = useState('Brand New');

  const handleSaveAsTemplate = () => {
    const name = prompt("Enter a name for this terms template:");
    if (!name) return;
    const currentTerms = termsList.map(t => t.text.trim()).filter(Boolean);
    if (currentTerms.length === 0) {
      alert("Please add some terms first before saving as a template.");
      return;
    }
    createOrUpdateTermsTemplate({ name, terms: currentTerms })
      .then(newTemplate => {
        setTemplates(prev => {
          const index = prev.findIndex(t => t.name === name);
          if (index > -1) {
            const copy = [...prev];
            copy[index] = newTemplate;
            return copy;
          }
          return [...prev, newTemplate];
        });
        alert(`Template "${name}" saved to DB successfully!`);
      })
      .catch(err => {
        console.error(err);
        alert("Failed to save template to database: " + err.message);
      });
  };

  const checkAndPromptForTermsSave = () => {
    if (hasAskedSaveTerms) return;
    const currentTexts = termsList.map(t => t.text.trim()).filter(Boolean);
    const originalTexts = originalTerms.map(t => t.text.trim()).filter(Boolean);
    const hasChanged = currentTexts.length !== originalTexts.length || 
                       currentTexts.some((txt, i) => txt !== originalTexts[i]);
    if (hasChanged) {
      setShowTermsSaveConfirmModal(true);
    }
  };

  const handleAddNewTerm = () => {
    setTermsList(prev => [...prev, { text: '' }]);
  };

  const handleDeleteTerm = (index) => {
    setTermsList(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleMoveTermUp = (index) => {
    if (index === 0) return;
    setTermsList(prev => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[index - 1];
      copy[index - 1] = temp;
      return copy;
    });
  };

  const handleMoveTermDown = (index) => {
    setTermsList(prev => {
      if (index === prev.length - 1) return prev;
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[index + 1];
      copy[index + 1] = temp;
      return copy;
    });
  };

  const handleUpdateTermText = (index, value) => {
    setTermsList(prev => {
      const copy = [...prev];
      copy[index].text = value;
      return copy;
    });
  };

  // Additional Info States
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);
  const [additionalFieldsList, setAdditionalFieldsList] = useState([]);
  const [isCustomFieldModalOpen, setIsCustomFieldModalOpen] = useState(false);
  const [customFieldLabel, setCustomFieldLabel] = useState('');
  const [customFieldValue, setCustomFieldValue] = useState('');
  const [customFieldDefault, setCustomFieldDefault] = useState(false);

  // Attachments States
  const [showAttachments, setShowAttachments] = useState(false);
  const [attachmentsList, setAttachmentsList] = useState([]);

  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [taxes, setTaxes] = useState([
    { name: '0%', taxValue: 0 },
    { name: '5%', taxValue: 5 },
    { name: '12%', taxValue: 12 },
    { name: '18%', taxValue: 18 },
    { name: '28%', taxValue: 28 }
  ]);
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      product: null,
      nameOrSku: '',
      hsn: '',
      gstRate: 0,
      qty: 0,
      price: 0,
      discountRate: 0,
      discountType: 'Fixed',
      cgst: 0,
      sgst: 0,
      total: 0,
      showDescription: false,
      showImage: false,
      description: '',
      image: '',
      unit: 'Product',
      salesLedger: 'Sales',
      customColumns: {}
    }
  ]);
  const [columns, setColumns] = useState([
    { id: 'item', name: 'Item', type: 'TEXT', visible: true, width: '250px' },
    { id: 'hsn', name: 'HSN/SAC', type: 'NUMBER', visible: true, width: '130px' },
    { id: 'gstRate', name: 'GST Rate', type: 'NUMBER', visible: true, width: '90px' },
    { id: 'quantity', name: 'Quantity', type: 'NUMBER', visible: true, width: '90px' },
    { id: 'rate', name: 'Rate', type: 'CURRENCY', visible: true, width: '110px' },
    { id: 'discount', name: 'Discount', type: 'CURRENCY', visible: true, width: '120px' },
    { id: 'amount', name: 'Amount', type: 'CURRENCY', visible: true, width: '110px', formula: 'Quantity * Rate' },
    { id: 'cgst', name: 'CGST', type: 'CURRENCY', visible: true, width: '90px' },
    { id: 'sgst', name: 'SGST', type: 'CURRENCY', visible: true, width: '90px' },
    { id: 'total', name: 'Total', type: 'CURRENCY', visible: true, width: '110px', formula: 'Amount + CGST + SGST' }
  ]);
  const [tempColumns, setTempColumns] = useState([]);
  const [isColumnsModalOpen, setIsColumnsModalOpen] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);

  const handleDragStart = (e, index) => {
    if (index === 0) {
      e.preventDefault();
      return;
    }
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index || index === 0) return;
    setTempColumns(prev => {
      const list = [...prev];
      const draggedItem = list[draggedIndex];
      list.splice(draggedIndex, 1);
      list.splice(index, 0, draggedItem);
      return list;
    });
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };
  const [orderTax, setOrderTax] = useState(0);
  const [showDiscountsDropdown, setShowDiscountsDropdown] = useState(false);
  const [discountOnTotalActive, setDiscountOnTotalActive] = useState(false);
  const [discountType, setDiscountType] = useState('Fixed'); // 'Fixed' or '%'
  const [discountInputValue, setDiscountInputValue] = useState('');
  const [isItemWiseDiscountActive, setIsItemWiseDiscountActive] = useState(false);
  const [showChargesDropdown, setShowChargesDropdown] = useState(false);
  const [chargeWithoutTaxActive, setChargeWithoutTaxActive] = useState(false);
  const [chargeWithoutTaxValue, setChargeWithoutTaxValue] = useState('');
  const [chargeWithoutTaxUnit, setChargeWithoutTaxUnit] = useState('Fixed'); // 'Fixed' or '%'
  
  const [chargeWithTaxActive, setChargeWithTaxActive] = useState(false);
  const [chargeWithTaxName, setChargeWithTaxName] = useState('Service Name');
  const [chargeWithTaxValue, setChargeWithTaxValue] = useState('');
  const [chargeWithTaxGstRate, setChargeWithTaxGstRate] = useState(18);
  const [customServices, setCustomServices] = useState([]);
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);
  const [isCreateChargeModalOpen, setIsCreateChargeModalOpen] = useState(false);
  const [newChargeItemName, setNewChargeItemName] = useState('');
  const [newChargeAmount, setNewChargeAmount] = useState('0');
  const [newChargeHsn, setNewChargeHsn] = useState('');
  const [newChargeGstRate, setNewChargeGstRate] = useState('0');
  const [newChargeLedger, setNewChargeLedger] = useState('Select Sales Ledger');
  const [roundMode, setRoundMode] = useState('None'); // 'None', 'Up', 'Down'
  const [orderStatus, setOrderStatus] = useState('Completed');
  const [customPaidAmount, setCustomPaidAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [loading, setLoading] = useState(false);

  // Redesign state additions
  const [invoiceTitle, setInvoiceTitle] = useState('Invoice');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [invoiceSubtitle, setInvoiceSubtitle] = useState('');
  const [showSubtitleInput, setShowSubtitleInput] = useState(false);
  const [customFields, setCustomFields] = useState([]);
  const [currency, setCurrency] = useState('Indian Rupee(INR, ₹)');
  const [businessLogo, setBusinessLogo] = useState(null);
  
  // Bottom section states
  const [showTotalInWords, setShowTotalInWords] = useState(true);
  const [totalInWords, setTotalInWords] = useState('One Rupee Only');
  const [signature, setSignature] = useState(() => {
    return localStorage.getItem('globalSignatureImage') || null;
  });
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [signatureType, setSignatureType] = useState('Simple');
  const [signatureSourceType, setSignatureSourceType] = useState('upload'); // 'upload' or 'draw'
  const [signatureLabel, setSignatureLabel] = useState(() => {
    try {
      const settings = JSON.parse(localStorage.getItem('posSettings') || '{}');
      return settings.signatureName || 'Authorised Signatory';
    } catch(e) {
      return 'Authorised Signatory';
    }
  });
  const [showSignatureSaveConfirm, setShowSignatureSaveConfirm] = useState(false);
  const [pendingSignatureDataUrl, setPendingSignatureDataUrl] = useState(null);
  const [pendingSignatureLabel, setPendingSignatureLabel] = useState('Authorised Signatory');
  const [isDrawPadModalOpen, setIsDrawPadModalOpen] = useState(false);
  const [canvasDrawingActive, setCanvasDrawingActive] = useState(false);
  const canvasRef = React.useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000000';
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };
  const [isRecurring, setIsRecurring] = useState(false);
  
  // Advanced options states
  const [hsnColumnView, setHsnColumnView] = useState('Default');
  const [displayUnitAs, setDisplayUnitAs] = useState('Merge with quantity');
  const [showTaxSummary, setShowTaxSummary] = useState('Do not show');
  const [advOptions, setAdvOptions] = useState({
    hidePlaceOfSupply: false,
    showHsnSummary: false,
    enableRcmSummary: false,
    addOriginalImages: false,
    showThumbnails: false,
    showDescFullWidth: false
  });

  const [isDueDateModalOpen, setIsDueDateModalOpen] = useState(false);
  const [dueDateDays, setDueDateDays] = useState(15);
  const [saveDueDateFuture, setSaveDueDateFuture] = useState(false);
  const [showDueDate, setShowDueDate] = useState(true);

  const getPreviewDueDate = () => {
    if (!invoiceDate) return '';
    const date = new Date(invoiceDate);
    if (isNaN(date.getTime())) return '';
    date.setDate(date.getDate() + Number(dueDateDays || 0));
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const handleSaveDueDateConfigure = () => {
    if (!invoiceDate) return;
    const date = new Date(invoiceDate);
    if (isNaN(date.getTime())) return;
    date.setDate(date.getDate() + Number(dueDateDays || 0));
    setDueDate(date.toISOString().split('T')[0]);
    setIsDueDateModalOpen(false);
  };

  // Dropdown states
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [customerSearchTerm, setCustomerSearchTerm] = useState('');
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerToEdit, setCustomerToEdit] = useState(null);
  const [nextInvoiceNumber, setNextInvoiceNumber] = useState('');
  const [status, setStatus] = useState('Draft');
  const [showShippingDetails, setShowShippingDetails] = useState(false);
  const [warehouses, setWarehouses] = useState([]);

  // Shipped From States
  const [shippedFromWarehouse, setShippedFromWarehouse] = useState('');
  const [shippedFromSame, setShippedFromSame] = useState(false);
  const [shippedFromName, setShippedFromName] = useState('');
  const [shippedFromCountry, setShippedFromCountry] = useState('India');
  const [shippedFromAddress, setShippedFromAddress] = useState('');
  const [shippedFromCity, setShippedFromCity] = useState('');
  const [shippedFromPostal, setShippedFromPostal] = useState('');
  const [shippedFromState, setShippedFromState] = useState('');

  // Shipped To States
  const [shippedToAddressSel, setShippedToAddressSel] = useState('');
  const [shippedToSame, setShippedToSame] = useState(false);
  const [shippedToName, setShippedToName] = useState('');
  const [shippedToCountry, setShippedToCountry] = useState('India');
  const [shippedToAddress, setShippedToAddress] = useState('');
  const [shippedToCity, setShippedToCity] = useState('');
  const [shippedToPostal, setShippedToPostal] = useState('');
  const [shippedToState, setShippedToState] = useState('');
  const [shippedToSaveClient, setShippedToSaveClient] = useState(false);

  const [invoiceDate, setInvoiceDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [terms, setTerms] = useState('Due on Receipt');
  const [dueDate, setDueDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [notes, setNotes] = useState('');

  // Hardcoded default "Billed By" state (can edit)
  const [billedBy, setBilledBy] = useState({
    name: 'vidisha pvt ltd',
    address: 'Madhya Pradesh, India',
    gstin: '23AAQCM8058H2Z1',
    pan: 'AAQCM8058H'
  });
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrgId, setSelectedOrgId] = useState('');

  const updateBilledByFromOrg = (org) => {
    if (!org) return;
    setBilledBy({
      name: org.orgName || 'vidisha pvt ltd',
      address: `${org.orgAddress1 || ''}, ${org.orgAddress2 || ''}, ${org.orgCity || ''}, ${org.orgState || ''} - ${org.orgPincode || ''}`.replace(/(,\s*){2,}/g, ', ').trim().replace(/(^,\s*|,\s*$)/g, '') || 'Madhya Pradesh, India',
      gstin: org.orgGst || '23AAQCM8058H2Z1',
      pan: org.storePan || 'AAQCM8058H'
    });
    if (org.orgLogo) {
      setBusinessLogo(org.orgLogo);
    } else {
      setBusinessLogo(null);
    }
  };

  useEffect(() => {
    // 1. Fetch live Organization details from backend DB (Billed By Details & Logo)
    fetch(`${API_BASE_URL}/company-settings`)
      .then(res => {
        if (!res.ok) throw new Error('API load failed');
        return res.json();
      })
      .then(parsed => {
        if (Array.isArray(parsed) && parsed.length > 0) {
          setOrganizations(parsed);
          const defaultOrg = parsed[0];
          setSelectedOrgId(defaultOrg._id);
          updateBilledByFromOrg(defaultOrg);
        } else if (parsed && !Array.isArray(parsed)) {
          setOrganizations([parsed]);
          setSelectedOrgId(parsed._id || "");
          updateBilledByFromOrg(parsed);
        }
      })
      .catch(err => {
        console.error('Failed to load org settings from backend, falling back to localStorage:', err);
        // Fallback: Load Org Settings from POS Settings localStorage
        const savedSettings = localStorage.getItem('pos_settings');
        if (savedSettings) {
          try {
            const parsed = JSON.parse(savedSettings);
            updateBilledByFromOrg(parsed);
          } catch (e) {
            console.error('Failed to load local company settings', e);
          }
        }
      });

    // Fetch Warehouses
    fetch(`${API_BASE_URL}/inventory/warehouses`)
      .then(res => {
        if (!res.ok) throw new Error('API load failed');
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setWarehouses(data);
        }
      })
      .catch(err => console.error('Failed to load warehouses from backend:', err));

    // Fetch Taxes
    fetch(`${API_BASE_URL}/inventory/taxes`)
      .then(res => {
        if (!res.ok) throw new Error('API load failed');
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          const activeTaxes = data.filter(t => t.status === 'Active');
          if (activeTaxes.length > 0) {
            // Sort by tax value ascending
            activeTaxes.sort((a, b) => a.taxValue - b.taxValue);
            setTaxes(activeTaxes.map(t => ({ name: t.name, taxValue: t.taxValue })));
          }
        }
      })
      .catch(err => console.error('Failed to load taxes from backend:', err));

    fetch(`${API_BASE_URL}/delivery-challans`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const count = data.data.length;
          setNextInvoiceNumber(`DC-${String(count + 1).padStart(4, '0')}`);
        }
      }).catch(console.error);
    getAllProducts().then(res => {
      const prods = res.products || res.data || (Array.isArray(res) ? res : []);
      setProducts(prods);
    }).catch(console.error);

    getCustomers().then(data => {
      if (data.success) setCustomers(data.data);
    }).catch(console.error);

    getTermsTemplates()
      .then(data => {
        setTemplates(data);
        if (!editId) {
          const defaultTpl = data.find(t => t.name === 'Brand New');
          if (defaultTpl) {
            setSelectedTemplateName('Brand New');
            setTermsList(defaultTpl.terms.map(t => ({ text: t })));
          }
        }
      })
      .catch(err => console.error('Failed to load terms templates:', err));

    getColumnSettings('delivery-challan')
      .then(settings => {
        if (settings && settings.columns) {
          setColumns(settings.columns);
        }
      })
      .catch(err => console.error('Failed to load columns configuration:', err));

    // Outside click to close dropdown
    const handleOutsideClick = (e) => {
      if (!e.target.closest('.customer-select-container')) {
        setShowCustomerDropdown(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  // Edit mode: load existing invoice data
  useEffect(() => {
    if (!editId) return;
    fetch(`${API_BASE_URL}/delivery-challans/${editId}`)
      .then(res => res.json())
      .then(data => {
        if (!data.success || !data.data) return;
        const inv = data.data;
        setCustomerName(inv.customerName || '');
        setCustomerEmail(inv.customerEmail || '');
        setCustomerPhone(inv.customerPhone || '');
        setGstNumber(inv.gstNumber || '');
        setPlaceOfSupply(inv.placeOfSupply || '');
        setNextInvoiceNumber(inv.challanNumber || '');
        if (inv.challanDate) setInvoiceDate(new Date(inv.challanDate).toISOString().split('T')[0]);
        setNotes(inv.notes || '');
        if (inv.terms && inv.terms.length > 0) {
          setTermsList(inv.terms.map(t => ({ text: t })));
        }
        // Load items from challan
        const saleItems = inv.items || [];
        if (saleItems.length > 0) {
          setCartItems(saleItems.map((si, idx) => ({
            id: idx + 1,
            product: si.product || null,
            nameOrSku: si.product?.name || '',
            hsn: si.product?.hsnCode || '',
            gstRate: si.taxRate || 0,
            qty: si.quantity || 0,
            price: si.unitPrice || 0,
            discountRate: si.discount || 0,
            discountType: 'Fixed',
            cgst: 0,
            sgst: 0,
            total: si.subtotal || 0,
            showDescription: false,
            showImage: false,
            description: '',
            image: '',
            unit: 'Product',
            salesLedger: 'Sales'
          })));
        }
      })
      .catch(err => console.error('Failed to load delivery challan for edit:', err));
  }, [editId]);

  useEffect(() => {
    if (!invoiceDate) return;
    const date = new Date(invoiceDate);
    if (isNaN(date.getTime())) return;

    let daysToAdd = 0;
    if (terms === 'Net 15') daysToAdd = 15;
    else if (terms === 'Net 30') daysToAdd = 30;
    else if (terms === 'Net 45') daysToAdd = 45;
    else if (terms === 'Net 60') daysToAdd = 60;

    date.setDate(date.getDate() + daysToAdd);
    setDueDate(date.toISOString().split('T')[0]);
  }, [invoiceDate, terms]);

  // Recalculate Row CGST, SGST, Total
  const recalculateRow = (item) => {
    const amountBeforeDiscount = Number(item.qty) * Number(item.price);
    const discVal = item.discountRate ? (item.discountType === '%' ? amountBeforeDiscount * (Number(item.discountRate) / 100) : Number(item.discountRate)) : 0;
    const amount = Math.max(0, amountBeforeDiscount - discVal);
    const gstTotal = amount * (Number(item.gstRate) / 100);
    const cgst = gstTotal / 2;
    const sgst = gstTotal / 2;
    const total = amount + gstTotal;
    return {
      ...item,
      cgst: Number(cgst.toFixed(2)),
      sgst: Number(sgst.toFixed(2)),
      total: Number(total.toFixed(2))
    };
  };

  const handleRowProductSelect = (index, productId) => {
    const prod = products.find(p => p._id === productId);
    if (!prod) return;

    setCartItems(prev => {
      const newItems = [...prev];
      newItems[index] = recalculateRow({
        ...newItems[index],
        product: prod,
        nameOrSku: prod.name,
        hsn: prod.hsnCode || '',
        price: prod.sellingPrice || prod.price || 100,
        qty: newItems[index].qty || 1,
        gstRate: prod.gstRate || 0
      });
      return newItems;
    });
  };

  const updateRowField = (index, field, value) => {
    setCartItems(prev => {
      const newItems = [...prev];
      newItems[index] = recalculateRow({
        ...newItems[index],
        [field]: value
      });
      return newItems;
    });
  };

  const duplicateRow = (index) => {
    setCartItems(prev => {
      const rowToCopy = prev[index];
      const newRow = {
        ...rowToCopy,
        id: Date.now()
      };
      const newItems = [...prev];
      newItems.splice(index + 1, 0, newRow);
      return newItems;
    });
  };

  const updateCustomRowField = (index, colId, value) => {
    setCartItems(prev => {
      const newItems = [...prev];
      newItems[index] = {
        ...newItems[index],
        customColumns: {
          ...newItems[index].customColumns,
          [colId]: value
        }
      };
      return newItems;
    });
  };

  const openColumnsModal = () => {
    setTempColumns(JSON.parse(JSON.stringify(columns)));
    setIsColumnsModalOpen(true);
  };

  const resetColumnsToDefault = () => {
    const defaults = [
      { id: 'item', name: 'Item', type: 'TEXT', visible: true, width: '250px' },
      { id: 'hsn', name: 'HSN/SAC', type: 'NUMBER', visible: true, width: '130px' },
      { id: 'gstRate', name: 'GST Rate', type: 'NUMBER', visible: true, width: '90px' },
      { id: 'quantity', name: 'Quantity', type: 'NUMBER', visible: true, width: '90px' },
      { id: 'rate', name: 'Rate', type: 'CURRENCY', visible: true, width: '110px' },
      { id: 'discount', name: 'Discount', type: 'CURRENCY', visible: true, width: '120px' },
      { id: 'amount', name: 'Amount', type: 'CURRENCY', visible: true, width: '110px', formula: 'Quantity * Rate' },
      { id: 'cgst', name: 'CGST', type: 'CURRENCY', visible: true, width: '90px' },
      { id: 'sgst', name: 'SGST', type: 'CURRENCY', visible: true, width: '90px' },
      { id: 'total', name: 'Total', type: 'CURRENCY', visible: true, width: '110px', formula: 'Amount + CGST + SGST' }
    ];
    setTempColumns(defaults);
  };

  const handleAddNewColumn = () => {
    const id = `col_${Date.now()}`;
    const newCol = {
      id,
      name: `Custom Column ${tempColumns.length - 9}`,
      type: 'TEXT',
      visible: true,
      width: '120px'
    };
    setTempColumns([...tempColumns, newCol]);
  };

  const moveColumn = (index, direction) => {
    const newCols = [...tempColumns];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newCols.length) return;
    const temp = newCols[index];
    newCols[index] = newCols[targetIndex];
    newCols[targetIndex] = temp;
    setTempColumns(newCols);
  };

  const removeRow = (index) => {
    if (cartItems.length === 1) {
      // Clear row instead of deleting last row
      setCartItems([
        {
          id: Date.now(),
          product: null,
          nameOrSku: '',
          hsn: '',
          gstRate: 0,
          qty: 0,
          price: 0,
          cgst: 0,
          sgst: 0,
          total: 0,
          showDescription: false,
          showImage: false,
          description: '',
          image: '',
          unit: 'Product',
          salesLedger: 'Sales',
          customColumns: {}
        }
      ]);
      return;
    }
    setCartItems(prev => prev.filter((_, idx) => idx !== index));
  };

  const addNewLine = () => {
    setCartItems(prev => [
      ...prev,
      {
        id: Date.now(),
        product: null,
        nameOrSku: '',
        hsn: '',
        gstRate: 0,
        qty: 0,
        price: 0,
        discountRate: 0,
        discountType: 'Fixed',
        cgst: 0,
        sgst: 0,
        total: 0,
        showDescription: false,
        showImage: false,
        description: '',
        image: '',
        unit: 'Product',
        salesLedger: 'Sales',
        customColumns: {}
      }
    ]);
  };

  // Totals calculations
  const subtotal = cartItems.reduce((acc, item) => acc + (Number(item.qty) * Number(item.price)), 0);
  const extraChargeWithoutTax = chargeWithoutTaxActive ? (chargeWithoutTaxUnit === 'Fixed' ? Number(chargeWithoutTaxValue) : subtotal * (Number(chargeWithoutTaxValue) / 100)) : 0;
  const extraChargeWithTax = chargeWithTaxActive ? Number(chargeWithTaxValue) : 0;
  const shipping = extraChargeWithoutTax + extraChargeWithTax;
  
  const totalGstOfItems = cartItems.reduce((acc, item) => acc + (Number(item.qty) * Number(item.price) * (Number(item.gstRate) / 100)), 0);
  const serviceTax = chargeWithTaxActive ? Number(chargeWithTaxValue) * (Number(chargeWithTaxGstRate) / 100) : 0;
  const totalGst = totalGstOfItems + serviceTax;

  const totalCgst = gstType === 'CGST & SGST' ? totalGst / 2 : 0;
  const totalSgst = gstType === 'CGST & SGST' ? totalGst / 2 : 0;
  const totalIgst = gstType === 'IGST' ? totalGst : 0;
  
  const discount = discountOnTotalActive ? (discountType === 'Fixed' ? Number(discountInputValue) : subtotal * (Number(discountInputValue) / 100)) : 0;
  const baseGrandTotal = Math.max(0, subtotal + totalGst + Number(shipping) - Number(discount));
  const hasDecimals = baseGrandTotal % 1 !== 0;
  
  let roundOff = 0;
  let grandTotal = baseGrandTotal;
  if (hasDecimals) {
    if (roundMode === 'Up') {
      grandTotal = Math.ceil(baseGrandTotal);
      roundOff = grandTotal - baseGrandTotal;
    } else if (roundMode === 'Down') {
      grandTotal = Math.floor(baseGrandTotal);
      roundOff = grandTotal - baseGrandTotal;
    }
  }
  const actualPaid = customPaidAmount === '' ? grandTotal : Number(customPaidAmount);
  const dueAmt = Math.max(0, grandTotal - actualPaid);
  const payStatus = dueAmt <= 0 ? 'Paid' : (actualPaid > 0 ? 'Partial' : 'Unpaid');

  // Convert number to words helper (simple implementation)
  useEffect(() => {
    const toWords = (num) => {
      if (num === 0) return 'Zero Rupees Only';
      const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
      const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
      
      const convert = (n) => {
        if (n < 20) return ones[n];
        if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + ones[n % 10] : '');
        if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' and ' + convert(n % 100) : '');
        if (n < 100000) return convert(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 !== 0 ? ' ' + convert(n % 1000) : '');
        return 'Large Amount';
      };

      const parts = String(num.toFixed(2)).split('.');
      const rupees = parseInt(parts[0]);
      const paise = parseInt(parts[1]);
      
      let str = convert(rupees) + ' Rupees';
      if (paise > 0) {
        str += ' and ' + convert(paise) + ' Paise';
      }
      return str + ' Only';
    };
    setTotalInWords(toWords(grandTotal));
  }, [grandTotal]);

  const filteredCustomers = customers.filter(c => {
    const fullName = `${c.firstName || ''} ${c.lastName || ''}`.toLowerCase();
    const dispName = (c.displayName || '').toLowerCase();
    const email = (c.email || '').toLowerCase();
    const phone = (c.phone || '').toLowerCase();
    return fullName.includes(customerSearchTerm.toLowerCase()) || 
           dispName.includes(customerSearchTerm.toLowerCase()) || 
           email.includes(customerSearchTerm.toLowerCase()) || 
           phone.includes(customerSearchTerm.toLowerCase());
  });

  const handleSubmit = async (e, mode = 'save') => {
    if (e && e.preventDefault) e.preventDefault();
    if (!customerName) {
      alert('Please select or enter Customer Name');
      return;
    }
    
    const validItems = cartItems.filter(item => item.product);
    if (validItems.length === 0) {
      alert('Please select at least one valid product');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        challanNumber: nextInvoiceNumber,
        challanDate: invoiceDate,
        customerName: customerName,
        customerEmail: customerEmail,
        customerPhone: customerPhone,
        gstNumber: gstNumber,
        placeOfSupply: placeOfSupply,
        organization: selectedOrgId || null,
        items: validItems.map(ci => ({
          product: ci.product._id,
          quantity: ci.qty,
          unitPrice: ci.price,
          discount: ci.discountRate || 0,
          taxRate: ci.gstRate || 0,
          subtotal: ci.price * ci.qty
        })),
        subtotal,
        totalDiscount: Number(discount),
        totalTax: totalGst,
        grandTotal,
        status: status,
        notes: notes
      };

      let res;
      if (editId) {
        // Update existing Delivery Challan
        const updateRes = await fetch(`${API_BASE_URL}/delivery-challans/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        res = await updateRes.json();
        if (res.success) {
          alert(`Delivery Challan updated successfully!`);
          navigate('/delivery-challans');
        } else {
          alert(res.message || 'Failed to update Delivery Challan');
        }
      } else {
        const createRes = await fetch(`${API_BASE_URL}/delivery-challans`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        res = await createRes.json();
        if (res.success) {
          alert(`Delivery Challan created successfully!`);
          navigate('/delivery-challans');
        } else {
          alert(res.message || 'Failed to create Delivery Challan');
        }
      }
    } catch (err) {
      alert(`Error saving Delivery Challan: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBusinessLogo(URL.createObjectURL(file));
    }
  };

  return (
    <DashboardLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <button 
          type="button"
          onClick={() => navigate('/delivery-challans')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid #D1D5DB', backgroundColor: 'white', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}
        >
          <ArrowLeft size={16} /> Back
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={() => handleSubmit(null, 'draft')}
            disabled={loading}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'white', border: '1px solid #D1D5DB', color: '#374151', padding: '0.6rem 1.25rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' }}
          >
            <Save size={16} /> Save Draft
          </button>
          <button
            type="button"
            onClick={() => handleSubmit(null, 'new')}
            disabled={loading}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#FF9F43', border: 'none', color: 'white', padding: '0.6rem 1.25rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' }}
          >
            <Save size={16} /> Save & Create New
          </button>
          <button
            type="submit"
            onClick={(e) => handleSubmit(e, 'save')}
            disabled={loading}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--color-navy)', border: 'none', color: 'white', padding: '0.6rem 1.5rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' }}
          >
            <Save size={16} /> {loading ? 'Saving...' : `Save ${invoiceType}`}
          </button>
        </div>
      </div>

      <Card style={{ padding: '2.5rem', maxWidth: '1200px', margin: '0 auto', border: '1px solid #F3F4F6', boxShadow: '0 4px 20px -2px rgba(0,0,0,0.05)' }}>
        <form onSubmit={handleSubmit}>
          
          {/* Header & Logo Flex Row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem', position: 'relative', minHeight: '100px' }}>
            {/* Empty spacer to push title to exact center */}
            <div style={{ width: '240px' }}></div>

            {/* Header Title Section (Centered) */}
            <div style={{ textAlign: 'center' }}>
              <h1 style={{ fontSize: '2.25rem', fontWeight: 700, color: '#111827', margin: 0 }}>{invoiceType}</h1>
            </div>

            {/* Business Logo Upload (Right Side) */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <div style={{ 
                width: '240px', 
                height: '100px', 
                border: businessLogo ? 'none' : '1px dashed #D1D5DB', 
                borderRadius: '8px', 
                backgroundColor: businessLogo ? 'transparent' : '#F9FAFB', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                padding: businessLogo ? '0' : '0.5rem',
                textAlign: 'center'
              }}>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleLogoUpload}
                  style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0, cursor: 'pointer' }} 
                />
                {businessLogo ? (
                  <img src={businessLogo} alt="Logo" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                ) : (
                  <>
                    <Upload size={20} style={{ color: '#FF9F43', marginBottom: '0.25rem' }} />
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.15rem' }}>Add Business Logo</span>
                    <span style={{ fontSize: '0.7rem', color: '#6B7280', display: 'block', lineHeight: 1.2 }}>Resolution up to 1080x1080px.</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Top Metadata Section (Full width / Two Columns) */}
          <div style={{ marginBottom: '3rem' }}>
            {/* Left Column (Underlined Inputs) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr', gap: '3rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <label style={{ width: '120px', fontSize: '0.875rem', fontWeight: 500, color: '#374151', textDecoration: 'underline', textDecorationColor: '#D1D5DB' }}>Challan No*</label>
                  <input 
                    type="text" 
                    value={nextInvoiceNumber}
                    onChange={(e) => setNextInvoiceNumber(e.target.value)}
                    style={{ flex: 1, border: 'none', borderBottom: '1px dashed #D1D5DB', padding: '0.35rem 0', outline: 'none', fontSize: '0.925rem', color: '#111827', fontWeight: 500 }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                  <label style={{ width: '120px', fontSize: '0.875rem', fontWeight: 500, color: '#374151', textDecoration: 'underline', textDecorationColor: '#D1D5DB' }}>Challan Date*</label>
                  <input 
                    type="date" 
                    value={invoiceDate}
                    onChange={(e) => setInvoiceDate(e.target.value)}
                    style={{ flex: 1, border: 'none', borderBottom: '1px dashed #D1D5DB', padding: '0.35rem 0', outline: 'none', fontSize: '0.925rem', color: '#111827', backgroundColor: 'transparent' }}
                  />
                </div>
              </div>
            </div>

            <div style={{ marginTop: '1.25rem', display: 'flex', gap: '1rem' }}>
              <button 
                type="button" 
                onClick={() => setCustomFields(prev => [...prev, { label: 'Custom Field', value: '' }])}
                style={{ background: 'none', border: 'none', color: '#FF9F43', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer' }}
              >
                <Plus size={14} /> Add Custom Fields
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.25rem' }}>
              {customFields.map((field, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <input 
                    type="text" 
                    value={field.label} 
                    onChange={(e) => {
                      const updated = [...customFields];
                      updated[idx].label = e.target.value;
                      setCustomFields(updated);
                    }}
                    style={{ width: '120px', border: 'none', borderBottom: '1px solid #D1D5DB', outline: 'none', fontSize: '0.875rem' }}
                  />
                  <input 
                    type="text" 
                    placeholder="Value" 
                    value={field.value} 
                    onChange={(e) => {
                      const updated = [...customFields];
                      updated[idx].value = e.target.value;
                      setCustomFields(updated);
                    }}
                    style={{ flex: 1, border: 'none', borderBottom: '1px solid #D1D5DB', outline: 'none', fontSize: '0.875rem' }}
                  />
                  <Trash2 size={16} style={{ color: '#EF4444', cursor: 'pointer' }} onClick={() => setCustomFields(prev => prev.filter((_, i) => i !== idx))} />
                </div>
              ))}
            </div>
          </div>

          {/* Billed By & Billed To Card Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
                        {/* Billed By Card */}
            <div style={{ border: '1px solid #F3F4F6', borderRadius: '8px', padding: '1.5rem', backgroundColor: '#F9FAFB' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#374151', marginBottom: '1rem' }}>
                Billed By <span style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: 400 }}>(Your Details)</span>
              </div>
              
              {organizations.length > 0 && (
                <div style={{ position: 'relative', marginBottom: '1rem' }}>
                  <select
                    value={selectedOrgId}
                    onChange={(e) => {
                      const orgId = e.target.value;
                      if (orgId === 'ADD_NEW') {
                        navigate('/pos-settings');
                        return;
                      }
                      setSelectedOrgId(orgId);
                      const org = organizations.find(o => o._id === orgId);
                      if (org) updateBilledByFromOrg(org);
                    }}
                    style={{
                      width: '100%',
                      backgroundColor: 'white',
                      border: '1px solid #D1D5DB',
                      borderRadius: '6px',
                      padding: '0.5rem 0.75rem',
                      fontSize: '0.875rem',
                      color: '#111827',
                      outline: 'none',
                      cursor: 'pointer',
                      appearance: 'none',
                      WebkitAppearance: 'none',
                      paddingRight: '2rem'
                    }}
                  >
                    {organizations.map(org => (
                      <option key={org._id} value={org._id}>{org.orgName}</option>
                    ))}
                    <option value="ADD_NEW" style={{ color: '#FF9F43', fontWeight: 'bold' }}>+ Add New</option>
                  </select>
                  <div style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', display: 'flex', alignItems: 'center' }}>
                    <ChevronDown size={16} style={{ color: '#9CA3AF' }} />
                  </div>
                </div>
              )}


              <div style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #E5E7EB', padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 600, color: '#111827', fontSize: '0.9rem' }}>{billedBy.name}</span>
                  <Edit2 size={14} style={{ color: '#FF9F43', cursor: 'pointer' }} />
                </div>
                <div style={{ fontSize: '0.8rem', color: '#6B7280', marginBottom: '0.5rem' }}>{billedBy.address}</div>
                <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '0.25rem', fontSize: '0.8rem' }}>
                  <span style={{ color: '#9CA3AF' }}>GSTIN</span>
                  <span style={{ fontWeight: 500, color: '#374151' }}>{billedBy.gstin}</span>
                  <span style={{ color: '#9CA3AF' }}>PAN</span>
                  <span style={{ fontWeight: 500, color: '#374151' }}>{billedBy.pan}</span>
                </div>
              </div>
            </div>

            {/* Billed To Card */}
            <div style={{ border: '1px solid #F3F4F6', borderRadius: '8px', padding: '1.5rem', backgroundColor: '#F9FAFB' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#374151' }}>Billed To <span style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: 400 }}>(Client's Details)</span></span>
              </div>
              
              <div className="customer-select-container" style={{ position: 'relative', marginBottom: '1rem' }}>
                <div 
                  onClick={() => setShowCustomerDropdown(!showCustomerDropdown)}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #D1D5DB', backgroundColor: 'white', fontSize: '0.875rem', color: customerName ? '#111827' : '#9CA3AF', cursor: 'pointer' }}
                >
                  <span>{customerName || "Select a Client"}</span>
                  <ChevronDown size={16} style={{ color: '#9CA3AF' }} />
                </div>

                {showCustomerDropdown && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 1000, backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', marginTop: '4px', padding: '0.75rem' }}>
                    <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
                      <Search size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                      <input
                        type="search"
                        placeholder="Search Client"
                        value={customerSearchTerm}
                        onChange={(e) => setCustomerSearchTerm(e.target.value)}
                        style={{ width: '100%', padding: '0.5rem 0.75rem 0.5rem 2.2rem', borderRadius: '6px', border: '1px solid #D1D5DB', outline: 'none', fontSize: '0.875rem', height: '36px', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div style={{ maxHeight: '180px', overflowY: 'auto' }}>
                      {filteredCustomers.map((c) => {
                        const fullName = c.displayName || `${c.firstName || ''} ${c.lastName || ''}`.trim() || 'Unnamed Customer';
                        return (
                          <div
                            key={c._id}
                            onClick={() => {
                              setCustomerName(fullName);
                              setCustomerEmail(c.email || '');
                              setCustomerPhone(c.phone || '');
                              setGstNumber(c.gstNumber || '');
                              
                              // Fallback logic for placeOfSupply: c.placeOfSupply -> c.state -> store/organization state -> 'Madhya Pradesh'
                              const parsedSettings = JSON.parse(localStorage.getItem('pos_settings') || '{}');
                              const storeStateFallback = parsedSettings.orgState || 'Madhya Pradesh';
                              setPlaceOfSupply(c.placeOfSupply || c.state || storeStateFallback);
                              
                              setSelectedCustomer(c);
                              setShowCustomerDropdown(false);
                            }}
                            style={{ padding: '0.5rem 0.75rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.875rem', hover: { backgroundColor: '#F3F4F6' } }}
                          >
                            {fullName}
                          </div>
                        );
                      })}
                    </div>
                    <div 
                      onClick={() => {
                        setCustomerToEdit(null);
                        setIsCustomerModalOpen(true);
                        setShowCustomerDropdown(false);
                      }}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', color: '#FF9F43', fontWeight: 600, fontSize: '0.875rem', borderTop: '1px solid #E5E7EB', cursor: 'pointer', marginTop: '0.5rem' }}
                    >
                      + Add New Client
                    </div>
                  </div>
                )}
              </div>

              {selectedCustomer ? (
                <div style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #E5E7EB', padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 600, color: '#111827', fontSize: '0.9rem' }}>
                      {selectedCustomer.companyName || `${selectedCustomer.firstName || ''} ${selectedCustomer.lastName || ''}`.trim()}
                    </span>
                    <Edit2 size={14} style={{ color: '#FF9F43', cursor: 'pointer' }} onClick={() => { setCustomerToEdit(selectedCustomer); setIsCustomerModalOpen(true); }} />
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#6B7280', marginBottom: '0.5rem' }}>{selectedCustomer.address || 'No address specified'}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '0.25rem', fontSize: '0.8rem' }}>
                    {selectedCustomer.gstNumber && (
                      <>
                        <span style={{ color: '#9CA3AF' }}>GSTIN</span>
                        <span style={{ fontWeight: 500, color: '#374151' }}>{selectedCustomer.gstNumber}</span>
                      </>
                    )}
                    {(selectedCustomer.placeOfSupply || selectedCustomer.state) && (
                      <>
                        <span style={{ color: '#9CA3AF' }}>Place of Supply</span>
                        <span style={{ fontWeight: 500, color: '#374151' }}>{selectedCustomer.placeOfSupply || selectedCustomer.state}</span>
                      </>
                    )}
                    {selectedCustomer.phone && (
                      <>
                        <span style={{ color: '#9CA3AF' }}>Phone</span>
                        <span style={{ fontWeight: 500, color: '#374151' }}>{selectedCustomer.phone}</span>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div style={{ border: '1px dashed #D1D5DB', borderRadius: '8px', backgroundColor: 'white', height: '115px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.8rem', color: '#6B7280' }}>Select Client/Business from the list</span>
                  <span style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>OR</span>
                  <button 
                    type="button" 
                    onClick={() => setIsCustomerModalOpen(true)}
                    style={{ border: 'none', backgroundColor: '#FF9F43', color: 'white', padding: '0.4rem 1rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                  >
                    + Add New Client
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Add Shipping Details Option */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2.5rem' }}>
            <input 
              type="checkbox" 
              id="shippingDetails" 
              checked={showShippingDetails}
              onChange={(e) => setShowShippingDetails(e.target.checked)}
              style={{ cursor: 'pointer', accentColor: '#FF9F43' }} 
            />
            <label htmlFor="shippingDetails" style={{ fontSize: '0.875rem', fontWeight: 500, color: '#4B5563', cursor: 'pointer' }}>Add Shipping Details</label>
          </div>

          {/* Shipping Details Cards */}
          {showShippingDetails && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
              
              {/* Shipped From Card */}
              <div style={{ border: '1px solid #E5E7EB', borderRadius: '8px', padding: '1.5rem', backgroundColor: '#F9FAFB', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1F2937', borderBottom: '1px dotted #D1D5DB', paddingBottom: '0.5rem', display: 'inline-block', width: 'fit-content' }}>Shipped From</span>
                
                <div>
                  <select 
                    value={shippedFromWarehouse} 
                    onChange={(e) => {
                      const selectedVal = e.target.value;
                      setShippedFromWarehouse(selectedVal);
                      const matched = warehouses.find(w => w.name === selectedVal);
                      if (matched) {
                        setShippedFromName(matched.name);
                        setShippedFromAddress(matched.location || '');
                      } else {
                        setShippedFromName('');
                        setShippedFromAddress('');
                      }
                    }}
                    style={{ width: '100%', padding: '0.6rem 0.85rem', border: '1px solid #D1D5DB', borderRadius: '6px', fontSize: '0.875rem', backgroundColor: 'white', outline: 'none' }}
                  >
                    <option value="">Select Warehouse</option>
                    {warehouses.map(w => (
                      <option key={w._id} value={w.name}>{w.name}</option>
                    ))}
                  </select>
                </div>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.825rem', color: '#4B5563', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={shippedFromSame} 
                    onChange={(e) => {
                      setShippedFromSame(e.target.checked);
                      if (e.target.checked) {
                        setShippedFromName(billedBy.name);
                        setShippedFromAddress(billedBy.address);
                      } else {
                        setShippedFromName('');
                        setShippedFromAddress('');
                      }
                    }} 
                    style={{ accentColor: '#FF9F43' }} 
                  />
                  Same as your business address
                </label>

                <input 
                  type="text" 
                  placeholder="Your Business Name" 
                  value={shippedFromName} 
                  onChange={(e) => setShippedFromName(e.target.value)} 
                  style={{ width: '100%', padding: '0.6rem 0.85rem', border: '1px solid #D1D5DB', borderRadius: '6px', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }}
                />

                <select 
                  value={shippedFromCountry} 
                  onChange={(e) => setShippedFromCountry(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.85rem', border: '1px solid #D1D5DB', borderRadius: '6px', fontSize: '0.875rem', backgroundColor: 'white', outline: 'none' }}
                >
                  {Country.getAllCountries().map(c => (
                    <option key={c.isoCode} value={c.name}>{c.name}</option>
                  ))}
                </select>

                <input 
                  type="text" 
                  placeholder="Address (optional)" 
                  value={shippedFromAddress} 
                  onChange={(e) => setShippedFromAddress(e.target.value)} 
                  style={{ width: '100%', padding: '0.6rem 0.85rem', border: '1px solid #D1D5DB', borderRadius: '6px', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }}
                />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <input 
                    type="text" 
                    placeholder="City (optional)" 
                    value={shippedFromCity} 
                    onChange={(e) => setShippedFromCity(e.target.value)} 
                    style={{ width: '100%', padding: '0.6rem 0.85rem', border: '1px solid #D1D5DB', borderRadius: '6px', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }}
                  />
                  <input 
                    type="text" 
                    placeholder="Postal Code / ZIP Code" 
                    value={shippedFromPostal} 
                    onChange={(e) => setShippedFromPostal(e.target.value)} 
                    style={{ width: '100%', padding: '0.6rem 0.85rem', border: '1px solid #D1D5DB', borderRadius: '6px', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <input 
                  type="text" 
                  placeholder="State (optional)" 
                  value={shippedFromState} 
                  onChange={(e) => setShippedFromState(e.target.value)} 
                  style={{ width: '100%', padding: '0.6rem 0.85rem', border: '1px solid #D1D5DB', borderRadius: '6px', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }}
                />

                <div style={{ fontSize: '0.825rem', color: '#FF9F43', fontWeight: 600, cursor: 'pointer' }}>+ Add More Fields</div>
              </div>

              {/* Shipped To Card */}
              <div style={{ border: '1px solid #E5E7EB', borderRadius: '8px', padding: '1.5rem', backgroundColor: '#F9FAFB', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1F2937', borderBottom: '1px dotted #D1D5DB', paddingBottom: '0.5rem', display: 'inline-block', width: 'fit-content' }}>Shipped To</span>
                
                <div>
                  <select 
                    value={shippedToAddressSel} 
                    onChange={(e) => setShippedToAddressSel(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem 0.85rem', border: '1px solid #D1D5DB', borderRadius: '6px', fontSize: '0.875rem', backgroundColor: 'white', outline: 'none' }}
                  >
                    <option value="">Select a Shipping Address</option>
                    <option value="Office Address">Office Address</option>
                    <option value="Home Address">Home Address</option>
                  </select>
                </div>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.825rem', color: '#4B5563', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={shippedToSame} 
                    onChange={(e) => {
                      setShippedToSame(e.target.checked);
                      if (e.target.checked) {
                        setShippedToName(customerName || '');
                      } else {
                        setShippedToName('');
                      }
                    }} 
                    style={{ accentColor: '#FF9F43' }} 
                  />
                  Same as client's address
                </label>

                <input 
                  type="text" 
                  placeholder="Client's business name" 
                  value={shippedToName} 
                  onChange={(e) => setShippedToName(e.target.value)} 
                  style={{ width: '100%', padding: '0.6rem 0.85rem', border: '1px solid #D1D5DB', borderRadius: '6px', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }}
                />

                <select 
                  value={shippedToCountry} 
                  onChange={(e) => setShippedToCountry(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.85rem', border: '1px solid #D1D5DB', borderRadius: '6px', fontSize: '0.875rem', backgroundColor: 'white', outline: 'none' }}
                >
                  {Country.getAllCountries().map(c => (
                    <option key={c.isoCode} value={c.name}>{c.name}</option>
                  ))}
                </select>

                <input 
                  type="text" 
                  placeholder="Address (optional)" 
                  value={shippedToAddress} 
                  onChange={(e) => setShippedToAddress(e.target.value)} 
                  style={{ width: '100%', padding: '0.6rem 0.85rem', border: '1px solid #D1D5DB', borderRadius: '6px', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }}
                />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <input 
                    type="text" 
                    placeholder="City (optional)" 
                    value={shippedToCity} 
                    onChange={(e) => setShippedToCity(e.target.value)} 
                    style={{ width: '100%', padding: '0.6rem 0.85rem', border: '1px solid #D1D5DB', borderRadius: '6px', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }}
                  />
                  <input 
                    type="text" 
                    placeholder="Postal Code / ZIP Code" 
                    value={shippedToPostal} 
                    onChange={(e) => setShippedToPostal(e.target.value)} 
                    style={{ width: '100%', padding: '0.6rem 0.85rem', border: '1px solid #D1D5DB', borderRadius: '6px', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <input 
                  type="text" 
                  placeholder="State (optional)" 
                  value={shippedToState} 
                  onChange={(e) => setShippedToState(e.target.value)} 
                  style={{ width: '100%', padding: '0.6rem 0.85rem', border: '1px solid #D1D5DB', borderRadius: '6px', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }}
                />

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.825rem', color: '#4B5563', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={shippedToSaveClient} 
                    onChange={(e) => setShippedToSaveClient(e.target.checked)} 
                    style={{ accentColor: '#FF9F43' }} 
                  />
                  Save to client details
                </label>

                <div style={{ fontSize: '0.825rem', color: '#FF9F43', fontWeight: 600, cursor: 'pointer' }}>+ Add More Fields</div>
              </div>

            </div>
          )}


          {/* Columns Config Trigger */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
            <button 
              type="button"
              onClick={openColumnsModal}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid #D1D5DB', borderRadius: '6px', padding: '0.5rem 1rem', cursor: 'pointer', backgroundColor: 'white', fontWeight: '600', color: '#4B5563', fontSize: '0.85rem' }}
            >
              <Settings size={14} color="#FF9F43" /> Edit Columns/Formulas
            </button>
          </div>

          {/* Items Table Section */}
          <div style={{ border: '1px solid #E5E7EB', borderRadius: '8px 8px 0 0', overflow: 'hidden', marginBottom: '1.5rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#FF9F43', color: 'white', fontSize: '0.875rem' }}>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'center', fontWeight: 600, width: '40px' }}>#</th>
                  {columns.filter(col => col.visible).map(col => {
                    if (col.id === 'discount' && !isItemWiseDiscountActive) return null;
                    return (
                      <th key={col.id} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, width: col.width }}>
                        {col.name}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item, index) => (
                  <React.Fragment key={item.id}>
                    <tr style={{ borderBottom: '1px solid #E5E7EB', fontSize: '0.85rem', verticalAlign: 'middle' }}>
                      {/* Left Number & Copy/Trash action column */}
                      <td style={{ padding: '1rem 0.5rem', textAlign: 'center', position: 'relative' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', alignItems: 'center' }}>
                          <span style={{ fontWeight: 600, color: '#4B5563' }}>{index + 1}.</span>
                          <div style={{ display: 'flex', gap: '0.2rem' }}>
                            <Copy size={12} style={{ color: '#9CA3AF', cursor: 'pointer' }} onClick={() => duplicateRow(index)} />
                            <Trash2 size={12} style={{ color: '#EF4444', cursor: 'pointer' }} onClick={() => removeRow(index)} />
                          </div>
                        </div>
                      </td>

                      {/* Product Selector / Custom Input */}
                      {columns.filter(col => col.visible).map(col => {
                        if (col.id === 'discount' && !isItemWiseDiscountActive) return null;
                        
                        switch(col.id) {
                          case 'item':
                            return (
                              <td key={col.id} style={{ padding: '1rem 0.5rem' }}>
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                  <img 
                                    src={item.product?.images?.[0] ? `${API_BASE_URL.replace('/api', '')}/${item.product.images[0].replace(/^\//, '')}` : 'https://placehold.co/36x36?text=No+Img'} 
                                    alt="Product" 
                                    style={{ width: '36px', height: '36px', borderRadius: '6px', objectFit: 'cover', border: '1px solid #E5E7EB', flexShrink: 0 }} 
                                  />
                                  <select 
                                    className="term-list-input"
                                    style={{ flex: 1, border: 'none', borderBottom: '1.5px dashed #FF9F43', padding: '0.4rem 0.5rem 0.25rem', fontSize: '0.825rem', outline: 'none', backgroundColor: 'transparent', width: '100%' }}
                                    value={item.product?._id || ''}
                                    onChange={(e) => handleRowProductSelect(index, e.target.value)}
                                  >
                                    <option value="">Item Name / SKU Id</option>
                                    {products.map(p => (
                                      <option key={p._id} value={p._id}>{p.name}</option>
                                    ))}
                                  </select>
                                </div>
                              </td>
                            );
                          case 'hsn':
                            return (
                              <td key={col.id} style={{ padding: '1rem 0.5rem' }}>
                                <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                                  <input 
                                    type="text" 
                                    className="term-list-input"
                                    placeholder="#"
                                    value={item.hsn}
                                    onChange={(e) => updateRowField(index, 'hsn', e.target.value)}
                                    style={{ flex: 1, border: 'none', borderBottom: '1.5px dashed #FF9F43', padding: '0.4rem 0.5rem 0.25rem', fontSize: '0.825rem', outline: 'none', minWidth: '60px', backgroundColor: 'transparent' }}
                                  />
                                  <button 
                                    type="button" 
                                    onClick={() => {
                                      setHsnActiveRowIndex(index);
                                      setIsHsnModalOpen(true);
                                    }}
                                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }}
                                  >
                                    <Search size={13} style={{ color: '#FF9F43' }} />
                                  </button>
                                </div>
                              </td>
                            );
                          case 'gstRate':
                            return (
                              <td key={col.id} style={{ padding: '1rem 0.5rem' }}>
                                <select
                                  className="term-list-input"
                                  value={item.gstRate}
                                  onChange={(e) => updateRowField(index, 'gstRate', Number(e.target.value))}
                                  style={{ width: '100%', border: 'none', borderBottom: '1.5px dashed #FF9F43', padding: '0.4rem 0.5rem 0.25rem', fontSize: '0.825rem', outline: 'none', backgroundColor: 'transparent' }}
                                >
                                  {taxes.map((t, idx) => (
                                    <option key={idx} value={t.taxValue}>{t.name}</option>
                                  ))}
                                </select>
                              </td>
                            );
                          case 'quantity':
                            return (
                              <td key={col.id} style={{ padding: '1rem 0.5rem' }}>
                                <input 
                                  type="number" 
                                  className="term-list-input"
                                  min="0"
                                  value={item.qty}
                                  onChange={(e) => updateRowField(index, 'qty', Number(e.target.value))}
                                  style={{ width: '100%', border: 'none', borderBottom: '1.5px dashed #FF9F43', padding: '0.4rem 0.5rem 0.25rem', fontSize: '0.825rem', outline: 'none', backgroundColor: 'transparent', textAlign: 'center' }}
                                />
                              </td>
                            );
                          case 'rate':
                            return (
                              <td key={col.id} style={{ padding: '1rem 0.5rem' }}>
                                <input 
                                  type="number" 
                                  className="term-list-input"
                                  min="0"
                                  value={item.price}
                                  onChange={(e) => updateRowField(index, 'price', Number(e.target.value))}
                                  style={{ width: '100%', border: 'none', borderBottom: '1.5px dashed #FF9F43', padding: '0.4rem 0.5rem 0.25rem', fontSize: '0.825rem', outline: 'none', backgroundColor: 'transparent', textAlign: 'right' }}
                                />
                              </td>
                            );
                          case 'discount':
                            return (
                              <td key={col.id} style={{ padding: '1rem 0.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                  <input 
                                    type="number" 
                                    className="term-list-input"
                                    min="0"
                                    value={item.discountRate || 0}
                                    onChange={(e) => updateRowField(index, 'discountRate', Number(e.target.value))}
                                    style={{ width: '50px', border: 'none', borderBottom: '1.5px dashed #FF9F43', padding: '0.4rem 0.5rem 0.25rem', fontSize: '0.825rem', outline: 'none', backgroundColor: 'transparent' }}
                                  />
                                  <select
                                    className="term-list-input"
                                    value={item.discountType || 'Fixed'}
                                    onChange={(e) => updateRowField(index, 'discountType', e.target.value)}
                                    style={{ border: 'none', borderBottom: '1.5px dashed #FF9F43', padding: '0.4rem 0.25rem 0.25rem', fontSize: '0.75rem', outline: 'none', backgroundColor: 'transparent', width: '40px' }}
                                  >
                                    <option value="Fixed">₹</option>
                                    <option value="%">%</option>
                                  </select>
                                  <button 
                                    type="button" 
                                    onClick={() => {
                                      updateRowField(index, 'discountRate', 0);
                                      setIsItemWiseDiscountActive(false);
                                    }}
                                    style={{ border: 'none', background: 'none', color: '#9CA3AF', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }}
                                  >
                                    <X size={14} />
                                  </button>
                                </div>
                              </td>
                            );
                          case 'amount':
                            const amountBeforeDiscount = Number(item.qty) * Number(item.price);
                            const discVal = item.discountRate ? (item.discountType === '%' ? amountBeforeDiscount * (Number(item.discountRate) / 100) : Number(item.discountRate)) : 0;
                            const amount = Math.max(0, amountBeforeDiscount - discVal);
                            return (
                              <td key={col.id} style={{ padding: '1rem 0.5rem', color: '#374151', fontWeight: 500 }}>
                                ₹{amount.toFixed(2)}
                              </td>
                            );
                          case 'cgst':
                            return (
                              <td key={col.id} style={{ padding: '1rem 0.5rem', color: '#6B7280' }}>
                                ₹{item.cgst.toFixed(2)}
                              </td>
                            );
                          case 'sgst':
                            return (
                              <td key={col.id} style={{ padding: '1rem 0.5rem', color: '#6B7280' }}>
                                ₹{item.sgst.toFixed(2)}
                              </td>
                            );
                          case 'total':
                            return (
                              <td key={col.id} style={{ padding: '1rem 0.5rem', color: '#111827', fontWeight: 600 }}>
                                ₹{item.total.toFixed(2)}
                              </td>
                            );
                          default:
                            return (
                              <td key={col.id} style={{ padding: '1rem 0.5rem' }}>
                                <input 
                                  type={col.type === 'NUMBER' ? 'number' : 'text'} 
                                  className="term-list-input" 
                                  placeholder={col.name}
                                  value={(item.customColumns && item.customColumns[col.id]) || ''}
                                  onChange={(e) => updateCustomRowField(index, col.id, e.target.value)}
                                  style={{ width: '100%', border: 'none', borderBottom: '1.5px dashed #FF9F43', padding: '0.4rem 0.5rem 0.25rem', fontSize: '0.825rem', outline: 'none', backgroundColor: 'transparent' }}
                                />
                              </td>
                            );
                        }
                      })}
                    </tr>

                    {/* Collapsible Sub-item Row Actions */}
                    <tr style={{ borderBottom: '1px solid #F3F4F6' }}>
                      <td></td>
                      <td colSpan={isItemWiseDiscountActive ? 10 : 9} style={{ padding: '0.5rem' }}>
                        <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', fontSize: '0.775rem' }}>
                          <button 
                            type="button"
                            onClick={() => updateRowField(index, 'showDescription', !item.showDescription)}
                            style={{ background: 'none', border: 'none', color: '#FF9F43', display: 'flex', alignItems: 'center', gap: '0.2' + 'rem', cursor: 'pointer', fontWeight: 500 }}
                          >
                            <PlusCircle size={12} /> Add Description
                          </button>
                        </div>

                        {/* Collapsed Description Input */}
                        {item.showDescription && (
                          <div style={{ marginTop: '0.5rem', maxWidth: '500px' }}>
                            <input 
                              type="text" 
                              placeholder="Enter item description"
                              value={item.description}
                              onChange={(e) => updateRowField(index, 'description', e.target.value)}
                              style={{ width: '100%', border: '1px solid #D1D5DB', padding: '0.35rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', outline: 'none' }}
                            />
                          </div>
                        )}
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {/* Under Table Action Buttons */}
          <div style={{ marginBottom: '3rem' }}>
            <button 
              type="button" 
              onClick={addNewLine}
              style={{ width: '100%', border: '1.5px dashed #D1D5DB', backgroundColor: 'white', padding: '0.65rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.875rem', color: '#6B7280', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
            >
              <PlusCircle size={16} style={{ color: '#FF9F43' }} /> Add New Line
            </button>
          </div>

          {/* Dynamic Details and Split Bottom Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '3.5rem', alignItems: 'start' }}>
            
            {/* Left Column (Buttons & Advanced Options) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Additional Options Button Bar */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                  <button 
                    type="button" 
                    onClick={() => setShowTermsInput(!showTermsInput)}
                    style={{ border: showTermsInput ? '1.5px solid #FF9F43' : '1px dashed #D1D5DB', backgroundColor: 'white', padding: '0.55rem', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer', color: '#4B5563', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', fontWeight: 500 }}
                  >
                    <Plus size={14} style={{ color: '#FF9F43' }} /> Add Terms & Conditions
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setShowNotesInput(!showNotesInput)}
                    style={{ border: showNotesInput ? '1.5px solid #FF9F43' : '1px dashed #D1D5DB', backgroundColor: 'white', padding: '0.55rem', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer', color: '#4B5563', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', fontWeight: 500 }}
                  >
                    <FileText size={14} style={{ color: '#FF9F43' }} /> Add Notes
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setShowAttachments(!showAttachments)}
                    style={{ border: showAttachments ? '1.5px solid #FF9F43' : '1px dashed #D1D5DB', backgroundColor: 'white', padding: '0.55rem', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer', color: '#4B5563', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', fontWeight: 500 }}
                  >
                    <Plus size={14} style={{ color: '#FF9F43' }} /> Add Attachments
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem' }}>
                  <button 
                    type="button" 
                    onClick={() => setShowAdditionalInfo(!showAdditionalInfo)}
                    style={{ border: showAdditionalInfo ? '1.5px solid #FF9F43' : '1px dashed #D1D5DB', backgroundColor: 'white', padding: '0.55rem', borderRadius: '6px', fontSize: '0.8.rem', cursor: 'pointer', color: '#4B5563', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', fontWeight: 500 }}
                  >
                    <FileText size={14} style={{ color: '#FF9F43' }} /> Add Additional Info
                  </button>
                </div>
              </div>

              {showTermsInput && (
                <div style={{ border: '1px solid #E5E7EB', borderRadius: '8px', padding: '1.25rem', backgroundColor: '#F9FAFB', marginTop: '1rem', position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#374151' }}>Terms and Conditions</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <select
                        onChange={(e) => {
                          const val = e.target.value;
                          setSelectedTemplateName(val);
                          const selectedTemplate = templates.find(t => t.name === val);
                          if (selectedTemplate) {
                            setTermsList(selectedTemplate.terms.map(t => ({ text: t })));
                          }
                        }}
                        value={selectedTemplateName}
                        className="term-list-input"
                        style={{
                          border: 'none',
                          borderBottom: '1.5px dashed #FF9F43',
                          outline: 'none',
                          fontSize: '0.85rem',
                          color: '#111827',
                          fontWeight: 600,
                          backgroundColor: 'transparent',
                          cursor: 'pointer',
                          padding: '0.25rem 0',
                          marginRight: '0.25rem'
                        }}
                      >
                        <option value="" disabled>Load Template...</option>
                        {templates.map(t => (
                          <option key={t.name} value={t.name}>{t.name}</option>
                        ))}
                      </select>
                      <button 
                        type="button" 
                        onClick={handleSaveAsTemplate}
                        style={{
                          border: 'none',
                          backgroundColor: 'transparent',
                          color: '#FF9F43',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          outline: 'none',
                          padding: '0.25rem 0.5rem'
                        }}
                      >
                        + Save As Template
                      </button>
                      <button type="button" style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0 }} onClick={() => setShowTermsInput(false)}>
                        <X size={16} style={{ color: '#9CA3AF' }} />
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {termsList.map((term, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', position: 'relative', paddingBottom: '0.75rem', borderBottom: '1px solid #E5E7EB', marginBottom: '0.75rem' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151', minWidth: '24px' }}>{String(idx + 1).padStart(2, '0')}</span>
                        <div style={{ flex: 1, position: 'relative' }}>
                          <input 
                            type="text" 
                            className="term-list-input"
                            value={term.text}
                            onChange={(e) => handleUpdateTermText(idx, e.target.value)}
                            onFocus={() => setActiveTermFocusIndex(idx)}
                            onBlur={() => setTimeout(() => {
                              setActiveTermFocusIndex(null);
                              checkAndPromptForTermsSave();
                            }, 200)}
                            placeholder="Add terms"
                            style={{ width: '100%', border: 'none', outline: 'none', fontSize: '0.875rem', backgroundColor: 'transparent', boxSizing: 'border-box', boxShadow: 'none', borderRadius: '0px' }}
                          />
                          {activeTermFocusIndex === idx && (
                            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 1000, backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '6px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', marginTop: '4px', overflow: 'hidden' }}>
                              {[
                                'Please pay within 15 days from the date of invoice, overdue interest @ 14% will be charged on delayed payments.',
                                'Please quote invoice number when remitting funds.'
                              ].map((suggestion, sIdx) => (
                                <div 
                                  key={sIdx}
                                  onMouseDown={() => handleUpdateTermText(idx, suggestion)}
                                  style={{ padding: '0.6rem 0.75rem', cursor: 'pointer', borderBottom: '1px solid #F3F4F6', fontSize: '0.825rem', color: '#4B5563' }}
                                  onMouseEnter={(e) => e.target.style.backgroundColor = '#FFF7ED'}
                                  onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                                >
                                  {suggestion}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexShrink: 0 }}>
                          <button 
                            type="button" 
                            onClick={() => handleDeleteTerm(idx)}
                            style={{ border: 'none', background: 'none', color: '#EF4444', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}
                          >
                            <X size={14} style={{ color: '#9CA3AF' }} />
                          </button>
                          
                          {idx < termsList.length - 1 && (
                            <button 
                              type="button" 
                              onClick={() => handleMoveTermDown(idx)}
                              style={{ border: 'none', background: 'none', color: '#9CA3AF', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}
                            >
                              ↓
                            </button>
                          )}
                          
                          {idx > 0 && (
                            <button 
                              type="button" 
                              onClick={() => handleMoveTermUp(idx)}
                              style={{ border: 'none', background: 'none', color: '#9CA3AF', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}
                            >
                              ↑
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button 
                      type="button" 
                      onClick={handleAddNewTerm}
                      style={{ background: 'none', border: 'none', color: '#FF9F43', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer' }}
                    >
                      <Plus size={14} /> Add New Term
                    </button>
                  </div>
                </div>
              )}

              {showNotesInput && (
                <div style={{ border: '1px solid #E5E7EB', borderRadius: '8px', padding: '1.25rem', backgroundColor: '#F9FAFB', marginTop: '1rem', position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#374151' }}>Additional Notes</span>
                    <button type="button" style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0 }} onClick={() => setShowNotesInput(false)}>
                      <X size={16} style={{ color: '#9CA3AF' }} />
                    </button>
                  </div>
                  <textarea 
                    rows={4}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Enter additional notes..."
                    style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '0.85rem', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                  />
                </div>
              )}

              {showAdditionalInfo && (
                <div style={{ border: '1px solid #E5E7EB', borderRadius: '8px', padding: '1.25rem', backgroundColor: '#F9FAFB', marginTop: '1rem', position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#374151' }}>Additional Info</span>
                    <button type="button" style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0 }} onClick={() => setShowAdditionalInfo(false)}>
                      <X size={16} style={{ color: '#9CA3AF' }} />
                    </button>
                  </div>
                  
                  <button 
                    type="button" 
                    onClick={() => {
                      setCustomFieldLabel('');
                      setCustomFieldValue('');
                      setCustomFieldDefault(false);
                      setIsCustomFieldModalOpen(true);
                    }}
                    style={{ background: 'none', border: 'none', color: '#FF9F43', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer', padding: '0.5rem 0' }}
                  >
                    <Plus size={14} /> Add Custom Fields
                  </button>

                  {additionalFieldsList.length > 0 && (
                    <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {additionalFieldsList.map((f, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.75rem', backgroundColor: 'white', borderRadius: '6px', border: '1px solid #E5E7EB', fontSize: '0.825rem' }}>
                          <div>
                            <span style={{ fontWeight: 600, color: '#4B5563' }}>{f.label}:</span>{' '}
                            <span style={{ color: '#111827' }}>{f.value}</span>
                            {f.isDefault && <span style={{ marginLeft: '8px', fontSize: '0.7rem', color: '#10B981', backgroundColor: '#D1FAE5', padding: '1px 6px', borderRadius: '4px' }}>Default</span>}
                          </div>
                          <button 
                            type="button" 
                            onClick={() => setAdditionalFieldsList(prev => prev.filter((_, idx) => idx !== i))}
                            style={{ border: 'none', background: 'none', color: '#EF4444', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {showAttachments && (
                <div style={{ border: '1px solid #E5E7EB', borderRadius: '8px', padding: '1.25rem', backgroundColor: '#F9FAFB', marginTop: '1rem', position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#374151' }}>Attachments</span>
                    <button type="button" style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0 }} onClick={() => setShowAttachments(false)}>
                      <X size={16} style={{ color: '#9CA3AF' }} />
                    </button>
                  </div>
                  
                  <p style={{ fontSize: '0.75rem', color: '#6B7280', margin: '0.25rem 0 0.75rem 0', lineHeight: '1.25rem' }}>
                    Attachments will not appear as separate documents; instead, they will be available as clickable links within the invoice.<br />
                    The maximum file size is 10 MB.
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
                    {attachmentsList.map((file, i) => (
                      <div key={i} style={{ position: 'relative', width: '64px', height: '64px', border: '1px solid #E5E7EB', borderRadius: '6px', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                        <span style={{ fontSize: '0.7rem', color: '#4B5563', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', padding: '0 4px' }}>{file.name}</span>
                        <button 
                          type="button" 
                          onClick={() => setAttachmentsList(prev => prev.filter((_, idx) => idx !== i))}
                          style={{ position: 'absolute', top: 2, right: 2, backgroundColor: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', fontSize: '9px', lineHeight: '16px' }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}

                    <label style={{ width: '64px', height: '64px', border: '1px dashed #D1D5DB', borderRadius: '6px', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#9CA3AF', fontSize: '1.25rem' }}>
                      <input 
                        type="file" 
                        multiple 
                        onChange={(e) => {
                          if (e.target.files) {
                            const files = Array.from(e.target.files);
                            setAttachmentsList(prev => [...prev, ...files]);
                          }
                        }}
                        style={{ display: 'none' }}
                      />
                      +
                    </label>
                  </div>
                </div>
              )}

            </div>

            {/* Right Column (Total Show Card, Total in words, Signature) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Show Total in PDF Card */}
              <div style={{ border: '1px solid #E5E7EB', borderRadius: '8px', padding: '1.5rem', backgroundColor: '#F9FAFB' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#374151' }}>Show Total in PDF</span>
                  <Eye size={16} style={{ color: '#9CA3AF' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4B5563' }}>
                    <span>Amount</span>
                    <span style={{ fontWeight: 600, color: '#111827' }}>₹{subtotal.toFixed(2)}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#4B5563' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <span>GST</span>
                      <Edit2 size={12} style={{ color: '#FF9F43', cursor: 'pointer' }} onClick={() => setIsConfigureTaxModalOpen(true)} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <span style={{ fontWeight: 600, color: '#111827' }}>₹{totalGst.toFixed(2)}</span>
                      <X size={14} style={{ color: '#9CA3AF', cursor: 'pointer' }} onClick={() => setCartItems(cartItems.map(ci => ({ ...ci, gstRate: 0, cgst: 0, sgst: 0, total: ci.qty * ci.price })))} />
                    </div>
                  </div>

                  {gstType === 'IGST' ? (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6B7280', paddingLeft: '1rem', fontSize: '0.8rem' }}>
                      <span>IGST</span>
                      <span>₹{totalIgst.toFixed(2)}</span>
                    </div>
                  ) : (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6B7280', paddingLeft: '1rem', fontSize: '0.8rem' }}>
                        <span>SGST</span>
                        <span>₹{totalSgst.toFixed(2)}</span>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6B7280', paddingLeft: '1rem', fontSize: '0.8rem' }}>
                        <span>CGST</span>
                        <span>₹{totalCgst.toFixed(2)}</span>
                      </div>
                    </>
                  )}

                  {/* Discount Row (shown if Give Discount on Total is selected) */}
                  {discountOnTotalActive && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ color: '#4B5563', textDecoration: 'underline', textDecorationStyle: 'dotted', fontSize: '0.85rem' }}>Discount</span>
                        <div style={{ display: 'flex', border: '1px solid #E5E7EB', borderRadius: '20px', overflow: 'hidden', backgroundColor: '#F3F4F6', padding: '2px' }}>
                          <button 
                            type="button"
                            onClick={() => setDiscountType('Fixed')}
                            style={{
                              border: 'none',
                              padding: '2px 8px',
                              borderRadius: '15px',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              backgroundColor: discountType === 'Fixed' ? 'white' : 'transparent',
                              color: discountType === 'Fixed' ? '#111827' : '#6B7280',
                              boxShadow: discountType === 'Fixed' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
                            }}
                          >
                            Fixed
                          </button>
                          <button 
                            type="button"
                            onClick={() => setDiscountType('%')}
                            style={{
                              border: 'none',
                              padding: '2px 8px',
                              borderRadius: '15px',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              backgroundColor: discountType === '%' ? 'white' : 'transparent',
                              color: discountType === '%' ? '#111827' : '#6B7280',
                              boxShadow: discountType === '%' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
                            }}
                          >
                            %
                          </button>
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input 
                          type="text" 
                          className="term-list-input"
                          placeholder="0.00"
                          value={discountInputValue}
                          onChange={(e) => setDiscountInputValue(e.target.value)}
                          style={{ width: '80px', border: 'none', borderBottom: '1px solid #D1D5DB', textAlign: 'right', fontSize: '0.85rem', outline: 'none', backgroundColor: 'transparent' }}
                        />
                        <button 
                          type="button" 
                          onClick={() => {
                            setDiscountOnTotalActive(false);
                            setDiscountInputValue('');
                          }}
                          style={{ border: 'none', background: 'none', color: '#9CA3AF', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Trigger Link/Dropdown to Add Discounts (if not active) */}
                  {!discountOnTotalActive && (
                    <div style={{ position: 'relative', marginBottom: '0.5rem' }}>
                      <button 
                        type="button"
                        onClick={() => setShowDiscountsDropdown(!showDiscountsDropdown)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#FF9F43', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
                      >
                        Add Discounts <ChevronDown size={14} />
                      </button>
                      {showDiscountsDropdown && (
                        <div style={{ position: 'absolute', top: '100%', left: 0, zIndex: 1000, backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '6px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginTop: '4px', overflow: 'hidden', minWidth: '180px' }}>
                          <div 
                            onClick={() => {
                              setDiscountOnTotalActive(true);
                              setIsItemWiseDiscountActive(false);
                              setShowDiscountsDropdown(false);
                            }}
                            style={{ padding: '0.6rem 0.75rem', cursor: 'pointer', fontSize: '0.825rem', color: '#4B5563', borderBottom: '1px solid #F3F4F6' }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#F9FAFB'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                          >
                            Give Discount on Total
                          </div>
                          <div 
                            onClick={() => {
                              setIsItemWiseDiscountActive(true);
                              setDiscountOnTotalActive(false);
                              setDiscountInputValue('');
                              setShowDiscountsDropdown(false);
                            }}
                            style={{ padding: '0.6rem 0.75rem', cursor: 'pointer', fontSize: '0.825rem', color: '#4B5563' }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#F9FAFB'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                          >
                            Give Item Wise Discount
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Without Tax Additional Charge Row */}
                  {chargeWithoutTaxActive && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ color: '#4B5563', textDecoration: 'underline', textDecorationStyle: 'dotted', fontSize: '0.85rem' }}>Extra Charges</span>
                        <div style={{ display: 'flex', border: '1px solid #E5E7EB', borderRadius: '20px', overflow: 'hidden', backgroundColor: '#F3F4F6', padding: '2px' }}>
                          <button 
                            type="button"
                            onClick={() => setChargeWithoutTaxUnit('Fixed')}
                            style={{
                              border: 'none',
                              padding: '2px 8px',
                              borderRadius: '15px',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              backgroundColor: chargeWithoutTaxUnit === 'Fixed' ? 'white' : 'transparent',
                              color: chargeWithoutTaxUnit === 'Fixed' ? '#111827' : '#6B7280',
                              boxShadow: chargeWithoutTaxUnit === 'Fixed' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
                            }}
                          >
                            ₹
                          </button>
                          <button 
                            type="button"
                            onClick={() => setChargeWithoutTaxUnit('%')}
                            style={{
                              border: 'none',
                              padding: '2px 8px',
                              borderRadius: '15px',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              backgroundColor: chargeWithoutTaxUnit === '%' ? 'white' : 'transparent',
                              color: chargeWithoutTaxUnit === '%' ? '#111827' : '#6B7280',
                              boxShadow: chargeWithoutTaxUnit === '%' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
                            }}
                          >
                            %
                          </button>
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input 
                          type="text" 
                          className="term-list-input"
                          placeholder="0.00"
                          value={chargeWithoutTaxValue}
                          onChange={(e) => setChargeWithoutTaxValue(e.target.value)}
                          style={{ width: '80px', border: 'none', borderBottom: '1px solid #D1D5DB', textAlign: 'right', fontSize: '0.85rem', outline: 'none', backgroundColor: 'transparent' }}
                        />
                        <button 
                          type="button" 
                          onClick={() => {
                            setChargeWithoutTaxActive(false);
                            setChargeWithoutTaxValue('');
                          }}
                          style={{ border: 'none', background: 'none', color: '#9CA3AF', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* With Tax Additional Charge Row */}
                  {chargeWithTaxActive && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '0.5rem', borderBottom: '1px solid #F3F4F6', paddingBottom: '0.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ position: 'relative', width: '130px' }}>
                          <div 
                            onClick={() => setShowServiceDropdown(!showServiceDropdown)}
                            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #D1D5DB', fontSize: '0.85rem', color: '#4B5563', padding: '2px', cursor: 'pointer' }}
                          >
                            <span>{chargeWithTaxName}</span>
                            <span style={{ fontSize: '0.65rem' }}>{showServiceDropdown ? '▲' : '▼'}</span>
                          </div>
                          {showServiceDropdown && (
                            <div style={{ position: 'absolute', top: '100%', left: 0, zIndex: 1010, backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '6px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginTop: '4px', overflow: 'hidden', minWidth: '160px' }}>
                              {customServices.length === 0 ? (
                                <div style={{ padding: '0.5rem 0.75rem', fontSize: '0.825rem', color: '#9CA3AF', textAlign: 'center' }}>No options</div>
                              ) : (
                                customServices.map((srv, idx) => (
                                  <div 
                                    key={idx}
                                    onClick={() => {
                                      setChargeWithTaxName(srv.name);
                                      setChargeWithTaxValue(srv.amount);
                                      setChargeWithTaxGstRate(srv.gstRate);
                                      setShowServiceDropdown(false);
                                    }}
                                    style={{ padding: '0.5rem 0.75rem', cursor: 'pointer', fontSize: '0.825rem', color: '#4B5563', borderBottom: '1px solid #F3F4F6' }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = '#F9FAFB'}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                                  >
                                    {srv.name}
                                  </div>
                                ))
                              )}
                              <div 
                                onClick={() => {
                                  setIsCreateChargeModalOpen(true);
                                  setNewChargeItemName('');
                                  setNewChargeAmount('0');
                                  setNewChargeHsn('');
                                  setNewChargeGstRate('0');
                                  setNewChargeLedger('Select Sales Ledger');
                                  setShowServiceDropdown(false);
                                }}
                                style={{ padding: '0.5rem 0.75rem', cursor: 'pointer', fontSize: '0.825rem', color: '#7367F0', fontWeight: 600, textAlign: 'center', backgroundColor: '#F9FAFB' }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#EEEDFD'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = '#F9FAFB'}
                              >
                                + Create New
                              </div>
                            </div>
                          )}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontSize: '0.85rem', color: '#111827', fontWeight: 600 }}>₹</span>
                          <input 
                            type="text" 
                            className="term-list-input"
                            placeholder="0.00"
                            value={chargeWithTaxValue}
                            onChange={(e) => setChargeWithTaxValue(e.target.value)}
                            style={{ width: '80px', border: 'none', borderBottom: '1px solid #D1D5DB', textAlign: 'right', fontSize: '0.85rem', outline: 'none', backgroundColor: 'transparent' }}
                          />
                          <button 
                            type="button" 
                            onClick={() => {
                              setChargeWithTaxActive(false);
                              setChargeWithTaxValue('');
                            }}
                            style={{ border: 'none', background: 'none', color: '#9CA3AF', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Dynamic service tax indicator */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: '#6B7280', paddingLeft: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <span>GST ({chargeWithTaxGstRate}%)</span>
                        </div>
                        <span>₹{serviceTax.toFixed(2)}</span>
                      </div>
                    </div>
                  )}

                  {/* Add Additional Charges dropdown link */}
                  <div style={{ position: 'relative', marginBottom: '0.5rem' }}>
                    <button 
                      type="button"
                      onClick={() => setShowChargesDropdown(!showChargesDropdown)}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#FF9F43', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
                    >
                      Add Additional Charges <ChevronDown size={14} />
                    </button>
                    {showChargesDropdown && (
                      <div style={{ position: 'absolute', top: '100%', left: 0, zIndex: 1000, backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '6px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginTop: '4px', overflow: 'hidden', minWidth: '180px' }}>
                        <div 
                          onClick={() => {
                            setChargeWithoutTaxActive(true);
                            setShowChargesDropdown(false);
                          }}
                          style={{ padding: '0.6rem 0.75rem', cursor: 'pointer', fontSize: '0.825rem', color: '#4B5563', borderBottom: '1px solid #F3F4F6' }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#F9FAFB'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                        >
                          Without Tax
                        </div>
                        <div 
                          onClick={() => {
                            setChargeWithTaxActive(true);
                            setShowChargesDropdown(false);
                          }}
                          style={{ padding: '0.6rem 0.75rem', cursor: 'pointer', fontSize: '0.825rem', color: '#4B5563' }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#F9FAFB'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                        >
                          With Tax
                        </div>
                      </div>
                    )}
                  </div>



                  {hasDecimals && (
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', marginBottom: '0.5rem' }}>
                      <button
                        type="button"
                        onClick={() => setRoundMode(roundMode === 'Up' ? 'None' : 'Up')}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          background: 'none',
                          border: 'none',
                          color: roundMode === 'Up' ? '#7367F0' : '#4B5563',
                          fontSize: '0.85rem',
                          fontWeight: roundMode === 'Up' ? 700 : 500,
                          cursor: 'pointer',
                          padding: 0
                        }}
                      >
                        <RotateCw size={14} style={{ color: '#7367F0' }} />
                        Round Up
                      </button>
                      <button
                        type="button"
                        onClick={() => setRoundMode(roundMode === 'Down' ? 'None' : 'Down')}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          background: 'none',
                          border: 'none',
                          color: roundMode === 'Down' ? '#7367F0' : '#4B5563',
                          fontSize: '0.85rem',
                          fontWeight: roundMode === 'Down' ? 700 : 500,
                          cursor: 'pointer',
                          padding: 0
                        }}
                      >
                        <RotateCcw size={14} style={{ color: '#7367F0' }} />
                        Round Down
                      </button>
                    </div>
                  )}

                  <div style={{ borderTop: '2px solid #E5E7EB', margin: '0.5rem 0' }}></div>

                  {roundOff !== 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6B7280', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                      <span>Round Off</span>
                      <span>{roundOff > 0 ? '+' : ''}₹{roundOff.toFixed(2)}</span>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.75rem' }}>
                    <span style={{ color: '#111827', textDecoration: 'underline', textDecorationStyle: 'dotted' }}>Total (INR)</span>
                    <span style={{ color: '#111827', fontSize: '1.125rem' }}>₹{grandTotal.toFixed(2)}</span>
                  </div>

                  {/* Remainder deleted ponytail: removed payment method, amount paid, and balance due since this is a delivery challan */}
                </div>
              </div>

              {/* Show Total in Words Card */}
              <div style={{ border: '1px solid #E5E7EB', borderRadius: '8px', padding: '1.25rem', backgroundColor: '#F9FAFB' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#374151' }}>Show Total In Words</span>
                  <button 
                    type="button"
                    onClick={() => setShowTotalInWords(!showTotalInWords)}
                    style={{
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      padding: 0,
                      color: '#9CA3AF',
                      position: 'relative'
                    }}
                    title="Show in PDF"
                  >
                    {showTotalInWords ? <Eye size={18} style={{ color: '#7367F0' }} /> : <EyeOff size={18} style={{ color: '#9CA3AF' }} />}
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <span style={{ fontSize: '0.75rem', color: '#9CA3AF', fontWeight: 500 }}>Total (in words)</span>
                  <span style={{ fontSize: '0.825rem', color: '#9CA3AF', fontWeight: 400, borderBottom: '1px dashed #D1D5DB', paddingBottom: '4px', display: 'block' }}>
                    {totalInWords}
                  </span>
                </div>
              </div>

              {/* Signature Container */}
              <div 
                onClick={() => setIsSignatureModalOpen(true)}
                style={{ border: '1px dashed #D1D5DB', borderRadius: '8px', padding: '0.85rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backgroundColor: 'white', gap: '0.25rem' }}
              >
                {signature ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem' }}>
                    <img src={signature} alt="Signature" style={{ maxHeight: '40px', objectFit: 'contain' }} />
                    <span style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: 500 }}>{signatureLabel}</span>
                  </div>
                ) : (
                  <span style={{ fontSize: '0.825rem', fontWeight: 600, color: '#FF9F43', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    ✎ Add Signature
                  </span>
                )}
              </div>

            </div>

          </div>

        </form>
      </Card>

      {/* Customer Add Modal */}
      <AddCustomerModal 
        isOpen={isCustomerModalOpen} 
        onClose={() => setIsCustomerModalOpen(false)} 
        customerToEdit={customerToEdit}
        onSuccess={() => {
          getCustomers().then(data => {
            if (data.success) {
              setCustomers(data.data);
              const sorted = [...data.data].sort((a, b) => b._id.localeCompare(a._id));
              const latest = customerToEdit 
                ? data.data.find(c => c._id === customerToEdit._id) 
                : sorted[0];
              if (latest) {
                const fullName = latest.displayName || `${latest.firstName || ''} ${latest.lastName || ''}`.trim() || 'Unnamed Customer';
                setCustomerName(fullName);
                setCustomerEmail(latest.email || '');
                setCustomerPhone(latest.phone || '');
                setGstNumber(latest.gstNumber || '');
                
                const parsedSettings = JSON.parse(localStorage.getItem('pos_settings') || '{}');
                const storeStateFallback = parsedSettings.orgState || 'Madhya Pradesh';
                setPlaceOfSupply(latest.placeOfSupply || latest.state || storeStateFallback);
                
                setSelectedCustomer(latest);
              }
            }
          }).catch(console.error);
        }}
        />

      {/* HSN/SAC Selection Modal */}
      <HsnModal
        isOpen={isHsnModalOpen}
        onClose={() => setIsHsnModalOpen(false)}
        onSelect={(code) => {
          if (hsnActiveRowIndex !== null) {
            updateRowField(hsnActiveRowIndex, 'hsn', code);
          }
        }}
      />

      {/* Configure Due Date Modal */}
      {isDueDateModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          backdropFilter: 'blur(2px)'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            width: '420px',
            maxWidth: '90%',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            overflow: 'hidden',
            position: 'relative'
          }}>
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid #F3F4F6'
            }}>
              <span style={{ fontSize: '1rem', fontWeight: 600, color: '#1F2937' }}>Configure Due Date</span>
              <button 
                type="button" 
                onClick={() => setIsDueDateModalOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: '#000',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <label style={{ fontSize: '0.925rem', fontWeight: 600, color: '#374151' }}>Set Due Date to</label>
                <input 
                  type="number"
                  value={dueDateDays}
                  onChange={(e) => setDueDateDays(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.75rem',
                    borderRadius: '6px',
                    border: '1px solid #D1D5DB',
                    fontSize: '1rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                <span style={{ fontSize: '0.875rem', color: '#4B5563' }}>days after Invoice date</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <input 
                  type="checkbox" 
                  id="saveDueDateFuture"
                  checked={saveDueDateFuture}
                  onChange={(e) => setSaveDueDateFuture(e.target.checked)}
                  style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                />
                <label htmlFor="saveDueDateFuture" style={{ fontSize: '0.875rem', color: '#374151', cursor: 'pointer' }}>Save for future documents</label>
              </div>

              {/* Dynamic Due Date Info Block */}
              <div style={{
                backgroundColor: '#F9FAFB',
                borderRadius: '8px',
                padding: '0.85rem',
                textAlign: 'center',
                fontSize: '0.825rem',
                color: '#6B7280',
                border: '1px solid #F3F4F6'
              }}>
                Your Due date will be {getPreviewDueDate()}
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1rem 1.5rem',
              borderTop: '1px solid #F3F4F6',
              backgroundColor: '#FAFAFA'
            }}>
              <button 
                type="button" 
                onClick={() => setIsDueDateModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#6B7280',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={handleSaveDueDateConfigure}
                style={{
                  backgroundColor: '#FF9F43',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1.5rem',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                }}
              >
                Save
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Add Custom Field Modal */}
      {isCustomFieldModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          backdropFilter: 'blur(2px)'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            width: '440px',
            maxWidth: '90%',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            overflow: 'hidden'
          }}>
            {/* Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid #F3F4F6'
            }}>
              <span style={{ fontSize: '1rem', fontWeight: 600, color: '#1F2937' }}>Add Custom Field</span>
              <button 
                type="button" 
                onClick={() => setIsCustomFieldModalOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: '#000',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Label<span style={{ color: '#EF4444' }}>*</span></label>
                <input 
                  type="text"
                  placeholder="Enter field label"
                  value={customFieldLabel}
                  onChange={(e) => setCustomFieldLabel(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.75rem',
                    borderRadius: '6px',
                    border: '1px solid #D1D5DB',
                    fontSize: '0.875rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Value</label>
                <input 
                  type="text"
                  placeholder="Enter field value"
                  value={customFieldValue}
                  onChange={(e) => setCustomFieldValue(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.75rem',
                    borderRadius: '6px',
                    border: '1px solid #D1D5DB',
                    fontSize: '0.875rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#374151', cursor: 'pointer', marginTop: '0.25rem' }}>
                <input 
                  type="checkbox"
                  checked={customFieldDefault}
                  onChange={(e) => setCustomFieldDefault(e.target.checked)}
                  style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                />
                Set as default value
              </label>
            </div>

            {/* Footer */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1rem 1.5rem',
              borderTop: '1px solid #F3F4F6',
              backgroundColor: '#FAFAFA'
            }}>
              <button 
                type="button" 
                onClick={() => setIsCustomFieldModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#6B7280',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={() => {
                  if (!customFieldLabel.trim()) {
                    alert('Please enter a field label.');
                    return;
                  }
                  setAdditionalFieldsList(prev => [
                    ...prev,
                    { label: customFieldLabel.trim(), value: customFieldValue.trim(), isDefault: customFieldDefault }
                  ]);
                  setIsCustomFieldModalOpen(false);
                }}
                style={{
                  backgroundColor: '#FF9F43',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1.5rem',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                }}
              >
                Save
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Save Terms & Conditions Confirm Modal */}
      {showTermsSaveConfirmModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 11000,
          backdropFilter: 'blur(2px)'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            width: '400px',
            maxWidth: '90%',
            padding: '1.5rem',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            textAlign: 'center'
          }}>
            <h4 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#1F2937', marginBottom: '0.75rem' }}>Save Terms & Conditions</h4>
            <p style={{ fontSize: '0.875rem', color: '#4B5563', marginBottom: '1.5rem', lineHeight: '1.4' }}>
              Do you want to save these updated terms & conditions as default for all future invoices, or apply only to this current invoice?
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button 
                type="button" 
                onClick={() => {
                  localStorage.setItem('defaultTerms', JSON.stringify(termsList));
                  setOriginalTerms([...termsList]);
                  setHasAskedSaveTerms(true);
                  setShowTermsSaveConfirmModal(false);
                }}
                style={{
                  backgroundColor: '#FF9F43',
                  color: 'white',
                  border: 'none',
                  padding: '0.65rem',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  width: '100%'
                }}
              >
                Save for all future invoices
              </button>
              <button 
                type="button" 
                onClick={() => {
                  setOriginalTerms([...termsList]);
                  setHasAskedSaveTerms(true);
                  setShowTermsSaveConfirmModal(false);
                }}
                style={{
                  backgroundColor: 'white',
                  color: '#4B5563',
                  border: '1px solid #D1D5DB',
                  padding: '0.65rem',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  width: '100%'
                }}
              >
                Apply to current invoice only
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Configure Tax Modal */}
      {isConfigureTaxModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          backdropFilter: 'blur(2px)'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            width: '450px',
            maxWidth: '90%',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            overflow: 'hidden'
          }}>
            {/* Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid #F3F4F6'
            }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1F2937' }}>Configure Tax</span>
              <button 
                type="button" 
                onClick={() => setIsConfigureTaxModalOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: '#000',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* 1. Select Tax Type */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1F2937' }}>1. Select Tax Type<span style={{ color: '#EF4444' }}>*</span></label>
                <select 
                  value={taxType}
                  onChange={(e) => setTaxType(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.75rem',
                    borderRadius: '6px',
                    border: '1px solid #D1D5DB',
                    fontSize: '0.875rem',
                    outline: 'none',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="GST (India)">GST (India)</option>
                  <option value="None">None</option>
                </select>
              </div>

              {/* 2. Place of Supply */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1F2937' }}>2. Place of Supply<span style={{ color: '#EF4444' }}>*</span></label>
                <select 
                  value={placeOfSupply}
                  onChange={(e) => setPlaceOfSupply(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.75rem',
                    borderRadius: '6px',
                    border: '1px solid #D1D5DB',
                    fontSize: '0.875rem',
                    outline: 'none',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="">-Select Place of Supply-</option>
                  {State.getStatesOfCountry('IN').map(s => (
                    <option key={s.isoCode} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>

              {/* 3. GST Type */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1F2937' }}>3. GST Type<span style={{ color: '#EF4444' }}>*</span></label>
                <div style={{ display: 'flex', gap: '2rem', marginTop: '0.2rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#374151', cursor: 'pointer' }}>
                    <input 
                      type="radio" 
                      name="gstType" 
                      value="IGST"
                      checked={gstType === 'IGST'}
                      onChange={() => setGstType('IGST')}
                      style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                    IGST
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#374151', cursor: 'pointer' }}>
                    <input 
                      type="radio" 
                      name="gstType" 
                      value="CGST & SGST"
                      checked={gstType === 'CGST & SGST'}
                      onChange={() => setGstType('CGST & SGST')}
                      style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                    CGST & SGST
                  </label>
                </div>
                 <button 
                  type="button"
                  onClick={() => setIsConfigureCessModalOpen(true)}
                  style={{ alignSelf: 'flex-start', background: 'none', border: 'none', color: '#FF9F43', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer', marginTop: '0.25rem' }}
                >
                  <Plus size={14} /> Add Cess
                </button>
              </div>



            </div>

            {/* Footer */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1rem 1.5rem',
              borderTop: '1px solid #F3F4F6',
              backgroundColor: '#FAFAFA'
            }}>
              <button 
                type="button" 
                onClick={() => setIsConfigureTaxModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#6B7280',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={() => setIsConfigureTaxModalOpen(false)}
                style={{
                  backgroundColor: '#FF9F43',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1.5rem',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                }}
              >
                Save Changes
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Configure Additional Cess Modal */}
      {isConfigureCessModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10005,
          backdropFilter: 'blur(2px)'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            width: '450px',
            maxWidth: '90%',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            overflow: 'hidden'
          }}>
            {/* Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid #F3F4F6'
            }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1F2937' }}>Configure Additional Cess</span>
              <button 
                type="button" 
                onClick={() => setIsConfigureCessModalOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: '#000',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* Cess Type */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1F2937' }}>Cess Type</label>
                <select 
                  value={cessType}
                  onChange={(e) => setCessType(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.75rem',
                    borderRadius: '6px',
                    border: '1px solid #D1D5DB',
                    fontSize: '0.875rem',
                    outline: 'none',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="Central Cess">Central Cess</option>
                  <option value="State Cess">State Cess</option>
                </select>
              </div>

              {/* Cess Name */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1F2937' }}>Cess Name</label>
                <input 
                  type="text"
                  placeholder="Cess Name"
                  value={cessName}
                  onChange={(e) => setCessName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.75rem',
                    borderRadius: '6px',
                    border: '1px solid #D1D5DB',
                    fontSize: '0.875rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{
                backgroundColor: '#F9FAFB',
                padding: '0.75rem 1rem',
                borderRadius: '6px',
                fontSize: '0.825rem',
                color: '#6B7280',
                borderLeft: '4px solid #FF9F43'
              }}>
                Additional cess can be levied in addition to GST tax invoice
              </div>

            </div>

            {/* Footer */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1rem 1.5rem',
              borderTop: '1px solid #F3F4F6',
              backgroundColor: '#FAFAFA'
            }}>
              <button 
                type="button" 
                onClick={() => setIsConfigureCessModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#6B7280',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={() => setIsConfigureCessModalOpen(false)}
                style={{
                  backgroundColor: '#FF9F43',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1.5rem',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                }}
              >
                Save
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Create New Additional Charge Modal */}
      {isCreateChargeModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10010,
          backdropFilter: 'blur(2px)'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            width: '450px',
            maxWidth: '90%',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            overflow: 'hidden'
          }}>
            {/* Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid #F3F4F6'
            }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1F2937' }}>Create New Additional Charge</span>
              <button 
                type="button" 
                onClick={() => setIsCreateChargeModalOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: '#000',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* Item Name */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1F2937' }}>Item Name</label>
                <input 
                  type="text"
                  placeholder="Add Additional Charge"
                  value={newChargeItemName}
                  onChange={(e) => setNewChargeItemName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.75rem',
                    borderRadius: '6px',
                    border: '1px solid #D1D5DB',
                    fontSize: '0.875rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Amount */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1F2937' }}>Amount</label>
                <div style={{ display: 'flex', border: '1px solid #D1D5DB', borderRadius: '6px', overflow: 'hidden' }}>
                  <div style={{ backgroundColor: '#F3F4F6', borderRight: '1px solid #D1D5DB', padding: '0.65rem 0.75rem', display: 'flex', alignItems: 'center', fontSize: '0.875rem', color: '#4B5563' }}>
                    ₹
                  </div>
                  <input 
                    type="number"
                    value={newChargeAmount}
                    onChange={(e) => setNewChargeAmount(e.target.value)}
                    style={{
                      flex: 1,
                      border: 'none',
                      padding: '0.65rem 0.75rem',
                      fontSize: '0.875rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              {/* SAC/HSN & GST Rate in grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1F2937' }}>SAC/HSN Code</label>
                  <div style={{ display: 'flex', border: '1px solid #D1D5DB', borderRadius: '6px', overflow: 'hidden' }}>
                    <input 
                      type="text"
                      value={newChargeHsn}
                      onChange={(e) => setNewChargeHsn(e.target.value)}
                      style={{
                        flex: 1,
                        border: 'none',
                        padding: '0.65rem 0.75rem',
                        fontSize: '0.875rem',
                        outline: 'none',
                        boxSizing: 'border-box',
                        width: '100%'
                      }}
                    />
                    <button type="button" style={{ border: 'none', borderLeft: '1px solid #D1D5DB', padding: '0 0.5rem', backgroundColor: '#F3F4F6', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Search size={14} style={{ color: '#4B5563' }} />
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1F2937' }}>GST Rate (%)</label>
                  <input 
                    type="number"
                    value={newChargeGstRate}
                    onChange={(e) => setNewChargeGstRate(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.75rem',
                      borderRadius: '6px',
                      border: '1px solid #D1D5DB',
                      fontSize: '0.875rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              {/* Sales Ledger */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1F2937' }}>
                  Sales Ledger <span style={{ fontSize: '0.8rem' }}>💎</span>
                </label>
                <span style={{ fontSize: '0.75rem', color: '#6B7280', marginBottom: '0.1rem' }}>
                  Select Ledger Account to be updated when charges are applied
                </span>
                <select 
                  value={newChargeLedger}
                  onChange={(e) => setNewChargeLedger(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.75rem',
                    borderRadius: '6px',
                    border: '1px solid #D1D5DB',
                    fontSize: '0.875rem',
                    outline: 'none',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="Select Sales Ledger">Select Sales Ledger</option>
                  <option value="Services Revenue">Services Revenue</option>
                  <option value="Freight & Delivery Revenue">Freight & Delivery Revenue</option>
                  <option value="Installation Income">Installation Income</option>
                </select>
              </div>

            </div>

            {/* Footer */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1rem 1.5rem',
              borderTop: '1px solid #F3F4F6',
              backgroundColor: '#FAFAFA'
            }}>
              <button 
                type="button" 
                onClick={() => setIsCreateChargeModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#6B7280',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={() => {
                  if (newChargeItemName.trim()) {
                    const newSrv = {
                      name: newChargeItemName.trim(),
                      amount: newChargeAmount || '0',
                      gstRate: Number(newChargeGstRate) || 0,
                      hsn: newChargeHsn,
                      ledger: newChargeLedger
                    };
                    setCustomServices([...customServices, newSrv]);
                    setChargeWithTaxName(newSrv.name);
                    setChargeWithTaxValue(newSrv.amount);
                    setChargeWithTaxGstRate(newSrv.gstRate);
                  }
                  setIsCreateChargeModalOpen(false);
                }}
                style={{
                  backgroundColor: '#7367F0',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1.5rem',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                }}
              >
                Save
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Signature Configuration Modal */}
      {isSignatureModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10020,
          backdropFilter: 'blur(2px)'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            width: '450px',
            maxWidth: '90%',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            overflow: 'hidden'
          }}>
            {/* Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid #F3F4F6'
            }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1F2937' }}>Signature</span>
              <button 
                type="button" 
                onClick={() => setIsSignatureModalOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: '#000',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              

              {/* Signature Preview Card */}
              <div style={{
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                height: '180px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#F9FAFB',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {pendingSignatureDataUrl ? (
                  <img src={pendingSignatureDataUrl} alt="Preview" style={{ maxHeight: '140px', objectFit: 'contain' }} />
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: '#9CA3AF' }}>
                    <Upload size={32} style={{ color: '#9CA3AF' }} />
                    <span style={{ fontSize: '0.875rem', color: '#9CA3AF', fontWeight: 500 }}>Upload</span>
                  </div>
                )}
              </div>

              {/* Actions Switcher Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{
                  width: '100%',
                  padding: '0.6rem',
                  borderRadius: '6px',
                  border: '1px dashed #D1D5DB',
                  backgroundColor: 'white',
                  color: '#7367F0',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.35rem',
                  boxSizing: 'border-box'
                }}>
                  <input 
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setPendingSignatureDataUrl(reader.result);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    style={{ display: 'none' }}
                  />
                  <Upload size={16} /> Upload Signature
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setIsDrawPadModalOpen(true);
                    setCanvasDrawingActive(false);
                    setTimeout(() => {
                      const canvas = canvasRef.current;
                      if (canvas) {
                        const ctx = canvas.getContext('2d');
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                      }
                    }, 100);
                  }}
                  style={{
                    width: '100%',
                    padding: '0.6rem',
                    borderRadius: '6px',
                    border: '1px dashed #D1D5DB',
                    backgroundColor: 'white',
                    color: '#7367F0',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.35rem',
                    boxSizing: 'border-box'
                  }}
                >
                  ✎ Use Signature Pad
                </button>
              </div>

              {/* Signature Label */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1F2937' }}>Add signature label</label>
                <div style={{ display: 'flex', border: '1px solid #D1D5DB', borderRadius: '6px', overflow: 'hidden', alignItems: 'center', paddingRight: '8px' }}>
                  <input 
                    type="text"
                    value={pendingSignatureLabel}
                    onChange={(e) => setPendingSignatureLabel(e.target.value)}
                    style={{
                      flex: 1,
                      border: 'none',
                      padding: '0.65rem 0.75rem',
                      fontSize: '0.875rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                  <X 
                    size={16} 
                    style={{ color: '#9CA3AF', cursor: 'pointer' }} 
                    onClick={() => setPendingSignatureLabel('')}
                  />
                </div>
              </div>

            </div>

            {/* Footer */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1rem 1.5rem',
              borderTop: '1px solid #F3F4F6',
              backgroundColor: '#FAFAFA'
            }}>
              <button 
                type="button" 
                onClick={() => setIsSignatureModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#6B7280',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={() => {
                  let finalDataUrl = pendingSignatureDataUrl;
                  if (signatureSourceType === 'draw') {
                    const canvas = canvasRef.current;
                    if (canvas) {
                      finalDataUrl = canvas.toDataURL('image/png');
                    }
                  }
                  if (finalDataUrl) {
                    setPendingSignatureDataUrl(finalDataUrl);
                    setShowSignatureSaveConfirm(true);
                  } else {
                    // Just label changed
                    setSignatureLabel(pendingSignatureLabel);
                    setIsSignatureModalOpen(false);
                  }
                }}
                style={{
                  backgroundColor: '#7367F0',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1.5rem',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                }}
              >
                Save
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Signature Save Confirmation Prompt Modal */}
      {showSignatureSaveConfirm && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10030
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '1.5rem',
            width: '380px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1F2937', marginBottom: '0.75rem' }}>
              Save Signature Settings
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#6B7280', marginBottom: '1.5rem' }}>
              Would you like to save this signature for all future invoices or keep it locally for this invoice only?
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <button 
                type="button" 
                onClick={() => {
                  // Global Save
                  localStorage.setItem('globalSignatureImage', pendingSignatureDataUrl);
                  
                  // Update posSettings signatureName
                  try {
                    const settings = JSON.parse(localStorage.getItem('posSettings') || '{}');
                    settings.signatureName = pendingSignatureLabel;
                    localStorage.setItem('posSettings', JSON.stringify(settings));
                  } catch(e) {}
                  
                  setSignature(pendingSignatureDataUrl);
                  setSignatureLabel(pendingSignatureLabel);
                  
                  setShowSignatureSaveConfirm(false);
                  setIsSignatureModalOpen(false);
                }}
                style={{
                  backgroundColor: '#7367F0',
                  color: 'white',
                  border: 'none',
                  padding: '0.65rem',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  width: '100%'
                }}
              >
                Save for all future invoices
              </button>
              <button 
                type="button" 
                onClick={() => {
                  // Local Save
                  setSignature(pendingSignatureDataUrl);
                  setSignatureLabel(pendingSignatureLabel);
                  
                  setShowSignatureSaveConfirm(false);
                  setIsSignatureModalOpen(false);
                }}
                style={{
                  backgroundColor: 'white',
                  color: '#4B5563',
                  border: '1px solid #D1D5DB',
                  padding: '0.65rem',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  width: '100%'
                }}
              >
                Apply to current invoice only
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Draw Signature Modal popup */}
      {isDrawPadModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10040,
          backdropFilter: 'blur(2px)'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            width: '450px',
            maxWidth: '90%',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden'
          }}>
            {/* Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid #F3F4F6'
            }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1F2937' }}>Draw Signature</span>
              <button 
                type="button" 
                onClick={() => setIsDrawPadModalOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: '#000',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                height: '220px',
                backgroundColor: 'white',
                position: 'relative'
              }}>
                {!canvasDrawingActive && (
                  <div style={{
                    position: 'absolute',
                    top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    color: '#9CA3AF',
                    fontSize: '0.9rem',
                    pointerEvents: 'none',
                    fontWeight: 500
                  }}>
                    Draw your Signature Here
                  </div>
                )}
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={220}
                  onMouseDown={(e) => {
                    setCanvasDrawingActive(true);
                    startDrawing(e);
                  }}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={(e) => {
                    setCanvasDrawingActive(true);
                    startDrawing(e);
                  }}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  style={{ cursor: 'crosshair', width: '100%', height: '100%' }}
                />
              </div>

              {/* Reset button */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button
                  type="button"
                  onClick={() => {
                    clearCanvas();
                    setCanvasDrawingActive(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    color: '#7367F0',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    background: 'none',
                    border: 'none'
                  }}
                >
                  <RotateCw size={14} /> Reset
                </button>
              </div>
            </div>

            {/* Footer */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1rem 1.5rem',
              borderTop: '1px solid #F3F4F6',
              backgroundColor: '#FAFAFA'
            }}>
              <button 
                type="button" 
                onClick={() => setIsDrawPadModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#6B7280',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={() => {
                  const canvas = canvasRef.current;
                  if (canvas && canvasDrawingActive) {
                    const dataUrl = canvas.toDataURL('image/png');
                    setPendingSignatureDataUrl(dataUrl);
                  }
                  setIsDrawPadModalOpen(false);
                }}
                style={{
                  backgroundColor: '#7367F0',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1.5rem',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Upload Signature
              </button>
            </div>

          </div>
        </div>
      )}
      {isColumnsModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            width: '750px',
            maxWidth: '95%',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}>
            {/* Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid #F3F4F6'
            }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#1B2850', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                Customize Columns & Formulas <span role="img" aria-label="lightbulb">💡</span>
              </h3>
              <X 
                size={20} 
                onClick={() => setIsColumnsModalOpen(false)} 
                style={{ color: '#9CA3AF', cursor: 'pointer' }} 
              />
            </div>

            {/* Instruction / Banner */}
            <style>{`
              .custom-modal-scroll {
                scrollbar-width: none;
                -ms-overflow-style: none;
              }
              .custom-modal-scroll::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            <div className="custom-modal-scroll" style={{ padding: '1.25rem 1.5rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#6B7280', lineHeight: '1.4' }}>
                Create/edit columns, customize formulas, make private columns visible to you, but not to clients, make hidden columns (hidden to both you & your clients)
              </p>


              {/* Add New Column */}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={handleAddNewColumn}
                  style={{
                    backgroundColor: 'white',
                    color: '#FF9F43',
                    border: '1px solid #FF9F43',
                    borderRadius: '6px',
                    padding: '0.5rem 1rem',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                >
                  <Plus size={14} /> Add New Column
                </button>
              </div>

              {/* Column Table Headers */}
              <div style={{ display: 'flex', fontSize: '0.85rem', fontWeight: 600, color: '#9CA3AF', padding: '0 0.5rem 0.5rem 3.5rem', borderBottom: '1px solid #F3F4F6', marginBottom: '0.5rem' }}>
                <div style={{ flex: 1 }}>Column Name</div>
                <div style={{ width: '160px', paddingRight: '4.5rem' }}>Column Type</div>
              </div>

              {/* Columns List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
                {tempColumns.map((col, idx) => (
                  <div 
                    key={col.id} 
                    draggable={col.id !== 'item'}
                    onDragStart={(e) => handleDragStart(e, idx)}
                    onDragOver={(e) => handleDragOver(e, idx)}
                    onDragEnd={handleDragEnd}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                      padding: '0.25rem 0',
                      opacity: draggedIndex === idx ? 0.4 : 1,
                      cursor: col.id === 'item' ? 'default' : 'grab',
                      transition: 'opacity 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      {/* Drag Handles */}
                      <div style={{ display: 'flex', alignItems: 'center', color: '#9CA3AF', cursor: 'grab', fontSize: '1.25rem', userSelect: 'none', width: '24px', justifyContent: 'center' }}>
                        {col.id === 'item' ? (
                          <span style={{ color: '#E5E7EB', cursor: 'default' }}></span>
                        ) : (
                          <span>⋮⋮</span>
                        )}
                      </div>

                      {/* Cell Reference Label */}
                      <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#4B5563', width: '30px' }}>
                        {String.fromCharCode(65 + idx)}1
                      </span>

                      {/* Column Name Input */}
                      <div style={{ flex: 1 }}>
                        <input 
                          type="text"
                          value={col.name}
                          onChange={(e) => {
                            const val = e.target.value;
                            setTempColumns(prev => prev.map((c, i) => i === idx ? { ...c, name: val } : c));
                          }}
                          style={{
                            width: '100%',
                            boxSizing: 'border-box',
                            border: '1px solid #E5E7EB',
                            borderRadius: '8px',
                            padding: '0.5rem 0.75rem',
                            fontSize: '0.875rem',
                            outline: 'none',
                            backgroundColor: '#FFFFFF',
                            color: '#1F2937'
                          }}
                        />
                      </div>

                      {/* Column Type Select */}
                      <div style={{ width: '160px', display: 'flex', alignItems: 'center' }}>
                        {col.id === 'amount' ? (
                          <span style={{ fontSize: '0.85rem', color: '#4B5563', whiteSpace: 'nowrap' }}>(Quantity * Rate)</span>
                        ) : col.id === 'cgst' ? (
                          <span style={{ fontSize: '0.85rem', color: '#4B5563', whiteSpace: 'nowrap' }}>(Amount * (GST/2) / 100)</span>
                        ) : col.id === 'sgst' ? (
                          <span style={{ fontSize: '0.85rem', color: '#4B5563', whiteSpace: 'nowrap' }}>(Amount * (GST/2) / 100)</span>
                        ) : col.id === 'total' ? (
                          <span style={{ fontSize: '0.85rem', color: '#4B5563', whiteSpace: 'nowrap' }}>(Amount + Tax)</span>
                        ) : col.id === 'item' ? (
                          <select
                            disabled
                            style={{
                              width: '100%',
                              border: '1px solid #E5E7EB',
                              borderRadius: '8px',
                              padding: '0.5rem 0.75rem',
                              fontSize: '0.825rem',
                              outline: 'none',
                              backgroundColor: '#FFFFFF',
                              color: '#9CA3AF',
                              textTransform: 'uppercase',
                              cursor: 'not-allowed'
                            }}
                          >
                            <option>TEXT</option>
                          </select>
                        ) : (
                          <select
                            value={col.type}
                            onChange={(e) => {
                              const val = e.target.value;
                              setTempColumns(prev => prev.map((c, i) => i === idx ? { ...c, type: val } : c));
                            }}
                            style={{
                              width: '100%',
                              border: '1px solid #E5E7EB',
                              borderRadius: '8px',
                              padding: '0.5rem 0.75rem',
                              fontSize: '0.825rem',
                              outline: 'none',
                              backgroundColor: 'white',
                              color: '#1F2937'
                            }}
                          >
                            <option value="TEXT">TEXT</option>
                            <option value="NUMBER">NUMBER</option>
                            <option value="DATE">DATE</option>
                            <option value="CURRENCY">CURRENCY</option>
                            <option value="FORMULA">FORMULA</option>
                          </select>
                        )}
                      </div>

                      {/* Action Buttons (Eye and Trash) */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {/* Eye visibility wrapper */}
                        <div style={{ width: '30px', display: 'flex', justifyContent: 'center' }}>
                          <button
                            type="button"
                            onClick={() => {
                              setTempColumns(prev => prev.map((c, i) => i === idx ? { ...c, visible: !c.visible } : c));
                            }}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              color: col.visible ? '#FF9F43' : '#9CA3AF',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              padding: 0
                            }}
                          >
                            {col.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                          </button>
                        </div>

                        {/* Trash wrapper */}
                        <div style={{ width: '30px', display: 'flex', justifyContent: 'center' }}>
                          {!['item', 'hsn', 'gstRate', 'quantity', 'rate', 'discount', 'amount', 'cgst', 'sgst', 'total'].includes(col.id) ? (
                            <button
                              type="button"
                              onClick={() => {
                                setTempColumns(prev => prev.filter((_, i) => i !== idx));
                              }}
                              style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: '#EF4444',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: 0
                              }}
                            >
                              <Trash2 size={16} />
                            </button>
                          ) : (
                            <div style={{ width: '16px' }} />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Formula Editor Row if type is FORMULA */}
                    {col.type === 'FORMULA' && (
                      <div style={{ display: 'flex', gap: '1rem', paddingLeft: '4.25rem', alignItems: 'center', marginRight: '4.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden', flex: 1, backgroundColor: 'white' }}>
                          <span style={{ backgroundColor: '#F3F4F6', padding: '0.5rem 0.75rem', borderRight: '1px solid #E5E7EB', fontSize: '0.85rem', fontStyle: 'italic', fontWeight: 'bold' }}>fx</span>
                          <span style={{ padding: '0.5rem 0.5rem', fontSize: '0.85rem', color: '#4B5563' }}>=</span>
                          <input 
                            type="text" 
                            placeholder="e.g. D1 * E1"
                            value={col.formulaValue || ''} 
                            onChange={e => {
                              const val = e.target.value;
                              setTempColumns(prev => prev.map((c, i) => i === idx ? { ...c, formulaValue: val } : c));
                            }} 
                            style={{ flex: 1, border: 'none', outline: 'none', padding: '0.5rem 0.75rem', fontSize: '0.85rem' }} 
                          />
                        </div>
                        <select 
                          value={col.formulaReturnType || 'NUMBER'} 
                          onChange={e => {
                            const val = e.target.value;
                            setTempColumns(prev => prev.map((c, i) => i === idx ? { ...c, formulaReturnType: val } : c));
                          }} 
                          style={{ border: '1px solid #E5E7EB', borderRadius: '8px', padding: '0.5rem 0.75rem', fontSize: '0.825rem', outline: 'none', backgroundColor: 'white', width: '160px', color: '#1F2937' }}
                        >
                          <option value="TEXT">TEXT</option>
                          <option value="NUMBER">NUMBER</option>
                          <option value="DATE">DATE</option>
                          <option value="CURRENCY">CURRENCY</option>
                        </select>
                      </div>
                    )}

                    {/* Checkboxes Row */}
                    {!['item', 'hsn', 'gstRate', 'quantity', 'rate', 'discount', 'amount', 'cgst', 'sgst', 'total'].includes(col.id) && (
                      <div style={{ display: 'flex', gap: '1.5rem', paddingLeft: '4.25rem', flexWrap: 'wrap' }}>
                        {/* Make private? */}
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: '#4B5563', cursor: 'pointer' }}>
                          <input 
                            type="checkbox" 
                            checked={!!col.private} 
                            onChange={(e) => {
                              const val = e.target.checked;
                              setTempColumns(prev => prev.map((c, i) => i === idx ? { ...c, private: val } : c));
                            }} 
                            style={{ accentColor: '#FF9F43' }} 
                          />
                          Make private? 
                          <span title="Private columns are only visible to you while creating this document and will not be displayed on client bills or PDFs." style={{ cursor: 'help', color: '#9CA3AF', fontSize: '0.85rem' }}>ⓘ</span>
                        </label>

                        {/* Summarise total? */}
                        {(col.type === 'NUMBER' || col.type === 'CURRENCY' || (col.type === 'FORMULA' && (col.formulaReturnType === 'NUMBER' || col.formulaReturnType === 'CURRENCY'))) && (
                          <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: '#4B5563', cursor: 'pointer' }}>
                            <input 
                              type="checkbox" 
                              checked={!!col.summariseTotal} 
                              onChange={(e) => {
                                const val = e.target.checked;
                                setTempColumns(prev => prev.map((c, i) => i === idx ? { ...c, summariseTotal: val } : c));
                              }} 
                              style={{ accentColor: '#FF9F43' }} 
                            />
                            Summarise total? 
                            <span title="Check this to sum the values of this column at the bottom of the table." style={{ cursor: 'help', color: '#9CA3AF', fontSize: '0.85rem' }}>ⓘ</span>
                          </label>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

            </div>

            {/* Live Table Header Preview */}
            <div style={{ padding: '0.75rem 1.5rem', borderTop: '1px solid #F3F4F6', backgroundColor: '#FAFAFA' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9CA3AF', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Live Table Header Preview
              </div>
              <div style={{
                display: 'flex',
                backgroundColor: '#FF9F43',
                color: 'white',
                fontSize: '0.85rem',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}>
                <div style={{ padding: '0.65rem 0.75rem', fontWeight: 600, borderRight: '1px solid rgba(255,255,255,0.15)', width: '30px', textAlign: 'center', backgroundColor: 'rgba(0,0,0,0.05)' }}>#</div>
                {tempColumns.filter(c => c.visible).map((col, cIdx) => (
                  <div key={col.id} style={{
                    padding: '0.65rem 0.75rem',
                    fontWeight: 600,
                    flex: col.id === 'item' ? 2 : 1,
                    borderRight: cIdx === tempColumns.filter(c => c.visible).length - 1 ? 'none' : '1px solid rgba(255,255,255,0.15)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    minWidth: '50px'
                  }}>
                    {col.name || 'Column'}
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Actions */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '1rem 1.5rem',
              borderTop: '1px solid #F3F4F6',
              backgroundColor: '#FAFAFA',
              borderRadius: '0 0 12px 12px'
            }}>
              <div>
                <button
                  type="button"
                  onClick={() => setIsColumnsModalOpen(false)}
                  style={{
                    backgroundColor: 'white',
                    color: '#4B5563',
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    padding: '0.5rem 1rem',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={resetColumnsToDefault}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#4B5563',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    padding: '0.5rem'
                  }}
                >
                  Reset to Default
                </button>
                <button
                  type="button"
                  onClick={() => {
                    saveColumnSettings('delivery-challan', tempColumns)
                      .then(settings => {
                        setColumns(settings.columns);
                        setIsColumnsModalOpen(false);
                      })
                      .catch(err => {
                        console.error(err);
                        alert("Failed to save column settings to database: " + err.message);
                      });
                  }}
                  style={{
                    backgroundColor: '#FF9F43',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1.5rem',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Save Changes
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default CreateDeliveryChallan;
