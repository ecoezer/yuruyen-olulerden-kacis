import * as THREE from 'three';
import { Engine } from './src/core/Engine.js';
import { Input } from './src/core/Input.js';
import { Map } from './src/world/Map.js';
import { Player } from './src/entities/Player.js';
import { Zombie } from './src/entities/Zombie.js';
import { UI } from './src/systems/UI.js';
import { COLORS, WEAPONS } from './src/utils/Constants.js';
import { LootSystem } from './src/utils/LootSystem.js';

class Game {
    constructor() {
        this.container = document.getElementById('game-container');
        this.ui = new UI();
        this.engine = new Engine(this.container);
        this.input = new Input();
        this.world = new Map(this.engine.scene);
        this.player = new Player(this.engine.scene);
        
        this.zombies = [];
        this.isGameOver = false;
        
        this.initZombies();
        this.initKeyAndExit();
        
        this.clock = new THREE.Clock();
        this.raycaster = new THREE.Raycaster();
        
        this.initEventListeners();
        this.animate();
        
        // Hide loading screen after a short delay
        setTimeout(() => this.ui.hideLoading(), 1000);
    }

    initEventListeners() {
        window.addEventListener('mousedown', (e) => {
            if (e.button === 0) this.tryAttack();
        });
    }

    tryAttack() {
        if (this.isGameOver) return;
        
        const attackResult = this.player.attack();
        if (attackResult) {
            const shootDir = new THREE.Vector3(0, 0, 1).applyQuaternion(this.player.mesh.quaternion);
            this.raycaster.set(this.player.mesh.position.clone().add(new THREE.Vector3(0, 1.5, 0)), shootDir);
            this.raycaster.far = attackResult.range;
            
            const zombieMeshes = this.zombies.filter(z => !z.isDead).map(z => z.mesh);
            const intersects = this.raycaster.intersectObjects(zombieMeshes, true);
            
            if (intersects.length > 0) {
                const hitObj = intersects[0].object;
                let target = hitObj;
                while(target.parent && !this.zombies.find(z => z.mesh.uuid === target.uuid)) {
                    target = target.parent;
                }
                
                const zombie = this.zombies.find(z => z.mesh.uuid === target.uuid);
                if (zombie) {
                    zombie.takeDamage(attackResult.damage);
                    if (zombie.isDead) {
                        const drop = LootSystem.spawn(this.engine.scene, zombie.mesh.position);
                        if (drop) this.items.push(drop);
                    }
                }
            }
        }
    }

    initZombies() {
        // Spawn zombies at specific locations
        const spawns = [
            { x: -10, z: -10 },
            { x: 10, z: -5 },
            { x: -15, z: 5 },
            { x: 5, z: 12 }
        ];

        spawns.forEach(pos => {
            this.zombies.push(new Zombie(this.engine.scene, pos));
        });
    }

    initKeyAndExit() {
        // Key (Bright Golden box)
        const keyGeo = new THREE.BoxGeometry(0.6, 0.6, 0.6);
        const keyMat = new THREE.MeshStandardMaterial({ 
            color: COLORS.KEY, 
            emissive: COLORS.KEY, 
            emissiveIntensity: 2 
        });
        this.keyMesh = new THREE.Mesh(keyGeo, keyMat);
        this.keyMesh.position.set(-15, 0.8, -10);
        this.engine.scene.add(this.keyMesh);

        // Exit point (Glowing Green zone)
        const exitGeo = new THREE.CylinderGeometry(2, 2, 0.2, 32);
        const exitMat = new THREE.MeshStandardMaterial({ 
            color: COLORS.EXIT, 
            emissive: COLORS.EXIT,
            emissiveIntensity: 1,
            transparent: true, 
            opacity: 0.5 
        });
        this.exitMesh = new THREE.Mesh(exitGeo, exitMat);
        this.exitMesh.position.set(15, 0.1, 10);
        this.engine.scene.add(this.exitMesh);

        // Items logic
        this.items = [];
        this.spawnItem(-5, 5, 'medkit');
        this.spawnItem(5, -5, 'ammo');
    }

    spawnItem(x, z, type) {
        const geo = new THREE.BoxGeometry(0.4, 0.4, 0.4);
        const color = type === 'medkit' ? 0xff5555 : 0x55ff55;
        const mat = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.5 });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(x, 0.4, z);
        mesh.userData = { type };
        this.engine.scene.add(mesh);
        this.items.push(mesh);
    }

    animate() {
        if (this.isGameOver) return;
        
        requestAnimationFrame(() => this.animate());
        
        const delta = this.clock.getDelta();
        const time = this.clock.getElapsedTime();

        // Animate Goals
        if (this.keyMesh) {
            this.keyMesh.rotation.y += delta;
            this.keyMesh.position.y = 0.8 + Math.sin(time * 3) * 0.2;
        }
        this.exitMesh.material.emissiveIntensity = 0.5 + Math.sin(time * 2) * 0.5;

        // Animate Drop Items
        this.items.forEach(item => {
            item.rotation.y += delta * 1.5;
            item.position.y = 0.4 + Math.sin(time * 4) * 0.1;
        });
        
        // Update Player
        this.player.update(this.input, this.world.collidables, delta);
        
        // Update World (flickering lights)
        this.world.update();
        
        // Update Zombies
        this.zombies = this.zombies.filter(zombie => {
            if (!zombie.isDead) {
                zombie.update(this.player, this.world.collidables, delta);
                return true;
            }
            return false;
        });

        // Key interaction
        if (!this.player.inventory.key) {
            const distToKey = this.player.mesh.position.distanceTo(this.keyMesh.position);
            if (distToKey < 1.5) {
                this.ui.setInteraction(true);
                if (this.input.isPressed('KeyE')) {
                    this.player.inventory.key = true;
                    this.engine.scene.remove(this.keyMesh);
                    this.ui.setInteraction(false);
                }
            } else {
                this.ui.setInteraction(false);
            }
        }

        // Exit interaction
        if (this.player.inventory.key) {
            const distToExit = this.player.mesh.position.distanceTo(this.exitMesh.position);
            if (distToExit < 1.5) {
                this.isGameOver = true;
                this.ui.showVictory();
            }
        }

        // Check Health
        if (this.player.health <= 0) {
            this.isGameOver = true;
            this.ui.showGameOver();
        }

        // Items interaction
        this.items.forEach((item, index) => {
            if (this.player.mesh.position.distanceTo(item.position) < 1.0) {
                const type = item.userData.type;
                if (type === 'medkit') this.player.inventory.medkits++;
                if (type === 'ammo') this.player.inventory.ammo += 10;
                
                // Weapon pickup
                if (type.startsWith('weapon_')) {
                    const weaponId = type.split('_')[1].toUpperCase();
                    const weaponData = WEAPONS[weaponId];
                    if (weaponData && !this.player.inventory.weapons.find(w => w.id === weaponData.id)) {
                        this.player.inventory.weapons.push(weaponData);
                        this.player.currentWeaponIndex = this.player.inventory.weapons.length - 1; // Auto-switch
                    } else if (weaponData && type === 'weapon_pistol') {
                        this.player.inventory.ammo += 15;
                        // If already has pistol, make sure it is selected if user wants auto-fire
                        const pistolIndex = this.player.inventory.weapons.findIndex(w => w.id === 'pistol');
                        if (pistolIndex !== -1) this.player.currentWeaponIndex = pistolIndex;
                    }
                }

                this.engine.scene.remove(item);
                this.items.splice(index, 1);
            }
        });

        // Use Medkit (H key)
        if (this.input.isPressed('KeyH') && this.player.inventory.medkits > 0 && this.player.health < 100) {
            if (!this.hPressed) {
                this.player.health = Math.min(100, this.player.health + 30);
                this.player.inventory.medkits--;
                this.hPressed = true;
            }
        } else {
            this.hPressed = false;
        }

        // Auto-Attack Logic
        let nearestZombie = null;
        let minDist = Infinity;
        const currentWeapon = this.player.inventory.weapons[this.player.currentWeaponIndex];

        this.zombies.forEach(zombie => {
            if (!zombie.isDead) {
                const d = this.player.mesh.position.distanceTo(zombie.mesh.position);
                if (d < currentWeapon.range + 2 && d < minDist) {
                    minDist = d;
                    nearestZombie = zombie;
                }
            }
        });

        if (nearestZombie && !this.isGameOver) {
            // Auto-aim
            this.player.mesh.lookAt(nearestZombie.mesh.position.x, 0, nearestZombie.mesh.position.z);
            // Auto-attack if in range
            if (minDist <= currentWeapon.range) {
                this.tryAttack();
            }
        }

        // Camera follow with mouse lean
        const leanX = this.input.mouse.x * 2;
        const leanZ = -this.input.mouse.y * 2;
        const targetCamPos = this.player.mesh.position.clone()
            .add(this.engine.cameraOffset)
            .add(new THREE.Vector3(leanX, 0, leanZ));

        this.engine.camera.position.lerp(targetCamPos, 0.05);
        this.engine.camera.lookAt(this.player.mesh.position);
        
        // UI Sync
        this.ui.updateHUD(this.player);

        // Render
        this.engine.render();
    }
}

// Start Game
window.addEventListener('load', () => {
    new Game();
});
