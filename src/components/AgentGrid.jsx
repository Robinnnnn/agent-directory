import React from 'react';
import { friendlyModel, cardCronSummary, isRedacted, isPending } from '../helpers';

export function AgentGrid({ agents, selectedId, onSelect, introCycle }) {
  if (!agents.length) {
    return (
      <main className="flex-1 px-4 py-5 md:h-full md:overflow-y-auto md:px-5">
        <div className="rounded border border-[rgba(148,163,184,0.2)] p-4 text-xs text-slate-400">
          no agents match current filters
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 px-4 py-5 md:h-full md:overflow-y-auto md:px-5">
      <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 xl:grid-cols-3">
        {agents.map((agent, index) => {
          const active = agent.id === selectedId;
          const redacted = isRedacted(agent);
          const pending = isPending(agent);
          return (
            <button
              key={`${agent.id}-${introCycle}`}
              style={{ '--delay': `${Math.min(index * 38, 280)}ms` }}
              onClick={() => onSelect(agent.id)}
              className={`intro-seq relative w-full h-full rounded-lg border p-3.5 text-left transition duration-150 ease-out flex flex-col ${
                active
                  ? 'selected-card'
                  : 'border-border glass hover:-translate-y-0.5 hover:border-slate-400/40'
              } ${redacted ? 'opacity-60' : ''} ${pending ? 'opacity-70' : ''}`}
            >
              {active && <span className="trace-lite" aria-hidden="true" />}

              {redacted && (
                <span className="absolute right-3.5 top-3.5 badge-mono inline-flex items-center rounded-full border border-amber-300/35 bg-amber-400/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.08em] text-amber-100/85">
                  redacted
                </span>
              )}

              {pending && (
                <span className="absolute right-3.5 top-3.5 badge-mono inline-flex items-center rounded-full border border-yellow-300/35 bg-yellow-400/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.08em] text-yellow-100/85">
                  coming soon
                </span>
              )}

              <div className="flex items-center gap-2.5">
                <div className={`flex h-10 w-10 items-center justify-center rounded-md text-base ${redacted ? 'blur-sm' : ''}`}>
                  {agent.emoji}
                </div>
                <div>
                  <div className={`text-xs font-semibold ${active ? 'text-slate-50' : 'text-slate-100'} ${redacted ? 'blur-sm select-none' : ''}`}>{agent.name}</div>
                  <div className={`text-xs ${active ? 'text-slate-300' : 'text-slate-400'} ${redacted ? 'blur-sm select-none' : ''}`}>{agent.role?.toLowerCase?.() ?? agent.role}</div>
                </div>
              </div>

              {!redacted && (
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="badge-mono rounded border border-indigo-400/40 bg-indigo-500/20 px-2 py-0.5 text-[10px] text-indigo-200">
                    {friendlyModel(agent.model)}
                  </span>
                </div>
              )}

              <p className={`mt-3 flex-1 pb-4 text-xs leading-relaxed text-slate-300 ${redacted ? 'blur-sm select-none' : ''}`}>
                {agent.description?.toLowerCase?.() ?? agent.description}
                {agent.todo && <span className="mt-2 block text-slate-400">TODO: {agent.todo?.toLowerCase?.() ?? agent.todo}</span>}
              </p>

              <div className="mt-auto pt-4 border-t border-slate-700/70">
                <div className={`badge-mono text-[10px] ${redacted ? 'text-slate-500 blur-sm select-none' : (active ? 'text-cyan-100' : 'text-cyan-200/90')}`}>
                  {cardCronSummary(agent)}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </main>
  );
}
