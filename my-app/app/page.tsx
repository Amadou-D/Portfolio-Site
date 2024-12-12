'use client';

import { useEffect, useRef, useState } from 'react';
import Header from '@/components/header';
import RetroGrid from '@/components/ui/retro-grid';
import SkillsSection from '@/components/SkillsSection';
import Contact from '@/components/contact';
import { About } from '@/components/About';

interface PointerPosition {
  x: number;
  y: number;
}

const vibrantColorPairs = [
  { color1: '#FF4B2B', color2: '#FF416C' },
  { color1: '#1fd0bd', color2: '#00ab84' },
];

const CubePage = () => {
  const [cubeStyle, setCubeStyle] = useState<React.CSSProperties>({
    transform: 'rotateX(0deg) rotateY(0deg)',
  });
  const [showSkills, setShowSkills] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [startAnimation, setStartAnimation] = useState(false);
  const [textColor, setTextColor] = useState<string>('#FFFFFF');
  const cubeRef = useRef<HTMLDivElement | null>(null);
  const [showAbout, setShowAbout] = useState(false);

  const isDragging = useRef<boolean>(false);
  const lastPointerPosition = useRef<PointerPosition>({ x: 0, y: 0 });
  const rotationAngles = useRef<PointerPosition>({ x: 0, y: 0 });

  const generateGradient = (colors: { color1: string, color2: string }): string => {
    return `linear-gradient(45deg, ${colors.color1}, ${colors.color2})`;
  };

  const calculateLuminance = (color: string): number => {
    const rgb = parseInt(color.slice(1), 16); // Convert hex to RGB
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    return 0.2126 * r + 0.7152 * g + 0.0722 * b; // Calculate luminance
  };

  const updateTextColor = (color1: string, color2: string) => {
    const luminance1 = calculateLuminance(color1);
    const luminance2 = calculateLuminance(color2);
    const averageLuminance = (luminance1 + luminance2) / 2;
    setTextColor(averageLuminance > 128 ? '#000000' : '#FFFFFF'); // Set text color based on luminance
  };

  const [gradientColors, setGradientColors] = useState<string>(
    generateGradient(vibrantColorPairs[0])
  );

  useEffect(() => {
    const handlePointerEnter = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;

      lastPointerPosition.current = { x: e.clientX, y: e.clientY };
      isDragging.current = true;
    };

    const handlePointerLeave = () => {
      isDragging.current = false;
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch' || !isDragging.current) return;

      const cubeRect = cubeRef.current?.getBoundingClientRect();
      if (cubeRect) {
        const deltaX = (e.clientX - lastPointerPosition.current.x) * (2 * Math.PI) / (cubeRect.width || 1);
        const deltaY = (e.clientY - lastPointerPosition.current.y) * (2 * Math.PI) / (cubeRect.height || 1);

        rotationAngles.current.x += deltaY;
        rotationAngles.current.y += deltaX;

        setCubeStyle({
          transform: `rotateX(${rotationAngles.current.x}rad) rotateY(${rotationAngles.current.y}rad)`,
        });

        lastPointerPosition.current = { x: e.clientX, y: e.clientY };
      }
    };

    const cubeElement = cubeRef.current;
    if (cubeElement) {
      cubeElement.addEventListener('pointerenter', handlePointerEnter);
      cubeElement.addEventListener('pointerleave', handlePointerLeave);
      cubeElement.addEventListener('pointermove', handlePointerMove);
    }

    const colorInterval = setInterval(() => {
      const randomColors = vibrantColorPairs[Math.floor(Math.random() * vibrantColorPairs.length)];
      setGradientColors(generateGradient(randomColors));
      updateTextColor(randomColors.color1, randomColors.color2);
    }, 2000);

    const rotationInterval = setInterval(() => {
      if (!isDragging.current) {
        rotationAngles.current.x += 0.01;
        rotationAngles.current.y += 0.01;

        setCubeStyle({
          transform: `rotateX(${rotationAngles.current.x}rad) rotateY(${rotationAngles.current.y}rad)`,
        });
      }
    }, 30);

    return () => {
      if (cubeElement) {
        cubeElement.removeEventListener('pointerenter', handlePointerEnter);
        cubeElement.removeEventListener('pointerleave', handlePointerLeave);
        cubeElement.removeEventListener('pointermove', handlePointerMove);
      }
      clearInterval(rotationInterval);
      clearInterval(colorInterval);
    };
  }, []);

  const handleStartClick = () => {
    setStartAnimation(true);
    setTimeout(() => {
      setShowSkills(true);
      setStartAnimation(false);
    }, 1250); // Adjust the duration as needed
  };

  const handleNavigateToSkills = () => {
    setShowSkills(true);
    document.getElementById('skills-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleNavigateToContact = () => {
    setStartAnimation(true);
    setTimeout(() => {
      setShowContact(true);
      setStartAnimation(false);
    }, 1250); // Adjust the duration as needed
  };

  const handleNavigateToAbout = () => {
    document.getElementById('about-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      className={`relative w-screen min-h-screen flex flex-col items-center justify-center bg-gray-900 overflow-hidden ${startAnimation ? 'zoom-animation' : ''}`}
      style={{ '--gradient': gradientColors, color: textColor } as React.CSSProperties}
    >
      <RetroGrid gridColor="rgba(255, 255, 255, 1)" />
      
      {/* Move Header to top right */}
      <div className="absolute top-4 right-4">
        <Header onNavigateToSkills={handleNavigateToSkills} onNavigateToContact={handleNavigateToContact} />
      </div>

      {/* Interactive Cube Logo */}
      <div
        ref={cubeRef}
        className="absolute top-7 left-7 "
        style={{
          width: '50px',
          height: '50px',
          perspective: '1200px',
        }}
      >
        <div
          className="absolute w-full h-full"
          style={{
            ...cubeStyle,
            transformStyle: 'preserve-3d',
          }}
        >
          <div className="absolute w-full h-full" style={{ background: gradientColors, transform: 'rotateY(0deg) translateZ(24px)', backfaceVisibility: 'hidden' }} />
          <div className="absolute w-full h-full" style={{ background: gradientColors, transform: 'rotateY(180deg) translateZ(24px)', backfaceVisibility: 'hidden' }} />
          <div className="absolute w-full h-full" style={{ background: gradientColors, transform: 'rotateY(90deg) translateZ(24px)', backfaceVisibility: 'hidden' }} />
          <div className="absolute w-full h-full" style={{ background: gradientColors, transform: 'rotateY(-90deg) translateZ(24px)', backfaceVisibility: 'hidden' }} />
          <div className="absolute w-full h-full" style={{ background: gradientColors, transform: 'rotateX(90deg) translateZ(24px)', backfaceVisibility: 'hidden' }} />
          <div className="absolute w-full h-full" style={{ background: gradientColors, transform: 'rotateX(-90deg) translateZ(24px)', backfaceVisibility: 'hidden' }} />
        </div>
      </div>

      {/* Text Section */}
      <div className="mt-20 text-center text-gray-200 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-16 min-w-[300px] sm:min-w-[400px] md:min-w-[500px] lg:min-w-[600px] xl:min-w-[700px]">
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold mb-4 font-['Montserrat'] gradient-text delay-0">
          Hey I&apos;m <span className="gradient-text delay-1">Amadou</span>
        </h1>
        <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-['Roboto'] semi gradient-text delay-2">
          I&apos;m a Full Stack Developer
        </p>
        <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-gray-200 font-['Roboto'] gradient-text delay-3">
          That builds <span className="gradient-text delay-4">customized</span> Websites and <span className="gradient-text delay-5">Applications</span>
        </p>
        <div className="flex flex-col space-y-4">
          <button
            className="mt-6 px-20 py-3 text-2xl font-extrabold hover:text-gray-400 text-white rounded gradient-button delay-6"
            onClick={handleStartClick}
          >
            Skills
          </button>
          <button
            className="mt-6 px-20 py-3 text-2xl font-extrabold hover:text-gray-400 text-white rounded gradient-button delay-7"
            onClick={handleNavigateToContact}
          >
            Contact
          </button>
          <button
            className="mt-6 px-20 py-3 text-2xl font-extrabold hover:text-gray-400 text-white rounded gradient-button delay-8"
            onClick={handleNavigateToAbout}
          >
            About
          </button>
        </div>
      </div>

      {/* Skills Section */}
      {showSkills && <SkillsSection onClose={() => setShowSkills(false)} />}

      {/* Contact Section */}
      {showContact && <Contact onClose={() => setShowContact(false)} />}

      {showAbout && <About onClose={()=>setShowAbout(false)}/>}

    </div>
  );
};

export default CubePage;