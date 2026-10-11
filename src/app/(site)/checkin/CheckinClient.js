'use client';

import { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import toast from 'react-hot-toast';
import { HiCheckCircle, HiExclamationCircle, HiXCircle } from 'react-icons/hi';
import { checkinUser, verifyCheckinPin } from '@/app/actions/checkinUser';
import styles from './CheckinPage.module.css';

export default function CheckinClient() {
  const [unlocked, setUnlocked] = useState(false);
  const [pin, setPin] = useState('');
  const [volunteerName, setVolunteerName] = useState('');
  const [manualCode, setManualCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const lastScannedCode = useRef(null);
  const cooldownTimer = useRef(null);
  const scannerRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('icon_checkin_ok') === '1') {
      setUnlocked(true);
    }
  }, []);

  useEffect(() => {
    if (!unlocked) return undefined;

    const scanner = new Html5QrcodeScanner(
      'qr-reader',
      { fps: 10, qrbox: { width: 250, height: 250 }, rememberLastUsedCamera: true },
      false
    );
    scannerRef.current = scanner;
    scanner.render(onScanSuccess, () => {});

    return () => {
      scanner.clear().catch(() => {});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unlocked]);

  const handlePinSubmit = async (e) => {
    e.preventDefault();
    const result = await verifyCheckinPin(pin);
    if (result.success) {
      sessionStorage.setItem('icon_checkin_ok', '1');
      setUnlocked(true);
      if (result.warning) toast(result.warning, { icon: '⚠️' });
      else toast.success('Access granted');
    } else {
      toast.error(result.message || 'Invalid PIN');
    }
  };

  const onScanSuccess = async (decodedText) => {
    if (lastScannedCode.current === decodedText || isProcessing) return;
    lastScannedCode.current = decodedText;
    if (cooldownTimer.current) clearTimeout(cooldownTimer.current);
    cooldownTimer.current = setTimeout(() => {
      lastScannedCode.current = null;
    }, 3000);
    await processCheckin(decodedText);
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    await processCheckin(manualCode.trim());
    setManualCode('');
  };

  const processCheckin = async (qrCode) => {
    setIsProcessing(true);
    setScanResult(null);
    if (navigator.vibrate) navigator.vibrate(50);

    try {
      const result = await checkinUser(qrCode, volunteerName);
      if (result.success) {
        toast.success(result.message);
        setScanResult({ status: 'success', message: 'Check-in Confirmed', data: result.data });
        if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
      } else if (result.status === 'already') {
        toast(result.message, { icon: '⚠️' });
        setScanResult({
          status: 'already',
          message: 'Already Checked In',
          timestamp: result.timestamp,
        });
      } else {
        toast.error(result.message || 'Invalid QR Code');
        setScanResult({ status: 'error', message: result.message || 'Invalid QR Code' });
        if (navigator.vibrate) navigator.vibrate(300);
      }
    } catch {
      toast.error('Connection error');
      setScanResult({ status: 'error', message: 'Could not connect to server' });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!unlocked) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.card}>
            <div className={styles.header}>
              <h1 className={styles.title}>Volunteer Access</h1>
              <p className={styles.subtitle}>Enter the check-in PIN to unlock the scanner</p>
            </div>
            <form onSubmit={handlePinSubmit} className={styles.manualForm}>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="CHECKIN PIN"
                className={styles.input}
                required
              />
              <input
                type="text"
                value={volunteerName}
                onChange={(e) => setVolunteerName(e.target.value)}
                placeholder="Your name (optional)"
                className={styles.input}
              />
              <button type="submit" className={`btn-primary ${styles.submitBtn}`}>
                Unlock Scanner
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.header}>
            <h1 className={styles.title}>Volunteer Portal</h1>
            <p className={styles.subtitle}>Scan attendee QR codes to check them in</p>
          </div>

          <div className={styles.scannerWrapper}>
            <div id="qr-reader" style={{ width: '100%' }}></div>
          </div>

          <div className={styles.divider}>OR</div>

          <form onSubmit={handleManualSubmit} className={styles.manualForm}>
            <input
              type="text"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value.toUpperCase())}
              placeholder="Enter Registration ID (e.g. ICON2026-...)"
              className={styles.input}
              disabled={isProcessing}
            />
            <button
              type="submit"
              className={`btn-primary ${styles.submitBtn}`}
              disabled={isProcessing || !manualCode.trim()}
            >
              Check-in
            </button>
          </form>

          {scanResult && (
            <div
              className={`
              ${styles.resultBox}
              ${scanResult.status === 'success' ? styles.resultSuccess : ''}
              ${scanResult.status === 'already' ? styles.resultAlready : ''}
              ${scanResult.status === 'error' ? styles.resultError : ''}
            `}
            >
              <div className={styles.resultTitle}>
                {scanResult.status === 'success' && <HiCheckCircle size={24} />}
                {scanResult.status === 'already' && <HiExclamationCircle size={24} />}
                {scanResult.status === 'error' && <HiXCircle size={24} />}
                {scanResult.message}
              </div>

              {scanResult.status === 'success' && scanResult.data && (
                <div className={styles.resultText}>
                  <strong>{scanResult.data.name}</strong> has been checked in for{' '}
                  {scanResult.data.events.length} event(s).
                </div>
              )}

              {scanResult.status === 'already' && scanResult.timestamp && (
                <div className={styles.resultText}>
                  Checked in at:{' '}
                  {new Date(scanResult.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
