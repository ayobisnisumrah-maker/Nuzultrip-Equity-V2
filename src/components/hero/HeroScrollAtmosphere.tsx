import React, { useEffect, useRef, useState } from 'react';

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
    scrollVelocityRef.current = Math.max(-25, Math.min(25, delta));
  }, [scrollY]);

  // Canvas particle constellation with scroll inertia
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

    // Generate minimalist particle nodes
    const particleCount = Math.min(Math.floor(width / 22), 48);
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
      'rgba(52, 211, 153, ',  // Emerald #34d399
      'rgba(16, 185, 129, ',  // Emerald #10b981
      'rgba(167, 243, 208, ', // Mint #a7f3d0
      'rgba(255, 255, 255, ', // White
    ];

    for (let i = 0; i < particleCount; i++) {
      const baseVy = (Math.random() - 0.5) * 0.35;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: baseVy,
        baseVy,
        radius: Math.random() * 1.6 + 1.2,
        alpha: Math.random() * 0.45 + 0.25,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulsePhase: Math.random() * Math.PI * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // Dampen scroll velocity
      scrollVelocityRef.current *= 0.92;
      const scrollDrift = scrollVelocityRef.current * 0.8;

      ctx.clearRect(0, 0, width, height);

      // Connect nearby particles with subtle filament lines
      const maxDistance = Math.min(130, width * 0.16);
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const lineAlpha = (1 - dist / maxDistance) * 0.18 * Math.min(particles[i].alpha, particles[j].alpha);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(52, 211, 153, ${lineAlpha})`;
            ctx.lineWidth = 0.85;
            ctx.stroke();
          }
        }
      }

      // Draw and update each particle
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Organic oscillation
        p.pulsePhase += p.pulseSpeed;
        const currentAlpha = p.alpha + Math.sin(p.pulsePhase) * 0.15;

        // Position update with scroll velocity reaction
        p.x += p.vx;
        p.y += p.baseVy - scrollDrift;

        // Wrap around viewport boundaries
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        // Soft glow halo
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 2.8, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${Math.max(0, currentAlpha * 0.25)})`;
        ctx.fill();

        // Core particle point
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${Math.max(0, currentAlpha)})`;
        ctx.fill();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Parallax mathematical calculations based on scroll position
  const scrollProgress = Math.min(Math.max(scrollY / 700, 0), 1);
  const arcRotate1 = scrollY * 0.04;
  const arcRotate2 = -scrollY * 0.03;
  const arcScale = 1 + scrollProgress * 0.12;
  const arcY = scrollY * 0.35;
  const horizonOpacity = Math.max(0.2, 1 - scrollProgress * 0.7);
  const gridOffsetY = (scrollY * 0.4) % 40;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {/* 1. Deep Midnight Base Canvas with subtle radial gradient */}
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          background: 'radial-gradient(ellipse 120% 85% at 50% 15%, #0d121f 0%, #08090f 50%, #05060a 100%)',
        }}
      />

      {/* 2. Dynamic Scroll-Responsive Ambient Aurora Light */}
      <div
        className="absolute w-[900px] h-[550px] -top-[100px] left-1/2 -translate-x-1/2 rounded-full blur-[120px] will-change-transform"
        style={{
          opacity: horizonOpacity,
          transform: `translate3d(-50%, ${arcY * 0.5}px, 0) scale(${1 + scrollProgress * 0.2})`,
          background:
            'radial-gradient(50% 50% at 50% 50%, rgba(16, 185, 129, 0.22) 0%, rgba(5, 150, 105, 0.12) 40%, rgba(6, 78, 59, 0.04) 70%, transparent 100%)',
          transition: 'transform 0.1s ease-out',
        }}
      />

      {/* 3. Interactive Constellation Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-[1] will-change-transform"
        style={{
          opacity: Math.max(0.3, 1 - scrollProgress * 0.65),
          transform: `translate3d(0, ${-scrollY * 0.15}px, 0)`,
        }}
      />

      {/* 4. Concentric Luminous Orbital Arcs with Dual-Direction Rotation on Scroll */}
      <div
        className="absolute left-1/2 -translate-x-1/2 w-[1400px] h-[700px] bottom-[-200px] sm:bottom-[-160px] z-[2] will-change-transform"
        style={{
          transform: `translate3d(-50%, ${arcY}px, 0) scale(${arcScale})`,
          opacity: Math.max(0.15, 1 - scrollProgress * 0.8),
          transition: 'transform 0.1s ease-out',
        }}
      >
        <svg
          viewBox="0 0 1400 700"
          className="w-full h-full overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Emerald Core Linear Gradient */}
            <linearGradient id="arc-grad-outer" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
              <stop offset="15%" stopColor="#10b981" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#34d399" stopOpacity="0.85" />
              <stop offset="85%" stopColor="#10b981" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </linearGradient>

            <linearGradient id="arc-grad-inner" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#34d399" stopOpacity="0" />
              <stop offset="25%" stopColor="#6ee7b7" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="75%" stopColor="#6ee7b7" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
            </linearGradient>

            {/* Gaussian Blur Glow Filters */}
            <filter id="arc-glow-blur" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="24" result="blur1" />
              <feGaussianBlur stdDeviation="8" result="blur2" />
              <feMerge>
                <feMergeNode in="blur1" />
                <feMergeNode in="blur2" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="arc-soft-mist" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="60" />
            </filter>
          </defs>

          {/* Deep Ambient Arc Aura */}
          <ellipse
            cx="700"
            cy="520"
            rx="560"
            ry="240"
            fill="none"
            stroke="#10b981"
            strokeWidth="38"
            opacity="0.2"
            filter="url(#arc-soft-mist)"
          />

          {/* Outer Orbital Ring - Rotates Clockwise on Scroll */}
          <g
            style={{
              transformOrigin: '700px 520px',
              transform: `rotate(${arcRotate1}deg)`,
              transition: 'transform 0.08s linear',
            }}
          >
            <ellipse
              cx="700"
              cy="520"
              rx="580"
              ry="260"
              fill="none"
              stroke="url(#arc-grad-outer)"
              strokeWidth="1.6"
              strokeDasharray="12 8 4 8"
              opacity="0.75"
            />
          </g>

          {/* Inner Sharp Luminous Arc - Rotates Counter-Clockwise on Scroll */}
          <g
            style={{
              transformOrigin: '700px 520px',
              transform: `rotate(${arcRotate2}deg)`,
              transition: 'transform 0.08s linear',
            }}
          >
            {/* Glow backing */}
            <path
              d="M 120 540 Q 700 240 1280 540"
              fill="none"
              stroke="url(#arc-grad-outer)"
              strokeWidth="14"
              opacity="0.45"
              filter="url(#arc-glow-blur)"
            />

            {/* Crisp center beam */}
            <path
              d="M 120 540 Q 700 240 1280 540"
              fill="none"
              stroke="url(#arc-grad-inner)"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
          </g>
        </svg>
      </div>

      {/* 5. Minimalist Perspective Horizon Grid (Gently moves on scroll) */}
      <div
        className="absolute bottom-0 inset-x-0 h-[220px] pointer-events-none z-[1]"
        style={{
          maskImage: 'linear-gradient(to top, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.15) 50%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.15) 50%, transparent 100%)',
          perspective: '600px',
        }}
      >
        <div
          className="w-full h-[400px] absolute bottom-0 left-0"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(16, 185, 129, 0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(16, 185, 129, 0.07) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            backgroundPosition: `0px ${gridOffsetY}px`,
            transform: 'rotateX(68deg) translateY(60px)',
            transformOrigin: 'bottom center',
          }}
        />
      </div>

      {/* 6. Top Vignette Shadow for Seamless Navigation Blending */}
      <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-[#08090f] via-[#08090f]/70 to-transparent z-[3]" />
    </div>
  );
};
