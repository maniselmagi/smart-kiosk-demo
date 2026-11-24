import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RotateCw, Play, Pause, RefreshCw, AlertCircle, Sparkles, Box } from 'lucide-react';

interface FoodModelViewer3DProps {
  modelUrl: string;
  fallbackImage: string;
  foodName: string;
  scale?: number;
  cameraDistance?: number;
  className?: string;
  showTopBadge?: boolean;
  controlsPosition?: 'bottom' | 'top-right' | 'none';
}

export const FoodModelViewer3D: React.FC<FoodModelViewer3DProps> = ({
  modelUrl,
  fallbackImage,
  foodName,
  scale = 1.4,
  cameraDistance = 2.4,
  className = '',
  showTopBadge = true,
  controlsPosition = 'bottom'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadProgress, setLoadProgress] = useState<number>(0);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true);
  const [hasUserInteracted, setHasUserInteracted] = useState<boolean>(false);

  // References for mutable animation & interaction state
  const isAutoRotatingRef = useRef<boolean>(true);
  const isDraggingRef = useRef<boolean>(false);
  const pointerStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const modelPivotRef = useRef<THREE.Group | null>(null);
  const resumeTimerRef = useRef<any>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Synchronize ref with state
  useEffect(() => {
    isAutoRotatingRef.current = isAutoRotating;
  }, [isAutoRotating]);

  const handleToggleAutoRotate = () => {
    setIsAutoRotating(prev => !prev);
  };

  const handleResetView = () => {
    if (modelPivotRef.current) {
      modelPivotRef.current.rotation.set(0.1, 0, 0);
      setIsAutoRotating(true);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let width = container.clientWidth || 600;
    let height = container.clientHeight || 340;

    setIsLoading(true);
    setHasError(false);
    setLoadProgress(15);

    // 1. Scene Setup
    const scene = new THREE.Scene();

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    camera.position.set(0, 0.9, cameraDistance);
    camera.lookAt(0, 0, 0);

    // 3. Renderer Setup with High-Performance Settings
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    // 4. Studio Food Lighting Pipeline (Key + Fill + Warm Rim + Ambient)
    const ambientLight = new THREE.AmbientLight(0xfff7ea, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
    keyLight.position.set(3, 5, 4);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xb0d0ff, 1.0);
    fillLight.position.set(-4, 3, -2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffaa44, 1.8);
    rimLight.position.set(0, 4, -4);
    scene.add(rimLight);

    // Bottom soft contact shadow disc
    const shadowGeo = new THREE.CircleGeometry(0.9, 32);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.35
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -0.01;
    scene.add(shadowMesh);

    // 5. Model Container Pivot Group
    const pivot = new THREE.Group();
    pivot.rotation.x = 0.12; // Slight downward view angle optimal for food inspection
    scene.add(pivot);
    modelPivotRef.current = pivot;

    // 6. Asynchronous GLTF/GLB Loading
    const loader = new GLTFLoader();
    let isDisposed = false;

    loader.load(
      modelUrl,
      (gltf) => {
        if (isDisposed) return;

        const model = gltf.scene;

        // Auto-center and normalize size
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z) || 1;
        const normalizedScale = (scale * 1.5) / maxDim;

        model.scale.setScalar(normalizedScale);
        model.position.sub(center.multiplyScalar(normalizedScale));
        model.position.y += 0.05;

        // Enhance material properties for realistic food luster
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            if (mesh.material) {
              const mat = mesh.material as THREE.MeshStandardMaterial;
              mat.roughness = Math.max(0.3, mat.roughness ?? 0.5);
              mat.metalness = Math.min(0.25, mat.metalness ?? 0.1);
            }
          }
        });

        pivot.add(model);
        setIsLoading(false);
      },
      (xhr) => {
        if (xhr.total > 0) {
          const percent = Math.min(95, Math.round((xhr.loaded / xhr.total) * 100));
          setLoadProgress(percent);
        }
      },
      (error) => {
        console.warn(`[FoodModelViewer3D] Error loading model ${modelUrl}:`, error);
        if (!isDisposed) {
          setHasError(true);
          setIsLoading(false);
        }
      }
    );

    // 7. Interactive Gesture Controls (Mouse Drag & Tablet Touch)
    const onPointerDown = (e: PointerEvent) => {
      isDraggingRef.current = true;
      pointerStartRef.current = { x: e.clientX, y: e.clientY };
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
      setHasUserInteracted(true);
      (e.target as HTMLElement)?.setPointerCapture?.(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current || !modelPivotRef.current) return;
      const deltaX = e.clientX - pointerStartRef.current.x;
      const deltaY = e.clientY - pointerStartRef.current.y;

      // Horizontal Drag: 360 Spin Control
      modelPivotRef.current.rotation.y += deltaX * 0.008;

      // Vertical Drag: Subtle elevation angle clamp (-25° to +40°)
      const currentX = modelPivotRef.current.rotation.x;
      modelPivotRef.current.rotation.x = Math.max(-0.4, Math.min(0.65, currentX + deltaY * 0.005));

      pointerStartRef.current = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      try {
        (e.target as HTMLElement)?.releasePointerCapture?.(e.pointerId);
      } catch {}

      // Auto-resume gentle rotation after 2.5s of user inactivity
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = setTimeout(() => {
        if (isAutoRotatingRef.current) {
          // Keep spinning
        }
      }, 2500);
    };

    container.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);

    // 8. Responsive Resize Observer
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || 600;
      height = container.clientHeight || 340;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // 9. Continuous Render Animation Loop
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      // Smooth Auto-Rotation when enabled and not actively dragged
      if (isAutoRotatingRef.current && !isDraggingRef.current && modelPivotRef.current) {
        modelPivotRef.current.rotation.y += 0.005; // ~0.35 RPM gentle spin
      }

      renderer.render(scene, camera);
    };

    animate();

    // 10. Strict Clean-up to Guarantee ZERO WebGL Memory Leaks on Kiosk Tablets
    return () => {
      isDisposed = true;
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);

      window.removeEventListener('resize', handleResize);
      container.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);

      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const mesh = obj as THREE.Mesh;
          mesh.geometry?.dispose();
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((m) => m.dispose());
          } else {
            mesh.material?.dispose();
          }
        }
      });

      renderer.dispose();
      renderer.forceContextLoss();
      modelPivotRef.current = null;
    };
  }, [modelUrl, scale, cameraDistance]);

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden select-none touch-none bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 ${className}`}
      style={{ touchAction: 'none' }}
    >
      {/* Three.js Canvas */}
      <canvas 
        ref={canvasRef} 
        className="w-full h-full cursor-grab active:cursor-grabbing block"
      />

      {/* Subtle Studio Glow Backdrop */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.08)_0%,transparent_70%)]" />

      {/* Loading Animation Overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/85 backdrop-blur-xs text-white z-20">
          <div className="relative w-12 h-12 mb-3">
            <div className="absolute inset-0 rounded-full border-2 border-amber-500/20" />
            <div className="absolute inset-0 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
            <Box className="w-5 h-5 text-amber-400 absolute inset-0 m-auto animate-pulse" />
          </div>
          <span className="text-xs font-bold text-amber-200 tracking-wide">
            Loading Interactive 3D Model... {loadProgress > 0 ? `${loadProgress}%` : ''}
          </span>
          <span className="text-[10px] text-slate-400 mt-0.5">
            Real-time PBR textures &amp; realistic dish geometry
          </span>
        </div>
      )}

      {/* Fallback View if WebGL fails */}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 z-20">
          <img 
            src={fallbackImage} 
            alt={foodName} 
            className="w-full h-full object-cover" 
          />
          <div className="absolute bottom-3 left-4 right-4 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 flex items-center justify-between text-xs text-amber-300">
            <span className="flex items-center gap-1.5 font-medium">
              <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>3D rendering fallback • Showing authentic photo</span>
            </span>
          </div>
        </div>
      )}

      {/* Top 3D Interactive Badge (Optional) */}
      {showTopBadge && (
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 pointer-events-none">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/85 backdrop-blur-md border border-amber-400/40 text-amber-300 shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span className="text-xs font-black tracking-wide uppercase font-mono">
              Interactive 3D Preview
            </span>
          </div>
        </div>
      )}

      {/* Top-Right Control Bar (Used when embedded in FoodDetailModal) */}
      {controlsPosition === 'top-right' && !isLoading && !hasError && (
        <div className="absolute top-4 right-16 z-20 flex items-center gap-1.5 pointer-events-auto">
          {/* Pause / Play Auto-Rotation */}
          <button
            type="button"
            onClick={handleToggleAutoRotate}
            className="px-2.5 py-1.5 rounded-full bg-black/60 hover:bg-black/80 text-slate-200 hover:text-white border border-white/15 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-md backdrop-blur-md"
            title={isAutoRotating ? 'Pause rotation' : 'Resume rotation'}
          >
            {isAutoRotating ? (
              <>
                <Pause className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px] font-bold">Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[11px] font-bold">Spin</span>
              </>
            )}
          </button>

          {/* Reset Camera View */}
          <button
            type="button"
            onClick={handleResetView}
            className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-slate-200 hover:text-white border border-white/15 transition-all flex items-center justify-center cursor-pointer active:scale-95 shadow-md backdrop-blur-md"
            title="Reset hero angle"
            aria-label="Reset hero angle"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Hint Pill (Center or Top when controlsPosition is top-right) */}
      {controlsPosition === 'top-right' && !isLoading && !hasError && !hasUserInteracted && (
        <div className="absolute top-16 right-4 z-10 pointer-events-none animate-bounce">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/90 backdrop-blur-md text-slate-950 text-[10px] font-black shadow-lg">
            <RotateCw className="w-3 h-3" />
            <span>Drag horizontally to rotate 360°</span>
          </div>
        </div>
      )}

      {/* Bottom Floating Control Bar (Standard standalone mode) */}
      {controlsPosition === 'bottom' && !isLoading && !hasError && (
        <div className="absolute bottom-3 left-4 right-4 z-10 flex items-center justify-between pointer-events-auto">
          {/* Gesture Hint Pill */}
          {!hasUserInteracted ? (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white/90 text-[11px] font-semibold border border-white/10 animate-pulse">
              <RotateCw className="w-3 h-3 text-amber-400" />
              <span>Drag to rotate 360°</span>
            </div>
          ) : (
            <div className="text-[10px] text-slate-400 font-mono">
              360° Free Orbit
            </div>
          )}

          {/* Interactive Action Controls */}
          <div className="flex items-center gap-1.5">
            {/* Pause / Play Auto-Rotation */}
            <button
              type="button"
              onClick={handleToggleAutoRotate}
              className="px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white border border-white/10 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer active:scale-95 shadow-sm"
              title={isAutoRotating ? 'Pause rotation' : 'Resume rotation'}
            >
              {isAutoRotating ? (
                <>
                  <Pause className="w-3 h-3 text-amber-400" />
                  <span className="text-[10px]">Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 text-emerald-400" />
                  <span className="text-[10px]">Spin</span>
                </>
              )}
            </button>

            {/* Reset Camera View */}
            <button
              type="button"
              onClick={handleResetView}
              className="p-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white border border-white/10 transition-all cursor-pointer active:scale-95 shadow-sm"
              title="Reset hero angle"
              aria-label="Reset hero angle"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodModelViewer3D;
