'use client';

import { useEffect, useRef, useState } from "react";

const CubePage = () => {
  const [cubeStyle, setCubeStyle] = useState({
    transform: "rotateX(0deg) rotateY(0deg)",
  });

  const isDragging = useRef(false);
  const lastPointerPosition = useRef({ x: 0, y: 0 });
  const rotationAngles = useRef({ x: 0, y: 0 });
  const cubeRef = useRef(null);

  // Function to generate random gradient colors
  const generateRandomGradient = () => {
    const randomColor = () => {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    };

    return `linear-gradient(45deg, ${randomColor()}, ${randomColor()})`;
  };

  // State to store the generated random gradient color
  const [gradientColors, setGradientColors] = useState(generateRandomGradient());

  useEffect(() => {
    const handlePointerEnter = (e) => {
      if (e.pointerType === "touch") return;

      lastPointerPosition.current = { x: e.clientX, y: e.clientY };
      isDragging.current = true;
    };

    const handlePointerLeave = (e) => {
      if (e.pointerType === "touch") return;

      isDragging.current = false;
    };

    const handlePointerMove = (e) => {
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

    // Change gradient color every 2 seconds
    const colorInterval = setInterval(() => {
      setGradientColors(generateRandomGradient());
    }, 2000);

    // Auto-rotation logic
    const rotationInterval = setInterval(() => {
      rotationAngles.current.x += 0.01;
      rotationAngles.current.y += 0.01;

      setCubeStyle({
        transform: `rotateX(${rotationAngles.current.x}rad) rotateY(${rotationAngles.current.y}rad)`,
      });
    }, 30); // Adjust the interval time for faster/slower rotation

    return () => {
      if (cubeElement) {
        cubeElement.removeEventListener("pointerenter", handlePointerEnter);
        cubeElement.removeEventListener("pointerleave", handlePointerLeave);
        cubeElement.removeEventListener("pointermove", handlePointerMove);
      }
      clearInterval(rotationInterval); // Cleanup auto-rotation on unmount
      clearInterval(colorInterval); // Cleanup color change interval
    };
  }, []);

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-900 overflow-hidden">
      <div
        ref={cubeRef}
        className="relative w-48 h-48"
        style={{
          perspective: "1000px",  // Apply perspective to the container
        }}
      >
        <div
          className="absolute w-full h-full"
          style={{
            ...cubeStyle,
            transformStyle: "preserve-3d",  // Ensure 3D transforms are applied to the cube
            transition: isDragging.current ? "none" : "transform 0.3s ease",
          }}
        >
          {/* Front Face */}
          <div
            className="absolute w-full h-full"
            style={{
              background: gradientColors, // Apply gradient color to each face
              transform: "rotateY(0deg) translateZ(96px)", // Front face
            }}
          />
          {/* Back Face */}
          <div
            className="absolute w-full h-full"
            style={{
              background: gradientColors, // Apply gradient color to each face
              transform: "rotateY(180deg) translateZ(96px)", // Back face
            }}
          />
          {/* Right Face */}
          <div
            className="absolute w-full h-full"
            style={{
              background: gradientColors, // Apply gradient color to each face
              transform: "rotateY(90deg) translateZ(96px)", // Right face
            }}
          />
          {/* Left Face */}
          <div
            className="absolute w-full h-full"
            style={{
              background: gradientColors, // Apply gradient color to each face
              transform: "rotateY(-90deg) translateZ(96px)", // Left face
            }}
          />
          {/* Top Face */}
          <div
            className="absolute w-full h-full"
            style={{
              background: gradientColors, // Apply gradient color to each face
              transform: "rotateX(90deg) translateZ(96px)", // Top face
            }}
          />
          {/* Bottom Face */}
          <div
            className="absolute w-full h-full"
            style={{
              background: gradientColors, // Apply gradient color to each face
              transform: "rotateX(-90deg) translateZ(96px)", // Bottom face
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CubePage;
