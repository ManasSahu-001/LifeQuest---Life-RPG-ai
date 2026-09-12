/**
 * Life RPG Theme-Adaptive Web Audio Engine
 * Pure Web Audio API: Zero external asset dependencies, zero network latency,
 * boosted studio-grade dynamics compression for crisp, rich, and loud playback.
 */

class AudioEngine {
  private ctx: AudioContext | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private bgmGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private masterGain: GainNode | null = null;

  // Active BGM nodes
  private bgmOscillators: OscillatorNode[] = [];
  private bgmLfo: OscillatorNode | null = null;
  private bgmFilter: BiquadFilterNode | null = null;

  private isBgmPlaying = false;
  private isMuted = false;
  private currentTheme = 'theme-a';
  private bgmVolumeLevel = 0.65; // Boosted volume

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();

        // Master dynamics compressor to prevent clipping while maximizing loudness & punch
        this.compressor = this.ctx.createDynamicsCompressor();
        this.compressor.threshold.setValueAtTime(-14, this.ctx.currentTime);
        this.compressor.knee.setValueAtTime(30, this.ctx.currentTime);
        this.compressor.ratio.setValueAtTime(8, this.ctx.currentTime);
        this.compressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
        this.compressor.release.setValueAtTime(0.25, this.ctx.currentTime);
        this.compressor.connect(this.ctx.destination);

        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 1.2, this.ctx.currentTime);
        this.masterGain.connect(this.compressor);

        this.bgmGain = this.ctx.createGain();
        this.bgmGain.gain.setValueAtTime(this.bgmVolumeLevel, this.ctx.currentTime);
        this.bgmGain.connect(this.masterGain);

        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.setValueAtTime(0.85, this.ctx.currentTime); // Louder SFX
        this.sfxGain.connect(this.masterGain);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      const target = this.isMuted ? 0 : 1.2;
      this.masterGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.05);
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getIsBgmPlaying(): boolean {
    return this.isBgmPlaying;
  }

  public setBgmVolume(val: number) {
    this.bgmVolumeLevel = Math.max(0, Math.min(1.5, val));
    if (this.bgmGain && this.ctx) {
      this.bgmGain.gain.setTargetAtTime(this.bgmVolumeLevel, this.ctx.currentTime, 0.05);
    }
  }

  public getBgmVolume(): number {
    return this.bgmVolumeLevel;
  }

  // ==========================================
  // THEME-ADAPTIVE SMOOTH BGM ENGINE
  // ==========================================

  public toggleBGM(themeId: string): boolean {
    if (this.isBgmPlaying) {
      this.stopBGM();
      return false;
    } else {
      this.startBGM(themeId);
      return true;
    }
  }

  public startBGM(themeId: string) {
    this.initContext();
    if (!this.ctx || !this.bgmGain) return;

    this.stopBGM();
    this.currentTheme = themeId;
    this.isBgmPlaying = true;

    const now = this.ctx.currentTime;

    if (themeId === 'theme-a') {
      // ----------------------------------------
      // THEME A: Cyberpunk / Neo-Tokyo Synthwave
      // Boosted analog-style detuned synthwave pads with sweeping resonant filter
      // ----------------------------------------
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(850, now);
      filter.Q.setValueAtTime(4, now);
      filter.connect(this.bgmGain);
      this.bgmFilter = filter;

      // LFO for cyber wave movement
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(0.15, now);
      lfoGain.gain.setValueAtTime(320, now);
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      lfo.start(now);
      this.bgmLfo = lfo;

      // Synth chord: D minor 9 (D3, F3, A3, C4, E4)
      const freqs = [146.83, 174.61, 220.0, 261.63, 329.63];
      freqs.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const oscGain = this.ctx!.createGain();
        osc.type = idx % 2 === 0 ? 'sawtooth' : 'sine';
        osc.frequency.setValueAtTime(freq + (idx * 0.4 - 0.8), now);
        oscGain.gain.setValueAtTime(0.24 / freqs.length, now); // Significantly louder
        osc.connect(oscGain);
        oscGain.connect(filter);
        osc.start(now);
        this.bgmOscillators.push(osc);
      });
    } else if (themeId === 'theme-b') {
      // ----------------------------------------
      // THEME B: High Fantasy / Medieval Kingdom
      // Warm acoustic fifths drone with resonant royal medieval overtones
      // ----------------------------------------
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(500, now);
      filter.Q.setValueAtTime(1.5, now);
      filter.connect(this.bgmGain);
      this.bgmFilter = filter;

      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(0.1, now);
      lfoGain.gain.setValueAtTime(200, now);
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      lfo.start(now);
      this.bgmLfo = lfo;

      // Royal Celtic / Dorian drone: D2, A2, D3, F#3, A3
      const freqs = [73.42, 110.0, 146.83, 185.0, 220.0];
      freqs.forEach((freq) => {
        const osc = this.ctx!.createOscillator();
        const oscGain = this.ctx!.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        oscGain.gain.setValueAtTime(0.32 / freqs.length, now); // Significantly louder
        osc.connect(oscGain);
        oscGain.connect(filter);
        osc.start(now);
        this.bgmOscillators.push(osc);
      });
    } else {
      // ----------------------------------------
      // THEME C: Solarpunk / Biophilic Metropolis
      // Lush crystal glass pad with clear harmonic chime resonance
      // ----------------------------------------
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(950, now);
      filter.Q.setValueAtTime(1.2, now);
      filter.connect(this.bgmGain);
      this.bgmFilter = filter;

      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(0.18, now);
      lfoGain.gain.setValueAtTime(220, now);
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      lfo.start(now);
      this.bgmLfo = lfo;

      // Nature Harmony Chord: F major 9 (F2, C3, A3, C4, G4)
      const freqs = [87.31, 130.81, 220.0, 261.63, 392.0];
      freqs.forEach((freq) => {
        const osc = this.ctx!.createOscillator();
        const oscGain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        oscGain.gain.setValueAtTime(0.28 / freqs.length, now); // Significantly louder
        osc.connect(oscGain);
        oscGain.connect(filter);
        osc.start(now);
        this.bgmOscillators.push(osc);
      });
    }
  }

  public switchTheme(newThemeId: string) {
    if (this.isBgmPlaying && this.currentTheme !== newThemeId) {
      this.startBGM(newThemeId);
    }
  }

  public stopBGM() {
    if (this.bgmOscillators.length > 0) {
      this.bgmOscillators.forEach((osc) => {
        try {
          osc.stop();
          osc.disconnect();
        } catch (e) {}
      });
      this.bgmOscillators = [];
    }
    if (this.bgmLfo) {
      try {
        this.bgmLfo.stop();
        this.bgmLfo.disconnect();
      } catch (e) {}
      this.bgmLfo = null;
    }
    this.isBgmPlaying = false;
  }

  // ==========================================
  // THEME-ADAPTIVE SOUND EFFECTS (SFX) - LOUDER
  // ==========================================

  public playClick() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(440, now + 0.05);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.06);
  }

  public playQuestComplete(themeId: string) {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const now = this.ctx.currentTime;

    if (themeId === 'theme-a') {
      // Cyberpunk: Loud holographic arpeggiated sweep (C5, G5, C6, E6)
      const notes = [523.25, 783.99, 1046.5, 1318.51];
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const start = now + idx * 0.06;

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.55, start); // Louder
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);

        osc.connect(gain);
        gain.connect(this.sfxGain!);
        osc.start(start);
        osc.stop(start + 0.38);
      });
    } else if (themeId === 'theme-b') {
      // High Fantasy: Loud cathedral bell & harp fanfare (D4, A4, D5, F#5)
      const notes = [293.66, 440.0, 587.33, 739.99];
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const start = now + idx * 0.08;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.65, start); // Louder
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.7);

        osc.connect(gain);
        gain.connect(this.sfxGain!);
        osc.start(start);
        osc.stop(start + 0.75);
      });
    } else {
      // Solarpunk: Loud crystal chime & nature wind shimmer (G4, C5, E5, G5, B5)
      const notes = [392.0, 523.25, 659.25, 783.99, 987.77];
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const start = now + idx * 0.07;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.55, start); // Louder
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.6);

        osc.connect(gain);
        gain.connect(this.sfxGain!);
        osc.start(start);
        osc.stop(start + 0.65);
      });
    }
  }

  public playLevelUp(themeId: string) {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const notes = [261.63, 329.63, 392.0, 523.25, 659.25, 783.99];
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const start = now + idx * 0.08;

      osc.type = themeId === 'theme-a' ? 'sawtooth' : themeId === 'theme-b' ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.70, start); // Very triumphant and loud
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.85);

      osc.connect(gain);
      gain.connect(this.sfxGain!);
      osc.start(start);
      osc.stop(start + 0.9);
    });
  }

  public playBossStrike() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(25, now + 0.3);

    gain.gain.setValueAtTime(0.80, now); // Powerful punchy bass impact
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.4);
  }
}

export const audioEngine = new AudioEngine();
