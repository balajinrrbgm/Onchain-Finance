import React from 'react';
import logoUrl from '../assets/afriasset-logo.svg';

interface LogoProps {
  size?: number | string; // height in px or css dimension
  className?: string;
  hideWordmark?: boolean;
  alt?: string;
}

/**
 * Responsive AfriAsset logo component.
 * - Uses embedded SVG asset for crisp scaling.
 * - hideWordmark: renders only emblem (stylized A + arc) by cropping via viewBox.
 */
export const Logo: React.FC<LogoProps> = ({ size = 48, className, hideWordmark = false, alt = 'AfriAsset' }) => {
  if (hideWordmark) {
    // Inline emblem-only SVG fragment for better control
    return (
      <svg
        className={className}
        role="img"
        aria-label={alt}
        height={typeof size === 'number' ? size : undefined}
        style={{ height: typeof size === 'string' ? size : undefined }}
        viewBox="0 0 80 60"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="40" cy="30" r="28" fill="#0F766E" opacity="0.12" />
        <path d="M40 12 L22 48 H30 L35.2 37.2 H44.8 L50 48 H58 L40 12 Z M38.2 30.4 L40 26.4 L41.8 30.4 H38.2 Z" fill="#0F766E" />
        <path d="M18 44 C24 34 32 28 40 28 C48 28 56 34 62 44" stroke="#FDBA74" strokeWidth={3} strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <img
      src={logoUrl}
      alt={alt}
      className={className}
      style={{ height: typeof size === 'number' ? `${size}px` : size, width: 'auto' }}
    />
  );
};

export default Logo;
