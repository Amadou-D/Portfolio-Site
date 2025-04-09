'use client';

import { useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTools, faEnvelope, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import * as THREE from 'three';
import RetroGrid from '@/components/ui/retro-grid';
import SkillsSection from '@/components/SkillsSection';
import Contact from '@/components/contact';
import About from '@/components/About';

const CubePage = () => {
  const [showSkills, setShowSkills] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [textToShow, setTextToShow] = useState('designed');
  const [fadeClass, setFadeClass] = useState('fade-in');
  const threeRef = useRef<HTMLDivElement | null>(null);
  const animationFrameId = useRef<number | null>(null);

  const textOptions = ['designed', 'created', 'solved', 'coded', 'developed', 'crafted'];

  // Cycle through text options
  useEffect(() => {
    const interval = setInterval(() => {
      setFadeClass('fade-out');
      setTimeout(() => {
        setTextToShow((prev) => {
          const currentIndex = textOptions.indexOf(prev);
          return textOptions[(currentIndex + 1) % textOptions.length];
        });
        setFadeClass('fade-in');
      }, 1500); // Match the duration of the fade-out animation
    }, 3000); // Change text every 3 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!threeRef.current) return;

    // Set up Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    threeRef.current.appendChild(renderer.domElement);

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1000;
    const positions = new Float32Array(particlesCount * 3);
    const velocities = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;

      velocities[i * 3] = (Math.random() - 0.5) * 0.01;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.01;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.02,
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // Animate particles
    const animate = () => {
      if (showAbout || showSkills || showContact) {
        return;
      }

      animationFrameId.current = requestAnimationFrame(animate);

      const positions = particlesGeometry.attributes.position.array;
      const velocities = particlesGeometry.attributes.velocity.array;

      for (let i = 0; i < particlesCount; i++) {
        positions[i * 3] += velocities[i * 3];
        positions[i * 3 + 1] += velocities[i * 3 + 1];
        positions[i * 3 + 2] += velocities[i * 3 + 2];

        if (positions[i * 3] > 5 || positions[i * 3] < -5) velocities[i * 3] *= -1;
        if (positions[i * 3 + 1] > 5 || positions[i * 3 + 1] < -5) velocities[i * 3 + 1] *= -1;
        if (positions[i * 3 + 2] > 5 || positions[i * 3 + 2] < -5) velocities[i * 3 + 2] *= -1;
      }

      particlesGeometry.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
    };

    // Start animation
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      threeRef.current?.removeChild(renderer.domElement);
    };
  }, [showAbout, showSkills, showContact]);

  const handleStartClick = () => {
    setShowSkills(true);
    if (animationFrameId.current !== null) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
  };

  const handleNavigateToContact = () => {
    setShowContact(true);
    if (animationFrameId.current !== null) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
  };

  const handleNavigateToAbout = () => {
    setShowAbout(true);
    if (animationFrameId.current !== null) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
  };

  const handleCloseSkills = () => {
    setShowSkills(false);
    if (!showAbout && !showContact) {
      const animate = () => {
        if (animationFrameId.current === null && threeRef.current) {
          animationFrameId.current = requestAnimationFrame(animate);
        }
      };
      animate();
    }
  };

  const handleCloseContact = () => {
    setShowContact(false);
    if (!showAbout && !showSkills) {
      const animate = () => {
        if (animationFrameId.current === null && threeRef.current) {
          animationFrameId.current = requestAnimationFrame(animate);
        }
      };
      animate();
    }
  };

  const handleCloseAbout = () => {
    setShowAbout(false);
    if (!showSkills && !showContact) {
      const animate = () => {
        if (animationFrameId.current === null && threeRef.current) {
          animationFrameId.current = requestAnimationFrame(animate);
        }
      };
      animate();
    }
  };

  return (
    <div className="relative w-screen min-h-screen flex flex-col items-center justify-center bg-gray-900 overflow-hidden">
      <RetroGrid gridColor="rgba(255, 255, 255, 1)" />

      {/* Rotating Text and Name */}
      <div className="absolute top-2 left-2 sm:top-4 sm:left-4 flex flex-row items-center space-x-1 sm:space-x-2">
        <div className="flex items-center justify-end text-sm sm:text-lg md:text-xl lg:text-2xl font-semibold text-gray-400 rotating-text min-w-[100px] sm:min-w-[150px] text-right overflow-hidden">
          <p className={fadeClass}>{textToShow}</p>
        </div>
        <p className="text-sm sm:text-lg md:text-xl lg:text-2xl font-bold text-white name-text">
          by Amadou
        </p>
      </div>

      {/* Three.js Animation */}
      <div ref={threeRef} className="absolute inset-0 pointer-events-none"></div>

      <div className="mt-16 sm:mt-20 text-center text-white px-4 sm:px-6 md:px-8 lg:px-10 xl:px-16 min-w-[250px] sm:min-w-[300px] md:min-w-[400px] lg:min-w-[500px] xl:min-w-[600px]">
        <div className="flex flex-col space-y-4 sm:space-y-6">
          <button
            className="mt-4 sm:mt-6 px-12 sm:px-24 py-4 sm:py-6 text-sm sm:text-lg md:text-xl lg:text-2xl font-extrabold text-white rounded-lg hover:text-gray-400 transition-all duration-300 flex items-center justify-center space-x-4"
            onClick={handleStartClick}
          >
            <FontAwesomeIcon icon={faTools} />
            <span>Projects</span>
          </button>
          <button
            className="mt-4 sm:mt-6 px-12 sm:px-24 py-4 sm:py-6 text-sm sm:text-lg md:text-xl lg:text-2xl font-extrabold text-white rounded-lg hover:text-gray-400 transition-all duration-300 flex items-center justify-center space-x-4"
            onClick={handleNavigateToContact}
          >
            <FontAwesomeIcon icon={faEnvelope} />
            <span>Contact</span>
          </button>
          <button
            className="mt-4 sm:mt-6 px-12 sm:px-24 py-4 sm:py-6 text-sm sm:text-lg md:text-xl lg:text-2xl font-extrabold text-white rounded-lg hover:text-gray-400 transition-all duration-300 flex items-center justify-center space-x-4"
            onClick={handleNavigateToAbout}
          >
            <FontAwesomeIcon icon={faInfoCircle} />
            <span>About</span>
          </button>
        </div>
      </div>

      {showSkills && <SkillsSection onClose={handleCloseSkills} />}
      {showContact && <Contact onClose={handleCloseContact} />}
      {showAbout && <About onClose={handleCloseAbout} />}
    </div>
  );
};

export default CubePage;