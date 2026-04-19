import * as THREE from 'three';
import { COLORS } from '../utils/Constants.js';

export class Engine {
    constructor(container) {
        this.container = container;
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(COLORS.FOG);
        this.scene.fog = new THREE.FogExp2(COLORS.FOG, 0.01); // Near zero fog

        this.initCamera();
        this.initRenderer();
        this.initLights();

        window.addEventListener('resize', () => this.onWindowResize());
    }

    initCamera() {
        const aspect = window.innerWidth / window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
        // Better follow angle
        this.cameraOffset = new THREE.Vector3(8, 12, 8);
        this.camera.position.copy(this.cameraOffset);
        this.camera.lookAt(0, 0, 0);
    }

    initRenderer() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.container.appendChild(this.renderer.domElement);
    }

    initLights() {
        const ambient = new THREE.AmbientLight(0xffffff, 1.5); // Sunlight level ambient
        this.scene.add(ambient);

        const moonLight = new THREE.DirectionalLight(0x5555ff, 1.5);
        moonLight.position.set(50, 100, 50);
        moonLight.castShadow = true;
        this.scene.add(moonLight);
    }

    updateCamera(targetPos) {
        const desiredPos = targetPos.clone().add(this.cameraOffset);
        this.camera.position.lerp(desiredPos, 0.05);
        this.camera.lookAt(targetPos);
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}
