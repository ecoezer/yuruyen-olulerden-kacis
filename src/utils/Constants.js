export const COLORS = {
    GROUND: 0x333333,
    WALL: 0x444444,
    PLAYER: 0x3498db,
    ZOMBIE: 0xc0392b,
    KEY: 0xf1c40f,
    EXIT: 0x27ae60,
    FOG: 0x222222 // Brighter fog/background
};

export const SETTINGS = {
    PLAYER_SPEED: 0.1,
    RUN_MULTIPLIER: 1.8,
    PLAYER_RADIUS: 0.5,
    ZOMBIE_SPEED: 0.04,
    ZOMBIE_DETECTION_RANGE: 15,
    ZOMBIE_MAX_HEALTH: 3,
    BULLET_DAMAGE: 1,
    STAMINA_REGEN: 0.2,
    STAMINA_DRAIN: 0.5,
    MAX_HEALTH: 100,
    DAMAGE_COOLDOWN: 1000 // ms
};

export const WEAPONS = {
    FISTS: { id: 'fists', name: 'Yumruk', damage: 1, range: 1.5, speed: 500, type: 'melee' },
    KNIFE: { id: 'knife', name: 'Bıçak', damage: 2, range: 2.0, speed: 300, type: 'melee' },
    AXE: { id: 'axe', name: 'Balta', damage: 4, range: 2.2, speed: 800, type: 'melee' },
    BAT: { id: 'bat', name: 'Sopa', damage: 2, range: 2.5, speed: 600, type: 'melee' },
    PISTOL: { id: 'pistol', name: 'Tabanca', damage: 3, range: 20.0, speed: 400, type: 'ranged' }
};
