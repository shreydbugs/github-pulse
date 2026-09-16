import { useEffect, useRef, useState } from 'react';
import createGlobe from 'cobe';

function Globe({ locations }) {
  const canvasRef = useRef();
  const pointerInteracting = useRef(null);
  const pointerInteractionMovement = useRef(0);
  const [phi, setPhi] = useState(0);

  useEffect(() => {
    let currentPhi = phi;
    
    // Convert locations to COBE markers
    // COBE markers are { location: [lat, lon], size: number }
    const markers = locations.map(loc => {
      // Normalize size based on count, max size 0.1 for aesthetic reasons
      const size = Math.min(0.1, 0.02 + (loc.count * 0.005));
      return {
        location: loc.coordinates,
        size
      };
    });

    const onResize = () => {
      if (canvasRef.current) {
        canvasRef.current.style.width = '100%';
        canvasRef.current.style.height = '100%';
      }
    };
    window.addEventListener('resize', onResize);
    onResize();

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: canvasRef.current.offsetWidth * 2,
      height: canvasRef.current.offsetHeight * 2,
      phi: currentPhi,
      theta: 0.15,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.1, 0.1, 0.1],
      markerColor: [0.23, 0.51, 0.96], // blue accent
      glowColor: [0.05, 0.05, 0.1],
      markers: markers,
      onRender: (state) => {
        // Auto rotate if not interacting
        if (!pointerInteracting.current) {
          currentPhi += 0.002;
        }
        state.phi = currentPhi + pointerInteractionMovement.current;
        setPhi(state.phi); // Keep state updated for re-renders
      },
    });

    return () => {
      globe.destroy();
      window.removeEventListener('resize', onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locations]); // Re-init when locations change significantly, though could be optimized

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%', cursor: 'grab' }}
        onPointerDown={(e) => {
          pointerInteracting.current = e.clientX;
          if (canvasRef.current) canvasRef.current.style.cursor = 'grabbing';
        }}
        onPointerUp={() => {
          pointerInteracting.current = null;
          if (canvasRef.current) canvasRef.current.style.cursor = 'grab';
        }}
        onPointerOut={() => {
          pointerInteracting.current = null;
          if (canvasRef.current) canvasRef.current.style.cursor = 'grab';
        }}
        onPointerMove={(e) => {
          if (pointerInteracting.current !== null) {
            const delta = e.clientX - pointerInteracting.current;
            pointerInteractionMovement.current = delta * 0.01;
          }
        }}
        onWheel={() => {
          // Optional: handle zoom or prevent default
        }}
      />
    </div>
  );
}

import { memo } from 'react';
export default memo(Globe);
