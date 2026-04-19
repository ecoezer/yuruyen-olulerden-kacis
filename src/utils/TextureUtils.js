import * as THREE from 'three';

export class TextureUtils {
    static createAsphaltTexture() {
        const size = 512;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        // Base color
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0, 0, size, size);

        // Noise
        for (let i = 0; i < 5000; i++) {
            const x = Math.random() * size;
            const y = Math.random() * size;
            const alpha = Math.random() * 0.1;
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.fillRect(x, y, 1, 1);
        }

        // Cracks
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        for (let i = 0; i < 10; i++) {
            ctx.beginPath();
            ctx.moveTo(Math.random() * size, Math.random() * size);
            for (let j = 0; j < 5; j++) {
                ctx.lineTo(Math.random() * size, Math.random() * size);
            }
            ctx.stroke();
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(10, 10);
        return texture;
    }

    static createBrickTexture() {
        const size = 512;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        // Mortar
        ctx.fillStyle = '#222222';
        ctx.fillRect(0, 0, size, size);

        // Bricks
        const rows = 12;
        const cols = 6;
        const bHeight = size / rows;
        const bWidth = size / cols;

        for (let r = 0; r < rows; r++) {
            const offset = (r % 2) * (bWidth / 2);
            for (let c = -1; c < cols + 1; c++) {
                ctx.fillStyle = `rgb(${40 + Math.random() * 20}, ${40 + Math.random() * 20}, ${40 + Math.random() * 20})`;
                ctx.fillRect(c * bWidth + offset + 2, r * bHeight + 2, bWidth - 4, bHeight - 4);
                
                // Grunge on bricks
                ctx.fillStyle = `rgba(0, 0, 0, ${Math.random() * 0.3})`;
                ctx.fillRect(c * bWidth + offset + 2, r * bHeight + 2, bWidth - 4, bHeight - 4);
            }
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        return texture;
    }

    static createNoiseTexture(color1 = '#ffffff', color2 = '#000000', opacity = 0.1) {
        const size = 256;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        for (let x = 0; x < size; x++) {
            for (let y = 0; y < size; y++) {
                const val = Math.random();
                ctx.fillStyle = val > 0.5 ? color1 : color2;
                ctx.globalAlpha = Math.random() * opacity;
                ctx.fillRect(x, y, 1, 1);
            }
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        return texture;
    }
}
