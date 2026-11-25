import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, ZoomIn, ZoomOut, RefreshCw, Eye, Move3d } from 'lucide-react';
import { getModelCandidateUrls } from '../../utils/foodModels3D';

interface FoodModelViewer3DProps {
  modelUrl?: string;
  fallbackImage?: string;
  animatedGifUrl?: string;
  videoUrl?: string;
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
  controlsPosition = 'top-right'
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

  // GIF candidate URLs
  const gifCandidates = animatedGifUrl ? getModelCandidateUrls(animatedGifUrl) : [];
  const [gifCandidateIdx, setGifCandidateIdx] = useState<number>(0);

  useEffect(() => {
    setGifCandidateIdx(0);
    setIsPlaying(true);
    setPanOffset({ x: 0, y: 0 });
    currentPanRef.current = { x: 0, y: 0 };
    setIsZoomed(false);
  }, [animatedGifUrl, foodName]);

  const activeGifSrc = gifCandidates.length > gifCandidateIdx ? gifCandidates[gifCandidateIdx] : null;
  const activeMediaSrc = activeGifSrc || fallbackImage;

  // Real-time culinary steam particle animation
  useEffect(() => {
    const canvas = steamCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.clientWidth || 600);
    let height = (canvas.height = canvas.clientHeight || 340);

    const particleCount = 24;
    const particles = Array.from({ length: particleCount }, () => ({
      x: width * 0.25 + Math.random() * (width * 0.5),
      y: height * 0.45 + Math.random() * (height * 0.4),
      radius: 12 + Math.random() * 20,
      opacity: 0.04 + Math.random() * 0.18,
      speedY: 0.35 + Math.random() * 0.65,
      speedX: (Math.random() - 0.5) * 0.35,
      growth: 0.1 + Math.random() * 0.14
    }));

    let steamFrameId: number;

    const renderSteam = () => {
      ctx.clearRect(0, 0, width, height);

      if (isPlaying) {
        particles.forEach((p) => {
          p.y -= p.speedY;
          p.x += p.speedX;
          p.radius += p.growth;
          p.opacity -= 0.0016;

          if (p.opacity <= 0 || p.y < height * 0.06 || p.radius > 50) {
            p.x = width * 0.25 + Math.random() * (width * 0.5);
            p.y = height * 0.7 + Math.random() * (height * 0.18);
            p.radius = 10 + Math.random() * 16;
            p.opacity = 0.06 + Math.random() * 0.2;
            p.speedY = 0.35 + Math.random() * 0.65;
          }

          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
          grad.addColorStop(0, `rgba(255, 248, 235, ${p.opacity})`);
          grad.addColorStop(0.5, `rgba(255, 230, 190, ${p.opacity * 0.35})`);
          grad.addColorStop(1, 'rgba(255, 230, 190, 0)');

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      steamFrameId = requestAnimationFrame(renderSteam);
    };

    steamFrameId = requestAnimationFrame(renderSteam);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.clientWidth || 600;
      height = canvas.height = canvas.clientHeight || 340;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(steamFrameId);
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
    const deltaX = (e.clientX - dragStartRef.current.x) * 0.5;
    const deltaY = (e.clientY - dragStartRef.current.y) * 0.5;

    const maxPanX = isZoomed ? 90 : 45;
    const maxPanY = isZoomed ? 60 : 30;

    const newX = Math.max(-maxPanX, Math.min(maxPanX, currentPanRef.current.x + deltaX));
    const newY = Math.max(-maxPanY, Math.min(maxPanY, currentPanRef.current.y + deltaY));

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
      className={`relative w-full h-full overflow-hidden select-none touch-none bg-gradient-to-b from-slate-900 via-slate-950 to-black cursor-grab active:cursor-grabbing flex items-center justify-center p-3 ${className}`}
      style={{ touchAction: 'none' }}
    >
      {/* 1. Ambient Warm Diffused Spotlight Backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,rgba(245,158,11,0.15)_0%,rgba(15,23,42,0.65)_65%,rgba(2,6,23,0.98)_100%)] pointer-events-none" />

      {/* 2. Foreground 3D Rotating Food in Center: Wide-Angle, Full Dish, Uncropped */}
      <div 
        className="relative z-10 w-full h-full flex flex-col items-center justify-center transition-transform duration-300 ease-out"
        style={{
          transform: `scale(${isZoomed ? 1.3 : 1.0}) translate(${panOffset.x}px, ${panOffset.y}px)`
        }}
      >
        <div className="relative flex items-center justify-center max-w-[92%] max-h-[290px] sm:max-h-[320px]">
          <img
            src={activeMediaSrc}
            alt={foodName}
            onError={() => {
              if (gifCandidateIdx + 1 < gifCandidates.length) {
                setGifCandidateIdx((prev) => prev + 1);
              }
            }}
            className="max-h-[270px] sm:max-h-[300px] w-auto max-w-full object-contain rounded-2xl drop-shadow-[0_24px_45px_rgba(0,0,0,0.85)] filter saturate-[1.12] contrast-[1.05]"
            draggable={false}
          />
        </div>

        {/* 3D Circular Pedestal Platter Reflection & Shadow Beneath Dish */}
        <div 
          className="w-56 sm:w-72 h-14 mt-[-16px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(245,158,11,0.28) 0%, rgba(0,0,0,0.75) 55%, transparent 75%)',
            transform: 'rotateX(75deg)',
            filter: 'blur(3px)'
          }}
        />
      </div>

      {/* 3. Live Rising Steam Particle Canvas */}
      <canvas
        ref={steamCanvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-20"
      />

      {/* 4. Top-Right Floating Controls */}
      {controlsPosition === 'top-right' && (
        <div className="absolute top-4 right-16 z-30 flex items-center gap-1.5 pointer-events-auto">
          {/* Pause / Play Motion */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsPlaying((prev) => !prev);
            }}
            className="px-2.5 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white border border-white/15 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-lg backdrop-blur-md"
            title={isPlaying ? 'Pause 3D rotation' : 'Play 3D rotation'}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px] font-bold">Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[11px] font-bold">Rotate</span>
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
            className={`px-2.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-lg backdrop-blur-md border ${
              isZoomed 
                ? 'bg-amber-500 text-slate-950 border-amber-300 font-black' 
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white border-white/15'
            }`}
            title="Inspect Close-up"
          >
            {isZoomed ? <ZoomOut className="w-3.5 h-3.5" /> : <ZoomIn className="w-3.5 h-3.5 text-amber-300" />}
            <span className="text-[11px]">{isZoomed ? 'Reset' : 'Zoom'}</span>
          </button>

          {/* Reset Pan */}
          {(panOffset.x !== 0 || panOffset.y !== 0 || isZoomed) && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleResetPan();
              }}
              className="w-8 h-8 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white border border-white/15 transition-all flex items-center justify-center cursor-pointer active:scale-95 shadow-lg backdrop-blur-md"
              title="Reset View"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* 5. Drag Hint Pill */}
      {!hasInteracted && isZoomed && (
        <div className="absolute top-16 right-4 z-30 pointer-events-none animate-bounce">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/90 backdrop-blur-md text-slate-950 text-[10px] font-black shadow-lg border border-amber-300">
            <Eye className="w-3.5 h-3.5 text-slate-950" />
            <span>Drag to pan & inspect ingredients</span>
          </div>
        </div>
      )}

      {/* 6. Bottom-Left 3D Rotating View Badge */}
      <div className="absolute bottom-3 left-4 z-30 pointer-events-none">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-amber-400/40 text-amber-300 text-[11px] font-bold shadow-lg">
          <Move3d className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span>3D Rotating Food • {foodName}</span>
        </div>
      </div>
    </div>
  );
};

export default FoodModelViewer3D;
