import React, { Suspense, useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import { Building, CampusEvent, EventCategory, NavigationRoute, StudentProfile } from '../../types';
import { CampusTerrain3D } from './CampusTerrain3D';
import { Building3D } from './Building3D';
import { EventMarker3D } from './EventMarker3D';
import { NavigationPath3D } from './NavigationPath3D';
import { StudentAvatar3D } from './StudentAvatar3D';
import { CampusCameraController, CameraPreset } from './CampusCameraController';
import { playTapSound, playTeleportSound } from '../../utils/soundEffects';

interface CampusScene3DProps {
  buildings: Building[];
  events: CampusEvent[];
  selectedBuilding: Building | null;
  selectedEvent: CampusEvent | null;
  activeCategoryFilter: EventCategory | 'all';
  isLiveMode: boolean;
  activeRoute: NavigationRoute | null;
  studentProfile: StudentProfile;
  cameraPreset: CameraPreset;
  lightingMode: 'day' | 'sunset' | 'night';
  inspectedFloor: number;
  isXRayMode: boolean;
  isBreezeWeather?: boolean;
  onSelectBuilding: (building: Building) => void;
  onSelectEvent: (event: CampusEvent) => void;
  onHoverBuilding: (building: Building | null) => void;
  hoveredBuilding: Building | null;
  onStudentTeleport?: (pos: [number, number, number]) => void;
}

// Floating animated spring breeze petals / sunlight motes
const BreezeParticles: React.FC<{ count?: number; isSunset?: boolean }> = ({ count = 80, isSunset }) => {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, velocities] = React.useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 120;
      pos[i * 3 + 1] = Math.random() * 25 + 1;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 100;

      vel[i * 3] = 0.08 + Math.random() * 0.08; // drift east
      vel[i * 3 + 1] = -0.02 - Math.random() * 0.03; // fall slowly
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.04;
    }
    return [pos, vel];
  }, [count]);

  useFrame(() => {
    if (!pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.attributes.position;
    const array = posAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      array[i * 3] += velocities[i * 3];
      array[i * 3 + 1] += velocities[i * 3 + 1];
      array[i * 3 + 2] += velocities[i * 3 + 2];

      // Reset when falling below ground or drifting out
      if (array[i * 3 + 1] < 0.2 || array[i * 3] > 60) {
        array[i * 3] = -60;
        array[i * 3 + 1] = Math.random() * 25 + 5;
        array[i * 3 + 2] = (Math.random() - 0.5) * 100;
      }
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.6}
        color={isSunset ? '#f59e0b' : '#f472b6'}
        transparent
        opacity={0.7}
        sizeAttenuation
      />
    </points>
  );
};

// Interactive Ground Target Click Ring
const GroundTargetRing: React.FC<{ targetPos: [number, number, number] | null }> = ({ targetPos }) => {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (ringRef.current && targetPos) {
      ringRef.current.rotation.z += delta * 2;
      const s = 1 + Math.sin(state.clock.elapsedTime * 6) * 0.2;
      ringRef.current.scale.set(s, s, s);
    }
  });

  if (!targetPos) return null;

  return (
    <group position={[targetPos[0], 0.08, targetPos[2]]}>
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.0, 1.3, 32]} />
        <meshBasicMaterial color="#0284c7" side={THREE.DoubleSide} transparent opacity={0.8} />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 1.0, 8]} />
        <meshBasicMaterial color="#0284c7" />
      </mesh>
      <mesh position={[0, 1.1, 0]}>
        <sphereGeometry args={[0.18, 12, 12]} />
        <meshBasicMaterial color="#38bdf8" />
      </mesh>
    </group>
  );
};

export const CampusScene3D: React.FC<CampusScene3DProps> = ({
  buildings,
  events,
  selectedBuilding,
  selectedEvent,
  activeCategoryFilter,
  isLiveMode,
  activeRoute,
  studentProfile,
  cameraPreset,
  lightingMode,
  inspectedFloor,
  isXRayMode,
  isBreezeWeather = true,
  onSelectBuilding,
  onSelectEvent,
  onHoverBuilding,
  hoveredBuilding,
  onStudentTeleport
}) => {
  const isNight = lightingMode === 'night';
  const isSunset = lightingMode === 'sunset';

  // State for interactive ground click-to-walk
  const [clickTargetPos, setClickTargetPos] = useState<[number, number, number] | null>(null);

  // Background and fog colors - bright crisp daylight by default!
  const skyColor = isNight ? '#090d16' : isSunset ? '#ffedd5' : '#e0f2fe';
  const fogColor = isNight ? '#090d16' : isSunset ? '#fed7aa' : '#e0f2fe';

  // Filter events according to active filters
  const filteredEvents = events.filter(evt => {
    if (isLiveMode && !evt.isLiveNow) return false;
    if (activeCategoryFilter === 'all') return true;
    return evt.category === activeCategoryFilter;
  });

  // Current student building
  const studentBuilding = buildings.find(b => b.id === studentProfile.currentLocationBuildingId) || buildings[0];

  const handleGroundClick = (point: [number, number, number]) => {
    playTapSound();
    setClickTargetPos(point);
    if (onStudentTeleport) {
      onStudentTeleport(point);
    }
  };

  return (
    <div className="relative w-full h-full">
      <Canvas
        shadows
        camera={{ position: [-52, 58, 62], fov: 40, near: 0.5, far: 500 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        onPointerMissed={() => {
          // Deselect target ring if clicked outside
        }}
      >
        <Suspense fallback={null}>
          {/* Bright skybox & atmospheric depth */}
          <color attach="background" args={[skyColor]} />
          <fog attach="fog" args={[fogColor, isNight ? 70 : 100, isNight ? 240 : 380]} />

          {/* Stars only in Night Mode */}
          {isNight && (
            <Stars radius={150} depth={50} count={2500} factor={4} saturation={0} fade speed={1.2} />
          )}

          {/* Dynamic Scene Lighting: Crisp Sunlit Campus */}
          {lightingMode === 'day' && (
            <>
              {/* Soft ambient daylight */}
              <ambientLight intensity={0.85} color="#f8fafc" />
              {/* Bright Primary Directional Sun */}
              <directionalLight
                position={[45, 80, 35]}
                intensity={1.8}
                color="#fffbeb"
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
                shadow-camera-far={260}
                shadow-camera-left={-80}
                shadow-camera-right={80}
                shadow-camera-top={70}
                shadow-camera-bottom={-70}
                shadow-bias={-0.0003}
              />
              {/* Soft secondary fill sun */}
              <directionalLight
                position={[-40, 50, -30]}
                intensity={0.4}
                color="#e0f2fe"
              />
              {/* Sky Blue & Grass Green bounce light */}
              <hemisphereLight groundColor="#86efac" color="#bae6fd" intensity={0.7} />
            </>
          )}

          {lightingMode === 'sunset' && (
            <>
              <ambientLight intensity={0.6} color="#fed7aa" />
              <directionalLight
                position={[65, 30, 35]}
                intensity={2.4}
                color="#f97316"
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
                shadow-camera-far={260}
                shadow-camera-left={-80}
                shadow-camera-right={80}
                shadow-camera-top={70}
                shadow-camera-bottom={-70}
              />
              <hemisphereLight groundColor="#7c2d12" color="#fbbf24" intensity={0.8} />
            </>
          )}

          {lightingMode === 'night' && (
            <>
              <ambientLight intensity={0.4} color="#1e1b4b" />
              <directionalLight
                position={[30, 60, 20]}
                intensity={0.8}
                color="#38bdf8"
                castShadow
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
              />
              <hemisphereLight groundColor="#020617" color="#0369a1" intensity={0.4} />
            </>
          )}

          {/* Floating animated breeze petals */}
          {isBreezeWeather && !isNight && (
            <BreezeParticles count={90} isSunset={isSunset} />
          )}

          {/* 1. Base Campus Terrain with click-to-walk */}
          <CampusTerrain3D 
            lightingMode={lightingMode} 
            onGroundClick={handleGroundClick}
          />

          {/* Click Target Ring Indicator */}
          <GroundTargetRing targetPos={clickTargetPos} />

          {/* 2. 3D Architectural Buildings */}
          <group name="campus-buildings">
            {buildings.map((building) => (
              <Building3D
                key={building.id}
                building={building}
                isSelected={selectedBuilding?.id === building.id}
                isHovered={hoveredBuilding?.id === building.id}
                isDestination={activeRoute?.toBuildingId === building.id}
                isOrigin={activeRoute?.fromBuildingId === building.id}
                isStudentHere={studentProfile.currentLocationBuildingId === building.id}
                inspectedFloor={selectedBuilding?.id === building.id ? inspectedFloor : 0}
                isXRayMode={isXRayMode}
                lightingMode={lightingMode}
                onSelect={(b) => {
                  playTapSound();
                  onSelectBuilding(b);
                }}
                onHover={onHoverBuilding}
              />
            ))}
          </group>

          {/* 3. Floating 3D Event Markers */}
          <group name="campus-event-markers">
            {filteredEvents.map((event) => {
              const bldg = buildings.find(b => b.id === event.buildingId);
              if (!bldg) return null;
              return (
                <EventMarker3D
                  key={event.id}
                  event={event}
                  buildingX={bldg.x}
                  buildingY={bldg.y}
                  buildingFloors={bldg.floors}
                  isSelected={selectedEvent?.id === event.id}
                  onSelect={(e) => {
                    playTapSound();
                    onSelectEvent(e);
                  }}
                />
              );
            })}
          </group>

          {/* 4. Glowing 3D Navigation Path Route */}
          <NavigationPath3D route={activeRoute} />

          {/* 5. 3D Student Avatar with Free-Walk & Route Following */}
          {studentBuilding && (
            <StudentAvatar3D
              studentProfile={studentProfile}
              buildingX={studentBuilding.x}
              buildingY={studentBuilding.y}
              activeRoute={activeRoute}
              customTargetPos={clickTargetPos}
              onSelectAvatar={() => {
                playTapSound();
                onSelectBuilding(studentBuilding);
              }}
            />
          )}

          {/* 6. Interactive Orbit & Animated Fly-To Controls */}
          <CampusCameraController
            selectedBuilding={selectedBuilding}
            cameraPreset={cameraPreset}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
