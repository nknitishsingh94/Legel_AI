import React, { useEffect, useRef, useState } from 'react';
import './HazyAtmosphericGradient.css';
import { Sparkles, Sliders, RefreshCw, Layers, Droplets, Sun, Moon } from 'lucide-react';

const PALETTES = {
  emerald: {
    name: 'Wakalat Emerald',
    description: 'Deep legal trust with vibrant emerald green, royal cyan, and amber highlights',
    colors: ['#059669', '#10b981', '#0ea5e9', '#3730a3', '#f59e0b', '#047857'],
    bg: '#f0fdf4'
  },
  aurora: {
    name: 'Atmospheric Aurora',
    description: 'Vibrant indigo, cosmic violet, electric azure, and rose gold glow',
    colors: ['#6366f1', '#8b5cf6', '#d946ef', '#0284c7', '#f43f5e', '#4338ca'],
    bg: '#f5f3ff'
  },
  midnight: {
    name: 'Midnight Obsidian',
    description: 'Luxury dark theme with deep emerald, midnight sapphire, and teal mist',
    colors: ['#064e3b', '#0f766e', '#311b92', '#0284c7', '#1e1b4b', '#0f172a'],
    bg: '#090d16'
  },
  nordic: {
    name: 'Nordic Haze',
    description: 'Minimalist soft atmospheric tone with warm cream, mint mist, and dusk gray',
    colors: ['#34d399', '#38bdf8', '#c084fc', '#fbbf24', '#a7f3d0', '#64748b'],
    bg: '#f8fafc'
  }
};

const HazyAtmosphericGradient = ({
  preset = 'emerald',
  speed = 'slow', // 'slow' | 'medium' | 'fast'
  showControls = false,
  interactive = true,
  opacity = 0.85,
  hasNoise = true,
  className = '',
  style = {}
}) => {
  const canvasRef = useRef(null);
  const [currentPreset, setCurrentPreset] = useState(preset);
  const [currentSpeed, setCurrentSpeed] = useState(speed);
  const [grainOpacity, setGrainOpacity] = useState(0.045);
  const [blurAmount, setBlurAmount] = useState(80);
  const [isControlsOpen, setIsControlsOpen] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(preset === 'midnight');

  // Sync preset if prop changes
  useEffect(() => {
    setCurrentPreset(preset);
    setIsDarkTheme(preset === 'midnight');
  }, [preset]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = canvas.parentElement ? canvas.parentElement.offsetWidth : window.innerWidth);
    let height = (canvas.height = canvas.parentElement ? canvas.parentElement.offsetHeight : window.innerHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.offsetWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement.offsetHeight || window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Color node class for organic fluid color shifts
    const palette = PALETTES[currentPreset] || PALETTES.emerald;
    
    // Convert hex to rgb
    const hexToRgb = (hex) => {
      const bigint = parseInt(hex.replace('#', ''), 16);
      return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255
      };
    };

    const rgbColors = palette.colors.map(hexToRgb);

    // Create gradient orbs
    const numOrbs = 5;
    const orbs = Array.from({ length: numOrbs }, (_, i) => {
      const colorObj = rgbColors[i % rgbColors.length];
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * (currentSpeed === 'slow' ? 0.3 : currentSpeed === 'medium' ? 0.7 : 1.2),
        vy: (Math.random() - 0.5) * (currentSpeed === 'slow' ? 0.3 : currentSpeed === 'medium' ? 0.7 : 1.2),
        radius: Math.min(width, height) * (0.35 + Math.random() * 0.25),
        color: { ...colorObj },
        targetColor: { ...colorObj },
        colorProgress: 0,
        colorSpeed: 0.002 + Math.random() * 0.003,
        pulseAngle: Math.random() * Math.PI * 2,
        pulseSpeed: 0.005 + Math.random() * 0.008
      };
    });

    let time = 0;

    const render = () => {
      time += 0.01;
      ctx.clearRect(0, 0, width, height);

      // Render base background fill
      ctx.fillStyle = palette.bg;
      ctx.fillRect(0, 0, width, height);

      // Render each glowing gradient orb with soft radial gradient blending
      orbs.forEach((orb, i) => {
        // Organic movement update
        orb.x += orb.vx + Math.sin(time * 0.5 + i) * 0.4;
        orb.y += orb.vy + Math.cos(time * 0.5 + i * 2) * 0.4;

        // Bounce gently at margins
        if (orb.x < -orb.radius * 0.5) orb.vx = Math.abs(orb.vx);
        if (orb.x > width + orb.radius * 0.5) orb.vx = -Math.abs(orb.vx);
        if (orb.y < -orb.radius * 0.5) orb.vy = Math.abs(orb.vy);
        if (orb.y > height + orb.radius * 0.5) orb.vy = -Math.abs(orb.vy);

        // Dynamic pulsing radius
        orb.pulseAngle += orb.pulseSpeed;
        const currentRadius = orb.radius + Math.sin(orb.pulseAngle) * (orb.radius * 0.15);

        // Slow color morphing cycle between palette colors
        orb.colorProgress += orb.colorSpeed;
        if (orb.colorProgress >= 1) {
          orb.colorProgress = 0;
          orb.color = { ...orb.targetColor };
          const nextColor = rgbColors[Math.floor(Math.random() * rgbColors.length)];
          orb.targetColor = { ...nextColor };
        }

        // Interpolate current color to target color
        const r = Math.round(orb.color.r + (orb.targetColor.r - orb.color.r) * orb.colorProgress);
        const g = Math.round(orb.color.g + (orb.targetColor.g - orb.color.g) * orb.colorProgress);
        const b = Math.round(orb.color.b + (orb.targetColor.b - orb.color.b) * orb.colorProgress);

        // Radial gradient glow
        const radialGrad = ctx.createRadialGradient(
          orb.x,
          orb.y,
          0,
          orb.x,
          orb.y,
          currentRadius
        );

        const orbAlpha = currentPreset === 'midnight' ? 0.55 : 0.42;
        radialGrad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${orbAlpha})`);
        radialGrad.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${orbAlpha * 0.4})`);
        radialGrad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

        ctx.fillStyle = radialGrad;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, currentRadius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [currentPreset, currentSpeed]);

  return (
    <div className={`hazy-gradient-wrapper ${className}`} style={{ opacity, ...style }}>
      {/* HTML5 Canvas Atmospheric Color Shift Layer */}
      <canvas
        ref={canvasRef}
        className="hazy-gradient-canvas"
        style={{ filter: `blur(${blurAmount}px)` }}
      />

      {/* SVG Hazy Film Grain Overlay for Tactile Atmosphere */}
      {hasNoise && (
        <div
          className="hazy-grain-overlay"
          style={{ opacity: grainOpacity }}
        >
          <svg className="hazy-svg-noise">
            <filter id="hazyNoiseFilter">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.8"
                numOctaves="4"
                stitchTiles="stitch"
              />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#hazyNoiseFilter)" />
          </svg>
        </div>
      )}

      {/* Light Glass Center Glow Vignette */}
      <div className={`hazy-vignette ${isDarkTheme ? 'vignette-dark' : 'vignette-light'}`} />

      {/* Optional Interactive Floating Control Bar */}
      {showControls && (
        <div className="hazy-controls-bar">
          <button
            className="hazy-controls-toggle-btn"
            onClick={() => setIsControlsOpen(!isControlsOpen)}
            title="Atmospheric Gradient Settings"
          >
            <Sliders size={16} />
            <span>Atmospheric Gradient Mood</span>
          </button>

          {isControlsOpen && (
            <div className="hazy-controls-dropdown animate-fade-in">
              <div className="hazy-controls-header">
                <Sparkles size={14} className="sparkle-icon" />
                <span>Hazy Atmospheric Color Shifter</span>
              </div>

              {/* Palette Switcher */}
              <div className="hazy-control-group">
                <label>Color Palette Mood</label>
                <div className="hazy-palette-grid">
                  {Object.keys(PALETTES).map((key) => {
                    const pal = PALETTES[key];
                    return (
                      <button
                        key={key}
                        className={`hazy-palette-card ${currentPreset === key ? 'active' : ''}`}
                        onClick={() => {
                          setCurrentPreset(key);
                          setIsDarkTheme(key === 'midnight');
                        }}
                      >
                        <div className="palette-swatch-row">
                          {pal.colors.slice(0, 4).map((c, idx) => (
                            <span key={idx} style={{ background: c }} />
                          ))}
                        </div>
                        <span className="palette-name">{pal.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Speed Control */}
              <div className="hazy-control-group">
                <label>Shift Motion Speed</label>
                <div className="hazy-btn-group">
                  {['slow', 'medium', 'fast'].map((s) => (
                    <button
                      key={s}
                      className={`hazy-option-btn ${currentSpeed === s ? 'active' : ''}`}
                      onClick={() => setCurrentSpeed(s)}
                    >
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Haze Grain Opacity */}
              <div className="hazy-control-group">
                <div className="slider-label-row">
                  <label>Atmospheric Grain Density</label>
                  <span>{Math.round(grainOpacity * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="0.15"
                  step="0.005"
                  value={grainOpacity}
                  onChange={(e) => setGrainOpacity(parseFloat(e.target.value))}
                />
              </div>

              {/* Blur Atmosphere */}
              <div className="hazy-control-group">
                <div className="slider-label-row">
                  <label>Hazy Blur Smoothness</label>
                  <span>{blurAmount}px</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="140"
                  step="5"
                  value={blurAmount}
                  onChange={(e) => setBlurAmount(parseInt(e.target.value, 10))}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HazyAtmosphericGradient;
