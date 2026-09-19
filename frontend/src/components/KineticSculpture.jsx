import React from 'react';

export default function KineticSculpture() {
  // Two perfectly parallel S-curves from top-left to bottom-right
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
          /* Align exactly to the path coordinates */
          offset-anchor: 50% 50%;
          /* Don't auto-rotate the ball to keep the shadow uniform */
          offset-rotate: 0deg;
          box-shadow: 0 0 12px 4px rgba(204, 255, 0, 0.7);
          animation: slide 4s linear infinite;
        }
        .ball-1 {
          offset-path: path('${path1}');
          animation-delay: 0s;
        }
        .ball-2 {
          offset-path: path('${path2}');
          animation-delay: -2s; /* Using negative delay so it starts mid-animation immediately on load */
        }
      `}</style>

      {/* SVG to draw the visible tracks */}
      <svg width="600" height="600" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
        {/* Track 1 */}
        <path d={path1} stroke="#333" strokeWidth="8" fill="none" strokeLinecap="round" />
        <path d={path1} stroke="#ccff00" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.3" />
        
        {/* Track 2 */}
        <path d={path2} stroke="#333" strokeWidth="8" fill="none" strokeLinecap="round" />
        <path d={path2} stroke="#ccff00" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.3" />
      </svg>

      {/* Glowing Balls */}
      <div className="ball ball-1"></div>
      <div className="ball ball-2"></div>
    </div>
  );
}
