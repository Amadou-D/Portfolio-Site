'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import Header from '@/components/header';
import RetroGrid from '@/components/ui/retro-grid';

interface PointerPosition {
  x: number;
  y: number;
}

const vibrantColorPairs = [
  { color1: '#FF4B2B', color2: '#FF416C' },
  { color1: '#00C9FF', color2: '#92FE9D' },
  { color1: '#6A1B9A', color2: '#8E24AA' },
  { color1: '#ab5675', color2: '#FF9800' },
  { color1: '#72dcbb', color2: '#34acba' },
  { color1: '#ffe07e', color2: '#ee6a7c' },
];

const CubePage = () => {
  const [cubeStyle, setCubeStyle] = useState<React.CSSProperties>({
    transform: 'rotateX(0deg) rotateY(0deg)',
  });
  const [showSkills, setShowSkills] = useState(false);
  const threeRef = useRef<HTMLDivElement | null>(null);

  const isDragging = useRef<boolean>(false);
  const lastPointerPosition = useRef<PointerPosition>({ x: 0, y: 0 });
  const rotationAngles = useRef<PointerPosition>({ x: 0, y: 0 });
  const cubeRef = useRef<HTMLDivElement | null>(null);

  const generateGradient = (colors: { color1: string, color2: string }): string => {
    return `linear-gradient(45deg, ${colors.color1}, ${colors.color2})`;
  };

  const [gradientColors, setGradientColors] = useState<string>(
    generateGradient(vibrantColorPairs[0])
  );

  useEffect(() => {
    const handlePointerEnter = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;

      lastPointerPosition.current = { x: e.clientX, y: e.clientY };
      isDragging.current = true;
    };

    const handlePointerLeave = () => {
      isDragging.current = false;
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch' || !isDragging.current) return;

      const cubeRect = cubeRef.current?.getBoundingClientRect();
      if (cubeRect) {
        const deltaX = (e.clientX - lastPointerPosition.current.x) * (2 * Math.PI) / (cubeRect.width || 1);
        const deltaY = (e.clientY - lastPointerPosition.current.y) * (2 * Math.PI) / (cubeRect.height || 1);

        rotationAngles.current.x += deltaY;
        rotationAngles.current.y += deltaX;

        setCubeStyle({
          transform: `rotateX(${rotationAngles.current.x}rad) rotateY(${rotationAngles.current.y}rad)`,
        });

        lastPointerPosition.current = { x: e.clientX, y: e.clientY };
      }
    };

    const cubeElement = cubeRef.current;
    if (cubeElement) {
      cubeElement.addEventListener('pointerenter', handlePointerEnter);
      cubeElement.addEventListener('pointerleave', handlePointerLeave);
      cubeElement.addEventListener('pointermove', handlePointerMove);
    }

    const colorInterval = setInterval(() => {
      setGradientColors(generateGradient(vibrantColorPairs[Math.floor(Math.random() * vibrantColorPairs.length)]));
    }, 2000);

    const rotationInterval = setInterval(() => {
      if (!isDragging.current) {
        rotationAngles.current.x += 0.01;
        rotationAngles.current.y += 0.01;

        setCubeStyle({
          transform: `rotateX(${rotationAngles.current.x}rad) rotateY(${rotationAngles.current.y}rad)`,
        });
      }
    }, 30);

    return () => {
      if (cubeElement) {
        cubeElement.removeEventListener('pointerenter', handlePointerEnter);
        cubeElement.removeEventListener('pointerleave', handlePointerLeave);
        cubeElement.removeEventListener('pointermove', handlePointerMove);
      }
      clearInterval(rotationInterval);
      clearInterval(colorInterval);
    };
  }, []);

  useEffect(() => {
    if (!showSkills || !threeRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    threeRef.current.appendChild(renderer.domElement);

    // Create a wavy background with gradient
    const planeGeometry = new THREE.PlaneGeometry(40, 40, 32, 32);
    const planeMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color1: { value: new THREE.Color('#FF4B2B') },
        color2: { value: new THREE.Color('#FF416C') },
        color3: { value: new THREE.Color('#00C9FF') },
        color4: { value: new THREE.Color('#92FE9D') },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color1;
        uniform vec3 color2;
        uniform vec3 color3;
        uniform vec3 color4;
        varying vec2 vUv;
        void main() {
          vec3 color = mix(color1, color2, sin(time + vUv.y * 3.14));
          color = mix(color, color3, sin(time + vUv.x * 3.14));
          color = mix(color, color4, sin(time + vUv.y * 3.14) * sin(time + vUv.x * 3.14));
          gl_FragColor = vec4(color, 1.0);
        }
      `,
      wireframe: true,
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    scene.add(plane);

    const animate = () => {
      requestAnimationFrame(animate);
      planeMaterial.uniforms.time.value += 0.01;
      const position = plane.geometry.attributes.position;
      const count = position.count;
      for (let i = 0; i < count; i++) {
        const x = position.getX(i);
        const y = position.getY(i);
        const z = Math.sin(x * 0.5 + planeMaterial.uniforms.time.value) * Math.cos(y * 0.5 + planeMaterial.uniforms.time.value);
        position.setZ(i, z);
      }
      position.needsUpdate = true;
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      renderer.dispose();
      threeRef.current?.removeChild(renderer.domElement);
    };
  }, [showSkills]);

  return (
    <div
      className="relative w-screen min-h-screen flex flex-col items-center justify-start bg-gray-900 overflow-y-auto"
      style={{ '--gradient': gradientColors } as React.CSSProperties}
    >
      <RetroGrid gridColor="rgba(255, 255, 255, 0.3)" />
      <Header />

      {/* Interactive Cube Logo */}
      <div
        ref={cubeRef}
        className="absolute top-7 left-7 "
        style={{
          width: '50px',
          height: '50px',
          perspective: '1200px',
        }}
      >
        <div
          className="absolute w-full h-full"
          style={{
            ...cubeStyle,
            transformStyle: 'preserve-3d',
          }}
        >
          <div className="absolute w-full h-full" style={{ background: gradientColors, transform: 'rotateY(0deg) translateZ(24px)', backfaceVisibility: 'hidden' }} />
          <div className="absolute w-full h-full" style={{ background: gradientColors, transform: 'rotateY(180deg) translateZ(24px)', backfaceVisibility: 'hidden' }} />
          <div className="absolute w-full h-full" style={{ background: gradientColors, transform: 'rotateY(90deg) translateZ(24px)', backfaceVisibility: 'hidden' }} />
          <div className="absolute w-full h-full" style={{ background: gradientColors, transform: 'rotateY(-90deg) translateZ(24px)', backfaceVisibility: 'hidden' }} />
          <div className="absolute w-full h-full" style={{ background: gradientColors, transform: 'rotateX(90deg) translateZ(24px)', backfaceVisibility: 'hidden' }} />
          <div className="absolute w-full h-full" style={{ background: gradientColors, transform: 'rotateX(-90deg) translateZ(24px)', backfaceVisibility: 'hidden' }} />
        </div>
      </div>

      {/* Text Section */}
      <div className="mt-20 text-center text-gray-200 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-16 min-w-[300px] sm:min-w-[400px] md:min-w-[500px] lg:min-w-[600px] xl:min-w-[700px]">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-4 font-['Montserrat']">
          Hey I&apos;m <span className="gradient-text">Amadou</span>
        </h1>
        <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-['Roboto'] semi">
          I&apos;m a Full Stack Developer
        </p>
        <p className="text-2xl sm:text-3xl md:text-4xl text-gray-200 font-['Roboto']">
          That builds <span className="gradient-text">customized</span> Websites and <span className="gradient-text">Applications</span>
        </p>
        <button
          className="mt-6 px-6 py-3 text-lg hover:text-gray-400 text-white rounded"
          onClick={() => setShowSkills((prev) => !prev)}
        >
          {showSkills ? 'Hide Skills' : 'My Skills'}
        </button>
      </div>

      {/* Skills Section */}
      {showSkills && (
        <div
          ref={threeRef}
          className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-70 z-50 flex items-center justify-center"
        >
          <button
            className="absolute top-4 right-4 px-4 py-2 bg-gray-500 text-white rounded"
            onClick={() => setShowSkills(false)}
          >
            Back
          </button>
        </div>
      )}
    </div>
  );
};

export default CubePage;