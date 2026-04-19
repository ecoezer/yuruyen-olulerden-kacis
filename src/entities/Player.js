import * as THREE from 'three';
import { SETTINGS, COLORS, WEAPONS } from '../utils/Constants.js';
import { Physics } from '../core/Physics.js';
import { TextureUtils } from '../utils/TextureUtils.js';
import { Humanoid } from './Humanoid.js';

export class Player {
    constructor(scene) {
        this.scene = scene;
        this.health = SETTINGS.MAX_HEALTH;
        this.stamina = 100;
        this.isRunning = false;
        this.flashlightOn = true;
        this.inventory = { 
            key: false, 
            medkits: 1, 
            ammo: 10,
            weapons: [WEAPONS.FISTS]
        };
        this.currentWeaponIndex = 0;
        this.lastAttackTime = 0;

        this.humanoid = new Humanoid(scene, {
            bodyColor: 0x2c3e50, // Dark suit
            skinColor: 0xe0ac69
        });
        this.mesh = this.humanoid.mesh;
        this.mesh.position.set(0, 0, 10);

        this.initFlashlight();
        this.initMuzzleFlash();
    }

    initFlashlight() {
        // High power flashlight
        this.flashlight = new THREE.SpotLight(0xffffff, 50, 40, Math.PI / 6, 0.5, 0.5);
        this.flashlight.position.set(0, 1.5, 0.5);
        this.flashlight.target.position.set(0, 1.5, 5);
        this.flashlight.castShadow = true;
        this.mesh.add(this.flashlight);
        this.mesh.add(this.flashlight.target);
    }

    initMuzzleFlash() {
        const flashGeo = new THREE.SphereGeometry(0.2, 8, 8);
        const flashMat = new THREE.MeshBasicMaterial({ color: 0xffffaa, transparent: true, opacity: 0 });
        this.muzzleFlash = new THREE.Mesh(flashGeo, flashMat);
        this.muzzleFlash.position.set(0, 1.5, 0.6);
        this.mesh.add(this.muzzleFlash);

        this.muzzleFlashLight = new THREE.PointLight(0xffffaa, 0, 5);
        this.muzzleFlashLight.position.set(0, 1.5, 0.6);
        this.mesh.add(this.muzzleFlashLight);
    }

    attack() {
        const weapon = this.inventory.weapons[this.currentWeaponIndex];
        const now = Date.now();
        
        if (now - this.lastAttackTime < weapon.speed) return null;
        this.lastAttackTime = now;
        
        if (weapon.type === 'ranged') {
            if (this.inventory.ammo > 0) {
                this.inventory.ammo--;
                this.playShootEffect();
                return { type: 'ranged', damage: weapon.damage, range: weapon.range };
            } else {
                // If out of ammo, try fists (index 0 usually)
                return this.meleeAttack();
            }
        } else {
            return this.meleeAttack();
        }
    }

    meleeAttack() {
        // Use current weapon for damage/range only if it's a melee type
        const weapon = this.inventory.weapons[this.currentWeaponIndex];
        const isRanged = weapon.type === 'ranged';
        
        this.humanoid.playPunchAnimation();
        
        return { 
            type: 'melee', 
            damage: isRanged ? 1 : weapon.damage, 
            range: isRanged ? 1.5 : weapon.range 
        };
    }

    playShootEffect() {
        this.muzzleFlash.material.opacity = 1;
        this.muzzleFlashLight.intensity = 20;
        setTimeout(() => {
            if (this.muzzleFlash) this.muzzleFlash.material.opacity = 0;
            if (this.muzzleFlashLight) this.muzzleFlashLight.intensity = 0;
        }, 50);
    }

    update(input, collidables, delta) {
        const axis = input.getAxis();
        let speed = SETTINGS.PLAYER_SPEED;

        // Stamina logic
        this.isRunning = input.isPressed('ShiftLeft') && this.stamina > 0 && (axis.x !== 0 || axis.z !== 0);
        
        if (this.isRunning) {
            speed *= SETTINGS.RUN_MULTIPLIER;
            this.stamina = Math.max(0, this.stamina - SETTINGS.STAMINA_DRAIN);
        } else {
            this.stamina = Math.min(100, this.stamina + SETTINGS.STAMINA_REGEN);
        }

        const moveMagnitude = Math.sqrt(axis.x ** 2 + axis.z ** 2);
        
        // Movement
        if (axis.x !== 0 || axis.z !== 0) {
            const moveDir = new THREE.Vector3(axis.x, 0, axis.z).normalize();
            const nextPos = this.mesh.position.clone().add(moveDir.multiplyScalar(speed));
            
            // Collision detection
            const finalPos = Physics.checkWallCollisions(nextPos, SETTINGS.PLAYER_RADIUS, collidables);
            this.mesh.position.copy(finalPos);

            // Rotation
            const angle = Math.atan2(axis.x, axis.z);
            this.mesh.rotation.y = angle;
        }

        // Animation update
        this.humanoid.updateAnimation(moveMagnitude, delta, Date.now() / 1000);

        // Weapon switching (1, 2, 3...)
        for (let i = 0; i < this.inventory.weapons.length; i++) {
            if (input.isPressed(`Digit${i + 1}`)) {
                this.currentWeaponIndex = i;
            }
        }

        // Flashlight toggle
        if (input.isPressed('KeyF')) {
            if (!this.fPressed) {
                this.flashlightOn = !this.flashlightOn;
                this.flashlight.visible = this.flashlightOn;
                this.fPressed = true;
            }
        } else {
            this.fPressed = false;
        }
    }

    takeDamage(amount) {
        this.health = Math.max(0, this.health - amount);
        return this.health <= 0;
    }
}
