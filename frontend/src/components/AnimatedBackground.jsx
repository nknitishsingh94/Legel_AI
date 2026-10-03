import React from 'react';
import HazyAtmosphericGradient from './HazyAtmosphericGradient';

const AnimatedBackground = ({ preset = 'emerald', showControls = false }) => {
  return (
    <div className="animated-bg-container" style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {/* Real-time Hazy Atmospheric Color-Shifting Canvas Engine */}
      <HazyAtmosphericGradient
        preset={preset}
        speed="slow"
        showControls={showControls}
        opacity={0.92}
        hasNoise={true}
      />

      {/* Dynamic Ambient Blur Highlights */}
      <div className="bg-orb orb-emerald animate-orb-1" style={{ opacity: 0.35 }} />
      <div className="bg-orb orb-gold animate-orb-2" style={{ opacity: 0.25 }} />
      <div className="bg-orb orb-cyan animate-orb-3" style={{ opacity: 0.3 }} />
      <div className="bg-orb orb-purple animate-orb-4" style={{ opacity: 0.2 }} />

      {/* Modern Tech Grid Pattern Overlay */}
      <div className="bg-grid-mesh" />

      {/* Light Radial Center Glow */}
      <div className="bg-center-radial" />
    </div>
  );
};

export default AnimatedBackground;
