export class Input {
    constructor() {
        this.keys = {};
        this.mouse = { x: 0, y: 0 };

        window.addEventListener('keydown', (e) => this.keys[e.code] = true);
        window.addEventListener('keyup', (e) => this.keys[e.code] = false);
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        });
    }

    isPressed(code) {
        return !!this.keys[code];
    }

    getAxis() {
        const x = (this.isPressed('KeyD') || this.isPressed('ArrowRight') ? 1 : 0) - 
                  (this.isPressed('KeyA') || this.isPressed('ArrowLeft') ? 1 : 0);
        const z = (this.isPressed('KeyS') || this.isPressed('ArrowDown') ? 1 : 0) - 
                  (this.isPressed('KeyW') || this.isPressed('ArrowUp') ? 1 : 0);
        return { x, z };
    }
}
