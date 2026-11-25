import { PALETTE, RECIPES } from './config.js';
import { getIngredientDisplayName } from './pantry.js';

export const renderHUD = (ctx, state) => {
    renderOrderTickets(ctx, state.orders);
    renderBottomHUD(ctx, state);
};

// ---------------------------------------------------------------------------
// Order tickets
// ---------------------------------------------------------------------------

const renderOrderTickets = (ctx, orders) => {
    orders.forEach((order, index) => {
        const x = 730;
        const y = 20 + index * 115;
        const w = 210;
        const h = 100;
        const low = order.patience < 25;

        ctx.save();
        if (low) {
            const wobble = Math.sin(performance.now() / 80) * 3;
            ctx.translate(wobble, 0);
        }

        ctx.fillStyle = PALETTE.orderCard;
        ctx.strokeStyle = PALETTE.orderBorder;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, 10);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#b71c1c';
        ctx.beginPath();
        ctx.arc(x + 14, y + 10, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = PALETTE.textDark;
        ctx.font = 'bold 15px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(order.recipe, x + 26, y + 26);

        const recipe = RECIPES[order.recipe];
        if (recipe) {
            recipe.ingredients.forEach((ingredient, i) => {
                drawIngredientIcon(ctx, x + 26 + i * 28, y + 52, ingredient, 9);
            });
        }

        const barW = 180;
        const barH = 10;
        const barX = x + 15;
        const barY = y + 76;

        ctx.fillStyle = '#cccccc';
        ctx.fillRect(barX, barY, barW, barH);

        const patienceColor = order.patience > 60 ? PALETTE.patienceHigh :
                              order.patience > 25 ? PALETTE.patienceMedium : PALETTE.patienceLow;
        ctx.fillStyle = patienceColor;
        ctx.fillRect(barX, barY, barW * (order.patience / 100), barH);

        ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.lineWidth = 1;
        ctx.strokeRect(barX, barY, barW, barH);

        ctx.fillStyle = PALETTE.textDark;
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(`${Math.round(order.patience)}%`, x + w - 15, barY + barH + 14);

        ctx.restore();
    });
};

const drawIngredientIcon = (ctx, x, y, ingredient, radius) => {
    ctx.fillStyle = PALETTE[ingredient] || '#888888';
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    ctx.stroke();
};

// ---------------------------------------------------------------------------
// Bottom HUD
// ---------------------------------------------------------------------------

const renderBottomHUD = (ctx, state) => {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.fillRect(0, 500, 960, 40);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, 500);
    ctx.lineTo(960, 500);
    ctx.stroke();

    const totalSeconds = Math.max(0, state.shiftTimer);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    const timerText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    ctx.fillStyle = PALETTE.textLight;
    ctx.font = 'bold 26px "Courier New", monospace';
    ctx.textAlign = 'left';
    ctx.fillText(timerText, 20, 528);

    if (state.rushMode) {
        ctx.fillStyle = PALETTE.patienceLow;
        ctx.font = 'bold 14px sans-serif';
        ctx.fillText('RUSH!', 110, 528);
    }

    ctx.font = 'bold 22px "Courier New", monospace';
    ctx.fillText(`$${state.money}`, 170, 528);

    for (let i = 0; i < 3; i++) {
        drawHeart(ctx, 260 + i * 28, 520, i < state.reputation ? PALETTE.patienceLow : '#333333');
    }

    ctx.font = '16px sans-serif';
    ctx.fillStyle = PALETTE.textLight;
    ctx.textAlign = 'left';
    const label = getIngredientDisplayName(state.heldItem);
    ctx.fillText(`Holding: ${label}`, 360, 528);

    ctx.font = '14px sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fillText(getHint(state), 560, 528);

    ctx.font = 'bold 13px sans-serif';
    ctx.fillStyle = PALETTE.neonGreen;
    ctx.textAlign = 'left';
    ctx.fillText(`Objective: ${getObjective(state)}`, 360, 512);
};

const drawHeart = (ctx, x, y, color) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, y + 5);
    ctx.bezierCurveTo(x, y, x - 8, y - 6, x - 8, y + 2);
    ctx.bezierCurveTo(x - 8, y + 6, x, y + 12, x, y + 12);
    ctx.bezierCurveTo(x, y + 12, x + 8, y + 6, x + 8, y + 2);
    ctx.bezierCurveTo(x + 8, y - 6, x, y, x, y + 5);
    ctx.fill();
};

const getHint = (state) => {
    if (!state.heldItem) return 'E / Space: pick up an item';
    if (state.heldItem && typeof state.heldItem === 'object' && state.heldItem.type === 'dish') {
        return 'F: serve the finished dish';
    }
    if (typeof state.heldItem === 'string') {
        if (state.heldItem.startsWith('cooked_')) return 'E / Space: plate cooked food';
        if (state.heldItem.startsWith('chopped_')) return 'E / Space: plate chopped food';
        if (state.heldItem.startsWith('burnt_')) return 'E / Space: throw it in the bin';
        return 'E / Space: chop or cook the ingredient';
    }
    return 'Arrows: move around the kitchen';
};

const getObjective = (state) => {
    if (state.heldItem && typeof state.heldItem === 'object' && state.heldItem.type === 'dish') {
        return 'Serve!';
    }

    const pan1 = state.stations.stove1;
    const pan2 = state.stations.stove2;
    const plate = state.stations.plating;
    const board = state.stations.cuttingBoard;

    const anyPanNeedsEmptying =
        (pan1.content.length > 0 && (pan1.cooked || pan1.burning)) ||
        (pan2.content.length > 0 && (pan2.cooked || pan2.burning));
    if (anyPanNeedsEmptying) return 'Empty the pan';

    const anyPanCooking =
        (pan1.content.length > 0 && !pan1.cooked && !pan1.burning) ||
        (pan2.content.length > 0 && !pan2.cooked && !pan2.burning);
    if (anyPanCooking) return 'Cook the pan';

    if (board.content && !board.chopped) return 'Chop at the board';

    if (state.heldItem && typeof state.heldItem === 'string') {
        if (state.heldItem.startsWith('cooked_') || state.heldItem.startsWith('chopped_')) {
            if (plate.content.length > 0 && plate.content.length < 3) return 'Plate it';
            return 'Build the dish';
        }
        if (state.heldItem.startsWith('burnt_')) return 'Throw it in the bin';
        return 'Prep the ingredient';
    }

    if (plate.content.length > 0 && plate.content.length < 3) return 'Plate it';
    if (plate.content.length >= 3) return 'Finish the dish';

    return 'Grab an ingredient';
};

// ---------------------------------------------------------------------------
// Screen overlays
// ---------------------------------------------------------------------------

export const renderScreen = (ctx, state) => {
    if (state.screen === 'title') {
        renderTitleScreen(ctx);
    } else if (state.screen === 'win') {
        renderWinScreen(ctx, state.money);
    } else if (state.screen === 'over') {
        renderGameOverScreen(ctx, state.gameOverCause);
    }
};

const renderTitleScreen = (ctx) => {
    ctx.fillStyle = PALETTE.titleBg;
    ctx.fillRect(0, 0, 960, 540);

    drawSteamSwirls(ctx);

    ctx.textAlign = 'center';
    ctx.shadowColor = PALETTE.neonBlue;
    ctx.shadowBlur = 25;
    ctx.fillStyle = PALETTE.neonPink;
    ctx.font = 'bold 80px "Arial Black", sans-serif';
    ctx.fillText('WOK THIS WAY', 480, 190);
    ctx.shadowBlur = 0;

    ctx.fillStyle = PALETTE.textLight;
    ctx.font = 'italic 28px sans-serif';
    ctx.fillText('midnight diner rush', 480, 235);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(300, 270, 360, 160, 12);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = PALETTE.textLight;
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText('CONTROLS', 480, 300);

    ctx.font = '16px sans-serif';
    ctx.fillText('Arrow Keys: Move Around', 480, 330);
    ctx.fillText('E / Space: Pick Up / Place / Interact', 480, 355);
    ctx.fillText('F: Serve Completed Dishes', 480, 380);
    ctx.fillText('Enter: Start / Restart Shift', 480, 405);

    if (Math.floor(performance.now() / 500) % 2 === 0) {
        ctx.fillStyle = PALETTE.neonGreen;
        ctx.font = 'bold 24px sans-serif';
        ctx.fillText('PRESS ENTER TO START SHIFT', 480, 470);
    }
};

const drawSteamSwirls = (ctx) => {
    const time = performance.now() / 1000;

    for (let i = 0; i < 8; i++) {
        const x = 150 + i * 95 + Math.sin(time * 0.5 + i) * 30;
        const y = 80 + Math.cos(time * 0.7 + i) * 40;
        const radius = 25 + Math.sin(time + i) * 8;
        const alpha = 0.12 + 0.08 * Math.sin(time + i);

        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
    }
};

const renderWinScreen = (ctx, money) => {
    ctx.fillStyle = PALETTE.winOverlay;
    ctx.fillRect(0, 0, 960, 540);

    drawConfetti(ctx);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 60px sans-serif';
    ctx.fillText('SHIFT COMPLETE!', 480, 180);

    ctx.font = '36px sans-serif';
    ctx.fillText(`Final Earnings: $${money}`, 480, 250);

    const rank = money >= 120 ? 'S' :
                 money >= 85 ? 'A' :
                 money >= 50 ? 'B' : 'C';

    ctx.font = 'bold 140px sans-serif';
    ctx.fillStyle = rank === 'S' ? PALETTE.gold :
                    rank === 'A' ? PALETTE.silver :
                    rank === 'B' ? PALETTE.bronze : '#888888';
    ctx.fillText(rank, 480, 380);

    ctx.font = 'bold 30px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(
        rank === 'S' ? 'LEGENDARY CHEF' :
        rank === 'A' ? 'TOP NOTCH' :
        rank === 'B' ? 'SOLID SHIFT' : 'KEEP PRACTICING',
        480,
        420
    );

    if (Math.floor(performance.now() / 500) % 2 === 0) {
        ctx.font = '24px sans-serif';
        ctx.fillText('PRESS ENTER TO PLAY AGAIN', 480, 480);
    }
};

let confetti = null;

const getConfetti = () => {
    if (!confetti) {
        confetti = [];
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
        for (let i = 0; i < 80; i++) {
            confetti.push({
                x: Math.random() * 960,
                y: Math.random() * 540,
                color: colors[Math.floor(Math.random() * colors.length)],
                speed: 1 + Math.random() * 2,
                phase: Math.random() * Math.PI * 2
            });
        }
    }
    return confetti;
};

const drawConfetti = (ctx) => {
    const time = performance.now() / 1000;
    const particles = getConfetti();

    particles.forEach(p => {
        const y = (p.y + time * p.speed * 30) % 600;
        const x = p.x + Math.sin(time * 2 + p.phase) * 20;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(time + p.phase);
        ctx.fillStyle = p.color;
        ctx.fillRect(-4, -3, 8, 6);
        ctx.restore();
    });
};

const renderGameOverScreen = (ctx, cause) => {
    const gradient = ctx.createRadialGradient(480, 270, 100, 480, 270, 600);
    gradient.addColorStop(0, 'rgba(80, 0, 0, 0.6)');
    gradient.addColorStop(1, 'rgba(40, 0, 0, 0.95)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 960, 540);

    ctx.textAlign = 'center';
    ctx.font = 'bold 70px sans-serif';
    ctx.fillStyle = '#ff3333';
    ctx.fillText('GAME OVER', 480, 210);

    ctx.font = '28px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(cause || 'SHIFT ENDED', 480, 280);

    if (Math.floor(performance.now() / 500) % 2 === 0) {
        ctx.font = '24px sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('PRESS ENTER TO RESTART', 480, 350);
    }
};
