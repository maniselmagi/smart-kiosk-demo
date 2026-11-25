import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, ZoomIn, ZoomOut, RefreshCw, Move3d } from 'lucide-react';
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
  controlsPosition = 'top-right'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const steamCanvasRef = useRef<HTMLCanvasElement>(null);

  // 3D Rotation & Inspection States
  const [rotationY, setRotationY] = useState<number>(0);
  const [rotationX, setRotationX] = useState<number>(8); // Slight natural downward angle
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);

  // References for smooth dragging & animation frame
  const isDraggingRef = useRef<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const lastRotationRef = useRef<{ y: number; x: number }>({ y: 0, x: 8 });
  const currentPanRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const animFrameRef = useRef<number | null>(null);
  const autoRotateTimerRef = useRef<number | null>(null);

  // Multi-candidate resolution for local / bundled animated GIFs
  const candidates = animatedGifUrl ? getModelCandidateUrls(animatedGifUrl) : [];
  const [candidateIdx, setCandidateIdx] = useState<number>(0);

  useEffect(() => {
    setCandidateIdx(0);
  }, [animatedGifUrl]);

  const activeImageSrc = (candidates.length > candidateIdx ? candidates[candidateIdx] : null) || fallbackImage;

  // Smooth Automatic 3D Turntable Rotation Loop
  useEffect(() => {
    let lastTime = performance.now();

    const loop = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      if (isPlaying && !isDraggingRef.current) {
        // Smoothly rotate 360 degrees turntable
        setRotationY((prev) => {
          const next = prev + 14 * dt; // 14 degrees per second
          lastRotationRef.current.y = next % 360;
          return next % 360;
        });
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying]);

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
      y: height * 0.35 + Math.random() * (height * 0.45),
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
            p.y = height * 0.65 + Math.random() * (height * 0.2);
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

  // Touch & Mouse gestures for 360° rotation and tilt
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    setHasInteracted(true);
    if (autoRotateTimerRef.current) {
      window.clearTimeout(autoRotateTimerRef.current);
      autoRotateTimerRef.current = null;
    }
    (e.target as HTMLElement)?.setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;

    if (isZoomed) {
      // Pan when zoomed in
      const newX = Math.max(-70, Math.min(70, currentPanRef.current.x + deltaX * 0.5));
      const newY = Math.max(-45, Math.min(45, currentPanRef.current.y + deltaY * 0.5));
      setPanOffset({ x: newX, y: newY });
    } else {
      // Rotate 3D around Y and tilt around X
      const newRotY = (lastRotationRef.current.y + deltaX * 0.65) % 360;
      const newRotX = Math.max(-12, Math.min(24, lastRotationRef.current.x - deltaY * 0.3));

      setRotationY(newRotY);
      setRotationX(newRotX);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    lastRotationRef.current = { y: rotationY, x: rotationX };
    currentPanRef.current = panOffset;

    try {
      (e.target as HTMLElement)?.releasePointerCapture?.(e.pointerId);
    } catch {}

    // Resume auto-rotation after 2 seconds of inactivity
    if (autoRotateTimerRef.current) window.clearTimeout(autoRotateTimerRef.current);
    autoRotateTimerRef.current = window.setTimeout(() => {
      // smoothly continues
    }, 2000);
  };

  const handleResetView = () => {
    setRotationY(0);
    setRotationX(8);
    lastRotationRef.current = { y: 0, x: 8 };
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
      className={`relative w-full h-full overflow-hidden select-none touch-none bg-gradient-to-b from-slate-900 via-slate-950 to-black cursor-grab active:cursor-grabbing flex items-center justify-center p-4 ${className}`}
      style={{ touchAction: 'none' }}
    >
      {/* Ambient 3D Spotlight Backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,rgba(245,158,11,0.12)_0%,rgba(15,23,42,0.6)_65%,rgba(2,6,23,0.95)_100%)] pointer-events-none" />

      {/* 3D Perspective Stage Container */}
      <div 
        className="relative z-10 w-full h-full flex items-center justify-center pointer-events-none"
        style={{
          perspective: '1200px',
          perspectiveOrigin: '50% 50%'
        }}
      >
        {/* 3D Turntable Platter & Food Entity */}
        <div
          className="relative transition-transform duration-100 ease-out flex flex-col items-center justify-center"
          style={{
            transformStyle: 'preserve-3d',
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) rotateX(${rotationX}deg) rotateY(${rotationY}deg) scale(${isZoomed ? 1.3 : 1.0})`
          }}
        >
          {/* Exact Dish Visual - Fitted & NOT Overly Zoomed */}
          <div className="relative flex items-center justify-center max-w-[92%] max-h-[290px] sm:max-h-[320px]">
            <img
              src={activeImageSrc}
              alt={foodName}
              onError={() => {
                if (candidateIdx + 1 < candidates.length) {
                  setCandidateIdx((prev) => prev + 1);
                }
              }}
              className="max-h-[270px] sm:max-h-[300px] w-auto max-w-full object-contain rounded-2xl drop-shadow-[0_22px_35px_rgba(0,0,0,0.85)] filter saturate-[1.12] contrast-[1.05]"
              draggable={false}
            />

            {/* Dynamic Specular Shimmer Sweep over Food Surface */}
            <div 
              className="absolute inset-0 rounded-2xl pointer-events-none opacity-25 mix-blend-overlay transition-opacity duration-300"
              style={{
                background: `linear-gradient(${115 + (rotationY % 360)}deg, transparent 35%, rgba(255,255,255,0.7) 50%, transparent 65%)`
              }}
            />
          </div>

          {/* 3D Circular Pedestal Platter Reflection & Shadow Beneath Dish */}
          <div 
            className="w-56 sm:w-72 h-14 mt-[-18px] rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(245,158,11,0.28) 0%, rgba(0,0,0,0.75) 55%, transparent 75%)',
              transform: 'rotateX(75deg)',
              filter: 'blur(3px)'
            }}
          />
        </div>
      </div>

      {/* Live Rising Steam Particle Canvas */}
      <canvas
        ref={steamCanvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-20"
      />

      {/* Top-Right Floating 3D Controls */}
      {controlsPosition === 'top-right' && (
        <div className="absolute top-4 right-16 z-30 flex items-center gap-1.5 pointer-events-auto">
          {/* Pause / Play Rotation */}
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
                <span className="text-[11px] font-bold">Pause 3D</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[11px] font-bold">Rotate 3D</span>
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

          {/* Reset View Button */}
          {(rotationY !== 0 || rotationX !== 8 || isZoomed || panOffset.x !== 0) && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleResetView();
              }}
              className="w-8 h-8 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white border border-white/15 transition-all flex items-center justify-center cursor-pointer active:scale-95 shadow-lg backdrop-blur-md"
              title="Reset 3D Angle"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Drag to Rotate 360° Hint Pill */}
      {!hasInteracted && (
        <div className="absolute top-16 right-4 z-30 pointer-events-none animate-bounce">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/95 backdrop-blur-md text-slate-950 text-[10px] font-black shadow-xl border border-amber-300">
            <Move3d className="w-3.5 h-3.5 text-slate-950" />
            <span>Drag horizontally to rotate 360°</span>
          </div>
        </div>
      )}

      {/* Dish Identity Watermark Pill in Stage Bottom-Left */}
      <div className="absolute bottom-3 left-4 z-30 pointer-events-none">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/55 backdrop-blur-md border border-white/10 text-slate-300 text-[10px] font-medium shadow-md">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span>Interactive 3D Turntable • {foodName}</span>
        </div>
      </div>
    </div>
  );
};

export default FoodModelViewer3D;
