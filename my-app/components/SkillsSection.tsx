'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import * as THREE from 'three';

interface ProjectsSectionProps {
  onClose: () => void;
}

const projects = [
  { title: '5 Oceans Immigration -  A Full stack web application for a client', videoSrc: '/5oceans.mp4', url: 'https://5oceansimmigration.tech' },
  { title: 'Khazad Tech - an example e-commerce Site I made', videoSrc: '/tech.mp4', url: 'https://webdev2-final-project-sooty.vercel.app' },
  { title: 'Music Visualizer', videoSrc: '/music_visualizer.mp4', url: 'https://music-visualizeer.vercel.app' },
];

const ProjectsSection: React.FC<ProjectsSectionProps> = ({ onClose }) => {
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

  useEffect(() => {
    const handleScroll = () => {
      const videos = document.querySelectorAll('video');
      videos.forEach((video) => {
        const rect = video.getBoundingClientRect();
        if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
          setTimeout(() => {
            video.play();
          }, 100); // Add a slight delay before playing the video
        } else {
          video.pause();
        }
      });
    };

    const handleVideoEnd = (event: Event) => {
      const video = event.target as HTMLVideoElement;
      video.currentTime = 0;
      video.play();
    };

    const handleVideoLoaded = (event: Event) => {
      const video = event.target as HTMLVideoElement;
      setTimeout(() => {
        video.play();
      }, 100); // Add a slight delay before playing the video
    };

    const videos = document.querySelectorAll('video');
    videos.forEach((video) => {
      video.addEventListener('ended', handleVideoEnd);
      video.addEventListener('loadeddata', handleVideoLoaded);
    });

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      videos.forEach((video) => {
        video.removeEventListener('ended', handleVideoEnd);
        video.removeEventListener('loadeddata', handleVideoLoaded);
      });
    };
  }, []);

  useEffect(() => {
    const styles = `
      @keyframes fadeInUp {
        0% {
          opacity: 0;
          transform: translateY(10px);
        }
        100% {
          opacity: 1;
          transform: translateY(0);
        }
      }
      .video-container {
        transition: transform 0.3s ease;
      }
      .video-container:hover {
        transform: scale(1.05);
      }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full flex flex-col items-center justify-center z-50 p-4 overflow-y-auto">
      <div ref={threeRef} className="absolute inset-0 z-0"></div>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-200 text-center p-4 z-10">
        <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-8">My Projects</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 overflow-y-scroll h-[70vh]">
          {projects.map((project, index) => (
            <div
              key={index}
              className="flex flex-col items-center space-y-4 opacity-0 transform translate-y-10 transition-opacity duration-500 ease-out"
              style={{ animation: `fadeInUp 0.5s ease-out ${index * 0.5}s forwards` }}
            >
              <Link href={project.url} target="_blank" rel="noopener noreferrer">
                <h3 className="text-2xl font-bold cursor-pointer hover:text-white hover:underline">{project.title}</h3>
              </Link>
              <div className="video-container w-full max-w-3xl rounded-lg shadow-lg border-2 border-gray-200">
                <video
                  className="w-full h-full rounded-lg"
                  src={project.videoSrc}
                  muted
                  loop
                  playsInline
                  aria-label={`${project.title} video`}
                  onLoadedData={(event) => {
                    const video = event.target as HTMLVideoElement;
                    setTimeout(() => {
                      video.play();
                    }, 100); // Add a slight delay before playing the video
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        <button
          className="absolute top-4 right-4 px-4 py-2 bg-gray-700 text-white rounded-full shadow-lg hover:bg-gray-600 transition"
          onClick={onClose}
          aria-label="Close projects section"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default ProjectsSection;