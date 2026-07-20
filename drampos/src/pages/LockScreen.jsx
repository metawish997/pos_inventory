import React from 'react';
import { Link } from 'react-router-dom';

const LockScreen = () => {
  return (
    <div style={{display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', fontFamily: '"Inter", sans-serif', backgroundColor: '#FEF8F4', position: 'relative', overflow: 'hidden'}}>
      
      {/* Abstract Background Shapes */}
      <div style={{position: 'absolute', top: '20%', right: '-10%', width: '500px', height: '200px', backgroundColor: '#FFE4D6', transform: 'rotate(-10deg)', zIndex: 0}}></div>
      <div style={{position: 'absolute', bottom: '20%', left: '-10%', width: '600px', height: '150px', backgroundColor: '#FF9F43', transform: 'rotate(-5deg)', zIndex: 0}}></div>
      <div style={{position: 'absolute', top: '-50px', left: '-50px', width: '200px', height: '200px', backgroundColor: '#F8F9FA', borderRadius: '50%', zIndex: 0}}></div>

      <div style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 1}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem'}}>
          <div style={{width: '32px', height: '32px', backgroundColor: '#1B2850', borderRadius: '8px', position: 'relative'}}>
             <div style={{position: 'absolute', top: '-6px', left: '6px', width: '20px', height: '10px', borderTopLeftRadius: '10px', borderTopRightRadius: '10px', border: '3px solid #FF9F43', borderBottom: 'none'}}></div>
          </div>
          <span style={{fontSize: '1.5rem', fontWeight: 700, color: '#1B2850'}}>dreams<span style={{color: '#FF9F43'}}>POS</span></span>
        </div>

        <div style={{backgroundColor: 'white', padding: '3rem', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxSizing: 'border-box'}}>
          <div style={{fontSize: '0.875rem', color: '#6B7280', marginBottom: '1rem'}}>Welcome back!</div>
          
          <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100" alt="John Smilga" style={{width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', marginBottom: '1rem', border: '4px solid #F3F4F6'}} />
          
          <h2 style={{fontSize: '1.25rem', fontWeight: 700, color: '#1B2850', margin: '0 0 1.5rem 0'}}>John Smilga</h2>

          <div style={{width: '100%', position: 'relative', marginBottom: '1.5rem'}}>
             <input type="password" placeholder="Enter your password" style={{width: '100%', padding: '0.75rem 1rem', paddingRight: '2.5rem', borderRadius: '6px', border: '1px solid #E5E7EB', boxSizing: 'border-box', outline: 'none', textAlign: 'center'}} />
             <svg style={{position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF'}} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle><line x1="1" y1="1" x2="23" y2="23"></line></svg>
          </div>

          <button style={{width: '100%', padding: '0.75rem', backgroundColor: '#FF9F43', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer'}}>
            Log In
          </button>
        </div>

        <div style={{display: 'flex', gap: '1.5rem', marginTop: '2rem', fontSize: '0.875rem', color: '#6B7280'}}>
           <Link to="#" style={{color: '#6B7280', textDecoration: 'none'}}>Terms & Condition</Link>
           <Link to="#" style={{color: '#6B7280', textDecoration: 'none'}}>Privacy</Link>
           <Link to="#" style={{color: '#6B7280', textDecoration: 'none'}}>Help</Link>
           <div style={{display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer'}}>
              English
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
           </div>
        </div>
        <div style={{marginTop: '1rem', fontSize: '0.75rem', color: '#9CA3AF'}}>
           Copyright © 2024 DreamsPOS. All rights reserved
        </div>
      </div>
    </div>
  );
};

export default LockScreen;
