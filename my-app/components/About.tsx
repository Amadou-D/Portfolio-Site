'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';

interface AboutProps {
  onClose: () => void;
}

const tabItems = [
  { id: 'profile', label: 'Profile' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
  { id: 'personal', label: 'Personal' }
];

const About: React.FC<AboutProps> = ({ onClose }) => {
  const threeRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!threeRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    threeRef.current.appendChild(renderer.domElement);

    const fragmentShader = `
      uniform float time;
      uniform vec2 resolution;

      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
      }

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

      float fbm(vec2 st) {
        float value = 0.0;
        float amplitude = 0.5;
        float frequency = 1.0;
        for(int i = 0; i < 5; i++) {
          value += amplitude * noise(st * frequency);
          frequency *= 2.0;
          amplitude *= 0.5;
        }
        return value;
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / resolution.xy;
        vec3 color = vec3(0.1);

        float n = fbm(uv * 3.0 + time * 0.1);
        n += 0.5 * fbm(uv * 6.0 + time * 0.15);
        
        float swirl = fbm(uv * 2.0 + vec2(cos(time * 0.1), sin(time * 0.1)));
        n += swirl * 0.3;

        vec3 smokeColor = mix(
          vec3(0.2, 0.2, 0.25),
          vec3(0.4, 0.4, 0.45),
          n
        );

        smokeColor += vec3(0.05) * fbm(uv * 4.0 - time * 0.05);

        color += smokeColor;

        float edge = smoothstep(0.0, 0.7, 1.0 - length(uv - 0.5) * 1.2);
        
        gl_FragColor = vec4(color, edge * 0.9);
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
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 w-full h-full flex items-center justify-center z-[100] p-4"
    >
      <div className="absolute inset-0 bg-gray-900 bg-opacity-70 backdrop-blur-sm z-0"></div>
      <div ref={threeRef} className="absolute inset-0 z-10"></div>
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="relative z-20 w-full max-w-5xl mx-auto bg-white/80 backdrop-blur-lg rounded-xl shadow-2xl overflow-hidden"
      >
        {/* Header with photo and name */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between">
          <div className="flex items-center mb-4 sm:mb-0">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-3xl font-bold border-2 border-white/40">
              AD
            </div>
            <div className="ml-4 text-white">
              <h2 className="text-2xl sm:text-3xl font-bold">Amadou Diallo</h2>
              <p className="text-lg sm:text-xl opacity-90">Software Developer</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Tabs navigation */}
        <div className="bg-gray-100 border-b border-gray-200 overflow-x-auto">
          <div className="flex">
            {tabItems.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm sm:text-base font-medium whitespace-nowrap transition-colors duration-200 relative
                  ${activeTab === tab.id 
                    ? 'text-blue-600 bg-white' 
                    : 'text-gray-600 hover:text-blue-500 hover:bg-white/50'
                  }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" 
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content area */}
        <div ref={contentRef} className="p-6 sm:p-8 max-h-[60vh] overflow-y-auto">
          {/* Profile */}
          {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                  Professional Profile
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Graduating with a 4.0 GPA from SAIT&apos;s Software Development program, I have built a strong foundation in information technology and software development. My passion for IT drove me to further my education after high school, expanding my expertise in programming, web development, and cybersecurity. My professional experience as an online consultant and live performer has equipped me with strong communication skills and the ability to analyze and convey complex technical concepts effectively. I am dedicated to contributing to the evolving fields of software development, IT, and cybersecurity, leveraging my technical skills, creativity, and commitment to continuous learning.
                </p>
              </div>
            </motion.div>
          )}

          {/* Skills */}
          {activeTab === 'skills' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                  Skills Summary
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h4 className="font-bold text-lg text-gray-800 mb-2">Technical Skills</h4>
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                      <li>Intermediate-level IT skills in computer programming, problem-solving, network systems, cloud services, and Windows/Linux operating systems</li>
                      <li><span className="font-bold">Programming languages:</span> Python, Java, and C#</li>
                      <li><span className="font-bold">Web development:</span> HTML, CSS, JavaScript, React, Next.js, SQL, MongoDB</li>
                    </ul>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h4 className="font-bold text-lg text-gray-800 mb-2">Professional Skills</h4>
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                      <li>Time management skills and a methodical approach to managing projects and deadlines</li>
                      <li>Creative problem-solving in user experience, software development, and cybersecurity</li>
                      <li>Motivated to stay up to date with the latest technologies and industry trends</li>
                      <li>Attention to detail and commitment to accuracy and quality</li>
                      <li>Exceptional verbal and written communication skills</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Experience */}
          {activeTab === 'experience' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                  Professional Experience
                </h3>
                <div className="space-y-6">
                  <div className="relative pl-6 border-l-2 border-blue-500">
                    <div className="absolute -left-2 top-1 w-4 h-4 bg-blue-500 rounded-full"></div>
                    <div className="mb-1 text-xl font-bold text-gray-800">Web Developer</div>
                    <div className="text-blue-600 font-medium">5 Oceans Immigration | May 2024 - January 2025</div>
                    <ul className="mt-3 list-disc list-inside text-gray-700 space-y-1">
                      <li>Developed and maintained a full-stack web application using JavaScript, MongoDB, and Next.js, enhancing user experience and functionality</li>
                      <li>Collaborated with cross-functional teams to gather requirements and deliver solutions aligned with client needs</li>
                      <li>Implemented responsive design principles, ensuring applications are user-friendly across various devices</li>
                      <li>Utilized version control systems for efficient project management and collaboration</li>
                      <li>Actively participated in code reviews and team meetings, contributing to an agile development environment</li>
                    </ul>
                  </div>
                  
                  <div className="relative pl-6 border-l-2 border-blue-500">
                    <div className="absolute -left-2 top-1 w-4 h-4 bg-blue-500 rounded-full"></div>
                    <div className="mb-1 text-xl font-bold text-gray-800">Live Performer/Entertainer</div>
                    <div className="text-blue-600 font-medium">Dec 2012 - Oct 2023</div>
                    <ul className="mt-3 list-disc list-inside text-gray-700 space-y-1">
                      <li>Performed in multiple live bands as a percussionist</li>
                      <li>Gained practical communication skills by collaborating with other musicians to create captivating performances</li>
                      <li>Built active listening and non-verbal communication skills by working in a team-like setting to create live music</li>
                    </ul>
                  </div>
                  
                  <div className="relative pl-6 border-l-2 border-blue-500">
                    <div className="absolute -left-2 top-1 w-4 h-4 bg-blue-500 rounded-full"></div>
                    <div className="mb-1 text-xl font-bold text-gray-800">Self-Employed/Online Consultant</div>
                    <div className="text-blue-600 font-medium">June 2014 - Sept 2018</div>
                    <ul className="mt-3 list-disc list-inside text-gray-700 space-y-1">
                      <li>Effectively communicated and provided comprehensive insights to clients regarding diverse computer technologies and gaming-related content</li>
                      <li>Fostered trust and cultivated strong professional relationships with stakeholders</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Education */}
          {activeTab === 'education' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                  Education
                </h3>
                <div className="space-y-6">
                  <div className="relative pl-6 border-l-2 border-blue-500">
                    <div className="absolute -left-2 top-1 w-4 h-4 bg-blue-500 rounded-full"></div>
                    <div className="mb-1 text-xl font-bold text-gray-800">Information Technology Diploma</div>
                    <div className="text-blue-600 font-medium">Southern Alberta Institute of Technology (SAIT), Calgary, AB</div>
                    <div className="text-gray-600 mt-1">Software Development major | 4.0 GPA | May 2023 - Dec 2024</div>
                  </div>
                  
                  <div className="relative pl-6 border-l-2 border-blue-500">
                    <div className="absolute -left-2 top-1 w-4 h-4 bg-blue-500 rounded-full"></div>
                    <div className="mb-1 text-xl font-bold text-gray-800">High School Diploma</div>
                    <div className="text-blue-600 font-medium">Bowness Outreach High School</div>
                    <div className="text-gray-600 mt-1">Sept 2018 - June 2022</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Personal */}
          {activeTab === 'personal' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                  Personal Interests
                </h3>
                <div className="bg-white rounded-lg shadow-sm p-5">
                  <p className="text-gray-700 mb-4">In my free time, I enjoy:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <div className="text-blue-500 text-4xl mb-2">🎵</div>
                      <div className="font-medium">Making Music</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <div className="text-blue-500 text-4xl mb-2">🧩</div>
                      <div className="font-medium">Problem Solving</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <div className="text-blue-500 text-4xl mb-2">🎮</div>
                      <div className="font-medium">Playing Video Games</div>
                    </div>
                  </div>
                </div>
                
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mt-8 mb-4 pb-2 border-b border-gray-200">
                  References
                </h3>
                <p className="text-gray-700">Available upon request.</p>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default About;