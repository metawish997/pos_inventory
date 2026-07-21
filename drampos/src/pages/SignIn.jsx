import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../api/endpoints';

const SignIn = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const url = isLogin 
      ? `${API_BASE_URL}/auth/login` 
      : `${API_BASE_URL}/auth/register`;
    
    const body = isLogin 
      ? { email, password } 
      : { firstName, lastName, email, phone, password };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      // Store token and user
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Redirect to Dashboard
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{display: 'flex', height: '100vh', width: '100vw', fontFamily: '"Inter", sans-serif'}}>
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', backgroundColor: '#F8F9FA', overflowY: 'auto'}}>
         <div style={{width: '100%', maxWidth: '400px'}}>
            <div style={{display: 'flex', justifyContent: 'center', marginBottom: '2rem'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                <div style={{width: '32px', height: '32px', backgroundColor: '#1B2850', borderRadius: '8px', position: 'relative'}}>
                   <div style={{position: 'absolute', top: '-6px', left: '6px', width: '20px', height: '10px', borderTopLeftRadius: '10px', borderTopRightRadius: '10px', border: '3px solid #FF9F43', borderBottom: 'none'}}></div>
                </div>
                <span style={{fontSize: '1.5rem', fontWeight: 700, color: '#1B2850'}}>Eronix<span style={{color: '#FF9F43'}}>POS</span></span>
              </div>
            </div>
            
            <h1 style={{fontSize: '1.5rem', fontWeight: 700, color: '#1B2850', marginBottom: '0.5rem'}}>
              {isLogin ? 'Sign In' : 'Register'}
            </h1>
            <p style={{color: '#6B7280', fontSize: '0.875rem', marginBottom: '1.5rem'}}>
              {isLogin ? 'Access the Eronixpos panel using your email and passcode.' : 'Create a new account to access the panel.'}
            </p>

            {error && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', backgroundColor: '#FEE2E2', border: '1px solid #FCA5A5', color: '#991B1B', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.875rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px' }}>
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <strong style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{isLogin ? 'Login Failed' : 'Registration Error'}</strong>
                  <span style={{ lineHeight: '1.4' }}>{error}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              
              {!isLogin && (
                <div style={{display: 'flex', gap: '1rem'}}>
                  <div style={{flex: 1}}>
                    <label style={{display: 'block', fontSize: '0.875rem', color: '#1B2850', marginBottom: '0.5rem'}}>First Name <span style={{color: '#EA5455'}}>*</span></label>
                    <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} required={!isLogin} style={{width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #E5E7EB', boxSizing: 'border-box', outline: 'none'}} />
                  </div>
                  <div style={{flex: 1}}>
                    <label style={{display: 'block', fontSize: '0.875rem', color: '#1B2850', marginBottom: '0.5rem'}}>Last Name <span style={{color: '#EA5455'}}>*</span></label>
                    <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} required={!isLogin} style={{width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #E5E7EB', boxSizing: 'border-box', outline: 'none'}} />
                  </div>
                </div>
              )}

              <div>
                <label style={{display: 'block', fontSize: '0.875rem', color: '#1B2850', marginBottom: '0.5rem'}}>Email <span style={{color: '#EA5455'}}>*</span></label>
                <div style={{position: 'relative'}}>
                   <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{width: '100%', padding: '0.75rem 1rem', paddingRight: '2.5rem', borderRadius: '6px', border: '1px solid #E5E7EB', boxSizing: 'border-box', outline: 'none'}} />
                </div>
              </div>

              {!isLogin && (
                <div>
                  <label style={{display: 'block', fontSize: '0.875rem', color: '#1B2850', marginBottom: '0.5rem'}}>Phone <span style={{color: '#EA5455'}}>*</span></label>
                  <input type="text" value={phone} onChange={e => setPhone(e.target.value)} required={!isLogin} style={{width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #E5E7EB', boxSizing: 'border-box', outline: 'none'}} />
                </div>
              )}

              <div>
                <label style={{display: 'block', fontSize: '0.875rem', color: '#1B2850', marginBottom: '0.5rem'}}>Password <span style={{color: '#EA5455'}}>*</span></label>
                <div style={{position: 'relative'}}>
                   <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{width: '100%', padding: '0.75rem 1rem', paddingRight: '2.5rem', borderRadius: '6px', border: '1px solid #E5E7EB', boxSizing: 'border-box', outline: 'none'}} />
                </div>
              </div>

              {isLogin && (
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                   <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#6B7280'}}>
                     <input type="checkbox" style={{width: '16px', height: '16px', borderRadius: '4px', border: '1px solid #E5E7EB'}} />
                     Remember me
                   </label>
                   <Link to="/forgot-password" style={{color: '#FF9F43', fontSize: '0.875rem', textDecoration: 'none'}}>Forgot Password?</Link>
                </div>
              )}

              <button type="submit" disabled={loading} style={{width: '100%', padding: '0.75rem', backgroundColor: '#FF9F43', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 600, marginTop: '0.5rem', cursor: 'pointer', opacity: loading ? 0.7 : 1}}>
                {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Register')}
              </button>

              <div style={{textAlign: 'center', fontSize: '0.875rem', color: '#6B7280', marginTop: '1rem'}}>
                 {isLogin ? 'New on our platform? ' : 'Already have an account? '} 
                 <button type="button" onClick={() => { setIsLogin(!isLogin); setError(''); }} style={{color: '#1B2850', fontWeight: 600, textDecoration: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: 0}}>
                   {isLogin ? 'Create an account' : 'Sign in instead'}
                 </button>
              </div>

              <div style={{textAlign: 'center', fontSize: '0.75rem', color: '#9CA3AF', marginTop: '2rem'}}>
                 Copyright © 2026 EronixPOS. Developed & Maintained by <a href="https://www.metawish.ai" target="_blank" rel="noopener noreferrer" style={{ color: '#FF9F43', fontWeight: 600, textDecoration: 'none' }}>Metawish</a>
              </div>
            </form>
         </div>
      </div>
      <div style={{flex: 1, backgroundImage: 'url(https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
      </div>
    </div>
  );
};

export default SignIn;
