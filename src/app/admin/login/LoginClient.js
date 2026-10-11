'use client';

import { useState } from 'react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { loginAdmin } from '@/app/actions/adminAuth';
import styles from './LoginClient.module.css';

export default function LoginClient() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAction = async (formData) => {
    setIsSubmitting(true);
    
    try {
      const result = await loginAdmin(null, formData);
      
      if (result.success) {
        toast.success('Access Granted');
        // Full navigation so proxy + cookie are applied cleanly
        window.location.assign('/admin');
      } else {
        toast.error(result.message || 'Invalid credentials');
        setIsSubmitting(false);
      }
    } catch (error) {
      toast.error('An error occurred');
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <Image 
            src="/images/icon_logo.png" 
            alt="ICON 2026" 
            width={120} 
            height={80} 
            style={{ width: 'auto', height: 'auto' }}
          />
        </div>
        
        <h1 className={styles.title}>Admin Portal</h1>
        <p className={styles.subtitle}>Enter the master password to access the dashboard</p>

        <form
          className={styles.form}
          onSubmit={async (e) => {
            e.preventDefault();
            await handleAction(new FormData(e.currentTarget));
          }}
        >
          <div className={styles.inputGroup}>
            <label className={styles.label}>Master Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••••••"
              required
              className={styles.input}
              disabled={isSubmitting}
            />
          </div>

          <button 
            type="submit" 
            className={`btn-primary ${styles.submitBtn}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Authenticating...' : 'Secure Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
