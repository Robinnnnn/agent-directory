import React from 'react';
import { getActiveCrons } from '../helpers';

function UtilityButton({ active, onClick, title, children, disabled = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex h-10 w-10 items-center justify-center rounded-[10px] border transition ${
        active
          ? 'border-cyan-300/35 bg-cyan-500/8 text-cyan-100'
          : 'border-slate-600/60 bg-[rgba(14,22,40,0.86)] text-slate-300 hover:border-slate-500/70 hover:text-slate-100'
      } ${disabled ? 'cursor-default opacity-90' : ''}`}
      title={title}
      type="button"
    >
      {children}
    </button>
  );
}

export function Navbar({
  agents,
  viewMode,
  filterCrons,
  showQA,
  showLLM,
  onToggleView,
  onToggleCrons,
  onToggleQA,
  onToggleLLM,
}) {
  return (
    <nav className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-600/70 bg-[linear-gradient(90deg,rgba(7,12,24,0.98),rgba(10,18,34,0.98))] px-4 py-2 shadow-[inset_0_1px_0_rgba(148,163,184,0.06)] md:px-5 md:py-2.5">
      <div className="flex items-center gap-2">
        <div>
          <div className="text-[10px] leading-none tracking-wide text-slate-500">agents</div>
          <div className="mt-1 badge-mono text-xs leading-none">{String(agents.length).padStart(2, '0')}</div>
        </div>
        <div>
          <div className="text-[10px] leading-none tracking-wide text-slate-500">crons</div>
          <div className="mt-1 badge-mono text-xs leading-none text-emerald-300">
            {String(getActiveCrons(agents)).padStart(2, '0')}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <UtilityButton active={showQA} onClick={onToggleQA} title="Q&A">
          <span className="material-symbols-outlined align-middle text-[18px] leading-none">support_agent</span>
        </UtilityButton>

        <UtilityButton active={showLLM} onClick={onToggleLLM} title="llm.txt">
          <span className="material-symbols-outlined align-middle text-[18px] leading-none">terminal</span>
        </UtilityButton>

        <UtilityButton onClick={onToggleView} title="toggle grid/list view">
          <span className="material-symbols-outlined align-middle text-[18px] leading-none">
            {viewMode === 'grid' ? 'list' : 'grid_view'}
          </span>
        </UtilityButton>
      </div>
    </nav>
  );
}
