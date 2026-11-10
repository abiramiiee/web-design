import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { DreamCategory } from '../../types';

interface ClayRoomCanvasProps {
  category: DreamCategory;
  wallColor?: string;
  floorColor?: string;
  decorationsEnabled?: boolean;
  onObjectClick?: (objectName: string, description: string) => void;
  className?: string;
  showFallback2D?: boolean;
}

export const ClayRoomCanvas: React.FC<ClayRoomCanvasProps> = ({
  category,
  wallColor = '#FDF2F8',
  floorColor = '#FCE7F3',
  decorationsEnabled = true,
  onObjectClick,
  className = '',
  showFallback2D = false,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hoveredName, setHoveredName] = useState<string | null>(null);
  const [isLowPerformance, setIsLowPerformance] = useState(showFallback2D);

  useEffect(() => {
    setIsLowPerformance(showFallback2D);
  }, [showFallback2D]);

  useEffect(() => {
    if (isLowPerformance || !mountRef.current) return;

    const container = mountRef.current;
    const width = container.clientWidth || 500;
    const height = container.clientHeight || 400;

    // Detect software rendering
    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return false;
      }
    })();

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(wallColor).lerp(new THREE.Color('#FFFFFF'), 0.5);

    // Camera (Orthographic-feeling isometric perspective)
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(7, 6, 7);
    camera.lookAt(0, 0.6, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2.15;
    controls.minDistance = 4;
    controls.maxDistance = 14;
    controls.target.set(0, 0.6, 0);

    // Lighting (Warm tactile 3D clay studio rig)
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.7);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xFFE4E6, 0xEDE9FE, 0.6);
    hemiLight.position.set(0, 10, 0);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xFFFBEB, 1.3);
    keyLight.position.set(6, 10, 5);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xE0F2FE, 0.6);
    fillLight.position.set(-6, 6, -4);
    scene.add(fillLight);

    // Raycaster for interactive clicks
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const interactiveObjects: THREE.Object3D[] = [];

    // Clay Material Helper
    const createClayMaterial = (color: string | number, roughness = 0.88) => {
      return new THREE.MeshStandardMaterial({
        color: new THREE.Color(color),
        roughness: roughness,
        metalness: 0.05,
      });
    };

    // Build Room Environment
    const roomGroup = new THREE.Group();
    scene.add(roomGroup);

    // 1. Room Base Floor (Rounded clay slab)
    const floorGeo = new THREE.BoxGeometry(4.8, 0.35, 4.8);
    const floorMat = createClayMaterial(floorColor, 0.9);
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.position.y = -0.175;
    floor.receiveShadow = !isSoftwareGl;
    roomGroup.add(floor);

    // Back Left Wall
    const wallGeo = new THREE.BoxGeometry(4.8, 3.2, 0.25);
    const wallMat = createClayMaterial(wallColor, 0.92);
    const backWall = new THREE.Mesh(wallGeo, wallMat);
    backWall.position.set(0, 1.45, -2.28);
    backWall.receiveShadow = !isSoftwareGl;
    roomGroup.add(backWall);

    // Back Right Wall
    const sideWall = new THREE.Mesh(wallGeo, wallMat);
    sideWall.rotation.y = Math.PI / 2;
    sideWall.position.set(-2.28, 1.45, 0);
    sideWall.receiveShadow = !isSoftwareGl;
    roomGroup.add(sideWall);

    // Soft Rug
    const rugGeo = new THREE.CylinderGeometry(1.6, 1.6, 0.04, 32);
    const rugMat = createClayMaterial('#F3E8FF', 0.95);
    const rug = new THREE.Mesh(rugGeo, rugMat);
    rug.position.set(0.4, 0.02, 0.4);
    rug.receiveShadow = !isSoftwareGl;
    roomGroup.add(rug);

    // Helper to register interactive object
    const registerObject = (obj: THREE.Object3D, name: string, desc: string) => {
      obj.userData = { name, desc };
      interactiveObjects.push(obj);
      obj.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          child.userData = { name, desc };
          interactiveObjects.push(child);
        }
      });
    };

    // Category-specific Clay Miniatures
    const propsGroup = new THREE.Group();
    roomGroup.add(propsGroup);

    // 1. Study / Work Desk (Present in Education & Career)
    const deskGroup = new THREE.Group();
    const deskTop = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.14, 1.2), createClayMaterial('#FDE68A'));
    deskTop.position.set(-0.6, 1.1, -0.9);
    deskTop.castShadow = true;
    deskTop.receiveShadow = true;
    deskGroup.add(deskTop);

    // Desk Legs
    [-1.6, 0.4].forEach((x) => {
      [-1.35, -0.45].forEach((z) => {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.1, 16), createClayMaterial('#D97706'));
        leg.position.set(x, 0.55, z);
        leg.castShadow = true;
        deskGroup.add(leg);
      });
    });
    propsGroup.add(deskGroup);

    // Mini Laptop
    const laptopGroup = new THREE.Group();
    const laptopBase = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.04, 0.5), createClayMaterial('#E2E8F0', 0.6));
    laptopBase.position.set(-0.6, 1.19, -0.9);
    const laptopScreen = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.45, 0.03), createClayMaterial('#38BDF8', 0.4));
    laptopScreen.position.set(-0.6, 1.4, -1.12);
    laptopScreen.rotation.x = -0.2;
    laptopGroup.add(laptopBase, laptopScreen);
    propsGroup.add(laptopGroup);
    registerObject(laptopGroup, 'Clay Creator Laptop', 'Active focus station for software, dreams, and planning.');

    // Category Custom Props
    if (category === 'Education') {
      // Bookshelf
      const shelf = new THREE.Group();
      const frame = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.2, 0.4), createClayMaterial('#FED7AA'));
      frame.position.set(1.4, 1.1, -1.9);
      shelf.add(frame);

      // Books in shelf
      const colors = ['#F43F5E', '#8B5CF6', '#10B981', '#3B82F6', '#F59E0B'];
      colors.forEach((c, idx) => {
        const book = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.5, 0.28), createClayMaterial(c));
        book.position.set(1.0 + idx * 0.18, 1.2, -1.9);
        shelf.add(book);
      });
      propsGroup.add(shelf);
      registerObject(shelf, 'Wisdom Bookshelf', 'Knowledge library containing courses, books, and insights.');

      // Graduation Cap
      const gradCap = new THREE.Group();
      const topPlate = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.04, 0.45), createClayMaterial('#312E81'));
      topPlate.position.set(-0.6, 1.75, -0.9);
      topPlate.rotation.y = 0.4;
      const skull = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.18, 0.16, 16), createClayMaterial('#312E81'));
      skull.position.set(-0.6, 1.67, -0.9);
      gradCap.add(topPlate, skull);
      propsGroup.add(gradCap);
      registerObject(gradCap, 'Mastery Graduation Cap', 'Symbol of completing major education certificates and degrees.');
    } else if (category === 'Career') {
      // Achievement Trophy on Wall Shelf
      const shelf = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.08, 0.35), createClayMaterial('#FED7AA'));
      shelf.position.set(0.8, 1.8, -2.05);
      propsGroup.add(shelf);

      const trophy = new THREE.Group();
      const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.1, 0.35, 16), createClayMaterial('#FBBF24', 0.4));
      cup.position.set(0.8, 2.05, -2.05);
      const trophyBase = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.18, 0.12, 16), createClayMaterial('#78350F'));
      trophyBase.position.set(0.8, 1.9, -2.05);
      trophy.add(cup, trophyBase);
      propsGroup.add(trophy);
      registerObject(trophy, 'Golden Career Trophy', 'Unlocked milestone: Senior Software & AI Architect.');

      // Whiteboard with sticky notes
      const wb = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.1, 0.06), createClayMaterial('#FFFFFF'));
      wb.position.set(-1.0, 2.2, -2.15);
      propsGroup.add(wb);
      registerObject(wb, 'Sprint Strategy Board', 'Roadmap and architectural milestones for product launches.');
    } else if (category === 'Travel') {
      // Globe
      const globeGroup = new THREE.Group();
      const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.35, 24, 24), createClayMaterial('#0284C7'));
      sphere.position.set(-0.6, 1.6, -0.9);
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.04, 8, 24), createClayMaterial('#F59E0B'));
      ring.position.set(-0.6, 1.6, -0.9);
      ring.rotation.x = 0.3;
      globeGroup.add(sphere, ring);
      propsGroup.add(globeGroup);
      registerObject(globeGroup, 'World Travel Globe', 'Visualizer for Kyoto, Paris, and Alps travel routes.');

      // Suitcases
      const suitcase = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.55, 0.35), createClayMaterial('#F97316'));
      suitcase.position.set(1.2, 0.3, 0.8);
      propsGroup.add(suitcase);
      registerObject(suitcase, 'Explorer Suitcase', 'Packed with essentials for cultural immersion.');

      // Miniature Airplane
      const plane = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.7, 16), createClayMaterial('#FFFFFF'));
      plane.rotation.z = Math.PI / 2;
      plane.rotation.y = 0.5;
      plane.position.set(0.2, 2.4, 0);
      propsGroup.add(plane);
      registerObject(plane, 'Skyways Dream Flight', 'Target flight to Osaka Kansai.');
    } else if (category === 'Creativity') {
      // Painter's Easel
      const easelGroup = new THREE.Group();
      const canvas = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.2, 0.06), createClayMaterial('#FFFBEB'));
      canvas.position.set(1.0, 1.5, 0.2);
      canvas.rotation.y = -0.4;
      const leg1 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.2, 8), createClayMaterial('#78350F'));
      leg1.position.set(0.8, 1.1, 0.4);
      easelGroup.add(canvas, leg1);
      propsGroup.add(easelGroup);
      registerObject(easelGroup, 'Artist Clay Easel', 'Studio canvas for dream illustration and visual arts.');

      // Pottery Vase
      const vase = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.15, 0.6, 16), createClayMaterial('#EC4899'));
      vase.position.set(-0.6, 1.45, -0.9);
      propsGroup.add(vase);
      registerObject(vase, 'Handmade Raku Ceramic', 'Crafted pottery piece representing mindful patience.');
    } else if (category === 'Health & Wellness') {
      // Yoga Mat
      const mat = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.03, 0.8), createClayMaterial('#10B981'));
      mat.position.set(0.6, 0.03, 0.6);
      propsGroup.add(mat);
      registerObject(mat, 'Sunrise Yoga Mat', 'Daily sanctuary for morning breathwork, core, and stretching.');

      // Kettlebell
      const kbGroup = new THREE.Group();
      const ball = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 16), createClayMaterial('#475569'));
      ball.position.set(-0.4, 0.22, 1.2);
      const handle = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.04, 8, 16), createClayMaterial('#1E293B'));
      handle.position.set(-0.4, 0.4, 1.2);
      kbGroup.add(ball, handle);
      propsGroup.add(kbGroup);
      registerObject(kbGroup, '16kg Strength Kettlebell', 'Endurance and strength foundation for marathon preparation.');
    } else {
      // Personal Growth / Hobbies
      // Meditation Cushion
      const cushion = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.55, 0.2, 24), createClayMaterial('#8B5CF6'));
      cushion.position.set(0.6, 0.1, 0.6);
      propsGroup.add(cushion);
      registerObject(cushion, 'Mindfulness Zafu Cushion', 'Daily meditation space for gratitude and clarity.');

      // Flourishing Clay Bonsai Plant
      const plantGroup = new THREE.Group();
      const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.22, 0.3, 16), createClayMaterial('#EA580C'));
      pot.position.set(-0.6, 1.3, -0.9);
      const foliage = new THREE.Mesh(new THREE.DodecahedronGeometry(0.35, 1), createClayMaterial('#22C55E'));
      foliage.position.set(-0.6, 1.6, -0.9);
      plantGroup.add(pot, foliage);
      propsGroup.add(plantGroup);
      registerObject(plantGroup, 'Growth Clay Bonsai', 'Visual representation of continuous learning and patience.');
    }

    // Extra Clay Decorations (Plant & Stars)
    if (decorationsEnabled) {
      // Floor Potted Plant
      const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.2, 0.45, 16), createClayMaterial('#F97316'));
      pot.position.set(-1.6, 0.23, 1.4);
      const bush = new THREE.Mesh(new THREE.DodecahedronGeometry(0.4, 1), createClayMaterial('#10B981'));
      bush.position.set(-1.6, 0.6, 1.4);
      propsGroup.add(pot, bush);

      // Cute clay wall clock
      const clock = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.06, 24), createClayMaterial('#FEF08A'));
      clock.rotation.x = Math.PI / 2;
      clock.position.set(1.4, 2.4, -2.18);
      propsGroup.add(clock);
    }

    // Raycast Interaction on click and hover
    const handlePointerDown = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactiveObjects, true);

      if (intersects.length > 0) {
        let topObj = intersects[0].object;
        while (topObj.parent && !topObj.userData.name && topObj.parent !== scene) {
          topObj = topObj.parent;
        }
        if (topObj.userData && topObj.userData.name) {
          if (onObjectClick) {
            onObjectClick(topObj.userData.name, topObj.userData.desc);
          }
          // gentle tactile pulse animation
          topObj.scale.set(1.15, 1.15, 1.15);
          setTimeout(() => {
            topObj.scale.set(1, 1, 1);
          }, 300);
        }
      }
    };

    const handlePointerMove = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactiveObjects, true);

      if (intersects.length > 0) {
        const item = intersects[0].object.userData;
        if (item && item.name) {
          setHoveredName(item.name);
          renderer.domElement.style.cursor = 'pointer';
        }
      } else {
        setHoveredName(null);
        renderer.domElement.style.cursor = 'grab';
      }
    };

    renderer.domElement.addEventListener('click', handlePointerDown);
    renderer.domElement.addEventListener('mousemove', handlePointerMove);

    // Animation Loop
    let animId = 0;
    let clock = new THREE.Clock();

    const animate = () => {
      const delta = clock.getDelta();
      controls.update();

      // Gentle subtle floating motion on room
      roomGroup.position.y = Math.sin(clock.getElapsedTime() * 1.5) * 0.04;

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('click', handlePointerDown);
      renderer.domElement.removeEventListener('mousemove', handlePointerMove);
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [category, wallColor, floorColor, decorationsEnabled, isLowPerformance]);

  if (isLowPerformance) {
    return (
      <div className={`relative w-full h-full min-h-[360px] flex flex-col items-center justify-center p-8 rounded-3xl bg-amber-50/70 border-2 border-amber-200/60 shadow-inner ${className}`}>
        <div className="text-6xl mb-4 animate-bounce">
          {category === 'Education' ? '🎓' : category === 'Career' ? '💼' : category === 'Travel' ? '✈️' : category === 'Creativity' ? '🎨' : category === 'Health & Wellness' ? '🧘' : '🌱'}
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">{category} Miniature Clay Sanctuary (2D Mode)</h3>
        <p className="text-sm text-gray-600 text-center max-w-md mb-4">
          Optimized lightweight accessible view with high contrast and zero GPU strain.
        </p>
        <button
          onClick={() => setIsLowPerformance(false)}
          className="clay-button-primary px-4 py-2 text-sm"
        >
          Enable Interactive 3D Room
        </button>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full min-h-[360px] overflow-hidden rounded-3xl ${className}`}>
      <div ref={mountRef} className="w-full h-full min-h-[360px]" />
      
      {/* Interactive hover tooltip badge */}
      {hoveredName && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-xs font-semibold text-purple-900 shadow-md border border-purple-100 flex items-center gap-1.5 animate-fade-in pointer-events-none">
          <span>✨</span>
          <span>Click to inspect: {hoveredName}</span>
        </div>
      )}

      {/* 3D controls guidance pill */}
      <div className="absolute bottom-3 left-4 px-3 py-1 rounded-full bg-black/40 text-white text-[11px] backdrop-blur-sm pointer-events-none flex items-center gap-2">
        <span>🔄 Drag to rotate</span>
        <span>•</span>
        <span>🔍 Scroll to zoom</span>
        <span>•</span>
        <span>👆 Click clay props</span>
      </div>

      {/* 2D Fallback switch button for accessibility */}
      <button
        onClick={() => setIsLowPerformance(true)}
        className="absolute top-3 right-3 text-xs px-2.5 py-1 rounded-lg bg-white/80 hover:bg-white text-gray-700 shadow-sm border border-gray-200 transition"
        title="Switch to 2D battery-saving mode"
      >
        2D Mode
      </button>
    </div>
  );
};
