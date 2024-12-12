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
          float ripple = sin(dist * 12.0 - time * 4.0);
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
      planeMaterial.uniforms.time.value += 0.01;
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
      <div className="relative z-10 max-w-4xl mx-auto p-6 bg-gray-800 bg-opacity-90 rounded-lg shadow-lg text-white text-left overflow-y-auto">
        <button
          className="absolute top-4 right-4 px-4 py-2 bg-gray-700 text-white rounded-full shadow-lg hover:bg-gray-600 transition"
          onClick={onClose}
        >
          ✕
        </button>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 gradient-text">
          About Me
        </h2>
        <div className="text-base sm:text-lg md:text-xl font-['Roboto'] text-gray-200 space-y-4">
          <p>Amadou Diallo</p>
          <p>4301 A, Calgary, 70 st Nw</p>
          <p>587-803-5820</p>
          <p>Email: amadouamosdiallo@outlook.com</p>
          <p>Portfolio: <a href="https://amadou-d.github.io/" target="_blank" className="text-blue-400">https://amadou-d.github.io/</a></p>
          <h3 className="mt-6 text-2xl font-bold">Professional Profile</h3>
          <p>
            Due to my passion for information technology and software development, I decided to further my education in this field after successfully achieving my high school diploma. Hence, I decided to enroll in SAIT’s software development program to broaden my horizons in the IT field. Having worked as an online consultant and live performer, I have honed effective communication skills that have allowed me to analyze and convey a variety of technical concepts concisely. I firmly believe that strong communication skills, combined with a deep understanding of technical concepts, are invaluable assets in the field of information technology. With my skills continuing to grow throughout my education at SAIT, I am confident in my ability to contribute to the ever-changing fields of software development, cybersecurity, and IT as a whole.
          </p>
          <h3 className="mt-6 text-2xl font-bold">Skills Summary</h3>
          <ul className="list-disc list-inside space-y-2">
            <li>Proficient in Intermediate-level IT skills in computer programming, problem-solving, network systems, cloud services, and Windows/Linux operating systems.</li>
            <li>Programming languages: Python and Java</li>
            <li>Web development: HTML, CSS, and Javascript</li>
            <li>Time management skills: methodical approach when managing projects, work-related tasks, and deadlines.</li>
            <li>The ability to think creatively to design and develop solutions related to user experience, software development, and cybersecurity.</li>
            <li>Motivated to stay up to date with the latest technologies and industry trends to continuously enhance my skills.</li>
            <li>Attention to detail: Committed to providing accuracy and quality in all tasks.</li>
            <li>Exceptional verbal, and written communication skills.</li>
          </ul>
          <h3 className="mt-6 text-2xl font-bold">Professional Experience</h3>
          <h4 className="mt-4 text-xl font-bold">Web Developer</h4>
          <p>5 Oceans Immigration, May 2024 - Present</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Developed and maintained a full-stack web application using JavaScript, MongoDB, and Next.js, enhancing user experience and functionality.</li>
            <li>Collaborated with cross-functional teams to gather requirements and deliver solutions aligned with client needs.</li>
            <li>Implemented responsive design principles, ensuring applications are user-friendly across various devices.</li>
            <li>Utilized version control systems for efficient project management and collaboration.</li>
            <li>Actively participated in code reviews and team meetings, contributing to an agile development environment.</li>
          </ul>
          <h4 className="mt-4 text-xl font-bold">Live Performer/ Entertainer</h4>
          <p>Dec 2012 - Oct 2023</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Performed in multiple live bands as a percussionist.</li>
            <li>Gained practical communication skills by collaborating with other musicians to create captivating performances.</li>
            <li>Built active listening and non-verbal communication skills by working in a team-like setting to create live music.</li>
          </ul>
          <h4 className="mt-4 text-xl font-bold">Self Employed / Online Consultant</h4>
          <p>June 2014 - September 2018</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Effectively communicated and provided comprehensive insights to clients regarding diverse computer technologies and gaming-related content, fostering trust and cultivating strong professional relationships with stakeholders.</li>
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