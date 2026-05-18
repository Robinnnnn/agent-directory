import React from 'react';

const GITHUB_REPO = 'https://github.com/Robinnnnn/agent-directory';
const CONTACT_URL = 'https://robin.salmas.kim/#contact';
const GIT_HASH = typeof __GIT_HASH__ !== 'undefined' ? __GIT_HASH__ : 'dev';

export function Footer() {
  return (
    <footer className="fixed bottom-0 inset-x-0 z-40 flex items-center justify-between border-t border-slate-600/70 bg-[#070c18] px-4 shadow-[inset_0_1px_0_rgba(148,163,184,0.06)] md:px-5 footer-bar">
      <a
        href={GITHUB_REPO}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 py-2 pr-4 badge-mono text-[11px] text-slate-600 transition hover:text-slate-400"
        title={`build ${GIT_HASH}`}
      >
        <span className="relative flex h-[6px] w-[6px]">
          <span className="relative inline-flex h-[6px] w-[6px] rounded-full bg-emerald-400/65" />
        </span>
        {GIT_HASH}
      </a>

      <div className="flex items-center gap-3">
        <a
          href={GITHUB_REPO}
          target="_blank"
          rel="noopener noreferrer"
          className="py-2 text-[11px] text-slate-500 transition hover:text-slate-200"
        >
          view source<svg className="ml-[3px] inline-block h-[11px] w-[11px] -translate-y-[1.5px]" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4.5 11.5 12 4m0 0H5.5M12 4v6.5" /></svg>
        </a>

        <a
          href={CONTACT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="py-2 text-[11px] text-slate-500 transition hover:text-slate-200"
        >
          say hello<svg className="ml-[3px] inline-block h-[11px] w-[11px] -translate-y-[1.5px]" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4.5 11.5 12 4m0 0H5.5M12 4v6.5" /></svg>
        </a>
      </div>
    </footer>
  );
}
