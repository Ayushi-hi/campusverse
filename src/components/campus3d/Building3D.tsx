import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Building } from '../../types';
import { campusTo3D } from './coordinateUtils';
import { Users, DoorOpen } from 'lucide-react';

interface Building3DProps {
  building: Building;
  isSelected: boolean;
  isHovered: boolean;
  isDestination: boolean;
  isOrigin: boolean;
  isStudentHere: boolean;
  inspectedFloor?: number; // 0 = standard/all, 1..N = specific floor focus
  isXRayMode?: boolean;
  lightingMode: 'day' | 'sunset' | 'night';
  onSelect: (building: Building) => void;
  onHover: (building: Building | null) => void;
}

export const Building3D: React.FC<Building3DProps> = ({
  building,
  isSelected,
  isHovered,
  isDestination,
  isOrigin,
  isStudentHere,
  inspectedFloor = 0,
  isXRayMode = false,
  lightingMode,
  onSelect,
  onHover
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const isNight = lightingMode === 'night';
  const isSunset = lightingMode === 'sunset';

  // Base 3D Coordinates
  const [posX, , posZ] = campusTo3D(building.x, building.y, 0);

  // Scaled dimensions
  const baseWidth = Math.max(8.5, (building.width / 100) * 16.5);
  const baseDepth = Math.max(7.5, (building.height / 100) * 14.5);
  const floorHeight = 1.85;
  const totalHeight = building.floors * floorHeight;

  // Animate hover and selection bobbing
  useFrame((state, delta) => {
    if (ringRef.current && (isSelected || isDestination)) {
      ringRef.current.rotation.z += delta * 1.6;
    }
    if (groupRef.current) {
      // Subtle float when hovered
      const targetY = isHovered ? 0.35 : isSelected ? 0.15 : 0;
      groupRef.current.position.y += (targetY - groupRef.current.position.y) * 0.15;
    }
  });

  // Base Wall Colors & Materials - Crisp Modern Architecture (Off-white / Light stone in daylight)
  const baseWallColor = isNight 
    ? '#0f172a' 
    : isSunset 
      ? '#fde68a' 
      : '#f8fafc'; // Crisp off-white limestone
  
  const trimColor = isNight 
    ? '#1e293b' 
    : isSunset 
      ? '#fed7aa' 
      : '#e2e8f0';

  const glassColor = isNight 
    ? '#38bdf8' 
    : isSunset 
      ? '#f59e0b' 
      : '#38bdf8';

  const accentColor = building.accentColor || building.color;

  const wallOpacity = isXRayMode && isSelected ? 0.28 : 1.0;
  const isWallTransparent = isXRayMode && isSelected;

  // Find rooms on inspected floor if selected
  const floorRooms = inspectedFloor > 0 
    ? building.rooms.filter(r => r.floor === inspectedFloor)
    : [];

  // Render Building Geometry specific to building architecture
  const renderBuildingMesh = () => {
    switch (building.id) {
      case 'block-a':
        // Academic Wing: 4-floor multi-tiered building with prominent entrance portico & solar roof
        return (
          <group position={[0, totalHeight / 2, 0]}>
            {/* Main Facade Body */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[baseWidth, totalHeight, baseDepth]} />
              <meshStandardMaterial 
                color={baseWallColor} 
                roughness={0.25} 
                metalness={0.1}
                transparent={isWallTransparent}
                opacity={wallOpacity}
              />
            </mesh>

            {/* Horizontal Glass Bands for Each Floor */}
            {Array.from({ length: building.floors }).map((_, fIdx) => {
              const yOffset = -totalHeight / 2 + fIdx * floorHeight + floorHeight / 2;
              const isFloorFocused = inspectedFloor === fIdx + 1;
              return (
                <group key={fIdx} position={[0, yOffset, 0]}>
                  {/* Front Facade Glass */}
                  <mesh position={[0, 0, baseDepth / 2 + 0.05]}>
                    <planeGeometry args={[baseWidth * 0.86, floorHeight * 0.58]} />
                    <meshStandardMaterial 
                      color={isFloorFocused ? '#38bdf8' : glassColor} 
                      emissive={isFloorFocused ? '#38bdf8' : (isNight ? accentColor : '#e0f2fe')} 
                      emissiveIntensity={isFloorFocused ? 1.5 : (isNight ? 0.8 : 0.25)}
                      roughness={0.1}
                      metalness={0.8}
                      transparent
                      opacity={0.88}
                    />
                  </mesh>
                  {/* Back Facade Glass */}
                  <mesh position={[0, 0, -baseDepth / 2 - 0.05]} rotation={[0, Math.PI, 0]}>
                    <planeGeometry args={[baseWidth * 0.86, floorHeight * 0.58]} />
                    <meshStandardMaterial 
                      color={glassColor} 
                      roughness={0.1}
                      metalness={0.8}
                    />
                  </mesh>
                  {/* Floor Divider Slab Trim */}
                  <mesh position={[0, -floorHeight / 2, 0]}>
                    <boxGeometry args={[baseWidth + 0.15, 0.12, baseDepth + 0.15]} />
                    <meshStandardMaterial color={trimColor} />
                  </mesh>
                </group>
              );
            })}

            {/* Entrance Canopy */}
            <group position={[0, -totalHeight / 2 + 1.2, baseDepth / 2 + 1.2]}>
              <mesh castShadow>
                <boxGeometry args={[baseWidth * 0.45, 0.2, 2.2]} />
                <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={isNight ? 0.8 : 0.2} />
              </mesh>
              <mesh position={[-baseWidth * 0.2, -0.6, 0.9]} castShadow>
                <cylinderGeometry args={[0.08, 0.08, 1.2, 8]} />
                <meshStandardMaterial color="#64748b" metalness={0.8} />
              </mesh>
              <mesh position={[baseWidth * 0.2, -0.6, 0.9]} castShadow>
                <cylinderGeometry args={[0.08, 0.08, 1.2, 8]} />
                <meshStandardMaterial color="#64748b" metalness={0.8} />
              </mesh>
            </group>

            {/* Rooftop Solar Panels */}
            <mesh position={[0, totalHeight / 2 + 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[baseWidth * 0.9, baseDepth * 0.85]} />
              <meshStandardMaterial color="#0369a1" metalness={0.85} roughness={0.2} />
            </mesh>
          </group>
        );

      case 'block-b':
        // Engineering Wing: Twin towers connected by glowing skybridge
        const towerWidth = baseWidth * 0.42;
        const bridgeY = totalHeight * 0.6;
        return (
          <group position={[0, totalHeight / 2, 0]}>
            {/* Left Tower */}
            <mesh position={[-baseWidth * 0.28, 0, 0]} castShadow receiveShadow>
              <boxGeometry args={[towerWidth, totalHeight, baseDepth]} />
              <meshStandardMaterial 
                color={baseWallColor} 
                roughness={0.3}
                transparent={isWallTransparent}
                opacity={wallOpacity}
              />
            </mesh>
            {/* Right Tower */}
            <mesh position={[baseWidth * 0.28, 0, 0]} castShadow receiveShadow>
              <boxGeometry args={[towerWidth, totalHeight * 1.1, baseDepth]} />
              <meshStandardMaterial 
                color={baseWallColor} 
                roughness={0.3}
                transparent={isWallTransparent}
                opacity={wallOpacity}
              />
            </mesh>

            {/* Glowing Skybridge linking the towers */}
            <mesh position={[0, bridgeY - totalHeight / 2, 0]} castShadow>
              <boxGeometry args={[baseWidth * 0.35, 1.6, baseDepth * 0.5]} />
              <meshStandardMaterial 
                color="#8b5cf6" 
                emissive="#8b5cf6" 
                emissiveIntensity={isNight ? 1.0 : 0.4} 
                transparent
                opacity={0.9} 
              />
            </mesh>

            {/* Server Antennas on Right Tower */}
            <group position={[baseWidth * 0.28, totalHeight * 0.55 + 0.5, 0]}>
              <mesh>
                <cylinderGeometry args={[0.04, 0.04, 2.0, 8]} />
                <meshStandardMaterial color="#6366f1" emissive="#6366f1" emissiveIntensity={isNight ? 1.5 : 0.4} />
              </mesh>
              <mesh position={[0, 1.0, 0]}>
                <sphereGeometry args={[0.15, 8, 8]} />
                <meshStandardMaterial color="#ec4899" emissive="#ec4899" emissiveIntensity={1.5} />
              </mesh>
            </group>
          </group>
        );

      case 'innovation-lab':
        // Lab X: Angled cantilevered structure with cyan glass and rooftop drone pad
        return (
          <group position={[0, totalHeight / 2, 0]}>
            {/* Base lower floor */}
            <mesh position={[0, -totalHeight * 0.25, 0]} castShadow receiveShadow>
              <boxGeometry args={[baseWidth * 0.9, totalHeight * 0.5, baseDepth * 0.9]} />
              <meshStandardMaterial color={baseWallColor} roughness={0.3} />
            </mesh>
            {/* Overhanging Cantilever Top Floor */}
            <mesh position={[1.2, totalHeight * 0.25, 0]} castShadow receiveShadow>
              <boxGeometry args={[baseWidth * 1.05, totalHeight * 0.5, baseDepth * 1.05]} />
              <meshStandardMaterial 
                color={isNight ? '#082f49' : '#f0fdf4'} 
                roughness={0.2}
                transparent={isWallTransparent}
                opacity={wallOpacity}
              />
            </mesh>
            {/* Giant Slanted Front Glass Wall */}
            <mesh position={[1.2, totalHeight * 0.25, baseDepth * 0.53 + 0.05]} rotation={[-0.1, 0, 0]}>
              <planeGeometry args={[baseWidth, totalHeight * 0.45]} />
              <meshStandardMaterial 
                color="#06b6d4" 
                emissive="#06b6d4" 
                emissiveIntensity={isNight ? 1.4 : 0.4} 
                transparent 
                opacity={0.88} 
              />
            </mesh>
            {/* Rooftop Drone Landing Pad Ring */}
            <mesh position={[1.2, totalHeight * 0.5 + 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[2.0, 2.3, 32]} />
              <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={1.5} side={THREE.DoubleSide} />
            </mesh>
            <mesh position={[1.2, totalHeight * 0.5 + 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[1.5, 1.5]} />
              <meshStandardMaterial color="#0891b2" />
            </mesh>
          </group>
        );

      case 'central-library':
        // 5-floor Knowledge Commons with central glass atrium and tiered stepped terraces
        return (
          <group position={[0, totalHeight / 2, 0]}>
            {/* Stepped Terraces */}
            <mesh position={[0, -totalHeight * 0.3, 0]} castShadow receiveShadow>
              <boxGeometry args={[baseWidth * 1.1, totalHeight * 0.4, baseDepth * 1.1]} />
              <meshStandardMaterial color={baseWallColor} roughness={0.3} />
            </mesh>
            <mesh position={[0, 0, 0]} castShadow receiveShadow>
              <boxGeometry args={[baseWidth * 0.95, totalHeight * 0.35, baseDepth * 0.95]} />
              <meshStandardMaterial color={baseWallColor} roughness={0.3} />
            </mesh>
            <mesh position={[0, totalHeight * 0.3, 0]} castShadow receiveShadow>
              <boxGeometry args={[baseWidth * 0.8, totalHeight * 0.35, baseDepth * 0.8]} />
              <meshStandardMaterial color={baseWallColor} roughness={0.3} />
            </mesh>
            {/* Central Vertical Glass Atrium */}
            <mesh position={[0, 0, baseDepth * 0.55 + 0.05]}>
              <boxGeometry args={[3.2, totalHeight * 0.95, 0.2]} />
              <meshStandardMaterial 
                color="#10b981" 
                emissive="#10b981" 
                emissiveIntensity={isNight ? 1.5 : 0.4} 
                transparent 
                opacity={0.9} 
              />
            </mesh>
            {/* Rooftop Garden Greenery */}
            <mesh position={[0, totalHeight * 0.48, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[baseWidth * 0.7, baseDepth * 0.7]} />
              <meshStandardMaterial color="#16a34a" roughness={0.8} />
            </mesh>
          </group>
        );

      case 'auditorium':
        // Grand Auditorium: Sweeping curved arch / shell amphitheatre roof
        return (
          <group position={[0, totalHeight / 2, 0]}>
            {/* Main Stage Arch / Vault */}
            <mesh position={[0, 0, 0]} rotation={[0, 0, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[baseWidth * 0.45, baseWidth * 0.52, totalHeight, 32, 1, false, 0, Math.PI]} />
              <meshStandardMaterial 
                color={baseWallColor} 
                roughness={0.25} 
                side={THREE.DoubleSide} 
                transparent={isWallTransparent}
                opacity={wallOpacity}
              />
            </mesh>
            {/* Front Glass Entrance */}
            <mesh position={[0, -totalHeight * 0.2, baseDepth * 0.4]}>
              <boxGeometry args={[baseWidth * 0.75, totalHeight * 0.6, 0.2]} />
              <meshStandardMaterial 
                color="#f43f5e" 
                emissive="#f43f5e" 
                emissiveIntensity={isNight ? 1.6 : 0.4} 
                transparent 
                opacity={0.9} 
              />
            </mesh>
            {/* Structural Rib Arches */}
            {[-baseDepth * 0.25, 0, baseDepth * 0.25].map((zPos, idx) => (
              <mesh key={idx} position={[0, 0.1, zPos]} rotation={[0, 0, 0]}>
                <torusGeometry args={[baseWidth * 0.5, 0.15, 8, 24, Math.PI]} />
                <meshStandardMaterial color="#fb7185" emissive="#fb7185" emissiveIntensity={isNight ? 2.0 : 0.4} />
              </mesh>
            ))}
          </group>
        );

      case 'canteen':
        // Food Court: 2-floor pavilion with outdoor terrace
        return (
          <group position={[0, totalHeight / 2, 0]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[baseWidth, totalHeight, baseDepth]} />
              <meshStandardMaterial color={baseWallColor} roughness={0.3} />
            </mesh>
            {/* Warm Glass Windows */}
            <mesh position={[0, 0, baseDepth / 2 + 0.05]}>
              <planeGeometry args={[baseWidth * 0.85, totalHeight * 0.6]} />
              <meshStandardMaterial 
                color="#f97316" 
                emissive="#f97316" 
                emissiveIntensity={isNight ? 1.8 : 0.5} 
                transparent 
                opacity={0.85} 
              />
            </mesh>
            {/* Rooftop Chill Terrace */}
            <mesh position={[0, totalHeight / 2 + 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[baseWidth * 0.9, baseDepth * 0.9]} />
              <meshStandardMaterial color="#fdba74" roughness={0.6} />
            </mesh>
            {/* Cafe Umbrellas */}
            {[-baseWidth * 0.25, baseWidth * 0.25].map((xOffset, idx) => (
              <group key={idx} position={[xOffset, totalHeight / 2 + 0.8, 0]}>
                <mesh>
                  <cylinderGeometry args={[0.04, 0.04, 1.5, 8]} />
                  <meshStandardMaterial color="#64748b" />
                </mesh>
                <mesh position={[0, 0.75, 0]}>
                  <coneGeometry args={[1.0, 0.4, 8]} />
                  <meshStandardMaterial color="#f97316" emissive="#f97316" emissiveIntensity={0.3} />
                </mesh>
              </group>
            ))}
          </group>
        );

      case 'tech-hub':
        // Startup Hub: Modern glass incubator with digital screen
        return (
          <group position={[0, totalHeight / 2, 0]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[baseWidth, totalHeight, baseDepth]} />
              <meshStandardMaterial 
                color={baseWallColor} 
                roughness={0.3}
                transparent={isWallTransparent}
                opacity={wallOpacity}
              />
            </mesh>
            {/* Magenta Glass Facade */}
            <mesh position={[0, 0, baseDepth / 2 + 0.05]}>
              <planeGeometry args={[baseWidth * 0.85, totalHeight * 0.7]} />
              <meshStandardMaterial 
                color="#ec4899" 
                emissive="#ec4899" 
                emissiveIntensity={isNight ? 1.6 : 0.5} 
                transparent 
                opacity={0.85} 
              />
            </mesh>
            {/* Angled Digital Screen on Roof */}
            <group position={[0, totalHeight / 2 + 1.0, -baseDepth * 0.2]} rotation={[0.2, 0, 0]}>
              <mesh>
                <boxGeometry args={[baseWidth * 0.7, 1.4, 0.15]} />
                <meshStandardMaterial color="#1e293b" />
              </mesh>
              <mesh position={[0, 0, 0.09]}>
                <planeGeometry args={[baseWidth * 0.65, 1.2]} />
                <meshStandardMaterial color="#f472b6" emissive="#f472b6" emissiveIntensity={isNight ? 2.5 : 0.8} />
              </mesh>
            </group>
          </group>
        );

      case 'sports-complex':
        // Arena: Barrel vaulted stadium roof with skylights
        return (
          <group position={[0, totalHeight / 2, 0]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[baseWidth, totalHeight * 0.7, baseDepth]} />
              <meshStandardMaterial color={baseWallColor} roughness={0.3} />
            </mesh>
            {/* Vaulted Arena Roof */}
            <mesh position={[0, totalHeight * 0.35, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[baseDepth * 0.5, baseDepth * 0.5, baseWidth * 0.95, 24, 1, false, 0, Math.PI]} />
              <meshStandardMaterial color="#0284c7" roughness={0.3} metalness={0.3} />
            </mesh>
            {/* Skylight Strip */}
            <mesh position={[0, totalHeight * 0.85, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[baseWidth * 0.8, 1.5]} />
              <meshStandardMaterial 
                color="#38bdf8" 
                emissive="#38bdf8" 
                emissiveIntensity={isNight ? 2 : 0.6} 
                transparent 
                opacity={0.9} 
              />
            </mesh>
          </group>
        );

      default:
        // Default standard modern building
        return (
          <group position={[0, totalHeight / 2, 0]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[baseWidth, totalHeight, baseDepth]} />
              <meshStandardMaterial 
                color={baseWallColor} 
                roughness={0.3}
                transparent={isWallTransparent}
                opacity={wallOpacity}
              />
            </mesh>
            <mesh position={[0, 0, baseDepth / 2 + 0.05]}>
              <planeGeometry args={[baseWidth * 0.8, totalHeight * 0.6]} />
              <meshStandardMaterial 
                color={accentColor} 
                emissive={accentColor} 
                emissiveIntensity={isNight ? 1.0 : 0.3} 
                transparent 
                opacity={0.8} 
              />
            </mesh>
          </group>
        );
    }
  };

  return (
    <group
      ref={groupRef}
      position={[posX, 0, posZ]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(building);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
        onHover(building);
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto';
        onHover(null);
      }}
    >
      {/* Interactive Selection Ring / Glowing Base */}
      {(isSelected || isDestination || isHovered) && (
        <group position={[0, 0.06, 0]}>
          <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[baseWidth * 0.65, baseWidth * 0.75, 36]} />
            <meshBasicMaterial 
              color={isDestination ? '#10b981' : isSelected ? '#0284c7' : '#38bdf8'} 
              side={THREE.DoubleSide} 
              transparent 
              opacity={0.85} 
            />
          </mesh>
          {/* Subtle Vertical Beacon */}
          {isSelected && (
            <mesh position={[0, totalHeight + 6, 0]}>
              <cylinderGeometry args={[0.08, baseWidth * 0.35, 12, 16, 1, true]} />
              <meshBasicMaterial 
                color={isDestination ? '#10b981' : '#0284c7'} 
                transparent 
                opacity={0.2} 
                side={THREE.DoubleSide} 
              />
            </mesh>
          )}
        </group>
      )}

      {/* Building 3D Mesh */}
      {renderBuildingMesh()}

      {/* Roof Edge Trim Accent */}
      <mesh position={[0, totalHeight + 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[baseWidth + 0.2, baseDepth + 0.2]} />
        <meshStandardMaterial 
          color={accentColor} 
          emissive={accentColor} 
          emissiveIntensity={isNight ? 1.5 : 0.4} 
          wireframe 
        />
      </mesh>

      {/* 3D Code Badge Billboard at Building Top */}
      <Html
        position={[0, totalHeight + 1.8, 0]}
        center
        distanceFactor={45}
        zIndexRange={[90, 0]}
      >
        <div 
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold shadow-lg select-none backdrop-blur-md transition-all cursor-pointer ${
            isSelected 
              ? 'bg-slate-900 text-white ring-2 ring-blue-500 scale-110 shadow-blue-500/30' 
              : 'bg-white/95 text-slate-800 border border-slate-200 hover:scale-105 shadow-md'
          }`}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(building);
          }}
        >
          <span 
            className="w-2.5 h-2.5 rounded-full shrink-0" 
            style={{ backgroundColor: building.color }} 
          />
          <span className="font-mono text-[11px]">{building.code}</span>
          <span className="text-[11px] font-semibold text-slate-600 hidden sm:inline">{building.name.split(' ')[0]}</span>
        </div>
      </Html>

      {/* In-3D Floor Room Labels if a specific floor is being inspected */}
      {isSelected && inspectedFloor > 0 && floorRooms.length > 0 && (
        <Html
          position={[0, (inspectedFloor - 0.5) * floorHeight, baseDepth / 2 + 1.5]}
          center
          distanceFactor={38}
          zIndexRange={[110, 0]}
        >
          <div className="bg-white/95 backdrop-blur-md border border-blue-500/50 shadow-2xl rounded-xl p-2.5 text-xs text-slate-800 min-w-[200px] pointer-events-auto">
            <div className="flex items-center justify-between font-bold text-[11px] text-blue-600 border-b border-slate-200 pb-1 mb-1.5">
              <span>Floor {inspectedFloor} Interior</span>
              <span>{floorRooms.length} Rooms</span>
            </div>
            <div className="space-y-1 max-h-36 overflow-y-auto">
              {floorRooms.map(r => (
                <div key={r.id} className="flex items-center justify-between text-[10px] bg-slate-50 p-1 rounded border border-slate-100">
                  <div className="font-semibold text-slate-700 truncate max-w-[110px]">{r.name}</div>
                  <div className="flex items-center gap-1 text-slate-500">
                    <Users className="w-2.5 h-2.5" />
                    <span>{r.currentOccupancy ?? (r.isOccupied ? Math.round(r.capacity * 0.75) : 0)}/{r.capacity}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
};
