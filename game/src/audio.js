let audioCtx = null;
let initialized = false;
let noiseBuffer = null;
let sizzleSource = null;
let sizzleGain = null;

const initAudio = () => {
    if (!initialized) {
        try {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            initialized = true;
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
        } catch (e) {
            // Web Audio API not supported; remain silent.
        }
    } else if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
};

const getNoiseBuffer = () => {
    if (!audioCtx) return null;
    if (!noiseBuffer) {
        const duration = 3;
        const samples = Math.ceil(audioCtx.sampleRate * duration);
        noiseBuffer = audioCtx.createBuffer(1, samples, audioCtx.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        for (let i = 0; i < samples; i++) {
            data[i] = Math.random() * 2 - 1;
        }
    }
    return noiseBuffer;
};

const oscTone = (freq, type, duration, gainValue = 0.1, freqEnd = null) => {
    if (!audioCtx) return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    if (freqEnd !== null) {
        osc.frequency.exponentialRampToValueAtTime(freqEnd, audioCtx.currentTime + duration);
    }

    gain.gain.setValueAtTime(gainValue, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
};

const noiseBurst = (duration, gainValue = 0.1) => {
    if (!audioCtx) return;
    const buffer = getNoiseBuffer();
    if (!buffer) return;

    const source = audioCtx.createBufferSource();
    source.buffer = buffer;

    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(gainValue, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

    source.connect(gain);
    gain.connect(audioCtx.destination);

    source.start();
    source.stop(audioCtx.currentTime + duration);
};

const playChop = () => {
    oscTone(200, 'triangle', 0.08, 0.25, 120);
    noiseBurst(0.06, 0.12);
};

const playCook = () => {
    noiseBurst(0.2, 0.08);
};

const playServe = () => {
    oscTone(880, 'sine', 0.12, 0.2, 1760);
    setTimeout(() => oscTone(1760, 'sine', 0.25, 0.15, 880), 110);
};

const playError = () => {
    oscTone(150, 'sawtooth', 0.35, 0.2, 80);
};

const playBurn = () => {
    oscTone(100, 'sawtooth', 0.6, 0.25, 60);
    noiseBurst(0.6, 0.15);
};

export const playSound = (type) => {
    initAudio();
    switch (type) {
        case 'chop': playChop(); break;
        case 'cook': playCook(); break;
        case 'serve': playServe(); break;
        case 'error': playError(); break;
        case 'burn': playBurn(); break;
    }
};

export const setSizzle = (active) => {
    initAudio();
    if (!audioCtx) return;

    if (active) {
        if (sizzleSource) return;

        const buffer = getNoiseBuffer();
        if (!buffer) return;

        const source = audioCtx.createBufferSource();
        source.buffer = buffer;
        source.loop = true;

        const filter = audioCtx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 800;
        filter.Q.value = 0.5;

        const gain = audioCtx.createGain();
        gain.gain.value = 0.04;

        source.connect(filter);
        filter.connect(gain);
        gain.connect(audioCtx.destination);

        source.start();
        sizzleSource = source;
        sizzleGain = gain;
    } else {
        if (sizzleSource) {
            try {
                sizzleSource.stop();
            } catch (e) {
                // Already stopped.
            }
            sizzleSource.disconnect();
            if (sizzleGain) sizzleGain.disconnect();
            sizzleSource = null;
            sizzleGain = null;
        }
    }
};

document.addEventListener('keydown', () => initAudio(), { once: true });
