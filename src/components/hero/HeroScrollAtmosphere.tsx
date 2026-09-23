import React, { useEffect, useRef } from 'react';

interface HeroScrollAtmosphereProps {
  scrollY: number;
}

export const HeroScrollAtmosphere: React.FC<HeroScrollAtmosphereProps> = ({ scrollY }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const lastScrollYRef = useRef<number>(scrollY);
  const scrollVelocityRef = useRef<number>(0);

  // Smooth scroll tracking for physics inertia
  useEffect(() => {
    const delta = scrollY - lastScrollYRef.current;
    lastScrollYRef.current = scrollY;
    scrollVelocityRef.current = Math.max(-20, Math.min(20, delta));
  }, [scrollY]);

  // Gentle, eye-friendly constellation canvas
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

    // Warm, soothing particle nodes
    const particleCount = Math.min(Math.floor(width / 32), 40);
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
      'rgba(52, 211, 153, ',  // Soft Mint
      'rgba(16, 185, 129, ',  // Emerald
      'rgba(45, 212, 191, ',  // Teal
      'rgba(226, 232, 240, ', // Warm soft ivory
    ];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.35,
        baseVy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 1.8 + 1,
        alpha: Math.random() * 0.35 + 0.25,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulsePhase: Math.random() * Math.PI * 2,
        color: colors[i % colors.length],
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const velocityBonus = scrollVelocityRef.current * 0.05;
      scrollVelocityRef.current *= 0.94;

      // Soft connections between nearby nodes
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 115) {
            const lineAlpha = (1 - dist / 115) * 0.12;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(52, 211, 153, ${lineAlpha})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }

      // Draw particle nodes
      particles.forEach((p) => {
        p.pulsePhase += p.pulseSpeed;
        const currentAlpha = Math.max(0.15, p.alpha + Math.sin(p.pulsePhase) * 0.14);

        p.x += p.vx;
        p.y += p.baseVy - velocityBonus;

        // Boundary wrapping
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
  const arcScale = 1 + scrollProgress * 0.09;
  const arcY = scrollY * 0.28;
  const gridOffsetY = (scrollY * 0.35) % 40;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {/* 1. Base Layer: Calming Executive Deep Slate-Graphite (Not pitch-black, zero eye-strain) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 130% 90% at 50% 15%, #182230 0%, #111822 55%, #0d141d 100%)',
        }}
      />

      {/* 2. Soft Ambient Forest & Emerald Glow (Warm & soothing, no harsh glare) */}
      <div
        className="absolute w-[850px] h-[520px] -top-[100px] left-1/2 -translate-x-1/2 rounded-full blur-[110px] will-change-transform pointer-events-none"
        style={{
          opacity: Math.max(0.35, 1 - scrollProgress * 0.6),
          transform: `translate3d(-50%, ${arcY * 0.4}px, 0) scale(${1 + scrollProgress * 0.12})`,
          background:
            'radial-gradient(50% 50% at 50% 50%, rgba(16, 185, 129, 0.14) 0%, rgba(13, 148, 136, 0.08) 50%, transparent 100%)',
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

      {/* 4. Concentric Orbital Arcs with Dual-Direction Rotation on Scroll */}
      <div
        className="absolute left-1/2 -translate-x-1/2 w-[1300px] h-[650px] bottom-[-220px] sm:bottom-[-180px] z-[2] will-change-transform"
        style={{
          transform: `translate3d(-50%, ${arcY}px, 0) scale(${arcScale})`,
          opacity: Math.max(0.3, 1 - scrollProgress * 0.7),
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
            <linearGradient id="soft-arc-outer" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
              <stop offset="20%" stopColor="#10b981" stopOpacity="0.35" />
              <stop offset="50%" stopColor="#34d399" stopOpacity="0.8" />
              <stop offset="80%" stopColor="#10b981" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </linearGradient>

            <linearGradient id="soft-arc-inner" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#34d399" stopOpacity="0" />
              <stop offset="30%" stopColor="#6ee7b7" stopOpacity="0.5" />
              <stop offset="50%" stopColor="#a7f3d0" stopOpacity="0.95" />
              <stop offset="70%" stopColor="#6ee7b7" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
            </linearGradient>

            <filter id="soft-arc-blur" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="14" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Gentle Ambient Background Aura */}
          <ellipse
            cx="650"
            cy="480"
            rx="520"
            ry="220"
            fill="none"
            stroke="#10b981"
            strokeWidth="28"
            opacity="0.12"
            filter="url(#soft-arc-blur)"
          />

          {/* Outer Dashed Orbit - Clockwise */}
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
              stroke="url(#soft-arc-outer)"
              strokeWidth="1.4"
              strokeDasharray="10 8 4 8"
              opacity="0.7"
            />
          </g>

          {/* Inner Architectural Beam - Counter-Clockwise */}
          <g
            style={{
              transformOrigin: '650px 480px',
              transform: `rotate(${arcRotate2}deg)`,
              transition: 'transform 0.08s linear',
            }}
          >
            {/* Soft Glow Path */}
            <path
              d="M 120 500 Q 650 220 1180 500"
              fill="none"
              stroke="url(#soft-arc-outer)"
              strokeWidth="8"
              opacity="0.3"
              filter="url(#soft-arc-blur)"
            />

            {/* Clean Beam */}
            <path
              d="M 120 500 Q 650 220 1180 500"
              fill="none"
              stroke="url(#soft-arc-inner)"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </g>
        </svg>
      </div>

      {/* 5. Minimalist Perspective Floor Grid */}
      <div
        className="absolute bottom-0 inset-x-0 h-[180px] pointer-events-none z-[1]"
        style={{
          maskImage:
            'linear-gradient(to top, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.12) 60%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to top, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.12) 60%, transparent 100%)',
          perspective: '600px',
        }}
      >
        <div
          className="w-full h-[360px] absolute bottom-0 left-0"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(52, 211, 153, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(52, 211, 153, 0.08) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            backgroundPosition: `0px ${gridOffsetY}px`,
            transform: 'rotateX(68deg) translateY(50px)',
            transformOrigin: 'bottom center',
          }}
        />
      </div>

      {/* 6. Top Vignette Fade for Seamless Header Integration */}
      <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-[#111822] via-[#111822]/80 to-transparent z-[3]" />
    </div>
  );
};
