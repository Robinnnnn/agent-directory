import React, { useState } from 'react';

function VoiceExampleTrigger({ onPress }) {
  return (
    <button
      type="button"
      onClick={onPress}
      className="inline-flex min-h-[44px] items-center rounded-md px-2 text-[11px] font-medium text-cyan-300 transition hover:text-cyan-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70"
      aria-label="play voice example"
    >
      ▶ hear an example
    </button>
  );
}

const QA_ITEMS = ({ onVoiceTrigger }) => [
  {
    question: 'What am I looking at?',
    answer: (
      <>
        This is Robin's personal directory of AI agents running on OpenClaw. Originally built to answer the perennial question: <em>"How do you use AI?"</em>
        <br /><br />
        Each agent has its own personality and handles various aspects of my life – mostly the boring stuff. You can assign them voices too; my banker has an old British accent thanks to{' '}
        <a href="https://elevenlabs.io" target="_blank" rel="noopener noreferrer" className="text-cyan-300 underline underline-offset-2">
          ElevenLabs
        </a>
        .
        <br />
        <VoiceExampleTrigger onPress={onVoiceTrigger} />
        <br />
        Ultimately this is just a big experiment and perhaps, at the end of it all, the correct number of agents will be zero.
      </>
    ),
  },
  {
    question: "Isn't this overkill?",
    answer: (
      <>
        Honestly? My wife certainly thinks so. And in most cases she's right. You don't want to create unnecessary maintenance overhead for yourself.
        <br /><br />
        A few areas where I've found it helpful:
        <br /><br />
        <strong className="text-slate-300">1. Context Management:</strong> A single agent's workspace can get bloated and inject every new conversation with irrelevant context. Helps to compartmentalize.
        <br /><br />
        <strong className="text-slate-300">2. Token Efficiency:</strong> Lowkey agents can use lowkey models (saving on tokens). No offense to my HVAC maintenance bot.
        <br /><br />
        <strong className="text-slate-300">3. Group Chats:</strong> You can assign specific agents to shared threads. For example, our vet agent is in a group chat with my wife, and she's able to query it for documents whenever she needs (she's definitely not just humoring me).
        <br /><br />
        <strong className="text-slate-300">4. Personas:</strong> Assigning unique personalities to different agents is mildly entertaining and a helpful learning experience to see where certain models shine.
      </>
    ),
  },
  {
    question: 'How do I add multiple agents?',
    answer: (
      <>
        Assuming you've already onboarded to{' '}
        <a href="https://openclaw.com" target="_blank" rel="noopener noreferrer" className="text-cyan-300 underline underline-offset-2">
          OpenClaw
        </a>
        , simply ask your main agent to create a new one!
        <br /><br />
        It's akin to having your executive assistant provide an office tour for the new employee, and explaining how you like your coffee.
        <br /><br />
        Each agent is assigned its own workspace and identity files (SOUL.md, memory, etc.). The key is to scope it well with ownership over a clear domain.
        <br /><br />
        In order to avoid repeating your same preferences and commands to the new agent, you can have your main one generate a welcome doc to pass on.
      </>
    ),
  },
  {
    question: 'Tips & common pitfalls',
    answer: (
      <>
        <strong className="text-slate-300">Start small.</strong> Don't just Cmd+A Cmd+C Cmd+V this site and have your bot go to town. Most of my agents will be pretty useless.
        <br /><br />
        <strong className="text-slate-300">Ideas will come with time.</strong> Just do your thing on one thread until it starts feeling heavy.
        <br /><br />
        <strong className="text-slate-300">Lean on your main.</strong> They will coordinate onboarding and maintenance. Have them document a directory of bots and their roles in your system. You can also{' '}
        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-cyan-300 underline underline-offset-2">
          fork this repo
        </a>
        .
        <br /><br />
        <strong className="text-slate-300">Don't automate too early.</strong> I'd initially set up too many cron jobs, and every morning became a puddle of spam that I mostly ignored. You can also wait until the year 2056 when OpenClaw will finally manage to do stuff with cron.
        <br /><br />
        <strong className="text-slate-300">Watch for token bloat.</strong> More agents + more crons + more context can run up your bill. There will soon be tools to stay on top of this.
      </>
    ),
  },
  {
    question: "Don't forget your role in society",
    answer: (
      <>
        Relying on your bot to automate responses to your wife is a fast track to being relegated to the couch. You can learn this the easy way or the hard way.
      </>
    ),
  },
];

export function QAContent({ onVoiceTrigger }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="space-y-5 p-5">
      <section>
        <div className="space-y-2">
          {QA_ITEMS({ onVoiceTrigger }).map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className={`relative w-full rounded border bg-slate-900/60 p-[0.65rem] text-left transition ${
                  isOpen ? 'border-cyan-300/30' : 'border-slate-700/70 hover:border-slate-600/70'
                }`}
              >
                {isOpen && <span className="trace-lite trace-lite--qa" aria-hidden="true" />}

                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="-m-[0.65rem] flex w-[calc(100%+1.3rem)] items-center justify-between gap-2 rounded p-[0.65rem] leading-none"
                >
                  <span className="text-xs font-medium leading-none text-slate-200">{item.question}</span>
                  <span className="material-symbols-outlined text-[14px] text-slate-500 transition" style={{ transform: isOpen ? 'rotate(180deg)' : '' }}>
                    expand_more
                  </span>
                </button>
                {isOpen && (
                  <div
                    className="mt-4 cursor-pointer text-xs leading-relaxed text-slate-400"
                    onClick={(e) => {
                      if (e.target.closest('a, button')) return;
                      setOpenIndex(null);
                    }}
                  >
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
