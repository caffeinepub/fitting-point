import { useEffect, useRef, useState, ReactNode } from 'react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

interface RevealOnScrollProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export default function RevealOnScroll({ children, className = '', delay = 0 }: RevealOnScrollProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`${prefersReducedMotion ? '' : 'reveal-on-scroll'} ${
        isVisible || prefersReducedMotion ? 'reveal-visible' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
