import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ZoomIn, ZoomOut, RefreshCw, Rotate3d } from 'lucide-react';
import { parseGIF, decompressFrames } from 'gifuct-js';
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

// Global in-memory frame cache so re-opening any dish is instant (0ms)
const decodedGifFramesCache = new Map<string, HTMLCanvasElement[]>();

export const FoodModelViewer3D: React.FC<FoodModelViewer3DProps> = ({
  fallbackImage,
  animatedGifUrl,
  foodName,
  className = '',
  controlsPosition = 'top-right'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const displayCanvasRef = useRef<HTMLCanvasElement>(null);
  const steamCanvasRef = useRef<HTMLCanvasElement>(null);

  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);
  const [framesReady, setFramesReady] = useState<boolean>(false);
  const [currentAngleDeg, setCurrentAngleDeg] = useState<number>(0);
  const [fallbackRotY, setFallbackRotY] = useState<number>(0);

  // Refs for smooth 60fps 360° scrubbing without React re-render lag
  const framesRef = useRef<HTMLCanvasElement[]>([]);
  const frameIndexRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const isAutoRotatingRef = useRef<boolean>(true);
  const dragStartXRef = useRef<number>(0);
  const dragStartFrameRef = useRef<number>(0);
  const dragStartFallbackRotRef = useRef<number>(0);
  const resumeTimerRef = useRef<number | null>(null);

  // GIF candidate URLs
  const gifCandidates = animatedGifUrl ? getModelCandidateUrls(animatedGifUrl) : [];
  const [gifCandidateIdx, setGifCandidateIdx] = useState<number>(0);

  const activeGifSrc = gifCandidates.length > gifCandidateIdx ? gifCandidates[gifCandidateIdx] : null;
  const activeMediaSrc = activeGifSrc || fallbackImage;

  // Draw a specific frame index onto the visible display canvas
  const drawFrame = useCallback((idx: number) => {
    const frames = framesRef.current;
    const canvas = displayCanvasRef.current;
    if (!canvas || frames.length === 0) return;

    const safeIdx = ((idx % frames.length) + frames.length) % frames.length;
    const srcCanvas = frames[safeIdx];
    if (!srcCanvas) return;

    if (canvas.width !== srcCanvas.width || canvas.height !== srcCanvas.height) {
      canvas.width = srcCanvas.width;
      canvas.height = srcCanvas.height;
    }

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(srcCanvas, 0, 0);
    }

    frameIndexRef.current = safeIdx;
    setCurrentAngleDeg(Math.round((safeIdx / frames.length) * 360));
  }, []);

  // Decode GIF into interactive 360° frames
  useEffect(() => {
    let cancelled = false;
    setFramesReady(false);
    framesRef.current = [];
    frameIndexRef.current = 0;
    setCurrentAngleDeg(0);
    setFallbackRotY(0);
    setIsZoomed(false);
    isAutoRotatingRef.current = true;

    const loadFrames = async () => {
      if (!activeGifSrc) return;

      if (decodedGifFramesCache.has(activeGifSrc)) {
        const cached = decodedGifFramesCache.get(activeGifSrc)!;
        if (!cancelled && cached.length > 0) {
          framesRef.current = cached;
          setFramesReady(true);
          drawFrame(0);
        }
        return;
      }

      try {
        const response = await fetch(activeGifSrc);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const buffer = await response.arrayBuffer();
        if (cancelled) return;

        const gif = parseGIF(buffer);
        const decompressed = decompressFrames(gif, true);
        if (!decompressed || decompressed.length === 0) return;

        const width = gif.lsd.width;
        const height = gif.lsd.height;

        const compCanvas = document.createElement('canvas');
        compCanvas.width = width;
        compCanvas.height = height;
        const compCtx = compCanvas.getContext('2d');
        if (!compCtx) return;

        const patchCanvas = document.createElement('canvas');
        const patchCtx = patchCanvas.getContext('2d');
        if (!patchCtx) return;

        const builtFrames: HTMLCanvasElement[] = [];

        for (let i = 0; i < decompressed.length; i++) {
          const frame = decompressed[i];
          const { dims, patch, disposalType } = frame;

          let savedBefore: ImageData | null = null;
          if (disposalType === 3) {
            savedBefore = compCtx.getImageData(0, 0, width, height);
          }

          patchCanvas.width = dims.width;
          patchCanvas.height = dims.height;
          const imgData = patchCtx.createImageData(dims.width, dims.height);
          imgData.data.set(patch);
          patchCtx.putImageData(imgData, 0, 0);

          compCtx.drawImage(patchCanvas, dims.left, dims.top);

          const snapshot = document.createElement('canvas');
          snapshot.width = width;
          snapshot.height = height;
          const snapCtx = snapshot.getContext('2d');
          if (snapCtx) {
            snapCtx.drawImage(compCanvas, 0, 0);
          }
          builtFrames.push(snapshot);

          if (disposalType === 2) {
            compCtx.clearRect(dims.left, dims.top, dims.width, dims.height);
          } else if (disposalType === 3 && savedBefore) {
            compCtx.putImageData(savedBefore, 0, 0);
          }
        }

        if (!cancelled && builtFrames.length > 0) {
          decodedGifFramesCache.set(activeGifSrc, builtFrames);
          framesRef.current = builtFrames;
          setFramesReady(true);
          drawFrame(0);
        }
      } catch {
        // Fallback cleanly to next candidate or 3D CSS rotation on img
        if (!cancelled && gifCandidateIdx + 1 < gifCandidates.length) {
          setGifCandidateIdx((prev) => prev + 1);
        }
      }
    };

    loadFrames();

    return () => {
      cancelled = true;
    };
  }, [activeGifSrc, drawFrame, gifCandidateIdx, gifCandidates.length]);

  // Draw initial frame as soon as the display canvas mounts
  useEffect(() => {
    if (framesReady && framesRef.current.length > 0) {
      drawFrame(frameIndexRef.current);
    }
  }, [framesReady, drawFrame]);

  // Smooth Auto-Rotation Loop (pauses while dragging, resumes after interaction)
  useEffect(() => {
    const interval = window.setInterval(() => {
      if (!isAutoRotatingRef.current || isDraggingRef.current) return;

      if (framesRef.current.length > 1) {
        drawFrame(frameIndexRef.current + 1);
      } else {
        setFallbackRotY((prev) => (prev + 2) % 360);
      }
    }, 75);

    return () => window.clearInterval(interval);
  }, [drawFrame]);

  // Real-time culinary steam particle animation
  useEffect(() => {
    const canvas = steamCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.clientWidth || 600);
    let height = (canvas.height = canvas.clientHeight || 340);

    const particleCount = 20;
    const particles = Array.from({ length: particleCount }, () => ({
      x: width * 0.28 + Math.random() * (width * 0.44),
      y: height * 0.45 + Math.random() * (height * 0.4),
      radius: 10 + Math.random() * 18,
      opacity: 0.04 + Math.random() * 0.16,
      speedY: 0.35 + Math.random() * 0.6,
      speedX: (Math.random() - 0.5) * 0.3,
      growth: 0.09 + Math.random() * 0.12
    }));

    let steamFrameId: number;

    const renderSteam = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y -= p.speedY;
        p.x += p.speedX;
        p.radius += p.growth;
        p.opacity -= 0.0016;

        if (p.opacity <= 0 || p.y < height * 0.06 || p.radius > 46) {
          p.x = width * 0.28 + Math.random() * (width * 0.44);
          p.y = height * 0.7 + Math.random() * (height * 0.18);
          p.radius = 10 + Math.random() * 14;
          p.opacity = 0.05 + Math.random() * 0.18;
          p.speedY = 0.35 + Math.random() * 0.6;
        }

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        grad.addColorStop(0, `rgba(255, 248, 235, ${p.opacity})`);
        grad.addColorStop(0.5, `rgba(255, 230, 190, ${p.opacity * 0.3})`);
        grad.addColorStop(1, 'rgba(255, 230, 190, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

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
  }, []);

  // Lenskart-style 360° Touch & Mouse Horizontal Drag Rotation
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    isAutoRotatingRef.current = false;
    dragStartXRef.current = e.clientX;
    dragStartFrameRef.current = frameIndexRef.current;
    dragStartFallbackRotRef.current = fallbackRotY;
    setHasInteracted(true);

    if (resumeTimerRef.current) {
      window.clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }

    (e.target as HTMLElement)?.setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - dragStartXRef.current;

    const totalFrames = framesRef.current.length;
    if (totalFrames > 1) {
      // 240px horizontal drag = full 360° rotation across all frames
      const frameDelta = Math.round((deltaX / 240) * totalFrames);
      drawFrame(dragStartFrameRef.current + frameDelta);
    } else {
      const nextRot = (dragStartFallbackRotRef.current + deltaX * 1.2) % 360;
      setFallbackRotY(nextRot);
      setCurrentAngleDeg(Math.round(((nextRot % 360) + 360) % 360));
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;

    try {
      (e.target as HTMLElement)?.releasePointerCapture?.(e.pointerId);
    } catch {}

    // Resume slow auto-rotation 1.8s after customer stops dragging
    if (resumeTimerRef.current) window.clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = window.setTimeout(() => {
      isAutoRotatingRef.current = true;
    }, 1800);
  };

  const handleResetView = () => {
    setIsZoomed(false);
    if (framesRef.current.length > 0) {
      drawFrame(0);
    } else {
      setFallbackRotY(0);
      setCurrentAngleDeg(0);
    }
    isAutoRotatingRef.current = true;
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

      {/* 2. Foreground 360° Interactive Food Canvas / Turntable */}
      <div
        className="relative z-10 w-full h-full flex flex-col items-center justify-center transition-transform duration-300 ease-out pointer-events-none"
        style={{
          perspective: '1200px',
          transform: `scale(${isZoomed ? 1.3 : 1.0})`
        }}
      >
        <div className="relative flex items-center justify-center max-w-[92%] max-h-[290px] sm:max-h-[320px]">
          {framesReady ? (
            <canvas
              ref={displayCanvasRef}
              aria-label={`${foodName} 360 degree view`}
              className="max-h-[270px] sm:max-h-[300px] w-auto max-w-full object-contain rounded-2xl drop-shadow-[0_24px_45px_rgba(0,0,0,0.85)] filter saturate-[1.12] contrast-[1.05]"
            />
          ) : (
            <img
              src={activeMediaSrc}
              alt={foodName}
              onError={() => {
                if (gifCandidateIdx + 1 < gifCandidates.length) {
                  setGifCandidateIdx((prev) => prev + 1);
                }
              }}
              style={{
                transform: `rotateY(${fallbackRotY}deg)`
              }}
              className="max-h-[270px] sm:max-h-[300px] w-auto max-w-full object-contain rounded-2xl drop-shadow-[0_24px_45px_rgba(0,0,0,0.85)] filter saturate-[1.12] contrast-[1.05]"
              draggable={false}
            />
          )}
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

      {/* 4. Top-Right Floating Controls (Zoom & Reset) */}
      {controlsPosition === 'top-right' && (
        <div className="absolute top-4 right-16 z-30 flex items-center gap-1.5 pointer-events-auto">
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

          {isZoomed && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleResetView();
              }}
              className="w-8 h-8 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white border border-white/15 transition-all flex items-center justify-center cursor-pointer active:scale-95 shadow-lg backdrop-blur-md"
              title="Reset View"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* 5. Lenskart-Style 360° Interactive Scrubbing Pill */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
        <div className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-950/85 backdrop-blur-md border border-amber-400/40 text-amber-300 text-[11px] font-bold shadow-lg">
          <Rotate3d className="w-4 h-4 text-amber-400" />
          <span>360°</span>
          <span className="text-slate-500">•</span>
          <span className="font-mono text-white text-[10px] w-8 text-center">{currentAngleDeg}°</span>
          {!hasInteracted && (
            <span className="text-[10px] text-amber-200/80 hidden sm:inline">Drag left/right to rotate</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodModelViewer3D;
