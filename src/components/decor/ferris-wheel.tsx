"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

type Props = {
  className?: string;
  spokes?: number;
};

export function FerrisWheel({ className, spokes = 12 }: Props) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const angle = 360 / spokes;

  if (!mounted) {
    return <div className={cn("relative aspect-square", className)} aria-hidden />;
  }

  return (
    <div className={cn("relative aspect-square", className)} aria-hidden>
      <svg
        viewBox="-110 -110 220 220"
        className="absolute inset-0 h-full w-full motion-safe:animate-[spin_38s_linear_infinite]"
      >
        <defs>
          <radialGradient id="hub" cx="0" cy="0" r="20" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#F4A300" />
            <stop offset="1" stopColor="#D62828" />
          </radialGradient>
          <linearGradient id="rim" x1="0" y1="-100" x2="0" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#1A1A2E" />
            <stop offset="0.5" stopColor="#3A2A4A" />
            <stop offset="1" stopColor="#1A1A2E" />
          </linearGradient>
        </defs>

        <circle r="100" fill="none" stroke="url(#rim)" strokeWidth="3.5" />
        <circle r="92" fill="none" stroke="#1A1A2E" strokeWidth="0.8" strokeDasharray="2 4" opacity="0.55" />

        {Array.from({ length: spokes }).map((_, i) => {
          const a = (angle * i * Math.PI) / 180;
          const x = Math.cos(a) * 96;
          const y = Math.sin(a) * 96;
          const cabin = i % 2 === 0 ? "#D62828" : "#386641";
          return (
            <g key={i}>
              <line x1="0" y1="0" x2={x} y2={y} stroke="#1A1A2E" strokeWidth="1.2" />
              <circle cx={x} cy={y} r="3" fill="#F4A300" />
              <g transform={`translate(${x} ${y + 9})`}>
                <rect x="-6.5" y="-1.5" width="13" height="10" rx="2.5" fill={cabin} stroke="#1A1A2E" strokeWidth="0.8" />
                <line x1="0" y1="-1.5" x2={-x / 14} y2={-y / 14 + 1} stroke="#1A1A2E" strokeWidth="0.6" />
                <circle cx="-3" cy="3.5" r="1" fill="#FFF8EC" opacity="0.85" />
                <circle cx="3" cy="3.5" r="1" fill="#FFF8EC" opacity="0.85" />
              </g>
            </g>
          );
        })}

        <circle r="14" fill="url(#hub)" stroke="#1A1A2E" strokeWidth="1.4" />
        <circle r="4" fill="#1A1A2E" />
      </svg>

      <div className="absolute inset-0 motion-safe:animate-[spin_38s_linear_infinite_reverse]">
        {Array.from({ length: spokes }).map((_, i) => {
          const a = (angle * i * Math.PI) / 180;
          const x = 50 + (Math.cos(a) * 96) / 2.2;
          const y = 50 + (Math.sin(a) * 96) / 2.2;
          return (
            <span
              key={i}
              className="absolute h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-marigold motion-safe:animate-[flicker_2.4s_ease-in-out_infinite]"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                animationDelay: `${i * 0.18}s`,
                boxShadow: "0 0 8px rgba(244,163,0,0.9)",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
