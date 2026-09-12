'use client';

import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '@/lib/cropImage';
import styles from './AdminDashboard.module.css'; // Reusing dashboard styles
import { HiOutlineUpload, HiOutlineDownload, HiOutlineX } from 'react-icons/hi';

const ASPECT_RATIOS = [
  { label: '1:1 (Team Photos)', value: 1 },
  { label: '16:9 (Event Posters)', value: 16 / 9 },
  { label: '4:3 (Standard)', value: 4 / 3 },
];

export default function AdminImageCropper() {
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const imageDataUrl = await readFile(file);
      setImageSrc(imageDataUrl);
      setCroppedImage(null);
    }
  };

  const showCroppedImage = useCallback(async () => {
    try {
      const cropped = await getCroppedImg(imageSrc, croppedAreaPixels, 0);
      setCroppedImage(cropped.url);
    } catch (e) {
      console.error(e);
    }
  }, [imageSrc, croppedAreaPixels]);

  const handleDownload = () => {
    if (!croppedImage) return;
    const link = document.createElement('a');
    link.download = `cropped-image-${Date.now()}.jpg`;
    link.href = croppedImage;
    link.click();
  };

  const handleReset = () => {
    setImageSrc(null);
    setCroppedImage(null);
    setZoom(1);
    setCrop({ x: 0, y: 0 });
  };

  return (
    <div style={{ padding: 'var(--space-xl)', background: 'var(--bg-light)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
      <h2 style={{ marginBottom: '1rem' }}>Image Formatting Tool</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Crop images to exact proportions before adding them to the codebase. Download the cropped file to your PC.
      </p>

      {!imageSrc ? (
        <div 
          style={{ 
            border: '2px dashed var(--border-light)', 
            padding: '4rem', 
            textAlign: 'center',
            borderRadius: '12px',
            cursor: 'pointer',
            background: 'rgba(255,255,255,0.02)'
          }}
          onClick={() => document.getElementById('image-upload').click()}
        >
          <HiOutlineUpload size={48} style={{ color: 'var(--crimson)', marginBottom: '1rem' }} />
          <h3>Click to Upload Image</h3>
          <p style={{ color: 'var(--text-secondary)' }}>JPG, PNG, WEBP (Max 5MB)</p>
          <input 
            id="image-upload" 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange} 
            style={{ display: 'none' }} 
          />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Controls */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ flex: 1, display: 'flex', gap: '0.5rem' }}>
              {ASPECT_RATIOS.map((ratio) => (
                <button
                  key={ratio.label}
                  onClick={() => setAspect(ratio.value)}
                  className={aspect === ratio.value ? 'btn-primary' : 'btn-secondary'}
                  style={{ padding: '8px 16px', fontSize: '0.9rem' }}
                >
                  {ratio.label}
                </button>
              ))}
            </div>
            <button onClick={handleReset} className="btn-secondary" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <HiOutlineX /> Reset
            </button>
          </div>

          {/* Cropper Workspace */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            
            {/* Editor */}
            <div style={{ position: 'relative', height: '400px', background: '#111', borderRadius: '12px', overflow: 'hidden' }}>
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={aspect}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>

            {/* Preview & Download */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <button onClick={showCroppedImage} className="btn-primary" style={{ alignSelf: 'flex-start' }}>
                Preview Crop
              </button>
              
              {croppedImage && (
                <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                  <h4 style={{ marginBottom: '1rem' }}>Final Output</h4>
                  <img 
                    src={croppedImage} 
                    alt="Cropped Preview" 
                    style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain', borderRadius: '8px', border: '1px solid var(--border-light)' }} 
                  />
                  <button 
                    onClick={handleDownload} 
                    className="btn-primary" 
                    style={{ marginTop: '1rem', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: '#4CAF50' }}
                  >
                    <HiOutlineDownload size={20} /> Download to PC
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span>Zoom:</span>
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-labelledby="Zoom"
                onChange={(e) => setZoom(e.target.value)}
                style={{ flex: 1 }}
              />
            </label>
          </div>

        </div>
      )}
    </div>
  );
}

function readFile(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => resolve(reader.result), false);
    reader.readAsDataURL(file);
  });
}
