import React, { useState } from "react";
import dffLogo from '@/assets/dff-logo.png';

interface AnimatedBackgroundProps {
  isStreaming?: boolean;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ isStreaming = false }) => {
  const [triangles] = useState(() => 
    Array.from({ length: 50 }).map((_, i) => {
      const size = 40 + Math.random() * 140; // 40–180px (increased variance)
      
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const opacity = (0.05 + Math.random() * 0.03) * 0.9; // Reduced by 10%
      const duration = 15 + Math.random() * 20; // 15–35s (much faster)
      const delay = -Math.random() * 10;
      const rotation = Math.random() * 360; // Random rotation 0-360 degrees
      const shimmerDelay = Math.random() * 3; // Pre-calculate shimmer delay
      const shimmerDuration = 3 + Math.random() * 2; // Pre-calculate shimmer duration

      return { id: i, size, left, top, opacity, duration, delay, rotation, shimmerDelay, shimmerDuration };
    })
  );

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      {/* Background Logo */}
      <div 
        className="absolute inset-0 flex items-center justify-center"
        style={{
          backgroundImage: `url(${dffLogo})`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: 'blur(39px)',
          opacity: isStreaming ? 0.4 : 0.2,
          transform: 'scale(1)',
          transition: 'opacity 2s ease-in-out',
        }}
      />
      
      {triangles.map((t) => (
        <div
          key={t.id}
          className="absolute"
          style={{
            left: `${t.left}%`,
            top: `${t.top}%`,
            width: `${t.size}px`,
            height: `${t.size}px`,
            clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
            backgroundColor: `rgba(255,255,255,${t.opacity})`,
            animation: `slow-float ${t.duration}s linear infinite, shimmer ${t.shimmerDuration}s ease-in-out infinite`,
            animationDelay: `${t.delay}s, ${t.shimmerDelay}s`,
            ['--rotation' as any]: `${t.rotation}deg`,
          } as React.CSSProperties}
        />
      ))}

      {/* Inline CSS so Tailwind can't purge it */}
      <style>{`
        @keyframes slow-float {
          0%   { transform: translate(0, 0) rotate(var(--rotation, 0deg)); }
          25%  { transform: translate(40px, -20px) rotate(calc(var(--rotation, 0deg) + 5deg)); }
          50%  { transform: translate(-30px, 40px) rotate(calc(var(--rotation, 0deg) - 3deg)); }
          75%  { transform: translate(20px, 20px) rotate(calc(var(--rotation, 0deg) + 2deg)); }
          100% { transform: translate(0, 0) rotate(var(--rotation, 0deg)); }
        }
        
        @keyframes shimmer {
          0%   { opacity: 1; filter: drop-shadow(0 0 2px rgba(255,255,255,0.3)); }
          50%  { opacity: 0.3; filter: drop-shadow(0 0 8px rgba(255,255,255,0.6)); }
          100% { opacity: 1; filter: drop-shadow(0 0 2px rgba(255,255,255,0.3)); }
        }
      `}</style>
    </div>
  );
};

export default AnimatedBackground;