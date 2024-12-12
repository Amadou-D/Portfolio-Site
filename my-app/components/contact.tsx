'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import * as THREE from 'three';

interface AboutMeProps {
  onClose: () => void;
}

const Contact: React.FC<AboutMeProps> = ({ onClose }) => {
  const threeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!threeRef.current) return;

    // THREE.js Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    threeRef.current.appendChild(renderer.domElement);

    // Particle Background
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 5000;
    const positions = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 20;
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particlesMaterial = new THREE.PointsMaterial({ color: '#ffffff', size: 0.05 });
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    const animate = () => {
      requestAnimationFrame(animate);
      particles.rotation.y += 0.001;
      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
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
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-black z-50 overflow-y-auto">
      <div ref={threeRef} className="absolute inset-0"></div>
      <div className="relative z-10 max-w-3xl mx-auto p-8 bg-white/10 backdrop-blur-lg rounded-lg shadow-lg text-gray-100 text-left">
        <button
          className="absolute top-4 right-4 px-4 py-2 bg-gray-700 text-white rounded-full shadow-lg hover:bg-gray-600 transition"
          onClick={onClose}
        >
          ✕
        </button>
        <h2 className="text-3xl font-bold mb-6">Contact</h2>
        <div className="space-y-4">
          <p>Name: Amadou Diallo</p>
          <p>Phone: 587-803-5820</p>
          <p>Email: amadouamosdiallo@outlook.com</p>
          <p className="flex items-center">
            <span className="mr-2">Connect with me on:</span>
            <Link href="https://github.com/Amadou-D" target="_blank" rel="noopener noreferrer" className="underline flex items-center">
              <Image src="/github.png" alt="GitHub" width={24} height={24} className="w-6 h-6 mr-2" />
              <p className='hover:text-stone-300'>
              Github
              </p>
            </Link>
            <Link href="https://qr.me-qr.com/rx78tODH" target="_blank" rel="noopener noreferrer" className="underline flex items-center ml-4">
              <Image src="/linkedin.png" alt="LinkedIn" width={24} height={24} className="w-6 h-6 mr-2" />
              <p className='hover:text-stone-300'>
              LinkedIn
              </p>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact;