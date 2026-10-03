import React, { useState } from 'react';
import { Sparkles, Palette, Eye, ShieldCheck, Zap, Sliders, Check } from 'lucide-react';
import HazyAtmosphericGradient from './HazyAtmosphericGradient';

const PRESETS = [
  {
    id: 'emerald',
    name: 'Wakalat Emerald',
    tagline: 'Legal Trust & Prestige',
    colors: ['#059669', '#10b981', '#0ea5e9', '#3730a3'],
    desc: 'Slow-shifting deep emerald and royal blue hues tailored for legal clarity and authority.'
  },
  {
    id: 'aurora',
    name: 'Atmospheric Aurora',
    tagline: 'Vibrant & Modern Ambient',
    colors: ['#6366f1', '#8b5cf6', '#d946ef', '#f43f5e'],
    desc: 'Dreamy atmospheric purple and rose gold gradient shifts that evoke depth and intelligence.'
  },
  {
    id: 'midnight',
    name: 'Midnight Obsidian',
    tagline: 'Luxury Dark Mode',
    colors: ['#064e3b', '#0f766e', '#311b92', '#0f172a'],
    desc: 'Ultra-sleek dark atmosphere with soft glowing teal and deep velvet shadows.'
  },
  {
    id: 'nordic',
    name: 'Nordic Fog',
    tagline: 'Soft Minimal Mood',
    colors: ['#34d399', '#38bdf8', '#c084fc', '#fbbf24'],
    desc: 'Calm, subtle high-key atmospheric haze with high contrast for ultra-clean brand visuals.'
  }
];

const HazyGradientShowcase = ({ onSelectTheme }) => {
  const [activePreset, setActivePreset] = useState('emerald');
  const [activeSpeed, setActiveSpeed] = useState('slow');

  const handleSelectPreset = (presetId) => {
    setActivePreset(presetId);
    if (onSelectTheme) {
      onSelectTheme(presetId);
    }
  };

  return (
    <div style={{ padding: '4rem 1.5rem', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            background: 'rgba(16, 185, 129, 0.1)',
            borderRadius: '9999px',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            color: '#059669',
            fontSize: '0.85rem',
            fontWeight: 700,
            marginBottom: '1rem'
          }}
        >
          <Sparkles size={16} />
          <span>Brand Visual Atmosphere Engine</span>
        </div>
        <h2 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '0.8rem' }}>
          Hazy Atmospheric <span style={{ background: 'linear-gradient(135deg, #10b981, #0284c7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Gradient Shifter</span>
        </h2>
        <p style={{ maxWidth: '650px', margin: '0 auto', color: '#64748b', fontSize: '1.05rem', lineHeight: '1.6' }}>
          A slow, organic color-shifting background with tactile film grain haze. Designed to provide luxurious brand mood without distracting movement.
        </p>
      </div>

      {/* Interactive Feature Card Box */}
      <div
        style={{
          position: 'relative',
          height: '420px',
          borderRadius: '28px',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.15)',
          border: '1px solid rgba(226, 232, 240, 0.8)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '2.5rem'
        }}
      >
        {/* Background Hazy Canvas Shifter */}
        <HazyAtmosphericGradient
          preset={activePreset}
          speed={activeSpeed}
          hasNoise={true}
          opacity={1}
        />

        {/* Top Overlay Badge */}
        <div style={{ position: 'relative', zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div
            style={{
              padding: '8px 16px',
              background: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              borderRadius: '9999px',
              border: '1px solid rgba(255, 255, 255, 0.6)',
              fontSize: '0.85rem',
              fontWeight: 700,
              color: '#0f172a',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
            }}
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
            Active Preset: <span style={{ color: '#059669' }}>{PRESETS.find(p => p.id === activePreset)?.name}</span>
          </div>

          <div
            style={{
              display: 'flex',
              gap: '6px',
              background: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(16px)',
              padding: '4px',
              borderRadius: '9999px',
              border: '1px solid rgba(255, 255, 255, 0.6)'
            }}
          >
            {['slow', 'medium', 'fast'].map((spd) => (
              <button
                key={spd}
                onClick={() => setActiveSpeed(spd)}
                style={{
                  border: 'none',
                  background: activeSpeed === spd ? '#10b981' : 'transparent',
                  color: activeSpeed === spd ? '#ffffff' : '#475569',
                  padding: '4px 12px',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {spd.toUpperCase()} SHIFT
              </button>
            ))}
          </div>
        </div>

        {/* Center Content Demo */}
        <div style={{ position: 'relative', zIndex: 10, maxWidth: '580px' }}>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: activePreset === 'midnight' ? '#ffffff' : '#0f172a', marginBottom: '0.6rem', transition: 'color 0.4s ease' }}>
            Elevate Your Brand Visuals
          </h3>
          <p style={{ color: activePreset === 'midnight' ? '#94a3b8' : '#334155', fontSize: '1rem', lineHeight: '1.6', transition: 'color 0.4s ease' }}>
            {PRESETS.find(p => p.id === activePreset)?.desc}
          </p>
        </div>

        {/* Preset Selector Bar */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px'
          }}
        >
          {PRESETS.map((p) => {
            const isSelected = activePreset === p.id;
            return (
              <button
                key={p.id}
                onClick={() => handleSelectPreset(p.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 14px',
                  background: isSelected ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.7)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  borderRadius: '16px',
                  border: isSelected ? '2px solid #10b981' : '1px solid rgba(255, 255, 255, 0.6)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  boxShadow: isSelected ? '0 10px 20px -5px rgba(16, 185, 129, 0.25)' : '0 4px 10px rgba(0,0,0,0.03)',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                <div style={{ display: 'flex', gap: '3px', width: '28px', height: '28px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
                  {p.colors.map((c, i) => (
                    <span key={i} style={{ flex: 1, background: c }} />
                  ))}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {p.name}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                    {p.tagline}
                  </div>
                </div>
                {isSelected && <Check size={16} color="#10b981" style={{ flexShrink: 0 }} />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HazyGradientShowcase;
