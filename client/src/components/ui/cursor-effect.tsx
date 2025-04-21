import { useEffect, useState } from 'react';

interface CursorPosition {
  x: number;
  y: number;
}

interface CursorEffectProps {
  color?: string;
  size?: number;
  trailLength?: number;
  trailOpacity?: number;
}

export function CursorEffect({
  color = 'rgba(234, 76, 137, 0.7)',
  size = 20,
  trailLength = 8,
  trailOpacity = 0.6
}: CursorEffectProps) {
  const [position, setPosition] = useState<CursorPosition>({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [trail, setTrail] = useState<CursorPosition[]>([]);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      setTrail(prevTrail => {
        const newTrail = [...prevTrail, { x: e.clientX, y: e.clientY }];
        if (newTrail.length > trailLength) {
          return newTrail.slice(newTrail.length - trailLength);
        }
        return newTrail;
      });
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', updatePosition);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [trailLength]);

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        pointerEvents: 'none',
        zIndex: 9999,
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Trail dots */}
      {trail.map((pos, index) => {
        const scale = 1 - (index / trail.length) * 0.6;
        const opacity = trailOpacity * (1 - index / trail.length);
        
        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: `${pos.x}px`,
              top: `${pos.y}px`,
              width: `${size * scale}px`,
              height: `${size * scale}px`,
              borderRadius: '50%',
              backgroundColor: color,
              opacity: opacity,
              transform: 'translate(-50%, -50%)',
              transition: 'opacity 0.2s, width 0.2s, height 0.2s',
            }}
          />
        );
      })}
      
      {/* Main cursor */}
      <div
        style={{
          position: 'absolute',
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '50%',
          backgroundColor: color,
          transform: 'translate(-50%, -50%)',
          boxShadow: `0 0 10px ${color}`,
          transition: 'width 0.2s, height 0.2s',
        }}
      />
    </div>
  );
}

export function HoverGlowEffect({ children }: { children: React.ReactNode }) {
  const [position, setPosition] = useState<CursorPosition | null>(null);
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isHovering) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPosition({ x, y });
  };

  return (
    <div
      className="relative overflow-hidden rounded-lg"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setPosition(null);
      }}
      onMouseMove={handleMouseMove}
    >
      {children}
      
      {position && isHovering && (
        <div
          className="absolute pointer-events-none"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            width: '250px',
            height: '250px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)',
            transform: 'translate(-50%, -50%)',
            zIndex: 1,
          }}
        />
      )}
    </div>
  );
}