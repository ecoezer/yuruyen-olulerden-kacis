import * as THREE from 'three';

export class Physics {
    static checkWallCollisions(position, radius, walls) {
        const nextPos = position.clone();
        
        for (const wall of walls) {
            const wallBox = new THREE.Box3().setFromObject(wall);
            
            // simple AABB vs Sphere approximation
            const closestPoint = new THREE.Vector3().copy(nextPos).clamp(wallBox.min, wallBox.max);
            const distance = nextPos.distanceTo(closestPoint);
            
            if (distance < radius) {
                // Collision! Push back
                const overlap = radius - distance;
                const dir = nextPos.clone().sub(closestPoint).normalize();
                if (distance === 0) dir.set(1, 0, 0); // fallback for exact center
                nextPos.add(dir.multiplyScalar(overlap));
            }
        }
        
        return nextPos;
    }

    static checkDistance(pos1, pos2) {
        return pos1.distanceTo(pos2);
    }
}
