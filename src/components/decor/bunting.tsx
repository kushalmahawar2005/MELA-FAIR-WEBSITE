"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

type Props = {
  className?: string;
  count?: number;
};

const flagColors = ["#D62828", "#F4A300", "#386641", "#1A1A2E", "#F4A300", "#D62828"];

export function Bunting({ className, count = 22 }: Props) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const flags = Array.from({ length: count });

  if (!mounted) {
    return (
      <svg
        viewBox={`0 0 ${count * 36} 64`}
        preserveAspectRatio="none"
        className={cn("h-12 w-full", className)}
        aria-hidden
      />
    );
  }

  return (
    <svg
      viewBox={`0 0 ${count * 36} 64`}
      preserveAspectRatio="none"
      className={cn("h-12 w-full", className)}
      aria-hidden
    >
      <path
        d={`M0 8 Q ${(count * 36) / 4} 28 ${(count * 36) / 2} 18 T ${count * 36} 8`}
        stroke="#1A1A2E"
        strokeWidth="1.2"
        fill="none"
        opacity="0.6"
      />
      {flags.map((_, i) => {
        const cx = i * 36 + 18;
        const t = i / (count - 1);
        const dipY = 8 + Math.sin(t * Math.PI) * 20;
        const color = flagColors[i % flagColors.length];
        return (
          <g key={i} transform={`translate(${cx} ${dipY})`}>
            <line x1="0" y1="0" x2="0" y2="4" stroke="#1A1A2E" strokeWidth="0.8" />
            <path
              d="M -14 4 L 14 4 L 0 30 Z"
              fill={color}
              stroke="#1A1A2E"
              strokeWidth="0.8"
              strokeLinejoin="round"
            />
            <circle cx="0" cy="4" r="1.6" fill="#F4A300" stroke="#1A1A2E" strokeWidth="0.5" />
          </g>
        );
      })}
    </svg>
  );
}
