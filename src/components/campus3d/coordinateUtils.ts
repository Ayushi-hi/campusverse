import * as THREE from 'three';

/**
 * Converts 2D campus percentage coordinates (0-100) into 3D world coordinates.
 * X: -60 to +60
 * Z: -50 to +50
 * Y: Height above ground (default 0)
 */
export function campusTo3D(
  xPercent: number, 
  yPercent: number, 
  yHeight: number = 0
): [number, number, number] {
  const x = (xPercent - 50) * 1.5;
  const z = (yPercent - 50) * 1.2;
  return [x, yHeight, z];
}

export function campusToVector3(
  xPercent: number, 
  yPercent: number, 
  yHeight: number = 0
): THREE.Vector3 {
  const [x, y, z] = campusTo3D(xPercent, yPercent, yHeight);
  return new THREE.Vector3(x, y, z);
}
