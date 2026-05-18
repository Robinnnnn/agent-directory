import React, { useEffect } from 'react';
import { friendlyModel, cardCronSummary, statusTone, isRedacted, isPending } from '../helpers';

export function AgentList({ agents, selectedId, onSelect, introCycle }) {
  // Keyboard navigation
  useEffect(() => {
    const handler = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;
      const idx = agents.findIndex((a) => a.id === selectedId);
      if (e.key === 'ArrowDown' && idx < agents.length - 1) { e.preventDefault(); onSelect(agents[idx + 1].id); }
      if (e.key === 'ArrowUp' && idx > 0) { e.preventDefault(); onSelect(agents[idx - 1].id); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [agents, selectedId, onSelect]);

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
      <div className="space-y-1.5">
        {agents.map((agent, index) => {
          const active = agent.id === selectedId;
          const redacted = isRedacted(agent);
          const pending = isPending(agent);
          const statusLabel = pending ? 'pending' : 'ok';
          const [textColor, bgColor] = statusTone(statusLabel);
          const hasCrons = Boolean(agent.crons?.length);

          return (
            <button
              key={`${agent.id}-${introCycle}`}
              style={{ '--delay': `${Math.min(index * 38, 280)}ms` }}
              onClick={() => onSelect(agent.id)}
              className={`intro-seq group relative flex w-full items-center gap-3 rounded-md border px-3 py-2 text-left transition duration-150 ease-out min-h-[68px] ${
                active
                  ? 'selected-card'
                  : 'border-[rgba(148,163,184,0.2)] bg-transparent hover:bg-[rgba(24,36,68,0.65)]'
              } ${redacted ? 'opacity-60' : ''}`}
            >
              {active && <span className="trace-lite" aria-hidden="true" />}

              <div className="min-w-0 flex flex-1 items-center gap-2.5">
                <div className={`flex h-8 w-8 items-center justify-center rounded-md bg-slate-900/70 text-sm ${redacted ? 'blur-sm' : ''}`}>
                  {agent.emoji}
                </div>
                <div className="min-w-0">
                  <div className={`truncate text-[14px] font-semibold ${active ? 'text-slate-50' : 'text-slate-100'} ${redacted ? 'blur-sm select-none' : ''}`}>{agent.name}</div>
                  <div className={`truncate text-[12px] ${active ? 'text-slate-300' : 'text-slate-400'} ${redacted ? 'blur-sm select-none' : ''}`}>{agent.role?.toLowerCase?.() ?? agent.role}</div>
                  {hasCrons && (
                    <div className={`truncate text-[11px] text-cyan-200/90 md:hidden ${redacted ? 'blur-sm select-none' : ''}`}>{cardCronSummary(agent)}</div>
                  )}
                </div>
              </div>

              <div className="hidden md:grid grid-cols-[148px_104px_12px] items-center justify-items-end gap-1.5 shrink-0">
                <div className={`badge-mono w-full text-right whitespace-nowrap text-[11px] ${active ? 'text-cyan-100' : 'text-cyan-200/90'}`}>
                  {hasCrons && !redacted ? cardCronSummary(agent) : ''}
                </div>

                {!redacted ? (
                  <span className="badge-mono inline-flex rounded border border-indigo-400/40 bg-indigo-500/20 px-1.5 py-0.5 text-[10px] text-indigo-200 whitespace-nowrap">
                    {friendlyModel(agent.model)}
                  </span>
                ) : (
                  <span className="badge-mono inline-flex rounded-full border border-amber-300/35 bg-amber-400/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.08em] text-amber-100/85 whitespace-nowrap">
                    redacted
                  </span>
                )}

                <div className="flex items-center justify-end">
                  <span className={`h-2 w-2 rounded-full ${bgColor}`} />
                </div>
              </div>

              <div className="md:hidden flex items-center justify-end gap-3 shrink-0">
                {!redacted ? (
                  <span className="badge-mono inline-flex rounded border border-indigo-400/40 bg-indigo-500/20 px-1.5 py-0.5 text-[10px] text-indigo-200 whitespace-nowrap">
                    {friendlyModel(agent.model)}
                  </span>
                ) : (
                  <span className="badge-mono inline-flex rounded-full border border-amber-300/35 bg-amber-400/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.08em] text-amber-100/85 whitespace-nowrap">
                    redacted
                  </span>
                )}
                <span className={`h-2 w-2 rounded-full ${bgColor}`} />
              </div>
            </button>
          );
        })}
      </div>
    </main>
  );
}
