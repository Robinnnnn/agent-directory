import React from 'react';

function fmt(sec) {
  if (!Number.isFinite(sec) || sec < 0) return '0:00';
  const whole = Math.floor(sec);
  const m = Math.floor(whole / 60);
  const s = whole % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function ControlButton({ onClick, label, icon, iconStyle }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-10 w-10 items-center justify-center rounded-[11px] border border-slate-600/80 bg-[rgba(16,24,48,0.88)] text-slate-300 transition hover:border-cyan-400/60 hover:text-cyan-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70"
      aria-label={label}
      title={label}
    >
      <span className="material-symbols-outlined text-[19px] leading-none" style={iconStyle}>{icon}</span>
    </button>
  );
}

export function VoiceEasterEggBar({
  visible,
  progress,
  isPlaying,
  currentTime,
  duration,
  onTogglePlay,
  onDismiss,
}) {
  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-[70] transform border-t border-slate-700/80 bg-[#0b1020]/96 backdrop-blur transition-transform duration-300 ease-in-out ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 8px)' }}
      aria-hidden={!visible}
    >
      <div className="h-[4px] w-full rounded-full bg-slate-800/90">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.45)] transition-[width] duration-150 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex h-[58px] items-center justify-between px-4">
        <div className="badge-mono tabular-nums text-xs text-slate-400">
          {fmt(currentTime)} / {fmt(duration)}
        </div>

        <div className="flex items-center gap-2">
          <ControlButton
            onClick={onTogglePlay}
            label={isPlaying ? 'pause audio clip' : 'play audio clip'}
            icon={isPlaying ? 'pause' : 'play_arrow'}
            iconStyle={isPlaying ? undefined : { fontVariationSettings: "'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 20" }}
          />
          <ControlButton
            onClick={onDismiss}
            label="dismiss voice player"
            icon="close"
            iconStyle={{ fontVariationSettings: "'FILL' 0, 'wght' 500, 'GRAD' 0, 'opsz' 20" }}
          />
        </div>
      </div>
    </div>
  );
}
