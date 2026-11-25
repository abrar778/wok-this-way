import { PALETTE, STATIONS, INGREDIENTS } from './config.js';

export const render = (ctx, state, customers) => {
    const time = performance.now();
    renderBackground(ctx, time);
    drawStations(ctx, state, time);
    drawChef(ctx, state.player, state.heldItem, time);
    drawCustomers(ctx, customers, time);
};

// ---------------------------------------------------------------------------
// Background
// ---------------------------------------------------------------------------

const renderBackground = (ctx, time) => {
    drawFloor(ctx);
    drawWalls(ctx, time);
    drawWindow(ctx, time);
};

const drawFloor = (ctx) => {
    const tileSize = 40;

    ctx.fillStyle = PALETTE.floorDark;
    ctx.fillRect(0, 80, 960, 460);

    ctx.fillStyle = PALETTE.floorLight;
    for (let y = 80; y < 540; y += tileSize) {
        for (let x = 0; x < 960; x += tileSize) {
            const col = Math.floor(x / tileSize);
            const row = Math.floor((y - 80) / tileSize);
            if ((col + row) % 2 === 0) {
                ctx.fillRect(x, y, tileSize, tileSize);
            }
        }
    }

    ctx.strokeStyle = PALETTE.floorGrout;
    ctx.lineWidth = 1;
    for (let y = 80; y <= 540; y += tileSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(960, y);
        ctx.stroke();
    }
    for (let x = 0; x <= 960; x += tileSize) {
        ctx.beginPath();
        ctx.moveTo(x, 80);
        ctx.lineTo(x, 540);
        ctx.stroke();
    }
};

const drawWalls = (ctx, time) => {
    ctx.fillStyle = PALETTE.wall;
    ctx.fillRect(0, 0, 960, 80);

    ctx.fillStyle = PALETTE.wallTrim;
    ctx.fillRect(0, 74, 960, 8);

    drawMenuPoster(ctx);
    drawLamp(ctx, 200, 28, time);
    drawLamp(ctx, 480, 28, time);
    drawLamp(ctx, 760, 28, time);
};

const drawMenuPoster = (ctx) => {
    const x = 380;
    const y = 12;
    const w = 200;
    const h = 52;

    ctx.fillStyle = '#2a1a0a';
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = '#f5f5dc';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);

    ctx.fillStyle = '#f5f5dc';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText("TONIGHT'S SPECIALS", x + w / 2, y + 20);

    ctx.font = '12px sans-serif';
    ctx.fillText('Ramen • Fried Rice • Emerald Bowl', x + w / 2, y + 40);
};

const drawLamp = (ctx, x, y, time) => {
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, y);
    ctx.stroke();

    ctx.fillStyle = PALETTE.lampShade;
    ctx.beginPath();
    ctx.moveTo(x - 18, y);
    ctx.lineTo(x + 18, y);
    ctx.lineTo(x + 12, y + 22);
    ctx.lineTo(x - 12, y + 22);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = PALETTE.lampBulb;
    ctx.beginPath();
    ctx.arc(x, y + 26, 8, 0, Math.PI * 2);
    ctx.fill();

    const pulse = 0.9 + 0.1 * Math.sin(time / 600);
    const gradient = ctx.createRadialGradient(x, y + 45, 5, x, y + 45, 55);
    gradient.addColorStop(0, `rgba(255, 235, 150, ${0.5 * pulse})`);
    gradient.addColorStop(1, 'rgba(255, 235, 150, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y + 45, 55, 0, Math.PI * 2);
    ctx.fill();
};

const drawWindow = (ctx, time) => {
    const wx = 720;
    const wy = 8;
    const ww = 200;
    const wh = 64;

    ctx.fillStyle = PALETTE.windowFrame;
    ctx.fillRect(wx, wy, ww, wh);

    const gradient = ctx.createLinearGradient(wx, wy, wx, wy + wh);
    gradient.addColorStop(0, PALETTE.windowSkyTop);
    gradient.addColorStop(1, PALETTE.windowSkyBottom);
    ctx.fillStyle = gradient;
    ctx.fillRect(wx + 8, wy + 8, ww - 16, wh - 16);

    ctx.save();
    ctx.beginPath();
    ctx.rect(wx + 8, wy + 8, ww - 16, wh - 16);
    ctx.clip();

    ctx.fillStyle = PALETTE.windowStar;
    for (let i = 0; i < 30; i++) {
        const sx = wx + 15 + (i * 37) % 170;
        const sy = wy + 12 + (i * 19) % 40;
        const twinkle = 0.5 + 0.5 * Math.sin(time / 500 + i);
        ctx.globalAlpha = twinkle;
        ctx.beginPath();
        ctx.arc(sx, sy, i % 5 === 0 ? 1.5 : 1, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.restore();
    ctx.globalAlpha = 1;

    ctx.strokeStyle = PALETTE.windowFrame;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(wx + ww / 2, wy);
    ctx.lineTo(wx + ww / 2, wy + wh);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(wx, wy + wh / 2);
    ctx.lineTo(wx + ww, wy + wh / 2);
    ctx.stroke();
};

// ---------------------------------------------------------------------------
// Stations
// ---------------------------------------------------------------------------

const drawStations = (ctx, state, time) => {
    drawPantry(ctx, state, time);
    drawCuttingBoard(ctx, state, time);
    drawStove(ctx, state, 'stove1', time);
    drawStove(ctx, state, 'stove2', time);
    drawPlating(ctx, state, time);
    drawServeCounter(ctx, state, time);
    drawBin(ctx, state, time);
};

const drawCounter3D = (ctx, x, y, w, h) => {
    const depth = 12;

    ctx.fillStyle = PALETTE.counterTop;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + w, y);
    ctx.lineTo(x + w + depth, y - depth);
    ctx.lineTo(x + depth, y - depth);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = PALETTE.counterFace;
    ctx.fillRect(x, y, w, h);

    ctx.fillStyle = PALETTE.counterSide;
    ctx.beginPath();
    ctx.moveTo(x + w, y);
    ctx.lineTo(x + w + depth, y - depth);
    ctx.lineTo(x + w + depth, y + h - depth);
    ctx.lineTo(x + w, y + h);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = PALETTE.counterEdge;
    ctx.fillRect(x, y + h - 4, w, 4);
};

// ---------------------------------------------------------------------------
// Pantry
// ---------------------------------------------------------------------------

const drawPantry = (ctx, state, time) => {
    const s = STATIONS.pantry;
    drawCounter3D(ctx, s.x, s.y, s.width, s.height);

    const crateW = 70;
    const crateH = 40;
    const startX = s.x + 20;
    const startY = s.y + 22;
    const gapX = crateW + 15;
    const gapY = crateH + 12;

    INGREDIENTS.forEach((type, i) => {
        const cx = startX + (i % 2) * gapX;
        const cy = startY + Math.floor(i / 2) * gapY;
        drawCrate(ctx, cx, cy, crateW, crateH, type);
    });

    ctx.fillStyle = PALETTE.textLight;
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('PANTRY', s.x + s.width / 2, s.y + s.height - 8);
};

const drawCrate = (ctx, x, y, w, h, type) => {
    ctx.fillStyle = '#8b5a2b';
    ctx.fillRect(x, y, w, h);

    ctx.strokeStyle = '#3e2714';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);

    ctx.beginPath();
    ctx.moveTo(x, y + h / 2);
    ctx.lineTo(x + w, y + h / 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x + w / 2, y);
    ctx.lineTo(x + w / 2, y + h);
    ctx.stroke();

    drawIngredientPile(ctx, x + 4, y + 4, w - 8, h - 8, type);
};

const drawIngredientPile = (ctx, x, y, w, h, type) => {
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.clip();

    switch (type) {
        case 'rice':
            ctx.fillStyle = PALETTE.rice;
            for (let i = 0; i < 45; i++) {
                ctx.beginPath();
                ctx.arc(x + Math.random() * w, y + Math.random() * h, 1.2, 0, Math.PI * 2);
                ctx.fill();
            }
            break;
        case 'egg':
            ctx.fillStyle = PALETTE.egg;
            for (let i = 0; i < 8; i++) {
                ctx.beginPath();
                ctx.ellipse(
                    x + 10 + (i % 4) * 14,
                    y + 8 + Math.floor(i / 4) * 12,
                    5, 7, 0, 0, Math.PI * 2
                );
                ctx.fill();
            }
            break;
        case 'noodle':
            ctx.strokeStyle = PALETTE.noodle;
            ctx.lineWidth = 2;
            for (let i = 0; i < 14; i++) {
                ctx.beginPath();
                ctx.moveTo(x + 5 + Math.random() * w, y + 5 + Math.random() * h);
                ctx.quadraticCurveTo(
                    x + Math.random() * w,
                    y + Math.random() * h,
                    x + 5 + Math.random() * w,
                    y + 5 + Math.random() * h
                );
                ctx.stroke();
            }
            break;
        case 'greens':
            ctx.fillStyle = PALETTE.greens;
            for (let i = 0; i < 12; i++) {
                drawLeaf(ctx, x + Math.random() * w, y + Math.random() * h, 6);
            }
            break;
        case 'shrimp':
            ctx.fillStyle = PALETTE.shrimp;
            for (let i = 0; i < 6; i++) {
                drawShrimp(
                    ctx,
                    x + 10 + (i % 3) * 20,
                    y + 10 + Math.floor(i / 3) * 14,
                    7
                );
            }
            break;
        case 'chili':
            ctx.fillStyle = PALETTE.chili;
            for (let i = 0; i < 12; i++) {
                ctx.beginPath();
                ctx.ellipse(
                    x + Math.random() * w,
                    y + Math.random() * h,
                    4, 2, Math.random() * Math.PI, 0, Math.PI * 2
                );
                ctx.fill();
            }
            break;
    }

    ctx.restore();
};

const drawLeaf = (ctx, x, y, size) => {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + size, y - size, x + size * 1.5, y);
    ctx.quadraticCurveTo(x + size, y + size, x, y);
    ctx.fill();
};

const drawShrimp = (ctx, x, y, size) => {
    ctx.beginPath();
    ctx.ellipse(x, y, size, size * 0.6, Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();
};

// ---------------------------------------------------------------------------
// Cutting Board
// ---------------------------------------------------------------------------

const drawCuttingBoard = (ctx, state, time) => {
    const s = STATIONS.cuttingBoard;
    drawCounter3D(ctx, s.x, s.y, s.width, s.height);

    ctx.fillStyle = '#d2b48c';
    ctx.fillRect(s.x + 15, s.y + 30, 110, 50);

    ctx.strokeStyle = '#8b5a2b';
    ctx.lineWidth = 2;
    ctx.strokeRect(s.x + 15, s.y + 30, 110, 50);

    ctx.strokeStyle = 'rgba(139, 90, 43, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(s.x + 20, s.y + 40);
    ctx.lineTo(s.x + 120, s.y + 45);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(s.x + 25, s.y + 60);
    ctx.lineTo(s.x + 115, s.y + 65);
    ctx.stroke();

    drawKnife(ctx, s.x + 95, s.y + 25);

    const cb = state.stations.cuttingBoard;
    if (cb.content) {
        drawIngredientOnBoard(ctx, s.x + 70, s.y + 55, cb.content);
        if (!cb.chopped) {
            const progress = Math.min(1, cb.progress / 1500);
            drawProgressRing(ctx, s.x + 70, s.y + 55, 22, progress, '#00cc00');
        }
    }
};

const drawKnife = (ctx, x, y) => {
    ctx.fillStyle = '#c0c0c0';
    ctx.fillRect(x, y, 5, 35);

    ctx.fillStyle = '#3e2714';
    ctx.fillRect(x - 6, y, 17, 10);
};

const drawIngredientOnBoard = (ctx, x, y, ingredient) => {
    ctx.fillStyle = PALETTE[ingredient] || '#888';
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(0,0,0,0.2)';
    ctx.lineWidth = 1;
    ctx.stroke();
};

// ---------------------------------------------------------------------------
// Stoves
// ---------------------------------------------------------------------------

const drawStove = (ctx, state, stoveName, time) => {
    const s = STATIONS[stoveName];
    const st = state.stations[stoveName];

    drawCounter3D(ctx, s.x, s.y, s.width, s.height);

    ctx.fillStyle = '#2a2a2a';
    ctx.fillRect(s.x + 20, s.y + 35, s.width - 40, 50);

    ctx.strokeStyle = '#555';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(s.x + 75, s.y + 60, 30, 12, 0, 0, Math.PI * 2);
    ctx.stroke();

    drawPan(ctx, s.x + 75, s.y + 58, st.content);

    if (st.content.length > 0 && !st.cooked && !st.burning) {
        drawFlame(ctx, s.x + 75, s.y + 72, time);
    }

    if (st.cooked && !st.burning) {
        drawSteam(ctx, s.x + 75, s.y + 45, time);
    }

    if (st.burning) {
        drawSmoke(ctx, s.x + 75, s.y + 45, time);
    }

    if (st.content.length > 0 && !st.cooked && !st.burning) {
        const progress = Math.min(1, st.cookTimer / 4000);
        drawProgressRing(ctx, s.x + 75, s.y + 58, 28, progress, '#00cc00');
    }
};

const drawPan = (ctx, cx, cy, content) => {
    ctx.fillStyle = '#444';
    ctx.beginPath();
    ctx.ellipse(cx, cy, 32, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#222';
    ctx.beginPath();
    ctx.ellipse(cx, cy, 28, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#333';
    ctx.fillRect(cx + 25, cy - 4, 28, 8);

    if (content.length > 0) {
        content.forEach((rawItem, i) => {
            const ing = rawItem.replace(/^(cooked_|chopped_|burnt_)/, '');
            const offsetX = (i - (content.length - 1) / 2) * 14;
            ctx.fillStyle = PALETTE[ing] || '#888';
            ctx.beginPath();
            ctx.ellipse(cx + offsetX, cy - 2, 14, 6, 0, 0, Math.PI * 2);
            ctx.fill();
        });
    }
};

const drawFlame = (ctx, cx, cy, time) => {
    const flicker = 1 + 0.15 * Math.sin(time / 100) + 0.1 * Math.cos(time / 70);

    ctx.fillStyle = PALETTE.flameOuter;
    ctx.beginPath();
    ctx.moveTo(cx - 10, cy);
    ctx.quadraticCurveTo(cx - 5, cy - 18 * flicker, cx, cy - 28 * flicker);
    ctx.quadraticCurveTo(cx + 5, cy - 18 * flicker, cx + 10, cy);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = PALETTE.flameInner;
    ctx.beginPath();
    ctx.moveTo(cx - 6, cy);
    ctx.quadraticCurveTo(cx - 3, cy - 10 * flicker, cx, cy - 16 * flicker);
    ctx.quadraticCurveTo(cx + 3, cy - 10 * flicker, cx + 6, cy);
    ctx.closePath();
    ctx.fill();
};

const drawSteam = (ctx, cx, cy, time) => {
    ctx.fillStyle = PALETTE.steam;
    for (let i = 0; i < 3; i++) {
        const t = (time / 600 + i * 0.7) % 2;
        const sx = cx - 15 + i * 15 + Math.sin(time / 400 + i) * 3;
        const sy = cy - t * 25;
        const r = 5 + t * 3;
        ctx.globalAlpha = 0.7 - t * 0.3;
        ctx.beginPath();
        ctx.arc(sx, sy, r, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.globalAlpha = 1;
};

const drawSmoke = (ctx, cx, cy, time) => {
    ctx.fillStyle = PALETTE.smoke;
    for (let i = 0; i < 4; i++) {
        const t = (time / 700 + i * 0.5) % 2;
        const sx = cx - 20 + i * 13 + Math.cos(time / 500 + i) * 4;
        const sy = cy - t * 30;
        const r = 7 + t * 4;
        ctx.globalAlpha = 0.8 - t * 0.3;
        ctx.beginPath();
        ctx.arc(sx, sy, r, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.globalAlpha = 1;
};

const drawProgressRing = (ctx, x, y, radius, progress, color) => {
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(x, y, radius, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * Math.min(1, progress));
    ctx.stroke();
};

// ---------------------------------------------------------------------------
// Plating
// ---------------------------------------------------------------------------

const drawPlating = (ctx, state, time) => {
    const s = STATIONS.plating;
    drawCounter3D(ctx, s.x, s.y, s.width, s.height);

    if (state.stations.plating.content.length > 0) {
        drawPlate(
            ctx,
            s.x + s.width / 2,
            s.y + s.height / 2 + 10,
            state.stations.plating.content,
            34,
            true
        );
    }

    ctx.fillStyle = PALETTE.textLight;
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('PLATING', s.x + s.width / 2, s.y + s.height - 8);
};

const drawPlate = (ctx, x, y, content, radius = 30, showCount = false) => {
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#dddddd';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
    ctx.beginPath();
    ctx.arc(x + 2, y + 2, radius - 2, 0, Math.PI * 2);
    ctx.fill();

    // Stack composed food in the centre of the plate so a half-assembled dish reads at a glance.
    content.forEach((item) => {
        drawIngredientOnPlate(ctx, x, y, item.name, radius * 0.35, item.state);
    });

    if (showCount) {
        ctx.fillStyle = PALETTE.textLight;
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${content.length}/3`, x, y + radius + 16);
    }
};

const drawIngredientOnPlate = (ctx, x, y, ingredient, scale, state) => {
    ctx.save();

    switch (ingredient) {
        case 'rice': {
            ctx.fillStyle = PALETTE.rice;
            ctx.beginPath();
            ctx.arc(x, y, scale * 0.9, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = 'rgba(0,0,0,0.1)';
            ctx.lineWidth = 1;
            ctx.stroke();
            for (let i = 0; i < 12; i++) {
                ctx.beginPath();
                ctx.arc(x + (Math.random() - 0.5) * scale, y + (Math.random() - 0.5) * scale, 1.2, 0, Math.PI * 2);
                ctx.fill();
            }
            break;
        }
        case 'egg': {
            ctx.fillStyle = PALETTE.egg;
            ctx.beginPath();
            ctx.ellipse(x, y - scale * 0.15, scale * 0.85, scale * 1.05, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = 'rgba(0,0,0,0.1)';
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.fillStyle = '#ffb347';
            ctx.beginPath();
            ctx.arc(x, y - scale * 0.1, scale * 0.35, 0, Math.PI * 2);
            ctx.fill();
            break;
        }
        case 'noodle': {
            ctx.strokeStyle = PALETTE.noodle;
            ctx.lineWidth = Math.max(2, scale * 0.18);
            const strands = 7;
            for (let i = 0; i < strands; i++) {
                const angle = (i / strands) * Math.PI * 2;
                ctx.beginPath();
                ctx.arc(
                    x + Math.cos(angle) * scale * 0.35,
                    y + Math.sin(angle) * scale * 0.35,
                    scale * 0.55,
                    angle + Math.PI / 4,
                    angle + Math.PI * 1.6
                );
                ctx.stroke();
            }
            break;
        }
        case 'greens': {
            ctx.fillStyle = state === 'burnt' ? '#3a3a3a' : PALETTE.greens;
            drawLeaf(ctx, x - scale * 0.3, y + scale * 0.1, scale * 0.7);
            drawLeaf(ctx, x + scale * 0.25, y - scale * 0.15, scale * 0.8);
            drawLeaf(ctx, x, y + scale * 0.25, scale * 0.6);
            break;
        }
        case 'shrimp': {
            ctx.fillStyle = state === 'burnt' ? '#3a3a3a' : PALETTE.shrimp;
            drawShrimp(ctx, x, y, scale * 0.85);
            break;
        }
        case 'chili': {
            ctx.fillStyle = state === 'burnt' ? '#3a3a3a' : PALETTE.chili;
            ctx.beginPath();
            ctx.ellipse(x, y, scale * 0.95, scale * 0.35, Math.PI / 6, 0, Math.PI * 2);
            ctx.fill();
            break;
        }
        default: {
            ctx.fillStyle = PALETTE[ingredient] || '#888';
            ctx.beginPath();
            ctx.arc(x, y, scale * 0.7, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    ctx.restore();
};

// ---------------------------------------------------------------------------
// Serve Counter & Bin
// ---------------------------------------------------------------------------

const drawServeCounter = (ctx, state, time) => {
    const s = STATIONS.serve;
    drawCounter3D(ctx, s.x, s.y, s.width, s.height);

    ctx.fillStyle = PALETTE.counterTop;
    ctx.fillRect(s.x + 10, s.y + 30, s.width - 20, 50);

    const dish = state.stations.serve && state.stations.serve.dish;
    if (dish && dish.type === 'dish') {
        drawPlate(ctx, s.x + s.width / 2, s.y + 55, dish.ingredients, 22);
        drawReadyPulse(ctx, s.x + s.width / 2, s.y + 18, time);
    }

    ctx.fillStyle = PALETTE.textLight;
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SERVE', s.x + s.width / 2, s.y + s.height - 8);
};

const drawReadyPulse = (ctx, x, y, time) => {
    const pulse = 1 + 0.15 * Math.sin(time / 150);
    const alpha = 0.6 + 0.4 * Math.sin(time / 150);

    ctx.save();
    ctx.translate(x, y);
    ctx.scale(pulse, pulse);

    ctx.fillStyle = `rgba(255, 215, 0, ${alpha})`;
    ctx.beginPath();
    ctx.arc(0, -8, 10, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#b8860b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, -8, 10, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#b8860b';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🔔', 0, -8);

    ctx.restore();

    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.font = 'bold 13px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText('READY!', x, y + 12);
};

const drawBin = (ctx, state, time) => {
    const s = STATIONS.bin;
    drawCounter3D(ctx, s.x, s.y, s.width, s.height);

    ctx.fillStyle = '#2a2a2a';
    ctx.fillRect(s.x + 25, s.y + 35, 60, 50);

    ctx.fillStyle = '#444';
    ctx.fillRect(s.x + 20, s.y + 30, 70, 12);

    ctx.strokeStyle = '#666';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(s.x + 55, s.y + 55);
    ctx.lineTo(s.x + 55, s.y + 70);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(s.x + 55, s.y + 62, 8, 0, Math.PI);
    ctx.stroke();

    ctx.fillStyle = PALETTE.textLight;
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('BIN', s.x + s.width / 2, s.y + s.height - 8);
};

// ---------------------------------------------------------------------------
// Chef
// ---------------------------------------------------------------------------

const drawChef = (ctx, player, heldItem, time) => {
    const cx = player.x + player.width / 2;
    const cy = player.y + player.height / 2;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.beginPath();
    ctx.ellipse(cx, player.y + player.height - 4, 18, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = PALETTE.chefSkin;
    ctx.beginPath();
    ctx.arc(cx, cy - 5, 18, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = PALETTE.chefApron;
    ctx.beginPath();
    ctx.moveTo(cx - 14, cy + 5);
    ctx.lineTo(cx + 14, cy + 5);
    ctx.lineTo(cx + 10, cy + 28);
    ctx.lineTo(cx - 10, cy + 28);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = PALETTE.chefHat;
    ctx.beginPath();
    ctx.moveTo(cx - 12, cy - 18);
    ctx.lineTo(cx + 12, cy - 18);
    ctx.lineTo(cx + 10, cy - 32);
    ctx.quadraticCurveTo(cx, cy - 38, cx - 10, cy - 32);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#000';
    const lookX = player.facingX * 2;
    const lookY = player.facingY * 2;
    ctx.beginPath();
    ctx.arc(cx - 6 + lookX, cy - 8 + lookY, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx + 6 + lookX, cy - 8 + lookY, 2.5, 0, Math.PI * 2);
    ctx.fill();

    if (heldItem) {
        drawHeldItem(ctx, cx, cy - 42, heldItem);
    }
};

const drawHeldItem = (ctx, x, y, item) => {
    if (item && typeof item === 'object' && item.type === 'dish') {
        drawPlate(ctx, x, y, item.ingredients, 16);
        return;
    }

    const ingredient = typeof item === 'string' ? item.replace(/^(cooked_|chopped_|burnt_)/, '') : item;
    ctx.fillStyle = PALETTE[ingredient] || '#888';
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(0,0,0,0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();
};

// ---------------------------------------------------------------------------
// Customers
// ---------------------------------------------------------------------------

const drawCustomers = (ctx, customers, time) => {
    const counterX = 820;
    const counterY = 230;
    const counterW = 120;
    const counterH = 280;

    ctx.fillStyle = PALETTE.counterFace;
    ctx.fillRect(counterX, counterY, counterW, counterH);

    ctx.fillStyle = PALETTE.counterTop;
    ctx.fillRect(counterX - 5, counterY - 5, counterW + 10, 15);

    customers.forEach((customer, i) => {
        const x = counterX + 60;
        const y = counterY + 40 + i * 80;
        drawCustomer(ctx, x, y, customer.state, time);
    });
};

const drawCustomer = (ctx, x, y, state, time) => {
    ctx.fillStyle = '#444';
    ctx.fillRect(x - 15, y + 35, 30, 8);

    ctx.fillStyle = '#666';
    ctx.fillRect(x - 4, y + 43, 8, 20);

    ctx.fillStyle = state === 'angry' ? PALETTE.customerAngry :
                    state === 'happy' ? PALETTE.customerHappy : PALETTE.customerIdle;

    ctx.beginPath();
    ctx.ellipse(x, y + 10, 22, 28, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x, y - 22, 16, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#000';
    if (state === 'angry') {
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x - 8, y - 26);
        ctx.lineTo(x - 2, y - 24);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x + 8, y - 26);
        ctx.lineTo(x + 2, y - 24);
        ctx.stroke();

        ctx.fillRect(x - 6, y - 18, 12, 3);

        drawSpeechBubble(ctx, x + 22, y - 48, '!');
    } else if (state === 'happy') {
        ctx.beginPath();
        ctx.arc(x - 5, y - 25, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x + 5, y - 25, 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y - 18, 5, 0, Math.PI);
        ctx.fill();
    } else {
        ctx.beginPath();
        ctx.arc(x - 5, y - 25, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x + 5, y - 25, 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillRect(x - 5, y - 18, 10, 2);
    }
};

const drawSpeechBubble = (ctx, x, y, text) => {
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 30, y - 10);
    ctx.lineTo(x + 30, y - 40);
    ctx.lineTo(x - 10, y - 40);
    ctx.lineTo(x - 10, y - 10);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = '#000';
    ctx.font = 'bold 18px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(text, x + 10, y - 18);
};
