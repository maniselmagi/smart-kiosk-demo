import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RotateCw, Play, Pause, RefreshCw, Box, AlertCircle } from 'lucide-react';
import { getModelCandidateUrls } from '../../utils/foodModels3D';

interface FoodModelViewer3DProps {
  modelUrl: string;
  fallbackImage?: string;
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
      modelPivotRef.current.rotation.set(0.12, 0, 0);
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

    // 1. Scene Setup
    const scene = new THREE.Scene();

    // 2. Camera Setup (Perspective angled directly into the food dish)
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 50);
    camera.position.set(0, 0.9, cameraDistance);
    camera.lookAt(0, 0.08, 0);

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
    renderer.toneMappingExposure = 1.35;

    // 4. Natural Studio Food Lighting (Warm ambient + key + soft fill + subtle rim)
    const ambientLight = new THREE.AmbientLight(0xfff7ee, 1.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.6);
    keyLight.position.set(3, 5, 4);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xb0d0ff, 1.2);
    fillLight.position.set(-4, 3, -2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffa726, 1.8);
    rimLight.position.set(0, 4, -4);
    scene.add(rimLight);

    // Realistic soft contact shadow beneath the dish
    const shadowGeo = new THREE.CircleGeometry(0.85, 36);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x02050c,
      transparent: true,
      opacity: 0.55
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -0.01;
    scene.add(shadowMesh);

    // 5. Model Container Pivot Group
    const pivot = new THREE.Group();
    pivot.rotation.x = 0.12; // Natural 12° tilt for dining perspective
    scene.add(pivot);
    modelPivotRef.current = pivot;

    // 6. Asynchronous GLTF/GLB Loading with Multi-Candidate Progressive Fallback
    const loader = new GLTFLoader();
    let isDisposed = false;
    const candidates = getModelCandidateUrls(modelUrl);

    const tryLoadCandidate = (idx: number) => {
      if (isDisposed) return;
      if (!candidates || idx >= candidates.length) {
        console.warn(`[FoodModelViewer3D] All candidates failed for model: ${modelUrl}`);
        setIsLoading(false);
        setHasError(true);
        return;
      }

      const currentUrl = candidates[idx];
      loader.load(
        currentUrl,
        (gltf) => {
          if (isDisposed) return;
          setIsLoading(false);
          setHasError(false);

          const model = gltf.scene;

          // Auto-center and normalize size
          const box = new THREE.Box3().setFromObject(model);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z) || 1;
          const normalizedScale = (scale * 1.5) / maxDim;

          model.scale.setScalar(normalizedScale);
          model.position.sub(center.multiplyScalar(normalizedScale));
          model.position.y += 0.04;

          // Natural PBR lighting luster
          model.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              const mesh = child as THREE.Mesh;
              mesh.castShadow = true;
              mesh.receiveShadow = true;
              if (mesh.material) {
                const mat = mesh.material as THREE.MeshStandardMaterial;
                mat.roughness = Math.max(0.3, mat.roughness ?? 0.5);
                mat.metalness = Math.min(0.2, mat.metalness ?? 0.05);
              }
            }
          });

          pivot.add(model);
        },
        undefined,
        (err) => {
          console.warn(`[FoodModelViewer3D] Candidate ${idx} (${currentUrl}) failed:`, err);
          // Try next candidate URL
          tryLoadCandidate(idx + 1);
        }
      );
    };

    if (candidates.length > 0) {
      tryLoadCandidate(0);
    } else {
      setIsLoading(false);
      setHasError(true);
    }

    // 7. Interactive 360° Drag Gesture Controls (Touch & Mouse)
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

      // Horizontal Drag: 360° Free Spin Control
      modelPivotRef.current.rotation.y += deltaX * 0.008;

      // Vertical Drag: Subtle elevation angle clamp (-20° to +35°)
      const currentX = modelPivotRef.current.rotation.x;
      modelPivotRef.current.rotation.x = Math.max(-0.35, Math.min(0.6, currentX + deltaY * 0.005));

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

    // 9. Continuous 3D Animation Loop (Gentle ~0.35 RPM auto-spin)
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      if (isAutoRotatingRef.current && !isDraggingRef.current && modelPivotRef.current) {
        modelPivotRef.current.rotation.y += 0.005; // Gentle ~0.35 RPM orbit
      }

      renderer.render(scene, camera);
    };

    animate();

    // 10. WebGL Resource Disposal (Zero Memory Leaks on Kiosks)
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

      shadowGeo.dispose();
      shadowMat.dispose();
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
      {/* Fallback View: Authentic Photograph if Model is Unavailable or Inaccurate */}
      {hasError && fallbackImage ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 z-20">
          <img 
            src={fallbackImage} 
            alt={foodName} 
            className="w-full h-full object-cover" 
          />
          <div className="absolute bottom-3 left-4 right-4 bg-slate-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/10 flex items-center justify-between text-xs text-amber-300">
            <span className="flex items-center gap-1.5 font-medium">
              <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Verified Menu Photograph</span>
            </span>
          </div>
        </div>
      ) : (
        /* Three.js Real-time WebGL Canvas */
        <canvas 
          ref={canvasRef} 
          className="w-full h-full cursor-grab active:cursor-grabbing block" 
        />
      )}

      {/* Subtle Studio Lighting Glow Backdrop */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.06)_0%,transparent_70%)]" />

      {/* Loading Progress Indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/85 backdrop-blur-xs text-white z-20">
          <div className="relative w-10 h-10 mb-2">
            <div className="absolute inset-0 rounded-full border-2 border-amber-500/20" />
            <div className="absolute inset-0 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
            <Box className="w-4 h-4 text-amber-400 absolute inset-0 m-auto" />
          </div>
          <span className="text-xs font-bold text-amber-200 tracking-wide">
            Loading Photorealistic 3D Model...
          </span>
        </div>
      )}

      {/* Top-Right Control Bar */}
      {controlsPosition === 'top-right' && !hasError && !isLoading && (
        <div className="absolute top-4 right-16 z-20 flex items-center gap-1.5 pointer-events-auto">
          {/* Pause / Play Auto-Rotation */}
          <button
            type="button"
            onClick={handleToggleAutoRotate}
            className="px-2.5 py-1.5 rounded-full bg-black/60 hover:bg-black/80 text-slate-200 hover:text-white border border-white/15 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-md backdrop-blur-md"
            title={isAutoRotating ? 'Pause 3D rotation' : 'Resume 3D rotation'}
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
            title="Reset 3D view"
            aria-label="Reset 3D view"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Drag Hint Pill */}
      {controlsPosition === 'top-right' && !hasUserInteracted && !hasError && !isLoading && (
        <div className="absolute top-16 right-4 z-10 pointer-events-none animate-bounce">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/90 backdrop-blur-md text-slate-950 text-[10px] font-black shadow-lg">
            <RotateCw className="w-3 h-3" />
            <span>Drag horizontally to rotate 360°</span>
          </div>
        </div>
      )}

      {/* Bottom Floating Control Bar (Standard standalone mode) */}
      {controlsPosition === 'bottom' && !hasError && !isLoading && (
        <div className="absolute bottom-3 left-4 right-4 z-10 flex items-center justify-between pointer-events-auto">
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

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleToggleAutoRotate}
              className="px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white border border-white/10 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer active:scale-95 shadow-sm"
              title={isAutoRotating ? 'Pause 3D rotation' : 'Resume 3D rotation'}
            >
              {isAutoRotating ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[10px]">Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[10px]">Spin</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleResetView}
              className="p-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white border border-white/10 transition-all cursor-pointer active:scale-95 shadow-sm"
              title="Reset 3D view"
              aria-label="Reset 3D view"
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
