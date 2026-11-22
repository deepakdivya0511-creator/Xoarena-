let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') {
    return null;
  }
  const AudioContextClass =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) {
    return null;
  }
  if (!audioCtx) {
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    void audioCtx.resume();
  }
  return audioCtx;
}

function playTone(
  frequency: number,
  durationMs: number,
  type: OscillatorType = 'sine',
  volume = 0.08,
  delayMs = 0
): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const startTime = ctx.currentTime + delayMs / 1000;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, startTime);

    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.exponentialRampToValueAtTime(volume, startTime + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + durationMs / 1000);

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    oscillator.start(startTime);
    oscillator.stop(startTime + durationMs / 1000 + 0.02);
  } catch {
    // Ignore audio errors if blocked by browser autoplay policy
  }
}

export function playMarkSound(player: 'X' | 'O', enabled: boolean): void {
  if (!enabled) return;
  if (player === 'X') {
    playTone(520, 70, 'triangle', 0.07, 0);
    playTone(640, 60, 'triangle', 0.05, 55);
  } else {
    playTone(410, 95, 'sine', 0.07, 0);
  }
}

export function playWinSound(enabled: boolean): void {
  if (!enabled) return;
  playTone(523.25, 120, 'triangle', 0.08, 0);
  playTone(659.25, 120, 'triangle', 0.08, 95);
  playTone(783.99, 220, 'triangle', 0.09, 190);
}

export function playLossSound(enabled: boolean): void {
  if (!enabled) return;
  playTone(392, 140, 'sine', 0.07, 0);
  playTone(329.63, 160, 'sine', 0.07, 130);
  playTone(261.63, 240, 'sine', 0.06, 270);
}

export function playDrawSound(enabled: boolean): void {
  if (!enabled) return;
  playTone(440, 100, 'sine', 0.06, 0);
  playTone(440, 120, 'sine', 0.05, 130);
}
