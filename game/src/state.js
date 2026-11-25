import { SCREENS, GAME_CONSTANTS } from './config.js';

export const createState = () => ({
    screen: SCREENS.TITLE,
    shiftTimer: GAME_CONSTANTS.shiftDuration,
    money: 0,
    reputation: 3,
    heldItem: null,
    lastIngredient: null,
    orders: [],
    rushMode: false,
    gameOverCause: '',
    combo: 0,
    lastServeTime: 0,
    dishesServed: 0,
    stations: {
        stove1: { content: [], cookTimer: 0, cooked: false, burning: false },
        stove2: { content: [], cookTimer: 0, cooked: false, burning: false },
        plating: { content: [] },
        cuttingBoard: { content: null, progress: 0, chopped: false }
    },
    player: {
        x: 480,
        y: 300,
        width: 40,
        height: 40,
        facingX: 1,
        facingY: 0,
        vx: 0,
        vy: 0
    }
});

export const resetState = (state) => {
    Object.assign(state, createState());
};
