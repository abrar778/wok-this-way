import { GAME_CONSTANTS } from './config.js';

export const updateCooking = (station, deltaTime) => {
    const events = { cooked: false, burned: false };
    const dt = Math.max(0, deltaTime);

    if (station.content.length > 0) {
        if (!station.burning) {
            station.cookTimer += dt;
            station.cookTimer = Math.min(station.cookTimer, GAME_CONSTANTS.burnTime);
        }

        if (!station.cooked && station.cookTimer >= GAME_CONSTANTS.cookTime) {
            station.cooked = true;
            events.cooked = true;
        }

        if (!station.burning && station.cookTimer >= GAME_CONSTANTS.burnTime) {
            station.burning = true;
            events.burned = true;
        }
    }

    return events;
};

export const updateChopping = (station, deltaTime) => {
    const events = { chopped: false };
    const dt = Math.max(0, deltaTime);

    if (station.content && !station.chopped) {
        station.progress += dt;
        station.progress = Math.min(station.progress, GAME_CONSTANTS.chopTime);

        if (station.progress >= GAME_CONSTANTS.chopTime) {
            station.chopped = true;
            events.chopped = true;
        }
    }

    return events;
};

export const resetCookingStation = (station) => {
    station.content = [];
    station.cookTimer = 0;
    station.cooked = false;
    station.burning = false;
};

export const resetChoppingStation = (station) => {
    station.content = null;
    station.progress = 0;
    station.chopped = false;
};

export const isBurnt = (station) => station.burning;
