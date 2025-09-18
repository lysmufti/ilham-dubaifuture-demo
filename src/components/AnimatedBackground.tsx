import React, { useState } from "react";

const AnimatedBackground: React.FC = () => {
  const [triangles] = useState(() => 
    Array.from({ length: 20 }).map((_, i) => {
      const size = 60 + Math.random() * 80; // 60–140px
      
      // Bias positions toward center using weighted random
      const centerBias = () => {
        const r1 = Math.random();
        const r2 = Math.random();
        const r3 = Math.random();
        return (r1 + r2 + r3) / 3; // Average of 3 randoms tends toward 0.5 (center)
      };
      
      const left = centerBias() * 100;
      const top = centerBias() * 100;
      const opacity = 0.05 + Math.random() * 0.03;
      const duration = 15 + Math.random() * 20; // 15–35s (much faster)
      const delay = -Math.random() * 10;
      const rotation = Math.random() * 360; // Random rotation 0-360 degrees

      return { id: i, size, left, top, opacity, duration, delay, rotation };
    })
  );

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
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
            animation: `slow-float ${t.duration}s linear infinite`,
            animationDelay: `${t.delay}s`,
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
      `}</style>
    </div>
  );
};

export default AnimatedBackground;