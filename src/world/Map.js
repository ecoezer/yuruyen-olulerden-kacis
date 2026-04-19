import * as THREE from 'three';
import { COLORS } from '../utils/Constants.js';
import { TextureUtils } from '../utils/TextureUtils.js';

export class Map {
    constructor(scene) {
        this.scene = scene;
        this.collidables = [];
        this.interactables = [];
        
        // Load textures
        this.groundTex = TextureUtils.createAsphaltTexture();
        this.wallTex = TextureUtils.createBrickTexture();
        this.grungeTex = TextureUtils.createNoiseTexture('#ffffff', '#000000', 0.2);

        this.initGround();
        this.initWalls();
        this.initDeco();
        this.initEnvironment();
    }

    initGround() {
        const geometry = new THREE.PlaneGeometry(100, 100);
        const material = new THREE.MeshStandardMaterial({ 
            map: this.groundTex,
            roughness: 0.9,
            metalness: 0.1
        });
        const ground = new THREE.Mesh(geometry, material);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);
    }

    initWalls() {
        const wallData = [
            { pos: [0, 2, -15], size: [40, 4, 1] },
            { pos: [-20, 2, 0], size: [1, 4, 30] },
            { pos: [20, 2, 5], size: [1, 4, 20] },
            { pos: [10, 2, 15], size: [20, 4, 1] },
            { pos: [-5, 2, -5], size: [4, 4, 4] },
            { pos: [8, 2, 2], size: [3, 4, 3] },
            { pos: [-10, 2, 10], size: [5, 4, 2] },
        ];

        wallData.forEach(w => {
            const geo = new THREE.BoxGeometry(...w.size);
            
            // Per-wall texture scaling
            const mat = new THREE.MeshStandardMaterial({ 
                map: this.wallTex.clone(),
                roughness: 0.8
            });
            mat.map.repeat.set(w.size[0] / 2, w.size[1] / 2);
            mat.map.needsUpdate = true;

            const mesh = new THREE.Mesh(geo, mat);
            mesh.position.set(...w.pos);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            this.scene.add(mesh);
            this.collidables.push(mesh);
        });
    }

    initDeco() {
        // Add some trash bags and boxes
        const decoMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x333333,
            map: this.grungeTex
        });

        for (let i = 0; i < 15; i++) {
            const size = 0.5 + Math.random();
            const geo = Math.random() > 0.5 ? new THREE.BoxGeometry(size, size, size) : new THREE.SphereGeometry(size / 2, 8, 8);
            const mesh = new THREE.Mesh(geo, decoMaterial);
            
            const x = (Math.random() - 0.5) * 35;
            const z = (Math.random() - 0.5) * 25;
            
            mesh.position.set(x, size / 2, z);
            mesh.rotation.y = Math.random() * Math.PI;
            mesh.castShadow = true;
            this.scene.add(mesh);
            this.collidables.push(mesh);
        }
    }

    initEnvironment() {
        this.lights = [];
        const lightPositions = [
            { pos: [-15, 4, -12] },
            { pos: [15, 4, 12] },
            { pos: [0, 4, 0] }
        ];

        lightPositions.forEach(l => {
            const pole = new THREE.Mesh(
                new THREE.CylinderGeometry(0.1, 0.1, 4),
                new THREE.MeshStandardMaterial({ color: 0x111111 })
            );
            pole.position.set(l.pos[0], 2, l.pos[2]);
            this.scene.add(pole);

            const light = new THREE.PointLight(0xffaa22, 10, 20);
            light.position.set(l.pos[0], 4, l.pos[2]);
            light.castShadow = true;
            this.scene.add(light);
            this.lights.push(light);
            
            const head = new THREE.Mesh(
                new THREE.SphereGeometry(0.2),
                new THREE.MeshBasicMaterial({ color: 0xffaa22 })
            );
            head.position.set(l.pos[0], 4, l.pos[2]);
            this.scene.add(head);
        });
    }

    update() {
        // Flicker lights for tension
        this.lights.forEach(light => {
            if (Math.random() > 0.98) {
                light.intensity = Math.random() * 15;
            }
        });
    }
}
