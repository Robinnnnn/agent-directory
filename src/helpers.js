export const modelLabels = {
  'claude-opus-4-6': 'opus-4.6',
  'gemini-3.1-pro': 'gemini-3.1-pro',
  'gpt-5.3-codex': 'codex-5.3'
};

export function friendlyModel(model) {
  return modelLabels[model] || model;
}

export function getActiveCrons(list) {
  return list.reduce((sum, a) => sum + (a.crons?.length || 0), 0);
}

export function cardCronSummary(agent) {
  if (!agent.crons?.length) return agent.status === 'pending' ? 'tbd' : 'no scheduled jobs';
  if (agent.crons.length === 1) return agent.crons[0].schedule;
  return `${agent.crons[0].schedule} +${agent.crons.length - 1}`;
}

export function isRedacted(agent) {
  return agent.isRedacted === true;
}

export function scrubAgent(agent) {
  if (!agent.isRedacted) return agent;
  return {
    ...agent,
    name: 'redacted agent',
    role: 'coming soon',
    description: 'this agent is currently under development and will be available in a future update.',
    model: 'undisclosed',
    provider: 'undisclosed',
    crons: agent.crons?.length
      ? [{ name: 'redacted', schedule: 'scheduled', description: 'automated task details hidden' }]
      : [],
  };
}

export function statusTone(status) {
  if (status === 'error') return ['text-rose-300', 'bg-rose-400'];
  if (status === 'paused') return ['text-amber-300', 'bg-amber-400'];
  if (status === 'pending') return ['text-yellow-300', 'bg-yellow-400'];
  return ['text-emerald-300', 'bg-emerald-400'];
}

export function isPending(agent) {
  return agent.status === 'pending';
}
