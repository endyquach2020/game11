/**
 * Procedural Web Audio API Sound and Music Synthesizer
 * Provides authentic Contra arcade 8-bit / 16-bit sound effects
 * and dynamic background music loops tailored for each stage.
 */

class SoundManager {
  private ctx: AudioContext | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private masterGain: GainNode | null = null;

  private isMuted: boolean = false;
  private currentStageBgm: number = 0;
  private bgmTimer: number | null = null;
  private bgmStep: number = 0;

  constructor() {
    // Initialized lazily upon user interaction to comply with browser autoplay policies
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.8, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      this.musicGain.connect(this.masterGain);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(0.55, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.8, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  // --- Retro Sound Effects ---

  public playShoot(type: 'NORMAL' | 'MACHINE' | 'SPREAD' | 'LASER') {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;

    if (type === 'NORMAL' || type === 'MACHINE') {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(type === 'MACHINE' ? 880 : 660, t);
      osc.frequency.exponentialRampToValueAtTime(110, t + (type === 'MACHINE' ? 0.08 : 0.12));

      gain.gain.setValueAtTime(0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + (type === 'MACHINE' ? 0.08 : 0.12));

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t);
      osc.stop(t + (type === 'MACHINE' ? 0.08 : 0.12));
    } else if (type === 'SPREAD') {
      // Contra Iconic Red Spread Gun: Multi-tonal burst
      const freqs = [520, 650, 780, 920];
      freqs.forEach((freq, idx) => {
        if (!this.ctx || !this.sfxGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, t + idx * 0.01);
        osc.frequency.exponentialRampToValueAtTime(120, t + 0.18);

        gain.gain.setValueAtTime(0.18, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(t);
        osc.stop(t + 0.18);
      });
    } else if (type === 'LASER') {
      // Continuous Sci-Fi Laser sweep
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1400, t);
      osc.frequency.linearRampToValueAtTime(300, t + 0.14);

      gain.gain.setValueAtTime(0.4, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t);
      osc.stop(t + 0.14);
    }
  }

  public playJump() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.exponentialRampToValueAtTime(600, t + 0.15);

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.linearRampToValueAtTime(0.01, t + 0.15);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.15);
  }

  public playExplosion(intensity: 'small' | 'large' = 'small') {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    const duration = intensity === 'large' ? 0.45 : 0.22;
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    // Filter to give that crunchy 8-bit rumble
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(intensity === 'large' ? 450 : 700, t);
    filter.frequency.exponentialRampToValueAtTime(80, t + duration);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(intensity === 'large' ? 0.6 : 0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    noise.start(t);
  }

  public playEnemyHit() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.exponentialRampToValueAtTime(60, t + 0.06);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.06);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.06);
  }

  public playPowerup() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const notes = [330, 440, 550, 660, 880];
    const t = this.ctx.currentTime;
    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, t + idx * 0.05);

      gain.gain.setValueAtTime(0.25, t + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.05 + 0.09);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t + idx * 0.05);
      osc.stop(t + idx * 0.05 + 0.09);
    });
  }

  public playCheckpointAlert() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    // Military Tactical Horn
    const t = this.ctx.currentTime;
    [400, 600, 400, 600].forEach((freq, i) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, t + i * 0.12);

      gain.gain.setValueAtTime(0.3, t + i * 0.12);
      gain.gain.linearRampToValueAtTime(0.01, t + i * 0.12 + 0.1);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t + i * 0.12);
      osc.stop(t + i * 0.12 + 0.1);
    });
  }

  public playCorrectAnswer() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    // Glorious retro victory fanfare
    const t = this.ctx.currentTime;
    const chords = [
      { f: 523.25, time: 0 },    // C5
      { f: 659.25, time: 0.1 },  // E5
      { f: 783.99, time: 0.2 },  // G5
      { f: 1046.50, time: 0.35 } // C6 (long ring)
    ];

    chords.forEach(({ f, time }) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, t + time);

      gain.gain.setValueAtTime(0.35, t + time);
      gain.gain.exponentialRampToValueAtTime(0.001, t + time + 0.4);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t + time);
      osc.stop(t + time + 0.4);
    });
  }

  public playWrongAnswer() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    // Harsh electronic buzzer: No hints!
    const t = this.ctx.currentTime;
    [130, 110].forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, t + idx * 0.18);

      gain.gain.setValueAtTime(0.4, t + idx * 0.18);
      gain.gain.linearRampToValueAtTime(0.01, t + idx * 0.18 + 0.16);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t + idx * 0.18);
      osc.stop(t + idx * 0.18 + 0.16);
    });
  }

  public playBossAlert() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';

    for (let i = 0; i < 4; i++) {
      osc.frequency.setValueAtTime(300, t + i * 0.25);
      osc.frequency.linearRampToValueAtTime(650, t + i * 0.25 + 0.18);
    }

    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 1.1);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 1.1);
  }

  public playStageClear() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    // Classic 6-note stage clear fanfare
    const t = this.ctx.currentTime;
    const notes = [
      { f: 523.25, dur: 0.12, d: 0 },
      { f: 523.25, dur: 0.12, d: 0.14 },
      { f: 523.25, dur: 0.12, d: 0.28 },
      { f: 659.25, dur: 0.25, d: 0.42 },
      { f: 587.33, dur: 0.25, d: 0.70 },
      { f: 783.99, dur: 0.60, d: 0.98 },
    ];

    notes.forEach(({ f, dur, d }) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(f, t + d);

      gain.gain.setValueAtTime(0.3, t + d);
      gain.gain.exponentialRampToValueAtTime(0.001, t + d + dur);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t + d);
      osc.stop(t + d + dur);
    });
  }

  public playGameOver() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    const notes = [
      { f: 440, d: 0 },
      { f: 415.3, d: 0.25 },
      { f: 392, d: 0.5 },
      { f: 349.2, d: 0.75 },
      { f: 293.6, d: 1.1 },
    ];

    notes.forEach(({ f, d }) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(f, t + d);

      gain.gain.setValueAtTime(0.3, t + d);
      gain.gain.exponentialRampToValueAtTime(0.01, t + d + 0.35);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t + d);
      osc.stop(t + d + 0.35);
    });
  }

  // --- Dynamic Procedural BGM for Each Stage ---

  public startStageBgm(stageId: number) {
    this.stopBgm();
    this.currentStageBgm = stageId;
    this.bgmStep = 0;

    const bpm = stageId === 1 ? 136 : stageId === 2 ? 144 : 152;
    const stepInterval = (60 / bpm / 4) * 1000; // 16th notes in ms

    this.bgmTimer = window.setInterval(() => {
      this.tickBgm();
    }, stepInterval);
  }

  public stopBgm() {
    if (this.bgmTimer !== null) {
      clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
  }

  private tickBgm() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.musicGain) return;

    const step = this.bgmStep % 16;
    const bar = Math.floor(this.bgmStep / 16) % 4;
    const t = this.ctx.currentTime;

    // Stage 1: Classic Contra Jungle style (Driving Bass + Arp)
    if (this.currentStageBgm === 1) {
      // Bass line on 16th steps
      const bassRoots = [110, 110, 130.81, 98]; // A2, A2, C3, G2
      const root = bassRoots[bar];
      if (step % 2 === 0) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        const bassFreq = (step % 4 === 2) ? root * 1.5 : root;
        osc.frequency.setValueAtTime(bassFreq, t);

        gain.gain.setValueAtTime(0.18, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

        osc.connect(gain);
        gain.connect(this.musicGain);

        osc.start(t);
        osc.stop(t + 0.12);
      }

      // Snare drum noise on steps 4 and 12
      if (step === 4 || step === 12) {
        this.synthSnare(t);
      }

      // Melodic arpeggio
      const melodyNotes = [220, 261.6, 329.6, 392, 440, 523.2, 440, 329.6];
      if (step % 4 === 1 || step % 4 === 3) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(melodyNotes[(step + bar * 2) % melodyNotes.length], t);

        gain.gain.setValueAtTime(0.08, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

        osc.connect(gain);
        gain.connect(this.musicGain);

        osc.start(t);
        osc.stop(t + 0.1);
      }
    }

    // Stage 2: Waterfall / Cliffs (Fast, ascending pulse)
    else if (this.currentStageBgm === 2) {
      const baseFreq = bar % 2 === 0 ? 146.83 : 174.61; // D3, F3
      if (step % 2 === 0) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(baseFreq * (step % 4 === 0 ? 1 : 1.33), t);

        gain.gain.setValueAtTime(0.16, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

        osc.connect(gain);
        gain.connect(this.musicGain);

        osc.start(t);
        osc.stop(t + 0.1);
      }

      if (step === 4 || step === 12) {
        this.synthSnare(t);
      }

      // High lead synth chime
      if (step % 4 === 2) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440 * (1 + (step / 8)), t);

        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

        osc.connect(gain);
        gain.connect(this.musicGain);

        osc.start(t);
        osc.stop(t + 0.14);
      }
    }

    // Stage 3: Volcano / Alien Core (Urgent, heavy low synth & alarm bass)
    else if (this.currentStageBgm === 3) {
      // Heavy drop bass
      const darkRoots = [73.42, 65.41, 87.31, 61.74]; // D2, C2, F2, B1
      const root = darkRoots[bar];
      if (step % 2 === 0) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(root, t);

        gain.gain.setValueAtTime(0.24, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

        osc.connect(gain);
        gain.connect(this.musicGain);

        osc.start(t);
        osc.stop(t + 0.15);
      }

      // Drum kicks and snares
      if (step === 0 || step === 8) {
        this.synthKick(t);
      }
      if (step === 4 || step === 12) {
        this.synthSnare(t);
      }

      // Cyber alien synth tension pulses
      if (step % 4 === 3) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(587.33, t); // D5
        osc.frequency.exponentialRampToValueAtTime(293.66, t + 0.12);

        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

        osc.connect(gain);
        gain.connect(this.musicGain);

        osc.start(t);
        osc.stop(t + 0.12);
      }
    }

    this.bgmStep++;
  }

  private synthSnare(t: number) {
    if (!this.ctx || !this.musicGain) return;
    const dur = 0.08;
    const buffer = this.ctx.createBuffer(1, Math.floor(this.ctx.sampleRate * dur), this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(900, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);

    noise.start(t);
  }

  private synthKick(t: number) {
    if (!this.ctx || !this.musicGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(120, t);
    osc.frequency.exponentialRampToValueAtTime(45, t + 0.1);

    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

    osc.connect(gain);
    gain.connect(this.musicGain);

    osc.start(t);
    osc.stop(t + 0.1);
  }
}

export const soundManager = new SoundManager();
