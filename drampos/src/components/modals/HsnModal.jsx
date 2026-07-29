import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';

const HSN_SAC_LIST = [
  { code: '01', description: 'LIVE ANIMALS' },
  { code: '010121', description: 'PURE-BRED BREEDING ANIMALS' },
  { code: '01013090', description: 'OTHER' },
  { code: '0102', description: 'LIVE BOVINE ANIMALS.' },
  { code: '01021010', description: 'LIVE BOVINE ANIMALS - BULLS - PURE-BRED BREEDING ANIMALS' },
  { code: '01023100', description: 'Pure-bred breeding animals' },
  { code: '01029020', description: 'LIVE BOVINE ANIMALS - OTHER - BUFFALOES, ADULT AND CALVES' },
  { code: '010613', description: 'CAMELS AND OTHER CAMELIDS (CAMELIDAE)' },
  { code: '010614', description: 'RABBITS AND HARES' },
  { code: '01063900', description: 'OTHER BIRDS' },
  { code: '84713010', description: 'PERSONAL COMPUTER (LAPTOP, NOTEBOOK)' },
  { code: '85171300', description: 'SMARTPHONES / MOBILE PHONES' },
  { code: '998311', description: 'MANAGEMENT CONSULTING SERVICES' },
  { code: '998313', description: 'IT DESIGN AND DEVELOPMENT SERVICES' },
  { code: '998713', description: 'COMPUTER AND PERIPHERAL MAINTENANCE & REPAIR' }
];

const HsnModal = ({ isOpen, onClose, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
      setCurrentPage(1);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredHsn = HSN_SAC_LIST.filter(h => 
    h.code.includes(searchTerm) || 
    h.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredHsn.length / itemsPerPage);
  const currentItems = filteredHsn.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.4)',
      backdropFilter: 'blur(4px)',
      zIndex: 99999,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem'
    }}>
      <div 
        ref={modalRef}
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          width: '100%',
          maxWidth: '680px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid #F3F4F6',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#111827', textTransform: 'uppercase', letterSpacing: '0.025em' }}>HSN/SAC List</h3>
            <div style={{ height: '3px', width: '40px', backgroundColor: '#FF9F43', marginTop: '0.35rem', borderRadius: '2px' }} />
            <span style={{ fontSize: '0.775rem', color: '#6B7280', display: 'block', marginTop: '0.25rem' }}>Select HSN/SAC to apply</span>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.25rem',
              color: '#9CA3AF',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4px',
              borderRadius: '50%'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Search input container */}
        <div style={{ padding: '1.25rem 1.5rem', backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', display: 'flex', alignItems: 'center' }}>
              <Search size={16} />
            </span>
            <input 
              type="text" 
              placeholder="Search HSN code or description..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                width: '100%',
                padding: '0.65rem 1rem 0.65rem 2.25rem',
                border: '1px solid #D1D5DB',
                borderRadius: '6px',
                fontSize: '0.875rem',
                outline: 'none',
                boxSizing: 'border-box',
                backgroundColor: 'white'
              }}
            />
          </div>
        </div>

        {/* Data list Table */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.775rem', color: '#6B7280', marginBottom: '0.75rem' }}>
            <span>Showing <b>{filteredHsn.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</b> to <b>{Math.min(filteredHsn.length, currentPage * itemsPerPage)}</b> of <b>{filteredHsn.length}</b> items</span>
          </div>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #E5E7EB', color: '#4B5563', textAlign: 'left', fontWeight: 600 }}>
                <th style={{ padding: '0.5rem 0.75rem' }}>HSN Code ↑</th>
                <th style={{ padding: '0.5rem 0.75rem' }}>Description</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((h, i) => (
                <tr 
                  key={i} 
                  onClick={() => {
                    onSelect(h.code);
                    onClose();
                  }}
                  style={{ borderBottom: '1px solid #F3F4F6', cursor: 'pointer', transition: 'background-color 0.15s' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FFF7ED'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td style={{ padding: '0.75rem', fontWeight: 600, color: '#111827' }}>{h.code}</td>
                  <td style={{ padding: '0.75rem', color: '#4B5563' }}>{h.description}</td>
                </tr>
              ))}
              {currentItems.length === 0 && (
                <tr>
                  <td colSpan="2" style={{ padding: '2rem', textAlign: 'center', color: '#9CA3AF' }}>No HSN codes match your search</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0.25rem',
            padding: '1rem 1.5rem',
            borderTop: '1px solid #F3F4F6',
            backgroundColor: '#FAFAFA'
          }}>
            <button 
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              style={{ border: '1px solid #D1D5DB', backgroundColor: 'white', borderRadius: '4px', padding: '0.25rem 0.5rem', fontSize: '0.8rem', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', color: currentPage === 1 ? '#9CA3AF' : '#4B5563' }}
            >
              &lt;
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                type="button"
                onClick={() => setCurrentPage(p)}
                style={{
                  border: '1px solid #D1D5DB',
                  borderRadius: '4px',
                  padding: '0.25rem 0.65rem',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  backgroundColor: currentPage === p ? '#FF9F43' : 'white',
                  color: currentPage === p ? 'white' : '#4B5563',
                  fontWeight: currentPage === p ? 'bold' : 'normal'
                }}
              >
                {p}
              </button>
            ))}
            <button 
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              style={{ border: '1px solid #D1D5DB', backgroundColor: 'white', borderRadius: '4px', padding: '0.25rem 0.5rem', fontSize: '0.8rem', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', color: currentPage === totalPages ? '#9CA3AF' : '#4B5563' }}
            >
              &gt;
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default HsnModal;
