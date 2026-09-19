import React from 'react';

export default function KineticSculpture() {
  return (
    <div style={{ width: '600px', height: '600px', position: 'relative' }}>
      <svg width="600" height="600" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          
          <path id="track1" d="M 50 100 C 200 100, 150 400, 300 450 C 450 500, 500 250, 550 300" fill="transparent" />
          <path id="track2" d="M 550 150 C 400 100, 350 350, 250 400 C 150 450, 100 200, 50 350" fill="transparent" />
          <path id="track3" d="M 300 50 C 500 150, 450 450, 300 550 C 150 650, 100 250, 300 50" fill="transparent" />
        </defs>

        {/* Tracks rendered visually */}
        <path d="M 50 100 C 200 100, 150 400, 300 450 C 450 500, 500 250, 550 300" 
              stroke="#222" strokeWidth="6" fill="transparent" />
        <path d="M 50 100 C 200 100, 150 400, 300 450 C 450 500, 500 250, 550 300" 
              stroke="#ccff00" strokeWidth="2" fill="transparent" opacity="0.5" />

        <path d="M 550 150 C 400 100, 350 350, 250 400 C 150 450, 100 200, 50 350" 
              stroke="#222" strokeWidth="6" fill="transparent" />
        <path d="M 550 150 C 400 100, 350 350, 250 400 C 150 450, 100 200, 50 350" 
              stroke="#ccff00" strokeWidth="2" fill="transparent" opacity="0.5" />

        <path d="M 300 50 C 500 150, 450 450, 300 550 C 150 650, 100 250, 300 50" 
              stroke="#222" strokeWidth="6" fill="transparent" />
        <path d="M 300 50 C 500 150, 450 450, 300 550 C 150 650, 100 250, 300 50" 
              stroke="#ccff00" strokeWidth="2" fill="transparent" opacity="0.5" />

        {/* Balls */}
        <circle r="8" fill="#ccff00" filter="url(#neon-glow)">
          <animateMotion dur="4s" repeatCount="indefinite">
            <mpath href="#track1" />
          </animateMotion>
        </circle>

        <circle r="6" fill="#fff" filter="url(#neon-glow)">
          <animateMotion dur="3.5s" repeatCount="indefinite">
            <mpath href="#track2" />
          </animateMotion>
        </circle>

        <circle r="10" fill="#ccff00" filter="url(#neon-glow)">
          <animateMotion dur="5s" repeatCount="indefinite" begin="1s">
            <mpath href="#track3" />
          </animateMotion>
        </circle>
        
        <circle r="5" fill="#ccff00" filter="url(#neon-glow)">
          <animateMotion dur="6s" repeatCount="indefinite" begin="0.5s">
            <mpath href="#track1" />
          </animateMotion>
        </circle>
      </svg>
    </div>
  );
}
