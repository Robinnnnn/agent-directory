import React, { useMemo, useState } from 'react';
import { Drawer } from 'vaul';

function Header({ onCopy, copied }) {
  return (
    <div className="relative flex items-center justify-between gap-2 border-b border-[#262626] px-5 py-4">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-md text-base">
          <span className="material-symbols-outlined !text-[22px] text-slate-400">terminal</span>
        </div>
        <div>
          <div className="font-semibold text-slate-100">llm.txt</div>
          <div className="text-xs text-slate-400">feed this to your agent</div>
        </div>
      </div>

      <button
        onClick={onCopy}
        className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-slate-600/60 bg-[rgba(14,22,40,0.86)] text-slate-300 transition hover:border-slate-500/70 hover:text-slate-100"
        title={copied ? 'copied' : 'copy llm.txt'}
        type="button"
      >
        <span className="material-symbols-outlined text-[18px] leading-none">content_copy</span>
      </button>

      <div
        className={`pointer-events-none absolute right-5 top-[3.35rem] rounded-md border border-emerald-600 bg-emerald-500 px-2.5 py-1 text-[11px] font-medium text-emerald-950 shadow-sm shadow-emerald-900/30 transition-all duration-180 ${
          copied ? 'translate-y-0 opacity-100' : '-translate-y-1 opacity-0'
        }`}
      >
        copied to clipboard
      </div>
    </div>
  );
}

function LLMBody({ content }) {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto p-5">
      <pre className="whitespace-pre-wrap break-words text-[12px] leading-relaxed text-slate-300">
        {content || 'loading llm.txt...'}
      </pre>
    </div>
  );
}

function useCopy(content) {
  const [copied, setCopied] = useState(false);

  const onCopy = useMemo(() => async () => {
    if (!content) return;
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1900);
    } catch {
      setCopied(false);
    }
  }, [content]);

  return { copied, onCopy };
}

export function LLMSidebar({ content }) {
  const { copied, onCopy } = useCopy(content);

  return (
    <aside className="w-full border-t border-[#262626] bg-[#0b1020] md:h-full md:w-[360px] md:border-l md:border-t-0 md:flex md:flex-col">
      <Header copied={copied} onCopy={onCopy} />
      <LLMBody content={content} />
    </aside>
  );
}

export function LLMDrawer({ open, onOpenChange, content }) {
  const { copied, onCopy } = useCopy(content);

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/60 z-40" />
        <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 flex h-[85dvh] flex-col rounded-t-2xl border-t border-slate-700/70 bg-[#0b1020]">
          <div className="mx-auto mt-3 mb-2 h-1 w-10 rounded-full bg-slate-600/80" />
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
            <div className="sticky top-0 z-10 bg-[#0b1020]">
              <Header copied={copied} onCopy={onCopy} />
            </div>
            <LLMBody content={content} />
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
