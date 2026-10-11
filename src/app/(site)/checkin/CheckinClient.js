'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import toast from 'react-hot-toast';
import { HiCheckCircle, HiExclamationCircle, HiXCircle } from 'react-icons/hi';
import { checkinUser, verifyCheckinPin } from '@/app/actions/checkinUser';

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

  const processCheckin = useCallback(async (qrCode) => {
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
        toast.error(result.message);
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
  }, [volunteerName]);

  const onScanSuccess = useCallback(async (decodedText) => {
    if (lastScannedCode.current === decodedText || isProcessing) return;
    lastScannedCode.current = decodedText;
    if (cooldownTimer.current) clearTimeout(cooldownTimer.current);
    cooldownTimer.current = setTimeout(() => {
      lastScannedCode.current = null;
    }, 3000);
    await processCheckin(decodedText);
  }, [isProcessing, processCheckin]);

  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('icon_checkin_ok') === '1') {
      const timer = setTimeout(() => setUnlocked(true), 0);
      return () => clearTimeout(timer);
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
  }, [unlocked, onScanSuccess]);

  const handlePinSubmit = async (e) => {
    e.preventDefault();
    const result = await verifyCheckinPin(pin);
    if (result.success) {
      sessionStorage.setItem('icon_checkin_ok', '1');
      setUnlocked(true);
      if (result.warning) toast(result.warning);
      else toast.success('Access granted');
    } else {
      toast.error(result.message || 'Invalid PIN');
    }
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    await processCheckin(manualCode.trim());
    setManualCode('');
  };

  if (!unlocked) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] pt-28 pb-20 px-4 flex items-center justify-center font-firasans">
        <div className="max-w-md w-full bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="text-center mb-6">
            <h1 className="font-marcellus text-2xl sm:text-3xl text-[#231F20] mb-1">
              Volunteer Access
            </h1>
            <p className="text-stone-500 text-xs sm:text-sm">
              Enter the check-in PIN to unlock the scanner
            </p>
          </div>
          <form onSubmit={handlePinSubmit} className="space-y-4">
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="CHECKIN PIN"
              className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-mono tracking-widest text-[#231F20] focus:outline-none focus:border-[#B7202E] focus:ring-1 focus:ring-[#B7202E]"
              required
            />
            <input
              type="text"
              value={volunteerName}
              onChange={(e) => setVolunteerName(e.target.value)}
              placeholder="Your name (optional)"
              className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-[#231F20] focus:outline-none focus:border-[#B7202E] focus:ring-1 focus:ring-[#B7202E]"
            />
            <button
              type="submit"
              className="w-full py-3 px-6 bg-[#B7202E] hover:bg-[#8F1622] text-white font-semibold text-sm rounded-xl shadow-sm transition-colors cursor-pointer"
            >
              Unlock Scanner
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-28 pb-20 px-4 flex items-center justify-center font-firasans">
      <div className="max-w-xl w-full bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="text-center mb-6">
          <h1 className="font-marcellus text-2xl sm:text-3xl text-[#231F20] mb-1">
            Volunteer Portal
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm">
            Scan attendee QR codes to check them in
          </p>
        </div>

        <div className="w-full rounded-xl overflow-hidden bg-black mb-6 [&_div]:border-none [&_video]:object-cover">
          <div id="qr-reader" style={{ width: '100%' }}></div>
        </div>

        <div className="flex items-center text-center my-5 text-stone-400 text-xs font-semibold tracking-wider uppercase before:content-[''] before:flex-1 before:border-b before:border-stone-200 before:mr-3 after:content-[''] after:flex-1 after:border-b after:border-stone-200 after:ml-3">
          OR
        </div>

        <form onSubmit={handleManualSubmit} className="flex flex-col sm:flex-row gap-2.5">
          <input
            type="text"
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value.toUpperCase())}
            placeholder="Enter Registration ID (e.g. ICON2026-...)"
            className="flex-1 px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-mono text-sm uppercase text-[#231F20] focus:outline-none focus:border-[#B7202E] focus:ring-1 focus:ring-[#B7202E] disabled:opacity-50"
            disabled={isProcessing}
          />
          <button
            type="submit"
            className="py-2.5 px-6 bg-[#B7202E] hover:bg-[#8F1622] text-white font-semibold text-sm rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0"
            disabled={isProcessing || !manualCode.trim()}
          >
            Check-in
          </button>
        </form>

        {scanResult && (
          <div
            className={`mt-6 p-4 rounded-xl text-center border transition-all ${
              scanResult.status === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : scanResult.status === 'already'
                ? 'bg-amber-50 border-amber-200 text-amber-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            <div className="font-semibold text-base mb-1 flex items-center justify-center gap-2">
              {scanResult.status === 'success' && <HiCheckCircle className="text-xl text-emerald-600" />}
              {scanResult.status === 'already' && <HiExclamationCircle className="text-xl text-amber-600" />}
              {scanResult.status === 'error' && <HiXCircle className="text-xl text-red-600" />}
              {scanResult.message}
            </div>

            {scanResult.status === 'success' && scanResult.data && (
              <div className="text-xs mt-1">
                <strong>{scanResult.data.name}</strong> has been checked in for{' '}
                {scanResult.data.events.length} event(s).
              </div>
            )}

            {scanResult.status === 'already' && scanResult.timestamp && (
              <div className="text-xs mt-1">
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
  );
}
