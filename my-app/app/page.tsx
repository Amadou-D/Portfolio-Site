'use client';

import { useEffect, useRef, useState } from 'react';
import Header from '@/components/header';
import RetroGrid from '@/components/ui/retro-grid';
import SkillsSection from '@/components/SkillsSection';

interface PointerPosition {
  x: number;
  y: number;
}

const vibrantColorPairs = [
  { color1: '#FF4B2B', color2: '#FF416C' },
  { color1: '#1fd0bd', color2: '#00ab84' },
  { color1: '#cc1696', color2: '#ff529a' },
];

const CubePage = () => {
  const [cubeStyle, setCubeStyle] = useState<React.CSSProperties>({
    transform: 'rotateX(0deg) rotateY(0deg)',
  });
  const [showSkills, setShowSkills] = useState(false);
  const [startAnimation, setStartAnimation] = useState(false);
  const [textColor, setTextColor] = useState<string>('#FFFFFF');
  const cubeRef = useRef<HTMLDivElement | null>(null);

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
    }, 3000); // Adjust the duration as needed
  };

  const handleNavigateToSkills = () => {
    setShowSkills(true);
    document.getElementById('skills-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      className={`relative w-screen min-h-screen flex flex-col items-center justify-center bg-gray-900 overflow-hidden ${startAnimation ? 'zoom-animation' : ''}`}
      style={{ '--gradient': gradientColors, color: textColor } as React.CSSProperties}
    >
      <RetroGrid gridColor="rgba(255, 255, 255, 0.3)" />
      
      {/* Move Header to top right */}
      <div className="absolute top-4 right-4">
        <Header onNavigateToSkills={handleNavigateToSkills} />
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
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-4 font-['Montserrat']">
          Hey I&apos;m <span className="gradient-text">Amadou</span>
        </h1>
        <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-['Roboto'] semi">
          I&apos;m a Full Stack Developer
        </p>
        <p className="text-2xl sm:text-3xl md:text-4xl text-gray-200 font-['Roboto']">
          That builds <span className="gradient-text">customized</span> Websites and <span className="gradient-text">Applications</span>
        </p>
        <button
          className="mt-6 px-6 py-3 text-2xl font-extrabold hover:text-gray-400 text-white rounded retro-button"
          style={{ background: gradientColors }}
          onClick={handleStartClick}
        >
          Skills
        </button>
      </div>

      {/* Skills Section */}
      {showSkills && <SkillsSection onClose={() => setShowSkills(false)} />}
    </div>
  );
};

export default CubePage;