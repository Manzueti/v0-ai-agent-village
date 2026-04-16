'use client';

import { NodeConnection as ConnectionType, InfraNode } from '@/lib/types';
import { useState, useEffect } from 'react';

interface NodeConnectionProps {
  connection: ConnectionType;
  nodes: InfraNode[];
  scale?: number;
}

const connectionStyles: Record<string, { color: string; dashArray: string; width: number }> = {
  data: { color: '#22c55e', dashArray: '0', width: 2 },
  control: { color: '#8b5cf6', dashArray: '5,5', width: 1.5 },
  backup: { color: '#f59e0b', dashArray: '10,5', width: 1 },
  vpn: { color: '#06b6d4', dashArray: '3,3', width: 2 },
};

const statusOpacity: Record<string, number> = {
  active: 1,
  degraded: 0.5,
  down: 0.2,
};

// Animated data packet component
function AnimatedPacket({ pathD, color }: { pathD: string; color: string }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 2000; // 2 seconds
    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const newProgress = ((elapsed % duration) / duration) * 100;
      setProgress(newProgress);
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  // Calculate position on bezier curve
  const getPointOnBezier = (t: number) => {
    // Parse path: M x1 y1 Q controlX controlY x2 y2
    const match = pathD.match(/M\s+([\d.]+)\s+([\d.]+)\s+Q\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)/);
    if (!match) return { x: 0, y: 0 };

    const x1 = parseFloat(match[1]);
    const y1 = parseFloat(match[2]);
    const cx = parseFloat(match[3]);
    const cy = parseFloat(match[4]);
    const x2 = parseFloat(match[5]);
    const y2 = parseFloat(match[6]);

    const t2 = 1 - t;
    const x = t2 * t2 * x1 + 2 * t2 * t * cx + t * t * x2;
    const y = t2 * t2 * y1 + 2 * t2 * t * cy + t * t * y2;
    return { x, y };
  };

  const pos = getPointOnBezier(progress / 100);

  return <circle cx={pos.x} cy={pos.y} r="3" fill={color} />;
}

export default function NodeConnection({ connection, nodes }: NodeConnectionProps) {
  const fromNode = nodes.find(n => n.id === connection.from);
  const toNode = nodes.find(n => n.id === connection.to);

  if (!fromNode || !toNode) return null;

  const style = connectionStyles[connection.type] || connectionStyles.data;
  const opacity = statusOpacity[connection.status] || 1;

  // Calculate center points of nodes (assuming 70px node size)
  const nodeSize = 70;
  const offsetX = nodeSize / 2;
  const offsetY = nodeSize / 2 + 10; // Account for roof

  const x1 = fromNode.position.x + offsetX;
  const y1 = fromNode.position.y + offsetY;
  const x2 = toNode.position.x + offsetX;
  const y2 = toNode.position.y + offsetY;

  // Calculate control points for curved line
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const distance = Math.sqrt(dx * dx + dy * dy);

  // Curve offset perpendicular to line
  const curveOffset = Math.min(distance * 0.15, 30);
  const perpX = -dy / distance * curveOffset;
  const perpY = dx / distance * curveOffset;

  const controlX = midX + perpX;
  const controlY = midY + perpY;

  const pathD = `M ${x1} ${y1} Q ${controlX} ${controlY} ${x2} ${y2}`;

  return (
    <g opacity={opacity}>
      {/* Glow effect for active connections */}
      {connection.status === 'active' && (
        <path
          d={pathD}
          fill="none"
          stroke={style.color}
          strokeWidth={style.width * 3}
          strokeOpacity={0.15}
          strokeDasharray={style.dashArray}
        />
      )}

      {/* Main line */}
      <path
        d={pathD}
        fill="none"
        stroke={style.color}
        strokeWidth={style.width}
        strokeDasharray={style.dashArray}
        strokeLinecap="round"
        className={connection.status === 'active' ? 'animate-dash' : ''}
      />

      {/* Animated data packet for active data connections */}
      {connection.status === 'active' && connection.type === 'data' && (
        <AnimatedPacket pathD={pathD} color={style.color} />
      )}

      {/* Connection type indicator at midpoint */}
      <circle
        cx={midX}
        cy={midY}
        r="6"
        fill="#1e293b"
        stroke={style.color}
        strokeWidth="1.5"
      />
      <text
        x={midX}
        y={midY}
        textAnchor="middle"
        dominantBaseline="central"
        fill={style.color}
        fontSize="6"
        fontWeight="bold"
      >
        {connection.type[0].toUpperCase()}
      </text>
    </g>
  );
}
