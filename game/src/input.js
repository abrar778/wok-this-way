export const keys = {};

window.addEventListener('keydown', e => {
    keys[e.code] = true;
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'Enter', 'KeyE', 'KeyF'].includes(e.code)) {
        e.preventDefault();
    }
});

window.addEventListener('keyup', e => {
    keys[e.code] = false;
});

export const isKeyDown = (code) => !!keys[code];

export const setupInput = (state, handleInteract, serveDish, resetGame) => {
    window.addEventListener('keydown', e => {
        if (state.screen === 'play') {
            if (e.code === 'KeyE' || e.code === 'Space') {
                handleInteract();
                e.preventDefault();
            }
            if (e.code === 'KeyF') {
                serveDish();
                e.preventDefault();
            }
        } else if (e.code === 'Enter') {
            resetGame();
            e.preventDefault();
        }
    });
};
