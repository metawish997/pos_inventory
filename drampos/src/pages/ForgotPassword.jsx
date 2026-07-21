import React from 'react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  return (
    <div style={{display: 'flex', height: '100vh', width: '100vw', fontFamily: '"Inter", sans-serif'}}>
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', backgroundColor: '#F8F9FA'}}>
         <div style={{width: '100%', maxWidth: '400px'}}>
            <div style={{display: 'flex', justifyContent: 'center', marginBottom: '2rem'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                <div style={{width: '32px', height: '32px', backgroundColor: '#1B2850', borderRadius: '8px', position: 'relative'}}>
                   <div style={{position: 'absolute', top: '-6px', left: '6px', width: '20px', height: '10px', borderTopLeftRadius: '10px', borderTopRightRadius: '10px', border: '3px solid #FF9F43', borderBottom: 'none'}}></div>
                </div>
                <span style={{fontSize: '1.5rem', fontWeight: 700, color: '#1B2850'}}>Eronix<span style={{color: '#FF9F43'}}>POS</span></span>
              </div>
            </div>
            
            <h1 style={{fontSize: '1.5rem', fontWeight: 700, color: '#1B2850', marginBottom: '0.5rem'}}>Forgot password?</h1>
            <p style={{color: '#6B7280', fontSize: '0.875rem', marginBottom: '2rem'}}>If you forgot your password, well, then we'll email you instructions to reset your password.</p>

            <form style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              <div>
                <label style={{display: 'block', fontSize: '0.875rem', color: '#1B2850', marginBottom: '0.5rem'}}>Email <span style={{color: '#EA5455'}}>*</span></label>
                <div style={{position: 'relative'}}>
                   <input type="email" style={{width: '100%', padding: '0.75rem 1rem', paddingRight: '2.5rem', borderRadius: '6px', border: '1px solid #E5E7EB', boxSizing: 'border-box', outline: 'none'}} />
                   <svg style={{position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF'}} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                </div>
              </div>

              <button style={{width: '100%', padding: '0.75rem', backgroundColor: 'transparent', color: '#FF9F43', border: '1px solid #FF9F43', borderRadius: '6px', fontWeight: 600, marginTop: '0.5rem', cursor: 'pointer'}}>
                Sign Up
              </button>

              <div style={{textAlign: 'center', fontSize: '0.875rem', color: '#6B7280', marginTop: '1rem'}}>
                 Return to <Link to="/signin" style={{color: '#1B2850', fontWeight: 600, textDecoration: 'none'}}>login</Link>
              </div>

              <div style={{display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.5rem 0'}}>
                <div style={{flex: 1, height: '1px', backgroundColor: '#E5E7EB'}}></div>
                <span style={{fontSize: '0.875rem', color: '#9CA3AF'}}>OR</span>
                <div style={{flex: 1, height: '1px', backgroundColor: '#E5E7EB'}}></div>
              </div>

              <div style={{textAlign: 'center', fontSize: '0.75rem', color: '#6B7280', marginTop: '1rem'}}>
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

export default ForgotPassword;
