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
  fallbackImage,
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

    // 2. Camera Setup (Optimal 40° FOV, angled view for looking directly into the dish)
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 50);
    camera.position.set(0, 0.95, cameraDistance);
    camera.lookAt(0, 0.12, 0);

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
    const ambientLight = new THREE.AmbientLight(0xfff6ed, 1.7);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(3.5, 5.5, 4);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xb5d4ff, 1.3);
    fillLight.position.set(-4, 3, -2);
    scene.add(fillLight);

    const warmRimLight = new THREE.DirectionalLight(0xf59e0b, 2.4);
    warmRimLight.position.set(0, 4.5, -4);
    scene.add(warmRimLight);

    // Bottom Soft Contact Shadow Disc
    const groundShadowGeo = new THREE.CircleGeometry(1.05, 36);
    const groundShadowMat = new THREE.MeshBasicMaterial({
      color: 0x02050c,
      transparent: true,
      opacity: 0.65
    });
    const groundShadow = new THREE.Mesh(groundShadowGeo, groundShadowMat);
    groundShadow.rotation.x = -Math.PI / 2;
    groundShadow.position.y = -0.06;
    scene.add(groundShadow);

    // 5. Model Container Pivot Group
    const pivot = new THREE.Group();
    pivot.rotation.x = 0.14; // Natural 14° tilt for dining table perspective
    scene.add(pivot);
    modelPivotRef.current = pivot;

    // 6. Luxury 3D Dining Turntable Platter Base
    const platterGroup = new THREE.Group();
    
    // Obsidian marble disc
    const platterGeo = new THREE.CylinderGeometry(0.88, 0.82, 0.04, 48);
    const platterMat = new THREE.MeshStandardMaterial({
      color: 0x141820,
      roughness: 0.35,
      metalness: 0.2
    });
    const platterMesh = new THREE.Mesh(platterGeo, platterMat);
    platterMesh.position.y = -0.02;
    platterGroup.add(platterMesh);

    // Polished gold rim ring
    const rimGeo = new THREE.TorusGeometry(0.88, 0.012, 16, 48);
    const rimMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.92,
      roughness: 0.18
    });
    const rimMesh = new THREE.Mesh(rimGeo, rimMat);
    rimMesh.rotation.x = Math.PI / 2;
    rimMesh.position.y = 0.001;
    platterGroup.add(rimMesh);

    pivot.add(platterGroup);

    // 7. Dynamic 3D Steam & Aroma Particle Animation System
    const particleCount = 45;
    const steamGeo = new THREE.BufferGeometry();
    const steamPositions = new Float32Array(particleCount * 3);
    const steamVels: { x: number; y: number; z: number; phase: number; speed: number }[] = [];

    for (let i = 0; i < particleCount; i++) {
      steamPositions[i * 3] = (Math.random() - 0.5) * 0.38;
      steamPositions[i * 3 + 1] = Math.random() * 0.75 + 0.15;
      steamPositions[i * 3 + 2] = (Math.random() - 0.5) * 0.38;
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
    pGrad.addColorStop(0, 'rgba(255, 245, 225, 0.85)');
    pGrad.addColorStop(0.35, 'rgba(255, 215, 160, 0.45)');
    pGrad.addColorStop(1, 'rgba(255, 180, 100, 0)');
    pCtx.fillStyle = pGrad;
    pCtx.fillRect(0, 0, 64, 64);
    const particleTexture = new THREE.CanvasTexture(pCanvas);

    const steamMat = new THREE.PointsMaterial({
      size: 0.22,
      map: particleTexture,
      transparent: true,
      opacity: 0.65,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    const steamParticles = new THREE.Points(steamGeo, steamMat);
    pivot.add(steamParticles);

    // 8. Authentic Photorealistic 3D Food Mesh System
    const foodMeshGroup = new THREE.Group();
    pivot.add(foodMeshGroup);

    // Optional: Load dish photograph texture for photographic realism
    let photoTexture: THREE.Texture | null = null;
    if (fallbackImage) {
      const texLoader = new THREE.TextureLoader();
      texLoader.load(fallbackImage, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.wrapS = THREE.ClampToEdgeWrapping;
        tex.wrapT = THREE.ClampToEdgeWrapping;
        photoTexture = tex;
        // If gravy mesh exists, apply texture
        const gravyMesh = foodMeshGroup.getObjectByName('gravyMesh') as THREE.Mesh;
        if (gravyMesh && gravyMesh.material) {
          (gravyMesh.material as THREE.MeshStandardMaterial).map = tex;
          (gravyMesh.material as THREE.MeshStandardMaterial).needsUpdate = true;
        }
      });
    }

    const buildPhotorealisticDish = (type: ProceduralDishType) => {
      while (foodMeshGroup.children.length > 0) {
        foodMeshGroup.remove(foodMeshGroup.children[0]);
      }

      if (type === 'curry') {
        // ==========================================
        // BUTTER CHICKEN & GOURMET CURRY 3D DISH
        // Matches Authentic Indian Copper Handi Presentation
        // ==========================================

        // 1. Traditional Indian Handi Pot
        const handiPoints: THREE.Vector2[] = [
          new THREE.Vector2(0.26, 0),
          new THREE.Vector2(0.48, 0.04),
          new THREE.Vector2(0.60, 0.15),
          new THREE.Vector2(0.57, 0.24),
          new THREE.Vector2(0.62, 0.27) // Flared brass rim
        ];
        const handiGeo = new THREE.LatheGeometry(handiPoints, 48);
        const handiMat = new THREE.MeshStandardMaterial({
          color: 0x221a15, // Dark cast-iron / aged copper
          metalness: 0.88,
          roughness: 0.28
        });
        const handiMesh = new THREE.Mesh(handiGeo, handiMat);
        foodMeshGroup.add(handiMesh);

        // Polished Brass Handi Lip
        const handiRimGeo = new THREE.TorusGeometry(0.61, 0.016, 16, 48);
        const brassMat = new THREE.MeshStandardMaterial({
          color: 0xd4af37,
          metalness: 0.92,
          roughness: 0.18
        });
        const handiRim = new THREE.Mesh(handiRimGeo, brassMat);
        handiRim.rotation.x = Math.PI / 2;
        handiRim.position.y = 0.27;
        foodMeshGroup.add(handiRim);

        // Dual Brass Ring Side Handles
        for (let h = 0; h < 2; h++) {
          const handleGeo = new THREE.TorusGeometry(0.08, 0.014, 12, 24, Math.PI);
          const handleMesh = new THREE.Mesh(handleGeo, brassMat);
          const sign = h === 0 ? 1 : -1;
          handleMesh.position.set(sign * 0.60, 0.20, 0);
          handleMesh.rotation.z = sign * Math.PI / 2;
          handleMesh.rotation.y = Math.PI / 2;
          foodMeshGroup.add(handleMesh);
        }

        // 2. Simmering, Rich Butter Chicken Makhani Gravy Surface
        const gravyGeo = new THREE.CylinderGeometry(0.57, 0.46, 0.09, 48, 6);
        // Add subtle natural liquid wave ripples to the gravy
        const pos = gravyGeo.attributes.position;
        for (let i = 0; i < pos.count; i++) {
          const y = pos.getY(i);
          if (y > 0.03) {
            const x = pos.getX(i);
            const z = pos.getZ(i);
            const wave = Math.sin(x * 6.5) * Math.cos(z * 6.5) * 0.014 + Math.sin((x + z) * 8) * 0.008;
            pos.setY(i, y + wave);
          }
        }
        gravyGeo.computeVertexNormals();

        const gravyMat = new THREE.MeshStandardMaterial({
          color: 0xd9570c, // Rich Butter Chicken golden-orange gravy
          roughness: 0.22, // Buttery glistening sheen
          metalness: 0.08,
          map: photoTexture || null
        });
        const gravyMesh = new THREE.Mesh(gravyGeo, gravyMat);
        gravyMesh.name = 'gravyMesh';
        gravyMesh.position.y = 0.21;
        foodMeshGroup.add(gravyMesh);

        // 3. 3D Roasted Tandoori Chicken Tikka Chunks
        const chickenMat = new THREE.MeshStandardMaterial({
          color: 0xb54d12, // Golden-red tandoori roasted chicken
          roughness: 0.52,
          metalness: 0.05
        });
        const charMat = new THREE.MeshStandardMaterial({
          color: 0x662408, // Charred tandoori grill edges
          roughness: 0.68
        });

        const chickenPositions = [
          { x: 0.06, y: 0.26, z: 0.04, s: 0.14, rot: 0.4 },
          { x: -0.18, y: 0.24, z: 0.14, s: 0.13, rot: 1.2 },
          { x: 0.20, y: 0.24, z: -0.12, s: 0.14, rot: -0.8 },
          { x: -0.10, y: 0.27, z: -0.18, s: 0.15, rot: 2.1 },
          { x: 0.24, y: 0.23, z: 0.16, s: 0.12, rot: 0.9 },
          { x: -0.26, y: 0.22, z: -0.07, s: 0.13, rot: -1.5 },
          { x: 0.02, y: 0.28, z: -0.04, s: 0.15, rot: 0.2 },
          { x: 0.12, y: 0.25, z: 0.25, s: 0.11, rot: 1.7 },
        ];

        chickenPositions.forEach((cp, idx) => {
          const cGeo = new THREE.DodecahedronGeometry(cp.s, 1);
          // Organic vertex deformation
          const cPos = cGeo.attributes.position;
          for (let vi = 0; vi < cPos.count; vi++) {
            const vx = cPos.getX(vi);
            const vy = cPos.getY(vi);
            const vz = cPos.getZ(vi);
            cPos.setXYZ(
              vi,
              vx * (0.85 + ((vi % 5) * 0.08)),
              vy * (0.75 + ((vi % 4) * 0.1)),
              vz * (0.85 + ((vi % 3) * 0.08))
            );
          }
          cGeo.computeVertexNormals();

          const cMesh = new THREE.Mesh(cGeo, idx % 3 === 0 ? charMat : chickenMat);
          cMesh.position.set(cp.x, cp.y, cp.z);
          cMesh.rotation.set(cp.rot, cp.rot * 1.5, cp.rot * 0.7);
          foodMeshGroup.add(cMesh);
        });

        // 4. Authentic Flowing 3D Cream Drizzle Trails
        const creamCurves = [
          new THREE.CatmullRomCurve3([
            new THREE.Vector3(-0.28, 0.26, -0.12),
            new THREE.Vector3(-0.12, 0.30, 0.08),
            new THREE.Vector3(0.10, 0.29, -0.06),
            new THREE.Vector3(0.26, 0.25, 0.14)
          ]),
          new THREE.CatmullRomCurve3([
            new THREE.Vector3(0.18, 0.26, -0.22),
            new THREE.Vector3(0.04, 0.31, 0.06),
            new THREE.Vector3(-0.20, 0.25, 0.18)
          ])
        ];

        const creamMat = new THREE.MeshStandardMaterial({
          color: 0xfffcf5, // Rich white dairy cream
          roughness: 0.28,
          metalness: 0.02
        });

        creamCurves.forEach(curve => {
          const tubeGeo = new THREE.TubeGeometry(curve, 36, 0.024, 8, false);
          const tubeMesh = new THREE.Mesh(tubeGeo, creamMat);
          foodMeshGroup.add(tubeMesh);
        });

        // 5. Fresh Green Coriander / Kasuri Methi Herb Flakes
        const corianderMat = new THREE.MeshStandardMaterial({
          color: 0x2e8540, // Vibrant fresh green herb
          roughness: 0.65
        });

        for (let f = 0; f < 32; f++) {
          const flakeGeo = new THREE.PlaneGeometry(0.028, 0.038);
          const flake = new THREE.Mesh(flakeGeo, corianderMat);
          const angle = Math.random() * Math.PI * 2;
          const radius = Math.random() * 0.36;
          flake.position.set(
            Math.cos(angle) * radius,
            0.28 + Math.random() * 0.035,
            Math.sin(angle) * radius
          );
          flake.rotation.set(
            -Math.PI / 2 + (Math.random() - 0.5) * 0.4,
            (Math.random() - 0.5) * 0.4,
            Math.random() * Math.PI
          );
          foodMeshGroup.add(flake);
        }

      } else if (type === 'coffee') {
        // ==========================================
        // KUMBAKONAM DEGREE FILTER COFFEE 3D
        // Authentic South Indian Brass Dabarah & Tumbler
        // ==========================================
        const polishedBrassMat = new THREE.MeshStandardMaterial({
          color: 0xd4af37,
          metalness: 0.94,
          roughness: 0.15
        });

        // 1. Dabarah (Flared brass saucer)
        const dabarahGeo = new THREE.CylinderGeometry(0.52, 0.40, 0.18, 48);
        const dabarah = new THREE.Mesh(dabarahGeo, polishedBrassMat);
        dabarah.position.y = 0.09;
        foodMeshGroup.add(dabarah);

        // Dabarah Rim Lip
        const dabarahLipGeo = new THREE.TorusGeometry(0.52, 0.016, 16, 48);
        const dabarahLip = new THREE.Mesh(dabarahLipGeo, polishedBrassMat);
        dabarahLip.rotation.x = Math.PI / 2;
        dabarahLip.position.y = 0.18;
        foodMeshGroup.add(dabarahLip);

        // 2. Tumbler (Tapered brass coffee cup)
        const tumblerGeo = new THREE.CylinderGeometry(0.34, 0.24, 0.42, 48);
        const tumbler = new THREE.Mesh(tumblerGeo, polishedBrassMat);
        tumbler.position.y = 0.28;
        foodMeshGroup.add(tumbler);

        // Tumbler Lip
        const tumblerLipGeo = new THREE.TorusGeometry(0.34, 0.014, 16, 48);
        const tumblerLip = new THREE.Mesh(tumblerLipGeo, polishedBrassMat);
        tumblerLip.rotation.x = Math.PI / 2;
        tumblerLip.position.y = 0.49;
        foodMeshGroup.add(tumblerLip);

        // 3. Frothy Chicory-Blend Coffee Surface
        const coffeeGeo = new THREE.CircleGeometry(0.32, 36);
        const coffeeMat = new THREE.MeshStandardMaterial({
          color: 0x542d12, // Rich dark roast coffee
          roughness: 0.35,
          metalness: 0.1,
          map: photoTexture || null
        });
        const coffee = new THREE.Mesh(coffeeGeo, coffeeMat);
        coffee.rotation.x = -Math.PI / 2;
        coffee.position.y = 0.47;
        foodMeshGroup.add(coffee);

        // 4. Crema Micro-Foam Swirl Layer
        const frothGeo = new THREE.TorusGeometry(0.20, 0.045, 16, 36);
        const frothMat = new THREE.MeshStandardMaterial({
          color: 0xc89b65, // Golden crema froth
          roughness: 0.48
        });
        const froth = new THREE.Mesh(frothGeo, frothMat);
        froth.rotation.x = Math.PI / 2;
        froth.position.y = 0.475;
        foodMeshGroup.add(froth);

      } else if (type === 'dessert') {
        // ==========================================
        // ROYAL KESARI / WARM DESSERTS 3D
        // Royal Bowl with Glistening Saffron Halwa & Golden Cashews
        // ==========================================
        const bowlGeo = new THREE.CylinderGeometry(0.58, 0.38, 0.22, 48);
        const bowlMat = new THREE.MeshStandardMaterial({
          color: 0x181c24,
          metalness: 0.4,
          roughness: 0.25
        });
        const bowl = new THREE.Mesh(bowlGeo, bowlMat);
        bowl.position.y = 0.11;
        foodMeshGroup.add(bowl);

        // Gold Rim on Dessert Bowl
        const bowlRimGeo = new THREE.TorusGeometry(0.58, 0.015, 16, 48);
        const bowlRimMat = new THREE.MeshStandardMaterial({
          color: 0xf59e0b,
          metalness: 0.9,
          roughness: 0.18
        });
        const bowlRim = new THREE.Mesh(bowlRimGeo, bowlRimMat);
        bowlRim.rotation.x = Math.PI / 2;
        bowlRim.position.y = 0.22;
        foodMeshGroup.add(bowlRim);

        // Saffron Kesari Mound with Ghee Luster
        const kesariGeo = new THREE.SphereGeometry(0.48, 36, 18, 0, Math.PI * 2, 0, Math.PI * 0.5);
        const kesariMat = new THREE.MeshStandardMaterial({
          color: 0xf59e0b, // Saffron golden kesari
          roughness: 0.28, // Glistening pure cow ghee sheen
          metalness: 0.08,
          map: photoTexture || null
        });
        const kesari = new THREE.Mesh(kesariGeo, kesariMat);
        kesari.position.y = 0.19;
        foodMeshGroup.add(kesari);

        // 3D Golden Roasted Cashew Nuts Garnish
        const cashewMat = new THREE.MeshStandardMaterial({
          color: 0xfef08a,
          roughness: 0.38
        });
        for (let i = 0; i < 8; i++) {
          const cashewGeo = new THREE.SphereGeometry(0.045, 16, 10);
          cashewGeo.scale(2.0, 1.0, 0.8);
          const cashew = new THREE.Mesh(cashewGeo, cashewMat);
          const angle = (i / 8) * Math.PI * 2;
          cashew.position.set(Math.cos(angle) * 0.26, 0.36, Math.sin(angle) * 0.26);
          cashew.rotation.y = angle;
          cashew.rotation.z = 0.2;
          foodMeshGroup.add(cashew);
        }

        // Silver Leaf / Raisins Accents
        const raisinMat = new THREE.MeshStandardMaterial({
          color: 0x3f1a04,
          roughness: 0.5
        });
        for (let r = 0; r < 4; r++) {
          const raisinGeo = new THREE.SphereGeometry(0.035, 12, 8);
          const raisin = new THREE.Mesh(raisinGeo, raisinMat);
          const rAngle = (r / 4) * Math.PI * 2 + 0.4;
          raisin.position.set(Math.cos(rAngle) * 0.14, 0.42, Math.sin(rAngle) * 0.14);
          foodMeshGroup.add(raisin);
        }

      } else if (type === 'biryani') {
        // ==========================================
        // ROYAL DUM BIRYANI 3D
        // Clay Handi with Aromatic Basmati Rice & Roasted Spices
        // ==========================================
        const handiGeo = new THREE.SphereGeometry(0.58, 36, 18, 0, Math.PI * 2, 0, Math.PI * 0.65);
        const handiMat = new THREE.MeshStandardMaterial({
          color: 0x6e2c14, // Terracotta clay handi
          roughness: 0.72
        });
        const handi = new THREE.Mesh(handiGeo, handiMat);
        handi.position.y = 0.14;
        foodMeshGroup.add(handi);

        // Basmati Rice Mound
        const riceGeo = new THREE.ConeGeometry(0.52, 0.32, 36);
        const riceMat = new THREE.MeshStandardMaterial({
          color: 0xfef9c3, // Basmati rice with saffron highlights
          roughness: 0.62,
          map: photoTexture || null
        });
        const rice = new THREE.Mesh(riceGeo, riceMat);
        rice.position.y = 0.38;
        foodMeshGroup.add(rice);

        // Roasted Spices (Cloves & Star Anise)
        const spiceMat = new THREE.MeshStandardMaterial({ color: 0x2a1508, roughness: 0.8 });
        for (let s = 0; s < 5; s++) {
          const sGeo = new THREE.ConeGeometry(0.025, 0.08, 6);
          const sMesh = new THREE.Mesh(sGeo, spiceMat);
          const sAngle = (s / 5) * Math.PI * 2;
          sMesh.position.set(Math.cos(sAngle) * 0.22, 0.42, Math.sin(sAngle) * 0.22);
          sMesh.rotation.z = 0.4;
          foodMeshGroup.add(sMesh);
        }

        // Mint Leaves Garnish
        const mintMat = new THREE.MeshStandardMaterial({ color: 0x1b7a3e, roughness: 0.5 });
        for (let m = 0; m < 6; m++) {
          const mGeo = new THREE.PlaneGeometry(0.04, 0.06);
          const mMesh = new THREE.Mesh(mGeo, mintMat);
          const mAngle = (m / 6) * Math.PI * 2 + 0.3;
          mMesh.position.set(Math.cos(mAngle) * 0.16, 0.48, Math.sin(mAngle) * 0.16);
          mMesh.rotation.x = -Math.PI / 3;
          foodMeshGroup.add(mMesh);
        }

      } else {
        // ==========================================
        // GOURMET SIGNATURE PLATTER 3D
        // Universal Dining Platter with High Specular Sheen
        // ==========================================
        const plateGeo = new THREE.CylinderGeometry(0.62, 0.48, 0.18, 48);
        const plateMat = new THREE.MeshStandardMaterial({
          color: 0x1e2430,
          metalness: 0.35,
          roughness: 0.3
        });
        const plate = new THREE.Mesh(plateGeo, plateMat);
        plate.position.y = 0.09;
        foodMeshGroup.add(plate);

        // Center Food Portion with Photo Texture
        const coreGeo = new THREE.CylinderGeometry(0.54, 0.46, 0.12, 48);
        const coreMat = new THREE.MeshStandardMaterial({
          color: 0xe68a10,
          roughness: 0.35,
          metalness: 0.1,
          map: photoTexture || null
        });
        const core = new THREE.Mesh(coreGeo, coreMat);
        core.position.y = 0.20;
        foodMeshGroup.add(core);

        // Gourmet Garnish Clusters
        const garnishMat = new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.5 });
        for (let g = 0; g < 12; g++) {
          const gGeo = new THREE.SphereGeometry(0.03, 8, 8);
          const gMesh = new THREE.Mesh(gGeo, garnishMat);
          const gAngle = (g / 12) * Math.PI * 2;
          gMesh.position.set(Math.cos(gAngle) * 0.28, 0.28, Math.sin(gAngle) * 0.28);
          foodMeshGroup.add(gMesh);
        }
      }
    };

    // Build the realistic 3D dish immediately
    buildPhotorealisticDish(proceduralType);

    // 9. Interactive 360° Drag Gesture Controls (Touch & Mouse)
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

    // 10. Responsive Resize Observer
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || 600;
      height = container.clientHeight || 340;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // 11. Continuous 3D Animation Loop (Turntable Spin + Floating Oscillation + Steam Dynamics)
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
          positions[i * 3 + 1] = 0.14;
          positions[i * 3] = (Math.random() - 0.5) * 0.32;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 0.32;
        }
      }
      posAttr.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // 12. WebGL Resource Disposal (Zero Memory Leaks on Kiosks)
    return () => {
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
      if (photoTexture) (photoTexture as THREE.Texture).dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      modelPivotRef.current = null;
    };
  }, [modelUrl, scale, cameraDistance, proceduralType, fallbackImage]);

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
