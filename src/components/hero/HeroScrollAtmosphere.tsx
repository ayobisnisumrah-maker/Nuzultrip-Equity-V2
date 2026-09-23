import React, { useEffect, useRef } from 'react';

interface HeroScrollAtmosphereProps {
  scrollY: number;
}

export const HeroScrollAtmosphere: React.FC<HeroScrollAtmosphereProps> = ({ scrollY }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const lastScrollYRef = useRef<number>(scrollY);
  const scrollVelocityRef = useRef<number>(0);

  // Smooth scroll tracking
  useEffect(() => {
    const delta = scrollY - lastScrollYRef.current;
    lastScrollYRef.current = scrollY;
    scrollVelocityRef.current = Math.max(-20, Math.min(20, delta));
  }, [scrollY]);

  // Clean light-theme constellation canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Light-theme particles: delicate emerald and soft slate nodes
    const particleCount = Math.min(Math.floor(width / 32), 36);
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      baseVy: number;
      radius: number;
      alpha: number;
      pulseSpeed: number;
      pulsePhase: number;
      color: string;
    }> = [];

    const colors = [
      'rgba(5, 150, 105, ',   // Deep Emerald
      'rgba(16, 185, 129, ',  // Bright Emerald
      'rgba(52, 211, 153, ',  // Soft Mint
      'rgba(71, 85, 105, ',   // Slate neutral
    ];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.4,
        baseVy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1,
        alpha: Math.random() * 0.4 + 0.25,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulsePhase: Math.random() * Math.PI * 2,
        color: colors[i % colors.length],
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const velocityBonus = scrollVelocityRef.current * 0.05;
      scrollVelocityRef.current *= 0.94;

      // Draw faint connections between nearby nodes
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            const lineAlpha = (1 - dist / 110) * 0.15;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(16, 185, 129, ${lineAlpha})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }

      // Draw particles
      particles.forEach((p) => {
        p.pulsePhase += p.pulseSpeed;
        const currentAlpha = Math.max(0.12, p.alpha + Math.sin(p.pulsePhase) * 0.15);

        p.x += p.vx;
        p.y += p.baseVy - velocityBonus;

        // Wrap around boundaries
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${currentAlpha})`;
        ctx.fill();
      });

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  // Parallax mathematical calculations based on scroll position
  const scrollProgress = Math.min(Math.max(scrollY / 700, 0), 1);
  const arcRotate1 = scrollY * 0.035;
  const arcRotate2 = -scrollY * 0.025;
  const arcScale = 1 + scrollProgress * 0.1;
  const arcY = scrollY * 0.28;
  const gridOffsetY = (scrollY * 0.35) % 40;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {/* 1. Light Luxury Pearl & Subtle Mint Gradient Base */}
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          background:
            'radial-gradient(ellipse 120% 90% at 50% 10%, #FFFFFF 0%, #F6F8F7 50%, #EDF2EF 100%)',
        }}
      />

      {/* 2. Soft Ambient Emerald Light Dome */}
      <div
        className="absolute w-[800px] h-[500px] -top-[120px] left-1/2 -translate-x-1/2 rounded-full blur-[130px] will-change-transform pointer-events-none"
        style={{
          opacity: Math.max(0.3, 1 - scrollProgress * 0.6),
          transform: `translate3d(-50%, ${arcY * 0.4}px, 0) scale(${1 + scrollProgress * 0.15})`,
          background:
            'radial-gradient(50% 50% at 50% 50%, rgba(16, 185, 129, 0.18) 0%, rgba(52, 211, 153, 0.09) 45%, transparent 100%)',
          transition: 'transform 0.1s ease-out',
        }}
      />

      {/* 3. Interactive Constellation Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-[1] will-change-transform"
        style={{
          opacity: Math.max(0.4, 1 - scrollProgress * 0.6),
          transform: `translate3d(0, ${-scrollY * 0.12}px, 0)`,
        }}
      />

      {/* 4. Luminous Concentric Orbital Arcs in Clean Emerald on Light */}
      <div
        className="absolute left-1/2 -translate-x-1/2 w-[1300px] h-[650px] bottom-[-220px] sm:bottom-[-180px] z-[2] will-change-transform"
        style={{
          transform: `translate3d(-50%, ${arcY}px, 0) scale(${arcScale})`,
          opacity: Math.max(0.35, 1 - scrollProgress * 0.7),
          transition: 'transform 0.1s ease-out',
        }}
      >
        <svg
          viewBox="0 0 1300 650"
          className="w-full h-full overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="light-arc-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#059669" stopOpacity="0" />
              <stop offset="20%" stopColor="#059669" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#10b981" stopOpacity="0.9" />
              <stop offset="80%" stopColor="#059669" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#059669" stopOpacity="0" />
            </linearGradient>

            <linearGradient id="light-arc-core" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
              <stop offset="30%" stopColor="#34d399" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#059669" stopOpacity="1" />
              <stop offset="70%" stopColor="#34d399" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </linearGradient>

            <filter id="light-arc-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="16" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Soft Ambient Background Aura */}
          <ellipse
            cx="650"
            cy="480"
            rx="520"
            ry="220"
            fill="none"
            stroke="#10b981"
            strokeWidth="32"
            opacity="0.12"
            filter="url(#light-arc-glow)"
          />

          {/* Outer Dashed Orbit - Rotates Clockwise on Scroll */}
          <g
            style={{
              transformOrigin: '650px 480px',
              transform: `rotate(${arcRotate1}deg)`,
              transition: 'transform 0.08s linear',
            }}
          >
            <ellipse
              cx="650"
              cy="480"
              rx="540"
              ry="230"
              fill="none"
              stroke="url(#light-arc-grad)"
              strokeWidth="1.5"
              strokeDasharray="10 8 4 8"
              opacity="0.65"
            />
          </g>

          {/* Inner Sharp Architectural Arc - Rotates Counter-Clockwise on Scroll */}
          <g
            style={{
              transformOrigin: '650px 480px',
              transform: `rotate(${arcRotate2}deg)`,
              transition: 'transform 0.08s linear',
            }}
          >
            {/* Soft glow trail */}
            <path
              d="M 120 500 Q 650 220 1180 500"
              fill="none"
              stroke="url(#light-arc-grad)"
              strokeWidth="10"
              opacity="0.3"
              filter="url(#light-arc-glow)"
            />

            {/* Crisp center beam */}
            <path
              d="M 120 500 Q 650 220 1180 500"
              fill="none"
              stroke="url(#light-arc-core)"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </g>
        </svg>
      </div>

      {/* 5. Minimalist Perspective Floor Grid in Light Emerald */}
      <div
        className="absolute bottom-0 inset-x-0 h-[180px] pointer-events-none z-[1]"
        style={{
          maskImage:
            'linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.15) 60%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.15) 60%, transparent 100%)',
          perspective: '600px',
        }}
      >
        <div
          className="w-full h-[360px] absolute bottom-0 left-0"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(16, 185, 129, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(16, 185, 129, 0.08) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            backgroundPosition: `0px ${gridOffsetY}px`,
            transform: 'rotateX(68deg) translateY(50px)',
            transformOrigin: 'bottom center',
          }}
        />
      </div>

      {/* 6. Top Gradient Fade for Seamless Top Header Blending */}
      <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-[#FFFFFF] via-[#FFFFFF]/80 to-transparent z-[3]" />
    </div>
  );
};
