import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, ZoomIn, ZoomOut, RefreshCw, Eye } from 'lucide-react';
import { getModelCandidateUrls } from '../../utils/foodModels3D';

interface FoodModelViewer3DProps {
  modelUrl?: string;
  fallbackImage?: string;
  animatedGifUrl?: string;
  foodName: string;
  scale?: number;
  cameraDistance?: number;
  className?: string;
  showTopBadge?: boolean;
  controlsPosition?: 'bottom' | 'top-right' | 'none';
}

export const FoodModelViewer3D: React.FC<FoodModelViewer3DProps> = ({
  fallbackImage,
  animatedGifUrl,
  foodName,
  className = '',
  controlsPosition = 'bottom'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const steamCanvasRef = useRef<HTMLCanvasElement>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);

  // References for dragging
  const isDraggingRef = useRef<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const currentPanRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const animFrameRef = useRef<number | null>(null);

  // Multi-candidate resolution for local / bundled animated GIFs
  const candidates = animatedGifUrl ? getModelCandidateUrls(animatedGifUrl) : [];
  const [candidateIdx, setCandidateIdx] = useState<number>(0);

  useEffect(() => {
    setCandidateIdx(0);
  }, [animatedGifUrl]);

  const activeImageSrc = (candidates.length > candidateIdx ? candidates[candidateIdx] : null) || fallbackImage;

  // Real-time culinary steam particle animation
  useEffect(() => {
    const canvas = steamCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.clientWidth || 600);
    let height = (canvas.height = canvas.clientHeight || 340);

    const particleCount = 28;
    const particles = Array.from({ length: particleCount }, () => ({
      x: width * 0.15 + Math.random() * (width * 0.7),
      y: height * 0.35 + Math.random() * (height * 0.55),
      radius: 14 + Math.random() * 24,
      opacity: 0.04 + Math.random() * 0.22,
      speedY: 0.45 + Math.random() * 0.75,
      speedX: (Math.random() - 0.5) * 0.4,
      growth: 0.12 + Math.random() * 0.16
    }));

    const renderSteam = () => {
      ctx.clearRect(0, 0, width, height);

      if (isPlaying) {
        particles.forEach((p) => {
          p.y -= p.speedY;
          p.x += p.speedX;
          p.radius += p.growth;
          p.opacity -= 0.0018;

          if (p.opacity <= 0 || p.y < height * 0.05 || p.radius > 55) {
            p.x = width * 0.2 + Math.random() * (width * 0.6);
            p.y = height * 0.7 + Math.random() * (height * 0.2);
            p.radius = 12 + Math.random() * 18;
            p.opacity = 0.08 + Math.random() * 0.24;
            p.speedY = 0.45 + Math.random() * 0.75;
          }

          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
          grad.addColorStop(0, `rgba(255, 250, 240, ${p.opacity})`);
          grad.addColorStop(0.45, `rgba(255, 225, 185, ${p.opacity * 0.4})`);
          grad.addColorStop(1, 'rgba(255, 225, 185, 0)');

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      animFrameRef.current = requestAnimationFrame(renderSteam);
    };

    animFrameRef.current = requestAnimationFrame(renderSteam);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.clientWidth || 600;
      height = canvas.height = canvas.clientHeight || 340;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [isPlaying]);

  // Touch & Mouse gestures to pan & explore dish layers
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    setHasInteracted(true);
    (e.target as HTMLElement)?.setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = (e.clientX - dragStartRef.current.x) * 0.45;
    const deltaY = (e.clientY - dragStartRef.current.y) * 0.45;

    const newX = Math.max(-60, Math.min(60, currentPanRef.current.x + deltaX));
    const newY = Math.max(-35, Math.min(35, currentPanRef.current.y + deltaY));

    setPanOffset({ x: newX, y: newY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    currentPanRef.current = panOffset;
    try {
      (e.target as HTMLElement)?.releasePointerCapture?.(e.pointerId);
    } catch {}
  };

  const handleResetPan = () => {
    setPanOffset({ x: 0, y: 0 });
    currentPanRef.current = { x: 0, y: 0 };
    setIsZoomed(false);
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={`relative w-full h-full overflow-hidden select-none touch-none bg-slate-950 cursor-grab active:cursor-grabbing ${className}`}
      style={{ touchAction: 'none' }}
    >
      {/* 1. Full-Bleed Authentic Appetizing Food Visual (Image 1 Style) */}
      <div 
        className="w-full h-full flex items-center justify-center transition-transform duration-300 ease-out"
        style={{
          transform: `scale(${isZoomed ? 1.35 : 1.08}) translate(${panOffset.x}px, ${panOffset.y}px)`
        }}
      >
        <img
          src={activeImageSrc}
          alt={foodName}
          onError={() => {
            if (candidateIdx + 1 < candidates.length) {
              setCandidateIdx((prev) => prev + 1);
            }
          }}
          className="w-full h-full object-cover object-center filter saturate-[1.14] contrast-[1.06]"
          draggable={false}
        />
      </div>

      {/* 2. Cinematic Warm Lighting Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-slate-950/35 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(0,0,0,0.55)_100%)] pointer-events-none" />

      {/* 3. Live Rising Steam Particle Canvas */}
      <canvas
        ref={steamCanvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      />

      {/* 4. Top-Right Floating Controls */}
      {controlsPosition === 'top-right' && (
        <div className="absolute top-4 right-16 z-20 flex items-center gap-1.5 pointer-events-auto">
          {/* Pause / Play Motion */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsPlaying((prev) => !prev);
            }}
            className="px-2.5 py-1.5 rounded-full bg-black/60 hover:bg-black/80 text-slate-200 hover:text-white border border-white/15 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-md backdrop-blur-md"
            title={isPlaying ? 'Pause steam motion' : 'Play steam motion'}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px] font-bold">Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[11px] font-bold">Play</span>
              </>
            )}
          </button>

          {/* Zoom Toggle */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsZoomed((prev) => !prev);
            }}
            className={`px-2.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-md backdrop-blur-md border ${
              isZoomed 
                ? 'bg-amber-500 text-slate-950 border-amber-300' 
                : 'bg-black/60 hover:bg-black/80 text-slate-200 hover:text-white border-white/15'
            }`}
            title="Inspect Close-up"
          >
            {isZoomed ? <ZoomOut className="w-3.5 h-3.5" /> : <ZoomIn className="w-3.5 h-3.5 text-amber-300" />}
            <span className="text-[11px]">{isZoomed ? 'Reset' : 'Zoom'}</span>
          </button>

          {/* Reset View */}
          {(panOffset.x !== 0 || panOffset.y !== 0 || isZoomed) && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleResetPan();
              }}
              className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-slate-200 hover:text-white border border-white/15 transition-all flex items-center justify-center cursor-pointer active:scale-95 shadow-md backdrop-blur-md"
              title="Reset View"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* 5. Drag Hint Pill */}
      {!hasInteracted && (
        <div className="absolute top-16 right-4 z-10 pointer-events-none animate-bounce">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/90 backdrop-blur-md text-slate-950 text-[10px] font-black shadow-lg">
            <Eye className="w-3 h-3" />
            <span>Drag to inspect ingredients & texture</span>
          </div>
        </div>
      )}

      {/* 6. Bottom Floating Controls (for standalone mode) */}
      {controlsPosition === 'bottom' && (
        <div className="absolute bottom-3 left-4 right-4 z-10 flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white/90 text-[11px] font-semibold border border-white/10">
            <Eye className="w-3 h-3 text-amber-400" />
            <span>Drag to inspect</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsPlaying((prev) => !prev)}
              className="px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white border border-white/10 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer active:scale-95 shadow-sm"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[10px]">Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[10px]">Play</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsZoomed((prev) => !prev)}
              className="p-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white border border-white/10 transition-all cursor-pointer active:scale-95 shadow-sm"
            >
              {isZoomed ? <ZoomOut className="w-3.5 h-3.5" /> : <ZoomIn className="w-3.5 h-3.5 text-amber-300" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodModelViewer3D;
