import React from 'react';
import { Settings, Hexagon } from 'lucide-react';

export default function KineticSculpture() {
  const path1 = "M 100 100 C 250 100, 300 150, 300 300 C 300 450, 350 500, 500 500";
  const path2 = "M 500 100 C 350 100, 300 150, 300 300 C 300 450, 250 500, 100 500";
  const path3 = "M 300 100 L 300 500"; // straight vertical pipeline

  return (
    <div style={{ width: '600px', height: '600px', position: 'relative' }}>
      <style>{`
        @keyframes slide {
          0% { offset-distance: 0%; }
          100% { offset-distance: 100%; }
        }
        @keyframes spin {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes spin-reverse {
          0% { transform: translate(-50%, -50%) rotate(360deg); }
          100% { transform: translate(-50%, -50%) rotate(0deg); }
        }
        .data-packet {
          position: absolute;
          width: 14px;
          height: 14px;
          background-color: #ccff00;
          border-radius: 50%;
          top: 0;
          left: 0;
          offset-anchor: 50% 50%;
          offset-rotate: 0deg;
          box-shadow: 0 0 15px 4px rgba(204, 255, 0, 0.7);
          animation: slide linear infinite;
        }
        .packet-1 { offset-path: path('${path1}'); animation-duration: 4s; }
        .packet-2 { offset-path: path('${path2}'); animation-duration: 3.5s; background-color: #ffffff; box-shadow: 0 0 15px 4px rgba(255, 255, 255, 0.7); width: 10px; height: 10px; animation-delay: 1s; }
        .packet-3 { offset-path: path('${path3}'); animation-duration: 5s; width: 12px; height: 12px; animation-delay: 2s; }
        .packet-4 { offset-path: path('${path1}'); animation-duration: 4s; animation-delay: 2s; }
        .packet-5 { offset-path: path('${path2}'); animation-duration: 3.5s; background-color: #ffffff; box-shadow: 0 0 15px 4px rgba(255, 255, 255, 0.7); width: 10px; height: 10px; animation-delay: 2.75s; }

        .gear {
          transform: translate(-50%, -50%);
          position: absolute;
          top: 300px;
          left: 300px;
          color: #555;
          animation: spin 10s linear infinite;
        }
        .gear-small {
          transform: translate(-50%, -50%);
          position: absolute;
          top: 300px;
          left: 300px;
          color: #ccff00;
          animation: spin-reverse 6s linear infinite;
        }
        .hub {
          position: absolute;
          top: 300px;
          left: 300px;
          color: #222;
          transform: translate(-50%, -50%);
        }
      `}</style>

      {/* Background SVG for pipelines */}
      <svg width="600" height="600" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="metal-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#111" />
            <stop offset="50%" stopColor="#333" />
            <stop offset="100%" stopColor="#111" />
          </linearGradient>
          <linearGradient id="neon-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ccff00" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#88aa00" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Path 3 (Vertical Center) */}
        <path d={path3} stroke="url(#metal-grad)" strokeWidth="16" fill="none" strokeLinecap="round" />
        <path d={path3} stroke="url(#neon-grad)" strokeWidth="4" fill="none" strokeLinecap="round" />

        {/* Path 1 */}
        <path d={path1} stroke="url(#metal-grad)" strokeWidth="16" fill="none" strokeLinecap="round" />
        <path d={path1} stroke="url(#neon-grad)" strokeWidth="4" fill="none" strokeLinecap="round" />
        
        {/* Path 2 */}
        <path d={path2} stroke="url(#metal-grad)" strokeWidth="16" fill="none" strokeLinecap="round" />
        <path d={path2} stroke="url(#neon-grad)" strokeWidth="4" fill="none" strokeLinecap="round" />
      </svg>

      {/* Mechanical Hubs & Gears */}
      <Settings size={80} className="gear" strokeWidth={1.5} />
      <Settings size={40} className="gear-small" strokeWidth={2} />
      <Hexagon size={32} className="hub" fill="#111" stroke="#ccff00" strokeWidth={2} />

      {/* Data Packets (Glowing Balls) */}
      <div className="data-packet packet-1"></div>
      <div className="data-packet packet-2"></div>
      <div className="data-packet packet-3"></div>
      <div className="data-packet packet-4"></div>
      <div className="data-packet packet-5"></div>
    </div>
  );
}
