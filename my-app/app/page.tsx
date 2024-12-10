'use client';

import { useEffect, useRef, useState } from "react";
import AnimatedGridPattern from "@/components/ui/animated-grid-pattern";
import SparklesText from "@/components/ui/sparkles-text";

// Define types for your state and refs
interface PointerPosition {
  x: number;
  y: number;
}

const CubePage = () => {
  const [cubeStyle, setCubeStyle] = useState<React.CSSProperties>({
    transform: "rotateX(0deg) rotateY(0deg)",
  });

  const isDragging = useRef<boolean>(false);
  const lastPointerPosition = useRef<PointerPosition>({ x: 0, y: 0 });
  const rotationAngles = useRef<PointerPosition>({ x: 0, y: 0 });
  const cubeRef = useRef<HTMLDivElement | null>(null);

  // Function to generate a random color
  const generateRandomGradient = (): string => {
    const randomColor = (): string => {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    };

    return `linear-gradient(45deg, ${randomColor()}, ${randomColor()})`;
  };

  const [gradientColors, setGradientColors] = useState<string>(generateRandomGradient());

  useEffect(() => {
    const handlePointerEnter = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;

      lastPointerPosition.current = { x: e.clientX, y: e.clientY };
      isDragging.current = true;
    };

    const handlePointerLeave = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;

      isDragging.current = false;
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType === "touch" || !isDragging.current) return;

      const { x, y } = lastPointerPosition.current;
      const deltaX = (e.clientX - x) * (2 * Math.PI) / (cubeRef.current?.offsetWidth || 1);
      const deltaY = (e.clientY - y) * (2 * Math.PI) / (cubeRef.current?.offsetWidth || 1);

      rotationAngles.current.x += deltaY;
      rotationAngles.current.y += deltaX;

      setCubeStyle({
        transform: `rotateX(${rotationAngles.current.x}rad) rotateY(${rotationAngles.current.y}rad)`,
      });

      lastPointerPosition.current = { x: e.clientX, y: e.clientY };
    };

    const cubeElement = cubeRef.current;
    if (cubeElement) {
      cubeElement.addEventListener("pointerenter", handlePointerEnter);
      cubeElement.addEventListener("pointerleave", handlePointerLeave);
      cubeElement.addEventListener("pointermove", handlePointerMove);
    }

    const colorInterval = setInterval(() => {
      setGradientColors(generateRandomGradient());
    }, 2000);

    const rotationInterval = setInterval(() => {
      rotationAngles.current.x += 0.01;
      rotationAngles.current.y += 0.01;

      setCubeStyle({
        transform: `rotateX(${rotationAngles.current.x}rad) rotateY(${rotationAngles.current.y}rad)`,
      });
    }, 30);

    return () => {
      if (cubeElement) {
        cubeElement.removeEventListener("pointerenter", handlePointerEnter);
        cubeElement.removeEventListener("pointerleave", handlePointerLeave);
        cubeElement.removeEventListener("pointermove", handlePointerMove);
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
      <AnimatedGridPattern
        width={40}
        height={40}
        numSquares={50}
        maxOpacity={0.5}
        duration={4}
        repeatDelay={0.5}
        className="absolute inset-0"
      />

      {/* Description Text */}
      <div className="absolute top-10 text-center text-white">
        <h1 className="text-8xl font-bold mb-4">
        Hey I&apos;m <span className="gradient-text">Amadou</span>
        </h1>
        <p className="text-6xl">
         I&apos;m a Full  Stack  Developer
        </p>
        <p className="text-6xl">
        That builds <span className=" gradient-text">customized</span> Websites and <span className=" gradient-text">Applications</span>
        </p>
      </div>

      <div
        ref={cubeRef}
        className="relative w-48 h-48"
        style={{
          perspective: "1000px",
        }}
      >
        <div
          className="absolute w-full h-full"
          style={{
            ...cubeStyle,
            transformStyle: "preserve-3d",
            transition: isDragging.current ? "none" : "transform 0.3s ease",
          }}
        >
          {/* Cube Faces */}
          <div className="absolute w-full h-full" style={{ background: gradientColors, transform: "rotateY(0deg) translateZ(96px)" }} />
          <div className="absolute w-full h-full" style={{ background: gradientColors, transform: "rotateY(180deg) translateZ(96px)" }} />
          <div className="absolute w-full h-full" style={{ background: gradientColors, transform: "rotateY(90deg) translateZ(96px)" }} />
          <div className="absolute w-full h-full" style={{ background: gradientColors, transform: "rotateY(-90deg) translateZ(96px)" }} />
          <div className="absolute w-full h-full" style={{ background: gradientColors, transform: "rotateX(90deg) translateZ(96px)" }} />
          <div className="absolute w-full h-full" style={{ background: gradientColors, transform: "rotateX(-90deg) translateZ(96px)" }} />
        </div>
      </div>
    </div>
  );
};

export default CubePage;