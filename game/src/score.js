import { GAME_CONSTANTS } from './config.js';

export const addScore = (state, amount, isServe = false) => {
    if (isServe) {
        const now = Date.now();
        if (state.lastServeTime && now - state.lastServeTime <= GAME_CONSTANTS.streakWindow) {
            state.combo += 1;
        } else {
            state.combo = 1;
        }
        state.lastServeTime = now;
        state.dishesServed += 1;
        amount += (state.combo - 1) * GAME_CONSTANTS.streakBonus;
    }

    const before = state.money;
    state.money += Math.max(0, Math.floor(amount));

    // Restore one reputation heart for every full $50 earned, up to the max of 3.
    const hearts = Math.floor(state.money / 50) - Math.floor(before / 50);
    if (hearts > 0) {
        state.reputation = Math.min(3, state.reputation + hearts);
    }
};

export const reduceReputation = (state) => {
    state.reputation = Math.max(0, state.reputation - 1);
};

export const addReputation = (state) => {
    state.reputation = Math.min(3, state.reputation + 1);
};
