export const addScore = (state, amount) => {
    state.money += amount;
};

export const reduceReputation = (state) => {
    state.reputation = Math.max(0, state.reputation - 1);
};

export const addReputation = (state) => {
    state.reputation = Math.min(3, state.reputation + 1);
};
