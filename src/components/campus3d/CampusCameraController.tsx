import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls as DreiOrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { Building } from '../../types';
import { campusTo3D } from './coordinateUtils';

export type CameraPreset = 'overview' | 'isometric' | 'street' | 'north';

interface CampusCameraControllerProps {
  selectedBuilding: Building | null;
  cameraPreset: CameraPreset;
  onControlsChange?: () => void;
}

export const CampusCameraController: React.FC<CampusCameraControllerProps> = ({
  selectedBuilding,
  cameraPreset,
  onControlsChange
}) => {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();

  // Target camera position and look-at target
  const targetCamPos = useRef(new THREE.Vector3(-45, 55, 65));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const isAnimating = useRef(true);

  // Update target when camera preset changes
  useEffect(() => {
    isAnimating.current = true;
    switch (cameraPreset) {
      case 'overview':
        targetCamPos.current.set(0, 85, 65);
        targetLookAt.current.set(0, 0, 0);
        break;
      case 'isometric':
        targetCamPos.current.set(-52, 58, 62);
        targetLookAt.current.set(0, 0, 0);
        break;
      case 'street':
        targetCamPos.current.set(0, 14, 42);
        targetLookAt.current.set(0, 3, 0);
        break;
      case 'north':
        targetCamPos.current.set(0, 48, 65);
        targetLookAt.current.set(0, 0, -10);
        break;
    }
  }, [cameraPreset]);

  // Update target when selected building changes
  useEffect(() => {
    if (selectedBuilding) {
      isAnimating.current = true;
      const [bx, , bz] = campusTo3D(selectedBuilding.x, selectedBuilding.y, 0);
      const bHeight = selectedBuilding.floors * 1.8;

      // Focus camera near the building
      targetLookAt.current.set(bx, bHeight * 0.5, bz);
      targetCamPos.current.set(bx - 16, bHeight + 16, bz + 24);
    }
  }, [selectedBuilding]);

  // Smooth lerp animation in useFrame
  useFrame((state, delta) => {
    if (!isAnimating.current || !controlsRef.current) return;

    // Lerp camera position
    camera.position.lerp(targetCamPos.current, 0.08);

    // Lerp controls target
    controlsRef.current.target.lerp(targetLookAt.current, 0.08);
    controlsRef.current.update();

    // Check if close enough to stop animating
    const posDist = camera.position.distanceTo(targetCamPos.current);
    const targetDist = controlsRef.current.target.distanceTo(targetLookAt.current);

    if (posDist < 0.2 && targetDist < 0.1) {
      isAnimating.current = false;
    }
  });

  return (
    <DreiOrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping
      dampingFactor={0.06}
      minDistance={10}
      maxDistance={170}
      minPolarAngle={0.1}
      maxPolarAngle={Math.PI / 2.15} // Prevent camera going below ground
      maxAzimuthAngle={Infinity}
      minAzimuthAngle={-Infinity}
      onStart={() => {
        // Stop programmed fly-to if user drags manually
        isAnimating.current = false;
        onControlsChange?.();
      }}
    />
  );
};
