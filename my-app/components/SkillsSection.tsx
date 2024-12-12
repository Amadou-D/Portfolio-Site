'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface SkillsSectionProps {
  onClose: () => void;
}

const skills = [
  'JavaScript', 'React', 'Node.js', 'CSS', 'HTML', 'Three.js', 'C#', 'TypeScript', 'Python', 'Docker', 'Java', 'Next.js', 'SQL', 'MongoDB', 'Firebase'
];

const themes = {
  vibrant: [
    { color1: '#FF4B2B', color2: '#FF416C' },
    { color1: '#00C9FF', color2: '#92FE9D' },
    { color1: '#6A1B9A', color2: '#8E24AA' },
    { color1: '#ab5675', color2: '#FF9800' },
    { color1: '#72dcbb', color2: '#34acba' },
    { color1: '#ffe07e', color2: '#ee6a7c' },
  ],
  warm: [
    { color1: '#FF7E5F', color2: '#FEB47B' },
    { color1: '#FF6F61', color2: '#DE4313' },
    { color1: '#FF512F', color2: '#DD2476' },
    { color1: '#FF4B2B', color2: '#FF416C' },
    { color1: '#FF9A8B', color2: '#FF6A88' },
  ],
  cold: [
    { color1: '#00C9FF', color2: '#92FE9D' },
    { color1: '#4CA1AF', color2: '#C4E0E5' },
    { color1: '#00B4DB', color2: '#0083B0' },
    { color1: '#1FA2FF', color2: '#12D8FA' },
    { color1: '#2BC0E4', color2: '#EAECC6' },
  ],
  purple: [
    { color1: '#9D50BB', color2: '#6E48AA' },
    { color1: '#8E2DE2', color2: '#4A00E0' },
    { color1: '#7F00FF', color2: '#E100FF' },
    { color1: '#6A1B9A', color2: '#8E24AA' },
    { color1: '#9C27B0', color2: '#E040FB' },
  ],
  yellow: [
    { color1: '#FFF700', color2: '#FFDD00' },
    { color1: '#FFEA00', color2: '#FFD700' },
    { color1: '#FFF200', color2: '#FFCC00' },
    { color1: '#FFFB00', color2: '#FFC300' },
    { color1: '#FFF500', color2: '#FFB900' },
  ],
  forest: [
    { color1: '#228B22', color2: '#32CD32' },
    { color1: '#006400', color2: '#8FBC8F' },
    { color1: '#2E8B57', color2: '#3CB371' },
    { color1: '#556B2F', color2: '#6B8E23' },
    { color1: '#66CDAA', color2: '#8FBC8F' },
  ],
  ocean: [
    { color1: '#1E90FF', color2: '#00BFFF' },
    { color1: '#4682B4', color2: '#5F9EA0' },
    { color1: '#00CED1', color2: '#20B2AA' },
    { color1: '#87CEEB', color2: '#87CEFA' },
    { color1: '#B0E0E6', color2: '#ADD8E6' },
  ],
};

type ThemeKey = keyof typeof themes;

const SkillsSection: React.FC<SkillsSectionProps> = ({ onClose }) => {
  const threeRef = useRef<HTMLDivElement | null>(null);
  const [theme, setTheme] = useState<ThemeKey>('vibrant');

  useEffect(() => {
    if (!threeRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    threeRef.current.appendChild(renderer.domElement);

    const planeGeometry = new THREE.PlaneGeometry(40, 40, 32, 32);
    const planeMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color1: { value: new THREE.Color(themes[theme][0].color1) },
        color2: { value: new THREE.Color(themes[theme][0].color2) },
        color3: { value: new THREE.Color(themes[theme][1].color1) },
        color4: { value: new THREE.Color(themes[theme][1].color2) },
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

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      threeRef.current?.removeChild(renderer.domElement);
    };
  }, [theme]);

  const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTheme(event.target.value as ThemeKey);
  };

  return (
    <div className="fixed inset-0 w-full h-full flex flex-col items-center justify-center bg-black bg-opacity-70 z-50">
      <div ref={threeRef} className="absolute inset-0"></div>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-4">
        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-8 gradient-text" style={{ '--gradient': `linear-gradient(45deg, ${themes[theme][0].color1}, ${themes[theme][0].color2})` } as React.CSSProperties}>
          My Skills
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {skills.map((skill, index) => (
            <div
              key={index}
              className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold gradient-text text-center fade-in"
              style={{ '--gradient': `linear-gradient(45deg, ${themes[theme][0].color1}, ${themes[theme][0].color2})`, animationDelay: `${index * 0.1}s` } as React.CSSProperties}
            >
              {skill}
            </div>
          ))}
        </div>
        <button
          className="absolute top-4 right-4 px-4 py-2 bg-gray-700 text-white rounded-full shadow-lg hover:bg-gray-600 transition"
          onClick={onClose}
        >
          ✕
        </button>
        <div className="absolute top-4 right-20 flex items-center">
          <div className="flex items-center mr-2">
            <svg width="10" height="10" viewBox="0 0 10 10" fill={themes[theme][0].color1} xmlns="http://www.w3.org/2000/svg">
              <circle cx="5" cy="5" r="5" />
            </svg>
            <svg width="14" height="14" viewBox="0 0 14 14" fill={themes[theme][1].color1} xmlns="http://www.w3.org/2000/svg">
              <circle cx="7" cy="7" r="7" />
            </svg>
            <svg width="18" height="18" viewBox="0 0 18 18" fill={themes[theme][2].color1} xmlns="http://www.w3.org/2000/svg">
              <circle cx="9" cy="9" r="9" />
            </svg>
            <svg width="22" height="22" viewBox="0 0 22 22" fill={themes[theme][3].color1} xmlns="http://www.w3.org/2000/svg">
              <circle cx="11" cy="11" r="11" />
            </svg>
          </div>
          <select
            className="px-4 py-2 bg-gray-700 text-white rounded-full shadow-lg hover:bg-gray-600 transition"
            value={theme}
            onChange={handleThemeChange}
          >
            <option value="vibrant">Vibrant</option>
            <option value="warm">Warm Sunset</option>
            <option value="cold">Cool Breeze</option>
            <option value="purple">Purple Haze</option>
            <option value="yellow">Sunny Day</option>
            <option value="forest">Forest Walk</option>
            <option value="ocean">Ocean Wave</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default SkillsSection;