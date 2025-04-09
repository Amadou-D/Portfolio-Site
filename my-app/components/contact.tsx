'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import * as THREE from 'three';

interface ContactMeProps {
  onClose: () => void;
}

const Contact: React.FC<ContactMeProps> = ({ onClose }) => {
  const threeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!threeRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio); // Ensure crisp rendering on high-DPI displays
    threeRef.current.appendChild(renderer.domElement);

    const fragmentShader = `
      uniform float time;
      uniform vec2 resolution;

      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
      }

      // Improved noise function with more turbulence
      float noise(vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);

        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));

        vec2 u = f * f * (3.0 - 2.0 * f);

        return mix(a, b, u.x) +
               (c - a) * u.y * (1.0 - u.x) +
               (d - b) * u.x * u.y;
      }

      // Fractal Brownian Motion for more natural smoke movement
      float fbm(vec2 st) {
        float value = 0.0;
        float amplitude = 0.5;
        float frequency = 1.0;
        // Add multiple layers of noise
        for(int i = 0; i < 5; i++) {
          value += amplitude * noise(st * frequency);
          frequency *= 2.0;
          amplitude *= 0.5;
        }
        return value;
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / resolution.xy;
        vec3 color = vec3(0.1); // Darker base color

        // Create turbulent smoke effect
        float n = fbm(uv * 3.0 + time * 0.1);
        n += 0.5 * fbm(uv * 6.0 + time * 0.15);
        
        // Add swirling motion
        float swirl = fbm(uv * 2.0 + vec2(cos(time * 0.1), sin(time * 0.1)));
        n += swirl * 0.3;

        // Color variation
        vec3 smokeColor = mix(
          vec3(0.2, 0.2, 0.25), // Dark blue-grey
          vec3(0.4, 0.4, 0.45), // Light grey
          n
        );

        // Add slight color variation based on position
        smokeColor += vec3(0.05) * fbm(uv * 4.0 - time * 0.05);

        color += smokeColor;

        // Fade edges
        float edge = smoothstep(0.0, 0.7, 1.0 - length(uv - 0.5) * 1.2);
        
        gl_FragColor = vec4(color, edge * 0.9); // Adjust transparency
      }
    `;

    const vertexShader = `
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `;

    const uniforms = {
      time: { value: 1.0 },
      resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
    });

    const planeGeometry = new THREE.PlaneGeometry(2, 2);
    const plane = new THREE.Mesh(planeGeometry, material);
    scene.add(plane);

    const animate = () => {
      requestAnimationFrame(animate);
      uniforms.time.value += 0.05;
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      threeRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full flex items-center justify-center z-50 overflow-y-auto">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-0"></div>
      <div ref={threeRef} className="absolute inset-0 z-10"></div>
      
      <div className="relative z-20 max-w-3xl mx-auto p-8 bg-gray-900/80 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl text-white text-left mt-20">
        <button
          className="absolute top-4 right-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-colors"
          onClick={onClose}
        >
          ✕
        </button>
        
        <h2 className="text-3xl font-bold mb-6 text-white">Get in Touch</h2>
        
        <div className="space-y-6">
          <div className="flex items-center space-x-3 p-3 bg-white/10 rounded-lg">
            <div className="w-10 h-10 flex items-center justify-center bg-blue-600 rounded-full text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
            <div>
              <h4 className="text-sm text-blue-300 font-medium">Name</h4>
              <p className="text-white text-lg">Amadou Diallo</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-white/10 rounded-lg">
            <div className="w-10 h-10 flex items-center justify-center bg-blue-600 rounded-full text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
            </div>
            <div>
              <h4 className="text-sm text-blue-300 font-medium">Phone</h4>
              <p className="text-white text-lg">587-803-5820</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-white/10 rounded-lg">
            <div className="w-10 h-10 flex items-center justify-center bg-blue-600 rounded-full text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </div>
            <div>
              <h4 className="text-sm text-blue-300 font-medium">Email</h4>
              <p className="text-white text-lg">amadouamosdiallo@outlook.com</p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-white/20">
          <h3 className="text-xl font-semibold mb-4 text-white">Connect with me</h3>
          
          <div className="flex space-x-4">
            <Link
              href="https://github.com/Amadou-D"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Image src="/github.png" alt="GitHub" width={24} height={24} className="w-6 h-6 mr-2" />
              <span className="text-white">GitHub</span>
            </Link>
            
            <Link
              href="https://www.linkedin.com/in/amadou-diallo-7b2326330"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded-lg transition-colors"
            >
              <Image src="/linkedin.png" alt="LinkedIn" width={24} height={24} className="w-6 h-6 mr-2" />
              <span className="text-white">LinkedIn</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;