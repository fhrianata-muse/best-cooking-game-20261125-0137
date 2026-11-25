// Tiny WebAudio synth — no audio files. Lazy context, mute toggle.
export function createAudio() {
  let ctx = null;
  let muted = false;

  function ensure() {
    if (ctx) return ctx;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      ctx = new AC();
    } catch (e) {
      ctx = null;
    }
    return ctx;
  }

  function tone(freq, dur, type, gain, when = 0) {
    if (muted) return;
    const c = ensure();
    if (!c) return;
    const t0 = c.currentTime + when;
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain, t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g).connect(c.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  }

  function noise(dur, gain, when = 0) {
    if (muted) return;
    const c = ensure();
    if (!c) return;
    const t0 = c.currentTime + when;
    const len = Math.floor(c.sampleRate * dur);
    const buf = c.createBuffer(1, len, c.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i += 1) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = c.createBufferSource();
    src.buffer = buf;
    const g = c.createGain();
    g.gain.setValueAtTime(gain, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    const f = c.createBiquadFilter();
    f.type = 'bandpass'; f.frequency.value = 2400; f.Q.value = 0.8;
    src.connect(f).connect(g).connect(c.destination);
    src.start(t0);
  }

  return {
    unlock() { ensure(); },
    setMuted(v) { muted = v; },
    isMuted() { return muted; },
    chop() { noise(0.09, 0.25); tone(180, 0.08, 'square', 0.08); },
    sizzle() { noise(0.5, 0.12); },
    ding() { tone(880, 0.35, 'sine', 0.18); tone(1318, 0.4, 'sine', 0.12, 0.08); },
    serve() { tone(523, 0.15, 'triangle', 0.16); tone(659, 0.15, 'triangle', 0.16, 0.1); tone(784, 0.3, 'triangle', 0.18, 0.2); },
    tick() { tone(1200, 0.05, 'square', 0.06); },
    fail() { tone(160, 0.25, 'sawtooth', 0.1); },
    pickup() { tone(440, 0.07, 'triangle', 0.1); },
  };
}
