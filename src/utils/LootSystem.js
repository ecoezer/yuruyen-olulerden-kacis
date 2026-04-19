import * as THREE from 'three';
import { WEAPONS } from './Constants.js';

export class LootSystem {
    static spawn(scene, position) {
        const rand = Math.random();
        let type = null;
        let color = 0xffffff;

        if (rand < 0.3) {
            type = 'ammo';
            color = 0x55ff55;
        } else if (rand < 0.5) {
            type = 'medkit';
            color = 0xff5555;
        } else if (rand < 0.6) {
            type = 'weapon_knife';
            color = 0xaaaaaa;
        } else if (rand < 0.65) {
            type = 'weapon_axe';
            color = 0xff8800;
        } else if (rand < 0.7) {
            type = 'weapon_bat';
            color = 0x8b4513;
        } else if (rand < 0.75) {
            type = 'weapon_pistol';
            color = 0x444444;
        }

        if (!type) return null;

        const group = new THREE.Group();
        let model = null;

        switch (type) {
            case 'ammo':
                model = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.4, 0.2), new THREE.MeshStandardMaterial({ color }));
                break;
            case 'medkit':
                model = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.4), new THREE.MeshStandardMaterial({ color }));
                const cross = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.1, 0.1), new THREE.MeshStandardMaterial({ color: 0xffffff }));
                const cross2 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.45, 0.1), new THREE.MeshStandardMaterial({ color: 0xffffff }));
                model.add(cross, cross2);
                break;
            case 'weapon_knife':
                model = this.createKnifeModel();
                break;
            case 'weapon_axe':
                model = this.createAxeModel();
                break;
            case 'weapon_bat':
                model = this.createBatModel();
                break;
            case 'weapon_pistol':
                model = this.createPistolModel();
                break;
        }

        if (model) {
            group.add(model);
            // Add a glow/light
            const light = new THREE.PointLight(color, 0.5, 2);
            group.add(light);
        }

        group.position.set(position.x, 0.4, position.z);
        group.userData = { type };
        
        scene.add(group);
        return group;
    }

    static createKnifeModel() {
        const group = new THREE.Group();
        const blade = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.4, 0.1), new THREE.MeshStandardMaterial({ color: 0xcccccc }));
        const handle = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.15, 0.08), new THREE.MeshStandardMaterial({ color: 0x332211 }));
        handle.position.y = -0.25;
        group.add(blade, handle);
        return group;
    }

    static createAxeModel() {
        const group = new THREE.Group();
        const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.6), new THREE.MeshStandardMaterial({ color: 0x442211 }));
        const head = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.2, 0.3), new THREE.MeshStandardMaterial({ color: 0x666666 }));
        head.position.set(0, 0.2, 0.1);
        group.add(handle, head);
        return group;
    }

    static createBatModel() {
        return new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.03, 0.7), new THREE.MeshStandardMaterial({ color: 0x886644 }));
    }

    static createPistolModel() {
        const group = new THREE.Group();
        const barrel = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.15, 0.4), new THREE.MeshStandardMaterial({ color: 0x333333 }));
        const handle = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.3, 0.12), new THREE.MeshStandardMaterial({ color: 0x222222 }));
        handle.position.set(0, -0.15, -0.1);
        handle.rotation.x = -0.3;
        group.add(barrel, handle);
        return group;
    }
}
