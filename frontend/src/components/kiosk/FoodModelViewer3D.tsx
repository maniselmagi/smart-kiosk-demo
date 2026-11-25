import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RotateCw, Play, Pause, RefreshCw, Box, Sparkles } from 'lucide-react';
import { getModelCandidateUrls } from '../../utils/foodModels3D';

interface FoodModelViewer3DProps {
  modelUrl?: string;
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
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true);
  const [rotationSpeed, setRotationSpeed] = useState<number>(0.007);
  const [hasUserInteracted, setHasUserInteracted] = useState<boolean>(false);

  // References for mutable animation & interaction state
  const isAutoRotatingRef = useRef<boolean>(true);
  const rotationSpeedRef = useRef<number>(0.007);
  const isDraggingRef = useRef<boolean>(false);
  const pointerStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const modelPivotRef = useRef<THREE.Group | null>(null);
  const resumeTimerRef = useRef<any>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Synchronize refs with state
  useEffect(() => {
    isAutoRotatingRef.current = isAutoRotating;
  }, [isAutoRotating]);

  useEffect(() => {
    rotationSpeedRef.current = rotationSpeed;
  }, [rotationSpeed]);

  const handleToggleAutoRotate = () => {
    setIsAutoRotating(prev => !prev);
  };

  const handleToggleSpeed = () => {
    setRotationSpeed(prev => (prev >= 0.012 ? 0.005 : prev >= 0.007 ? 0.014 : 0.007));
  };

  const handleResetView = () => {
    if (modelPivotRef.current) {
      modelPivotRef.current.rotation.set(0.14, 0, 0);
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

    // 1. Scene Setup
    const scene = new THREE.Scene();

    // 2. Camera Setup (Angled downward into the food dish)
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 50);
    camera.position.set(0, 0.95, cameraDistance);
    camera.lookAt(0, 0.05, 0);

    // 3. High-Performance Studio Renderer
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

    // 4. Studio Food Lighting (Warm key + cool fill + gold rim glow)
    const ambientLight = new THREE.AmbientLight(0xfff5ea, 1.9);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(3.5, 5, 4);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xb5d4ff, 1.3);
    fillLight.position.set(-4, 3, -2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xf59e0b, 2.2);
    rimLight.position.set(0, 4.5, -4);
    scene.add(rimLight);

    // Radial under-glow beneath the pedestal
    const haloGeo = new THREE.CircleGeometry(1.2, 36);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.12
    });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    haloMesh.rotation.x = -Math.PI / 2;
    haloMesh.position.y = -0.015;
    scene.add(haloMesh);

    // Contact drop shadow beneath the turntable
    const shadowGeo = new THREE.CircleGeometry(0.95, 36);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x010409,
      transparent: true,
      opacity: 0.65
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -0.01;
    scene.add(shadowMesh);

    // 5. Model Container Pivot Group
    const pivot = new THREE.Group();
    pivot.rotation.x = 0.14; // Natural ~14° dining angle
    scene.add(pivot);
    modelPivotRef.current = pivot;

    // 6. Realistic 3D Turntable Platter Construction (The Iconic Rotating Food GIF Presentation)
    let isDisposed = false;

    const buildPhotorealisticTurntable = (imgUrl?: string) => {
      const platterGroup = new THREE.Group();

      // Base platter (Obsidian / ceramic dining disc with beveled edge)
      const baseGeo = new THREE.CylinderGeometry(1.22, 1.14, 0.09, 64);
      const baseMat = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        metalness: 0.82,
        roughness: 0.22
      });
      const baseMesh = new THREE.Mesh(baseGeo, baseMat);
      baseMesh.position.y = 0.025;
      baseMesh.castShadow = true;
      baseMesh.receiveShadow = true;
      platterGroup.add(baseMesh);

      // Metallic Gold Beveled Rim Ring
      const rimGeo = new THREE.TorusGeometry(1.21, 0.022, 16, 64);
      const rimMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        metalness: 0.92,
        roughness: 0.15
      });
      const rimMesh = new THREE.Mesh(rimGeo, rimMat);
      rimMesh.rotation.x = Math.PI / 2;
      rimMesh.position.y = 0.07;
      platterGroup.add(rimMesh);

      // Inner Accent Glow Ring
      const innerRingGeo = new THREE.TorusGeometry(1.06, 0.012, 12, 64);
      const innerRingMat = new THREE.MeshStandardMaterial({
        color: 0xd97706,
        metalness: 0.75,
        roughness: 0.28
      });
      const innerRingMesh = new THREE.Mesh(innerRingGeo, innerRingMat);
      innerRingMesh.rotation.x = Math.PI / 2;
      innerRingMesh.position.y = 0.072;
      platterGroup.add(innerRingMesh);

      // Authentic Dish Texture mapped onto the rotating 3D platter face
      if (imgUrl) {
        const texLoader = new THREE.TextureLoader();
        texLoader.setCrossOrigin('anonymous');
        texLoader.load(
          imgUrl,
          (texture) => {
            if (isDisposed) return;
            texture.colorSpace = THREE.SRGBColorSpace;
            const dishFaceGeo = new THREE.CircleGeometry(1.18, 64);
            const dishFaceMat = new THREE.MeshStandardMaterial({
              map: texture,
              roughness: 0.35,
              metalness: 0.06
            });
            const dishFace = new THREE.Mesh(dishFaceGeo, dishFaceMat);
            dishFace.rotation.x = -Math.PI / 2;
            dishFace.position.y = 0.071;
            dishFace.receiveShadow = true;
            platterGroup.add(dishFace);
            setIsLoading(false);
          },
          undefined,
          () => {
            setIsLoading(false);
          }
        );
      } else {
        setIsLoading(false);
      }

      pivot.add(platterGroup);
    };

    // If a dedicated GLB model exists, attempt loading it; otherwise, use the photorealistic 3D turntable immediately
    if (modelUrl && modelUrl.endsWith('.glb')) {
      const loader = new GLTFLoader();
      const candidates = getModelCandidateUrls(modelUrl);

      const tryLoadCandidate = (idx: number) => {
        if (isDisposed) return;
        if (!candidates || idx >= candidates.length) {
          // GLB unavailable -> Fallback to Photorealistic 3D Turntable with authentic dish photograph
          buildPhotorealisticTurntable(fallbackImage);
          return;
        }

        const currentUrl = candidates[idx];
        loader.load(
          currentUrl,
          (gltf) => {
            if (isDisposed) return;
            setIsLoading(false);

            const model = gltf.scene;
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z) || 1;
            const normalizedScale = (scale * 1.5) / maxDim;

            model.scale.setScalar(normalizedScale);
            model.position.sub(center.multiplyScalar(normalizedScale));
            model.position.y += 0.04;

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
          () => {
            tryLoadCandidate(idx + 1);
          }
        );
      };

      tryLoadCandidate(0);
    } else {
      buildPhotorealisticTurntable(fallbackImage);
    }

    // 7. Rising Hot Food Steam Particle System
    const particleCount = 24;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSpeeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 0.75;
      particlePositions[i * 3] = Math.cos(angle) * radius;
      particlePositions[i * 3 + 1] = 0.08 + Math.random() * 0.9;
      particlePositions[i * 3 + 2] = Math.sin(angle) * radius;
      particleSpeeds[i] = 0.0022 + Math.random() * 0.003;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const steamCanvas = document.createElement('canvas');
    steamCanvas.width = 32;
    steamCanvas.height = 32;
    const ctx = steamCanvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, 'rgba(255, 248, 235, 0.4)');
      grad.addColorStop(0.5, 'rgba(255, 220, 180, 0.12)');
      grad.addColorStop(1, 'rgba(255, 220, 180, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 32, 32);
    }
    const steamTex = new THREE.CanvasTexture(steamCanvas);
    const particleMat = new THREE.PointsMaterial({
      size: 0.24,
      map: steamTex,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    const steamPoints = new THREE.Points(particleGeo, particleMat);
    scene.add(steamPoints);

    // 8. 360° Drag Gesture Controls (Touch & Mouse)
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

      // Horizontal Drag: 360° Free Turntable Spin
      modelPivotRef.current.rotation.y += deltaX * 0.009;

      // Vertical Drag: Perspective Elevation (-18° to +38°)
      const currentX = modelPivotRef.current.rotation.x;
      modelPivotRef.current.rotation.x = Math.max(-0.25, Math.min(0.65, currentX + deltaY * 0.005));

      pointerStartRef.current = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      try {
        (e.target as HTMLElement)?.releasePointerCapture?.(e.pointerId);
      } catch {}

      // Auto-resume gentle rotation after 2 seconds
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = setTimeout(() => {
        if (isAutoRotatingRef.current) {
          // Keep rotating
        }
      }, 2000);
    };

    container.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);

    // 9. Resize Handling
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || 600;
      height = container.clientHeight || 340;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // 10. Animation Loop (Smooth 360° Rotating Turntable)
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      if (isAutoRotatingRef.current && !isDraggingRef.current && modelPivotRef.current) {
        modelPivotRef.current.rotation.y += rotationSpeedRef.current;
      }

      // Drift steam particles upward
      const posAttr = particleGeo.attributes.position as THREE.BufferAttribute;
      if (posAttr) {
        const arr = posAttr.array as Float32Array;
        for (let i = 0; i < particleCount; i++) {
          arr[i * 3 + 1] += particleSpeeds[i];
          if (arr[i * 3 + 1] > 1.3) {
            arr[i * 3 + 1] = 0.08;
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * 0.75;
            arr[i * 3] = Math.cos(angle) * radius;
            arr[i * 3 + 2] = Math.sin(angle) * radius;
          }
        }
        posAttr.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 11. Cleanup on Unmount
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
      haloGeo.dispose();
      haloMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      steamTex.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      modelPivotRef.current = null;
    };
  }, [modelUrl, fallbackImage, scale, cameraDistance]);

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden select-none touch-none bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 ${className}`}
      style={{ touchAction: 'none' }}
    >
      {/* Three.js Real-time 3D Canvas */}
      <canvas 
        ref={canvasRef} 
        className="w-full h-full cursor-grab active:cursor-grabbing block" 
      />

      {/* Studio Lighting Glow Backdrop */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.08)_0%,transparent_70%)]" />

      {/* Loading Progress Indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/85 backdrop-blur-xs text-white z-20">
          <div className="relative w-10 h-10 mb-2">
            <div className="absolute inset-0 rounded-full border-2 border-amber-500/20" />
            <div className="absolute inset-0 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
            <Box className="w-4 h-4 text-amber-400 absolute inset-0 m-auto" />
          </div>
          <span className="text-xs font-bold text-amber-200 tracking-wide">
            Rendering 3D Rotating Animation...
          </span>
        </div>
      )}

      {/* Top-Right Control Bar */}
      {controlsPosition === 'top-right' && !isLoading && (
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

          {/* Speed Toggle */}
          <button
            type="button"
            onClick={handleToggleSpeed}
            className="px-2 py-1.5 rounded-full bg-black/60 hover:bg-black/80 text-amber-300 hover:text-white border border-white/15 text-[11px] font-black transition-all flex items-center gap-1 cursor-pointer active:scale-95 shadow-md backdrop-blur-md"
            title="Adjust 3D rotation speed"
          >
            <span>{rotationSpeed >= 0.012 ? '2x' : rotationSpeed >= 0.007 ? '1x' : '0.5x'}</span>
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
      {controlsPosition === 'top-right' && !hasUserInteracted && !isLoading && (
        <div className="absolute top-16 right-4 z-10 pointer-events-none animate-bounce">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/90 backdrop-blur-md text-slate-950 text-[10px] font-black shadow-lg">
            <RotateCw className="w-3 h-3" />
            <span>Drag horizontally to rotate 360°</span>
          </div>
        </div>
      )}

      {/* Bottom Floating Control Bar */}
      {controlsPosition === 'bottom' && !isLoading && (
        <div className="absolute bottom-3 left-4 right-4 z-10 flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white/90 text-[11px] font-semibold border border-white/10">
            <RotateCw className="w-3 h-3 text-amber-400" />
            <span>Drag to rotate 360°</span>
          </div>

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
