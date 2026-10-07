import React, { useMemo } from 'react';
import * as THREE from 'three';
import { ThreeEvent } from '@react-three/fiber';

interface CampusTerrain3DProps {
  lightingMode: 'day' | 'sunset' | 'night';
  onGroundClick?: (point: [number, number, number]) => void;
}

export const CampusTerrain3D: React.FC<CampusTerrain3DProps> = ({ 
  lightingMode,
  onGroundClick 
}) => {
  const isNight = lightingMode === 'night';
  const isSunset = lightingMode === 'sunset';

  // Ground and terrain colors for bright daylight, warm sunset, or night
  const groundColor = isNight ? '#0b1329' : isSunset ? '#2a2238' : '#e2e8f0';
  const lawnGrassColor = isNight ? '#064e3b' : isSunset ? '#166534' : '#22c55e';
  const avenueRoadColor = isNight ? '#111827' : isSunset ? '#334155' : '#f8fafc';
  const walkwayCurbColor = isNight ? '#1e293b' : isSunset ? '#475569' : '#cbd5e1';
  const neonCurbGlow = isNight ? '#00f0ff' : isSunset ? '#f59e0b' : '#38bdf8';
  const gridPrimary = isNight ? '#00f0ff' : isSunset ? '#fbbf24' : '#94a3b8';
  const gridSecondary = isNight ? '#1e293b' : isSunset ? '#475569' : '#cbd5e1';

  // Tree locations around campus
  const treePositions = useMemo(() => [
    // Around central lawn
    [-18, 0, -8], [-22, 0, 4], [-16, 0, 14],
    [18, 0, -8], [22, 0, 4], [16, 0, 14],
    [-8, 0, -18], [8, 0, -18], [-12, 0, 18], [12, 0, 18],
    // Near Block A & B
    [-42, 0, -32], [-28, 0, -40], [-16, 0, -36],
    [42, 0, -32], [28, 0, -40], [16, 0, -36],
    // Near Lab and Auditorium
    [-52, 0, -2], [-52, 0, 10], [-42, 0, 20],
    [52, 0, -2], [52, 0, 10], [42, 0, 20],
    // Near Canteen & Tech Hub
    [-45, 0, 38], [-32, 0, 46], [-15, 0, 42],
    [45, 0, 38], [32, 0, 46], [15, 0, 42],
    // Grove park corners
    [-54, 0, -42], [-50, 0, -46], [54, 0, -42], [50, 0, -46],
    [-54, 0, 46], [54, 0, 46]
  ], []);

  // Street lamp locations
  const lampPositions = useMemo(() => [
    [-30, 0, -15], [-15, 0, -15], [15, 0, -15], [30, 0, -15],
    [-30, 0, 0], [30, 0, 0],
    [-30, 0, 15], [-15, 0, 15], [15, 0, 15], [30, 0, 15],
    [0, 0, -30], [0, 0, -15], [0, 0, 15], [0, 0, 30],
    [-35, 0, 32], [35, 0, 32]
  ], []);

  // Benches around the central quad
  const benchPositions = useMemo(() => [
    { pos: [-14, 0, -10] as [number, number, number], rot: Math.PI / 4 },
    { pos: [14, 0, -10] as [number, number, number], rot: -Math.PI / 4 },
    { pos: [-14, 0, 10] as [number, number, number], rot: 3 * Math.PI / 4 },
    { pos: [14, 0, 10] as [number, number, number], rot: -3 * Math.PI / 4 },
    { pos: [0, 0, -16] as [number, number, number], rot: 0 },
    { pos: [0, 0, 16] as [number, number, number], rot: Math.PI },
  ], []);

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (onGroundClick) {
      onGroundClick([e.point.x, e.point.y, e.point.z]);
    }
  };

  return (
    <group name="campus-terrain">
      {/* 1. Base Ground Slab with Click Detection */}
      <mesh 
        position={[0, -0.6, 0]} 
        receiveShadow
        onPointerDown={handlePointerDown}
      >
        <boxGeometry args={[140, 1.2, 110]} />
        <meshStandardMaterial 
          color={groundColor} 
          roughness={0.8} 
          metalness={0.05} 
        />
      </mesh>

      {/* Modern architectural grid lines */}
      <gridHelper 
        args={[130, 65, gridPrimary, gridSecondary]} 
        position={[0, 0.01, 0]} 
      />

      {/* 2. Main Paved Pedestrian Avenues (Light limestone pavers) */}
      {/* North-South Central Spine */}
      <mesh position={[0, 0.02, 0]} receiveShadow onPointerDown={handlePointerDown}>
        <boxGeometry args={[8.5, 0.05, 98]} />
        <meshStandardMaterial color={avenueRoadColor} roughness={0.4} />
      </mesh>
      {/* East-West Cross Boulevard */}
      <mesh position={[0, 0.02, 0]} receiveShadow onPointerDown={handlePointerDown}>
        <boxGeometry args={[118, 0.05, 8.5]} />
        <meshStandardMaterial color={avenueRoadColor} roughness={0.4} />
      </mesh>

      {/* Diagonal Connecting Walkways */}
      <mesh position={[-25, 0.02, -18]} rotation={[0, Math.PI / 5, 0]} receiveShadow onPointerDown={handlePointerDown}>
        <boxGeometry args={[6.5, 0.04, 52]} />
        <meshStandardMaterial color={avenueRoadColor} roughness={0.4} />
      </mesh>
      <mesh position={[25, 0.02, -18]} rotation={[0, -Math.PI / 5, 0]} receiveShadow onPointerDown={handlePointerDown}>
        <boxGeometry args={[6.5, 0.04, 52]} />
        <meshStandardMaterial color={avenueRoadColor} roughness={0.4} />
      </mesh>
      <mesh position={[-25, 0.02, 22]} rotation={[0, -Math.PI / 5, 0]} receiveShadow onPointerDown={handlePointerDown}>
        <boxGeometry args={[6.5, 0.04, 50]} />
        <meshStandardMaterial color={avenueRoadColor} roughness={0.4} />
      </mesh>
      <mesh position={[25, 0.02, 22]} rotation={[0, Math.PI / 5, 0]} receiveShadow onPointerDown={handlePointerDown}>
        <boxGeometry args={[6.5, 0.04, 50]} />
        <meshStandardMaterial color={avenueRoadColor} roughness={0.4} />
      </mesh>

      {/* Subtle Curbs / Walkway Border Trims */}
      <mesh position={[4.35, 0.06, 0]}>
        <boxGeometry args={[0.2, 0.07, 98]} />
        <meshStandardMaterial 
          color={walkwayCurbColor} 
          emissive={neonCurbGlow} 
          emissiveIntensity={isNight ? 1.0 : 0.2} 
        />
      </mesh>
      <mesh position={[-4.35, 0.06, 0]}>
        <boxGeometry args={[0.2, 0.07, 98]} />
        <meshStandardMaterial 
          color={walkwayCurbColor} 
          emissive={neonCurbGlow} 
          emissiveIntensity={isNight ? 1.0 : 0.2} 
        />
      </mesh>
      <mesh position={[0, 0.06, 4.35]}>
        <boxGeometry args={[118, 0.07, 0.2]} />
        <meshStandardMaterial 
          color={walkwayCurbColor} 
          emissive={neonCurbGlow} 
          emissiveIntensity={isNight ? 1.0 : 0.2} 
        />
      </mesh>
      <mesh position={[0, 0.06, -4.35]}>
        <boxGeometry args={[118, 0.07, 0.2]} />
        <meshStandardMaterial 
          color={walkwayCurbColor} 
          emissive={neonCurbGlow} 
          emissiveIntensity={isNight ? 1.0 : 0.2} 
        />
      </mesh>

      {/* 3. Central Quad / Sunlit Green Lawn Amphitheatre */}
      <group position={[0, 0.04, -2]}>
        {/* Lush Grass Mound */}
        <mesh position={[0, 0.05, 0]} receiveShadow onPointerDown={handlePointerDown}>
          <cylinderGeometry args={[18, 19, 0.15, 48]} />
          <meshStandardMaterial 
            color={lawnGrassColor} 
            roughness={0.7} 
          />
        </mesh>
        {/* Tiered Amphitheatre Outer Stone Steps */}
        <mesh position={[0, 0.15, 0]} receiveShadow>
          <cylinderGeometry args={[13, 14, 0.15, 48]} />
          <meshStandardMaterial color={walkwayCurbColor} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.25, 0]} receiveShadow>
          <cylinderGeometry args={[9, 10, 0.15, 48]} />
          <meshStandardMaterial color={isNight ? '#1e1b4b' : '#e2e8f0'} roughness={0.5} />
        </mesh>
        {/* Central Reflective Water Fountain / Stage */}
        <mesh position={[0, 0.3, 0]}>
          <cylinderGeometry args={[5.5, 5.5, 0.1, 36]} />
          <meshStandardMaterial 
            color={isNight ? '#00f0ff' : '#0284c7'} 
            metalness={0.9} 
            roughness={0.08}
            emissive={isNight ? '#00f0ff' : '#38bdf8'}
            emissiveIntensity={isNight ? 0.8 : 0.3}
            transparent
            opacity={0.88}
          />
        </mesh>
        {/* Water Ring Rim */}
        <mesh position={[0, 0.36, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[5.2, 5.6, 40]} />
          <meshStandardMaterial 
            color={isNight ? '#38bdf8' : '#0284c7'} 
            emissive="#38bdf8" 
            emissiveIntensity={isNight ? 1.5 : 0.4} 
            side={THREE.DoubleSide} 
          />
        </mesh>
      </group>

      {/* 4. Outdoor Sports Arena (Bright Basketball & Tennis Court) */}
      <group position={[0, 0.05, 38]}>
        {/* Court Surface */}
        <mesh position={[0, 0.02, 0]} receiveShadow>
          <boxGeometry args={[26, 0.06, 16]} />
          <meshStandardMaterial 
            color={isNight ? '#0f172a' : '#0284c7'} 
            roughness={0.3} 
          />
        </mesh>
        {/* Inner Court Terracotta Area */}
        <mesh position={[0, 0.04, 0]} receiveShadow>
          <boxGeometry args={[22, 0.03, 13]} />
          <meshStandardMaterial 
            color={isNight ? '#1e293b' : '#ea580c'} 
            roughness={0.3} 
          />
        </mesh>
        {/* Court Perimeter White Lines */}
        <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[20, 11]} />
          <meshBasicMaterial color="#ffffff" wireframe />
        </mesh>
        {/* Center Court Circle */}
        <mesh position={[0, 0.07, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.5, 2.7, 24]} />
          <meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} />
        </mesh>
        {/* Basketball Hoops */}
        {[-12, 12].map((xOffset, idx) => (
          <group key={idx} position={[xOffset, 0, 0]} rotation={[0, idx === 0 ? Math.PI / 2 : -Math.PI / 2, 0]}>
            {/* Pole */}
            <mesh position={[0, 1.8, 0]}>
              <cylinderGeometry args={[0.08, 0.08, 3.6, 12]} />
              <meshStandardMaterial color="#64748b" metalness={0.7} />
            </mesh>
            {/* Backboard */}
            <mesh position={[0, 3.2, 0.6]}>
              <boxGeometry args={[1.6, 1.1, 0.06]} />
              <meshStandardMaterial color="#ffffff" transparent opacity={0.9} roughness={0.2} />
            </mesh>
            {/* Hoop Rim */}
            <mesh position={[0, 2.9, 0.9]} rotation={[-Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.3, 0.04, 8, 16]} />
              <meshStandardMaterial color="#f97316" emissive="#f97316" emissiveIntensity={0.6} />
            </mesh>
          </group>
        ))}
      </group>

      {/* 5. Lush Campus Trees with Rich Green Canopies */}
      <group name="campus-trees">
        {treePositions.map((pos, idx) => {
          const scale = 0.85 + (idx % 4) * 0.15;
          const foliageType = idx % 2;
          return (
            <group key={idx} position={pos as [number, number, number]} scale={[scale, scale, scale]}>
              {/* Natural Wood Trunk */}
              <mesh position={[0, 1.2, 0]} castShadow>
                <cylinderGeometry args={[0.2, 0.35, 2.4, 8]} />
                <meshStandardMaterial color="#78350f" roughness={0.9} />
              </mesh>
              {/* Foliage Canopy */}
              {foliageType === 0 ? (
                // Lush layered pine/cone
                <>
                  <mesh position={[0, 2.8, 0]} castShadow>
                    <coneGeometry args={[1.6, 2.2, 8]} />
                    <meshStandardMaterial color={isNight ? '#064e3b' : '#15803d'} roughness={0.6} flatShading />
                  </mesh>
                  <mesh position={[0, 4.1, 0]} castShadow>
                    <coneGeometry args={[1.3, 1.9, 8]} />
                    <meshStandardMaterial color={isNight ? '#059669' : '#16a34a'} roughness={0.6} flatShading />
                  </mesh>
                  <mesh position={[0, 5.2, 0]} castShadow>
                    <coneGeometry args={[0.9, 1.5, 8]} />
                    <meshStandardMaterial color={isNight ? '#10b981' : '#22c55e'} roughness={0.6} flatShading />
                  </mesh>
                </>
              ) : (
                // Full rounded shade tree
                <mesh position={[0, 3.4, 0]} castShadow>
                  <dodecahedronGeometry args={[1.8, 1]} />
                  <meshStandardMaterial color={isNight ? '#047857' : '#16a34a'} roughness={0.7} flatShading />
                </mesh>
              )}
            </group>
          );
        })}
      </group>

      {/* 6. Modern Clean Street Lamps */}
      <group name="campus-streetlights">
        {lampPositions.map((pos, idx) => (
          <group key={idx} position={pos as [number, number, number]}>
            {/* Pole */}
            <mesh position={[0, 2.2, 0]} castShadow>
              <cylinderGeometry args={[0.07, 0.1, 4.4, 8]} />
              <meshStandardMaterial color={isNight ? '#1e293b' : '#64748b'} metalness={0.8} roughness={0.3} />
            </mesh>
            {/* Arm */}
            <mesh position={[0.4, 4.3, 0]}>
              <boxGeometry args={[0.8, 0.08, 0.08]} />
              <meshStandardMaterial color={isNight ? '#1e293b' : '#64748b'} metalness={0.8} />
            </mesh>
            {/* Glowing Lamp Head */}
            <mesh position={[0.75, 4.2, 0]}>
              <sphereGeometry args={[0.2, 12, 12]} />
              <meshStandardMaterial 
                color={isNight ? '#38bdf8' : '#fef08a'} 
                emissive={isNight ? '#38bdf8' : '#fef08a'} 
                emissiveIntensity={isNight ? 2.5 : 1.2} 
              />
            </mesh>
            {/* Night Time Point Light */}
            {isNight && (
              <pointLight 
                position={[0.75, 4.0, 0]} 
                color="#38bdf8" 
                intensity={8} 
                distance={12} 
                decay={2} 
              />
            )}
          </group>
        ))}
      </group>

      {/* 7. Campus Benches */}
      <group name="campus-benches">
        {benchPositions.map((bench, idx) => (
          <group key={idx} position={bench.pos} rotation={[0, bench.rot, 0]}>
            <mesh position={[0, 0.45, 0]} castShadow>
              <boxGeometry args={[2.0, 0.1, 0.6]} />
              <meshStandardMaterial color={isNight ? '#334155' : '#b45309'} roughness={0.5} />
            </mesh>
            <mesh position={[0, 0.85, -0.25]}>
              <boxGeometry args={[2.0, 0.5, 0.08]} />
              <meshStandardMaterial color={isNight ? '#1e293b' : '#92400e'} roughness={0.5} />
            </mesh>
            <mesh position={[-0.8, 0.22, 0]}>
              <boxGeometry args={[0.1, 0.44, 0.5]} />
              <meshStandardMaterial color="#475569" metalness={0.8} />
            </mesh>
            <mesh position={[0.8, 0.22, 0]}>
              <boxGeometry args={[0.1, 0.44, 0.5]} />
              <meshStandardMaterial color="#475569" metalness={0.8} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
};
