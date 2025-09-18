import React from "react";

const AnimatedBackground: React.FC = () => {
  const triangles = Array.from({ length: 12 }).map((_, i) => {
    const size = 60 + Math.random() * 80; // 60–140px
    const left = Math.random() * 100;
    const top = Math.random() * 100;
    const opacity = 0.05 + Math.random() * 0.03;
    const duration = 15 + Math.random() * 20; // 15–35s (much faster)
    const delay = -Math.random() * 10;

    return { id: i, size, left, top, opacity, duration, delay };
  });

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
          }}
        />
      ))}

      {/* Inline CSS so Tailwind can't purge it */}
      <style>{`
        @keyframes slow-float {
          0%   { transform: translate(0, 0) rotate(0deg); }
          25%  { transform: translate(40px, -20px) rotate(5deg); }
          50%  { transform: translate(-30px, 40px) rotate(-3deg); }
          75%  { transform: translate(20px, 20px) rotate(2deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }
      `}</style>
    </div>
  );
};

export default AnimatedBackground;