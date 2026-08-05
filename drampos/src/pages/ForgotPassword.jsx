import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../api/endpoints';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: request OTP, 2: verify OTP & reset password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send OTP');
      }

      setSuccess('A 6-digit verification code has been sent to your email.');
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password');
      }

      setSuccess('Your password has been reset successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/signin');
      }, 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
            
            <h1 style={{fontSize: '1.5rem', fontWeight: 700, color: '#1B2850', marginBottom: '0.5rem'}}>
              {step === 1 ? 'Forgot password?' : 'Reset Password'}
            </h1>
            <p style={{color: '#6B7280', fontSize: '0.875rem', marginBottom: '2rem'}}>
              {step === 1 
                ? "Enter your registered email address below, and we'll send you an OTP to reset your password." 
                : "Enter the 6-digit OTP code sent to your email and your new password."}
            </p>

            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: '#FEE2E2', border: '1px solid #FCA5A5', color: '#991B1B', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: '#ECFDF5', border: '1px solid #6EE7B7', color: '#065F46', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
                <span>{success}</span>
              </div>
            )}

            {step === 1 ? (
              <form onSubmit={handleRequestOTP} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                <div>
                  <label style={{display: 'block', fontSize: '0.875rem', color: '#1B2850', marginBottom: '0.5rem'}}>Email <span style={{color: '#EA5455'}}>*</span></label>
                  <div style={{position: 'relative'}}>
                     <input 
                       type="email" 
                       value={email}
                       onChange={(e) => setEmail(e.target.value)}
                       required
                       style={{width: '100%', padding: '0.75rem 1rem', paddingRight: '2.5rem', borderRadius: '6px', border: '1px solid #E5E7EB', boxSizing: 'border-box', outline: 'none'}} 
                     />
                     <svg style={{position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF'}} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  </div>
                </div>

                <button type="submit" disabled={loading} style={{width: '100%', padding: '0.75rem', backgroundColor: '#FF9F43', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 600, marginTop: '0.5rem', cursor: 'pointer', opacity: loading ? 0.7 : 1}}>
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                <div>
                  <label style={{display: 'block', fontSize: '0.875rem', color: '#1B2850', marginBottom: '0.5rem'}}>Enter OTP <span style={{color: '#EA5455'}}>*</span></label>
                  <input 
                    type="text" 
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    maxLength="6"
                    placeholder="Enter 6-digit OTP"
                    style={{width: '100%', padding: '0.75rem 1rem', borderRadius: '6px', border: '1px solid #E5E7EB', boxSizing: 'border-box', outline: 'none'}} 
                  />
                </div>

                <div>
                  <label style={{display: 'block', fontSize: '0.875rem', color: '#1B2850', marginBottom: '0.5rem'}}>New Password <span style={{color: '#EA5455'}}>*</span></label>
                  <input 
                    type="password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="Enter new password"
                    style={{width: '100%', padding: '0.75rem 1rem', borderRadius: '6px', border: '1px solid #E5E7EB', boxSizing: 'border-box', outline: 'none'}} 
                  />
                </div>

                <button type="submit" disabled={loading} style={{width: '100%', padding: '0.75rem', backgroundColor: '#FF9F43', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 600, marginTop: '0.5rem', cursor: 'pointer', opacity: loading ? 0.7 : 1}}>
                  {loading ? 'Resetting Password...' : 'Reset Password'}
                </button>
              </form>
            )}

            <div style={{textAlign: 'center', fontSize: '0.875rem', color: '#6B7280', marginTop: '1.5rem'}}>
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
         </div>
      </div>
      <div style={{flex: 1, backgroundImage: 'url(https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
      </div>
    </div>
  );
};

export default ForgotPassword;
