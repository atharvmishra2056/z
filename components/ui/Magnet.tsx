"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, useState } from "react";

interface MagnetProps {
  children: React.ReactNode;
  padding?: number;
  disabled?: boolean;
  strength?: number;
}

export default function Magnet({ 
    children, 
    padding = 20, 
    disabled = false,
    strength = 30 // How far it pulls (higher = stronger pull)
}: MagnetProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();
    
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);

    setPosition({ x: middleX, y: middleY });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  const { x, y } = position;
  
  // Smooth physics for the movement
  const xMotion = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const yMotion = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  // Transform the movement based on strength
  const transformX = useTransform(xMotion, [-500, 500], [-strength, strength]);
  const transformY = useTransform(yMotion, [-500, 500], [-strength, strength]);

  if (disabled) return <>{children}</>;

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      style={{ x: transformX, y: transformY }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
    >
      {children}
    </motion.div>
  );
}