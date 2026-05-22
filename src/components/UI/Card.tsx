// src/components/UI/Card.tsx
import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

// Glassmorphism card for dark mode
export default function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`bg-gray-800/50 backdrop-blur-md rounded-xl shadow-lg p-6 border border-gray-700 ${className}`}
    >
      {children}
    </div>
  );
}
