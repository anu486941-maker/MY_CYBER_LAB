import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { SIMULATED_TARGET_RANGES, SimulatedEnvironmentRange } from '../../data/simulatedTargetRanges';
import { shouldUse3D, isMobileDevice } from './webglUtils';
import { Interactive2DCyberNetwork } from './Interactive2DCyberNetwork';
import { 
  Server, 
  Laptop, 
  Router, 
  Database, 
  Bot, 
  RotateCcw, 
  Layers, 
  Sparkles, 
  ShieldAlert, 
  X, 
  Info, 
  ChevronRight,
  Filter,
  Eye
} from 'lucide-react';

export interface NetworkNodeData {
  id: string;
  name: string;
  ip: string;
  type: 'GATEWAY' | 'FIREWALL' | 'SERVER' | 'WORKSTATION' | 'DATABASE' | 'AMAN';
  status: 'ONLINE' | 'WARNING' | 'CRITICAL' | 'VERIFIED' | 'UNKNOWN';
  role: string;
  subnet?: string;
  openServices?: string[];
  threatsCount?: number;
  position3D: [number, number, number];
  simulatedLogs?: { timestamp: string; message: string; severity: string }[];
}

export type NetworkFilterCategory = 'ALL' | 'SERVERS' | 'WORKSTATIONS' | 'NETWORK' | 'THREATS';

interface Interactive3DCyberNetworkProps {
  initialRangeId?: string;
  onOpenAmanWithContext?: (query: string) => void;
}

export const Interactive3DCyberNetwork: React.FC<Interactive3DCyberNetworkProps> = ({
  initialRangeId = 'range-finance-01',
  onOpenAmanWithContext
}) => {
  const [activeRangeId, setActiveRangeId] = useState<string>(initialRangeId);
  const [activeFilter, setActiveFilter] = useState<NetworkFilterCategory>('ALL');
  const [viewMode3D, setViewMode3D] = useState<boolean>(true);
  const [useFallback, setUseFallback] = useState<boolean>(false);

  // Selected & Hovered Node State
  const [selectedNode, setSelectedNode] = useState<NetworkNodeData | null>(null);
  const [hoveredNode, setHoveredNode] = useState<NetworkNodeData | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const resetCameraTrigger = useRef<() => void>(() => {});

  // Extract active real range data
  const activeRange: SimulatedEnvironmentRange = 
    SIMULATED_TARGET_RANGES.find(r => r.id === activeRangeId) || SIMULATED_TARGET_RANGES[0];

  // Convert real assets into 3D NetworkNodeData structure
  const rawNodes: NetworkNodeData[] = [
    // 1. Gateway
    {
      id: 'gateway-01',
      name: `${activeRange.name} Gateway`,
      ip: activeRange.networkTopology.gateway,
      type: 'GATEWAY',
      status: 'ONLINE',
      role: 'Core Perimeter Internet Router & Gateway',
      subnet: activeRange.networkTopology.subnet,
      openServices: ['Port 80 (HTTP)', 'Port 443 (HTTPS)'],
      position3D: [0, 2.5, 0]
    },
    // 2. Real Assets from SIMULATED_TARGET_RANGES
    ...activeRange.assets.map((asset, idx) => {
      let type: NetworkNodeData['type'] = 'SERVER';
      if (asset.role.toLowerCase().includes('database') || asset.role.toLowerCase().includes('sql') || asset.role.toLowerCase().includes('postgres')) {
        type = 'DATABASE';
      } else if (asset.role.toLowerCase().includes('workstation') || asset.role.toLowerCase().includes('analyst')) {
        type = 'WORKSTATION';
      } else if (asset.role.toLowerCase().includes('proxy') || asset.role.toLowerCase().includes('waf') || asset.role.toLowerCase().includes('gateway')) {
        type = 'FIREWALL';
      }

      // Check if real logs indicate critical threats on this asset
      const hasCriticalLog = activeRange.simulatedLogs.some(
        log => log.message.toLowerCase().includes(asset.host.toLowerCase()) || 
               (asset.role.includes('API') && log.severity === 'CRITICAL')
      );

      const status: NetworkNodeData['status'] = hasCriticalLog
        ? 'CRITICAL'
        : asset.status === 'DISCOVERED'
        ? 'ONLINE'
        : 'UNKNOWN';

      // Distribute nodes visually along 3D arc
      const xPos = (idx - (activeRange.assets.length - 1) / 2) * 2.2;
      const yPos = 0;
      const zPos = (idx % 2 === 0 ? 0.5 : -0.5);

      return {
        id: `node-${asset.host}`,
        name: asset.host,
        ip: asset.ip,
        type,
        status,
        role: asset.role,
        subnet: activeRange.networkTopology.subnet,
        openServices: asset.role.includes('HTTP') ? ['80', '443'] : asset.role.includes('DB') ? ['5432', '3306'] : ['22', '80'],
        threatsCount: hasCriticalLog ? 1 : 0,
        position3D: [xPos, yPos, zPos] as [number, number, number],
        simulatedLogs: activeRange.simulatedLogs.filter(l => l.severity === 'CRITICAL' || l.severity === 'HIGH')
      };
    }),
    // 3. AMAN Security Sentinel Node
    {
      id: 'node-aman-ai',
      name: 'AMAN AI Sentinel Node',
      ip: '10.255.255.1',
      type: 'AMAN',
      status: 'VERIFIED',
      role: 'Socratic AI Mentor & Threat Telemetry Auditor',
      subnet: '10.255.0.0/16',
      openServices: ['Port 9090 (AMAN RPC)', 'Port 443 (TLS)'],
      position3D: [0, -2.2, 0]
    }
  ];

  // Filter nodes based on active tab
  const filteredNodes = rawNodes.filter(node => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'SERVERS') return node.type === 'SERVER' || node.type === 'DATABASE';
    if (activeFilter === 'WORKSTATIONS') return node.type === 'WORKSTATION';
    if (activeFilter === 'NETWORK') return node.type === 'GATEWAY' || node.type === 'FIREWALL';
    if (activeFilter === 'THREATS') return node.status === 'CRITICAL' || node.status === 'WARNING';
    return true;
  });

  // Color mapping helper
  const getNodeColorHex = (type: NetworkNodeData['type'], status: NetworkNodeData['status']): number => {
    if (type === 'AMAN') return 0x8b5cf6; // Violet
    if (status === 'CRITICAL') return 0xef4444; // Red
    if (status === 'WARNING') return 0xf59e0b; // Amber
    if (status === 'VERIFIED') return 0x10b981; // Green
    if (type === 'GATEWAY' || type === 'FIREWALL') return 0x06b6d4; // Cyan
    if (type === 'WORKSTATION') return 0x3b82f6; // Blue
    return 0x06b6d4; // Cyan default
  };

  useEffect(() => {
    if (!shouldUse3D() || isMobileDevice() || !viewMode3D) {
      setUseFallback(true);
      return;
    }
    setUseFallback(false);

    const container = containerRef.current;
    if (!container) return;

    let animationFrameId: number;
    let renderer: THREE.WebGLRenderer;
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;

    const meshMap = new Map<THREE.Mesh, NetworkNodeData>();
    const nodeMeshes: THREE.Mesh[] = [];

    // Camera Orbit Controls State
    let isDragging = false;
    let previousMouseX = 0;
    let previousMouseY = 0;
    let rotationX = 0;
    let rotationY = 0;
    let isTabVisible = true;

    try {
      // 1. Scene Setup
      scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x0b0f17, 0.05);

      const width = container.clientWidth || 800;
      const height = container.clientHeight || 500;

      camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
      const defaultCamPos = new THREE.Vector3(0, 0, 8.5);
      camera.position.copy(defaultCamPos);
      cameraRef.current = camera;

      resetCameraTrigger.current = () => {
        rotationX = 0;
        rotationY = 0;
        camera.position.copy(defaultCamPos);
        camera.lookAt(0, 0, 0);
      };

      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height);
      container.appendChild(renderer.domElement);

      // 2. Lights
      const ambientLight = new THREE.AmbientLight(0x0f172a, 1.5);
      scene.add(ambientLight);

      const pointLight1 = new THREE.PointLight(0x06b6d4, 3, 20);
      pointLight1.position.set(5, 5, 5);
      scene.add(pointLight1);

      const pointLight2 = new THREE.PointLight(0x8b5cf6, 2.5, 20);
      pointLight2.position.set(-5, -5, -3);
      scene.add(pointLight2);

      // 3. Render Node Geometries
      const gatewayNode = filteredNodes.find(n => n.type === 'GATEWAY');

      filteredNodes.forEach((node) => {
        let geo: THREE.BufferGeometry;

        if (node.type === 'GATEWAY' || node.type === 'FIREWALL') {
          geo = new THREE.CylinderGeometry(0.35, 0.35, 0.4, 16);
        } else if (node.type === 'DATABASE') {
          geo = new THREE.CylinderGeometry(0.3, 0.3, 0.6, 16);
        } else if (node.type === 'WORKSTATION') {
          geo = new THREE.SphereGeometry(0.35, 16, 16);
        } else if (node.type === 'AMAN') {
          geo = new THREE.TorusGeometry(0.35, 0.12, 16, 32);
        } else {
          geo = new THREE.BoxGeometry(0.6, 0.5, 0.6);
        }

        const colorHex = getNodeColorHex(node.type, node.status);
        const mat = new THREE.MeshStandardMaterial({
          color: colorHex,
          emissive: colorHex,
          emissiveIntensity: node.status === 'CRITICAL' ? 0.8 : 0.35,
          roughness: 0.2,
          metalness: 0.8
        });

        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(...node.position3D);
        scene.add(mesh);

        // Add wireframe outer shell
        const wireGeo = geo.clone();
        const wireMat = new THREE.MeshBasicMaterial({
          color: colorHex,
          wireframe: true,
          transparent: true,
          opacity: 0.5
        });
        const wireMesh = new THREE.Mesh(wireGeo, wireMat);
        mesh.add(wireMesh);

        meshMap.set(mesh, node);
        nodeMeshes.push(mesh);

        // Draw connection lines to Gateway if node is not Gateway
        if (gatewayNode && node.id !== gatewayNode.id) {
          const linePoints = [
            new THREE.Vector3(...gatewayNode.position3D),
            new THREE.Vector3(...node.position3D)
          ];
          const lineGeo = new THREE.BufferGeometry().setFromPoints(linePoints);
          const lineMat = new THREE.LineBasicMaterial({
            color: node.status === 'CRITICAL' ? 0xef4444 : 0x0284c7,
            transparent: true,
            opacity: 0.4
          });
          const line = new THREE.Line(lineGeo, lineMat);
          scene.add(line);
        }
      });

      // 4. Floating Animated Data Packets Along Connections
      const particleGeo = new THREE.SphereGeometry(0.04, 8, 8);
      const particleMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
      const packetGroup = new THREE.Group();
      scene.add(packetGroup);

      const activePackets: { mesh: THREE.Mesh; start: THREE.Vector3; end: THREE.Vector3; progress: number; speed: number }[] = [];

      if (gatewayNode) {
        filteredNodes.forEach((node) => {
          if (node.id !== gatewayNode.id) {
            const pMesh = new THREE.Mesh(particleGeo, particleMat);
            packetGroup.add(pMesh);
            activePackets.push({
              mesh: pMesh,
              start: new THREE.Vector3(...gatewayNode.position3D),
              end: new THREE.Vector3(...node.position3D),
              progress: Math.random(),
              speed: 0.005 + Math.random() * 0.008
            });
          }
        });
      }

      // 5. Raycasting for Mouse Hover & Click
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();

      const handlePointerMove = (event: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(nodeMeshes, false);

        if (intersects.length > 0) {
          const intersectedMesh = intersects[0].object as THREE.Mesh;
          const nodeData = meshMap.get(intersectedMesh);
          if (nodeData) {
            setHoveredNode(nodeData);
            setTooltipPos({ x: event.clientX - rect.left + 15, y: event.clientY - rect.top - 15 });
            container.style.cursor = 'pointer';
            return;
          }
        }
        setHoveredNode(null);
        setTooltipPos(null);
        if (!isDragging) container.style.cursor = 'grab';
      };

      const handlePointerDown = (event: MouseEvent) => {
        isDragging = true;
        previousMouseX = event.clientX;
        previousMouseY = event.clientY;

        const rect = container.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(nodeMeshes, false);

        if (intersects.length > 0) {
          const intersectedMesh = intersects[0].object as THREE.Mesh;
          const nodeData = meshMap.get(intersectedMesh);
          if (nodeData) {
            setSelectedNode(nodeData);
          }
        }
      };

      const handlePointerUp = () => {
        isDragging = false;
        container.style.cursor = 'grab';
      };

      const handleDragRotate = (event: MouseEvent) => {
        if (!isDragging) return;
        const deltaX = event.clientX - previousMouseX;
        const deltaY = event.clientY - previousMouseY;
        previousMouseX = event.clientX;
        previousMouseY = event.clientY;

        rotationY += deltaX * 0.008;
        rotationX += deltaY * 0.008;

        // Clamp vertical orbit
        rotationX = Math.max(-Math.PI / 4, Math.min(Math.PI / 4, rotationX));

        const radius = defaultCamPos.length();
        camera.position.x = radius * Math.sin(rotationY) * Math.cos(rotationX);
        camera.position.y = radius * Math.sin(rotationX);
        camera.position.z = radius * Math.cos(rotationY) * Math.cos(rotationX);
        camera.lookAt(0, 0, 0);
      };

      const handleWheelZoom = (event: WheelEvent) => {
        event.preventDefault();
        const zoomDelta = event.deltaY * 0.005;
        camera.position.multiplyScalar(1 + zoomDelta);
        camera.position.clampLength(4, 15);
      };

      container.addEventListener('mousemove', handlePointerMove);
      container.addEventListener('mousemove', handleDragRotate);
      container.addEventListener('mousedown', handlePointerDown);
      window.addEventListener('mouseup', handlePointerUp);
      container.addEventListener('wheel', handleWheelZoom, { passive: false });

      // Tab visibility listener
      const handleVisibilityChange = () => {
        isTabVisible = !document.hidden;
      };
      document.addEventListener('visibilitychange', handleVisibilityChange);

      // Resize listener
      const handleResize = () => {
        if (!container) return;
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener('resize', handleResize);

      // 6. Animation Loop
      let clock = new THREE.Clock();

      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);

        if (!isTabVisible) return;

        const elapsedTime = clock.getElapsedTime();

        // Rotate node meshes slightly
        nodeMeshes.forEach(mesh => {
          mesh.rotation.y = elapsedTime * 0.3;
        });

        // Animate packets along lines
        activePackets.forEach(p => {
          p.progress += p.speed;
          if (p.progress > 1) p.progress = 0;
          p.mesh.position.lerpVectors(p.start, p.end, p.progress);
        });

        renderer.render(scene, camera);
      };

      animate();

      return () => {
        cancelAnimationFrame(animationFrameId);
        container.removeEventListener('mousemove', handlePointerMove);
        container.removeEventListener('mousemove', handleDragRotate);
        container.removeEventListener('mousedown', handlePointerDown);
        window.removeEventListener('mouseup', handlePointerUp);
        container.removeEventListener('wheel', handleWheelZoom);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        window.removeEventListener('resize', handleResize);

        if (renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
        renderer.dispose();
      };
    } catch (err) {
      console.warn('3D Cyber Network Initialization failed, serving 2D fallback:', err);
      setUseFallback(true);
    }
  }, [activeRangeId, activeFilter, viewMode3D]);

  const handleAskAmanAboutNode = (node: NetworkNodeData) => {
    const prompt = `Explain the cybersecurity architecture, function, and potential threat surface for the node ${node.name} (${node.ip}, Role: ${node.role}). What defensive controls should be monitored?`;
    if (onOpenAmanWithContext) {
      onOpenAmanWithContext(prompt);
    } else {
      // Trigger global Ask AMAN button if available
      const amanBtn = document.getElementById('global-ask-aman-btn');
      if (amanBtn) amanBtn.click();
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Topology Control Header Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
        
        {/* Environment Range Selector */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-bold uppercase">TARGET RANGE:</span>
          <select
            value={activeRangeId}
            onChange={(e) => {
              setActiveRangeId(e.target.value);
              setSelectedNode(null);
            }}
            className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-cyan-300 font-bold focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            {SIMULATED_TARGET_RANGES.map(range => (
              <option key={range.id} value={range.id}>
                {range.name} ({range.category})
              </option>
            ))}
          </select>
        </div>

        {/* Filter Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {(['ALL', 'SERVERS', 'WORKSTATIONS', 'NETWORK', 'THREATS'] as NetworkFilterCategory[]).map(cat => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer font-bold ${
                activeFilter === cat
                  ? 'bg-cyan-500 text-slate-950'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* View Controls & Reset */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => resetCameraTrigger.current()}
            className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 cursor-pointer"
            title="Reset Camera View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setViewMode3D(!viewMode3D)}
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-cyan-300 font-bold flex items-center gap-1.5 cursor-pointer hover:border-cyan-500/50"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{viewMode3D ? 'SWITCH TO 2D' : 'SWITCH TO 3D'}</span>
          </button>
        </div>

      </div>

      {/* RENDER CANVAS OR 2D FALLBACK */}
      {!viewMode3D || useFallback ? (
        <Interactive2DCyberNetwork
          nodes={filteredNodes}
          selectedNode={selectedNode}
          onSelectNode={setSelectedNode}
          onAskAman={handleAskAmanAboutNode}
        />
      ) : (
        <div className="relative w-full h-[520px] rounded-3xl bg-slate-950 border border-slate-800/80 overflow-hidden shadow-2xl">
          
          {/* Top Info Banner */}
          <div className="absolute top-4 left-4 z-10 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold flex items-center gap-2 shadow-lg backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>3D INTERACTIVE CYBER RANGE TOPOLOGY</span>
          </div>

          {/* 3D Canvas Mount */}
          <div ref={containerRef} className="w-full h-full" />

          {/* Hover Tooltip Overlay */}
          {hoveredNode && tooltipPos && (
            <div
              style={{ left: tooltipPos.x, top: tooltipPos.y }}
              className="absolute z-20 pointer-events-none p-3 rounded-xl bg-slate-900/95 border border-cyan-500/50 shadow-2xl font-mono text-xs space-y-1 backdrop-blur-md"
            >
              <div className="font-bold text-white flex items-center gap-2">
                <span>{hoveredNode.name}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-cyan-300">
                  {hoveredNode.type}
                </span>
              </div>
              <div className="text-cyan-300 text-[11px]">IP: {hoveredNode.ip}</div>
              <div className="text-slate-400 text-[10px]">{hoveredNode.role}</div>
            </div>
          )}

          {/* Selected Node Drawer Side Panel */}
          {selectedNode && (
            <div className="absolute top-4 right-4 bottom-4 z-20 w-80 sm:w-96 p-6 rounded-2xl bg-slate-900/95 border border-cyan-500/40 shadow-2xl overflow-y-auto space-y-5 font-mono text-xs backdrop-blur-md">
              <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] text-cyan-400 font-bold uppercase block">NODE INSPECTOR</span>
                  <h3 className="text-lg font-bold text-white">{selectedNode.name}</h3>
                  <span className="text-cyan-300 text-xs">IP: {selectedNode.ip}</span>
                </div>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-slate-500 text-[10px] block">FUNCTION / ROLE</span>
                  <p className="text-slate-200 leading-relaxed font-sans text-xs">{selectedNode.role}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">TYPE</span>
                    <span className="text-indigo-300 font-bold">{selectedNode.type}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">STATUS</span>
                    <span className={`font-bold ${selectedNode.status === 'CRITICAL' ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {selectedNode.status}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-slate-500 text-[10px] block">OPEN PORTS / SERVICES</span>
                  <span className="text-cyan-300 font-mono text-[11px]">
                    {selectedNode.openServices?.join(', ') || 'Standard Port Services'}
                  </span>
                </div>

                {selectedNode.simulatedLogs && selectedNode.simulatedLogs.length > 0 && (
                  <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-1">
                    <span className="text-rose-400 font-bold text-[10px] flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5" /> RECENT AUDIT LOG
                    </span>
                    <p className="text-[10px] text-slate-300 font-mono leading-relaxed">
                      {selectedNode.simulatedLogs[0].message}
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-2">
                <button
                  onClick={() => handleAskAmanAboutNode(selectedNode)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-90 text-white font-bold text-xs uppercase flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                >
                  <Bot className="w-4 h-4 text-violet-200" />
                  <span>ASK AMAN ABOUT THIS NODE</span>
                </button>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
