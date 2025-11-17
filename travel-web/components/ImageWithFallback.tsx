'use client';

import React from 'react';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className: string;
  fallbackSrc: string; // URL gambar cadangan
}

export default function ImageWithFallback({ src, alt, className, fallbackSrc }: ImageWithFallbackProps) {
  
  // State untuk melacak apakah kita harus menggunakan fallback
  const [currentSrc, setCurrentSrc] = React.useState(src);
  const [errorOccurred, setErrorOccurred] = React.useState(false);

  // Reset currentSrc jika props src berubah (misalnya, jika komponen digunakan berulang)
  React.useEffect(() => {
    setCurrentSrc(src);
    setErrorOccurred(false);
  }, [src]);

  const handleError = () => {
    // Hanya ganti sumber jika belum terjadi error
    if (!errorOccurred && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setErrorOccurred(true); // Pastikan ini hanya terjadi sekali per render
    }
  };

  return (
    <img 
      src={currentSrc} 
      alt={alt} 
      className={className}
      // Panggil fungsi penanganan error yang ada di Client Component
      onError={handleError}
    />
  );
}