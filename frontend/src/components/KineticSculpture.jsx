import React from 'react';

export default function KineticSculpture() {
  const path1 = "M 150 100 C 350 100, 150 500, 350 500";
  const path2 = "M 250 100 C 450 100, 250 500, 450 500";

  return (
    <div style={{ width: '600px', height: '600px', position: 'relative' }}>
      <style>{`
        @keyframes slide {
          0% { offset-distance: 0%; }
          100% { offset-distance: 100%; }
        }
        .ball {
          position: absolute;
          width: 16px;
          height: 16px;
          background-color: #ccff00;
          border-radius: 50%;
          top: 0;
          left: 0;
          offset-anchor: 50% 50%;
          offset-rotate: 0deg;
          box-shadow: 0 0 16px 6px rgba(204, 255, 0, 0.8);
          animation: slide 4s linear infinite;
          z-index: 10;
        }
        .ball-1 {
          offset-path: path('${path1}');
          animation-delay: 0s;
        }
        .ball-2 {
          offset-path: path('${path2}');
          animation-delay: -2s;
        }
        .pulse-node {
          fill: #111;
          stroke: #ccff00;
          transform-origin: center;
          transform-box: fill-box;
        }
      `}</style>

      {/* SVG drawing with grid, tracks, glows, and nodes */}
      <svg width="600" height="600" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', top: 0, left: 0 }}>
        <defs>
          {/* Subtle Dot Pattern */}
          <pattern id="dotGrid" width="30" height="30" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" fill="#333" opacity="0.4" />
          </pattern>
          
          {/* Metallic/Glass Gradient for Track Base */}
          <linearGradient id="metalPipe" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1a1a1a" />
            <stop offset="30%" stopColor="#3d3d3d" />
            <stop offset="50%" stopColor="#555555" />
            <stop offset="70%" stopColor="#3d3d3d" />
            <stop offset="100%" stopColor="#1a1a1a" />
          </linearGradient>

          {/* Outer Glow Filter for Tracks */}
          <filter id="trackGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComponentTransfer in="blur" result="glow">
              <feFuncA type="linear" slope="0.5"/>
            </feComponentTransfer>
            <feMerge>
              <feMergeNode in="glow"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Background Grid */}
        <rect width="100%" height="100%" fill="url(#dotGrid)" />

        {/* Track 1 - Base, Core, Glow */}
        {/* Glow Layer */}
        <path d={path1} stroke="#ccff00" strokeWidth="8" fill="none" strokeLinecap="round" filter="url(#trackGlow)" opacity="0.4" />
        {/* Metallic Base */}
        <path d={path1} stroke="url(#metalPipe)" strokeWidth="12" fill="none" strokeLinecap="round" />
        {/* Thin Core Line */}
        <path d={path1} stroke="#ccff00" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6" />

        {/* Track 2 - Base, Core, Glow */}
        {/* Glow Layer */}
        <path d={path2} stroke="#ccff00" strokeWidth="8" fill="none" strokeLinecap="round" filter="url(#trackGlow)" opacity="0.4" />
        {/* Metallic Base */}
        <path d={path2} stroke="url(#metalPipe)" strokeWidth="12" fill="none" strokeLinecap="round" />
        {/* Thin Core Line */}
        <path d={path2} stroke="#ccff00" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6" />

        {/* Pulsing Nodes (Junction Points) */}
        {/* Track 1 Nodes */}
        <g className="pulse-node" strokeWidth="2">
          <circle cx="150" cy="100" r="6">
            <animate attributeName="r" values="5;8;5" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="250" cy="300" r="6">
            <animate attributeName="r" values="5;8;5" dur="2s" begin="0.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="350" cy="500" r="6">
            <animate attributeName="r" values="5;8;5" dur="2s" begin="1s" repeatCount="indefinite" />
          </circle>
        </g>

        {/* Track 2 Nodes */}
        <g className="pulse-node" strokeWidth="2">
          <circle cx="250" cy="100" r="6">
            <animate attributeName="r" values="5;8;5" dur="2.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="350" cy="300" r="6">
            <animate attributeName="r" values="5;8;5" dur="2.5s" begin="0.6s" repeatCount="indefinite" />
          </circle>
          <circle cx="450" cy="500" r="6">
            <animate attributeName="r" values="5;8;5" dur="2.5s" begin="1.2s" repeatCount="indefinite" />
          </circle>
        </g>
      </svg>

      {/* Glowing Balls */}
      <div className="ball ball-1"></div>
      <div className="ball ball-2"></div>
    </div>
  );
}
