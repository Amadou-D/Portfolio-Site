'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';

export default function ContactPage() {
  const router = useRouter();
  const threeRef = useRef<HTMLDivElement | null>(null);
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

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
    
    const isMobile = window.innerWidth < 768;
    renderer.setPixelRatio(isMobile ? 0.75 : 1);
    
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

    let lastTime = 0;
    const fps = isMobile ? 20 : 30;
    const fpsInterval = 1000 / fps;
    
    const animate = (timestamp) => {
      requestAnimationFrame(animate);
      
      const elapsed = timestamp - lastTime;
      if (elapsed < fpsInterval) return;
      lastTime = timestamp - (elapsed % fpsInterval);
      
      uniforms.time.value += 0.05;
      renderer.render(scene, camera);
    };

    requestAnimationFrame(animate);

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
      if (threeRef.current?.contains(renderer.domElement)) {
        threeRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await new Promise(r => setTimeout(r, 1000));
      setSubmitStatus('success');
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative text-white overflow-hidden">
      <div className="absolute inset-0 bg-gray-900 bg-opacity-95 z-0"></div>
      <div ref={threeRef} className="absolute inset-0 z-10"></div>
      
      <div className="relative z-20 max-w-4xl mx-auto px-4 py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-white drop-shadow-lg">
            Get in Touch
          </h1>
          <button 
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors duration-300 shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="bg-white/20 backdrop-blur-lg rounded-xl shadow-2xl p-6 md:p-8 transition-all duration-500 border border-white/20"
        >
          {submitStatus === 'success' ? (
            <div className="text-center py-12">
              <div className="text-green-300 text-5xl mb-4 drop-shadow-md">✓</div>
              <h2 className="text-2xl font-bold mb-2 text-white">Message Sent!</h2>
              <p className="mb-8 text-white">Thank you for reaching out. I'll get back to you as soon as possible.</p>
              <button
                onClick={() => {
                  setSubmitStatus('idle');
                  setFormState({ name: '', email: '', message: '' });
                }}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-lg text-white"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2 text-white">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-white placeholder-white/70"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2 text-white">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formState.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-white placeholder-white/70"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2 text-white">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formState.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-white placeholder-white/70"
                  placeholder="Hi Amadou, I'd like to discuss a project opportunity..."
                ></textarea>
              </div>

              {submitStatus === 'error' && (
                <div className="text-red-300 text-sm p-3 bg-red-900/30 rounded-lg border border-red-500/40">
                  <p>There was an error sending your message. Please try again or reach out directly via email.</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-6 rounded-lg font-medium text-lg shadow-xl transition-all duration-300 ${
                  isSubmitting
                    ? 'bg-blue-800 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 transform hover:-translate-y-1 hover:shadow-blue-500/20'
                } text-white`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : 'Send Message'}
              </button>
            </form>
          )}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-10 grid sm:grid-cols-2 gap-4"
        >
          <div className="bg-white/20 backdrop-blur-sm p-5 rounded-xl shadow-lg border border-white/20 transform transition-transform hover:scale-[1.02]">
            <h3 className="text-xl font-semibold mb-2 text-white">Email</h3>
            <p className="text-white">amadouamos@hotmail.com</p>
          </div>
          
          <div className="bg-white/20 backdrop-blur-sm p-5 rounded-xl shadow-lg border border-white/20 transform transition-transform hover:scale-[1.02]">
            <h3 className="text-xl font-semibold mb-2 text-white">Location</h3>
            <p className="text-white">Calgary, Alberta, Canada</p>
          </div>
        </motion.div>

        <div className="mt-10 text-center text-white text-sm">
          <p>You can also find me on social media:</p>
          <div className="flex justify-center space-x-6 mt-4">
            <a href="https://github.com/Amadou-D" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-300 transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="https://www.linkedin.com/in/amadou-diallo-7b2326330/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-300 transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
