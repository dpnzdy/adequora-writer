import { config } from './config.mjs';

export function policyStatus(id) {
  const status = config.policies[id]?.status ?? 'draft';
  if (!['draft', 'final'].includes(status)) throw new Error(`Unknown policy status for ${id}`);
  return status;
}
