import { STATIONS, INGREDIENTS, GAME_CONSTANTS } from './config.js';

export const getStationAt = (x, y) => {
    for (const [name, rect] of Object.entries(STATIONS)) {
        if (
            x >= rect.x &&
            x <= rect.x + rect.width &&
            y >= rect.y &&
            y <= rect.y + rect.height
        ) {
            return name;
        }
    }
    return null;
};

function parseHeldItem(item) {
    if (typeof item !== 'string') return null;
    if (item.startsWith('cooked_')) return { name: item.slice(7), state: 'cooked' };
    if (item.startsWith('chopped_')) return { name: item.slice(8), state: 'chopped' };
    if (item.startsWith('burnt_')) return { name: item.slice(6), state: 'burnt' };
    return { name: item, state: 'raw' };
}

export const handleStationInteraction = (state, stationName) => {
    const station = state.stations[stationName];
    const held = state.heldItem;

    if (stationName === 'pantry') {
        let startIndex = -1;
        if (held && typeof held === 'string' && INGREDIENTS.includes(held)) {
            startIndex = INGREDIENTS.indexOf(held);
        } else if (state.lastIngredient && INGREDIENTS.includes(state.lastIngredient)) {
            startIndex = INGREDIENTS.indexOf(state.lastIngredient);
        } else {
            startIndex = INGREDIENTS.length - 1;
        }
        const nextIndex = (startIndex + 1) % INGREDIENTS.length;
        const item = INGREDIENTS[nextIndex];
        state.heldItem = item;
        state.lastIngredient = item;
        return;
    }

    if (stationName === 'cuttingBoard') {
        if (held && !station.content) {
            const parsed = parseHeldItem(held);
            if (parsed && parsed.state === 'raw') {
                station.content = parsed.name;
                station.progress = 0;
                station.chopped = false;
                state.heldItem = null;
            }
        } else if (station.content && station.chopped && !held) {
            state.heldItem = `chopped_${station.content}`;
            station.content = null;
            station.progress = 0;
            station.chopped = false;
        }
        return;
    }

    if (stationName.startsWith('stove')) {
        if (held && station.content.length === 0) {
            const parsed = parseHeldItem(held);
            if (parsed && parsed.state !== 'burnt') {
                station.content.push(parsed.name);
                state.heldItem = null;
                station.cookTimer = 0;
                station.cooked = false;
                station.burning = false;
            }
        } else if (!held && station.content.length > 0) {
            if (station.burning) {
                state.heldItem = `burnt_${station.content[0]}`;
                station.content = [];
                station.cookTimer = 0;
                station.cooked = false;
                station.burning = false;
            } else if (station.cooked) {
                state.heldItem = `cooked_${station.content[0]}`;
                station.content = [];
                station.cookTimer = 0;
                station.cooked = false;
                station.burning = false;
            }
        }
        return;
    }

    if (stationName === 'plating') {
        if (held && typeof held === 'string') {
            if (station.content.length >= GAME_CONSTANTS.maxPlateSize) return; // plate full
            const parsed = parseHeldItem(held);
            if (parsed && parsed.state !== 'burnt' && parsed.state !== 'raw') {
                station.content.push({ name: parsed.name, state: parsed.state });
                state.heldItem = null;
            }
        } else if (!held && station.content.length > 0) {
            state.heldItem = { type: 'dish', ingredients: [...station.content] };
            station.content = [];
        }
        return;
    }

    if (stationName === 'serve') {
        // Serving is handled by the dedicated F key in main.js.
        return;
    }

    if (stationName === 'bin') {
        if (held) {
            state.heldItem = null;
        }
    }
};

export const getIngredientDisplayName = (item) => {
    if (!item) return 'Nothing';
    if (item && typeof item === 'object' && item.type === 'dish') return 'Finished Dish';
    if (item.startsWith('cooked_')) return `Cooked ${item.slice(7)}`;
    if (item.startsWith('chopped_')) return `Chopped ${item.slice(8)}`;
    if (item.startsWith('burnt_')) return `Burnt ${item.slice(6)}`;
    return item.charAt(0).toUpperCase() + item.slice(1);
};
