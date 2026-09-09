import React, { useEffect, useRef } from 'react';

interface ScrollProgressBarProps {
  currentChapterId: string;
}

export const ScrollProgressBar: React.FC<ScrollProgressBarProps> = ({ currentChapterId }) => {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;

    const updateScroll = () => {
      if (!barRef.current) return;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight <= 0) {
        barRef.current.style.width = '0%';
        return;
      }
      const progress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
      barRef.current.style.width = `${progress}%`;
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScroll);
        ticking = true;
      }
    };

    // Reset bar when chapter changes
    if (barRef.current) {
      barRef.current.style.width = '0%';
    }
    updateScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [currentChapterId]);

  return (
    <div
      ref={barRef}
      className="fixed top-0 left-0 h-1 bg-amber-500 z-50 pointer-events-none transition-[width] duration-75"
      style={{ width: '0%' }}
    />
  );
};
