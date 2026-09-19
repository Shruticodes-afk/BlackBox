import React, { useRef, useEffect } from 'react';
import Globe from 'react-globe.gl';

export default function GlobeComponent() {
  const globeEl = useRef();

  useEffect(() => {
    // Auto-rotate the globe slowly
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 1;
      globeEl.current.controls().enableZoom = false;
    }
  }, []);

  const markerData = [
    { lat: 37.7595, lng: -122.4367, size: 0.1, color: '#ccff00' }, // SF
    { lat: 40.7128, lng: -74.0060, size: 0.1, color: '#ccff00' },  // NY
    { lat: 51.5074, lng: -0.1278, size: 0.1, color: '#ccff00' },   // London
    { lat: 35.6895, lng: 139.6917, size: 0.1, color: '#ccff00' }   // Tokyo
  ];

  return (
    <div style={{ width: '600px', height: '600px', cursor: 'grab' }}>
      <Globe
        ref={globeEl}
        width={600}
        height={600}
        backgroundColor="rgba(0,0,0,0)"
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        pointsData={markerData}
        pointAltitude="size"
        pointColor="color"
        pointRadius={1.5}
        pointsMerge={true}
        atmosphereColor="#ccff00"
        atmosphereAltitude={0.15}
      />
    </div>
  );
}
