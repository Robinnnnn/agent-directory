import React from 'react';
import { Drawer } from 'vaul';
import { friendlyModel, isRedacted } from '../helpers';

export function AgentDrawer({ agent, open, onOpenChange }) {
  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/60 z-40" />
        <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 flex flex-col rounded-t-2xl bg-[#0b1020] border-t border-slate-700/70 max-h-[85vh]">
          {/* Drag handle */}
          <div className="mx-auto mt-3 mb-2 h-1 w-10 rounded-full bg-slate-600/80" />

          {agent && <DrawerBody agent={agent} />}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

function DrawerBody({ agent }) {
  const redacted = isRedacted(agent);
  const blur = redacted ? 'blur-sm select-none' : '';

  const cronRows = agent.crons?.length ? (
    agent.crons.map((cron, i) => (
      <div key={i} className="rounded border border-slate-700/70 bg-slate-900/60 p-2.5">
        <div className={`badge-mono text-xs text-cyan-200 ${blur}`}>{cron.schedule}</div>
        <div className={`mt-1 text-xs text-slate-300 ${blur}`}>{cron.description}</div>
      </div>
    ))
  ) : (
    <div className={`text-xs text-slate-400 ${blur}`}>no scheduled jobs</div>
  );

  return (
    <div className="overflow-y-auto overscroll-contain pb-8">
      {/* Sticky header */}
      <div className="sticky top-0 z-10 border-b border-[#262626] bg-[#0b1020] px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className={`flex h-8 w-8 items-center justify-center rounded-md text-base ${redacted ? 'blur-sm' : ''}`}>{agent.emoji}</div>
          <div>
            <div className={`font-semibold ${redacted ? 'text-slate-400' : 'text-slate-100'} ${blur}`}>{agent.name}</div>
            <div className={`text-xs text-slate-400 ${blur}`}>{agent.role?.toLowerCase?.() ?? agent.role}</div>
          </div>
        </div>
      </div>

      <div className="space-y-5 p-5">
        <section>
          <div className="mb-2 text-[11px] font-semibold tracking-wide text-slate-400">brain</div>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between"><span className="text-slate-400">model</span><span className={`badge-mono text-slate-100 ${blur}`}>{friendlyModel(agent.model)}</span></div>
            <div className="flex items-center justify-between"><span className="text-slate-400">provider</span><span className={`badge-mono text-slate-100 ${blur}`}>{agent.provider}</span></div>
            <div className="flex items-center justify-between"><span className="text-slate-400">created</span><span className={`text-slate-200 ${blur}`}>{agent.createdAt}</span></div>
          </div>
        </section>

        <section>
          <div className="mb-2 text-[11px] font-semibold tracking-wide text-slate-400">overview</div>
          <p className={`text-xs leading-relaxed text-slate-300 ${blur}`}>{agent.description?.toLowerCase?.() ?? agent.description}</p>
        </section>

        <section>
          <div className="mb-2 text-[11px] font-semibold tracking-wide text-slate-400">automation</div>
          <div className="space-y-2">{cronRows}</div>
        </section>
      </div>
    </div>
  );
}
