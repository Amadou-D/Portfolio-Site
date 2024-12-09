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

    return () => {
      if (cubeElement) {
        cubeElement.removeEventListener("pointerenter", handlePointerEnter);
        cubeElement.removeEventListener("pointerleave", handlePointerLeave);
        cubeElement.removeEventListener("pointermove", handlePointerMove);
      }
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
            className="absolute w-full h-full bg-gray-800 border-2 border-white flex items-center justify-center text-white"
            style={{
              transform: "rotateY(0deg) translateZ(96px)", // Front face
            }}
          >
            Front
          </div>
          {/* Back Face */}
          <div
            className="absolute w-full h-full bg-gray-800 border-2 border-white flex items-center justify-center text-white"
            style={{
              transform: "rotateY(180deg) translateZ(96px)", // Back face
            }}
          >
            Back
          </div>
          {/* Right Face */}
          <div
            className="absolute w-full h-full bg-gray-800 border-2 border-white flex items-center justify-center text-white"
            style={{
              transform: "rotateY(90deg) translateZ(96px)", // Right face
            }}
          >
            3D
          </div>
          {/* Left Face */}
          <div
            className="absolute w-full h-full bg-gray-800 border-2 border-white flex items-center justify-center text-white"
            style={{
              transform: "rotateY(-90deg) translateZ(96px)", // Left face
            }}
          >
           3D
          </div>
          {/* Top Face */}
          <div
            className="absolute w-full h-full bg-gray-800 border-2 border-white flex items-center justify-center text-white"
            style={{
              transform: "rotateX(90deg) translateZ(96px)", // Top face
            }}
          >
            3D
          </div>
          {/* Bottom Face */}
          <div
            className="absolute w-full h-full bg-gray-800 border-2 border-white flex items-center justify-center text-white"
            style={{
              transform: "rotateX(-90deg) translateZ(96px)", // Bottom face
            }}
          >
            3D
          </div>
        </div>
      </div>
    </div>
  );
};

export default CubePage;