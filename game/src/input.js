export const keys = {};
const handled = new Set();

window.addEventListener('keydown', e => {
    keys[e.code] = true;
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'Enter', 'KeyE', 'KeyF'].includes(e.code)) {
        e.preventDefault();
    }
});

window.addEventListener('keyup', e => {
    keys[e.code] = false;
    handled.delete(e.code);
});

export const isKeyDown = (code) => !!keys[code];

export const setupInput = (state, handleInteract, serveDish, resetGame) => {
    window.addEventListener('keydown', e => {
        if (state.screen === 'play') {
            if (e.code === 'KeyE' || e.code === 'Space') {
                if (!handled.has(e.code)) {
                    handleInteract();
                    handled.add(e.code);
                }
                e.preventDefault();
            }
            if (e.code === 'KeyF') {
                if (!handled.has(e.code)) {
                    serveDish();
                    handled.add(e.code);
                }
                e.preventDefault();
            }
        } else if (e.code === 'Enter') {
            if (!handled.has(e.code)) {
                resetGame();
                handled.add(e.code);
            }
            e.preventDefault();
        }
    });
};
