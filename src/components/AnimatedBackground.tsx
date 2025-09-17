import React from 'react';

const AnimatedBackground: React.FC = () => {
  const triangles = Array.from({ length: 15 }, (_, i) => {
    const size = 60 + Math.random() * 80; // 60-140px
    const left = Math.random() * 100;
    const top = Math.random() * 100;
    const animationType = ['animate-float-1', 'animate-float-2', 'animate-float-3'][i % 3];
    const opacity = i % 3 === 0 ? 'opacity-[0.05]' : i % 3 === 1 ? 'opacity-[0.06]' : 'opacity-[0.08]';
    
    return {
      id: i,
      size,
      left,
      top,
      animationType,
      opacity,
      delay: Math.random() * 40, // Random animation delay
    };
  });

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {triangles.map((triangle) => (
        <div
          key={triangle.id}
          className={`absolute border border-white/30 ${triangle.opacity} ${triangle.animationType}`}
          style={{
            left: `${triangle.left}%`,
            top: `${triangle.top}%`,
            width: `${triangle.size}px`,
            height: `${triangle.size}px`,
            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
            animationDelay: `${triangle.delay}s`,
            backgroundColor: `rgba(255, 255, 255, ${triangle.opacity === 'opacity-[0.05]' ? '0.02' : triangle.opacity === 'opacity-[0.06]' ? '0.03' : '0.04'})`,
          }}
        />
      ))}
    </div>
  );
};

export default AnimatedBackground;