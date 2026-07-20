import React from 'react';
import { Link } from 'react-router-dom';

const Error404 = () => {
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', width: '100vw', fontFamily: '"Inter", sans-serif', backgroundColor: '#F8F9FA'}}>
      <div style={{position: 'relative', width: '100%', maxWidth: '600px', display: 'flex', justifyContent: 'center', marginBottom: '2rem'}}>
        {/* Placeholder for the illustration */}
        <div style={{width: '400px', height: '300px', backgroundColor: '#E5E7EB', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF', fontSize: '1.5rem', fontWeight: 700}}>
           404 Illustration
        </div>
        
        {/* Floating ERROR 404 block */}
        <div style={{position: 'absolute', top: '10%', left: '10%', transform: 'rotate(-5deg)', border: '4px solid #FF9F43', padding: '1rem', backgroundColor: 'rgba(255,255,255,0.9)'}}>
           <h1 style={{margin: 0, fontSize: '3rem', color: '#FF9F43', fontWeight: 800, lineHeight: 1}}>ERROR<br/>404</h1>
        </div>
      </div>
      
      <h2 style={{fontSize: '1.5rem', fontWeight: 700, color: '#1B2850', marginBottom: '0.5rem'}}>Oops, something went wrong</h2>
      <p style={{color: '#6B7280', fontSize: '0.875rem', marginBottom: '2rem'}}>Error 404 Page not found. Sorry the page you looking for doesn't exist or has been moved</p>
      
      <Link to="/" style={{padding: '0.75rem 1.5rem', backgroundColor: '#FF9F43', color: 'white', textDecoration: 'none', borderRadius: '6px', fontWeight: 600}}>
        Back to Dashboard
      </Link>
    </div>
  );
};

export default Error404;
