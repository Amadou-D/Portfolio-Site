'use client';

import { useEffect, useRef, useState } from 'react';
import RetroGrid from '@/components/ui/retro-grid'; // Assuming RetroGrid is in the specified path

interface PointerPosition {
  x: number;
  y: number;
}

const vibrantColorPairs = [
  { color1: '#FF4B2B', color2: '#FF416C' },
  { color1: '#00C9FF', color2: '#92FE9D' },
  { color1: '#6A1B9A', color2: '#8E24AA' },
  { color1: '#FFEB3B', color2: '#FF9800' },
  { color1: '#3F51B5', color2: '#2196F3' },
  { color1: '#00BCD4', color2: '#009688' },
];

const CubePage = () => {
  const [cubeStyle, setCubeStyle] = useState<React.CSSProperties>({
    transform: 'rotateX(0deg) rotateY(0deg)',
  });

  const isDragging = useRef<boolean>(false);
  const lastPointerPosition = useRef<PointerPosition>({ x: 0, y: 0 });
  const rotationAngles = useRef<PointerPosition>({ x: 0, y: 0 });
  const rotationVelocity = useRef<PointerPosition>({ x: 0, y: 0 });
  const cubeRef = useRef<HTMLDivElement | null>(null);

  // Declare the function to generate gradients here
  const generateGradient = (colors: { color1: string, color2: string }): string => {
    return `linear-gradient(45deg, ${colors.color1}, ${colors.color2})`;
  };

  const [gradientColors, setGradientColors] = useState<string>(
    generateGradient(vibrantColorPairs[0])
  );

  useEffect(() => {
    const handlePointerEnter = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;

      lastPointerPosition.current = { x: e.clientX, y: e.clientY };
      isDragging.current = false; // Not dragging, so we trigger rotation instead
    };

    const handlePointerLeave = () => {
      isDragging.current = false;
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch' || isDragging.current) return;

      const cubeRect = cubeRef.current?.getBoundingClientRect();
      if (cubeRect) {
        // Detect if the pointer is near the center of the cube
        const centerX = cubeRect.left + cubeRect.width / 2;
        const centerY = cubeRect.top + cubeRect.height / 2;
        const distanceToCenter = Math.sqrt(
          Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2)
        );

        if (distanceToCenter < 100) { // Adjust the range for "center hover" area
          const deltaX = (e.clientX - lastPointerPosition.current.x) * (2 * Math.PI) / (cubeRef.current?.offsetWidth || 1);
          const deltaY = (e.clientY - lastPointerPosition.current.y) * (2 * Math.PI) / (cubeRef.current?.offsetWidth || 1);

          // Apply a slowdown factor to the movement (adjust the factor as needed)
          const slowdownFactor = 0.15;
          rotationVelocity.current.x = deltaY * slowdownFactor;
          rotationVelocity.current.y = deltaX * slowdownFactor;

          lastPointerPosition.current = { x: e.clientX, y: e.clientY };
        }
      }
    };

    const cubeElement = cubeRef.current;
    if (cubeElement) {
      cubeElement.addEventListener('pointerenter', handlePointerEnter);
      cubeElement.addEventListener('pointerleave', handlePointerLeave);
      cubeElement.addEventListener('pointermove', handlePointerMove);
    }

    const colorInterval = setInterval(() => {
      // Change the gradient every 2 seconds, cycling through vibrant color pairs
      setGradientColors(generateGradient(vibrantColorPairs[Math.floor(Math.random() * vibrantColorPairs.length)]));
    }, 2000);

    // Auto-rotation logic
    const rotationInterval = setInterval(() => {
      if (!isDragging.current) {
        // Apply friction to slow down the rotation gradually
        rotationVelocity.current.x *= 0.97; // Slightly reduced friction for smoother movement
        rotationVelocity.current.y *= 0.97;

        // Update the rotation angles based on the velocity
        rotationAngles.current.x += rotationVelocity.current.x;
        rotationAngles.current.y += rotationVelocity.current.y;

        // Auto rotate
        rotationAngles.current.x += 0.01; // Incrementally rotate around X axis
        rotationAngles.current.y += 0.01; // Incrementally rotate around Y axis

        setCubeStyle({
          transform: `rotateX(${rotationAngles.current.x}rad) rotateY(${rotationAngles.current.y}rad)`,
          transition: 'transform 0.3s ease-out', // Smooth transition when not dragging
        });
      }
    }, 16); // ~60 FPS for auto-rotation

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

  return (
    <div
      className="relative w-screen h-screen flex flex-col items-center justify-center bg-gray-900 overflow-hidden"
      style={{ '--gradient': gradientColors } as React.CSSProperties} // Apply gradient to the container
    >
      {/* Background Animated Grid Pattern */}
      <RetroGrid
        width={40}
        height={40}
        numSquares={50}
        maxOpacity={0.5}
        duration={4}
        repeatDelay={0.5}
        className="absolute inset-0"
        gridColor="rgba(255, 255, 255, 0.3)" // Set grid lines to white
      />

      {/* Description Text */}
      <div className="absolute top-10 text-center text-gray-200">
        <h1 className="text-8xl font-bold mb-4">
          Hey I&apos;m <span className="gradient-text">Amadou</span>
        </h1>
        <p className="text-6xl">
          I&apos;m a Full Stack Developer
        </p>
        <p className="text-6xl text-gray-200">
          That builds <span className=" gradient-text">customized</span> Websites and <span className=" gradient-text">Applications</span>
        </p>
      </div>

      {/* Cube Container */}
      <div
        ref={cubeRef}
        className="relative w-48 h-48"
        style={{
          perspective: '1000px',
        }}
      >
        <div
          className="absolute w-full h-full"
          style={{
            ...cubeStyle,
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Cube Faces */}
          <div className="absolute w-full h-full" style={{ background: gradientColors, transform: 'rotateY(0deg) translateZ(96px)' }} />
          <div className="absolute w-full h-full" style={{ background: gradientColors, transform: 'rotateY(180deg) translateZ(96px)' }} />
          <div className="absolute w-full h-full" style={{ background: gradientColors, transform: 'rotateY(90deg) translateZ(96px)' }} />
          <div className="absolute w-full h-full" style={{ background: gradientColors, transform: 'rotateY(-90deg) translateZ(96px)' }} />
          <div className="absolute w-full h-full" style={{ background: gradientColors, transform: 'rotateX(90deg) translateZ(96px)' }} />
          <div className="absolute w-full h-full" style={{ background: gradientColors, transform: 'rotateX(-90deg) translateZ(96px)' }} />
        </div>
      </div>
    </div>
  );
};

export default CubePage;