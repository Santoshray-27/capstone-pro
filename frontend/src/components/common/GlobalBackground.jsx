import React from 'react';

/**
 * GlobalBackground — Pure CSS implementation
 * Removed the Antigravity/Three.js Canvas component which was causing:
 * 1. The mysterious floating "X" error overlay from @react-three/fiber
 * 2. A TypeError crash ("Cannot read properties of undefined (reading 'S')")
 * The clean CSS grid pattern provides the same visual depth without WebGL overhead.
 */
const GlobalBackground = () => {
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
      {/* Base ivory background */}
      <div className="absolute inset-0" style={{ background: 'var(--background)' }} />

      {/* Subtle cross-hatch grid pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(45deg, transparent 49%, var(--border) 49%, var(--border) 51%, transparent 51%),
            linear-gradient(-45deg, transparent 49%, var(--border) 49%, var(--border) 51%, transparent 51%)
          `,
          backgroundSize: '40px 40px',
          opacity: 0.35,
        }}
      />

      {/* Diagonal Cross Grid Bottom Background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(45deg, transparent 49%, #e5e7eb 49%, #e5e7eb 51%, transparent 51%),
            linear-gradient(-45deg, transparent 49%, #e5e7eb 49%, #e5e7eb 51%, transparent 51%)
          `,
          backgroundSize: "40px 40px",
          WebkitMaskImage:
                "radial-gradient(ellipse 100% 80% at 50% 100%, #000 50%, transparent 90%)",
          maskImage:
                "radial-gradient(ellipse 100% 80% at 50% 100%, #000 50%, transparent 90%)",
        }}
      />

      {/* Subtle radial vignette to focus attention center */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 60%, color-mix(in srgb, var(--background) 30%, transparent) 100%)',
        }}
      />
    </div>
  );
};

export default GlobalBackground;
