'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface AboutProps {
  onClose: () => void;
  navigateToMain: () => void;
}

const About: React.FC<AboutProps> = ({ onClose }) => {
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
    <div className="fixed inset-0 w-full h-full flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div ref={threeRef} className="absolute inset-0 z-0"></div>
      <div className="relative z-10 max-w-3xl mx-auto p-8 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg text-gray-800 text-left mt-24 overflow-y-auto max-h-full">
        <button
          className="absolute top-4 right-4 p-2 bg-gray-300 text-gray-800 rounded-full shadow-lg hover:bg-gray-400 transition"
          onClick={onClose}
        >
          <img src="https://img.icons8.com/ios-filled/50/000000/close-window.png" alt="Close" className="w-6 h-6" />
        </button>
      
        <h2 className="text-3xl font-bold mb-6">About Me</h2>
        <p>Amadou Diallo</p>
        <p>4301 A Calgary, 70 st Nw</p>
        <p>587-803-5820</p>
        <p>Email: amadouamosdiallo@outlook.com</p>
        <p>Portfolio: <a href="https://amadou-d-github-io.vercel.app" target="_blank" rel="noopener noreferrer" className="underline text-blue-600">amadou-d-github-io.vercel.app</a></p>
        <h3 className="text-2xl font-bold mt-6">Professional Profile</h3>
        <p>Graduating with a 4.0 GPA from SAIT’s Software Development program, I have built a strong foundation in information technology and software development. My passion for IT drove me to further my education after high school, expanding my expertise in programming, web development, and cybersecurity. My professional experience as an online consultant and live performer has equipped me with strong communication skills and the ability to analyze and convey complex technical concepts effectively. I am dedicated to contributing to the evolving fields of software development, IT, and cybersecurity, leveraging my technical skills, creativity, and commitment to continuous learning.</p>
        <h3 className="text-2xl font-bold mt-6">Skills Summary</h3>
        <ul className="list-disc list-inside">
          <li>Proficient in Intermediate-level IT skills in computer programming, problem-solving, network systems, cloud services, and Windows/Linux operating systems.</li>
          <li>Programming languages: Python, Java, and C#</li>
          <li>Web development: HTML, CSS, and Javascript, Nextjs, SQL</li>
          <li>Time management skills: methodical approach when managing projects, work-related tasks, and deadlines.</li>
          <li>The ability to think creatively to design and develop solutions related to user experience, software development, and cybersecurity.</li>
          <li>Motivated to stay up to date with the latest technologies and industry trends to continuously enhance my skills.</li>
          <li>Attention to detail: Committed to providing accuracy and quality in all tasks.</li>
          <li>Exceptional verbal, and written communication skills.</li>
        </ul>
        <h3 className="text-2xl font-bold mt-6">Professional Experience</h3>
        <h4 className="text-xl font-bold">Web Developer</h4>
        <p>5 Oceans Immigration</p>
        <p>May 2024 - Present</p>
        <ul className="list-disc list-inside">
          <li>Developed and maintained a full-stack web application using JavaScript, MongoDB, and Next.js, enhancing user experience and functionality.</li>
          <li>Collaborated with cross-functional teams to gather requirements and deliver solutions aligned with client needs.</li>
          <li>Implemented responsive design principles, ensuring applications are user-friendly across various devices.</li>
          <li>Utilized version control systems for efficient project management and collaboration.</li>
          <li>Actively participated in code reviews and team meetings, contributing to an agile development environment.</li>
        </ul>
        <h4 className="text-xl font-bold">Live Performer/ Entertainer</h4>
        <p>Dec 2012 - Oct 2023</p>
        <ul className="list-disc list-inside">
          <li>Performed in multiple live bands as a percussionist.</li>
          <li>Gained practical communication skills by collaborating with other musicians to create captivating performances.</li>
          <li>Built active listening and non-verbal communication skills by working in a team-like setting to create live music.</li>
        </ul>
        <h4 className="text-xl font-bold">Self Employed / Online Consultant</h4>
        <p>June 2014 - September 2018</p>
        <ul className="list-disc list-inside">
          <li>Effectively communicated and provided comprehensive insights to clients regarding diverse computer technologies and gaming-related content, fostering trust and cultivating strong professional relationships with stakeholders.</li>
        </ul>
        <h3 className="text-2xl font-bold mt-6">Education</h3>
        <h4 className="text-xl font-bold">Southern Alberta Institute of Technology (SAIT), Calgary, AB</h4>
        <p>Graduated May 2023 - Dec 2024 (4.0 GPA)</p>
        <p>Information Technology Diploma (Software Development major)</p>
        <h4 className="text-xl font-bold">Bowness Outreach (Highschool)</h4>
        <p>Sept 2018 - Jun 2022</p>
        <p>High School Diploma</p>
      </div>
    </div>
  );
};

export default About;