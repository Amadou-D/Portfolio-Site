'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import * as THREE from 'three';
import { useRouter } from 'next/navigation';

const projects = [
  { title: '5 Oceans Immigration -  A Full stack Web Application I made for a Client', videoSrc: '/5oceans.mp4', url: 'https://5-oceans-immigration-amadou-diallos-projects.vercel.app/homepage' },
  { title: 'Khazad Tech - an example e-commerce Site I made', videoSrc: '/tech.mp4', url: 'https://webdev2-final-project-sooty.vercel.app' },
  { title: 'Music Visualizer - An Audio to Visual Tool', videoSrc: '/music_visualizer.mp4', url: 'https://music-visualizeer.vercel.app' },
  { title: 'Pokehub - Pokémon TCG Dex', videoSrc: '/pokemon.mp4', url: 'https://amadou-d.github.io/Pokehub/' },
];

export default function ProjectsPage() {
  const router = useRouter();
  const threeRef = useRef<HTMLDivElement | null>(null);

  // Setup animation styles
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

  // Three.js background effect setup
  useEffect(() => {
    if (!threeRef.current) return;
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: false
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    // Set lower pixel ratio for better performance
    const isMobile = window.innerWidth < 768;
    renderer.setPixelRatio(isMobile ? 0.75 : 1);
    
    threeRef.current.appendChild(renderer.domElement);

    // Use the original fragment shader for smoke effect
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

    // FPS limiting for better performance
    let lastTime = 0;
    const fps = isMobile ? 20 : 30;
    const fpsInterval = 1000 / fps;
    
    const animate = (timestamp: number) => {
      requestAnimationFrame(animate);
      
      // Throttle FPS
      const elapsed = timestamp - lastTime;
      if (elapsed < fpsInterval) return;
      lastTime = timestamp - (elapsed % fpsInterval);
      
      uniforms.time.value += 0.05;
      renderer.render(scene, camera);
    };

    requestAnimationFrame(animate);

    // Video lazy loading and play handling
    const handleScroll = () => {
      const videos = document.querySelectorAll('video');
      videos.forEach((video) => {
        const rect = video.getBoundingClientRect();
        if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
          setTimeout(() => {
            video.play().catch(() => {});
          }, 100);
        } else {
          video.pause();
        }
      });
    };

    const handleVideoEnd = (event: Event) => {
      const video = event.target as HTMLVideoElement;
      video.currentTime = 0;
      video.play().catch(() => {});
    };

    const videos = document.querySelectorAll('video');
    videos.forEach((video) => {
      video.addEventListener('ended', handleVideoEnd);
    });

    window.addEventListener('scroll', handleScroll);
    // Initial check for visible videos
    setTimeout(handleScroll, 100);

    // Resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      videos.forEach((video) => {
        video.removeEventListener('ended', handleVideoEnd);
      });
      renderer.dispose();
      if (threeRef.current?.contains(renderer.domElement)) {
        threeRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gray-900 bg-opacity-90 z-0"></div>
      <div ref={threeRef} className="absolute inset-0 z-10"></div>
      
      <div className="relative z-20 pt-16 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold">My Projects</h1>
          <button
              onClick={() => router.push('/')}
              className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-all"
              aria-label="Go back home"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-16">
          {projects.map((project, index) => (
            <div
              key={index}
              className="flex flex-col space-y-4 opacity-0"
              style={{ animation: `fadeInUp 0.5s ease-out ${index * 0.5}s forwards` }}
            >
              <Link href={project.url} target="_blank" rel="noopener noreferrer">
                <h3 className="text-xl md:text-2xl font-bold hover:text-blue-400 transition-colors">
                  {project.title}
                </h3>
              </Link>
              
              <Link href={project.url} target="_blank" rel="noopener noreferrer">
                <div className="video-container rounded-lg overflow-hidden border-2 border-gray-700 hover:border-gray-500 transition-colors">
                  <video
                    className="w-full aspect-video object-cover rounded-lg"
                    src={project.videoSrc}
                    muted
                    loop
                    playsInline
                    poster={`${project.videoSrc.replace('.mp4', '-thumbnail.jpg')}`}
                    aria-label={`${project.title} video`}
                    preload="none"
                    onLoadedData={(event) => {
                      const video = event.target as HTMLVideoElement;
                      if (video.getBoundingClientRect().top < window.innerHeight) {
                        setTimeout(() => {
                          video.play().catch(() => {});
                        }, 100);
                      }
                    }}
                  />
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
