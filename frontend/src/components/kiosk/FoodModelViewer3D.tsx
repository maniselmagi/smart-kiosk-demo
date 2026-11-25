import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, ZoomIn, ZoomOut, RefreshCw, Maximize2, Minimize2, Video } from 'lucide-react';
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
  videoUrl,
  foodName,
  className = '',
  controlsPosition = 'top-right'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const steamCanvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [fitMode, setFitMode] = useState<'contain' | 'cover'>('contain'); // Default to wide uncropped full dish
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);
  const [videoFailed, setVideoFailed] = useState<boolean>(false);

  // References for dragging
  const isDraggingRef = useRef<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const currentPanRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const animFrameRef = useRef<number | null>(null);

  // Video candidate URLs
  const videoCandidates = (videoUrl && !videoFailed) ? getModelCandidateUrls(videoUrl) : [];
  const [videoCandidateIdx, setVideoCandidateIdx] = useState<number>(0);

  // GIF candidate URLs
  const gifCandidates = animatedGifUrl ? getModelCandidateUrls(animatedGifUrl) : [];
  const [gifCandidateIdx, setGifCandidateIdx] = useState<number>(0);

  useEffect(() => {
    setVideoFailed(false);
    setVideoCandidateIdx(0);
    setGifCandidateIdx(0);
    setIsPlaying(true);
    setPanOffset({ x: 0, y: 0 });
    currentPanRef.current = { x: 0, y: 0 };
    setIsZoomed(false);
  }, [videoUrl, animatedGifUrl, foodName]);

  const activeVideoSrc = videoCandidates.length > videoCandidateIdx ? videoCandidates[videoCandidateIdx] : null;
  const activeGifSrc = gifCandidates.length > gifCandidateIdx ? gifCandidates[gifCandidateIdx] : null;
  const isUsingVideo = Boolean(activeVideoSrc && !videoFailed);
  const activeMediaSrc = isUsingVideo ? activeVideoSrc! : (activeGifSrc || fallbackImage);

  // Control video play / pause in sync with state
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isPlaying, isUsingVideo, activeVideoSrc]);

  // Real-time culinary steam particle animation
  useEffect(() => {
    const canvas = steamCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.clientWidth || 600);
    let height = (canvas.height = canvas.clientHeight || 340);

    const particleCount = 26;
    const particles = Array.from({ length: particleCount }, () => ({
      x: width * 0.2 + Math.random() * (width * 0.6),
      y: height * 0.45 + Math.random() * (height * 0.45),
      radius: 12 + Math.random() * 20,
      opacity: 0.04 + Math.random() * 0.18,
      speedY: 0.4 + Math.random() * 0.65,
      speedX: (Math.random() - 0.5) * 0.35,
      growth: 0.1 + Math.random() * 0.14
    }));

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
            p.y = height * 0.75 + Math.random() * (height * 0.15);
            p.radius = 10 + Math.random() * 16;
            p.opacity = 0.06 + Math.random() * 0.2;
            p.speedY = 0.4 + Math.random() * 0.65;
          }

          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
          grad.addColorStop(0, `rgba(255, 252, 245, ${p.opacity})`);
          grad.addColorStop(0.5, `rgba(255, 235, 205, ${p.opacity * 0.4})`);
          grad.addColorStop(1, 'rgba(255, 235, 205, 0)');

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

  // Touch & Mouse gestures to pan & explore dish layers when zoomed
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

    const maxPanX = isZoomed ? 90 : 35;
    const maxPanY = isZoomed ? 60 : 25;

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
      className={`relative w-full h-full overflow-hidden select-none touch-none bg-slate-950 cursor-grab active:cursor-grabbing ${className}`}
      style={{ touchAction: 'none' }}
    >
      {/* 1. Ambient Warm Diffused Background: Eliminates harsh black bars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {isUsingVideo ? (
          <video
            src={activeVideoSrc!}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover blur-2xl opacity-40 scale-110 saturate-125"
          />
        ) : (
          <img
            src={activeMediaSrc}
            alt=""
            className="w-full h-full object-cover blur-2xl opacity-40 scale-110 saturate-125"
          />
        )}
      </div>

      {/* 2. Foreground Main Food Video Motion: Wide-Angle, Full Dish, Uncropped & Centered */}
      <div 
        className="relative z-10 w-full h-full flex items-center justify-center p-2.5 transition-transform duration-300 ease-out"
        style={{
          transform: `scale(${isZoomed ? 1.35 : 1.0}) translate(${panOffset.x}px, ${panOffset.y}px)`
        }}
      >
        {isUsingVideo ? (
          <video
            ref={videoRef}
            src={activeVideoSrc!}
            autoPlay
            loop
            muted
            playsInline
            controls={false}
            onError={() => {
              if (videoCandidateIdx + 1 < videoCandidates.length) {
                setVideoCandidateIdx((prev) => prev + 1);
              } else {
                setVideoFailed(true);
              }
            }}
            className={`transition-all duration-300 rounded-2xl drop-shadow-[0_20px_45px_rgba(0,0,0,0.85)] ${
              fitMode === 'contain'
                ? 'max-h-full max-w-full object-contain'
                : 'w-full h-full object-cover'
            }`}
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
            className={`transition-all duration-300 rounded-2xl drop-shadow-[0_20px_45px_rgba(0,0,0,0.85)] ${
              fitMode === 'contain'
                ? 'max-h-full max-w-full object-contain filter saturate-[1.1] contrast-[1.05]'
                : 'w-full h-full object-cover filter saturate-[1.1] contrast-[1.05]'
            }`}
            draggable={false}
          />
        )}
      </div>

      {/* 3. Subtle Lighting Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-slate-950/30 pointer-events-none z-10" />

      {/* 4. Live Rising Steam Particle Canvas */}
      <canvas
        ref={steamCanvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-20"
      />

      {/* 5. Top-Right Floating Controls */}
      {controlsPosition === 'top-right' && (
        <div className="absolute top-4 right-16 z-30 flex items-center gap-1.5 pointer-events-auto">
          {/* Fit Mode Toggle: Full Dish vs Close-Up */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setFitMode((prev) => (prev === 'contain' ? 'cover' : 'contain'));
            }}
            className="px-2.5 py-1.5 rounded-full bg-black/65 hover:bg-black/85 text-slate-200 hover:text-white border border-white/15 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-md backdrop-blur-md"
            title={fitMode === 'contain' ? 'Wide View (Whole Dish Visible)' : 'Close-up View'}
          >
            {fitMode === 'contain' ? (
              <>
                <Minimize2 className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px] font-bold">Full Dish</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px] font-bold">Fill</span>
              </>
            )}
          </button>

          {/* Pause / Play Motion */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsPlaying((prev) => !prev);
            }}
            className="px-2.5 py-1.5 rounded-full bg-black/65 hover:bg-black/85 text-slate-200 hover:text-white border border-white/15 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-md backdrop-blur-md"
            title={isPlaying ? 'Pause video' : 'Play video'}
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
                ? 'bg-amber-500 text-slate-950 border-amber-300 font-black' 
                : 'bg-black/65 hover:bg-black/85 text-slate-200 hover:text-white border-white/15'
            }`}
            title="Inspect Close-up"
          >
            {isZoomed ? <ZoomOut className="w-3.5 h-3.5" /> : <ZoomIn className="w-3.5 h-3.5 text-amber-300" />}
            <span className="text-[11px]">{isZoomed ? 'Reset' : 'Zoom'}</span>
          </button>

          {/* Reset Pan / View */}
          {(panOffset.x !== 0 || panOffset.y !== 0 || isZoomed) && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleResetPan();
              }}
              className="w-8 h-8 rounded-full bg-black/65 hover:bg-black/85 text-slate-200 hover:text-white border border-white/15 transition-all flex items-center justify-center cursor-pointer active:scale-95 shadow-md backdrop-blur-md"
              title="Reset View"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* 6. Drag Hint Pill */}
      {!hasInteracted && isZoomed && (
        <div className="absolute top-16 right-4 z-30 pointer-events-none animate-bounce">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/90 backdrop-blur-md text-slate-950 text-[10px] font-black shadow-lg border border-amber-300">
            <span>Drag to pan & inspect ingredients</span>
          </div>
        </div>
      )}

      {/* 7. Bottom-Left Culinary Tasting Video Badge */}
      <div className="absolute bottom-3 left-4 z-30 pointer-events-none">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-amber-400/30 text-amber-300 text-[11px] font-bold shadow-lg">
          <Video className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>Live Culinary Video • {foodName}</span>
        </div>
      </div>
    </div>
  );
};

export default FoodModelViewer3D;
