import { createState, resetState } from './state.js';
import { createPlayer, updatePlayer } from './player.js';
import { render } from './render.js';
import { renderHUD, renderScreen } from './hud.js';
import { setupInput, keys } from './input.js';
import { getStationAt, handleStationInteraction } from './pantry.js';
import { generateOrder, updateOrders, checkOrderMatch, calculateOrderValue } from './orders.js';
import { updateCooking, updateChopping } from './cook.js';
import { playSound, setSizzle } from './audio.js';
import { SCREENS, GAME_CONSTANTS } from './config.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const state = createState();
state.player = createPlayer();

const customers = [
    { id: 1, state: 'idle' },
    { id: 2, state: 'idle' },
    { id: 3, state: 'idle' }
];

let lastOrderTime = 0;

function resetGame() {
    resetState(state);
    state.player = createPlayer();
    customers.forEach(c => { c.state = 'idle'; });
    lastOrderTime = performance.now();
    state.screen = SCREENS.PLAY;
    setSizzle(false);
}

function handleInteract() {
    const px = state.player.x + state.player.width / 2;
    const py = state.player.y + state.player.height / 2;
    const station = getStationAt(px, py);

    if (!station) return;

    const before = state.heldItem;
    handleStationInteraction(state, station);
    const after = state.heldItem;

    if (station === 'cuttingBoard' && before && !after) {
        // Item placed to start chopping; the completion sound is handled in updateGame.
    }

    if (station.startsWith('stove') && before && !after) {
        // Item placed to start cooking; sizzle is handled in updateGame.
    }

    if (station === 'bin' && before) {
        // Item disposed; no sound required.
    }
}

function serveDish() {
    if (!state.heldItem || state.heldItem.type !== 'dish') return;

    const plate = state.heldItem.ingredients;
    let matchedIndex = -1;

    for (let i = 0; i < state.orders.length; i++) {
        if (checkOrderMatch(plate, state.orders[i])) {
            matchedIndex = i;
            break;
        }
    }

    if (matchedIndex >= 0) {
        const order = state.orders[matchedIndex];
        state.money += calculateOrderValue(order);
        state.reputation = Math.min(3, state.reputation + 1);
        state.orders.splice(matchedIndex, 1);
        state.heldItem = null;
        playSound('serve');
        flashCustomer('happy');
    } else {
        state.reputation = Math.max(0, state.reputation - 1);
        state.heldItem = null;
        playSound('error');
        flashCustomer('angry');
    }
}

function flashCustomer(mood) {
    const target = customers.find(c => c.state !== mood) || customers[0];
    if (!target) return;

    const previous = target.state;
    target.state = mood;
    setTimeout(() => {
        target.state = previous === 'angry' && mood === 'happy' ? 'idle' : previous;
    }, 1200);
}

function updateGame(deltaTime) {
    updatePlayer(state.player, keys, deltaTime);

    state.shiftTimer -= deltaTime / 1000;
    state.rushMode = state.shiftTimer < GAME_CONSTANTS.rushStartTime;

    const c1 = updateCooking(state.stations.stove1, deltaTime);
    const c2 = updateCooking(state.stations.stove2, deltaTime);
    if (c1.burned || c2.burned) {
        playSound('burn');
    }

    const chop = updateChopping(state.stations.cuttingBoard, deltaTime);
    if (chop.chopped) {
        playSound('chop');
    }

    state.orders = updateOrders(state.orders, deltaTime, state.rushMode);

    state.orders.forEach(order => {
        if (order.patience <= 0 && !order.expired) {
            order.expired = true;
            state.reputation = Math.max(0, state.reputation - 1);
            playSound('error');
            flashCustomer('angry');
        }
    });
    state.orders = state.orders.filter(o => o.patience > 0);

    const now = performance.now();
    const interval = state.rushMode ? GAME_CONSTANTS.rushOrderInterval : GAME_CONSTANTS.orderInterval;
    if (now - lastOrderTime > interval && state.orders.length < 3) {
        state.orders.push(generateOrder());
        lastOrderTime = now;
    }

    const anyCooking =
        (state.stations.stove1.content.length > 0 && !state.stations.stove1.cooked && !state.stations.stove1.burning) ||
        (state.stations.stove2.content.length > 0 && !state.stations.stove2.cooked && !state.stations.stove2.burning);
    setSizzle(anyCooking);

    if (state.reputation <= 0) {
        state.screen = SCREENS.GAME_OVER;
        state.gameOverCause = 'CUSTOMERS LOST CONFIDENCE';
        setSizzle(false);
    } else if (state.shiftTimer <= 0) {
        state.screen = SCREENS.WIN;
        setSizzle(false);
    }
}

function demo() {
    state.screen = SCREENS.PLAY;
    state.shiftTimer = 83;
    state.money = 46;
    state.reputation = 2;
    state.heldItem = null;
    state.lastIngredient = null;
    state.rushMode = false;
    state.gameOverCause = '';

    state.orders = [
        {
            id: 'demo1',
            recipe: 'Midnight Ramen',
            ingredients: ['noodle', 'egg', 'greens'],
            patience: 70,
            maxPatience: 100,
            served: false,
            expired: false
        },
        {
            id: 'demo2',
            recipe: 'Fire Fried Rice',
            ingredients: ['rice', 'shrimp', 'chili'],
            patience: 50,
            maxPatience: 100,
            served: false,
            expired: false
        },
        {
            id: 'demo3',
            recipe: 'Emerald Bowl',
            ingredients: ['greens', 'greens'],
            patience: 90,
            maxPatience: 100,
            served: false,
            expired: false
        }
    ];

    state.stations.stove1 = { content: ['rice', 'shrimp'], cookTimer: 2400, cooked: false, burning: false };
    state.stations.stove2 = { content: [], cookTimer: 0, cooked: false, burning: false };
    state.stations.cuttingBoard = { content: 'greens', progress: 1500, chopped: true };
    state.stations.plating = {
        content: [
            { name: 'noodle', state: 'cooked' },
            { name: 'egg', state: 'cooked' }
        ]
    };
    state.stations.serve = {
        dish: {
            type: 'dish',
            ingredients: [
                { name: 'greens', state: 'chopped' },
                { name: 'greens', state: 'chopped' }
            ]
        }
    };

    customers[0].state = 'idle';
    customers[1].state = 'idle';
    customers[2].state = 'angry';

    lastOrderTime = performance.now();
    setSizzle(true);
}

setupInput(state, handleInteract, serveDish, resetGame);

window.__wok = {
    show: (screen) => { state.screen = screen; },
    state: () => state,
    demo: demo
};

let lastTime = performance.now();

function loop(timestamp) {
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (state.screen === SCREENS.PLAY) {
        updateGame(deltaTime);
        render(ctx, state, customers);
        renderHUD(ctx, state);
    } else {
        render(ctx, state, customers);
        renderScreen(ctx, state);
    }

    requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
