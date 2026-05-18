import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { AgentGrid } from './components/AgentGrid';
import { AgentList } from './components/AgentList';
import { AgentDetails } from './components/AgentDetails';
import { AgentDrawer } from './components/AgentDrawer';
import { QASidebar, QADrawer } from './components/QAPanel';
import { LLMSidebar, LLMDrawer } from './components/LLMPanel';
import { VoiceEasterEggBar } from './components/VoiceEasterEggBar';
import { Footer } from './components/Footer';
import llmTextContent from './content/llm.txt?raw';
import { useIsMobile } from './useIsMobile';
import { useIntroCycle } from './useIntroCycle';

const STORAGE_KEY = 'agent-roster:view-mode';

function getInitialViewMode() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'grid' || saved === 'list') return saved;

  if (window.matchMedia('(max-width: 768px)').matches) return 'list';
  return 'grid';
}

function getInitialRoute() {
  const segment = window.location.pathname.replace(/^\/+|\/+$/g, '');
  const route = segment.toLowerCase();

  if (!segment) return {
    showQA: false, showLLM: false, selectedId: null, isRoot: true,
  };
  if (route === 'qa') return {
    showQA: true, showLLM: false, selectedId: null, isRoot: false,
  };
  if (route === 'llm.txt') return {
    showQA: false, showLLM: true, selectedId: null, isRoot: false,
  };

  return {
    showQA: false, showLLM: false, selectedId: decodeURIComponent(segment), isRoot: false,
  };
}

export default function App() {
  const initialRoute = getInitialRoute();
  const [agents, setAgents] = useState([]);
  const [error, setError] = useState(null);
  const [selectedId, setSelectedId] = useState(() => initialRoute.selectedId);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [viewMode, setViewMode] = useState(getInitialViewMode);
  const [filterCrons, setFilterCrons] = useState(false);
  const [showQA, setShowQA] = useState(() => initialRoute.showQA);
  const [showLLM, setShowLLM] = useState(() => initialRoute.showLLM);
  const [llmText, setLlmText] = useState('');
  const [showVoiceBar, setShowVoiceBar] = useState(false);
  const [voicePlaying, setVoicePlaying] = useState(false);
  const [voiceProgress, setVoiceProgress] = useState(0);
  const [voiceCurrentTime, setVoiceCurrentTime] = useState(0);
  const [voiceDuration, setVoiceDuration] = useState(19);
  const voiceAudioRef = useRef(null);
  const voiceDismissTimerRef = useRef(null);
  const voiceTickRef = useRef(null);
  const qaCloseTimerRef = useRef(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    fetch('/agents.json')
      .then((r) => { if (!r.ok) throw new Error(`${r.status}`); return r.json(); })
      .then((data) => {
        setAgents(data);

        const defaultDesktopQA = initialRoute.isRoot && !isMobile;
        if (defaultDesktopQA) {
          setShowQA(true);
          setShowLLM(false);
          return;
        }

        if (!initialRoute.showQA && !initialRoute.showLLM) {
          setSelectedId((prev) => (prev ?? data[0]?.id ?? null));
        }
      })
      .catch((e) => setError(e.message));
  }, []);

  useEffect(() => {
    setLlmText(llmTextContent);
  }, []);

  useEffect(() => {
    const audio = voiceAudioRef.current;
    if (!audio) return undefined;

    const syncProgress = () => {
      const duration = audio.duration || voiceDuration || 0;
      setVoiceCurrentTime(audio.currentTime || 0);
      if (!duration) {
        setVoiceProgress(0);
        return;
      }
      setVoiceProgress((audio.currentTime / duration) * 100);
    };

    const handleLoadedMetadata = () => {
      if (audio.duration && Number.isFinite(audio.duration)) {
        setVoiceDuration(audio.duration);
      }
      syncProgress();
    };

    const handleEnded = () => {
      setVoicePlaying(false);
      setVoiceCurrentTime(audio.duration || voiceDuration);
      setVoiceProgress(100);
      if (voiceDismissTimerRef.current) clearTimeout(voiceDismissTimerRef.current);
      voiceDismissTimerRef.current = setTimeout(() => {
        setShowVoiceBar(false);
        audio.currentTime = 0;
        setVoiceCurrentTime(0);
        setVoiceProgress(0);
      }, 2000);
    };

    const handlePause = () => {
      setVoicePlaying(false);
      syncProgress();
    };
    const handlePlay = () => setVoicePlaying(true);

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', syncProgress);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('play', handlePlay);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', syncProgress);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('play', handlePlay);
    };
  }, []);

  useEffect(() => {
    const audio = voiceAudioRef.current;
    if (!audio || !voicePlaying) {
      if (voiceTickRef.current) clearInterval(voiceTickRef.current);
      return undefined;
    }

    const tick = () => {
      const duration = audio.duration || voiceDuration || 0;
      const current = audio.currentTime || 0;
      setVoiceCurrentTime(current);
      setVoiceProgress(duration ? (current / duration) * 100 : 0);
    };

    tick();
    voiceTickRef.current = setInterval(tick, 80);

    return () => {
      if (voiceTickRef.current) clearInterval(voiceTickRef.current);
    };
  }, [voicePlaying, voiceDuration]);

  useEffect(() => () => {
    if (voiceDismissTimerRef.current) clearTimeout(voiceDismissTimerRef.current);
    if (voiceTickRef.current) clearInterval(voiceTickRef.current);
    if (qaCloseTimerRef.current) clearTimeout(qaCloseTimerRef.current);
    voiceAudioRef.current?.pause();
  }, []);

  // URL sync
  useEffect(() => {
    const url = new URL(window.location.href);
    const nextPath = showQA
      ? '/qa'
      : showLLM
        ? '/llm.txt'
        : (selectedId ? `/${encodeURIComponent(selectedId)}` : '/');

    if (url.pathname === nextPath && !url.search) return;

    url.pathname = nextPath;
    url.search = '';
    window.history.replaceState(null, '', url);
  }, [selectedId, showQA, showLLM]);

  useEffect(() => {
    const handlePopState = () => {
      const route = getInitialRoute();
      setShowQA(route.showQA);
      setShowLLM(route.showLLM);
      setSelectedId(route.selectedId);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (isMobile && (showQA || showLLM)) setDrawerOpen(true);
  }, [isMobile, showQA, showLLM]);

  const introCycle = useIntroCycle(viewMode);
  const visible = filterCrons ? agents.filter((a) => a.crons?.length) : agents;
  const selected = agents.find((a) => a.id === selectedId) || visible[0] || null;

  // Ensure selection is valid within visible list (except when Q&A is active)
  useEffect(() => {
    if (showQA || showLLM) return;
    if (visible.length && !visible.find((a) => a.id === selectedId)) {
      setSelectedId(visible[0].id);
    }
  }, [visible, selectedId, showQA, showLLM]);

  const handleSelect = useCallback((id) => {
    setSelectedId(id);
    setShowQA(false);
    setShowLLM(false);
    setDrawerOpen(true);
  }, []);

  const handleToggleQA = useCallback(() => {
    if (qaCloseTimerRef.current) clearTimeout(qaCloseTimerRef.current);

    setShowQA((v) => {
      if (!v) {
        setShowLLM(false);
        if (isMobile) setDrawerOpen(true);
      }
      return !v;
    });
  }, [isMobile]);

  const handleToggleLLM = useCallback(() => {
    if (qaCloseTimerRef.current) clearTimeout(qaCloseTimerRef.current);

    setShowLLM((v) => {
      if (!v) {
        setShowQA(false);
        if (isMobile) setDrawerOpen(true);
      }
      return !v;
    });
  }, [isMobile]);

  const handlePanelDrawerOpenChange = useCallback((open) => {
    if (qaCloseTimerRef.current) clearTimeout(qaCloseTimerRef.current);

    setDrawerOpen(open);

    if (!open) {
      // Keep drawer mounted briefly so outside-tap close animates smoothly.
      qaCloseTimerRef.current = setTimeout(() => {
        setShowQA(false);
        setShowLLM(false);
      }, 260);
      return;
    }

    if (showLLM) {
      setShowLLM(true);
      setShowQA(false);
      return;
    }

    setShowQA(true);
    setShowLLM(false);
  }, [showLLM]);

  const handleVoiceTrigger = useCallback(() => {
    const audio = voiceAudioRef.current;
    if (!audio) return;

    if (voiceDismissTimerRef.current) clearTimeout(voiceDismissTimerRef.current);
    setShowVoiceBar(true);

    if (audio.paused) {
      if (audio.duration && audio.currentTime >= audio.duration - 0.05) {
        audio.currentTime = 0;
      }
      audio.play().catch(() => {});
      return;
    }

    audio.pause();
  }, []);

  const handleVoiceDismiss = useCallback(() => {
    const audio = voiceAudioRef.current;
    if (!audio) return;

    if (voiceDismissTimerRef.current) clearTimeout(voiceDismissTimerRef.current);
    audio.pause();
    audio.currentTime = 0;
    setVoiceCurrentTime(0);
    setVoiceProgress(0);
    setShowVoiceBar(false);
    setVoicePlaying(false);
  }, []);

  const handleToggleVoicePlay = useCallback(() => {
    const audio = voiceAudioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().catch(() => {});
      return;
    }
    audio.pause();
  }, []);

  const toggleView = useCallback(() => {
    setViewMode((v) => {
      const next = v === 'grid' ? 'list' : 'grid';
      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 text-center text-slate-300">
        <h1 className="text-2xl font-semibold text-slate-100">could not load roster data</h1>
        <p className="mt-3">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex h-[100dvh] flex-col text-slate-100 overflow-hidden">
      <Navbar
        agents={agents}
        viewMode={viewMode}
        filterCrons={filterCrons}
        showQA={showQA}
        showLLM={showLLM}
        onToggleView={toggleView}
        onToggleCrons={() => setFilterCrons((v) => !v)}
        onToggleQA={handleToggleQA}
        onToggleLLM={handleToggleLLM}
      />

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto pb-footer md:flex-row md:overflow-hidden">
        {viewMode === 'grid' ? (
          <AgentGrid agents={visible} selectedId={(showQA || showLLM) ? null : selectedId} onSelect={handleSelect} introCycle={introCycle} />
        ) : (
          <AgentList agents={visible} selectedId={(showQA || showLLM) ? null : selectedId} onSelect={handleSelect} introCycle={introCycle} />
        )}

        {/* Desktop sidebar */}
        {!isMobile && (showQA ? (
          <QASidebar onVoiceTrigger={handleVoiceTrigger} isVoicePlaying={voicePlaying} />
        ) : showLLM ? (
          <LLMSidebar content={llmText} />
        ) : selected && <AgentDetails agent={selected} />)}

        {/* Mobile drawer */}
        {isMobile && (
          showQA
            ? (
              <QADrawer
                open={drawerOpen}
                onOpenChange={handlePanelDrawerOpenChange}
                onVoiceTrigger={handleVoiceTrigger}
                isVoicePlaying={voicePlaying}
                showVoiceBar={showVoiceBar}
                voiceProgress={voiceProgress}
                voiceCurrentTime={voiceCurrentTime}
                voiceDuration={voiceDuration}
                onToggleVoicePlay={handleToggleVoicePlay}
                onDismissVoice={handleVoiceDismiss}
              />
            )
            : showLLM
              ? <LLMDrawer open={drawerOpen} onOpenChange={handlePanelDrawerOpenChange} content={llmText} />
              : <AgentDrawer agent={selected} open={drawerOpen} onOpenChange={setDrawerOpen} />
        )}
      </div>

      <Footer />

      <audio ref={voiceAudioRef} src="/voice-easter-egg.mp3" preload="auto" />
      {!(isMobile && showQA) && (
        <VoiceEasterEggBar
          visible={showVoiceBar}
          progress={voiceProgress}
          isPlaying={voicePlaying}
          currentTime={voiceCurrentTime}
          duration={voiceDuration}
          onTogglePlay={handleToggleVoicePlay}
          onDismiss={handleVoiceDismiss}
        />
      )}
    </div>
  );
}
