import React from 'react';

interface Props {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  tagline?: string;
  className?: string;
}

export const IndiaAppLogo: React.FC<Props> = ({
  size = 'md',
  showText = true,
  tagline,
  className = '',
}) => {
  const sizeMap = {
    sm: { box: 'w-7 h-7', text: 'text-sm', badge: 'h-3.5' },
    md: { box: 'w-9 h-9', text: 'text-base', badge: 'h-4' },
    lg: { box: 'w-11 h-11', text: 'text-lg', badge: 'h-5' },
    xl: { box: 'w-14 h-14', text: 'text-xl', badge: 'h-6' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* WhatsApp Speech Bubble with Tiranga Indian Flag & Ashoka Chakra */}
      <div className={`relative ${currentSize.box} shrink-0`}>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <defs>
            {/* Tiranga Gradient / Clip path */}
            <clipPath id="speechBubbleClip">
              <path d="M50 8 C 26 8, 8 26, 8 50 C 8 62, 13 72, 21 80 L 15 94 L 32 89 C 37 91, 44 92, 50 92 C 74 92, 92 74, 92 50 C 92 26, 74 8, 50 8 Z" />
            </clipPath>

            <linearGradient id="flagTiranga" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FF9933" />
              <stop offset="33%" stopColor="#FF9933" />
              <stop offset="33.1%" stopColor="#FFFFFF" />
              <stop offset="66%" stopColor="#FFFFFF" />
              <stop offset="66.1%" stopColor="#138808" />
              <stop offset="100%" stopColor="#138808" />
            </linearGradient>

            <filter id="shadow">
              <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#000" floodOpacity="0.3" />
            </filter>
          </defs>

          {/* Outer WhatsApp Green Ring */}
          <path
            d="M50 6 C 24 6, 5 25, 5 50 C 5 63, 10 74, 19 82 L 12 97 L 31 92 C 37 94, 43 95, 50 95 C 75 95, 95 75, 95 50 C 95 25, 75 6, 50 6 Z"
            fill="#075e54"
          />

          {/* Inner Tri-color Flag Filled Shape */}
          <g clipPath="url(#speechBubbleClip)">
            {/* Top Saffron Band */}
            <rect x="0" y="0" width="100" height="36" fill="#FF9933" />
            {/* Middle White Band */}
            <rect x="0" y="36" width="100" height="28" fill="#FFFFFF" />
            {/* Bottom India Green Band */}
            <rect x="0" y="64" width="100" height="36" fill="#138808" />

            {/* Ashoka Chakra in Center (Navy Blue #000080) with 24 spokes */}
            <g transform="translate(50, 50)">
              {/* Outer wheel */}
              <circle cx="0" cy="0" r="10.5" fill="none" stroke="#000080" strokeWidth="1.2" />
              <circle cx="0" cy="0" r="2.2" fill="#000080" />

              {/* 24 spokes */}
              {[...Array(24)].map((_, i) => (
                <line
                  key={i}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="-10.5"
                  stroke="#000080"
                  strokeWidth="0.8"
                  transform={`rotate(${i * 15})`}
                />
              ))}
            </g>
          </g>

          {/* Small Gold Security E2EE Lock Emblem Overlay on bottom right */}
          <g transform="translate(68, 68) scale(0.65)">
            <circle cx="16" cy="16" r="15" fill="#111b21" stroke="#00a884" strokeWidth="2.5" />
            <path
              d="M11 15 v-4 a5 5 0 0 1 10 0 v4 m-7 0 h14 a2 2 0 0 1 2 2 v7 a2 2 0 0 1 -2 2 h-14 a2 2 0 0 1 -2 -2 v-7 a2 2 0 0 1 2 -2"
              stroke="#25d366"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
          </g>
        </svg>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className={`font-bold tracking-tight text-white ${currentSize.text} leading-none`}>
              Bharat<span className="text-[#25d366]">Samvaad</span>
            </span>
            {/* Tiranga Micro Flag Ribbon Badge */}
            <div className="flex flex-col h-3 w-4 rounded-sm overflow-hidden shadow-sm border border-black/20 shrink-0">
              <div className="h-1 bg-[#FF9933]" />
              <div className="h-1 bg-white flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-[#000080]" />
              </div>
              <div className="h-1 bg-[#138808]" />
            </div>
          </div>
          {tagline && (
            <span className="text-[10px] text-slate-400 font-medium tracking-normal mt-0.5 leading-none">
              {tagline}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
