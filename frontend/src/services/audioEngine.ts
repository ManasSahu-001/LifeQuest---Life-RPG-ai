/**
 * Life RPG Theme-Adaptive Web Audio Engine
 * High-volume studio sound with rich harmonic chords, rhythmic arpeggiators,
 * and punchy dynamics compression for immersive gameplay.
 */

class AudioEngine {
  private ctx: AudioContext | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private bgmGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private masterGain: GainNode | null = null;

  // Active BGM nodes
  private bgmOscillators: OscillatorNode[] = [];
  private bgmIntervalId: number | null = null;
  private bgmLfo: OscillatorNode | null = null;
  private bgmFilter: BiquadFilterNode | null = null;

  private isBgmPlaying = false;
  private isMuted = false;
  private currentTheme = 'theme-a';
  private bgmVolumeLevel = 1.25; // Loud default volume

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();

        // Dynamics compressor acting as high-fidelity mastering limiter to maximize loudness
        this.compressor = this.ctx.createDynamicsCompressor();
        this.compressor.threshold.setValueAtTime(-12, this.ctx.currentTime);
        this.compressor.knee.setValueAtTime(20, this.ctx.currentTime);
        this.compressor.ratio.setValueAtTime(3.5, this.ctx.currentTime);
        this.compressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
        this.compressor.release.setValueAtTime(0.18, this.ctx.currentTime);
        this.compressor.connect(this.ctx.destination);

        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 2.0, this.ctx.currentTime);
        this.masterGain.connect(this.compressor);

        this.bgmGain = this.ctx.createGain();
        this.bgmGain.gain.setValueAtTime(this.bgmVolumeLevel, this.ctx.currentTime);
        this.bgmGain.connect(this.masterGain);

        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.setValueAtTime(1.1, this.ctx.currentTime);
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
      const target = this.isMuted ? 0 : 2.0;
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
    this.bgmVolumeLevel = Math.max(0, Math.min(2.5, val));
    if (this.bgmGain && this.ctx) {
      this.bgmGain.gain.setTargetAtTime(this.bgmVolumeLevel, this.ctx.currentTime, 0.05);
    }
  }

  public getBgmVolume(): number {
    return this.bgmVolumeLevel;
  }

  // ==========================================
  // THEME-ADAPTIVE LOUD BGM ENGINE
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
      // THEME A: Cyberpunk Synthwave - EXTRA LOUD & PUNCHY
      // Deep resonant synth bass + rich detuned poly-synth pad + driving arpeggio
      // ----------------------------------------
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2200, now);
      filter.Q.setValueAtTime(2.5, now);
      filter.connect(this.bgmGain);
      this.bgmFilter = filter;

      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(0.25, now);
      lfoGain.gain.setValueAtTime(700, now);
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      lfo.start(now);
      this.bgmLfo = lfo;

      // Heavy Synth Pad (D3, F3, A3, C4, E4)
      const freqs = [146.83, 174.61, 220.0, 261.63, 329.63];
      freqs.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const oscGain = this.ctx!.createGain();
        osc.type = idx % 2 === 0 ? 'sawtooth' : 'triangle';
        osc.frequency.setValueAtTime(freq + (idx * 0.5 - 1.0), now);
        oscGain.gain.setValueAtTime(0.38, now); // Significantly louder per voice
        osc.connect(oscGain);
        oscGain.connect(filter);
        osc.start(now);
        this.bgmOscillators.push(osc);
      });

      // Sub-Bass + Mid-Bass Punch (D2 73Hz + D3 146Hz) for punchy laptop & speaker response
      const subNotes = [73.42, 146.83];
      subNotes.forEach((subFreq, i) => {
        const subOsc = this.ctx!.createOscillator();
        const subGain = this.ctx!.createGain();
        subOsc.type = i === 0 ? 'triangle' : 'sawtooth';
        subOsc.frequency.setValueAtTime(subFreq, now);
        subGain.gain.setValueAtTime(i === 0 ? 0.45 : 0.35, now);
        subOsc.connect(subGain);
        subGain.connect(this.bgmGain!);
        subOsc.start(now);
        this.bgmOscillators.push(subOsc);
      });

      // Cyberpunk Arpeggiator Sequencer (High volume 16th-note pulse)
      const arpNotes = [293.66, 349.23, 440.0, 523.25, 659.25, 523.25, 440.0, 349.23];
      let step = 0;
      this.bgmIntervalId = window.setInterval(() => {
        if (!this.ctx || !this.isBgmPlaying) return;
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(arpNotes[step % arpNotes.length], t);
        g.gain.setValueAtTime(0.36, t); // Boosted from 0.12 to 0.36
        g.gain.exponentialRampToValueAtTime(0.01, t + 0.22);
        osc.connect(g);
        g.connect(filter);
        osc.start(t);
        osc.stop(t + 0.25);
        step++;
      }, 240);

    } else if (themeId === 'theme-b') {
      // ----------------------------------------
      // THEME B: High Fantasy - LOUD TAVERN & CASTLE HARMONY
      // Resonant acoustic fifths + bright Celtic harp arpeggio
      // ----------------------------------------
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2000, now);
      filter.Q.setValueAtTime(2.0, now);
      filter.connect(this.bgmGain);
      this.bgmFilter = filter;

      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(0.15, now);
      lfoGain.gain.setValueAtTime(450, now);
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      lfo.start(now);
      this.bgmLfo = lfo;

      // Celtic Dorian Drone & Warm Acoustic Fifths (D2, A2, D3, F#3, A3, D4)
      const freqs = [73.42, 110.0, 146.83, 185.0, 220.0, 293.66];
      freqs.forEach((freq) => {
        const osc = this.ctx!.createOscillator();
        const oscGain = this.ctx!.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        oscGain.gain.setValueAtTime(0.40, now); // Boosted
        osc.connect(oscGain);
        oscGain.connect(filter);
        osc.start(now);
        this.bgmOscillators.push(osc);
      });

      // Harp plucks cadence (Loud, ringing acoustic attack)
      const harpNotes = [293.66, 440.0, 587.33, 739.99, 880.0, 587.33, 440.0];
      let harpStep = 0;
      this.bgmIntervalId = window.setInterval(() => {
        if (!this.ctx || !this.isBgmPlaying) return;
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(harpNotes[harpStep % harpNotes.length], t);
        g.gain.setValueAtTime(0.42, t); // Boosted from 0.18 to 0.42
        g.gain.exponentialRampToValueAtTime(0.005, t + 0.45);
        osc.connect(g);
        g.connect(this.bgmGain!);
        osc.start(t);
        osc.stop(t + 0.5);
        harpStep++;
      }, 380);

    } else {
      // ----------------------------------------
      // THEME C: Solarpunk - LOUD RADIANT BIOPHILIC HARMONY
      // Lush crystal glass pad + resonant solar chime bells
      // ----------------------------------------
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2400, now);
      filter.Q.setValueAtTime(1.6, now);
      filter.connect(this.bgmGain);
      this.bgmFilter = filter;

      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(0.18, now);
      lfoGain.gain.setValueAtTime(500, now);
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      lfo.start(now);
      this.bgmLfo = lfo;

      // Nature Harmony Chord: F major 9 with bright acoustic shimmer
      const freqs = [87.31, 130.81, 174.61, 220.0, 261.63, 392.0, 523.25];
      freqs.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const oscGain = this.ctx!.createGain();
        osc.type = idx % 2 === 0 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, now);
        oscGain.gain.setValueAtTime(0.38, now); // Boosted from 0.24 to 0.38
        osc.connect(oscGain);
        oscGain.connect(filter);
        osc.start(now);
        this.bgmOscillators.push(osc);
      });

      // Shimmering Wind Chime cadence
      const chimeNotes = [523.25, 659.25, 783.99, 987.77, 1046.5, 1318.51];
      let chimeStep = 0;
      this.bgmIntervalId = window.setInterval(() => {
        if (!this.ctx || !this.isBgmPlaying) return;
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(chimeNotes[chimeStep % chimeNotes.length], t);
        g.gain.setValueAtTime(0.38, t); // Boosted from 0.16 to 0.38
        g.gain.exponentialRampToValueAtTime(0.005, t + 0.6);
        osc.connect(g);
        g.connect(this.bgmGain!);
        osc.start(t);
        osc.stop(t + 0.65);
        chimeStep++;
      }, 340);
    }
  }

  public switchTheme(newThemeId: string) {
    if (this.isBgmPlaying && this.currentTheme !== newThemeId) {
      this.startBGM(newThemeId);
    }
  }

  public stopBGM() {
    if (this.bgmIntervalId !== null) {
      clearInterval(this.bgmIntervalId);
      this.bgmIntervalId = null;
    }
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
  // THEME-ADAPTIVE SOUND EFFECTS (SFX)
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
      const notes = [523.25, 783.99, 1046.5, 1318.51];
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const start = now + idx * 0.06;

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.60, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);

        osc.connect(gain);
        gain.connect(this.sfxGain!);
        osc.start(start);
        osc.stop(start + 0.38);
      });
    } else if (themeId === 'theme-b') {
      const notes = [293.66, 440.0, 587.33, 739.99];
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const start = now + idx * 0.08;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.70, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.7);

        osc.connect(gain);
        gain.connect(this.sfxGain!);
        osc.start(start);
        osc.stop(start + 0.75);
      });
    } else {
      const notes = [392.0, 523.25, 659.25, 783.99, 987.77];
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const start = now + idx * 0.07;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.60, start);
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

      gain.gain.setValueAtTime(0.75, start);
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

    gain.gain.setValueAtTime(0.85, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.4);
  }
}

export const audioEngine = new AudioEngine();
