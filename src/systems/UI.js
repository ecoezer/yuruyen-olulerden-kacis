export class UI {
    constructor() {
        this.healthBar = document.getElementById('health-bar');
        this.staminaBar = document.getElementById('stamina-bar');
        this.interactionPrompt = document.getElementById('interaction-prompt');
        this.loadingScreen = document.getElementById('loading-screen');
        this.screenOverlay = document.getElementById('screen-overlay');
        this.gameOverScreen = document.getElementById('game-over');
        this.victoryScreen = document.getElementById('victory');
        
        this.inventorySlots = {
            key: document.getElementById('slot-key'),
            medkit: document.getElementById('slot-medkit'),
            ammo: document.getElementById('slot-ammo')
        };
    }

    hideLoading() {
        this.loadingScreen.classList.add('hidden');
    }

    updateHUD(player) {
        this.healthBar.style.width = `${player.health}%`;
        this.staminaBar.style.width = `${player.stamina}%`;

        // Weapon display
        const weapon = player.inventory.weapons[player.currentWeaponIndex];
        const ammoSlot = this.inventorySlots.ammo;
        ammoSlot.innerText = `${weapon.name} [AUTO] | Ammo: ${player.inventory.ammo}`;
        
        // Inventory display
        if (player.inventory.key) this.inventorySlots.key.classList.add('active');
        this.inventorySlots.medkit.innerText = player.inventory.medkits;
    }

    showGameOver() {
        this.screenOverlay.classList.remove('hidden');
        this.gameOverScreen.classList.remove('hidden');
    }

    showVictory() {
        this.screenOverlay.classList.remove('hidden');
        this.victoryScreen.classList.remove('hidden');
    }

    setInteraction(visible, text = '') {
        if (visible) {
            this.interactionPrompt.classList.remove('hidden');
            // If text is provided, could update the prompt
        } else {
            this.interactionPrompt.classList.add('hidden');
        }
    }
}
