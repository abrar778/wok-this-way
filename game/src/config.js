export const PALETTE = {
    // Floor
    floorLight: '#d4a373',
    floorDark: '#a97142',
    floorGrout: 'rgba(0, 0, 0, 0.12)',

    // Walls
    wall: '#8b5a2b',
    wallTrim: '#5c3a1e',

    // Counters
    counterTop: '#c49a6c',
    counterFace: '#8b5a2b',
    counterSide: '#5c3a1e',
    counterEdge: '#3e2714',

    // Lighting
    lampShade: '#2a2a2a',
    lampBulb: '#ffeb99',
    lampGlow: 'rgba(255, 235, 150, 0.35)',
    windowFrame: '#5c3a1e',
    windowSkyTop: '#050515',
    windowSkyBottom: '#1a1a4a',
    windowStar: '#ffffff',

    // Ingredients
    rice: '#f8f8f8',
    egg: '#fff8dc',
    noodle: '#ffd700',
    greens: '#32cd32',
    shrimp: '#ff7f7f',
    chili: '#ff3300',

    // Cooking effects
    flameInner: '#ffff00',
    flameOuter: '#ff4500',
    steam: 'rgba(255, 255, 255, 0.65)',
    smoke: 'rgba(60, 60, 60, 0.85)',

    // Characters
    chefSkin: '#f5d0a9',
    chefApron: '#ffffff',
    chefHat: '#ffffff',
    customerHappy: '#4169e1',
    customerIdle: '#708090',
    customerAngry: '#dc143c',

    // UI
    orderCard: '#fff8e1',
    orderBorder: '#d2b48c',
    patienceHigh: '#00cc00',
    patienceMedium: '#ffcc00',
    patienceLow: '#ff0000',
    textDark: '#2a2a2a',
    textLight: '#f5f5f5',
    neonBlue: '#00ffff',
    neonPink: '#ff69b4',
    neonGreen: '#39ff14',
    gold: '#ffd700',
    silver: '#c0c0c0',
    bronze: '#cd7f32',

    // Screens
    titleBg: 'rgba(0, 0, 0, 0.82)',
    winOverlay: 'rgba(0, 40, 0, 0.82)',
    gameOverOverlay: 'rgba(60, 0, 0, 0.85)'
};

export const RECIPES = {
    "Midnight Ramen": {
        ingredients: ['noodle', 'egg', 'greens'],
        cooked: true,
        price: 18
    },
    "Fire Fried Rice": {
        ingredients: ['rice', 'shrimp', 'chili'],
        cooked: true,
        price: 15
    },
    "Emerald Bowl": {
        ingredients: ['greens', 'greens'],
        cooked: false,
        price: 10
    }
};

export const INGREDIENTS = ['rice', 'egg', 'noodle', 'greens', 'shrimp', 'chili'];

export const STATIONS = {
    pantry: { x: 30, y: 110, width: 200, height: 180, label: 'Pantry' },
    cuttingBoard: { x: 260, y: 110, width: 140, height: 100, label: 'Cutting Board' },
    plating: { x: 430, y: 110, width: 180, height: 120, label: 'Plating' },
    serve: { x: 640, y: 110, width: 120, height: 120, label: 'Serve' },
    bin: { x: 790, y: 110, width: 110, height: 100, label: 'Bin' },
    stove1: { x: 30, y: 330, width: 150, height: 130, label: 'Stove 1' },
    stove2: { x: 210, y: 330, width: 150, height: 130, label: 'Stove 2' }
};

export const GAME_CONSTANTS = {
    canvasWidth: 960,
    canvasHeight: 540,
    shiftDuration: 120,
    chopTime: 1500,
    cookTime: 4000,
    burnTime: 8000,
    rushStartTime: 60,
    playerSpeed: 320,
    playerAccel: 1800,
    playerFriction: 0.82,
    customerCount: 3,
    orderInterval: 20000,
    rushOrderInterval: 14000,
    patienceDrainNormal: 0.012,
    patienceDrainRush: 0.0156, // 30% faster drain once the midnight rush begins
    fastServiceThreshold: 0.75, // patience ratio above which a fast-service tip is awarded
    fastServiceBonus: 4,
    maxPlateSize: 4, // cap plate stacking to avoid absurd ingredient piles
    streakWindow: 10000, // ms; consecutive serves within this window build a combo
    streakBonus: 3
};

export const SCREENS = {
    TITLE: 'title',
    PLAY: 'play',
    WIN: 'win',
    GAME_OVER: 'over'
};
