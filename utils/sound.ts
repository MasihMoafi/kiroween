// Audio Engine - Real audio files + Procedural effects + Ducking

let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let masterVolume = 0.7;

let buffaloAudio: HTMLAudioElement | null = null;
let snipAudio: HTMLAudioElement | null = null;
let musicBoxAudio: HTMLAudioElement | null = null;
let pianoAudio: HTMLAudioElement | null = null;
let alfredAudio: HTMLAudioElement | null = null;
// videoAudio removed - was never used
let currentSequenceAudio: HTMLAudioElement | null = null;
let currentTrackIndex = 0;
const TRACKS = ['buffalo', 'snip', 'musicBox', 'piano', 'alfred'];

// Kill sounds (kill.mp3, kill-2.mp3 - cycle sequentially, never repeat)
let killAudio1: HTMLAudioElement | null = null;
let killAudio2: HTMLAudioElement | null = null;
let killTimeout: ReturnType<typeof setTimeout> | null = null;
let killSoundsEnabled = false;
let lastKillIndex = -1; // Track last played to avoid repeats

const DUCKED_VOLUME = 0.08; // Much lower for clearer speech
const GAME_DUCKED_VOLUME = 0; // Mute completely for game modes
const DUCK_FADE_MS = 200;
let isDucked = false;
let isGameDucked = false;
let originalMusicVolume = 0.6;
let duckFadeInterval: ReturnType<typeof setInterval> | null = null;

const getCtx = () => {
  if (!audioCtx) {
    const Ctx = window.AudioContext || (window as any).webkitAudioContext;
    if (Ctx) {
      audioCtx = new Ctx();
      masterGain = audioCtx.createGain();
      masterGain.gain.value = masterVolume;
      masterGain.connect(audioCtx.destination);
    }
  }
  return audioCtx;
};

const getMasterGain = () => {
  getCtx();
  return masterGain;
};

export const setMasterVolume = (vol: number) => {
  masterVolume = vol;
  if (masterGain) masterGain.gain.value = vol;
  if (currentSequenceAudio && !isDucked) {
    currentSequenceAudio.volume = vol * originalMusicVolume;
  }
};

// Ducking - lower music volume when TTS speaks
export const duckAudio = () => {
  // Don't duck if already game-ducked (muted)
  if (isGameDucked) return;

  if (duckFadeInterval) clearInterval(duckFadeInterval);
  isDucked = true;

  const allAudio = [buffaloAudio, snipAudio, musicBoxAudio, pianoAudio, alfredAudio].filter(a => a && !a.paused);
  if (allAudio.length === 0) return;

  const targetVol = masterVolume * DUCKED_VOLUME;
  const steps = 10;
  const stepTime = DUCK_FADE_MS / steps;

  let step = 0;
  duckFadeInterval = setInterval(() => {
    step++;
    allAudio.forEach(audio => {
      if (audio) {
        const newVol = audio.volume - (audio.volume - targetVol) / (steps - step + 1);
        audio.volume = Math.max(targetVol, newVol);
      }
    });
    if (step >= steps) {
      if (duckFadeInterval) clearInterval(duckFadeInterval);
      duckFadeInterval = null;
    }
  }, stepTime);
};

export const unduckAudio = () => {
  // Don't unduck if game-ducked (stay muted)
  if (isGameDucked) return;

  if (duckFadeInterval) clearInterval(duckFadeInterval);
  isDucked = false;

  const allAudio = [buffaloAudio, snipAudio, musicBoxAudio, pianoAudio, alfredAudio].filter(a => a && !a.paused);
  if (allAudio.length === 0) return;

  const targetVol = masterVolume * originalMusicVolume;
  const steps = 10;
  const stepTime = DUCK_FADE_MS / steps;

  let step = 0;
  duckFadeInterval = setInterval(() => {
    step++;
    allAudio.forEach(audio => {
      if (audio) {
        const newVol = audio.volume + (targetVol - audio.volume) / (steps - step + 1);
        audio.volume = Math.min(targetVol, newVol);
      }
    });
    if (step >= steps) {
      if (duckFadeInterval) clearInterval(duckFadeInterval);
      duckFadeInterval = null;
    }
  }, stepTime);
};

export const initAudio = () => {
  const ctx = getCtx();
  if (ctx && ctx.state === 'suspended') {
    ctx.resume();
  }

  buffaloAudio = new Audio('/audio/buffalo-intro.mp3');
  buffaloAudio.volume = masterVolume;

  snipAudio = new Audio('/audio/snip.mp3');
  snipAudio.volume = masterVolume * originalMusicVolume;
  // No loop - transitions to music box when done

  musicBoxAudio = new Audio('/audio/music-box-loop.mp3');
  musicBoxAudio.volume = masterVolume * originalMusicVolume;
  musicBoxAudio.loop = true;

  pianoAudio = new Audio('/audio/piano.mp3');
  pianoAudio.volume = masterVolume * originalMusicVolume;
  pianoAudio.loop = true;

  alfredAudio = new Audio('/audio/alfred-intro.mp3');
  alfredAudio.volume = masterVolume * originalMusicVolume;
  alfredAudio.loop = true;

  // Kill sounds (kill, kill-2 only)
  killAudio1 = new Audio('/audio/kill.mp3');
  killAudio1.volume = masterVolume * 0.6;
  killAudio2 = new Audio('/audio/kill-2.mp3');
  killAudio2.volume = masterVolume * 0.6;
};

// Crossfade helper - fade out current, fade in next
const crossfade = (from: HTMLAudioElement | null, to: HTMLAudioElement, duration: number = 500) => {
  if (from) {
    const fromStartVol = from.volume;
    const steps = 20;
    const stepTime = duration / steps;
    let step = 0;
    const fadeOut = setInterval(() => {
      step++;
      from.volume = Math.max(0, fromStartVol * (1 - step / steps));
      if (step >= steps) {
        clearInterval(fadeOut);
        from.pause();
        from.volume = fromStartVol;
      }
    }, stepTime);
  }

  to.volume = 0;
  to.currentTime = 0;
  to.play().catch(() => {});

  const toTargetVol = isDucked ? masterVolume * DUCKED_VOLUME : masterVolume * originalMusicVolume;
  const steps = 20;
  const stepTime = duration / steps;
  let step = 0;
  const fadeIn = setInterval(() => {
    step++;
    to.volume = Math.min(toTargetVol, toTargetVol * (step / steps));
    if (step >= steps) clearInterval(fadeIn);
  }, stepTime);
};

// Play sequence: Buffalo → Snip → Music Box (loop)
export const startAudioSequence = () => {
  if (!buffaloAudio || !snipAudio || !musicBoxAudio) {
    initAudio();
  }

  currentTrackIndex = 0;

  if (buffaloAudio) {
    currentSequenceAudio = buffaloAudio;
    buffaloAudio.currentTime = 0;
    buffaloAudio.volume = masterVolume;

    buffaloAudio.onended = () => {
      if (snipAudio) {
        currentSequenceAudio = snipAudio;
        crossfade(null, snipAudio, 300);

        snipAudio.onended = () => {
          if (musicBoxAudio) {
            currentTrackIndex = 2;
            currentSequenceAudio = musicBoxAudio;
            crossfade(null, musicBoxAudio, 500);
          }
        };
      }
    };

    buffaloAudio.play().catch(() => {});
  }
};

// Truth or Dare audio
let tanyaAudio: HTMLAudioElement | null = null;

export const playTanya = (): Promise<void> => {
  return new Promise((resolve) => {
    if (!tanyaAudio) {
      tanyaAudio = new Audio('/audio/tanya.mp3');
    }
    tanyaAudio.volume = masterVolume * 0.8;
    tanyaAudio.currentTime = 0;
    tanyaAudio.onended = () => resolve();
    tanyaAudio.play().catch(() => resolve());
  });
};

export const stopTanya = () => {
  if (tanyaAudio) {
    tanyaAudio.pause();
    tanyaAudio.currentTime = 0;
  }
};

// Track currently playing game audio for cleanup
let currentGameAudio: HTMLAudioElement | null = null;

// Stop all game-related audio (for exit cleanup)
export const stopAllGameAudio = () => {
  if (tanyaAudio) {
    tanyaAudio.pause();
    tanyaAudio.currentTime = 0;
  }
  if (currentGameAudio) {
    currentGameAudio.pause();
    currentGameAudio.currentTime = 0;
    currentGameAudio = null;
  }
  stopKillSounds();
};

// Play kill.mp3 for dare
export const playKill1 = (): Promise<void> => {
  return new Promise((resolve) => {
    const audio = new Audio('/audio/kill.mp3');
    currentGameAudio = audio;
    audio.volume = 1.0;
    audio.onended = () => { currentGameAudio = null; resolve(); };
    audio.onerror = () => { currentGameAudio = null; resolve(); };
    audio.play().catch(() => { currentGameAudio = null; resolve(); });
  });
};

// Play kill-2.mp3 for dare
export const playKill2 = (): Promise<void> => {
  return new Promise((resolve) => {
    const audio = new Audio('/audio/kill-2.mp3');
    currentGameAudio = audio;
    audio.volume = 1.0;
    audio.onended = () => { currentGameAudio = null; resolve(); };
    audio.onerror = () => { currentGameAudio = null; resolve(); };
    audio.play().catch(() => { currentGameAudio = null; resolve(); });
  });
};

// Play alfred-intro.mp3 for hitchcock ending
export const playHitchcock = (): Promise<void> => {
  return new Promise((resolve) => {
    const hitchcock = new Audio('/audio/alfred-intro.mp3');
    currentGameAudio = hitchcock;
    hitchcock.volume = masterVolume;
    hitchcock.loop = false;
    hitchcock.onended = () => { currentGameAudio = null; resolve(); };
    hitchcock.onerror = () => { currentGameAudio = null; resolve(); };
    hitchcock.play().catch(() => { currentGameAudio = null; resolve(); });
  });
};

// Duck music significantly for game modes (narration)
export const duckForGame = () => {
  if (isGameDucked) return;
  isGameDucked = true;

  const allAudio = [buffaloAudio, snipAudio, musicBoxAudio, pianoAudio, alfredAudio].filter(a => a);
  const targetVol = masterVolume * GAME_DUCKED_VOLUME;

  allAudio.forEach(audio => {
    if (audio) audio.volume = targetVol;
  });
};

export const unduckForGame = () => {
  if (!isGameDucked) return;
  isGameDucked = false;

  const allAudio = [buffaloAudio, snipAudio, musicBoxAudio, pianoAudio, alfredAudio].filter(a => a);
  const targetVol = masterVolume * originalMusicVolume;

  allAudio.forEach(audio => {
    if (audio) audio.volume = targetVol;
  });
};

let musicPaused = false;

export const toggleMusicBox = (enabled: boolean) => {
  if (enabled) {
    musicPaused = false;
    if (currentSequenceAudio) {
      // Resume current track
      currentSequenceAudio.play().catch(() => {});
    } else {
      // Start fresh sequence
      startAudioSequence();
    }
  } else {
    // Pause all tracks
    musicPaused = true;
    if (buffaloAudio) buffaloAudio.pause();
    if (snipAudio) snipAudio.pause();
    if (musicBoxAudio) musicBoxAudio.pause();
    if (pianoAudio) pianoAudio.pause();
    if (alfredAudio) alfredAudio.pause();
  }
};

export const isMusicPlaying = () => {
  return currentSequenceAudio && !currentSequenceAudio.paused;
};

// Stop all music tracks
const stopAllTracks = () => {
  [buffaloAudio, snipAudio, musicBoxAudio, pianoAudio, alfredAudio].forEach(audio => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  });
};

// Track index for skip rotation - starts at -1 so first skip gives musicBox
let skipTrackIndex = -1;

// Skip to next track in rotation
export const skipToNextTrack = () => {
  stopAllTracks();

  // Cycle through looping tracks only: musicBox → piano (alfred reserved for hitchcock ending)
  const playableTracks = [musicBoxAudio, pianoAudio];
  const trackNames = ['Music Box', 'Piano'];

  skipTrackIndex = (skipTrackIndex + 1) % playableTracks.length;
  const nextTrack = playableTracks[skipTrackIndex];

  if (nextTrack) {
    currentSequenceAudio = nextTrack;
    nextTrack.currentTime = 0;
    const targetVol = isGameDucked ? masterVolume * GAME_DUCKED_VOLUME : masterVolume * originalMusicVolume;
    nextTrack.volume = targetVol;
    nextTrack.play().catch(() => {});
    musicPaused = false;
  }

  return trackNames[skipTrackIndex];
};

// Legacy alias
export const skipToMusicBox = skipToNextTrack;

// Play kill sound for candle lighting scare
export const playScreamFile = (): Promise<void> => {
  return new Promise((resolve) => {
    const audio = new Audio('/audio/kill.mp3');
    audio.volume = 1.0;
    audio.onended = () => resolve();
    audio.onerror = () => resolve();
    audio.play().catch(() => resolve());
  });
};

// Candle light sound effect (match strike / flame ignite)
export const playCandleLight = () => {
  const ctx = getCtx();
  if (!ctx) return;

  const now = ctx.currentTime;

  // Match strike noise burst
  const bufferSize = ctx.sampleRate * 0.15;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.value = 2000;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.15, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

  noise.connect(filter);
  filter.connect(gain);
  const master = getMasterGain();
  gain.connect(master || ctx.destination);
  noise.start(now);
};

// Kill sounds - cycle through kill.mp3, kill-2.mp3 sequentially (never repeat)
export const startKillSounds = () => {
  if (killSoundsEnabled) return;
  killSoundsEnabled = true;
  lastKillIndex = -1;

  const scheduleNextKill = () => {
    if (!killSoundsEnabled) return;

    // Wait 15-30 seconds before next sound
    const delay = 15000 + Math.random() * 15000;
    killTimeout = setTimeout(() => {
      if (!killSoundsEnabled) return;
      playNextKillSound();
    }, delay);
  };

  const playNextKillSound = () => {
    if (!killSoundsEnabled) return;

    const killSounds = [killAudio1, killAudio2];

    // Cycle through sequentially: 0 → 1 → 0 → 1...
    lastKillIndex = (lastKillIndex + 1) % 2;
    const audio = killSounds[lastKillIndex];

    if (audio) {
      audio.currentTime = 0;
      audio.volume = masterVolume * 0.6;
      audio.onended = () => {
        if (killSoundsEnabled) scheduleNextKill();
      };
      audio.play().catch(() => {
        if (killSoundsEnabled) scheduleNextKill();
      });
    } else {
      scheduleNextKill();
    }
  };

  // Start first sound after 5-10 seconds
  killTimeout = setTimeout(() => {
    if (killSoundsEnabled) playNextKillSound();
  }, 5000 + Math.random() * 5000);
};

export const stopKillSounds = () => {
  killSoundsEnabled = false;
  if (killTimeout) {
    clearTimeout(killTimeout);
    killTimeout = null;
  }
  if (killAudio1) {
    killAudio1.pause();
    killAudio1.currentTime = 0;
  }
  if (killAudio2) {
    killAudio2.pause();
    killAudio2.currentTime = 0;
  }
};

export const playClick = () => {
  const ctx = getCtx();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(800, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.02);

  filter.type = 'lowpass';
  filter.frequency.value = 600;

  gain.gain.setValueAtTime(0.08, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);

  osc.connect(filter);
  filter.connect(gain);
  const master = getMasterGain();
  gain.connect(master || ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.03);
};

export const playStaticSound = (durationMs: number = 2000) => {
  const ctx = getCtx();
  if (!ctx) return;

  const bufferSize = ctx.sampleRate * (durationMs / 1000);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 1000;
  filter.Q.value = 0.5;

  const gain = ctx.createGain();
  gain.gain.value = 0.12;

  noise.connect(filter);
  filter.connect(gain);
  const master = getMasterGain();
  gain.connect(master || ctx.destination);
  noise.start();
};

export const playCreepyLaugh = () => {
  const ctx = getCtx();
  if (!ctx) return;

  const now = ctx.currentTime;
  const laughCount = 3 + Math.floor(Math.random() * 3);

  for (let i = 0; i < laughCount; i++) {
    const startTime = now + i * 0.25;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    const baseFreq = 350 - i * 30 + Math.random() * 20;
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(baseFreq, startTime);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.7, startTime + 0.15);

    filter.type = 'bandpass';
    filter.frequency.value = 800 + Math.random() * 400;
    filter.Q.value = 2;

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.15, startTime + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);

    osc.connect(filter);
    filter.connect(gain);
    const master = getMasterGain();
    gain.connect(master || ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + 0.25);
  }
};

export const playWhisper = () => {
  const ctx = getCtx();
  if (!ctx) return;

  const now = ctx.currentTime;
  const duration = 1.5;

  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1);
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 1500;
  filter.Q.value = 3;

  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.frequency.value = 8;
  lfoGain.gain.value = 300;
  lfo.connect(lfoGain);
  lfoGain.connect(filter.frequency);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.08, now + 0.2);
  gain.gain.linearRampToValueAtTime(0.08, now + duration - 0.3);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  noise.connect(filter);
  filter.connect(gain);
  const whisperMaster = getMasterGain();
  gain.connect(whisperMaster || ctx.destination);

  lfo.start(now);
  noise.start(now);
  lfo.stop(now + duration);
};

export const playScream = () => {
  const ctx = getCtx();
  if (!ctx) return;

  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(800, now);
  osc.frequency.exponentialRampToValueAtTime(200, now + 1.5);

  filter.type = 'bandpass';
  filter.frequency.value = 1200;
  filter.Q.value = 5;

  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.08, now + 0.1);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

  osc.connect(filter);
  filter.connect(gain);
  const master = getMasterGain();
  gain.connect(master || ctx.destination);

  osc.start(now);
  osc.stop(now + 1.5);
};
