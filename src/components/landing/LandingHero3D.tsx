import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const LandingHero3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || 550;
    const height = container.clientHeight || 450;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 8.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    container.appendChild(renderer.domElement);

    // Warm Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff3e0, 1.4);
    keyLight.position.set(5, 8, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xede9fe, 0.9);
    fillLight.position.set(-5, -3, 3);
    scene.add(fillLight);

    // Clay Material Factory
    const createClayMat = (color: string | number) => {
      return new THREE.MeshStandardMaterial({
        color: new THREE.Color(color),
        roughness: 0.86,
        metalness: 0.05,
      });
    };

    const mainWorld = new THREE.Group();
    scene.add(mainWorld);

    // 1. Central Floating Island Base (soft rounded clay disk)
    const baseGeo = new THREE.CylinderGeometry(2.6, 2.2, 0.65, 32);
    const baseMat = createClayMat('#FED7AA');
    const island = new THREE.Mesh(baseGeo, baseMat);
    island.position.y = -0.5;
    mainWorld.add(island);

    // Green grass layer on island
    const grassGeo = new THREE.CylinderGeometry(2.62, 2.6, 0.18, 32);
    const grassMat = createClayMat('#86EFAC');
    const grass = new THREE.Mesh(grassGeo, grassMat);
    grass.position.y = -0.15;
    mainWorld.add(grass);

    // 2. Miniature Clay Studio Desk on Island
    const desk = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.12, 0.9), createClayMat('#FEF08A'));
    desk.position.set(-0.2, 0.5, 0);
    mainWorld.add(desk);

    // Mini Laptop
    const laptop = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.04, 0.35), createClayMat('#E2E8F0'));
    laptop.position.set(-0.2, 0.58, 0);
    const screen = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.35, 0.03), createClayMat('#38BDF8'));
    screen.position.set(-0.2, 0.74, -0.16);
    screen.rotation.x = -0.2;
    mainWorld.add(laptop, screen);

    // 3. Golden Clay Trophy
    const trophyGroup = new THREE.Group();
    const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.1, 0.35, 16), createClayMat('#FBBF24'));
    cup.position.y = 0.2;
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.12, 16), createClayMat('#92400E'));
    trophyGroup.add(cup, base);
    trophyGroup.position.set(0.9, 0.5, 0.2);
    mainWorld.add(trophyGroup);

    // 4. Clay Potted Tree
    const treeGroup = new THREE.Group();
    const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.15, 0.3, 16), createClayMat('#EA580C'));
    const foliage1 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.38, 1), createClayMat('#22C55E'));
    foliage1.position.y = 0.45;
    const foliage2 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.28, 1), createClayMat('#4ADE80'));
    foliage2.position.set(0.15, 0.75, 0);
    treeGroup.add(pot, foliage1, foliage2);
    treeGroup.position.set(-1.4, 0.2, 0.5);
    mainWorld.add(treeGroup);

    // 5. Floating Satellites: Books, Stars, and Heart
    interface FloatingItem {
      mesh: THREE.Object3D;
      speed: number;
      offset: number;
      radius: number;
      height: number;
    }
    const floatingItems: FloatingItem[] = [];

    // Book 1
    const book1 = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.1, 0.55), createClayMat('#F43F5E'));
    mainWorld.add(book1);
    floatingItems.push({ mesh: book1, speed: 0.8, offset: 0, radius: 2.8, height: 1.2 });

    // Book 2
    const book2 = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.09, 0.5), createClayMat('#8B5CF6'));
    mainWorld.add(book2);
    floatingItems.push({ mesh: book2, speed: 0.6, offset: 2.1, radius: 3.0, height: 0.8 });

    // Clay Star 1
    const star1 = new THREE.Mesh(new THREE.OctahedronGeometry(0.22), createClayMat('#FDE047'));
    mainWorld.add(star1);
    floatingItems.push({ mesh: star1, speed: 1.1, offset: 1.2, radius: 2.5, height: 1.8 });

    // Clay Star 2
    const star2 = new THREE.Mesh(new THREE.OctahedronGeometry(0.18), createClayMat('#F472B6'));
    mainWorld.add(star2);
    floatingItems.push({ mesh: star2, speed: 0.9, offset: 4.2, radius: 2.9, height: 1.6 });

    // Little Cloud
    const cloudGroup = new THREE.Group();
    const puff1 = new THREE.Mesh(new THREE.SphereGeometry(0.32, 16, 16), createClayMat('#FFFFFF'));
    const puff2 = new THREE.Mesh(new THREE.SphereGeometry(0.25, 16, 16), createClayMat('#FFFFFF'));
    puff2.position.x = 0.25;
    const puff3 = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 16), createClayMat('#FFFFFF'));
    puff3.position.x = -0.22;
    cloudGroup.add(puff1, puff2, puff3);
    mainWorld.add(cloudGroup);
    floatingItems.push({ mesh: cloudGroup, speed: 0.45, offset: 3.5, radius: 3.2, height: 2.2 });

    // Mouse Parallax
    let targetRotY = 0;
    let targetRotX = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetRotY = x * 0.45;
      targetRotX = -y * 0.25;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let animId = 0;
    let clock = new THREE.Clock();

    const animate = () => {
      const elapsed = clock.getElapsedTime();

      // Smooth damp towards mouse tilt
      mainWorld.rotation.y += (targetRotY - mainWorld.rotation.y) * 0.05 + 0.003;
      mainWorld.rotation.x += (targetRotX - mainWorld.rotation.x) * 0.05;

      // Island gentle bobbing
      mainWorld.position.y = Math.sin(elapsed * 1.5) * 0.12;

      // Floating items orbit
      floatingItems.forEach((item) => {
        const angle = elapsed * item.speed + item.offset;
        item.mesh.position.x = Math.cos(angle) * item.radius;
        item.mesh.position.z = Math.sin(angle) * item.radius;
        item.mesh.position.y = item.height + Math.sin(elapsed * 2 + item.offset) * 0.2;
        item.mesh.rotation.x += 0.01;
        item.mesh.rotation.y += 0.015;
      });

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[440px] md:h-[500px] flex items-center justify-center">
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      <div className="absolute -bottom-2 px-4 py-1.5 rounded-full bg-white/70 backdrop-blur-sm text-xs font-medium text-purple-900 border border-purple-100 shadow-sm pointer-events-none flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <span>Interactive 3D Miniature Clay World • Move cursor to tilt</span>
      </div>
    </div>
  );
};
