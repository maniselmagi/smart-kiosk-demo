import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { ZoomIn, ZoomOut, RefreshCw, Rotate3d, Loader2 } from 'lucide-react';
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
  className = '',
  controlsPosition = 'top-right'
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const defaultCamPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 1.35, 2.8));

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<boolean>(false);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);
  const [angleDeg, setAngleDeg] = useState<number>(0);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let isDisposed = false;
    setIsLoading(true);
    setLoadError(false);
    setIsZoomed(false);

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 340;

    // 1. Scene & Renderer (Lenskart-style clean studio WebGL)
    const scene = new THREE.Scene();

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Studio Environment Lighting
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTexture = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTexture;

    // Camera
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.copy(defaultCamPosRef.current);
    cameraRef.current = camera;

    // 2. OrbitControls for true Lenskart 360° drag-to-rotate
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.enablePan = false;
    controls.enableZoom = true;
    controls.minDistance = 1.5;
    controls.maxDistance = 4.6;
    controls.minPolarAngle = 0.25;
    controls.maxPolarAngle = Math.PI / 2 - 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.8;
    controls.target.set(0, 0.1, 0);
    controlsRef.current = controls;

    let resumeTimer: number | null = null;
    const onControlStart = () => {
      setHasInteracted(true);
      controls.autoRotate = false;
      if (resumeTimer) {
        window.clearTimeout(resumeTimer);
        resumeTimer = null;
      }
    };
    const onControlEnd = () => {
      if (resumeTimer) window.clearTimeout(resumeTimer);
      resumeTimer = window.setTimeout(() => {
        if (!isDisposed) {
          controls.autoRotate = true;
        }
      }, 2000);
    };
    controls.addEventListener('start', onControlStart);
    controls.addEventListener('end', onControlEnd);

    // 3. Studio 3-Point Lighting + Grounded Pedestal Shadow
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff5e6, 1.8);
    keyLight.position.set(3, 5, 3);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xe0f2fe, 0.7);
    fillLight.position.set(-4, 2, -2);
    scene.add(fillLight);

    // Soft studio pedestal disc
    const pedestalGeo = new THREE.CylinderGeometry(1.15, 1.25, 0.06, 64);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.35,
      metalness: 0.25
    });
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.position.y = -0.38;
    pedestal.receiveShadow = true;
    scene.add(pedestal);

    const shadowPlaneGeo = new THREE.PlaneGeometry(3, 3);
    const shadowPlaneMat = new THREE.ShadowMaterial({ opacity: 0.4 });
    const shadowPlane = new THREE.Mesh(shadowPlaneGeo, shadowPlaneMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -0.345;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    // 4. Load GLB 3D Food Model with multi-candidate fallback
    const loader = new GLTFLoader();
    const candidates = modelUrl ? getModelCandidateUrls(modelUrl) : [];

    const loadCandidate = (idx: number) => {
      if (isDisposed) return;
      if (idx >= candidates.length) {
        setIsLoading(false);
        setLoadError(true);
        return;
      }

      loader.load(
        candidates[idx],
        (gltf) => {
          if (isDisposed) return;
          const model = gltf.scene;

          // Auto-center and normalize scale so every dish fits Lenskart-style framing
          const box = new THREE.Box3().setFromObject(model);
          const size = box.getSize(new THREE.Vector3());
          const center = box.getCenter(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z) || 1;
          const targetSize = 1.65;
          const normScale = targetSize / maxDim;

          model.scale.setScalar(normScale);
          model.position.set(
            -center.x * normScale,
            -box.min.y * normScale - 0.34,
            -center.z * normScale
          );

          model.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });

          scene.add(model);
          setIsLoading(false);
          setLoadError(false);
        },
        undefined,
        () => {
          loadCandidate(idx + 1);
        }
      );
    };

    loadCandidate(0);

    // 5. Render Loop + Live 0°–360° Azimuth Readout
    let animId = 0;
    const animate = () => {
      if (isDisposed) return;
      animId = requestAnimationFrame(animate);
      controls.update();

      const az = controls.getAzimuthalAngle(); // -PI to +PI
      const deg = Math.round((((az * 180) / Math.PI) + 360) % 360);
      setAngleDeg(deg);

      renderer.render(scene, camera);
    };
    animate();

    // Responsive Resize
    const handleResize = () => {
      if (!container || isDisposed) return;
      const w = container.clientWidth || 600;
      const h = container.clientHeight || 340;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      isDisposed = true;
      if (resumeTimer) window.clearTimeout(resumeTimer);
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      controls.removeEventListener('start', onControlStart);
      controls.removeEventListener('end', onControlEnd);
      controls.dispose();
      pmremGenerator.dispose();
      envTexture.dispose();
      renderer.dispose();
    };
  }, [modelUrl]);

  // Toggle Zoom via camera distance
  const handleToggleZoom = (e: React.MouseEvent) => {
    e.stopPropagation();
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    const nextZoomed = !isZoomed;
    setIsZoomed(nextZoomed);

    const dir = camera.position.clone().sub(controls.target).normalize();
    const targetDist = nextZoomed ? 1.85 : 3.05;
    camera.position.copy(controls.target.clone().add(dir.multiplyScalar(targetDist)));
    controls.update();
  };

  const handleResetView = (e: React.MouseEvent) => {
    e.stopPropagation();
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;
    setIsZoomed(false);
    camera.position.copy(defaultCamPosRef.current);
    controls.target.set(0, 0.1, 0);
    controls.autoRotate = true;
    controls.update();
  };

  return (
    <div
      className={`relative w-full h-full overflow-hidden select-none touch-none bg-[radial-gradient(ellipse_at_50%_40%,#1e293b_0%,#0f172a_55%,#020617_100%)] ${className}`}
      style={{ touchAction: 'none' }}
    >
      {/* Three.js WebGL 360° Interactive Mount */}
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Loading Indicator */}
      {isLoading && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/60 backdrop-blur-xs pointer-events-none">
          <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
          <span className="mt-2 text-xs font-bold text-amber-300 tracking-wide">
            Loading 360° 3D Model...
          </span>
        </div>
      )}

      {/* Fallback State if GLB unavailable */}
      {loadError && fallbackImage && (
        <div className="absolute inset-0 z-10 flex items-center justify-center p-4">
          <img
            src={fallbackImage}
            alt={foodName}
            className="max-h-full max-w-full object-contain rounded-2xl shadow-2xl"
          />
        </div>
      )}

      {/* Top-Right Controls (Zoom & Reset) */}
      {controlsPosition === 'top-right' && (
        <div className="absolute top-4 right-16 z-30 flex items-center gap-1.5 pointer-events-auto">
          <button
            type="button"
            onClick={handleToggleZoom}
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
              onClick={handleResetView}
              className="w-8 h-8 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white border border-white/15 transition-all flex items-center justify-center cursor-pointer active:scale-95 shadow-lg backdrop-blur-md"
              title="Reset 360° Angle"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Lenskart-Style 360° Interactive Badge */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
        <div className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-950/85 backdrop-blur-md border border-amber-400/40 text-amber-300 text-[11px] font-bold shadow-lg">
          <Rotate3d className="w-4 h-4 text-amber-400" />
          <span>360°</span>
          <span className="text-slate-500">•</span>
          <span className="font-mono text-white text-[10px] w-8 text-center">{angleDeg}°</span>
          {!hasInteracted && (
            <span className="text-[10px] text-amber-200/80 hidden sm:inline">Drag to rotate 360°</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodModelViewer3D;
