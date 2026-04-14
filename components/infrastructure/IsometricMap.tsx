'use client';

import { useState, useRef, useEffect } from 'react';
import { InfraNode as InfraNodeType, NodeConnection as ConnectionType, InfraZone, AIOperator } from '@/lib/types';
import InfraNode from './InfraNode';
import NodeConnection from './NodeConnection';
import ZoneOverlay from './ZoneOverlay';
import { ZoomIn, ZoomOut, Maximize2, Move } from 'lucide-react';

interface IsometricMapProps {
  nodes: InfraNodeType[];
  connections: ConnectionType[];
  zones: InfraZone[];
  operators: AIOperator[];
  selectedNodeId?: string | null;
  selectedZoneId?: string | null;
  onNodeSelect?: (node: InfraNodeType | null) => void;
  onZoneSelect?: (zone: InfraZone | null) => void;
}

export default function IsometricMap({
  nodes,
  connections,
  zones,
  operators,
  selectedNodeId,
  selectedZoneId,
  onNodeSelect,
  onZoneSelect,
}: IsometricMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.85);
  const [position, setPosition] = useState({ x: 50, y: 30 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Handle zoom
  const handleZoom = (delta: number) => {
    setScale(prev => Math.min(Math.max(prev + delta, 0.3), 1.5));
  };

  // Handle pan
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) { // Left click
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Reset view
  const resetView = () => {
    setScale(0.85);
    setPosition({ x: 50, y: 30 });
  };

  // Handle wheel zoom
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.05 : 0.05;
      handleZoom(delta);
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden bg-slate-950">
      {/* Grid Background */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />
      
      {/* Map Container */}
      <div
        ref={containerRef}
        className={`relative w-full h-full ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Transformed Content */}
        <div
          className="absolute transition-transform duration-100"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: 'top left',
          }}
        >
          {/* Zone Overlays (Background) */}
          {zones.map(zone => (
            <ZoneOverlay
              key={zone.id}
              zone={zone}
              operator={operators.find(op => op.assignedZone === zone.id)}
              isSelected={selectedZoneId === zone.id}
              onClick={(z) => onZoneSelect?.(z)}
            />
          ))}
          
          {/* Connections (SVG Layer) */}
          <svg 
            className="absolute inset-0 pointer-events-none"
            style={{ width: 1200, height: 700 }}
          >
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <g filter="url(#glow)">
              {connections.map(conn => (
                <NodeConnection
                  key={conn.id}
                  connection={conn}
                  nodes={nodes}
                  scale={scale}
                />
              ))}
            </g>
          </svg>
          
          {/* Nodes */}
          {nodes.map(node => (
            <InfraNode
              key={node.id}
              node={node}
              isSelected={selectedNodeId === node.id}
              onClick={(n) => onNodeSelect?.(n)}
              scale={1}
            />
          ))}
        </div>
      </div>
      
      {/* Zoom Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2 bg-slate-900/90 backdrop-blur-sm rounded-lg p-2 border border-slate-700">
        <button
          onClick={() => handleZoom(0.1)}
          className="p-2 hover:bg-slate-800 rounded transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4 text-white" />
        </button>
        <button
          onClick={() => handleZoom(-0.1)}
          className="p-2 hover:bg-slate-800 rounded transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4 text-white" />
        </button>
        <div className="w-full h-px bg-slate-700" />
        <button
          onClick={resetView}
          className="p-2 hover:bg-slate-800 rounded transition-colors"
          title="Reset View"
        >
          <Maximize2 className="w-4 h-4 text-white" />
        </button>
      </div>
      
      {/* Pan Indicator */}
      <div className="absolute bottom-4 left-4 flex items-center gap-2 text-xs text-slate-500">
        <Move className="w-3 h-3" />
        <span>Drag to pan</span>
        <span className="text-slate-600">|</span>
        <span>Scroll to zoom</span>
      </div>
      
      {/* Scale Indicator */}
      <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-sm rounded px-2 py-1 text-xs text-slate-400 font-mono">
        {Math.round(scale * 100)}%
      </div>
    </div>
  );
}
