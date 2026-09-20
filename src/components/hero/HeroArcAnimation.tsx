import React, { useEffect, useRef, useState, useCallback } from 'react';

export interface ArcLayer {
  color: string;
  width: number;
  blur: number;
  opacity: number;
  y: number;
}

export interface ArcConfig {
  accentColor: string;
  lineThick: number;
  centerBright: number;
  edgeBright: number;
  edgeColor: string;
  centerColor: string;
  layers: ArcLayer[];
  drawDuration: number;
  glowDelay: number;
  glowFade: number;
  breathSpeed: number;
  breathIntensity: number;
  breathDrift: number;
}

export const ARC_PRESETS: Record<string, { name: string; label: string; config: ArcConfig; colors: [string, string] }> = {
  emerald: {
    name: 'emerald',
    label: 'Madinah Emerald',
    colors: ['#10b981', '#ffffff'],
    config: {
      accentColor: '#059669',
      lineThick: 2.5,
      centerBright: 0.75,
      edgeBright: 0.08,
      edgeColor: '#34d399',
      centerColor: '#ffffff',
      layers: [
        { color: '#000000', width: 250, blur: 150, opacity: 0.48, y: 150 },
        { color: '#064e3b', width: 43, blur: 21, opacity: 0.48, y: 15 },
        { color: '#064e3b', width: 300, blur: 100, opacity: 0.37, y: -125 },
        { color: '#34d399', width: 60, blur: 41, opacity: 0.59, y: -27 },
        { color: '#a7f3d0', width: 27, blur: 13, opacity: 0.51, y: -15 },
      ],
      drawDuration: 3,
      glowDelay: 0.5,
      glowFade: 1,
      breathSpeed: 5,
      breathIntensity: 0.2,
      breathDrift: 1,
    },
  },
  gold: {
    name: 'gold',
    label: 'Kiswa Gold',
    colors: ['#f59e0b', '#fef3c7'],
    config: {
      accentColor: '#d97706',
      lineThick: 2.8,
      centerBright: 0.9,
      edgeBright: 0.14,
      edgeColor: '#f59e0b',
      centerColor: '#fffbeb',
      layers: [
        { color: '#000000', width: 250, blur: 150, opacity: 0.48, y: 150 },
        { color: '#78350f', width: 46, blur: 22, opacity: 0.5, y: 15 },
        { color: '#92400e', width: 300, blur: 100, opacity: 0.4, y: -125 },
        { color: '#f59e0b', width: 62, blur: 42, opacity: 0.65, y: -27 },
        { color: '#fde68a', width: 27, blur: 13, opacity: 0.55, y: -15 },
      ],
      drawDuration: 2.8,
      glowDelay: 0.45,
      glowFade: 1.0,
      breathSpeed: 5.0,
      breathIntensity: 0.22,
      breathDrift: 1.2,
    },
  },
  blue: {
    name: 'blue',
    label: 'Zamzam Azure',
    colors: ['#60a5fa', '#ffffff'],
    config: {
      accentColor: '#2563eb',
      lineThick: 2.5,
      centerBright: 0.75,
      edgeBright: 0.08,
      edgeColor: '#60a5fa',
      centerColor: '#ffffff',
      layers: [
        { color: '#000000', width: 250, blur: 150, opacity: 0.48, y: 150 },
        { color: '#173e87', width: 43, blur: 21, opacity: 0.48, y: 15 },
        { color: '#173e87', width: 300, blur: 100, opacity: 0.37, y: -125 },
        { color: '#60a5fa', width: 60, blur: 41, opacity: 0.59, y: -27 },
        { color: '#88b5ec', width: 27, blur: 13, opacity: 0.51, y: -15 },
      ],
      drawDuration: 3,
      glowDelay: 0.5,
      glowFade: 1,
      breathSpeed: 5,
      breathIntensity: 0.2,
      breathDrift: 1,
    },
  },
  cyan: {
    name: 'cyan',
    label: 'Electric Cyan',
    colors: ['#22d3ee', '#ffffff'],
    config: {
      accentColor: '#0891b2',
      lineThick: 3,
      centerBright: 0.85,
      edgeBright: 0.12,
      edgeColor: '#22d3ee',
      centerColor: '#ffffff',
      layers: [
        { color: '#000000', width: 280, blur: 160, opacity: 0.5, y: 150 },
        { color: '#0e4a5c', width: 50, blur: 25, opacity: 0.5, y: 15 },
        { color: '#0e7490', width: 320, blur: 110, opacity: 0.42, y: -125 },
        { color: '#22d3ee', width: 70, blur: 48, opacity: 0.65, y: -27 },
        { color: '#67e8f9', width: 30, blur: 14, opacity: 0.55, y: -15 },
      ],
      drawDuration: 2.2,
      glowDelay: 0.3,
      glowFade: 0.7,
      breathSpeed: 3.8,
      breathIntensity: 0.28,
      breathDrift: 1.8,
    },
  },
  silver: {
    name: 'silver',
    label: 'Obsidian Silver',
    colors: ['#94a3b8', '#e2e8f0'],
    config: {
      accentColor: '#64748b',
      lineThick: 1.8,
      centerBright: 0.6,
      edgeBright: 0.05,
      edgeColor: '#94a3b8',
      centerColor: '#f8fafc',
      layers: [
        { color: '#000000', width: 220, blur: 130, opacity: 0.35, y: 150 },
        { color: '#1e293b', width: 34, blur: 16, opacity: 0.35, y: 15 },
        { color: '#1e293b', width: 220, blur: 85, opacity: 0.25, y: -125 },
        { color: '#64748b', width: 44, blur: 32, opacity: 0.4, y: -27 },
        { color: '#94a3b8', width: 22, blur: 11, opacity: 0.35, y: -15 },
      ],
      drawDuration: 3.5,
      glowDelay: 0.6,
      glowFade: 1.2,
      breathSpeed: 6.5,
      breathIntensity: 0.15,
      breathDrift: 0.8,
    },
  },
};

const LAYER_IDS = ['l2', 'l1', 'u2', 'u1', 'inner'];
const LAYER_FILTER_REGIONS: Record<string, { fy: string; fh: string }> = {
  l2: { fy: '-300%', fh: '700%' },
  l1: { fy: '-60%', fh: '220%' },
  u2: { fy: '-250%', fh: '600%' },
  u1: { fy: '-120%', fh: '340%' },
  inner: { fy: '-40%', fh: '180%' },
};

const GLOW_STOPS = [
  { offset: '0%', opacity: 0 },
  { offset: '12%', opacity: 0.25 },
  { offset: '35%', opacity: 0.65 },
  { offset: '50%', opacity: 1 },
  { offset: '65%', opacity: 0.65 },
  { offset: '88%', opacity: 0.25 },
  { offset: '100%', opacity: 0 },
];

function calculateArcDimensions() {
  if (typeof window === 'undefined') {
    return { svgW: 1400, svgH: 800, d: 'M -100 500 Q 600 250 1300 500', bottom: 20 };
  }
  const w = window.innerWidth;
  const h = window.innerHeight;
  const s = Math.min(Math.max(0.28 * w, 200), 500);
  const r = s + 250;
  const d = `M -100 ${r} Q ${w / 2} 250 ${w + 100} ${r}`;
  // Turunkan posisi kurva arc agar cahaya bulan membingkai bagian bawah tanpa mengganggu tulisan dan tombol
  const bottom = Math.min(Math.max(0.26 * h, 150), 380) + (s - 200) * 0.35 - r - 70;
  return { svgW: w + 200, svgH: s + 500, d, bottom };
}

interface HeroArcAnimationProps {
  config: ArcConfig;
  replayKey?: number;
  onDrawComplete?: () => void;
}

export const HeroArcAnimation: React.FC<HeroArcAnimationProps> = ({
  config,
  replayKey = 0,
  onDrawComplete,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const elementsRef = useRef<{
    svg: SVGSVGElement;
    linePath: SVGPathElement;
    glowGroup: SVGGElement;
    glowPaths: SVGPathElement[];
  } | null>(null);

  const animFrameRef = useRef<number | null>(null);
  const hasTriggeredDrawComplete = useRef(false);
  const pathTotalLength = useRef(0);
  const configRef = useRef(config);
  configRef.current = config;

  // Build SVG DOM with glow layers and linear gradients
  const buildSvg = useCallback((instant = false) => {
    const container = containerRef.current;
    if (!container) return;

    const currentConfig = configRef.current;
    const { svgW, svgH, d, bottom } = calculateArcDimensions();
    const SVG_NS = 'http://www.w3.org/2000/svg';

    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('width', String(svgW));
    svg.setAttribute('height', String(svgH));
    svg.setAttribute('viewBox', `-100 0 ${svgW} ${svgH}`);
    svg.style.cssText = `position:absolute;bottom:${bottom}px;left:-100px;overflow:visible;pointer-events:none;`;

    const defs = document.createElementNS(SVG_NS, 'defs');

    // Arc line main gradient
    const lineGrad = document.createElementNS(SVG_NS, 'linearGradient');
    lineGrad.setAttribute('id', 'ha-lg');
    lineGrad.setAttribute('x1', '0%');
    lineGrad.setAttribute('x2', '100%');

    const lineStops = [
      { offset: '0%', color: currentConfig.edgeColor, opacity: 0 },
      { offset: '8%', color: currentConfig.edgeColor, opacity: currentConfig.edgeBright },
      { offset: '30%', color: currentConfig.edgeColor, opacity: 0.6 * currentConfig.centerBright },
      { offset: '50%', color: currentConfig.centerColor, opacity: currentConfig.centerBright },
      { offset: '70%', color: currentConfig.edgeColor, opacity: 0.6 * currentConfig.centerBright },
      { offset: '92%', color: currentConfig.edgeColor, opacity: currentConfig.edgeBright },
      { offset: '100%', color: currentConfig.edgeColor, opacity: 0 },
    ];

    lineStops.forEach((st) => {
      const stop = document.createElementNS(SVG_NS, 'stop');
      stop.setAttribute('offset', st.offset);
      stop.setAttribute('stop-color', st.color);
      stop.setAttribute('stop-opacity', String(st.opacity));
      lineGrad.appendChild(stop);
    });
    defs.appendChild(lineGrad);

    // Build filter and gradients for each glow layer
    for (let i = 0; i < LAYER_IDS.length; i++) {
      const layerId = LAYER_IDS[i];
      const layerData = currentConfig.layers[i] || currentConfig.layers[0];
      const region = LAYER_FILTER_REGIONS[layerId];

      const glowGrad = document.createElementNS(SVG_NS, 'linearGradient');
      glowGrad.setAttribute('id', `ha-gg-${layerId}`);
      glowGrad.setAttribute('x1', '0%');
      glowGrad.setAttribute('x2', '100%');

      GLOW_STOPS.forEach((gst) => {
        const stop = document.createElementNS(SVG_NS, 'stop');
        stop.setAttribute('offset', gst.offset);
        stop.setAttribute('stop-color', layerData.color);
        stop.setAttribute('stop-opacity', String(gst.opacity));
        glowGrad.appendChild(stop);
      });
      defs.appendChild(glowGrad);

      // Filter with feGaussianBlur
      const filter = document.createElementNS(SVG_NS, 'filter');
      filter.setAttribute('id', `ha-f-${layerId}`);
      filter.setAttribute('x', '-15%');
      filter.setAttribute('y', region.fy);
      filter.setAttribute('width', '130%');
      filter.setAttribute('height', region.fh);

      const blur = document.createElementNS(SVG_NS, 'feGaussianBlur');
      blur.setAttribute('stdDeviation', String(layerData.blur));
      filter.appendChild(blur);
      defs.appendChild(filter);
    }

    svg.appendChild(defs);

    // Glow Group
    const glowGroup = document.createElementNS(SVG_NS, 'g');
    glowGroup.setAttribute('opacity', instant ? '1' : '0');
    const glowPaths: SVGPathElement[] = [];

    for (let i = 0; i < LAYER_IDS.length; i++) {
      const layerId = LAYER_IDS[i];
      const layerData = currentConfig.layers[i] || currentConfig.layers[0];

      const path = document.createElementNS(SVG_NS, 'path');
      path.setAttribute('d', d);
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', `url(#ha-gg-${layerId})`);
      path.setAttribute('stroke-width', String(layerData.width));
      path.setAttribute('stroke-linecap', 'round');
      path.setAttribute('filter', `url(#ha-f-${layerId})`);
      path.setAttribute('opacity', String(layerData.opacity));
      path.setAttribute('transform', `translate(0, ${layerData.y})`);
      path.setAttribute('data-layer', layerId);

      glowGroup.appendChild(path);
      glowPaths.push(path);
    }

    svg.appendChild(glowGroup);

    // Sharp Foreground Line Path
    const linePath = document.createElementNS(SVG_NS, 'path');
    linePath.setAttribute('d', d);
    linePath.setAttribute('fill', 'none');
    linePath.setAttribute('stroke', 'url(#ha-lg)');
    linePath.setAttribute('stroke-width', String(currentConfig.lineThick));
    linePath.setAttribute('stroke-linecap', 'round');
    svg.appendChild(linePath);

    container.innerHTML = '';
    container.appendChild(svg);

    elementsRef.current = {
      svg,
      linePath,
      glowGroup,
      glowPaths,
    };

    pathTotalLength.current = linePath.getTotalLength();

    if (instant) {
      linePath.style.strokeDasharray = 'none';
      linePath.style.strokeDashoffset = '0';
    } else {
      linePath.style.strokeDasharray = `${pathTotalLength.current}`;
      linePath.style.strokeDashoffset = `${pathTotalLength.current}`;
    }
  }, []);

  // Update layout on window resize
  const handleResize = useCallback(() => {
    const refs = elementsRef.current;
    if (!refs) return;
    const { svgW, svgH, d, bottom } = calculateArcDimensions();
    refs.svg.setAttribute('width', String(svgW));
    refs.svg.setAttribute('height', String(svgH));
    refs.svg.setAttribute('viewBox', `-100 0 ${svgW} ${svgH}`);
    refs.svg.style.bottom = `${bottom}px`;
    refs.linePath.setAttribute('d', d);
    refs.glowPaths.forEach((gp) => gp.setAttribute('d', d));
    pathTotalLength.current = refs.linePath.getTotalLength();
  }, []);

  // Activate breathing and vertical drifting animation on glow
  const activateBreathing = useCallback(() => {
    const refs = elementsRef.current;
    if (!refs) return;
    const currentConfig = configRef.current;
    refs.glowGroup.style.setProperty('--breath-speed', `${currentConfig.breathSpeed}s`);
    refs.glowGroup.style.setProperty('--breath-min-opacity', `${1 - currentConfig.breathIntensity}`);
    refs.glowGroup.style.setProperty('--breath-drift', `${currentConfig.breathDrift}px`);
    refs.glowGroup.style.setProperty('--breath-drift-speed', `${1.42 * currentConfig.breathSpeed}s`);
    refs.glowGroup.classList.add('ha-breathing');
  }, []);

  // Animate arc stroke drawing & glow fading in
  const startDrawAnimation = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    hasTriggeredDrawComplete.current = false;
    buildSvg(false);

    const currentConfig = configRef.current;
    const drawDur = currentConfig.drawDuration;
    const glowDelay = currentConfig.glowDelay;
    const glowFade = currentConfig.glowFade;
    let startTime: number | null = null;

    const step = (timestamp: number) => {
      const refs = elementsRef.current;
      if (!refs) return;

      if (startTime === null) startTime = timestamp;
      const elapsed = (timestamp - startTime) / 1000;
      const totalLen = pathTotalLength.current;

      // Arc drawing progress with cubic ease-out
      const drawProgress = Math.min(elapsed / drawDur, 1);
      const easedDraw = 1 - Math.pow(1 - drawProgress, 3);
      refs.linePath.style.strokeDashoffset = String(totalLen * (1 - easedDraw));

      if (drawProgress >= 1 && !hasTriggeredDrawComplete.current) {
        hasTriggeredDrawComplete.current = true;
        onDrawComplete?.();
      }

      // Glow fading in after delay
      const glowElapsed = Math.max(0, elapsed - (0.45 * drawDur + glowDelay));
      const glowProgress = Math.min(glowElapsed / glowFade, 1);
      const easedGlow = 1 - Math.pow(1 - glowProgress, 2);
      refs.glowGroup.setAttribute('opacity', String(easedGlow));

      if (drawProgress >= 1 && glowProgress >= 1) {
        refs.linePath.style.strokeDasharray = 'none';
        refs.linePath.style.strokeDashoffset = '0';
        refs.glowGroup.setAttribute('opacity', '1');
        activateBreathing();
        return;
      }

      animFrameRef.current = requestAnimationFrame(step);
    };

    animFrameRef.current = requestAnimationFrame(step);
  }, [buildSvg, activateBreathing, onDrawComplete]);

  // Handle replayKey & initial mount
  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) {
      buildSvg(true);
      activateBreathing();
      onDrawComplete?.();
      return;
    }

    startDrawAnimation();

    const onWindowResize = () => {
      handleResize();
    };
    window.addEventListener('resize', onWindowResize, { passive: true });

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', onWindowResize);
    };
  }, [replayKey, config, buildSvg, startDrawAnimation, activateBreathing, handleResize, onDrawComplete]);

  return (
    <div
      ref={containerRef}
      className="hero-animation absolute inset-0 pointer-events-none overflow-visible z-0"
      aria-hidden="true"
    />
  );
};
