'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const vibrantColorPairs = [
  { color1: '#FF4B2B', color2: '#FF416C' },
  { color1: '#00C9FF', color2: '#92FE9D' },
  { color1: '#6A1B9A', color2: '#8E24AA' },
  { color1: '#ab5675', color2: '#FF9800' },
  { color1: '#72dcbb', color2: '#34acba' },
  { color1: '#ffe07e', color2: '#ee6a7c' },
];

interface SkillsSectionProps {
  onClose: () => void;
}

const SkillsSection: React.FC<SkillsSectionProps> = ({ onClose }) => {
  const threeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!threeRef.current) return;

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
  }, []);

  return (
    <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-70 z-50 flex items-center justify-center">
      <button
        className="absolute top-4 right-4 px-4 py-2 bg-gray-500 text-white rounded"
        onClick={onClose}
      >
        Close
      </button>
      <div ref={threeRef} className="w-full h-full"></div>
    </div>
  );
};

export default SkillsSection;