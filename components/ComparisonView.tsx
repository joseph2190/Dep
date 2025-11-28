import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronsLeftRight } from 'lucide-react';

interface ComparisonViewProps {
  originalUrl: string;
  processedUrl: string;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({ originalUrl, processedUrl }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = () => setIsResizing(true);
  const handleTouchStart = () => setIsResizing(true);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    
    setSliderPosition(percentage);
  }, []);

  const handleMouseUp = useCallback(() => setIsResizing(false), []);

  useEffect(() => {
    const handleWindowMouseMove = (e: MouseEvent) => {
      if (isResizing) handleMove(e.clientX);
    };
    const handleWindowTouchMove = (e: TouchEvent) => {
      if (isResizing) handleMove(e.touches[0].clientX);
    };
    const handleWindowMouseUp = () => setIsResizing(false);

    if (isResizing) {
      window.addEventListener('mousemove', handleWindowMouseMove);
      window.addEventListener('touchmove', handleWindowTouchMove);
      window.addEventListener('mouseup', handleWindowMouseUp);
      window.addEventListener('touchend', handleWindowMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('touchmove', handleWindowTouchMove);
      window.removeEventListener('mouseup', handleWindowMouseUp);
      window.removeEventListener('touchend', handleWindowMouseUp);
    };
  }, [isResizing, handleMove]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-[4/3] md:aspect-video rounded-xl overflow-hidden select-none bg-slate-900 border border-slate-700 shadow-2xl"
    >
      {/* Background Image (After - Full Width) */}
      <img
        src={processedUrl}
        alt="Processed"
        className="absolute inset-0 w-full h-full object-contain pointer-events-none"
      />

      {/* Foreground Image (Before - Clipped) */}
      <div 
        className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img
          src={originalUrl}
          alt="Original"
          className="absolute inset-0 w-full h-full object-contain"
        />
      </div>

      {/* Slider Handle */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20 group"
        style={{ left: `${sliderPosition}%` }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center transform group-hover:scale-110 transition-transform text-slate-800">
          <ChevronsLeftRight size={16} />
        </div>
      </div>

      {/* Labels */}
      <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-white pointer-events-none">
        Original
      </div>
      <div className="absolute top-4 right-4 bg-indigo-600/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-white pointer-events-none">
        Depth Effect
      </div>
    </div>
  );
};
