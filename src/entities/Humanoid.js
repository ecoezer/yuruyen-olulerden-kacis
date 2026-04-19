import * as THREE from 'three';

export class Humanoid {
    constructor(scene, options = {}) {
        this.scene = scene;
        this.options = {
            bodyColor: options.bodyColor || 0x2c3e50,
            skinColor: options.skinColor || 0xe0ac69,
            hairColor: options.hairColor || 0x221100,
            ...options
        };

        this.mesh = new THREE.Group();
        this.initHumanoid();
        this.scene.add(this.mesh);
    }

    initHumanoid() {
        // Torso
        const torsoGeo = new THREE.BoxGeometry(0.6, 0.8, 0.3);
        const torsoMat = new THREE.MeshStandardMaterial({ color: this.options.bodyColor });
        this.torso = new THREE.Mesh(torsoGeo, torsoMat);
        this.torso.position.y = 1.1;
        this.torso.castShadow = true;
        this.mesh.add(this.torso);

        // Head
        const headGeo = new THREE.BoxGeometry(0.35, 0.35, 0.35);
        const headMat = new THREE.MeshStandardMaterial({ color: this.options.skinColor });
        this.head = new THREE.Mesh(headGeo, headMat);
        this.head.position.y = 1.65;
        this.mesh.add(this.head);

        // Legs
        const legGeo = new THREE.BoxGeometry(0.2, 0.7, 0.2);
        this.leftLeg = new THREE.Mesh(legGeo, torsoMat);
        this.leftLeg.position.set(-0.2, 0.4, 0);
        this.rightLeg = new THREE.Mesh(legGeo, torsoMat);
        this.rightLeg.position.set(0.2, 0.4, 0);
        this.mesh.add(this.leftLeg, this.rightLeg);

        // Arms
        const armGeo = new THREE.BoxGeometry(0.2, 0.7, 0.2);
        this.leftArm = new THREE.Mesh(armGeo, torsoMat);
        this.leftArm.position.set(-0.4, 1.1, 0);
        this.rightArm = new THREE.Mesh(armGeo, torsoMat);
        this.rightArm.position.set(0.4, 1.1, 0);
        this.mesh.add(this.leftArm, this.rightArm);

        // Eyes
        const eyeGeo = new THREE.BoxGeometry(0.08, 0.08, 0.08);
        const eyeMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
        this.leftEye = new THREE.Mesh(eyeGeo, eyeMat);
        this.leftEye.position.set(-0.1, 1.7, 0.18);
        this.rightEye = new THREE.Mesh(eyeGeo, eyeMat);
        this.rightEye.position.set(0.1, 1.7, 0.18);
        this.mesh.add(this.leftEye, this.rightEye);
    }

    updateAnimation(speed, delta, time) {
        if (speed < 0.01) {
            // Idle state: reset to neutral
            this.leftLeg.rotation.x = 0;
            this.rightLeg.rotation.x = 0;
            this.leftArm.rotation.x = 0;
            this.rightArm.rotation.x = 0;
            return;
        }

        const animSpeed = 10;
        const swing = Math.sin(time * animSpeed) * 0.5;

        // Legs swing inversely
        this.leftLeg.rotation.x = swing;
        this.rightLeg.rotation.x = -swing;

        // Arms swing inversely to legs
        this.leftArm.rotation.x = -swing;
        this.rightArm.rotation.x = swing;

        // Subtle torso bobbing
        this.torso.position.y = 1.1 + Math.sin(time * animSpeed * 2) * 0.05;
        this.head.position.y = 1.65 + Math.sin(time * animSpeed * 2) * 0.05;
    }

    playPunchAnimation() {
        // Simple punch animation: throw right arm forward
        const originalRot = this.rightArm.rotation.x;
        this.rightArm.rotation.x = -Math.PI / 2;
        
        setTimeout(() => {
            if (this.rightArm) this.rightArm.rotation.x = originalRot;
        }, 150);
    }
}
