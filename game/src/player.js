import { GAME_CONSTANTS } from './config.js';

export const createPlayer = () => ({
    x: 480,
    y: 300,
    width: 40,
    height: 40,
    facingX: 1,
    facingY: 0,
    vx: 0,
    vy: 0
});

export const updatePlayer = (player, keys, deltaTime) => {
    const dt = deltaTime / 1000;
    const accel = GAME_CONSTANTS.playerAccel * dt;
    const maxSpeed = GAME_CONSTANTS.playerSpeed * dt;
    let moving = false;

    if (keys['ArrowUp']) {
        player.vy -= accel;
        player.facingY = -1;
        moving = true;
    }
    if (keys['ArrowDown']) {
        player.vy += accel;
        player.facingY = 1;
        moving = true;
    }
    if (keys['ArrowLeft']) {
        player.vx -= accel;
        player.facingX = -1;
        moving = true;
    }
    if (keys['ArrowRight']) {
        player.vx += accel;
        player.facingX = 1;
        moving = true;
    }

    if (!moving) {
        player.vx *= GAME_CONSTANTS.playerFriction;
        player.vy *= GAME_CONSTANTS.playerFriction;
        player.facingY = 0;
        if (Math.abs(player.vx) < 1) player.vx = 0;
        if (Math.abs(player.vy) < 1) player.vy = 0;
    }

    const speed = Math.hypot(player.vx, player.vy);
    if (speed > maxSpeed) {
        const scale = maxSpeed / speed;
        player.vx *= scale;
        player.vy *= scale;
    }

    player.x += player.vx;
    player.y += player.vy;

    player.x = Math.max(0, Math.min(GAME_CONSTANTS.canvasWidth - player.width, player.x));
    player.y = Math.max(80, Math.min(GAME_CONSTANTS.canvasHeight - player.height, player.y));
};

export const isAtStation = (player, station) => (
    player.x < station.x + station.width &&
    player.x + player.width > station.x &&
    player.y < station.y + station.height &&
    player.y + player.height > station.y
);
