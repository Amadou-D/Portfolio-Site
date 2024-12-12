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
    { color1: '#FF4B2B', color2: '#8E24AA' }, // Pink and Purple
    { color1: '#FF4B2B', color2: '#8E24AA' }, // Pink and Purple
  ],
  warm: [
    { color1: '#FF7E5F', color2: '#FEB47B' },
    { color1: '#FF6F61', color2: '#DE4313' },
  ],
  cold: [
    { color1: '#00C9FF', color2: '#92FE9D' },
    { color1: '#4CA1AF', color2: '#C4E0E5' },
  ],
  purple: [
    { color1: '#9D50BB', color2: '#6E48AA' },
    { color1: '#8E2DE2', color2: '#4A00E0' },
  ],
  yellow: [
    { color1: '#FFF700', color2: '#FFDD00' },
    { color1: '#FFEA00', color2: '#FFD700' },
  ],
  forest: [
    { color1: '#228B22', color2: '#32CD32' },
    { color1: '#006400', color2: '#8FBC8F' },
  ],
  ocean: [
    { color1: '#1E90FF', color2: '#00BFFF' },
    { color1: '#4682B4', color2: '#5F9EA0' },
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

  useEffect(() => {
    const randomColors = themes[theme][Math.floor(Math.random() * themes[theme].length)];
    document.documentElement.style.setProperty('--gradient-colors', `linear-gradient(45deg, ${randomColors.color1}, ${randomColors.color2})`);
  }, [theme]);

  const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTheme(event.target.value as ThemeKey);
  };

  return (
    <div className="fixed inset-0 w-full h-full flex flex-col items-center justify-center bg-black bg-opacity-70 z-50">
      <div ref={threeRef} className="absolute inset-0"></div>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-4">
        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-8 gradient-text">
          My Skills
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {skills.map((skill, index) => (
            <div
              key={index}
              className={`text-lg sm:text-xl md:text-2xl lg:text-3xl font-['Press Start 2P'] gradient-text text-center fade-in ${skill === 'Firebase' ? 'col-span-2 sm:col-span-1' : ''}`}
              style={{ animationDelay: `${index * 0.1}s` }}
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
          <div className="flex items-center mr-2 space-x-2">
            <div className="dot" style={{ '--color1': themes[theme][0].color1, '--color2': themes[theme][0].color2, width: '10px', height: '10px' } as React.CSSProperties}></div>
            <div className="dot" style={{ '--color1': themes[theme][1].color1, '--color2': themes[theme][1].color2, width: '15px', height: '15px' } as React.CSSProperties}></div>
          </div>
          <select
            className="px-4 py-2 bg-gray-700 text-white rounded-full shadow-lg hover:bg-gray-600 transition"
            value={theme}
            onChange={handleThemeChange}
          >
            <option value="vibrant">Vibrant</option>
            <option value="warm">Warm</option>
            <option value="cold">Cool</option>
            <option value="purple">Purple</option>
            <option value="yellow">Sunny</option>
            <option value="forest">Forest</option>
            <option value="ocean">Ocean</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default SkillsSection;