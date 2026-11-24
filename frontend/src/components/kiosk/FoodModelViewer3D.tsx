import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RotateCw, Play, Pause, RefreshCw, Sparkles, Box } from 'lucide-react';
import { resolveModelAssetUrl, ProceduralDishType } from '../../utils/foodModels3D';

interface FoodModelViewer3DProps {
  modelUrl: string;
  fallbackImage?: string;
  foodName: string;
  proceduralType?: ProceduralDishType;
  scale?: number;
  cameraDistance?: number;
  className?: string;
  showTopBadge?: boolean;
  controlsPosition?: 'bottom' | 'top-right' | 'none';
}

export const FoodModelViewer3D: React.FC<FoodModelViewer3DProps> = ({
  modelUrl,
  foodName,
  proceduralType = 'platter',
  scale = 1.4,
  cameraDistance = 2.4,
  className = '',
  showTopBadge = true,
  controlsPosition = 'bottom'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
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

    // 1. Scene Setup
    const scene = new THREE.Scene();

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    camera.position.set(0, 0.85, cameraDistance);
    camera.lookAt(0, 0.1, 0);

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

    // 4. Studio Food Lighting Pipeline (Key + Fill + Warm Rim + Ambient)
    const ambientLight = new THREE.AmbientLight(0xfff5ea, 1.6);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.6);
    keyLight.position.set(3, 5, 4);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xa5c5ff, 1.2);
    fillLight.position.set(-4, 3, -2);
    scene.add(fillLight);

    const warmRimLight = new THREE.DirectionalLight(0xf59e0b, 2.2);
    warmRimLight.position.set(0, 4, -4);
    scene.add(warmRimLight);

    // Subtle Ground Glow
    const groundGlowGeo = new THREE.CircleGeometry(1.1, 32);
    const groundGlowMat = new THREE.MeshBasicMaterial({
      color: 0x050811,
      transparent: true,
      opacity: 0.6
    });
    const groundGlow = new THREE.Mesh(groundGlowGeo, groundGlowMat);
    groundGlow.rotation.x = -Math.PI / 2;
    groundGlow.position.y = -0.06;
    scene.add(groundGlow);

    // 5. Model Container Pivot Group
    const pivot = new THREE.Group();
    pivot.rotation.x = 0.12; // Slight downward view angle optimal for food inspection
    scene.add(pivot);
    modelPivotRef.current = pivot;

    // 6. Luxury 3D Dining Turntable Platter Base
    const platterGroup = new THREE.Group();
    
    // Marble plate base
    const platterGeo = new THREE.CylinderGeometry(0.85, 0.78, 0.04, 48);
    const platterMat = new THREE.MeshStandardMaterial({
      color: 0x161a23,
      roughness: 0.35,
      metalness: 0.2
    });
    const platterMesh = new THREE.Mesh(platterGeo, platterMat);
    platterMesh.position.y = -0.02;
    platterGroup.add(platterMesh);

    // Polished gold rim ring
    const rimGeo = new THREE.TorusGeometry(0.85, 0.012, 16, 48);
    const rimMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.9,
      roughness: 0.15
    });
    const rimMesh = new THREE.Mesh(rimGeo, rimMat);
    rimMesh.rotation.x = Math.PI / 2;
    rimMesh.position.y = 0.001;
    platterGroup.add(rimMesh);

    pivot.add(platterGroup);

    // 7. Dynamic 3D Steam & Aroma Particle Animation System
    const particleCount = 42;
    const steamGeo = new THREE.BufferGeometry();
    const steamPositions = new Float32Array(particleCount * 3);
    const steamVels: { x: number; y: number; z: number; phase: number; speed: number }[] = [];

    for (let i = 0; i < particleCount; i++) {
      steamPositions[i * 3] = (Math.random() - 0.5) * 0.35;
      steamPositions[i * 3 + 1] = Math.random() * 0.7 + 0.15;
      steamPositions[i * 3 + 2] = (Math.random() - 0.5) * 0.35;
      steamVels.push({
        x: (Math.random() - 0.5) * 0.002,
        y: 0.004 + Math.random() * 0.005,
        z: (Math.random() - 0.5) * 0.002,
        phase: Math.random() * Math.PI * 2,
        speed: 1.2 + Math.random() * 1.8
      });
    }

    steamGeo.setAttribute('position', new THREE.BufferAttribute(steamPositions, 3));

    // Procedural Particle Texture
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 64;
    pCanvas.height = 64;
    const pCtx = pCanvas.getContext('2d')!;
    const pGrad = pCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
    pGrad.addColorStop(0, 'rgba(255, 245, 225, 0.8)');
    pGrad.addColorStop(0.35, 'rgba(255, 215, 160, 0.4)');
    pGrad.addColorStop(1, 'rgba(255, 180, 100, 0)');
    pCtx.fillStyle = pGrad;
    pCtx.fillRect(0, 0, 64, 64);
    const particleTexture = new THREE.CanvasTexture(pCanvas);

    const steamMat = new THREE.PointsMaterial({
      size: 0.2,
      map: particleTexture,
      transparent: true,
      opacity: 0.6,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    const steamParticles = new THREE.Points(steamGeo, steamMat);
    pivot.add(steamParticles);

    // 8. Authentic Procedural 3D Food Mesh System (Active Immediately)
    const foodMeshGroup = new THREE.Group();
    pivot.add(foodMeshGroup);

    const buildProceduralDish = (type: ProceduralDishType) => {
      // Clear previous procedural children
      while (foodMeshGroup.children.length > 0) {
        foodMeshGroup.remove(foodMeshGroup.children[0]);
      }

      if (type === 'coffee') {
        // Traditional Brass Dabarah & Tumbler Filter Coffee
        const brassMat = new THREE.MeshStandardMaterial({
          color: 0xd4af37,
          metalness: 0.92,
          roughness: 0.18
        });

        // Dabarah (Outer brass saucer)
        const dabarahGeo = new THREE.CylinderGeometry(0.48, 0.38, 0.16, 36);
        const dabarah = new THREE.Mesh(dabarahGeo, brassMat);
        dabarah.position.y = 0.08;
        foodMeshGroup.add(dabarah);

        // Tumbler (Tapered brass coffee cup)
        const tumblerGeo = new THREE.CylinderGeometry(0.32, 0.24, 0.38, 36);
        const tumbler = new THREE.Mesh(tumblerGeo, brassMat);
        tumbler.position.y = 0.24;
        foodMeshGroup.add(tumbler);

        // Frothy Coffee Surface Layer
        const coffeeGeo = new THREE.CircleGeometry(0.3, 32);
        const coffeeMat = new THREE.MeshStandardMaterial({
          color: 0x5a3215,
          roughness: 0.4,
          metalness: 0.1
        });
        const coffee = new THREE.Mesh(coffeeGeo, coffeeMat);
        coffee.rotation.x = -Math.PI / 2;
        coffee.position.y = 0.42;
        foodMeshGroup.add(coffee);

        // Cream / Chicory Froth Swirl
        const frothGeo = new THREE.TorusGeometry(0.18, 0.04, 12, 32);
        const frothMat = new THREE.MeshStandardMaterial({
          color: 0xc89b65,
          roughness: 0.5
        });
        const froth = new THREE.Mesh(frothGeo, frothMat);
        froth.rotation.x = Math.PI / 2;
        froth.position.y = 0.425;
        foodMeshGroup.add(froth);

      } else if (type === 'dessert') {
        // Royal Kesari / Warm Pudding Dish
        const bowlGeo = new THREE.CylinderGeometry(0.55, 0.35, 0.22, 36);
        const bowlMat = new THREE.MeshStandardMaterial({
          color: 0x1f2430,
          metalness: 0.4,
          roughness: 0.3
        });
        const bowl = new THREE.Mesh(bowlGeo, bowlMat);
        bowl.position.y = 0.11;
        foodMeshGroup.add(bowl);

        // Saffron Kesari Mound
        const kesariGeo = new THREE.SphereGeometry(0.42, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5);
        const kesariMat = new THREE.MeshStandardMaterial({
          color: 0xf59e0b,
          roughness: 0.3,
          metalness: 0.05
        });
        const kesari = new THREE.Mesh(kesariGeo, kesariMat);
        kesari.position.y = 0.2;
        foodMeshGroup.add(kesari);

        // Golden Roasted Cashews Garnish
        for (let i = 0; i < 6; i++) {
          const cashewGeo = new THREE.SphereGeometry(0.045, 12, 8);
          cashewGeo.scale(1.8, 1, 0.8);
          const cashewMat = new THREE.MeshStandardMaterial({
            color: 0xfef08a,
            roughness: 0.4
          });
          const cashew = new THREE.Mesh(cashewGeo, cashewMat);
          const angle = (i / 6) * Math.PI * 2;
          cashew.position.set(Math.cos(angle) * 0.24, 0.36, Math.sin(angle) * 0.24);
          cashew.rotation.y = angle;
          foodMeshGroup.add(cashew);
        }

      } else if (type === 'biryani') {
        // Clay Handi Dum Biryani Pot
        const handiGeo = new THREE.SphereGeometry(0.55, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.65);
        const handiMat = new THREE.MeshStandardMaterial({
          color: 0x7c2d12,
          roughness: 0.7
        });
        const handi = new THREE.Mesh(handiGeo, handiMat);
        handi.position.y = 0.15;
        foodMeshGroup.add(handi);

        // Basmati Rice Mound
        const riceGeo = new THREE.ConeGeometry(0.48, 0.28, 32);
        const riceMat = new THREE.MeshStandardMaterial({
          color: 0xfef9c3,
          roughness: 0.6
        });
        const rice = new THREE.Mesh(riceGeo, riceMat);
        rice.position.y = 0.38;
        foodMeshGroup.add(rice);

      } else if (type === 'curry') {
        // Copper Kadai with Rich Curry Gravy
        const kadaiGeo = new THREE.CylinderGeometry(0.58, 0.38, 0.22, 36);
        const kadaiMat = new THREE.MeshStandardMaterial({
          color: 0xb45309,
          metalness: 0.85,
          roughness: 0.25
        });
        const kadai = new THREE.Mesh(kadaiGeo, kadaiMat);
        kadai.position.y = 0.11;
        foodMeshGroup.add(kadai);

        // Rich Gravy Surface
        const curryGeo = new THREE.CircleGeometry(0.52, 32);
        const curryMat = new THREE.MeshStandardMaterial({
          color: 0xd97706,
          roughness: 0.35,
          metalness: 0.1
        });
        const curry = new THREE.Mesh(curryGeo, curryMat);
        curry.rotation.x = -Math.PI / 2;
        curry.position.y = 0.21;
        foodMeshGroup.add(curry);

        // Fresh Cream Swirl
        const swirlGeo = new THREE.TorusGeometry(0.25, 0.03, 12, 32);
        const swirlMat = new THREE.MeshStandardMaterial({
          color: 0xfffbeb,
          roughness: 0.5
        });
        const swirl = new THREE.Mesh(swirlGeo, swirlMat);
        swirl.rotation.x = Math.PI / 2;
        swirl.position.y = 0.215;
        foodMeshGroup.add(swirl);

      } else {
        // Universal Gourmet Platter
        const servingBowlGeo = new THREE.CylinderGeometry(0.58, 0.42, 0.2, 36);
        const servingBowlMat = new THREE.MeshStandardMaterial({
          color: 0x1e293b,
          metalness: 0.3,
          roughness: 0.4
        });
        const servingBowl = new THREE.Mesh(servingBowlGeo, servingBowlMat);
        servingBowl.position.y = 0.1;
        foodMeshGroup.add(servingBowl);

        // Delicious artisanal food core
        const coreGeo = new THREE.DodecahedronGeometry(0.38, 2);
        const coreMat = new THREE.MeshStandardMaterial({
          color: 0xf59e0b,
          roughness: 0.45,
          metalness: 0.1
        });
        const core = new THREE.Mesh(coreGeo, coreMat);
        core.position.y = 0.24;
        foodMeshGroup.add(core);
      }
    };

    // Build the animated procedural 3D model immediately
    buildProceduralDish(proceduralType);

    // 9. Asynchronously Load GLTF/GLB Photorealistic Asset
    const loader = new GLTFLoader();
    let isDisposed = false;
    const resolvedUrl = resolveModelAssetUrl(modelUrl);

    if (resolvedUrl) {
      setIsLoading(true);
      loader.load(
        resolvedUrl,
        (gltf) => {
          if (isDisposed) return;
          setIsLoading(false);

          const model = gltf.scene;
          const box = new THREE.Box3().setFromObject(model);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z) || 1;
          const normalizedScale = (scale * 1.3) / maxDim;

          model.scale.setScalar(normalizedScale);
          model.position.sub(center.multiplyScalar(normalizedScale));
          model.position.y += 0.08;

          model.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              const mesh = child as THREE.Mesh;
              mesh.castShadow = true;
              mesh.receiveShadow = true;
              if (mesh.material) {
                const mat = mesh.material as THREE.MeshStandardMaterial;
                mat.roughness = Math.max(0.25, mat.roughness ?? 0.5);
                mat.metalness = Math.min(0.2, mat.metalness ?? 0.1);
              }
            }
          });

          // Replace procedural mesh with the detailed GLB model
          while (foodMeshGroup.children.length > 0) {
            foodMeshGroup.remove(foodMeshGroup.children[0]);
          }
          foodMeshGroup.add(model);
        },
        undefined,
        (err) => {
          console.warn(`[FoodModelViewer3D] Model asset fallback active for ${resolvedUrl}:`, err);
          setIsLoading(false);
          // Keep procedural 3D model running smoothly so customer always has genuine 3D animation
        }
      );
    }

    // 10. Interactive 360° Drag Gesture Controls (Touch & Mouse)
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

    // 11. Responsive Resize Observer
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || 600;
      height = container.clientHeight || 340;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // 12. Continuous 3D Animation Loop (Turntable Spin + Floating Oscillation + Steam Dynamics)
    const clock = new THREE.Clock();

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth Auto-Rotation
      if (isAutoRotatingRef.current && !isDraggingRef.current && modelPivotRef.current) {
        modelPivotRef.current.rotation.y += 0.006; // ~0.4 RPM gentle spin
      }

      // Gentle 3D Breathing / Floating Oscillation
      if (modelPivotRef.current) {
        modelPivotRef.current.position.y = Math.sin(elapsed * 1.8) * 0.025;
      }

      // Real-time Swirling Steam Particle Animation
      const posAttr = steamGeo.attributes.position as THREE.BufferAttribute;
      const positions = posAttr.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        const vel = steamVels[i];
        positions[i * 3 + 1] += vel.y; // Rise
        positions[i * 3] += Math.sin(elapsed * vel.speed + vel.phase) * 0.0018; // Swirl X
        positions[i * 3 + 2] += Math.cos(elapsed * vel.speed + vel.phase) * 0.0018; // Swirl Z

        // Recycle particle to base when reaching top
        if (positions[i * 3 + 1] > 0.95) {
          positions[i * 3 + 1] = 0.12;
          positions[i * 3] = (Math.random() - 0.5) * 0.28;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 0.28;
        }
      }
      posAttr.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // 13. WebGL Resource Disposal (Zero Memory Leaks on Kiosks)
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

      steamGeo.dispose();
      steamMat.dispose();
      particleTexture.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      modelPivotRef.current = null;
    };
  }, [modelUrl, scale, cameraDistance, proceduralType]);

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden select-none touch-none bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 ${className}`}
      style={{ touchAction: 'none' }}
    >
      {/* Three.js Real-time WebGL Canvas */}
      <canvas 
        ref={canvasRef} 
        className="w-full h-full cursor-grab active:cursor-grabbing block"
      />

      {/* Subtle Studio Lighting Glow Backdrop */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.08)_0%,transparent_70%)]" />

      {/* Loading Progress Indicator */}
      {isLoading && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/85 backdrop-blur-md border border-amber-400/40 text-amber-300 text-[11px] font-bold shadow-lg animate-pulse">
            <Box className="w-3.5 h-3.5 text-amber-400 animate-spin" />
            <span>Loading 3D Photorealistic Mesh...</span>
          </div>
        </div>
      )}

      {/* Top 3D Interactive Badge (Optional) */}
      {showTopBadge && (
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 pointer-events-none">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/85 backdrop-blur-md border border-amber-400/40 text-amber-300 shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span className="text-xs font-black tracking-wide uppercase font-mono">
              Interactive 3D Animation
            </span>
          </div>
        </div>
      )}

      {/* Top-Right Control Bar */}
      {controlsPosition === 'top-right' && (
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
      {controlsPosition === 'top-right' && !hasUserInteracted && (
        <div className="absolute top-16 right-4 z-10 pointer-events-none animate-bounce">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/90 backdrop-blur-md text-slate-950 text-[10px] font-black shadow-lg">
            <RotateCw className="w-3 h-3" />
            <span>Drag horizontally to rotate 360°</span>
          </div>
        </div>
      )}

      {/* Bottom Floating Control Bar (Standard standalone mode) */}
      {controlsPosition === 'bottom' && (
        <div className="absolute bottom-3 left-4 right-4 z-10 flex items-center justify-between pointer-events-auto">
          {!hasUserInteracted ? (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white/90 text-[11px] font-semibold border border-white/10 animate-pulse">
              <RotateCw className="w-3 h-3 text-amber-400" />
              <span>Drag to rotate 360°</span>
            </div>
          ) : (
            <div className="text-[10px] text-slate-400 font-mono">
              360° Free Orbit • Real-time Steam
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
