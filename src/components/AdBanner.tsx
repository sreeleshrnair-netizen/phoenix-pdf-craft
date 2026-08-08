'use client';

import { useEffect, useRef } from 'react';

interface AdBannerProps {
  dataAdSlot: string;
  dataAdFormat?: string;
  dataFullWidthResponsive?: string;
  className?: string;
}

export default function AdBanner({
  dataAdSlot,
  dataAdFormat = 'auto',
  dataFullWidthResponsive = 'true',
  className = '',
}: AdBannerProps) {
  const isPushed = useRef(false);

  useEffect(() => {
    // Prevent duplicate pushes during React Strict Mode re-renders
    if (isPushed.current) return;

    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      isPushed.current = true;
    } catch (err) {
      console.error('AdSense Error:', err);
    }
  }, []);

  return (
    <div
      className={`w-full max-w-7xl mx-auto overflow-hidden flex justify-center items-center min-h-0 bg-transparent ${className}`}
      style={{ minHeight: 0 }}
    >
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          width: '100%',
          backgroundColor: 'transparent',
          minHeight: 0,
        }}
        data-ad-client="ca-pub-2632575785724078"
        data-ad-slot={dataAdSlot}
        data-ad-format={dataAdFormat}
        data-full-width-responsive={dataFullWidthResponsive}
      />
    </div>
  );
}