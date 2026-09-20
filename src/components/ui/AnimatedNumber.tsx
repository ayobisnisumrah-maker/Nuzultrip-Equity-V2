import React, { useEffect, useRef, useState } from 'react';

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  customDisplay?: string;
  useGrouping?: boolean;
}

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  duration = 1600,
  decimals = 0,
  prefix = '',
  suffix = '',
  className = '',
  customDisplay,
  useGrouping = true,
}) => {
  const [displayValue, setDisplayValue] = useState<number>(0);
  const [hasAnimated, setHasAnimated] = useState<boolean>(false);
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // If customDisplay provided (e.g., "Bulanan"), no numeric count-up needed
    if (customDisplay) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setDisplayValue(value);
      setHasAnimated(true);
      return;
    }

    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);

          const startTime = performance.now();
          const startVal = 0;
          const endVal = value;

          // Smooth easeOutExpo / easeOutQuart curve
          const easeOutQuart = (x: number): number => 1 - Math.pow(1 - x, 4);

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutQuart(progress);
            const currentNumber = startVal + (endVal - startVal) * easedProgress;

            setDisplayValue(currentNumber);

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setDisplayValue(endVal); // Exact final value
            }
          };

          requestAnimationFrame(animate);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [value, duration, hasAnimated, customDisplay]);

  if (customDisplay) {
    return (
      <span ref={containerRef} className={className}>
        {customDisplay}
      </span>
    );
  }

  const formatNumber = (num: number) => {
    if (decimals > 0) {
      // Indonesian decimal comma formatting
      return num.toFixed(decimals).replace('.', ',');
    }
    if (!useGrouping) {
      return Math.round(num).toString();
    }
    return Math.round(num).toLocaleString('id-ID');
  };

  return (
    <span ref={containerRef} className={`inline-flex items-baseline ${className}`}>
      {prefix && <span>{prefix}</span>}
      <span>{formatNumber(displayValue)}</span>
      {suffix && <span>{suffix}</span>}
    </span>
  );
};
