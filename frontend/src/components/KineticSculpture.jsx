import React from 'react';

export default function KineticSculpture() {
  const path1 = "M 100 100 C 300 200, 200 400, 500 500";
  const path2 = "M 50 200 L 450 550";
  const path3 = "M 200 50 C 400 150, 300 350, 550 450";

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
          /* Explicit offset anchor to ensure it's centered on the path */
          offset-anchor: 50% 50%;
          /* Disable transform rotation auto-alignment just to keep the shadow perfect */
          offset-rotate: 0deg;
          box-shadow: 0 0 15px 4px rgba(204, 255, 0, 0.6);
          animation: slide linear infinite;
        }
        .ball-1 {
          offset-path: path('${path1}');
          animation-duration: 4s;
        }
        .ball-2 {
          offset-path: path('${path2}');
          animation-duration: 3.2s;
          background-color: #ffffff;
          box-shadow: 0 0 15px 4px rgba(255, 255, 255, 0.6);
          width: 12px;
          height: 12px;
        }
        .ball-3 {
          offset-path: path('${path3}');
          animation-duration: 4.8s;
        }
      `}</style>

      {/* SVG just to draw the visible tracks */}
      <svg width="600" height="600" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
        <path d={path1} stroke="#333" strokeWidth="8" fill="none" strokeLinecap="round" />
        <path d={path1} stroke="#ccff00" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.3" />
        
        <path d={path2} stroke="#333" strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d={path2} stroke="#ffffff" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.3" />
        
        <path d={path3} stroke="#333" strokeWidth="8" fill="none" strokeLinecap="round" />
        <path d={path3} stroke="#ccff00" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.3" />
      </svg>

      {/* Balls moving on the CSS offset paths */}
      <div className="ball ball-1"></div>
      <div className="ball ball-2"></div>
      <div className="ball ball-3"></div>
    </div>
  );
}
