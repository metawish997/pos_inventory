import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { API_BASE_URL } from '../../api/endpoints';

const HsnModal = ({ isOpen, onClose, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [hsnList, setHsnList] = useState([]);
  const [loading, setLoading] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
      fetchHsnCodes('');
    }
  }, [isOpen]);

  const fetchHsnCodes = (query) => {
    setLoading(true);
    fetch(`${API_BASE_URL}/hsn-sac/search?query=${encodeURIComponent(query)}`)
      .then(res => res.json())
      .then(data => {
        setHsnList(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching HSN/SAC codes:', err);
        setLoading(false);
      });
  };

  // Debounce search input fetches
  useEffect(() => {
    if (!isOpen) return;
    const delayDebounce = setTimeout(() => {
      fetchHsnCodes(searchTerm);
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

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
          flexDirection: 'column',
          maxHeight: '80vh'
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
              onChange={(e) => setSearchTerm(e.target.value)}
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
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #E5E7EB', color: '#4B5563', textAlign: 'left', fontWeight: 600 }}>
                <th style={{ padding: '0.5rem 0.75rem', width: '120px' }}>HSN Code</th>
                <th style={{ padding: '0.5rem 0.75rem', width: '80px' }}>Type</th>
                <th style={{ padding: '0.5rem 0.75rem' }}>Description</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="3" style={{ padding: '2rem', textAlign: 'center', color: '#6B7280' }}>Searching database...</td>
                </tr>
              ) : hsnList.map((h, i) => (
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
                  <td style={{ padding: '0.75rem', color: '#6B7280' }}>
                    <span style={{ fontSize: '0.75rem', padding: '2px 6px', borderRadius: '4px', backgroundColor: h.type === 'SAC' ? '#E0F2FE' : '#FEE2E2', color: h.type === 'SAC' ? '#0369A1' : '#B91C1C', fontWeight: 600 }}>
                      {h.type}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem', color: '#4B5563' }}>{h.description}</td>
                </tr>
              ))}
              {!loading && hsnList.length === 0 && (
                <tr>
                  <td colSpan="3" style={{ padding: '2rem', textAlign: 'center', color: '#9CA3AF' }}>No HSN codes match your search</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default HsnModal;
