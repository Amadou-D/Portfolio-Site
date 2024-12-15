'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ProjectsSectionProps {
  onClose: () => void;
}

const projects = [
  { title: 'Project 1', videoSrc: '/path/to/project1.mp4' },
  { title: 'Project 2', videoSrc: '/path/to/project2.mp4' },
];

const ProjectsSection: React.FC<ProjectsSectionProps> = ({ onClose }) => {
  const threeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!threeRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    threeRef.current.appendChild(renderer.domElement);

    const planeGeometry = new THREE.PlaneGeometry(40, 40, 32, 32);
    const planeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    scene.add(plane);

    const animate = () => {
      requestAnimationFrame(animate);
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
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full flex flex-col items-center justify-center bg-black bg-opacity-70 z-50 p-4 overflow-y-auto">
      <div ref={threeRef} className="absolute inset-0"></div>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-4">
        <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-8">
          My Projects
        </h2>
        <div className="flex flex-col space-y-6 overflow-y-scroll h-[70vh]">
          {projects.map((project, index) => (
            <div key={index} className="flex flex-col items-center space-y-4">
              <h3 className="text-2xl font-bold">{project.title}</h3>
              <video
                className="w-full max-w-3xl rounded-lg shadow-lg"
                controls
                src={project.videoSrc}
              />
            </div>
          ))}
        </div>
        <button
          className="absolute top-4 right-4 px-4 py-2 bg-gray-700 text-white rounded-full shadow-lg hover:bg-gray-600 transition"
          onClick={onClose}
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default ProjectsSection;