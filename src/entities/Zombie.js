import * as THREE from 'three';
import { SETTINGS, COLORS } from '../utils/Constants.js';
import { Physics } from '../core/Physics.js';
import { TextureUtils } from '../utils/TextureUtils.js';
import { Humanoid } from './Humanoid.js';

export class Zombie {
    constructor(scene, spawnPos) {
        this.scene = scene;
        this.health = SETTINGS.ZOMBIE_MAX_HEALTH;
        this.isDead = false;
        this.lastAttackTime = 0;
        
        // Random variations
        const scale = 0.9 + Math.random() * 0.3;
        const skinColor = 0x778877; // Greyish-green
        
        this.humanoid = new Humanoid(scene, {
            bodyColor: 0x556655, // Dirty green/brown
            skinColor: skinColor
        });
        this.mesh = this.humanoid.mesh;
        this.mesh.scale.set(scale, scale, scale);
        
        this.initZombieDetails();
        this.mesh.position.set(spawnPos.x, 0, spawnPos.z);
    }

    initZombieDetails() {
        // Red glowing eyes
        const eyeGeo = new THREE.SphereGeometry(0.05, 8, 8);
        const eyeMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        this.eyeL = new THREE.Mesh(eyeGeo, eyeMat);
        this.eyeL.position.set(-0.1, 1.7, 0.18);
        this.eyeR = new THREE.Mesh(eyeGeo, eyeMat);
        this.eyeR.position.set(0.1, 1.7, 0.18);
        
        const eyeLight = new THREE.PointLight(0xff0000, 1, 2);
        eyeLight.position.set(0, 1.7, 0.2);
        
        this.mesh.add(this.eyeL, this.eyeR, eyeLight);

        // Arms reaching forward (Zombie pose)
        this.humanoid.leftArm.rotation.x = -Math.PI / 2.5;
        this.humanoid.rightArm.rotation.x = -Math.PI / 2.5;
    }

    takeDamage(amount) {
        this.health -= amount;
        
        // Visual feedback (Flash red)
        this.humanoid.torso.material.emissive = new THREE.Color(0xaa0000);
        this.humanoid.torso.material.emissiveIntensity = 1;
        
        setTimeout(() => {
            if (this.humanoid && this.humanoid.torso) {
                this.humanoid.torso.material.emissiveIntensity = 0;
            }
        }, 100);

        if (this.health <= 0) {
            this.die();
        }
    }

    die() {
        this.isDead = true;
        this.scene.remove(this.mesh);
    }

    update(player, collidables, delta) {
        if (this.isDead) return;

        const dist = Physics.checkDistance(this.mesh.position, player.mesh.position);
        let moveSpeed = 0;
        
        // Detection logic
        if (dist < SETTINGS.ZOMBIE_DETECTION_RANGE) {
            // Move towards player
            const dir = player.mesh.position.clone().sub(this.mesh.position).normalize();
            dir.y = 0;
            
            moveSpeed = SETTINGS.ZOMBIE_SPEED;
            const nextPos = this.mesh.position.clone().add(dir.multiplyScalar(moveSpeed));
            
            // Collision with walls
            const finalPos = Physics.checkWallCollisions(nextPos, 0.4, collidables);
            this.mesh.position.copy(finalPos);

            // Look at player
            this.mesh.lookAt(player.mesh.position.x, 0, player.mesh.position.z);
            
            // Attack logic
            if (dist < 1.2) {
                const now = Date.now();
                if (now - this.lastAttackTime > SETTINGS.DAMAGE_COOLDOWN) {
                    player.takeDamage(10);
                    this.lastAttackTime = now;
                }
            }
        }

        // Animation update
        this.humanoid.updateAnimation(moveSpeed > 0 ? 0.5 : 0, delta, Date.now() / 1000 + this.mesh.uuid.length);
        
        // Keep arms reaching forward even when walking
        if (moveSpeed > 0) {
            this.humanoid.leftArm.rotation.x = -Math.PI / 2.5 + Math.sin(Date.now() / 200) * 0.1;
            this.humanoid.rightArm.rotation.x = -Math.PI / 2.5 + Math.cos(Date.now() / 200) * 0.1;
        }
    }
}
