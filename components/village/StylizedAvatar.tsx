'use client';

import { motion } from 'framer-motion';

interface StylizedAvatarProps {
  gender: 'male' | 'female' | 'non-binary';
  color: string;
  className?: string;
  isWalking?: boolean;
  isWorking?: boolean;
}

export default function StylizedAvatar({ gender, color, className = '', isWalking = false, isWorking = false }: StylizedAvatarProps) {
  // Use tailwind color names to determine hex colors (rough mapping)
  const getHexColor = (colorClass: string) => {
    if (colorClass.includes('emerald')) return '#10b981';
    if (colorClass.includes('amber')) return '#f59e0b';
    if (colorClass.includes('red')) return '#ef4444';
    if (colorClass.includes('cyan')) return '#06b6d4';
    if (colorClass.includes('violet')) return '#8b5cf6';
    if (colorClass.includes('blue')) return '#3b82f6';
    return '#64748b';
  };

  const hexColor = getHexColor(color);

  return (
    <motion.div 
      className={`relative ${className}`}
      animate={isWalking ? {
        y: [0, -6, 0],
      } : {}}
      transition={isWalking ? {
        duration: 0.5,
        repeat: Infinity,
        ease: "easeInOut"
      } : {}}
    >
      <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-[0_0_8px_rgba(var(--avatar-glow),0.5)]">
        <defs>
          <linearGradient id="skinGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: hexColor, stopOpacity: 0.8 }} />
            <stop offset="100%" style={{ stopColor: hexColor, stopOpacity: 0.4 }} />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Aura / Halo */}
        <motion.circle
          cx="50" cy="50" r="45"
          fill="none"
          stroke={hexColor}
          strokeWidth="0.5"
          strokeDasharray="4 4"
          animate={{ rotate: 360, scale: isWorking ? [1, 1.1, 1] : 1 }}
          transition={{ 
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity }
          }}
          className="opacity-30"
        />

        {/* Holographic "Working" HUD */}
        {isWorking && (
          <motion.g
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="opacity-40"
          >
            <rect x="20" y="30" width="15" height="1" fill={hexColor} />
            <rect x="65" y="30" width="15" height="1" fill={hexColor} />
            <circle cx="50" cy="50" r="38" fill="none" stroke={hexColor} strokeWidth="0.2" strokeDasharray="1 2" />
          </motion.g>
        )}

        {/* Legs (Animated when walking) */}
        <g className="opacity-80">
          <motion.path
            d="M40,90 L40,110"
            stroke={hexColor}
            strokeWidth="3"
            strokeLinecap="round"
            animate={isWalking ? {
              d: ["M40,90 L35,110", "M40,90 L45,105", "M40,90 L35,110"]
            } : { d: "M40,90 L40,105" }}
            transition={{ duration: 0.5, repeat: Infinity }}
          />
          <motion.path
            d="M60,90 L60,110"
            stroke={hexColor}
            strokeWidth="3"
            strokeLinecap="round"
            animate={isWalking ? {
              d: ["M60,90 L65,105", "M60,90 L55,110", "M60,90 L65,105"]
            } : { d: "M60,90 L60,105" }}
            transition={{ duration: 0.5, repeat: Infinity }}
          />
        </g>

        {/* Body Base */}
        <motion.path
          d={gender === 'female' 
            ? "M30,90 Q30,70 50,70 Q70,70 70,90 L70,95 L30,95 Z" 
            : "M25,90 Q25,65 50,65 Q75,65 75,90 L75,95 L25,95 Z"
          }
          fill="url(#skinGradient)"
          animate={isWorking ? { scale: [1, 1.01, 1] } : {}}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="opacity-90"
        />

        {/* Bioluminescent Markings */}
        <g className="opacity-40">
          <motion.path
            d={gender === 'female'
              ? "M45,75 Q50,80 55,75 M40,82 Q50,85 60,82"
              : "M40,70 Q50,75 60,70 M35,80 Q50,85 65,80"
            }
            fill="none"
            stroke="white"
            strokeWidth="0.5"
            animate={{ opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </g>

        {/* Shoulders / Suit details */}
        <path
          d={gender === 'female'
            ? "M35,90 L50,75 L65,90"
            : "M30,90 L50,70 L70,90"
          }
          fill="none"
          stroke={hexColor}
          strokeWidth="1"
          className="opacity-50"
        />

        {/* Head */}
        <motion.circle
          cx="50"
          cy={gender === 'female' ? "45" : "42"}
          r={gender === 'female' ? "18" : "20"}
          fill="url(#skinGradient)"
          animate={isWorking ? { scale: [1, 1.02, 1] } : { y: [0, -2, 0] }}
          transition={{ duration: isWorking ? 1 : 4, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Eyes (Glowing) */}
        <g filter="url(#glow)">
          <motion.circle 
            cx="43" cy="42" r="2" 
            fill="white" 
            animate={{ opacity: isWorking ? [0.4, 1, 0.4] : [0.6, 1, 0.6] }}
            transition={{ duration: isWorking ? 0.5 : 2, repeat: Infinity }}
          />
          <motion.circle 
            cx="57" cy="42" r="2" 
            fill="white" 
            animate={{ opacity: isWorking ? [0.4, 1, 0.4] : [0.6, 1, 0.6] }}
            transition={{ duration: isWorking ? 0.5 : 2, repeat: Infinity }}
          />
        </g>

        {/* Neural Interface Details */}
        <motion.path
          d="M50,20 L50,30 M40,25 L45,30 M60,25 L55,30"
          stroke={hexColor}
          strokeWidth="1"
          fill="none"
          animate={{ opacity: isWorking ? [0.4, 1, 0.4] : [0.2, 0.8, 0.2] }}
          transition={{ duration: isWorking ? 0.8 : 3, repeat: Infinity }}
        />

        {/* Gender Specific Details */}
        {gender === 'female' && (
          <path
            d="M32,45 Q25,45 28,30 Q35,15 50,15 Q65,15 72,30 Q75,45 68,45"
            fill="none"
            stroke={hexColor}
            strokeWidth="1.5"
            className="opacity-40"
          />
        )}
        
        {gender === 'non-binary' && (
          <rect x="40" y="38" width="20" height="8" rx="2" fill="none" stroke="white" strokeWidth="0.5" className="opacity-50" />
        )}
      </svg>
      
      {/* Floating Particles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-white opacity-20"
          style={{
            left: `${20 + Math.random() * 60}%`,
            top: `${20 + Math.random() * 60}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0, 0.5, 0],
            scale: [0.5, 1.2, 0.5]
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2
          }}
        />
      ))}
    </div>
  );
}
