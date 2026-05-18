import React from 'react';
import { friendlyModel, isRedacted } from '../helpers';

export function AgentDetails({ agent }) {
  if (!agent) return null;

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
    <div className={`text-xs text-slate-400 ${blur}`}>{agent.status === 'pending' ? 'tbd' : 'no scheduled jobs'}</div>
  );

  return (
    <aside className="w-full border-t border-[#262626] bg-[#0b1020] md:h-full md:w-[360px] md:overflow-y-auto md:border-l md:border-t-0">
      <div className="border-b border-[#262626] px-5 py-4">
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
          {agent.todo && <p className={`mt-2 text-xs leading-relaxed text-slate-400 ${blur}`}>TODO: {agent.todo?.toLowerCase?.() ?? agent.todo}</p>}
        </section>

        <section>
          <div className="mb-2 text-[11px] font-semibold tracking-wide text-slate-400">automation</div>
          <div className="space-y-2">{cronRows}</div>
        </section>
      </div>
    </aside>
  );
}
