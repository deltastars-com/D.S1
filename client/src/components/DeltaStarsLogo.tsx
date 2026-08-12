import React, { useEffect, useState } from 'react';

interface DeltaStarsLogoProps {
  className?: string;
  theme?: 'green' | 'gold' | 'white';
  onlyEmblem?: boolean;
  logoUrl?: string;
  noFrame?: boolean;
  fitMode?: 'cover' | 'contain';
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

/**
 * The brand mark is intentionally image-only. No generated SVG or fallback
 * drawing is allowed so every surface stays byte-identical to the approved
 * green/gold Delta Stars asset.
 */
export const DeltaStarsLogo: React.FC<DeltaStarsLogoProps> = ({
  className = 'w-full h-full',
  logoUrl,
  fitMode = 'contain',
  onError,
}) => {
  const officialLogoUrl = '/official_logo.png?v=2026';
  const requestedUrl = logoUrl || officialLogoUrl;
  const [currentSrc, setCurrentSrc] = useState(requestedUrl);
  const [logoFailed, setLogoFailed] = useState(false);

  useEffect(() => {
    setCurrentSrc(requestedUrl);
    setLogoFailed(false);
  }, [requestedUrl]);

  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    onError?.(event);
    setLogoFailed(true);
  };

  if (logoFailed) {
    return (
      <span
        className={`inline-flex items-center justify-center text-center font-black text-emerald-800 ${className}`}
        aria-label="Delta Stars"
      >
        Delta Stars
      </span>
    );
  }

  return (
    <div className={`relative flex items-center justify-center select-none overflow-hidden ${className}`}>
      <img
        src={currentSrc}
        alt="Delta Stars Logo"
        onError={handleImageError}
        referrerPolicy="no-referrer"
        className={`w-full h-full ${fitMode === 'cover' ? 'object-cover' : 'object-contain'} transition-transform duration-300`}
        loading="eager"
        decoding="async"
      />
    </div>
  );
};
