import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { shouldUse3D, isMobileDevice, isReducedMotionPreferred } from './webglUtils';
import { Hero2DForgeFallback } from './Hero2DForgeFallback';

export interface CyberForgeCoreProps {
  className?: string;
}

export const CyberForgeCore: React.FC<CyberForgeCoreProps> = ({ className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [useFallback, setUseFallback] = useState<boolean>(false);

  useEffect(() => {
    if (!shouldUse3D() || isMobileDevice()) {
      setUseFallback(true);
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    let animationFrameId: number;
    let renderer: THREE.WebGLRenderer;
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;

    // 3D Objects
    let coreGroup: THREE.Group;
    let coreMesh: THREE.Mesh;
    let innerEmblemMesh: THREE.Mesh;
    let outerRing: THREE.Mesh;
    let techRing: THREE.Mesh;
    let nodeRing: THREE.Group;
    let particleCloud: THREE.Points;
    let cyberGrid: THREE.GridHelper;
    let backgroundNetwork: THREE.LineSegments;

    // Interaction State
    let isHovered = false;
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;
    let isTabVisible = true;

    const reducedMotion = isReducedMotionPreferred();

    try {
      // 1. Scene & Camera Setup
      scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x060911, 0.06);

      const width = container.clientWidth || 600;
      const height = container.clientHeight || 600;

      camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);

      // Camera position: starts slightly closer if motion allowed, then reveals
      const startCameraZ = reducedMotion ? 7.2 : 4.5;
      const targetCameraZ = 7.2;
      camera.position.set(0, 0, startCameraZ);

      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.35;

      container.appendChild(renderer.domElement);

      // 2. Cinematic Lighting
      const ambientLight = new THREE.AmbientLight(0x0a101d, 1.6);
      scene.add(ambientLight);

      const cyanCoreLight = new THREE.PointLight(0x06b6d4, 4.5, 12);
      cyanCoreLight.position.set(0, 0, 1);
      scene.add(cyanCoreLight);

      const blueRimLight = new THREE.DirectionalLight(0x38bdf8, 2.2);
      blueRimLight.position.set(-4, 5, -2);
      scene.add(blueRimLight);

      const violetAccentLight = new THREE.PointLight(0x8b5cf6, 3.2, 14);
      violetAccentLight.position.set(4, -3, 3);
      scene.add(violetAccentLight);

      // 3. Perspective Cyber Grid
      cyberGrid = new THREE.GridHelper(30, 45, 0x06b6d4, 0x1e293b);
      cyberGrid.position.y = -3.5;
      (cyberGrid.material as THREE.Material).transparent = true;
      (cyberGrid.material as THREE.Material).opacity = 0.22;
      scene.add(cyberGrid);

      // 4. Background Network Mesh (Points & Thin Connection Lines)
      const networkPointCount = 60;
      const netPositions = new Float32Array(networkPointCount * 3);
      for (let i = 0; i < networkPointCount * 3; i += 3) {
        netPositions[i] = (Math.random() - 0.5) * 16;
        netPositions[i + 1] = (Math.random() - 0.5) * 12;
        netPositions[i + 2] = (Math.random() - 0.5) * 8 - 2;
      }

      const linePositions: number[] = [];
      for (let i = 0; i < networkPointCount; i++) {
        for (let j = i + 1; j < networkPointCount; j++) {
          const dx = netPositions[i * 3] - netPositions[j * 3];
          const dy = netPositions[i * 3 + 1] - netPositions[j * 3 + 1];
          const dz = netPositions[i * 3 + 2] - netPositions[j * 3 + 2];
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
          if (dist < 3.2 && Math.random() > 0.6) {
            linePositions.push(
              netPositions[i * 3], netPositions[i * 3 + 1], netPositions[i * 3 + 2],
              netPositions[j * 3], netPositions[j * 3 + 1], netPositions[j * 3 + 2]
            );
          }
        }
      }

      const netLineGeo = new THREE.BufferGeometry();
      netLineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
      const netLineMat = new THREE.LineBasicMaterial({
        color: 0x0284c7,
        transparent: true,
        opacity: 0.18,
      });
      backgroundNetwork = new THREE.LineSegments(netLineGeo, netLineMat);
      scene.add(backgroundNetwork);

      // 5. CyberForge Core Master Group
      coreGroup = new THREE.Group();
      scene.add(coreGroup);

      // --- CENTER CORE: Octahedron + Wireframe + Inner Icosahedron Emblem ---
      const coreGeo = new THREE.OctahedronGeometry(1.25, 2);
      const coreMat = new THREE.MeshStandardMaterial({
        color: 0x061122,
        roughness: 0.15,
        metalness: 0.9,
        emissive: 0x06b6d4,
        emissiveIntensity: 0.45,
      });
      coreMesh = new THREE.Mesh(coreGeo, coreMat);
      coreGroup.add(coreMesh);

      const coreWireMat = new THREE.MeshBasicMaterial({
        color: 0x22d3ee,
        wireframe: true,
        transparent: true,
        opacity: 0.45,
      });
      const coreWire = new THREE.Mesh(coreGeo, coreWireMat);
      coreMesh.add(coreWire);

      const emblemGeo = new THREE.IcosahedronGeometry(0.7, 0);
      const emblemMat = new THREE.MeshStandardMaterial({
        color: 0x8b5cf6,
        emissive: 0xa855f7,
        emissiveIntensity: 0.8,
        wireframe: true,
      });
      innerEmblemMesh = new THREE.Mesh(emblemGeo, emblemMat);
      coreGroup.add(innerEmblemMesh);

      // --- OUTER ORBITAL RINGS ---
      // Outer Holographic Orbital Ring
      const outerRingGeo = new THREE.TorusGeometry(2.5, 0.018, 16, 120);
      const outerRingMat = new THREE.MeshStandardMaterial({
        color: 0x06b6d4,
        emissive: 0x06b6d4,
        emissiveIntensity: 0.7,
        metalness: 0.8,
      });
      outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);
      outerRing.rotation.x = Math.PI / 3;
      coreGroup.add(outerRing);

      // Thin Technical Inner Ring
      const techRingGeo = new THREE.TorusGeometry(2.0, 0.012, 16, 100);
      const techRingMat = new THREE.MeshStandardMaterial({
        color: 0x6366f1,
        emissive: 0x6366f1,
        emissiveIntensity: 0.6,
        metalness: 0.9,
      });
      techRing = new THREE.Mesh(techRingGeo, techRingMat);
      techRing.rotation.y = Math.PI / 4;
      coreGroup.add(techRing);

      // --- ROTATING NODE RING ---
      nodeRing = new THREE.Group();
      coreGroup.add(nodeRing);

      const nodeSphereGeo = new THREE.SphereGeometry(0.06, 12, 12);
      const nodeSphereMatCyan = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
      const nodeSphereMatViolet = new THREE.MeshBasicMaterial({ color: 0xa855f7 });

      const nodeCount = 10;
      for (let i = 0; i < nodeCount; i++) {
        const angle = (i / nodeCount) * Math.PI * 2;
        const radius = 2.2;
        const sphere = new THREE.Mesh(
          nodeSphereGeo,
          i % 2 === 0 ? nodeSphereMatCyan : nodeSphereMatViolet
        );
        sphere.position.set(
          Math.cos(angle) * radius,
          Math.sin(angle) * radius,
          Math.sin(i * 1.5) * 0.3
        );
        nodeRing.add(sphere);

        // Thin Ray vector connecting node to central core
        const rayPoints = [new THREE.Vector3(0, 0, 0), sphere.position.clone()];
        const rayGeo = new THREE.BufferGeometry().setFromPoints(rayPoints);
        const rayMat = new THREE.LineBasicMaterial({
          color: i % 2 === 0 ? 0x06b6d4 : 0x8b5cf6,
          transparent: true,
          opacity: 0.25,
        });
        const rayLine = new THREE.Line(rayGeo, rayMat);
        nodeRing.add(rayLine);
      }

      // --- SUBTLE ENERGY PARTICLES CLOUD ---
      const particleCount = 100;
      const particlePositions = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount * 3; i += 3) {
        const radius = 1.4 + Math.random() * 1.6;
        const theta = Math.random() * Math.PI * 2;
        const phi = (Math.random() - 0.5) * Math.PI;
        particlePositions[i] = radius * Math.cos(theta) * Math.cos(phi);
        particlePositions[i + 1] = radius * Math.sin(phi);
        particlePositions[i + 2] = radius * Math.sin(theta) * Math.cos(phi);
      }

      const particleGeo = new THREE.BufferGeometry();
      particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
      const particleMat = new THREE.PointsMaterial({
        size: 0.035,
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.75,
      });
      particleCloud = new THREE.Points(particleGeo, particleMat);
      coreGroup.add(particleCloud);

      // Parallax & Hover Mouse Handlers
      const handleMouseMove = (event: MouseEvent) => {
        if (reducedMotion) return;
        const rect = container.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        targetMouseX = (x / rect.width) * 0.6;
        targetMouseY = (y / rect.height) * 0.6;
      };

      const handleMouseEnter = () => {
        isHovered = true;
      };

      const handleMouseLeave = () => {
        isHovered = false;
        targetMouseX = 0;
        targetMouseY = 0;
      };

      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseenter', handleMouseEnter);
      container.addEventListener('mouseleave', handleMouseLeave);

      const handleVisibilityChange = () => {
        isTabVisible = !document.hidden;
      };
      document.addEventListener('visibilitychange', handleVisibilityChange);

      const handleResize = () => {
        if (!container) return;
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener('resize', handleResize);

      const clock = new THREE.Clock();
      const startTime = performance.now();

      // Animation Loop
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);

        if (!isTabVisible) return;

        const elapsedTime = clock.getElapsedTime();
        const now = performance.now();
        const revealDuration = 2000;
        const revealProgress = Math.min((now - startTime) / revealDuration, 1.0);

        // Camera placement / entrance reveal
        if (!reducedMotion) {
          const easeOut = 1 - Math.pow(1 - revealProgress, 3);
          const currentZ = startCameraZ + (targetCameraZ - startCameraZ) * easeOut;

          currentMouseX += (targetMouseX - currentMouseX) * 0.04;
          currentMouseY += (targetMouseY - currentMouseY) * 0.04;

          camera.position.x = currentMouseX;
          camera.position.y = -currentMouseY;
          camera.position.z = currentZ;
          camera.lookAt(0, 0, 0);
        } else {
          camera.position.set(0, 0, targetCameraZ);
          camera.lookAt(0, 0, 0);
        }

        // Rotations & energy response (Disabled or frozen if prefers-reduced-motion)
        if (!reducedMotion) {
          const speedMultiplier = isHovered ? 1.6 : 1.0;
          const pulse = Math.sin(elapsedTime * 2.5) * 0.08 + 0.45;

          coreMesh.rotation.y = elapsedTime * 0.2 * speedMultiplier;
          coreMesh.rotation.x = Math.sin(elapsedTime * 0.12) * 0.15;

          innerEmblemMesh.rotation.y = elapsedTime * -0.35 * speedMultiplier;
          innerEmblemMesh.rotation.z = elapsedTime * 0.2;

          outerRing.rotation.z = elapsedTime * 0.15 * speedMultiplier;
          techRing.rotation.x = elapsedTime * -0.18 * speedMultiplier;
          nodeRing.rotation.z = elapsedTime * -0.1 * speedMultiplier;

          particleCloud.rotation.y = elapsedTime * 0.08 * speedMultiplier;

          (coreMesh.material as THREE.MeshStandardMaterial).emissiveIntensity = isHovered ? 0.75 : pulse;
          cyanCoreLight.intensity = isHovered ? 6.0 : 4.0 + Math.sin(elapsedTime * 3) * 0.8;
        }

        renderer.render(scene, camera);
      };

      animate();

      return () => {
        cancelAnimationFrame(animationFrameId);
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseenter', handleMouseEnter);
        container.removeEventListener('mouseleave', handleMouseLeave);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        window.removeEventListener('resize', handleResize);
        if (renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
        renderer.dispose();
      };
    } catch {
      setUseFallback(true);
    }
  }, []);

  if (useFallback) {
    return <Hero2DForgeFallback />;
  }

  return (
    <div
      ref={containerRef}
      className={
        className ||
        "relative w-full h-[450px] sm:h-[540px] lg:h-[620px] rounded-3xl overflow-hidden cursor-grab active:cursor-grabbing border border-slate-800/80 bg-slate-950/40 shadow-[0_0_60px_rgba(6,182,212,0.15)] group"
      }
    >
      {/* HUD Badge */}
      <div className="absolute top-4 left-4 z-10 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-cyan-500/30 text-[10px] font-mono font-bold text-cyan-300 flex items-center gap-2 backdrop-blur-md shadow-md">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
        <span>CYBERFORGE 3D CORE • SYSTEM ONLINE</span>
      </div>

      {/* Energy Response Indicator */}
      <div className="absolute bottom-4 right-4 z-10 px-3 py-1 rounded-xl bg-slate-900/80 border border-slate-800 text-[10px] font-mono text-slate-400 opacity-80 group-hover:opacity-100 group-hover:border-cyan-500/40 group-hover:text-cyan-300 transition-all pointer-events-none">
        Hover to synchronize core
      </div>
    </div>
  );
};

export default CyberForgeCore;
