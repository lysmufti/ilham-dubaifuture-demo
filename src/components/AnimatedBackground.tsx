import React from 'react';

const AnimatedBackground: React.FC = () => {
  const triangles = Array.from({ length: 12 }, (_, i) => {
    const size = 60 + Math.random() * 80; // 60-140px
    const left = Math.random() * 100;
    const top = Math.random() * 100;
    const animationType = ['animate-float-1', 'animate-float-2', 'animate-float-3'][i % 3];
    const opacity = i % 2 === 0 ? 'opacity-[0.05]' : 'opacity-[0.08]';
    
    return {
      id: i,
      size,
      left,
      top,
      animationType,
      opacity,
      delay: Math.random() * 30, // Random animation delay
    };
  });

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {triangles.map((triangle) => (
        <div
          key={triangle.id}
          className={`absolute border border-white/20 ${triangle.opacity} ${triangle.animationType}`}
          style={{
            left: `${triangle.left}%`,
            top: `${triangle.top}%`,
            width: `${triangle.size}px`,
            height: `${triangle.size}px`,
            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
            animationDelay: `${triangle.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

export default AnimatedBackground;