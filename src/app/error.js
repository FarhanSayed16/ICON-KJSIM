'use client';

import { useEffect } from 'react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service if needed
    console.error('Global Application Error:', error);
  }, [error]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-dark)',
      color: 'var(--text-white)',
      padding: 'var(--space-2xl) var(--space-xl)',
      textAlign: 'center'
    }}>
      <HiOutlineExclamationCircle size={80} style={{ color: 'var(--crimson)', marginBottom: 'var(--space-lg)' }} />
      <h1 style={{ 
        fontFamily: 'var(--font-outfit), sans-serif', 
        fontSize: '2.5rem', 
        lineHeight: 1.2,
        marginBottom: 'var(--space-md)' 
      }}>A Critical Failure Occurred</h1>
      
      <p style={{ maxWidth: '400px', marginBottom: 'var(--space-2xl)', color: 'rgba(255,255,255,0.7)' }}>
        Our systems encountered an unexpected error. Please try refreshing the page or navigating back home.
      </p>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <button
          onClick={() => reset()}
          className="btn-primary"
        >
          Try Again
        </button>
        <button
          onClick={() => window.location.href = '/'}
          className="btn-secondary"
        >
          Return Home
        </button>
      </div>
    </div>
  );
}
