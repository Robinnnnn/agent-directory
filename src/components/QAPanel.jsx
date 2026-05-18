import React from 'react';
import { Drawer } from 'vaul';
import { QAContent } from './QAContent';
import { VoiceEasterEggBar } from './VoiceEasterEggBar';

export function QASidebar({ onVoiceTrigger, isVoicePlaying }) {
  return (
    <aside className="w-full border-t border-[#262626] bg-[#0b1020] md:h-full md:w-[360px] md:overflow-y-auto md:border-l md:border-t-0">
      <div className="border-b border-[#262626] px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-md text-base">
            <span className="material-symbols-outlined !text-[24px] text-slate-400">support_agent</span>
          </div>
          <div>
            <div className="font-semibold text-slate-100">Q&A</div>
            <div className="text-xs text-slate-400">common questions</div>
          </div>
        </div>
      </div>
      <QAContent onVoiceTrigger={onVoiceTrigger} isVoicePlaying={isVoicePlaying} />
    </aside>
  );
}

export function QADrawer({
  open,
  onOpenChange,
  onVoiceTrigger,
  isVoicePlaying,
  showVoiceBar,
  voiceProgress,
  voiceCurrentTime,
  voiceDuration,
  onToggleVoicePlay,
  onDismissVoice,
}) {
  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/60 z-40" />
        <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 flex h-[85dvh] flex-col rounded-t-2xl border-t border-slate-700/70 bg-[#0b1020]">
          <div className="mx-auto mt-3 mb-2 h-1 w-10 rounded-full bg-slate-600/80" />
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-20">
            <div className="sticky top-0 z-10 border-b border-[#262626] bg-[#0b1020] px-5 py-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-md text-base">
                  <span className="material-symbols-outlined !text-[24px] text-slate-400">support_agent</span>
                </div>
                <div>
                  <div className="font-semibold text-slate-100">Q&A</div>
                  <div className="text-xs text-slate-400">common questions</div>
                </div>
              </div>
            </div>
            <QAContent onVoiceTrigger={onVoiceTrigger} isVoicePlaying={isVoicePlaying} />
          </div>
          <VoiceEasterEggBar
            visible={showVoiceBar}
            progress={voiceProgress}
            isPlaying={isVoicePlaying}
            currentTime={voiceCurrentTime}
            duration={voiceDuration}
            onTogglePlay={onToggleVoicePlay}
            onDismiss={onDismissVoice}
          />
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
