import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { NavigationRoute } from '../../types';
import { campusToVector3, campusTo3D } from './coordinateUtils';

interface NavigationPath3DProps {
  route: NavigationRoute | null;
}

export const NavigationPath3D: React.FC<NavigationPath3DProps> = ({ route }) => {
  const pulsesGroupRef = useRef<THREE.Group>(null);
  const beaconRef = useRef<THREE.Mesh>(null);

  // Generate 3D Curve from Route Path Points
  const { curve, points3D } = useMemo(() => {
    if (!route || !route.pathPoints || route.pathPoints.length < 2) {
      return { curve: null, points3D: [] };
    }

    const vectors = route.pathPoints.map((pt, idx) => {
      // Slightly elevate the path so it floats just above the ground
      return campusToVector3(pt.x, pt.y, 0.3);
    });

    // Create a smooth spline passing through waypoints
    const spline = new THREE.CatmullRomCurve3(vectors, false, 'catmullrom', 0.2);
    const densePoints = spline.getPoints(50);

    return { curve: spline, points3D: densePoints };
  }, [route]);

  // Destination and Start Coordinates
  const destPos = useMemo(() => {
    if (!route || !route.pathPoints.length) return null;
    const last = route.pathPoints[route.pathPoints.length - 1];
    return campusTo3D(last.x, last.y, 0);
  }, [route]);

  const startPos = useMemo(() => {
    if (!route || !route.pathPoints.length) return null;
    const first = route.pathPoints[0];
    return campusTo3D(first.x, first.y, 0);
  }, [route]);

  // Animated energy pulses traveling along path
  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (pulsesGroupRef.current && curve) {
      pulsesGroupRef.current.children.forEach((child, idx) => {
        // Stagger pulse positions along the curve
        const progress = ((time * 0.4 + idx * 0.2) % 1);
        const pt = curve.getPointAt(progress);
        child.position.copy(pt);
      });
    }

    if (beaconRef.current) {
      beaconRef.current.rotation.y = time * 2;
    }
  });

  if (!route || !curve) return null;

  return (
    <group name="3d-navigation-path">
      {/* 1. Main Glowing Path Tube */}
      <mesh>
        <tubeGeometry args={[curve, 64, 0.35, 8, false]} />
        <meshStandardMaterial 
          color="#00f0ff" 
          emissive="#00f0ff" 
          emissiveIntensity={1.8} 
          roughness={0.2}
          transparent
          opacity={0.88}
        />
      </mesh>

      {/* Outer Halo Tube for Soft Glow */}
      <mesh>
        <tubeGeometry args={[curve, 64, 0.7, 8, false]} />
        <meshBasicMaterial 
          color="#38bdf8" 
          transparent 
          opacity={0.25} 
          side={THREE.BackSide} 
        />
      </mesh>

      {/* 2. Traveling Energy Light Orbs Along Path */}
      <group ref={pulsesGroupRef}>
        {[0, 1, 2, 3, 4].map((i) => (
          <mesh key={i}>
            <sphereGeometry args={[0.5, 12, 12]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        ))}
      </group>

      {/* 3. Destination Beacon & Vertical Sky Beam */}
      {destPos && (
        <group position={[destPos[0], 0, destPos[2]]}>
          {/* Vertical Sky Light Beam */}
          <mesh position={[0, 18, 0]}>
            <cylinderGeometry args={[0.2, 1.2, 36, 16, 1, true]} />
            <meshBasicMaterial 
              color="#00f0ff" 
              transparent 
              opacity={0.45} 
              side={THREE.DoubleSide} 
            />
          </mesh>

          {/* Rotating Destination 3D Diamond / Marker */}
          <mesh ref={beaconRef} position={[0, 9, 0]}>
            <octahedronGeometry args={[1.4, 0]} />
            <meshStandardMaterial 
              color="#22d3ee" 
              emissive="#22d3ee" 
              emissiveIntensity={2} 
              roughness={0.1} 
              metalness={0.8} 
            />
          </mesh>

          {/* Expanding Base Rings on Ground */}
          <mesh position={[0, 0.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[2.0, 2.5, 32]} />
            <meshBasicMaterial color="#00f0ff" side={THREE.DoubleSide} />
          </mesh>
        </group>
      )}

      {/* 4. Origin Start Ring */}
      {startPos && (
        <group position={[startPos[0], 0.15, startPos[2]]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.5, 1.9, 24]} />
            <meshBasicMaterial color="#10b981" side={THREE.DoubleSide} />
          </mesh>
        </group>
      )}
    </group>
  );
};
