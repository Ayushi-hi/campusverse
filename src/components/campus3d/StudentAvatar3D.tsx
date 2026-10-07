import React, { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { StudentProfile, NavigationRoute } from '../../types';
import { campusTo3D, campusToVector3 } from './coordinateUtils';

interface StudentAvatar3DProps {
  studentProfile: StudentProfile;
  buildingX: number;
  buildingY: number;
  activeRoute: NavigationRoute | null;
  customTargetPos?: [number, number, number] | null;
  onSelectAvatar?: () => void;
}

export const StudentAvatar3D: React.FC<StudentAvatar3DProps> = ({
  studentProfile,
  buildingX,
  buildingY,
  activeRoute,
  customTargetPos,
  onSelectAvatar
}) => {
  const avatarGroupRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Mesh>(null);
  const rightLegRef = useRef<THREE.Mesh>(null);
  const leftArmRef = useRef<THREE.Mesh>(null);
  const rightArmRef = useRef<THREE.Mesh>(null);

  // Position when stationary near building entrance
  const basePos = useMemo(() => {
    const [x, , z] = campusTo3D(buildingX, buildingY, 0);
    return new THREE.Vector3(x + 1.5, 0, z + 6.5);
  }, [buildingX, buildingY]);

  // Current free-walk target position
  const currentPos = useRef(new THREE.Vector3().copy(basePos));
  const targetWalkPos = useRef<THREE.Vector3 | null>(null);

  useEffect(() => {
    if (customTargetPos) {
      targetWalkPos.current = new THREE.Vector3(customTargetPos[0], 0, customTargetPos[2]);
    }
  }, [customTargetPos]);

  // Spline curve for active navigation walking
  const routeCurve = useMemo(() => {
    if (!activeRoute || activeRoute.pathPoints.length < 2) return null;
    const points = activeRoute.pathPoints.map(p => campusToVector3(p.x, p.y, 0));
    return new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.2);
  }, [activeRoute]);

  // Walk progress along active route (0 to 1)
  const walkProgressRef = useRef(0);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    if (!avatarGroupRef.current) return;

    if (routeCurve && activeRoute) {
      // Walk smoothly along route
      walkProgressRef.current = (walkProgressRef.current + delta * 0.12) % 1;
      const currentPt = routeCurve.getPointAt(walkProgressRef.current);
      const lookAheadPt = routeCurve.getPointAt(Math.min(0.999, walkProgressRef.current + 0.02));

      avatarGroupRef.current.position.copy(currentPt);
      avatarGroupRef.current.position.y = 0.9 + Math.abs(Math.sin(time * 8)) * 0.15; // walking bounce
      avatarGroupRef.current.lookAt(lookAheadPt.x, 0.9, lookAheadPt.z);
      currentPos.current.copy(currentPt);

      // Animate walking limbs
      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.x = Math.sin(time * 8) * 0.6;
        rightLegRef.current.rotation.x = -Math.sin(time * 8) * 0.6;
      }
      if (leftArmRef.current && rightArmRef.current) {
        leftArmRef.current.rotation.x = -Math.sin(time * 8) * 0.6;
        rightArmRef.current.rotation.x = Math.sin(time * 8) * 0.6;
      }
    } else if (targetWalkPos.current) {
      // Free walk toward clicked ground target
      const dist = currentPos.current.distanceTo(targetWalkPos.current);
      if (dist > 0.4) {
        // Move towards target
        const dir = new THREE.Vector3().subVectors(targetWalkPos.current, currentPos.current).normalize();
        currentPos.current.addScaledVector(dir, Math.min(dist, delta * 9));
        avatarGroupRef.current.position.copy(currentPos.current);
        avatarGroupRef.current.position.y = 0.9 + Math.abs(Math.sin(time * 9)) * 0.12;
        avatarGroupRef.current.lookAt(targetWalkPos.current.x, 0.9, targetWalkPos.current.z);

        if (leftLegRef.current && rightLegRef.current) {
          leftLegRef.current.rotation.x = Math.sin(time * 9) * 0.6;
          rightLegRef.current.rotation.x = -Math.sin(time * 9) * 0.6;
        }
        if (leftArmRef.current && rightArmRef.current) {
          leftArmRef.current.rotation.x = -Math.sin(time * 9) * 0.6;
          rightArmRef.current.rotation.x = Math.sin(time * 9) * 0.6;
        }
      } else {
        // Arrived
        targetWalkPos.current = null;
      }
    } else {
      // Stationary idle breathing & bobbing
      avatarGroupRef.current.position.copy(currentPos.current);
      avatarGroupRef.current.position.y = 0.9 + Math.sin(time * 2) * 0.05;

      // Reset limb angles
      if (leftLegRef.current) leftLegRef.current.rotation.x = 0;
      if (rightLegRef.current) rightLegRef.current.rotation.x = 0;
      if (leftArmRef.current) leftArmRef.current.rotation.x = 0;
      if (rightArmRef.current) rightArmRef.current.rotation.x = 0;
    }
  });

  return (
    <group 
      ref={avatarGroupRef} 
      position={basePos} 
      onClick={(e) => {
        e.stopPropagation();
        onSelectAvatar?.();
      }}
    >
      {/* 3D Stylized Student Avatar Mesh */}
      <group position={[0, 0, 0]}>
        {/* Head */}
        <mesh position={[0, 1.2, 0]} castShadow>
          <sphereGeometry args={[0.32, 16, 16]} />
          <meshStandardMaterial color="#fed7aa" roughness={0.6} />
        </mesh>

        {/* Cap / Beanie */}
        <mesh position={[0, 1.38, -0.02]}>
          <cylinderGeometry args={[0.34, 0.35, 0.18, 16]} />
          <meshStandardMaterial color="#0284c7" roughness={0.8} />
        </mesh>
        <mesh position={[0, 1.34, 0.22]}>
          <boxGeometry args={[0.38, 0.04, 0.2]} />
          <meshStandardMaterial color="#0284c7" />
        </mesh>

        {/* Torso (College Varsity Hoodie) */}
        <mesh position={[0, 0.6, 0]} castShadow>
          <boxGeometry args={[0.6, 0.75, 0.38]} />
          <meshStandardMaterial color="#2563eb" roughness={0.7} />
        </mesh>

        {/* Backpack on Back */}
        <mesh position={[0, 0.65, -0.28]} castShadow>
          <boxGeometry args={[0.42, 0.55, 0.22]} />
          <meshStandardMaterial color="#0f172a" roughness={0.5} />
        </mesh>

        {/* Left Arm */}
        <mesh ref={leftArmRef} position={[-0.38, 0.55, 0]} castShadow>
          <boxGeometry args={[0.16, 0.6, 0.16]} />
          <meshStandardMaterial color="#1d4ed8" />
        </mesh>

        {/* Right Arm */}
        <mesh ref={rightArmRef} position={[0.38, 0.55, 0]} castShadow>
          <boxGeometry args={[0.16, 0.6, 0.16]} />
          <meshStandardMaterial color="#1d4ed8" />
        </mesh>

        {/* Left Leg */}
        <mesh ref={leftLegRef} position={[-0.16, 0.05, 0]} castShadow>
          <boxGeometry args={[0.18, 0.65, 0.2]} />
          <meshStandardMaterial color="#334155" />
        </mesh>

        {/* Right Leg */}
        <mesh ref={rightLegRef} position={[0.16, 0.05, 0]} castShadow>
          <boxGeometry args={[0.18, 0.65, 0.2]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
      </group>

      {/* Floating 3D HTML Name Tag & Live Indicator */}
      <Html position={[0, 2.3, 0]} center distanceFactor={40} zIndexRange={[120, 0]}>
        <div className="flex flex-col items-center pointer-events-none select-none">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md border border-emerald-500/80 text-slate-800 text-[11px] font-bold shadow-xl">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-900 font-bold">You ({studentProfile.name.split(' ')[0]})</span>
            {activeRoute ? (
              <span className="text-[9px] px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded font-semibold">
                Navigating
              </span>
            ) : (
              <span className="text-[9px] px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded font-semibold">
                Online
              </span>
            )}
          </div>
          {/* Indicator pin stem */}
          <div className="w-0.5 h-2 bg-emerald-500"></div>
        </div>
      </Html>
    </group>
  );
};
