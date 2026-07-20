import React from 'react';
import { Link } from 'react-router-dom';

const Error500 = () => {
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', width: '100vw', fontFamily: '"Inter", sans-serif', backgroundColor: '#F8F9FA'}}>
      <div style={{position: 'relative', width: '100%', maxWidth: '600px', display: 'flex', justifyContent: 'center', marginBottom: '2rem'}}>
        {/* Placeholder for the illustration */}
        <div style={{width: '400px', height: '300px', backgroundColor: '#E5E7EB', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF', fontSize: '1.5rem', fontWeight: 700}}>
           500 Illustration
        </div>
        
        {/* Floating 500 block */}
        <div style={{position: 'absolute', top: '30%', right: '10%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
           <h1 style={{margin: 0, fontSize: '4rem', color: '#1B2850', fontWeight: 800, lineHeight: 1}}>500</h1>
           <div style={{backgroundColor: '#FF9F43', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem', fontWeight: 600, marginTop: '0.25rem'}}>Internal Server Error</div>
        </div>
      </div>
      
      <h2 style={{fontSize: '1.5rem', fontWeight: 700, color: '#1B2850', marginBottom: '0.5rem'}}>Oops, something went wrong</h2>
      <p style={{color: '#6B7280', fontSize: '0.875rem', marginBottom: '2rem'}}>Server Error 500. We apologise and are fixing the problem Please try again at a later stage</p>
      
      <Link to="/" style={{padding: '0.75rem 1.5rem', backgroundColor: '#FF9F43', color: 'white', textDecoration: 'none', borderRadius: '6px', fontWeight: 600}}>
        Back to Dashboard
      </Link>
    </div>
  );
};

export default Error500;
