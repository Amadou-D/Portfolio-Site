'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface AboutMeProps {
  onClose: () => void;
}

const AboutMe: React.FC<AboutMeProps> = ({ onClose }) => {
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
    const planeMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color1: { value: new THREE.Color('#FF4B2B') },
        color2: { value: new THREE.Color('#8E24AA') },
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
        varying vec2 vUv;
        void main() {
          float dist = distance(vUv, vec2(0.5, 0.5));
          float ripple = sin(dist * 6.0 - time * 2.0); // Slower ripple effect
          vec3 color = mix(color1, color2, ripple);
          gl_FragColor = vec4(color, 1.0);
        }
      `,
      wireframe: true,
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    scene.add(plane);

    const animate = () => {
      requestAnimationFrame(animate);
      planeMaterial.uniforms.time.value += 0.005; // Slower animation
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
    <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-black bg-opacity-70 z-50 overflow-y-auto">
      <div ref={threeRef} className="absolute inset-0"></div>
      <div className="relative z-10 max-w-4xl mx-auto p-6 bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg shadow-lg text-white text-left overflow-y-auto max-h-full">
        <button
          className="absolute top-4 right-4 px-4 py-2 bg-gray-700 text-white rounded-full shadow-lg hover:bg-gray-600 transition"
          onClick={onClose}
        >
          ✕
        </button>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 gradient-text animate-fade-in">
          About Me
        </h2>
        <div className="text-base sm:text-lg md:text-xl font-['Roboto'] text-gray-200 space-y-4 animate-fade-in">
          <p>Amadou Diallo</p>
          <p>4301 A, Calgary, 70 st Nw</p>
          <p>587-803-5820</p>
          <p>Email: amadouamosdiallo@outlook.com</p>
          <p>Portfolio: <a href="https://amadou-d.github.io/" target="_blank" className="text-blue-400">https://amadou-d.github.io/</a></p>
          <h3 className="mt-6 text-2xl font-bold">Professional Profile</h3>
          <p>
            Passionate about IT and software development, I enrolled in SAIT’s software development program to broaden my horizons. With experience as an online consultant and live performer, I have honed effective communication skills and a deep understanding of technical concepts.
          </p>
          <h3 className="mt-6 text-2xl font-bold">Skills Summary</h3>
          <ul className="list-disc list-inside space-y-2">
            <li>Proficient in IT skills: programming, problem-solving, network systems, cloud services, and Windows/Linux OS.</li>
            <li>Programming languages: Python and Java</li>
            <li>Web development: HTML, CSS, and Javascript</li>
            <li>Time management and creative problem-solving skills</li>
            <li>Motivated to stay updated with the latest technologies</li>
            <li>Attention to detail and exceptional communication skills</li>
          </ul>
          <h3 className="mt-6 text-2xl font-bold">Professional Experience</h3>
          <h4 className="mt-4 text-xl font-bold">Web Developer</h4>
          <p>5 Oceans Immigration, May 2024 - Present</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Developed and maintained a full-stack web application using JavaScript, MongoDB, and Next.js.</li>
            <li>Collaborated with cross-functional teams to deliver client solutions.</li>
            <li>Implemented responsive design principles for user-friendly applications.</li>
            <li>Utilized version control systems for efficient project management.</li>
            <li>Participated in code reviews and team meetings in an agile environment.</li>
          </ul>
          <h4 className="mt-4 text-xl font-bold">Live Performer/ Entertainer</h4>
          <p>Dec 2012 - Oct 2023</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Performed in multiple live bands as a percussionist.</li>
            <li>Gained practical communication skills by collaborating with other musicians.</li>
            <li>Built active listening and non-verbal communication skills.</li>
          </ul>
          <h4 className="mt-4 text-xl font-bold">Self Employed / Online Consultant</h4>
          <p>June 2014 - September 2018</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Provided comprehensive insights to clients regarding diverse computer technologies and gaming-related content.</li>
          </ul>
          <h3 className="mt-6 text-2xl font-bold">Education</h3>
          <h4 className="mt-4 text-xl font-bold">Southern Alberta Institute of Technology (SAIT), Calgary, AB</h4>
          <p>Anticipated graduation Dec 2024</p>
          <p>Information Technology Diploma (Software Development major)</p>
          <h4 className="mt-4 text-xl font-bold">Bowness Outreach (Highschool)</h4>
          <p>Sept 2018 - Jun 2022</p>
          <p>High School Diploma</p>
        </div>
      </div>
    </div>
  );
};

export default AboutMe;