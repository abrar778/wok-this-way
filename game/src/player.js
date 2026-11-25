import { GAME_CONSTANTS } from './config.js';

export const createPlayer = () => ({
    x: 480,
    y: 300,
    width: 40,
    height: 40,
    facingX: 1,
    facingY: 0
});

export const updatePlayer = (player, keys, deltaTime) => {
    const speed = GAME_CONSTANTS.playerSpeed * (deltaTime / 1000);
    let moved = false;

    if (keys['ArrowUp']) {
        player.y -= speed;
        player.facingY = -1;
        moved = true;
    }
    if (keys['ArrowDown']) {
        player.y += speed;
        player.facingY = 1;
        moved = true;
    }
    if (keys['ArrowLeft']) {
        player.x -= speed;
        player.facingX = -1;
        moved = true;
    }
    if (keys['ArrowRight']) {
        player.x += speed;
        player.facingX = 1;
        moved = true;
    }

    if (!moved) {
        player.facingY = 0;
    }

    player.x = Math.max(0, Math.min(GAME_CONSTANTS.canvasWidth - player.width, player.x));
    player.y = Math.max(80, Math.min(GAME_CONSTANTS.canvasHeight - player.height, player.y));
};

export const isAtStation = (player, station) => (
    player.x < station.x + station.width &&
    player.x + player.width > station.x &&
    player.y < station.y + station.height &&
    player.y + player.height > station.y
);
