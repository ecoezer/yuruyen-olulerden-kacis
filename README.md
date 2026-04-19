# Walking Dead Escape (Yürüyen Ölülerden Kaçış)

A visceral 3D isometric zombie survival and escape game built with **Three.js**, **JavaScript**, and **Vite**. Navigate through a foggy, post-apocalyptic city, scavenge for loot, and survive the undead onslaught using an advanced auto-combat system.

## 🕹️ Gameplay & Features

- **Advanced Humanoid Visuals**: Characters feature hierarchical skeletal structures with procedural walking and attack animations.
- **Auto-Combat System**: Intelligent target detection that automatically engages the nearest zombie within weapon range using the best available equipment.
- **Dynamic Loot System**: Defeated zombies drop randomized 3D items, including Ammo, Medkits, and specific weapons like Knives, Axes, and Bats.
- **Procedural Atmosphere**: Real-time noise-based textures for asfalt, brick walls, and grunge effects, combined with a flickering light system for high tension.
- **Resource Management**: Manage Stamina (running), Health (healing with Medkits), and Ammo (switching to melee when empty).

## ⌨️ Controls

- **W, A, S, D**: Move Character
- **Left Shift**: Sprint (Consumes Stamina)
- **Auto-Attack**: Automatically attacks nearby zombies.
- **1, 2, 3...**: Switch Weapons (Fists, Knife, Axe, Bat, Pistol)
- **E**: Interact / Pick up items
- **F**: Toggle Flashlight
- **H**: Use Medkit (Restores 30% Health)

## 🛠️ Technical Stack

- **Core**: JavaScript (ES6+)
- **Graphics**: [Three.js](https://threejs.org/) (WebGL)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Shaders/Textures**: Procedural Canvas API generation
- **Physics**: Custom Raycast-based collision and hit detection

## 🚀 Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```

---

*This project was developed as a high-fidelity web-based survival prototype, showcasing procedural animation and real-time lighting in a browser environment.*
