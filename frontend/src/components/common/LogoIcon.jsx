import React from 'react';

const LogoIcon = ({ className = '', size = 24, style }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      width={size} 
      height={size} 
      className={className}
      style={style}
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      {/* AI Circuit Nodes */}
      {/* Node Top */}
      <path d="M10 2V1" strokeWidth="1" />
      <circle cx="10" cy="1" r="1" fill="currentColor" stroke="none" />
      
      {/* Node Left 1 */}
      <path d="M4 10H2" strokeWidth="1" />
      <circle cx="2" cy="10" r="1" fill="currentColor" stroke="none" />

      {/* Node Left 2 */}
      <path d="M4 15H2.5v1.5" strokeWidth="1" />
      <circle cx="2.5" cy="16.5" r="1" fill="currentColor" stroke="none" />

      {/* Main Document Outline */}
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h5.5" />
      <path d="M14 2v6h6v4" />
      
      {/* Document Text Lines */}
      <line x1="8" y1="11" x2="12" y2="11" />
      <line x1="8" y1="15" x2="10" y2="15" />
      <line x1="8" y1="7" x2="10" y2="7" />

      {/* Magnifying Glass Lens */}
      <circle cx="16.5" cy="16.5" r="5" fill="var(--background, #fff)" />
      
      {/* Magnifying Glass Handle */}
      <line x1="20" y1="20" x2="22.5" y2="22.5" strokeWidth="2" />
      
      {/* User Silhouette inside Magnifying Glass */}
      <circle cx="16.5" cy="15" r="1.5" />
      <path d="M13.5 19a3 3 0 0 1 6 0" />
    </svg>
  );
};

export default LogoIcon;
